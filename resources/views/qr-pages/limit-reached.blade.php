<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Quota atteint</title>
    <style>
        :root {
            --background: #ffffff;
            --foreground: #17142b;
            --muted-foreground: #6b6580;
            --border: #e7e4f2;
            --warn: #ffb020;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --background: #0e0c1b;
                --foreground: #f5f4fa;
                --muted-foreground: #a8a2c0;
                --border: #2d2750;
                --warn: #ffc862;
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

        .icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 16px;
            border-radius: 50%;
            background: color-mix(in srgb, var(--warn) 16%, transparent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            color: var(--warn);
        }

        h1 {
            font-family: 'Space Grotesk', 'Instrument Sans', sans-serif;
            font-size: 20px;
            margin: 0 0 8px;
        }

        p {
            color: var(--muted-foreground);
            font-size: 14px;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">!</div>
        <h1>Limite de scans atteinte</h1>
        <p>« {{ $qrCode->label }} » a atteint son nombre maximal de scans et ne peut plus être consulté pour le moment.</p>
    </div>
</body>
</html>