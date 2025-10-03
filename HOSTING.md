# 🚀 Aceso Health Solutions - TrueHost Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [API & Service Configuration](#api--service-configuration)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- ✅ TrueHost shared hosting account
- ✅ cPanel access
- ✅ FTP/SFTP client (FileZilla recommended)
- ✅ Node.js 18+ (for local build)
- ✅ PHP 8.2+ on server
- ✅ MySQL database access

### Before You Start
- [ ] Backup current database (✅ Already done: `Backend/backup.sql`)
- [ ] Note your TrueHost domain name
- [ ] Have cPanel login credentials ready
- [ ] Prepare API keys (Pesapal, etc.)

---

## 1️⃣ Frontend Deployment

### Step 1: Build the Frontend

```bash
cd Frontend
npm install
npm run build
```

This creates a `dist` folder with optimized production files.

### Step 2: Upload to TrueHost

**Option A: Using cPanel File Manager**
1. Login to cPanel
2. Navigate to **File Manager**
3. Go to `public_html` directory
4. Create a new folder: `aceso` (or use root `public_html`)
5. Upload all files from `Frontend/dist/*` to this folder

**Option B: Using FTP (Recommended)**
1. Connect via FTP to your TrueHost server
2. Navigate to `/public_html/`
3. Upload entire `dist` folder contents
4. Set folder permissions to `755`
5. Set file permissions to `644`

### Step 3: Configure Frontend Environment

Create `.env.production` in your build folder or update the API URL:

```env
VITE_API_URL=https://yourdomain.com/api
```

**Important:** Rebuild after changing API URL:
```bash
npm run build
```

---

## 2️⃣ Backend Deployment

### Step 1: Prepare Backend Files

```bash
cd Backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 2: Upload Backend to TrueHost

1. Create a folder outside `public_html`: `/home/username/aceso-backend/`
2. Upload all Laravel files EXCEPT `public` folder
3. Upload `public` folder contents to `/public_html/api/`

**File Structure on Server:**
```
/home/username/
├── aceso-backend/          # Laravel app (private)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   └── vendor/
│
└── public_html/
    ├── api/                # Laravel public folder
    │   ├── index.php
    │   └── .htaccess
    └── (frontend files)
```

### Step 3: Update index.php

Edit `/public_html/api/index.php`:

```php
require __DIR__.'/../../aceso-backend/vendor/autoload.php';
$app = require_once __DIR__.'/../../aceso-backend/bootstrap/app.php';
```

---

## 3️⃣ Database Setup

### Step 1: Create MySQL Database in cPanel

1. Go to **MySQL Databases**
2. Create new database: `username_aceso`
3. Create new user: `username_aceso_user`
4. Set strong password
5. Add user to database with **ALL PRIVILEGES**

### Step 2: Import Database

**Option A: phpMyAdmin**
1. Open phpMyAdmin from cPanel
2. Select your database
3. Click **Import**
4. Upload `Backend/backup.sql`
5. Click **Go**

**Option B: Command Line (if SSH access)**
```bash
mysql -u username_aceso_user -p username_aceso < backup.sql
```

### Step 3: Verify Tables

Check that all 89 tables are imported successfully:
- users
- doctors
- nursing_providers
- lab_providers
- pharmacies
- appointments
- nursing_services
- lab_appointments
- medicine_orders
- reviews
- user_types
- etc.

---

## 4️⃣ Environment Configuration

### Create .env File on Server

SSH or use cPanel File Manager to create `/home/username/aceso-backend/.env`:

```env
APP_NAME="Aceso Health Solutions"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=username_aceso
DB_USERNAME=username_aceso_user
DB_PASSWORD=your_database_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# CORS Settings
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
SESSION_DOMAIN=.yourdomain.com
```

### Generate Application Key

```bash
php artisan key:generate
```

Copy the generated key to your `.env` file.

---

## 5️⃣ API & Service Configuration

### 🔐 Pesapal Payment Integration

**Update Pesapal Configuration:**

1. Login to [Pesapal Merchant Portal](https://www.pesapal.com/)
2. Go to **Settings** → **IPN Settings**
3. Update IPN URL to: `https://yourdomain.com/api/payments/pesapal/ipn`
4. Update Callback URL to: `https://yourdomain.com/payment-success`

**Update .env with Pesapal Credentials:**

```env
# Pesapal Configuration
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
PESAPAL_BASE_URL=https://pay.pesapal.com/v3
PESAPAL_IPN_URL=https://yourdomain.com/api/payments/pesapal/ipn
PESAPAL_CALLBACK_URL=https://yourdomain.com/payment-success
```

**Test Pesapal Integration:**
```bash
curl https://yourdomain.com/api/payments/pesapal/test
```

### 📹 WebRTC Video Consultation Setup

**Current Implementation:** Uses browser-based WebRTC with HTTP polling signaling.

**No Additional Configuration Needed** - WebRTC works out of the box!

**Optional Enhancements for Production:**

1. **STUN/TURN Servers** (for better connectivity):
   - Update `Frontend/src/hooks/useWebRTC.ts`
   - Add TURN server credentials if needed:

```typescript
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { 
      urls: 'turn:your-turn-server.com:3478',
      username: 'your-username',
      credential: 'your-password'
    }
  ]
};
```

