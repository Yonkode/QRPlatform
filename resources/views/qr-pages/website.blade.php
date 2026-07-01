<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>{{ $qrCode->label }}</title>
</head>
<body>
    <h1>{{ $qrCode->label }}</h1>
    <p>Type : {{ $qrCode->type }}</p>
    <pre>{{ json_encode($qrCode->content, JSON_PRETTY_PRINT) }}</pre>
    <p>Nombre de scans : {{ $qrCode->scan_count }} / {{ $qrCode->scan_limit ?? '∞' }}</p>
</body>
</html>
