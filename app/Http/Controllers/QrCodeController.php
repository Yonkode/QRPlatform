<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class QrCodeController extends Controller
{
    public function index(Request $request): Response
    {
        $qrCodes = $request->user()
            ->qrCodes()
            ->latest()
            ->get();

        return Inertia::render('QrCodes/Index', [
            'qrCodes' => $qrCodes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('QrCodes/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:150'],
            'url' => ['required', 'url', 'max:2048'],
            'scan_limit' => ['nullable', 'integer', 'min:1'],
        ]);

        $request->user()->qrCodes()->create([
            'label' => $validated['label'],
            'type' => 'website',
            'mode' => 'dynamic',
            'content' => ['url' => $validated['url']],
            'scan_limit' => $validated['scan_limit'] ?? null,
        ]);

        return redirect()->route('qr-codes.index');
    }

    public function destroy(Request $request, QrCode $qrCode): RedirectResponse
    {
        Gate::authorize('delete', $qrCode);

        $qrCode->delete();

        return redirect()->route('qr-codes.index');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        $request->user()->qrCodes()->whereIn('id', $validated['ids'])->delete();

        return redirect()->route('qr-codes.index');
    }

    public function updateQuota(Request $request, QrCode $qrCode): RedirectResponse
    {
        Gate::authorize('update', $qrCode);

        $validated = $request->validate([
            'scan_limit' => ['nullable', 'integer', 'min:0'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $oldLimit = $qrCode->scan_limit;
        $newLimit = $validated['scan_limit'] ?? null;

        $qrCode->quotaLogs()->create([
            'changed_by' => $request->user()->id,
            'old_limit' => $oldLimit,
            'new_limit' => $newLimit,
            'reason' => $validated['reason'] ?? null,
        ]);

        $qrCode->scan_limit = $newLimit;

        if ($qrCode->status === 'limit_reached' && ($newLimit === null || $newLimit > $qrCode->scan_count)) {
            $qrCode->status = 'active';
        }

        $qrCode->save();

        return redirect()->route('qr-codes.index');
    }
}
