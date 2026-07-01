<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
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
}