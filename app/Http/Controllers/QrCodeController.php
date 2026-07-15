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
            'coupon' => [
                'coupon_title' => ['required', 'string', 'max:150'],
                'coupon_code' => ['required', 'string', 'max:50'],
                'discount' => ['nullable', 'string', 'max:50'],
                'coupon_description' => ['nullable', 'string', 'max:500'],
                'expires_at' => ['nullable', 'date'],
            ],
            'business' => [
                'business_name' => ['required', 'string', 'max:150'],
                'business_description' => ['nullable', 'string', 'max:500'],
                'business_phone' => ['nullable', 'string', 'max:30'],
                'business_email' => ['nullable', 'email', 'max:150'],
                'address' => ['nullable', 'string', 'max:255'],
                'business_website' => ['nullable', 'url', 'max:2048'],
                'hours' => ['nullable', 'string', 'max:150'],
            ],
            'app' => [
                'app_url' => ['required', 'url', 'max:2048'],
            ],
            'facebook' => [
                'facebook_url' => ['required', 'url', 'max:2048'],
            ],
            'instagram' => [
                'instagram_url' => ['required', 'url', 'max:2048'],
            ],
            'social' => [
                'social_url' => ['required', 'url', 'max:2048'],
            ],
            'pdf' => [
                'pdf_file' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            ],
            'images' => [
                'images' => ['required', 'array', 'min:1', 'max:10'],
                'images.*' => ['file', 'image', 'max:5120'],
            ],
            'video' => [
                'video_file' => ['required', 'file', 'mimes:mp4,mov,webm', 'max:51200'],
            ],
            'mp3' => [
                'mp3_file' => ['required', 'file', 'mimes:mp3,wav,ogg,m4a', 'max:20480'],
            ],
            'menu' => [
                'menu_title' => ['required', 'string', 'max:150'],
                'menu_description' => ['nullable', 'string', 'max:500'],
                'items' => ['required', 'array', 'min:1', 'max:30'],
                'items.*.name' => ['required', 'string', 'max:100'],
                'items.*.price' => ['nullable', 'string', 'max:30'],
            ],
            'link_list' => [
                'link_list_title' => ['required', 'string', 'max:150'],
                'link_list_bio' => ['nullable', 'string', 'max:255'],
                'links' => ['required', 'array', 'min:1', 'max:20'],
                'links.*.label' => ['required', 'string', 'max:100'],
                'links.*.url' => ['required', 'url', 'max:2048'],
            ],
            default => abort(422, 'Type de QR code non pris en charge.'),
        };

        $validated = $request->validate(array_merge([
            'label' => ['required', 'string', 'max:150'],
            'scan_limit' => ['nullable', 'integer', 'min:1'],
            'type' => ['required', 'in:website,wifi,vcard,whatsapp,coupon,business,app,facebook,instagram,social,pdf,images,video,mp3,menu,link_list'],
        ], $typeRules));

        $content = $this->buildContent($type, $validated, $request);

        $request->user()->qrCodes()->create([
            'label' => $validated['label'],
            'type' => $type,
            'mode' => $type === 'website' ? 'dynamic' : 'static',
            'content' => $content,
            'scan_limit' => $validated['scan_limit'] ?? null,
        ]);

        return redirect()->route('qr-codes.index');
    }

    /**
     * Construit le tableau `content` stocké en JSON selon le type de QR code.
     * Gère aussi le stockage physique des fichiers uploadés (pdf, images, video, mp3).
     */
    private function buildContent(string $type, array $validated, Request $request): array
    {
        switch ($type) {
            case 'website':
                return ['url' => $validated['url']];

            case 'wifi':
                return [
                    'ssid' => $validated['ssid'],
                    'password' => $validated['wifi_password'] ?? null,
                    'encryption' => $validated['encryption'],
                ];

            case 'vcard':
                return [
                    'full_name' => $validated['full_name'],
                    'phone' => $validated['phone'] ?? null,
                    'email' => $validated['email'] ?? null,
                    'company' => $validated['company'] ?? null,
                ];

            case 'whatsapp':
                return [
                    'phone' => $validated['whatsapp_phone'],
                    'message' => $validated['message'] ?? null,
                ];

            case 'coupon':
                return [
                    'title' => $validated['coupon_title'],
                    'code' => $validated['coupon_code'],
                    'discount' => $validated['discount'] ?? null,
                    'description' => $validated['coupon_description'] ?? null,
                    'expires_at' => $validated['expires_at'] ?? null,
                ];

            case 'business':
                return [
                    'name' => $validated['business_name'],
                    'description' => $validated['business_description'] ?? null,
                    'phone' => $validated['business_phone'] ?? null,
                    'email' => $validated['business_email'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'website' => $validated['business_website'] ?? null,
                    'hours' => $validated['hours'] ?? null,
                ];

            case 'app':
                return ['url' => $validated['app_url']];

            case 'facebook':
                return ['url' => $validated['facebook_url']];

            case 'instagram':
                return ['url' => $validated['instagram_url']];

            case 'social':
                return ['url' => $validated['social_url']];

            case 'pdf':
                $file = $request->file('pdf_file');

                return [
                    'file_path' => $file->store('qr-files/pdf', 'public'),
                    'original_name' => $file->getClientOriginalName(),
                ];

            case 'images':
                $files = [];

                foreach ($request->file('images', []) as $index => $image) {
                    $files[] = [
                        'file_path' => $image->store('qr-files/images', 'public'),
                        'original_name' => $image->getClientOriginalName(),
                        'order' => $index,
                    ];
                }

                return ['files' => $files];

            case 'video':
                $file = $request->file('video_file');

                return [
                    'file_path' => $file->store('qr-files/video', 'public'),
                    'original_name' => $file->getClientOriginalName(),
                ];

            case 'mp3':
                $file = $request->file('mp3_file');

                return [
                    'file_path' => $file->store('qr-files/mp3', 'public'),
                    'original_name' => $file->getClientOriginalName(),
                ];

            case 'menu':
                return [
                    'title' => $validated['menu_title'],
                    'description' => $validated['menu_description'] ?? null,
                    'items' => array_map(fn ($item) => [
                        'name' => $item['name'],
                        'price' => $item['price'] ?? null,
                    ], $validated['items']),
                ];

            case 'link_list':
                return [
                    'title' => $validated['link_list_title'],
                    'bio' => $validated['link_list_bio'] ?? null,
                    'links' => array_map(fn ($link) => [
                        'label' => $link['label'],
                        'url' => $link['url'],
                    ], $validated['links']),
                ];

            default:
                abort(422, 'Type de QR code non pris en charge.');
        }
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
