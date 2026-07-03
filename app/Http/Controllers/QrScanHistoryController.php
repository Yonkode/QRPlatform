<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Gate;

class QrScanHistoryController extends Controller
{
    public function index(Request $request, QrCode $qrCode): Response
    {
        Gate::authorize('view', $qrCode);

        $query = $qrCode->scans()->orderByDesc('scanned_at');

        if ($request->filled('from')) {
            $query->whereDate('scanned_at', '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('scanned_at', '<=', $request->date('to'));
        }

        if ($request->filled('country')) {
            $query->where('country', $request->string('country'));
        }

        if ($request->filled('ip')) {
            $query->where('ip_address', 'like', '%'.$request->string('ip').'%');
        }

        $scans = $query->paginate(20)->withQueryString();

        $availableCountries = $qrCode->scans()
            ->whereNotNull('country')
            ->distinct()
            ->orderBy('country')
            ->pluck('country');

        return Inertia::render('QrCodes/ScanHistory', [
            'qrCode' => $qrCode->only(['id', 'label', 'type', 'scan_count', 'scan_limit', 'status']),
            'scans' => $scans,
            'availableCountries' => $availableCountries,
            'filters' => $request->only(['from', 'to', 'country', 'ip']),
        ]);
    }
}