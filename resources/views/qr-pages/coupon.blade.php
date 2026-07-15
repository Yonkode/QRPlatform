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
            margin: 0 0 20px;
        }

        .discount {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 32px;
            font-weight: 700;
            color: var(--pulse);
            margin-bottom: 16px;
        }

        .code-box {
            border: 1px dashed var(--signal);
            border-radius: 10px;
            padding: 14px;
            margin-bottom: 16px;
        }

        .code-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: var(--muted-foreground);
            margin-bottom: 6px;
        }

        .code-value {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.05em;
        }

        .copy-btn {
            margin-top: 10px;
            border: 1px solid var(--border);
            background: transparent;
            color: var(--signal);
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-family: inherit;
        }

        .expiry {
            font-size: 13px;
            color: var(--muted-foreground);
            margin-bottom: 4px;
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
        $expiresAt = $qrCode->content['expires_at'] ?? null;
        $isExpired = $expiresAt && \Illuminate\Support\Carbon::parse($expiresAt)->isPast();
    @endphp

    <div class="card">
        <span class="eyebrow">Coupon</span>
        <h1>{{ $qrCode->content['title'] ?? $qrCode->label }}</h1>

        @if(($qrCode->content['discount'] ?? null))
            <div class="discount">{{ $qrCode->content['discount'] }}</div>
        @endif

        @if(($qrCode->content['description'] ?? null))
            <p class="meta">{{ $qrCode->content['description'] }}</p>
        @endif

        <div class="code-box">
            <span class="code-label">Code promo</span>
            <span class="code-value" id="coupon-code">{{ $qrCode->content['code'] ?? '' }}</span>
            <br>
            <button type="button" class="copy-btn" onclick="copyCode()">Copier le code</button>
        </div>

        @if($expiresAt)
            <p class="expiry">
                @if($isExpired)
                    Offre expirée le {{ \Illuminate\Support\Carbon::parse($expiresAt)->format('d/m/Y') }}
                @else
                    Valable jusqu'au {{ \Illuminate\Support\Carbon::parse($expiresAt)->format('d/m/Y') }}
                @endif
            </p>
        @endif

        <p class="scan-count">
            {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }} scans
        </p>
    </div>

    <script>
        function copyCode() {
            var text = document.getElementById('coupon-code').textContent;
            navigator.clipboard.writeText(text);
        }
    </script>
</body>
</html>
