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
            margin: 0 0 24px;
        }

        .field {
            text-align: left;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 14px;
            margin-bottom: 12px;
        }

        .field-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: var(--muted-foreground);
            margin-bottom: 4px;
        }

        .field-value {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 15px;
            word-break: break-all;
        }

        .copy-btn {
            flex-shrink: 0;
            border: 1px solid var(--border);
            background: transparent;
            color: var(--signal);
            font-size: 12px;
            font-weight: 600;
            padding: 6px 10px;
            border-radius: 8px;
            cursor: pointer;
            font-family: inherit;
        }

        .copy-btn:active {
            transform: scale(0.97);
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
    <div class="card">
        <span class="eyebrow">Wi-Fi</span>
        <h1>{{ $qrCode->label }}</h1>
        <p class="meta">Connecte-toi au réseau avec ces informations.</p>

        <div class="field">
            <span class="field-label">Réseau (SSID)</span>
            <div class="field-value">
                <span id="ssid-value">{{ $qrCode->content['ssid'] ?? '' }}</span>
                <button type="button" class="copy-btn" onclick="copyValue('ssid-value', this)">Copier</button>
            </div>
        </div>

        @if(($qrCode->content['encryption'] ?? 'nopass') !== 'nopass' && filled($qrCode->content['password'] ?? null))
            <div class="field">
                <span class="field-label">Mot de passe</span>
                <div class="field-value">
                    <span id="password-value">{{ $qrCode->content['password'] }}</span>
                    <button type="button" class="copy-btn" onclick="copyValue('password-value', this)">Copier</button>
                </div>
            </div>
        @endif

        <div class="field">
            <span class="field-label">Sécurité</span>
            <div class="field-value">
                <span>
                    @switch($qrCode->content['encryption'] ?? 'nopass')
                        @case('WPA')
                            WPA / WPA2
                            @break
                        @case('WEP')
                            WEP
                            @break
                        @default
                            Réseau ouvert
                    @endswitch
                </span>
            </div>
        </div>

        <p class="scan-count">
            {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }} scans
        </p>
    </div>

    <script>
        function copyValue(id, btn) {
            var text = document.getElementById(id).textContent;
            var original = btn.textContent;
            navigator.clipboard.writeText(text).then(function () {
                btn.textContent = 'Copié';
                setTimeout(function () { btn.textContent = original; }, 1500);
            });
        }
    </script>
</body>
</html>
