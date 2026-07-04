<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use App\Models\QrScan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\View\View;
use Jenssegers\Agent\Agent;

class QrResolverController extends Controller
{
    public function show(Request $request, string $slug): View
    {
        $qrCode = QrCode::where('slug', $slug)->firstOrFail();

        $this->registerScan($qrCode, $request);

        if ($qrCode->hasReachedLimit()) {
            return view('qr-pages.limit-reached', ['qrCode' => $qrCode]);
        }

        return view("qr-pages.{$qrCode->type}", ['qrCode' => $qrCode]);
    }

    public function redirect(Request $request, string $slug): RedirectResponse
    {
        $qrCode = QrCode::where('slug', $slug)->firstOrFail();

        $this->registerScan($qrCode, $request);

        if ($qrCode->hasReachedLimit()) {
            return redirect()->route('qr.limit-reached', ['slug' => $qrCode->slug]);
        }

        $target = $qrCode->content['url'] ?? $qrCode->content['target_url'] ?? null;

        abort_if(blank($target), 404);

        return redirect()->away($target);
    }

    private function registerScan(QrCode $qrCode, Request $request): void
    {
        if ($qrCode->hasReachedLimit()) {
            return;
        }

        $ip = $request->ip();
        $location = $this->resolveLocation($ip);

        $agent = new Agent;
        $agent->setUserAgent($request->userAgent());

        QrScan::create([
            'qr_code_id' => $qrCode->id,
            'scanned_at' => now(),
            'ip_address' => $ip,
            'country' => $location['country'] ?? null,
            'city' => $location['city'] ?? null,
            'latitude' => $location['lat'] ?? null,
            'longitude' => $location['lon'] ?? null,
            'device_type' => $this->detectDeviceType($agent),
            'os' => $agent->platform() ?: null,
            'browser' => $agent->browser() ?: null,
            'user_agent' => $request->userAgent(),
            'referer' => $request->header('referer'),
        ]);

        $qrCode->increment('scan_count');

        if ($qrCode->hasReachedLimit()) {
            $qrCode->update(['status' => 'limit_reached']);
        }
    }

    /**
     * Résout pays/ville/coordonnées à partir d'une IP via ip-api.com (gratuit, sans clé).
     * Retourne un tableau vide si l'IP est privée/locale ou si l'appel échoue.
     */
    private function resolveLocation(string $ip): array
    {
        if ($this->isPrivateIp($ip)) {
            return [];
        }

        try {
            $response = Http::timeout(3)->get("http://ip-api.com/json/{$ip}", [
                'fields' => 'status,country,city,lat,lon',
            ]);

            if ($response->successful() && $response->json('status') === 'success') {
                return $response->json();
            }
        } catch (\Throwable $e) {
            report($e);
        }

        return [];
    }

    private function isPrivateIp(string $ip): bool
    {
        return ! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
    }

    private function detectDeviceType(Agent $agent): string
    {
        if ($agent->isTablet()) {
            return 'tablet';
        }

        if ($agent->isMobile()) {
            return 'mobile';
        }

        return 'desktop';
    }
}
