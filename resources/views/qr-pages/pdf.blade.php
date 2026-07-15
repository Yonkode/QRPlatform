<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $qrCode->label }}</title>
    <style>
        :root {
            --background: #ffffff;
            --foreground: #17142b;
            --muted-foreground: #6b6580;
            --border: #e7e4f2;
            --signal: #6e56f8;
            --pulse: #ff3d8a;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --background: #0e0c1b;
                --foreground: #f5f4fa;
                --muted-foreground: #a8a2c0;
                --border: #2d2750;
                --signal: #8b76ff;
                --pulse: #ff6ba3;
            }
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: var(--background);
            color: var(--foreground);
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
        }

        .card {
            width: 100%;
            max-width: 420px;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            text-align: center;
        }

        .icon {
            width: 56px;
            height: 56px;
            margin: 0 auto 16px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%);
            color: #fff;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            font-size: 13px;
        }

        .eyebrow {
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--signal);
            margin-bottom: 12px;
        }

        h1 {
            font-family: 'Space Grotesk', 'Instrument Sans', sans-serif;
            font-size: 22px;
            margin: 0 0 8px;
        }

        p.meta {
            color: var(--muted-foreground);
            font-size: 14px;
            margin: 0 0 24px;
            word-break: break-word;
        }

        .cta {
            display: inline-block;
            width: 100%;
            padding: 14px 20px;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%);
            color: #ffffff;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
        }

        .scan-count {
            margin-top: 20px;
            font-size: 13px;
            color: var(--muted-foreground);
            font-family: 'JetBrains Mono', ui-monospace, monospace;
        }
    </style>
</head>
<body>
    @php
        $fileUrl = \Illuminate\Support\Facades\Storage::url($qrCode->content['file_path'] ?? '');
        $originalName = $qrCode->content['original_name'] ?? 'document.pdf';
    @endphp

    <div class="card">
        <div class="icon">PDF</div>
        <span class="eyebrow">Document</span>
        <h1>{{ $qrCode->label }}</h1>
        <p class="meta">{{ $originalName }}</p>

        <a class="cta" href="{{ $fileUrl }}" target="_blank" rel="noopener">Ouvrir le PDF</a>

        <p class="scan-count">
            {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }} scans
        </p>
    </div>
</body>
</html>
