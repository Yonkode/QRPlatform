# QRPlatform

Plateforme web de génération et de gestion de QR Codes, développée dans le cadre d'un projet académique (génération et gestion de QR Code). Elle permet de créer des QR Codes dynamiques sous 16 formats différents, de suivre leurs scans (période, localisation, adresse IP) et de gérer un quota de scans par code.

## Fonctionnalités

- **16 types de QR Code** : Site web, Wi-Fi, Carte de visite, WhatsApp, Coupon, Business, Application, Facebook, Instagram, Réseau social, PDF, Images, Vidéo, Audio, Menu, Liste de liens.
- **Quota de scans** : limite définissable à la création, modifiable à tout moment, avec journal d'audit des modifications (ancienne/nouvelle valeur, motif, date).
- **Historique des scans** : date, adresse IP, pays/ville estimés, appareil et navigateur, filtrable par période, localisation ou adresse IP.
- **Tableau de bord** : nombre total de QR Codes, total de scans, tendance sur les derniers jours.
- **Génération d'image QR** à la volée, sans dépendance à un service tiers payant.

## Stack technique

| Côté | Techno |
|---|---|
| Back-end | Laravel 13 (PHP 8.3+) |
| Front-end | React 19 (TypeScript) via Inertia.js |
| UI | shadcn/ui, Tailwind CSS |
| Base de données | SQLite (par défaut, configurable) |
| Génération QR | [endroid/qr-code](https://github.com/endroid/qr-code) |
| Géolocalisation des scans | résolution d'adresse IP via un service externe gratuit |

## Prérequis

Avant de commencer, installe ces outils si ce n'est pas déjà fait :

- [PHP 8.3+](https://www.php.net/downloads) avec l'extension `sqlite3` activée
- [Composer](https://getcomposer.org/download/)
- [Node.js 20+](https://nodejs.org/) (fournit `npm`)
- [Git](https://git-scm.com/downloads)
- (Optionnel, pour scanner les QR Codes générés depuis un vrai téléphone) [ngrok](https://ngrok.com/download)

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Yonkode/QRPlatform.git
cd QRPlatform

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances JavaScript
npm install

# 4. Copier le fichier d'environnement et générer la clé d'application
cp .env.example .env
php artisan key:generate

# 5. Créer la base de données SQLite (si le fichier n'existe pas encore)
touch database/database.sqlite

# 6. Lancer les migrations
php artisan migrate

# 7. Créer le lien symbolique de stockage public
# (indispensable pour que les fichiers uploadés — PDF, images, vidéo, audio — soient accessibles)
php artisan storage:link
```

> Sous Windows, remplace `touch database/database.sqlite` par la création manuelle d'un fichier vide `database/database.sqlite`, ou utilise `New-Item database/database.sqlite` dans PowerShell.

## Lancer le projet

Une seule commande démarre le serveur, le worker de file d'attente, les logs en direct et le serveur de développement front-end (Vite) en parallèle :

```bash
composer run dev
```

L'application est alors disponible sur `http://localhost:8000`.

## Tester les QR Codes depuis un vrai téléphone

Le serveur local n'est accessible que depuis la machine de développement. Pour que les QR Codes générés soient réellement scannables, il faut exposer ce serveur publiquement avec **ngrok** :

```bash
ngrok http 8000
```

Puis, dans un autre terminal PowerShell, à la racine du projet, exécute le script fourni pour synchroniser automatiquement l'URL publique ngrok avec la configuration de l'application :

```powershell
.\update-ngrok-url.ps1
```

Ce script récupère l'URL `https://xxxx.ngrok-free.app` active et met à jour `APP_URL` dans `.env` en conséquence. Sans cette étape, les QR Codes générés encoderaient une URL `localhost` injoignable depuis un téléphone.

> ⚠️ Avec un compte ngrok gratuit, l'URL change à chaque redémarrage de ngrok : relance le script à chaque nouvelle session.

## Structure du projet (points clés)

```
app/Http/Controllers/QrCodeController.php   → création, validation et logique par type de QR Code
app/Http/Controllers/QrResolverController.php → redirection ou affichage au moment du scan
app/Models/QrCode.php                       → modèle principal, classification des types (redirection/page dédiée)
resources/views/qr-pages/                   → pages publiques affichées lors d'un scan (une par type)
resources/js/pages/QrCodes/                 → interface de création, liste et historique
database/migrations/                        → schéma de la base de données
```

## Tests

```bash
php artisan test
```

> À ce stade, les tests automatisés couvrent l'authentification et le profil utilisateur (fournis par le socle du projet). Les fonctionnalités spécifiques aux QR Codes (génération, quota, historique) sont validées manuellement — voir le rapport de projet pour le détail.

## Contexte

Projet réalisé dans le cadre d'un cursus académique, en réponse à l'énoncé « Plateforme de génération et de gestion de QR Code ».
