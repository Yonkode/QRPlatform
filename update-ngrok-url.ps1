# Récupère l'URL publique actuelle de ngrok et met à jour APP_URL dans .env
# Usage : lance ngrok d'abord (.\ngrok http 8000), puis ce script.

$ngrokApi = "http://127.0.0.1:4040/api/tunnels"

try {
    $response = Invoke-RestMethod -Uri $ngrokApi -Method Get
} catch {
    Write-Host "Erreur : impossible de contacter ngrok sur $ngrokApi" -ForegroundColor Red
    Write-Host "Verifie que 'ngrok http 8000' tourne bien dans un autre terminal." -ForegroundColor Yellow
    exit 1
}

$tunnel = $response.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1

if (-not $tunnel) {
    Write-Host "Erreur : aucun tunnel https actif trouve." -ForegroundColor Red
    exit 1
}

$publicUrl = $tunnel.public_url
Write-Host "URL ngrok detectee : $publicUrl" -ForegroundColor Green

$envPath = ".env"
$envContent = Get-Content $envPath -Raw
$newContent = $envContent -replace "APP_URL=.*", "APP_URL=$publicUrl"
Set-Content -Path $envPath -Value $newContent -NoNewline

Write-Host "Fichier .env mis a jour avec APP_URL=$publicUrl" -ForegroundColor Green

php artisan config:clear

Write-Host "Termine. Rafraichis /qr-codes dans le navigateur." -ForegroundColor Cyan