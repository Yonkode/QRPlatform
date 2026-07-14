<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class QrCodeImageController extends Controller
{
    public function show(QrCode $qrCode): Response
    {
        Gate::authorize('view', $qrCode);

        $builder = new Builder(
            writer: new PngWriter,
            data: $qrCode->publicUrl(),
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
        );

        $result = $builder->build();

        return response($result->getString(), 200)
            ->header('Content-Type', $result->getMimeType())
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
}
