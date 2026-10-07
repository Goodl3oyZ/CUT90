# Cut 90 Planner - Production Deployment & Operations Guide

This guide details deploying Cut 90 Planner to a Linux VPS (Ubuntu/Debian) using Docker Compose and Caddy Reverse Proxy with automatic HTTPS TLS certificates, or via Cloudflare Tunnels.

---

## 1. Prerequisites & Environment Variables

### Server Requirements
* Linux VPS (Ubuntu 22.04 LTS recommended) with Docker & Docker Compose installed.
* Domain name pointing to VPS IP address (e.g. `cut90.yourdomain.com`).

### Environment Variables Table (`.env`)

| Variable Name | Default / Sample | Required | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | `file:data/cut90.db` | Yes | SQLite database connection string |
| `SESSION_SECRET` | `secret_32_chars...` | Yes | Secret key for signing session cookies |
| `ALLOW_SIGNUPS` | `true` | Yes | Set to `false` to close public registration |
| `INVITE_CODE` | `club90_vip` | Optional | Mandatory code required if signups closed |
| `PORT` | `3000` | No | Internal app port inside container |

---

## 2. Docker Compose & Caddy Setup

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  app:
    image: ghcr.io/goodl3oyz/cut90:latest
    container_name: cut90_app
    restart: always
    environment:
      - DATABASE_URL=file:/app/data/cut90.db
      - SESSION_SECRET=change_this_to_a_random_32_character_string
      - ALLOW_SIGNUPS=true
      - NODE_ENV=production
    volumes:
      - cut90_data:/app/data
    ports:
      - '127.0.0.1:3000:3000'

  caddy:
    image: caddy:2-alpine
    container_name: cut90_caddy
    restart: always
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - app

volumes:
  cut90_data:
  caddy_data:
  caddy_config:
```

### `Caddyfile`
```caddy
cut90.yourdomain.com {
    reverse_proxy app:3000

    encode gzip zstd

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        X-XSS-Protection "1; mode=block"
    }
}
```

---

## 3. First User Creation & Closing Signups

1. Launch application stack: `docker compose up -d`
2. Open `https://cut90.yourdomain.com/register` and create your administrative account.
3. Once registered, edit `.env` or `docker-compose.yml` to close open registration:
   ```env
   ALLOW_SIGNUPS=false
   ```
4. Restart app service: `docker compose up -d app`

---

## 4. Backup & Restore Procedures

### Database Backup
Run sqlite backup using the container volume path:
```bash
docker exec cut90_app sqlite3 /app/data/cut90.db ".backup '/app/data/backup_$(date +%F).db'"
```

### Database Restore
```bash
docker stop cut90_app
docker cp backup.db cut90_app:/app/data/cut90.db
docker start cut90_app
```

---

## 5. Cloudflare Tunnel Alternative

If your VPS is behind NAT or lacks a public static IPv4:
1. Install `cloudflared` on host server.
2. Run `cloudflared tunnel create cut90`.
3. Configure `config.yml`:
   ```yaml
   tunnel: <TUNNEL_UUID>
   credentials-file: /root/.cloudflared/<TUNNEL_UUID>.json

   ingress:
     - hostname: cut90.yourdomain.com
       service: http://localhost:3000
     - service: http_status:404
   ```
4. Run `cloudflared tunnel run cut90`.

---

## 6. Troubleshooting Guide

* **SQLITE_BUSY / Database Locked**: Ensure WAL mode is active (`PRAGMA journal_mode=WAL;`).
* **502 Bad Gateway in Caddy**: Verify container port binding (`127.0.0.1:3000`).
* **Session Expired Instantly**: Verify server clock is synchronized via `systemd-timesyncd`.
