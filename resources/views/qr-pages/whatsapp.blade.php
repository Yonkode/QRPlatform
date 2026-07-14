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
            --scan: #16e0bd;
            --pulse: #ff3d8a;
            --wa: #25d366;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --background: #0e0c1b;
                --foreground: #f5f4fa;
                --muted-foreground: #a8a2c0;
                --border: #2d2750;
                --signal: #8b76ff;
                --scan: #4debcb;
                --pulse: #ff6ba3;
            }
        }

        * {
            box-sizing: border-box;
        }

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
        }

        .message-preview {
            text-align: left;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 14px;
            margin-bottom: 20px;
            font-size: 14px;
            color: var(--muted-foreground);
            font-style: italic;
        }

        .cta {
            display: inline-block;
            width: 100%;
            padding: 14px 20px;
            border-radius: 10px;
            background: var(--wa);
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
        $phone = preg_replace('/[^0-9]/', '', $qrCode->content['phone'] ?? '');
        $message = $qrCode->content['message'] ?? null;
        $waUrl = 'https://wa.me/'.$phone.($message ? '?text='.rawurlencode($message) : '');
    @endphp

    <div class="card">
        <span class="eyebrow">WhatsApp</span>
        <h1>{{ $qrCode->label }}</h1>
        <p class="meta">Démarre une conversation WhatsApp en un clic.</p>

        @if($message)
            <div class="message-preview">&laquo; {{ $message }} &raquo;</div>
        @endif

        <a class="cta" href="{{ $waUrl }}">Ouvrir la conversation</a>

        <p class="scan-count">
            {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }} scans
        </p>
    </div>
</body>
</html>
