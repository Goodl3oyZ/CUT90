# Multi-stage Dockerfile for Cut 90 Planner

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache python3 make g++ gcc
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Bundle seed script — install esbuild locally then bundle
RUN npm install --no-save esbuild && \
    node_modules/.bin/esbuild scripts/seed.ts \
      --bundle --platform=node --target=node20 \
      --format=cjs --outfile=/tmp/seed.js \
      --external:@node-rs/argon2 --external:libsql --external:@libsql/client

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3333
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_PATH="/data/app.db"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /data/backups && \
    chown -R nextjs:nodejs /data /app

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/migrations ./migrations
COPY --from=builder --chown=nextjs:nodejs /tmp/seed.js ./seed.js

# Native binaries that standalone/NFT misses — needed by seed.js
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@libsql ./node_modules/@libsql
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/libsql ./node_modules/libsql
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@node-rs ./node_modules/@node-rs

USER nextjs

EXPOSE 3333

CMD ["node", "server.js"]

