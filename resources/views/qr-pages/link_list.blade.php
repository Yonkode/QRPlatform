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
            padding: 24px;
            background: var(--background);
            color: var(--foreground);
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
        }

        .wrap {
            max-width: 420px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 24px;
        }

        .avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            margin: 0 auto 12px;
            background: linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%);
        }

        h1 {
            font-family: 'Space Grotesk', 'Instrument Sans', sans-serif;
            font-size: 20px;
            margin: 0 0 6px;
        }

        p.bio {
            color: var(--muted-foreground);
            font-size: 14px;
            margin: 0;
        }

        .links {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .link-btn {
            display: block;
            text-align: center;
            padding: 14px 18px;
            border: 1px solid var(--border);
            border-radius: 12px;
            text-decoration: none;
            color: var(--foreground);
            font-weight: 600;
            font-size: 15px;
        }

        .link-btn:active {
            transform: scale(0.99);
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
            <div class="avatar"></div>
            <h1>{{ $qrCode->content['title'] ?? $qrCode->label }}</h1>
            @if(($qrCode->content['bio'] ?? null))
                <p class="bio">{{ $qrCode->content['bio'] }}</p>
            @endif
        </div>

        <div class="links">
            @foreach(($qrCode->content['links'] ?? []) as $link)
                <a class="link-btn" href="{{ $link['url'] }}">{{ $link['label'] }}</a>
            @endforeach
        </div>

        <p class="scan-count">
            {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }} scans
        </p>
    </div>
</body>
</html>
