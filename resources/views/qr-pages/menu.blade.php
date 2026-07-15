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
            max-width: 440px;
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
            margin: 0 0 6px;
        }

        p.meta {
            color: var(--muted-foreground);
            font-size: 14px;
            margin: 0;
        }

        .items {
            margin-top: 20px;
            border: 1px solid var(--border);
            border-radius: 14px;
            overflow: hidden;
        }

        .item {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 16px;
            border-bottom: 1px solid var(--border);
        }

        .item:last-child {
            border-bottom: none;
        }

        .item-name {
            font-size: 15px;
        }

        .item-price {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 14px;
            color: var(--signal);
            white-space: nowrap;
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
            <span class="eyebrow">Menu</span>
            <h1>{{ $qrCode->content['title'] ?? $qrCode->label }}</h1>
            @if(($qrCode->content['description'] ?? null))
                <p class="meta">{{ $qrCode->content['description'] }}</p>
            @endif
        </div>

        <div class="items">
            @foreach(($qrCode->content['items'] ?? []) as $item)
                <div class="item">
                    <span class="item-name">{{ $item['name'] }}</span>
                    @if(!empty($item['price']))
                        <span class="item-price">{{ $item['price'] }}</span>
                    @endif
                </div>
            @endforeach
        </div>

        <p class="scan-count">
            {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }} scans
        </p>
    </div>
</body>
</html>
