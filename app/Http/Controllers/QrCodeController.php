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
        $query = $request->user()->qrCodes()->with([
            'quotaLogs' => fn ($q) => $q->latest('created_at'),
        ]);

        if ($request->filled('search')) {
            $query->where('label', 'like', '%'.$request->string('search').'%');
        }

        if ($request->filled('type') && $request->string('type') !== 'all') {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('status') && $request->string('status') !== 'all') {
            $query->where('status', $request->string('status'));
        }

        $sort = $request->string('sort', 'created_desc');

        match ((string) $sort) {
            'created_asc' => $query->oldest(),
            'label_asc' => $query->orderBy('label'),
            'label_desc' => $query->orderByDesc('label'),
            'scans_desc' => $query->orderByDesc('scan_count'),
            default => $query->latest(),
        };

        $qrCodes = $query->get();

        $availableTypes = $request->user()->qrCodes()->distinct()->pluck('type');

        return Inertia::render('QrCodes/Index', [
            'qrCodes' => $qrCodes,
            'availableTypes' => $availableTypes,
            'filters' => $request->only(['search', 'type', 'status', 'sort']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('QrCodes/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $type = $request->string('type', 'website')->toString();

        $typeRules = match ($type) {
            'website' => [
                'url' => ['required', 'url', 'max:2048'],
            ],
            'wifi' => [
                'ssid' => ['required', 'string', 'max:100'],
                'wifi_password' => ['nullable', 'string', 'max:100'],
                'encryption' => ['required', 'in:WPA,WEP,nopass'],
            ],
            'vcard' => [
                'full_name' => ['required', 'string', 'max:100'],
                'phone' => ['nullable', 'string', 'max:30'],
                'email' => ['nullable', 'email', 'max:150'],
                'company' => ['nullable', 'string', 'max:150'],
            ],
            'whatsapp' => [
                'whatsapp_phone' => ['required', 'string', 'max:20'],
                'message' => ['nullable', 'string', 'max:500'],
            ],
            default => abort(422, 'Type de QR code non pris en charge.'),
        };

        $validated = $request->validate(array_merge([
            'label' => ['required', 'string', 'max:150'],
            'scan_limit' => ['nullable', 'integer', 'min:1'],
            'type' => ['required', 'in:website,wifi,vcard,whatsapp'],
        ], $typeRules));

        $content = match ($type) {
            'website' => ['url' => $validated['url']],
            'wifi' => [
                'ssid' => $validated['ssid'],
                'password' => $validated['wifi_password'] ?? null,
                'encryption' => $validated['encryption'],
            ],
            'vcard' => [
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'company' => $validated['company'] ?? null,
            ],
            'whatsapp' => [
                'phone' => $validated['whatsapp_phone'],
                'message' => $validated['message'] ?? null,
            ],
        };

        $request->user()->qrCodes()->create([
            'label' => $validated['label'],
            'type' => $type,
            'mode' => $type === 'website' ? 'dynamic' : 'static',
            'content' => $content,
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
