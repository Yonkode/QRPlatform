<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use App\Models\QrScan;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        $qrCodes = QrCode::where('user_id', $userId)->get(['id', 'label', 'type', 'scan_count', 'scan_limit', 'status', 'created_at']);

        $totalQrCodes = $qrCodes->count();
        $totalScans = (int) $qrCodes->sum('scan_count');

        $scansLast30Days = QrScan::whereIn('qr_code_id', $qrCodes->pluck('id'))
            ->where('scanned_at', '>=', now()->subDays(30))
            ->count();

        $nearingLimit = $qrCodes->filter(function (QrCode $qr) {
            if ($qr->scan_limit === null) {
                return false;
            }

            return $qr->status === 'limit_reached' || $qr->scan_count >= $qr->scan_limit * 0.8;
        })->count();

        $recentQrCodes = $qrCodes->sortByDesc('created_at')->take(5)->values();

        $scansByDay = QrScan::whereIn('qr_code_id', $qrCodes->pluck('id'))
            ->where('scanned_at', '>=', now()->subDays(6)->startOfDay())
            ->get(['scanned_at'])
            ->groupBy(fn (QrScan $scan) => $scan->scanned_at->format('Y-m-d'))
            ->map->count();

        $last7Days = collect(range(6, 0))->map(function (int $daysAgo) use ($scansByDay) {
            $date = now()->subDays($daysAgo);
            $key = $date->format('Y-m-d');

            return [
                'date' => $date->translatedFormat('d M'),
                'scans' => $scansByDay->get($key, 0),
            ];
        });

        return Inertia::render('dashboard', [
            'stats' => [
                'totalQrCodes' => $totalQrCodes,
                'totalScans' => $totalScans,
                'scansLast30Days' => $scansLast30Days,
                'nearingLimit' => $nearingLimit,
            ],
            'recentQrCodes' => $recentQrCodes,
            'scansTrend' => $last7Days,
        ]);
    }
}