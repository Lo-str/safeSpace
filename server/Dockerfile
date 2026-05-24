# syntax=docker/dockerfile:1.7

# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app

# Prisma's query engine requires OpenSSL on Alpine
RUN apk add --no-cache openssl

# Install deps first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

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
CMD ["node", "dist/server.js"]