2. **WebSocket Signaling** (optional upgrade):
   - Current: HTTP polling (works on shared hosting)
   - Upgrade: WebSocket server (requires VPS/dedicated server)

**WebRTC Checklist:**
- [ ] Ensure HTTPS is enabled (required for WebRTC)
- [ ] Test video calls between doctor and patient
- [ ] Verify camera/microphone permissions work
- [ ] Check signaling endpoints: `/api/appointments/{id}/signal`

### 🔒 SSL Certificate (HTTPS)

**Enable SSL in cPanel:**
1. Go to **SSL/TLS Status**
2. Enable **AutoSSL** or install **Let's Encrypt**
3. Force HTTPS redirect in `.htaccess`:

```apache
# In /public_html/.htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 📧 Email Configuration (Optional)

For appointment notifications:

```env
MAIL_MAILER=smtp
MAIL_HOST=mail.yourdomain.com
MAIL_PORT=587
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Aceso Health Solutions"
```

---

## 6️⃣ Storage & Permissions

### Set Correct Permissions

```bash
# Laravel storage and cache
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Make sure web server can write
chown -R username:username storage
chown -R username:username bootstrap/cache
```

### Configure File Uploads

Update `config/filesystems.php` for profile images:

```php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```

Create symbolic link:
```bash
php artisan storage:link
```

---

## 7️⃣ Post-Deployment Checklist

### ✅ Functionality Tests

- [ ] **Frontend loads** at `https://yourdomain.com`
- [ ] **API responds** at `https://yourdomain.com/api/doctors`
- [ ] **Patient registration** works
- [ ] **Patient login** works
- [ ] **Doctor login** works
- [ ] **Admin login** works at `/admin`
  - Username: Sanja, Password: Administrator$1
  - Username: Jose, Password: Administrator$2
  - Username: Aceso, Password: Administrator$3
- [ ] **Appointment booking** works
- [ ] **Pesapal payment** processes correctly
- [ ] **WebRTC video calls** connect successfully
- [ ] **File uploads** (profile images) work
- [ ] **Mobile responsiveness** verified

### ✅ Security Checklist

- [ ] `.env` file is NOT in public_html
- [ ] `APP_DEBUG=false` in production
- [ ] SSL certificate is active (HTTPS)
- [ ] Database user has limited privileges
- [ ] CORS is properly configured
- [ ] API rate limiting is enabled

### ✅ Performance Optimization

```bash
# Run these commands on server
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

---

## 8️⃣ Troubleshooting

### Issue: 500 Internal Server Error

**Solution:**
1. Check `.htaccess` in `/public_html/api/`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
```

2. Check Laravel logs: `storage/logs/laravel.log`
3. Verify file permissions (775 for folders, 644 for files)

### Issue: CORS Errors

**Solution:**
Update `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['https://yourdomain.com'],
'supports_credentials' => true,
```

### Issue: Database Connection Failed

**Solution:**
1. Verify database credentials in `.env`
2. Check if database user has correct privileges
3. Ensure `DB_HOST=localhost` (not 127.0.0.1)

### Issue: Pesapal Payments Failing

**Solution:**
1. Verify IPN URL is accessible: `https://yourdomain.com/api/payments/pesapal/ipn`
2. Check Pesapal credentials in `.env`
3. Test connection: `curl https://yourdomain.com/api/payments/pesapal/test`
4. Check logs: `storage/logs/laravel.log`

### Issue: WebRTC Video Not Connecting

**Solution:**
1. Ensure HTTPS is enabled (WebRTC requires SSL)
2. Check browser console for errors
3. Verify signaling endpoints are accessible
4. Test with different browsers
5. Check firewall settings (ports 80, 443)

### Issue: Images Not Uploading

**Solution:**
1. Run `php artisan storage:link`
2. Check storage permissions: `chmod -R 775 storage`
3. Verify `upload_max_filesize` in `php.ini`
4. Check `.env` has correct `APP_URL`

---

## 📞 Support Resources

### TrueHost Support
- **Website:** https://truehost.co.ke
- **Support:** support@truehost.co.ke
- **Phone:** +254 709 677 000

### Application Support
- **Admin Panel:** https://yourdomain.com/admin
- **API Documentation:** https://yourdomain.com/api/docs (if configured)
- **Database Backup:** Located at `Backend/backup.sql`

---

## 🎉 Deployment Complete!

Your Aceso Health Solutions platform is now live!

**Access Points:**
- 🌐 **Main Website:** https://yourdomain.com
- 👨‍⚕️ **Doctor Dashboard:** https://yourdomain.com/provider/doctor
- 🏥 **Nursing Dashboard:** https://yourdomain.com/provider/home-nursing
- 🔬 **Lab Dashboard:** https://yourdomain.com/provider/laboratory
- 👤 **Patient Dashboard:** https://yourdomain.com/patient-dashboard
- 🔐 **Admin Portal:** https://yourdomain.com/admin

**Next Steps:**
1. Monitor application logs regularly
2. Set up automated backups (daily recommended)
3. Configure email notifications
4. Test all user flows thoroughly
5. Update DNS if using custom domain

---

**Last Updated:** October 2025  
**Version:** 1.0.0  
**Platform:** Aceso Health Solutions
