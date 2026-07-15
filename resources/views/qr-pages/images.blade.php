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
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --background: #0e0c1b;
                --foreground: #f5f4fa;
                --muted-foreground: #a8a2c0;
                --border: #2d2750;
                --signal: #8b76ff;
            }
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            min-height: 100vh;
            padding: 24px;
            background: var(--background);
            color: var(--foreground);
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
        }

        .wrap {
            max-width: 640px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .eyebrow {
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--signal);
            margin-bottom: 8px;
        }

        h1 {
            font-family: 'Space Grotesk', 'Instrument Sans', sans-serif;
            font-size: 22px;
            margin: 0;
        }

        .gallery {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }

        .gallery img {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            border-radius: 12px;
            border: 1px solid var(--border);
        }

        .scan-count {
            margin-top: 20px;
            text-align: center;
            font-size: 13px;
            color: var(--muted-foreground);
            font-family: 'JetBrains Mono', ui-monospace, monospace;
        }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="header">
            <span class="eyebrow">Galerie</span>
            <h1>{{ $qrCode->label }}</h1>
        </div>

        <div class="gallery">
            @foreach(($qrCode->content['files'] ?? []) as $file)
                <img src="{{ \Illuminate\Support\Facades\Storage::url($file['file_path']) }}" alt="{{ $file['original_name'] ?? '' }}" loading="lazy">
            @endforeach
        </div>

        <p class="scan-count">
            {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }} scans
        </p>
    </div>
</body>
</html>
