<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QrCodeController;
use App\Http\Controllers\QrCodeImageController;
use App\Http\Controllers\QrResolverController;
use App\Http\Controllers\QrScanHistoryController;
use App\Models\QrCode;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::delete('qr-codes/bulk-destroy', [QrCodeController::class, 'bulkDestroy'])
        ->name('qr-codes.bulk-destroy');

    Route::resource('qr-codes', QrCodeController::class)
        ->only(['index', 'create', 'store', 'destroy']);

    Route::get('qr-codes/{qrCode}/image', [QrCodeImageController::class, 'show'])
        ->name('qr-codes.image');

    Route::get('qr-codes/{qrCode}/scans', [QrScanHistoryController::class, 'index'])
        ->name('qr-codes.scans');

    Route::patch('qr-codes/{qrCode}/quota', [QrCodeController::class, 'updateQuota'])
        ->name('qr-codes.update-quota');
});

// --- Espace public de résolution des QR Codes (sans authentification) ---

// Groupe A — pages de destination
Route::get('/p/{slug}', [QrResolverController::class, 'show'])->name('qr.show');

// Groupe B et C — redirections directes
Route::get('/r/{slug}', [QrResolverController::class, 'redirect'])->name('qr.redirect');

// Page affichée quand le quota est atteint
Route::get('/quota-atteint/{slug}', function (string $slug) {
    $qrCode = QrCode::where('slug', $slug)->firstOrFail();

    return view('qr-pages.limit-reached', ['qrCode' => $qrCode]);
})->name('qr.limit-reached');

require __DIR__.'/settings.php';
