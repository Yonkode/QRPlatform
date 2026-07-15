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

        .info-list {
            text-align: left;
            margin-bottom: 20px;
        }

        .info-row {
            display: block;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 14px;
            margin-bottom: 10px;
            text-decoration: none;
            color: var(--foreground);
        }

        .info-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: var(--muted-foreground);
            margin-bottom: 4px;
        }

        .info-value {
            font-size: 15px;
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
        $phone = $qrCode->content['phone'] ?? null;
        $email = $qrCode->content['email'] ?? null;
        $address = $qrCode->content['address'] ?? null;
        $hours = $qrCode->content['hours'] ?? null;
        $website = $qrCode->content['website'] ?? null;
    @endphp

    <div class="card">
        <span class="eyebrow">Établissement</span>
        <h1>{{ $qrCode->content['name'] ?? $qrCode->label }}</h1>

        @if(($qrCode->content['description'] ?? null))
            <p class="meta">{{ $qrCode->content['description'] }}</p>
        @endif

        <div class="info-list">
            @if($address)
                <div class="info-row">
                    <span class="info-label">Adresse</span>
                    <span class="info-value">{{ $address }}</span>
                </div>
            @endif
            @if($hours)
                <div class="info-row">
                    <span class="info-label">Horaires</span>
                    <span class="info-value">{{ $hours }}</span>
                </div>
            @endif
            @if($phone)
                <a class="info-row" href="tel:{{ $phone }}">
                    <span class="info-label">Téléphone</span>
                    <span class="info-value">{{ $phone }}</span>
                </a>
            @endif
            @if($email)
                <a class="info-row" href="mailto:{{ $email }}">
                    <span class="info-label">E-mail</span>
                    <span class="info-value">{{ $email }}</span>
                </a>
            @endif
        </div>

        @if($website)
            <a class="cta" href="{{ $website }}">Visiter le site</a>
        @endif

        <p class="scan-count">
            {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }} scans
        </p>
    </div>
</body>
</html>
