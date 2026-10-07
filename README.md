# Cut 90 Planner 🥊

Production-ready, multi-user, mobile-first Progressive Web App (PWA) for 90-day fat-loss planning and daily tracking. Built with Next.js App Router, TypeScript, SQLite, Drizzle ORM, and Argon2id authentication.

---

## 🚀 Features

- **Custom Authentication**: Pure Argon2id + sliding 30-day session cookies. Brute-force protection, rate limiting, CSRF validation. No BaaS or 3rd-party identity providers.
- **Scientific Plan Engine**: Mifflin-St Jeor BMR & TDEE, 90-day daily calorie & macro targets (Protein 2.1g/kg, Fat 0.8g/kg, Carb remainder), safety calorie floors, 7-day status pills (`ahead`, `on_track`, `behind`), warnings, and recalibration checkpoints.
- **PWA & Offline Queue**: Serwist service worker app shell caching, IndexedDB offline write queue with automatic background sync upon reconnection.
- **Thai Language UI**: Thai copy for UI interactions, English code & comments.
- **Deploy Ready**: Docker multi-stage build, docker-compose.yml with Caddy automatic HTTPS, and daily SQLite backup rotation.

---

## 🛠️ Stack

- **Framework**: Next.js 14 (App Router) + TypeScript Strict
- **Database**: SQLite via LibSQL / better-sqlite3 (WAL mode, Foreign Keys ON) + Drizzle ORM
- **Auth**: `@node-rs/argon2` + HttpOnly Lax session cookies
- **Styling**: Tailwind CSS + Google Fonts (Barlow Condensed, DM Sans, Noto Sans Thai)
- **Validation & Testing**: Zod, Vitest (Unit & API tests), Playwright (E2E smoke test)
- **DevOps**: Docker, docker-compose, Caddy, Backup cron script

---

## 💻 Local Development Setup

### 1. Installation & Environment
```bash
git clone <repo-url>
cd Cut90_Planner
cp .env.example .env
npm install
```

### 2. Database Migration & Seeding
```bash
# Run database migrations
npm run db:migrate

# Seed demo user ("demo" / "demo1234Password!") and 7-day weight logs
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Run Test Suites
```bash
# Unit & API Integration tests
npm run test

# E2E Smoke test
npm run test:e2e
```

---

## 🛠️ User Management CLI

```bash
# List all registered users
npm run user:list

# Reset user password CLI (generates random 12-character password)
npm run user:reset-password -- <username>
```

---

## 🐳 Production VPS Deployment (Docker + Caddy)

### 1. Prerequisites
- Linux VPS (Ubuntu/Debian) with Docker and Docker Compose installed.
- Domain name pointed (DNS A/AAAA record) to your VPS IP address.

### 2. Environment Configuration
Create `.env` on your VPS:
```env
SESSION_COOKIE_NAME=cut90_session
ALLOW_SIGNUP=true
INVITE_CODE=SecretInvite123
DATABASE_PATH=/data/app.db
APP_ORIGIN=https://cut90.yourdomain.com
APP_DOMAIN=cut90.yourdomain.com
```

### 3. Start Containers
```bash
docker compose up -d --build
```
Caddy will automatically acquire a free TLS certificate via Let's Encrypt / ZeroSSL.

### 4. Close Signups After Initial Setup
After creating user accounts, set `ALLOW_SIGNUP=false` in `.env` and reload:
```bash
docker compose restart app
```

---

## ☁️ Alternative: Deployment Behind Cloudflare Tunnel (No Public IP)

If your home server or VPS does not have a public IPv4 address:

1. Install Cloudflare Tunnel (`cloudflared`).
2. Run `cloudflared tunnel create cut90-tunnel`.
3. Configure `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: <tunnel-id>
   credentials-file: /root/.cloudflared/<tunnel-id>.json
   ingress:
     - hostname: cut90.yourdomain.com
       service: http://localhost:3000
     - service: http_status:404
   ```
4. Run `docker compose up -d app` (without Caddy) and run `cloudflared tunnel run cut90-tunnel`.

---

## 💾 Database Backup & Restore Instructions

### Automatic Daily Backup Script
Execute `scripts/backup.sh` via host cron or cron container daily:
```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
```
This script creates a point-in-time SQLite online backup (`sqlite3 .backup`) in `/data/backups` and retains the last 14 daily copies.

### Restore Database
To restore from a backup file:
```bash
# 1. Stop the application container
docker compose stop app

# 2. Restore database file
cp /data/backups/app_backup_20261001_000000.db /data/app.db

# 3. Start application container
docker compose start app
```

---

## 📱 Installing PWA on Mobile Devices

### iOS (Safari)
1. Open `https://cut90.yourdomain.com` in Safari.
2. Tap the **Share** icon (square with upward arrow).
3. Select **Add to Home Screen** (เพิ่มไปยังหน้าจอโฮม).

### Android (Chrome / Edge)
1. Open `https://cut90.yourdomain.com` in Chrome.
2. Tap the **3 dots menu** top right.
3. Select **Install app** or **Add to Home Screen** (ติดตั้งแอป / เพิ่มลงในหน้าจอโฮม).

---

## 📄 License
MIT License.
