#!/bin/bash
set -e

DB_PATH="${DATABASE_PATH:-/data/app.db}"
BACKUP_DIR="/data/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/app_backup_${TIMESTAMP}.db"

mkdir -p "${BACKUP_DIR}"

if [ -f "${DB_PATH}" ]; then
  sqlite3 "${DB_PATH}" ".backup '${BACKUP_FILE}'"
  echo "Backup created: ${BACKUP_FILE}"

  # Keep only the last 14 copies
  ls -tp "${BACKUP_DIR}"/app_backup_*.db | tail -n +15 | xargs -I {} rm -- {} 2>/dev/null || true
  echo "Cleaned up old backups, maintaining latest 14 copies."
else
  echo "Database file ${DB_PATH} not found!"
  exit 1
fi
