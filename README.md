# Cut 90 Planner - Private-Club Performance Logbook

![Cut 90 Planner](/docs/screenshots/help-desktop-dark.png)

**Cut 90 Planner** is a production-ready, multi-user, mobile-first Progressive Web App (PWA) designed for 90-day fat-loss planning, daily tracking, and progress visualization. It combines scientific energy deficit formulas (Mifflin-St Jeor) with a restrained "private-club logbook" aesthetic, obsidian green-black dark theme, brushed brass accents, and full offline sync capabilities.

---

## 📸 Interface Screenshots

| Desktop View (Dark) | Mobile View (Dark) |
| :--- | :--- |
| ![Desktop Help](/docs/screenshots/help-desktop-dark.png) | ![Mobile Help](/docs/screenshots/help-mobile-dark.png) |
| ![Desktop Login](/docs/screenshots/login-desktop-dark.png) | ![Mobile Login](/docs/screenshots/login-mobile-dark.png) |

---

## ✨ Key Features

* **Scientific 90-Day Math Engine**: Mifflin-St Jeor BMR/TDEE calculations, dynamic step-down deficit algorithm, and safety ceiling warnings (1.0% body weight/week).
* **Private-Club Aesthetic**: Obsidian green-black dark theme, brushed brass metallic accents, Bodoni Moda display headings, Plus Jakarta Sans UI, and Noto Sans Thai typography.
* **100% WCAG AA Contrast Compliant**: Automated script-verified contrast ratios (> 4.5:1 body, > 3:1 UI).
* **Responsive Layout**: Mobile-first bottom tab bar + desktop left rail navigation (`SideRail`) with two-column dashboard.
* **Offline-First PWA**: Serwist Service Worker caching + IndexedDB (`idb`) queue for automatic re-sync when network reconnects.
* **Understandable Thai UI**: Plain Thai status sentences, remaining hints (`"เหลือ 42g"`), jargon replacement, popovers for BMR/TDEE, and dedicated `/help` center.
* **Data Security & Privacy**: Argon2id password hashing, HttpOnly session cookies, CSRF header validation, and strict SQL `user_id` multi-tenant data isolation.

---

## ⚡ Quick Start (Local Development)

### Prerequisites
* Node.js v20+ or v24+
* npm v10+

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/Goodl3oyZ/CUT90.git
cd CUT90

# 2. Install dependencies
npm install

# 3. Apply database migrations & seed demo user
npm run db:migrate
npm run seed

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
Demo Credentials: **Username**: `demo` | **Password**: `demo1234Password!`

---

## 📋 Available Scripts Table

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server on `http://localhost:3000` |
| `npm run build` | Builds production bundle |
| `npm run test` | Runs Vitest unit & integration test suite (12 tests) |
| `npm run lint` | Checks ESLint rule compliance |
| `npm run db:generate` | Generates Drizzle database migrations |
| `npm run db:migrate` | Applies database migrations |
| `npm run seed` | Seeds default administrator/demo user account |
| `npx tsx scripts/screenshots.ts` | Captures Playwright light & dark screenshots |

---

## 🔑 Environment Variables Table

| Key | Default | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `file:data/cut90.db` | SQLite database connection string |
| `SESSION_SECRET` | `cut90_super_secret...` | 32-character string for cookie signatures |
| `ALLOW_SIGNUPS` | `true` | Set `false` to close public registration |
| `INVITE_CODE` | `club90_vip` | Optional registration invitation code |

---

## 📚 Documentation Index

* 🎨 [Design System Documentation](/docs/DESIGN_SYSTEM.md) - Palette, contrast verification, typography scale, icon map.
* 📐 [Mathematical Formulas & Physiology](/docs/FORMULAS.md) - Mifflin-St Jeor worked examples, 7700 kcal rule.
* 🇹🇭 [User Guide (ภาษาไทย)](/docs/USER_GUIDE.th.md) - End-user manual, daily routine, PWA installation.
* 🏗️ [System Architecture Specification](/docs/ARCHITECTURE.md) - Folder map, request flow, ER diagram, PWA cache.
* 🔌 [REST API Reference](/docs/API.md) - 13 endpoint specifications with request/response samples.
* 🔒 [Security & Threat Mitigation](/docs/SECURITY.md) - Argon2id, CSRF, rate limiting, data isolation.
* 🚀 [Production Deployment Guide](/docs/DEPLOY.md) - VPS, Docker Compose, Caddy TLS, backup/restore.
* 🔍 [UI Audit Report](/docs/UI_AUDIT.md) - Audit findings and Before/After verification.
