# syntax=docker/dockerfile:1.7

# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app

# Prisma's query engine requires OpenSSL on Alpine
RUN apk add --no-cache openssl

# Install deps first for better layer caching.
# Use `npm install` instead of `npm ci` to tolerate cross-platform optional-dep
# entries that differ between npm 10 (Render) and npm 11 (local).
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

# Generate Prisma client (needs schema present)
COPY prisma ./prisma
RUN npx prisma generate

# Copy source and bundle with esbuild
COPY tsconfig.json prisma.config.ts ./
COPY server.ts ./
COPY src ./src
RUN npm run build

# ---- Runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
RUN apk add --no-cache openssl

# Copy installed deps (incl. generated Prisma client) and build artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Drop root privileges
USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:4000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Apply migrations before serving traffic. `prisma migrate deploy` is idempotent
# and safe to run on every container start, including Render restarts.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
