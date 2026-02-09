# Deployment Guide: Temple ERP (Laravel + React + Inertia)

## Server Requirements
- PHP 8.2+
- MySQL 8.0+ / MariaDB 10.4+
- Nginx / Apache
- Composer
- Node.js & NPM

## Automated Deployment Script (Example)
```bash
#!/bin/bash
git pull origin main
composer install --no-interaction --prefer-dist --optimize-autoloader
php artisan migrate --force
npm install
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Malayalam Font Setup for PDF
To support Malayalam in PDF receipts:
1. Download a Unicode Malayalam font (e.g., `Meera.ttf`).
2. Place it in `storage/fonts/`.
3. Update `config/dompdf.php` to include the font path.
4. Use `@font-face` in your CSS templates.

## Common Issues
- **Directory Permissions**: Ensure `storage` and `bootstrap/cache` are writable.
- **Inertia CSRF**: Ensure `HandleInertiaRequests` middleware is properly configured.
- **Symlink**: Run `php artisan storage:link` for file uploads.
```
