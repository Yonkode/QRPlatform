<?php

use App\Http\Controllers\QrCodeController;
use App\Http\Controllers\QrCodeImageController;
use App\Http\Controllers\QrResolverController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('qr-codes', QrCodeController::class)
        ->only(['index', 'create', 'store']);

    Route::get('qr-codes/{qrCode}/image', [QrCodeImageController::class, 'show'])
        ->name('qr-codes.image');
});

// --- Espace public de résolution des QR Codes (sans authentification) ---

// Groupe A — pages de destination
Route::get('/p/{slug}', [QrResolverController::class, 'show'])->name('qr.show');

// Groupe B et C — redirections directes
Route::get('/r/{slug}', [QrResolverController::class, 'redirect'])->name('qr.redirect');

// Page affichée quand le quota est atteint
Route::get('/quota-atteint/{slug}', function (string $slug) {
    $qrCode = \App\Models\QrCode::where('slug', $slug)->firstOrFail();
    return view('qr-pages.limit-reached', ['qrCode' => $qrCode]);
})->name('qr.limit-reached');

require __DIR__.'/settings.php';