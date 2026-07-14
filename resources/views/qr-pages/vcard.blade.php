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

        .avatar {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 22px;
            font-weight: 600;
            color: #ffffff;
            background: linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%);
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
            margin: 0 0 4px;
        }

        p.company {
            color: var(--muted-foreground);
            font-size: 14px;
            margin: 0 0 24px;
        }

        .contact-list {
            text-align: left;
            margin-bottom: 20px;
        }

        .contact-row {
            display: block;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 14px;
            margin-bottom: 10px;
            text-decoration: none;
            color: var(--foreground);
        }

        .contact-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: var(--muted-foreground);
            margin-bottom: 4px;
        }

        .contact-value {
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
        $fullName = $qrCode->content['full_name'] ?? '';
        $phone = $qrCode->content['phone'] ?? null;
        $email = $qrCode->content['email'] ?? null;
        $company = $qrCode->content['company'] ?? null;
        $initials = collect(explode(' ', trim($fullName)))
            ->filter()
            ->map(fn ($part) => mb_strtoupper(mb_substr($part, 0, 1)))
            ->take(2)
            ->implode('');

        $vcardLines = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            'N:'.$fullName,
            'FN:'.$fullName,
        ];
        if ($company) {
            $vcardLines[] = 'ORG:'.$company;
        }
        if ($phone) {
            $vcardLines[] = 'TEL;TYPE=CELL:'.$phone;
        }
        if ($email) {
            $vcardLines[] = 'EMAIL:'.$email;
        }
        $vcardLines[] = 'END:VCARD';
        $vcardData = 'data:text/vcard;charset=utf-8,'.rawurlencode(implode("\n", $vcardLines));

        $fileSlug = trim(preg_replace('/[^a-z0-9]+/', '-', mb_strtolower($fullName)), '-');
        $fileSlug = $fileSlug !== '' ? $fileSlug : 'contact';
    @endphp

    <div class="card">
        <div class="avatar">{{ $initials !== '' ? $initials : '?' }}</div>
        <span class="eyebrow">Carte de visite</span>
        <h1>{{ $fullName }}</h1>
        @if($company)
            <p class="company">{{ $company }}</p>
        @endif

        <div class="contact-list">
            @if($phone)
                <a class="contact-row" href="tel:{{ $phone }}">
                    <span class="contact-label">Téléphone</span>
                    <span class="contact-value">{{ $phone }}</span>
                </a>
            @endif
            @if($email)
                <a class="contact-row" href="mailto:{{ $email }}">
                    <span class="contact-label">E-mail</span>
                    <span class="contact-value">{{ $email }}</span>
                </a>
            @endif
        </div>

        <a class="cta" href="{{ $vcardData }}" download="{{ $fileSlug }}.vcf">
            Ajouter aux contacts
        </a>

        <p class="scan-count">
            {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }} scans
        </p>
    </div>
</body>
</html>
