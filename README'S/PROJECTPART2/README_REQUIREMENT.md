# Safe Space — Final Assignment Deliverable

This file collects everything the final deployment assignment requires of the README: install / run / test instructions, Docker instructions, deployed URLs, the security checklist with reasoning, and the 5 reflection questions answered. The two earlier per-service READMEs ([`README_SERVER/`](../PROJECTPART1/README_SERVER/README_SERVER.md) and [`README-CLIENT/`](../PROJECTPART1/README-CLIENT/README-CLIENT.md)) are kept as-is from the previous module.

---

## Deployed URLs

| Service  | URL                                              |
| -------- | ------------------------------------------------ |
| Frontend | `https://<your-vercel-url>.vercel.app`           |
| Backend  | `https://<your-render-url>.onrender.com`         |
| Health   | `https://<your-render-url>.onrender.com/health`  |

> Replace the placeholders after the first deploy.

---

## How to install, run locally, and test

### Prerequisites

- Node.js 22+
- npm
- Docker + Docker Compose (only required for the full-stack local mode)
- An Auth0 tenant with one SPA application and one API (see [Auth0 setup](#auth0-setup))

### Option A — without Docker (per-service)

1. Copy [`server/.env.example`](../../server/.env.example) → `server/.env` and fill in:
   - `DATABASE_URL` (e.g. `postgresql://safespace:safespace@localhost:5433/safespace`)
   - `AUTH0_AUDIENCE`
   - `AUTH0_ISSUER_BASE_URL` (must end with `/`)
   - `CLIENT_ORIGIN=http://localhost:5173`
2. Copy [`client/.env.example`](../../client/.env.example) → `client/.env` and fill in `VITE_API_BASE_URL` + the three `VITE_AUTH0_*` values.
3. Make sure a Postgres instance is reachable (either local or `docker compose up -d db`).
4. Install, migrate, run:

```bash
cd server && npm install && npx prisma migrate deploy && npm run dev   # http://localhost:4000
cd client && npm install && npm run dev                                # http://localhost:5173
```

5. Tests:

```bash
cd server && npm test     # 13 integration tests
cd client && npm test     # 30 component + page tests
cd server && npm run typecheck
```

### Option B — with Docker (full stack)

1. Copy [`.env.example`](../../.env.example) → `.env` at the repo root and fill in Auth0 + Postgres values.
2. From the repo root:

```bash
docker compose up --build
```

Brings up:
- `db` — `postgres:16-alpine`, host port `5433`, named volume `db-data`
- `server` — applies `prisma migrate deploy` on start, serves on `http://localhost:4000`, healthcheck probes `/health`
- `client` — Vite build served by nginx on `http://localhost:5173`

---

## How to build and run with Docker

### Server image only

Multi-stage Alpine build, runs as the non-root `node` user. See [`server/Dockerfile`](../../server/Dockerfile).

```bash
docker build -t safespace-server ./server
docker run --rm -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e AUTH0_AUDIENCE="https://safe-space-api" \
  -e AUTH0_ISSUER_BASE_URL="https://<your-tenant>.auth0.com/" \
  -e CLIENT_ORIGIN="https://<your-vercel-url>.vercel.app" \
  safespace-server
```

The container's `CMD` runs `npx prisma migrate deploy && node dist/server.js`, so migrations apply idempotently on every start.

### Client image only

Two-stage: Node 22 Alpine builds Vite, then `nginx:alpine` serves the static `dist/`. See [`client/Dockerfile`](../../client/Dockerfile).

```bash
docker build -t safespace-client \
  --build-arg VITE_API_BASE_URL="https://<render-url>.onrender.com" \
  --build-arg VITE_AUTH0_DOMAIN="<tenant>.auth0.com" \
  --build-arg VITE_AUTH0_CLIENT_ID="<client-id>" \
  --build-arg VITE_AUTH0_AUDIENCE="https://safe-space-api" \
  ./client

docker run --rm -p 8080:80 safespace-client
```

Vite envs are passed as `--build-arg` because Vite bakes them at build time. The nginx config ([`client/nginx.conf`](../../client/nginx.conf)) adds an SPA fallback (so React Router routes resolve on direct load), a 1-year cache on hashed assets, and `X-Content-Type-Options` / `X-Frame-Options` / `Referrer-Policy` headers.

### Full stack via compose

Already covered above under "Option B". `docker compose up --build` is the one-liner.

---

## Auth0 setup

1. Create one tenant in the region closest to your users.
2. Create an **API**. Identifier becomes `AUTH0_AUDIENCE`. Signing algorithm: RS256.
3. Create a **Single Page Application**. Domain becomes `VITE_AUTH0_DOMAIN`, Client ID becomes `VITE_AUTH0_CLIENT_ID`.
4. In the SPA's Settings, add both `http://localhost:5173` and the Vercel URL (comma-separated) to **Allowed Callback URLs**, **Allowed Logout URLs**, **Allowed Web Origins**, and **Allowed Origins (CORS)**.

---

## Environment variables reference

| Var                         | Where set                          | Notes                                                                                  |
| --------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `DATABASE_URL`              | server/.env, Render (auto-wired)   | Postgres connection string                                                             |
| `PORT`                      | server/.env, Render (injected)     | Defaults to `4000`                                                                     |
| `AUTH0_AUDIENCE`            | server/.env, Render                | Identifier of your Auth0 API                                                           |
| `AUTH0_ISSUER_BASE_URL`     | server/.env, Render                | `https://<your-tenant>.auth0.com/` (trailing slash required)                           |
| `CLIENT_ORIGIN`             | server/.env, Render                | Comma-separated CORS allow-list. Production includes the Vercel URL and optionally localhost. |
| `VITE_API_BASE_URL`         | client/.env, Vercel                | Render URL in production, `http://localhost:4000` locally                              |
| `VITE_AUTH0_DOMAIN`         | client/.env, Vercel                | Auth0 tenant domain without protocol                                                   |
| `VITE_AUTH0_CLIENT_ID`      | client/.env, Vercel                | Auth0 SPA Client ID                                                                    |
| `VITE_AUTH0_AUDIENCE`       | client/.env, Vercel                | Same value as backend `AUTH0_AUDIENCE`                                                 |

`.env*` files are gitignored. Production secrets live only in the Render and Vercel dashboards. CI uses GitHub Secrets.

---

## Security checklist

Each item from the assignment's production security checklist, with the actual decision and reasoning.

### 1. No secrets in the repository

All secrets live in gitignored `.env` files or the Render / Vercel dashboards. The repo only contains `.env.example` templates that document the variable shape. CI uses GitHub Secrets in [`.github/workflows/test.yml`](../../.github/workflows/test.yml). [`server/.dockerignore`](../../server/.dockerignore) and [`client/.dockerignore`](../../client/.dockerignore) exclude every `.env*` from the Docker build context so secrets can't end up baked into images.

### 2. CORS is restricted to the deployed frontend URL

[`server/src/app.ts`](../../server/src/app.ts) parses `CLIENT_ORIGIN` as a comma-separated allow-list and hands the array to `cors()`. No wildcards. Production sets exactly the Vercel URL (plus localhost when we want to test the local frontend against the prod backend). Anything else is rejected at the browser preflight.

### 3. Tokens are never stored in `localStorage`

[`client/src/App.tsx`](../../client/src/App.tsx) configures `Auth0Provider` with `cacheLocation="memory"` and `useRefreshTokens={false}`. Access tokens live only in JavaScript memory and are wiped on page refresh — a new one is fetched silently via the Auth0 session cookie on the Auth0 domain, never via our domain. We avoid refresh tokens because storing them durably would mean either `localStorage` (rejected by this checklist) or backend-managed cookies plus CSRF defenses we don't need for this app's session length.

### 4. `withCredentials: true` is used on all authenticated frontend requests

Every fetch in [`client/src/services/api.ts`](../../client/src/services/api.ts) sets `credentials: "include"`. The matching server-side flag is `credentials: true` in the `cors()` config, scoped to the same allow-list as item 2. We use Bearer tokens (Auth0 SPA flow) rather than session cookies, so the flag is technically a no-op today — but it's included for strict compliance and so any future cookie-based flow works without further client changes.

### 5. Docker image does not contain `.env` files or `node_modules` from host

[`server/.dockerignore`](../../server/.dockerignore) and [`client/.dockerignore`](../../client/.dockerignore) exclude `node_modules`, every `.env*` file, build outputs, tests, logs, and git metadata from the build context. Dependencies install fresh inside the builder stage from `package-lock.json`, so nothing leaks from the developer's machine. The multi-stage layout also discards build tooling (esbuild, Prisma CLI dev pieces) from the final runtime image.

### 6. The deployed backend uses HTTPS

Render terminates TLS at its load balancer for every Web Service — there's no opt-in. We also call `helmet()` in [`server/src/app.ts`](../../server/src/app.ts) which adds `Strict-Transport-Security` (HSTS) so browsers refuse to downgrade. Helmet's defaults also cover `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and the Cross-Origin-* family.

### 7. Authentication callbacks use the deployed URL, not localhost

The Auth0 SPA application's Allowed Callback / Logout / Web Origin / CORS Origin lists include the Vercel URL alongside `http://localhost:5173`. Vite injects the right `VITE_AUTH0_*` env vars at build time, so the production bundle never references localhost. We verified the redirect lands on `https://<vercel-url>.vercel.app/...` after login from the deployed site.

---

## Reflection

### 1. Why did you choose this deployment platform? What were the alternatives you considered?

Render + Vercel is the assignment's recommended stack and we had no reason to deviate. Render gives us a managed Postgres on the same provider as the backend (low latency, one dashboard), [`render.yaml`](../../render.yaml) for Infrastructure-as-Code, and free TLS. Vercel auto-detects Vite, has zero-config SPA rewrites via [`client/vercel.json`](../../client/vercel.json), and a generous free tier. Alternatives we briefly considered: **Railway** (nicer DX but the $5/month free credit can run out mid-grading), **Fly.io** (better global distribution but a steeper learning curve via `fly.toml`), **Netlify** / **Cloudflare Pages** (excellent for static sites but weaker Docker support for the backend), **DigitalOcean App Platform** (more of a generalist).

### 2. What challenges did you face with Docker? How did you solve them?

Three non-obvious issues:

- **ESM extension mismatch.** The server uses `"type": "module"` but the existing source uses extensionless relative imports. Node's ESM resolver rejects those at runtime; `tsx` only tolerates them in dev. Rather than touch every import we use **esbuild** in the builder stage to bundle the whole server into a single ESM file (`dist/server.js`), resolving imports at build time. Zero source changes and a tiny runtime image.
- **Prisma on Alpine.** Prisma's query engine binary needs OpenSSL inside the Alpine builder; without it `prisma generate` fails to detect a target. We added `apk add --no-cache openssl` to both stages. The schema's default `binaryTargets` auto-detects `linux-musl-openssl-3.0.x` because `prisma generate` runs inside the Alpine builder.
- **Port conflict.** A system Postgres was already listening on `127.0.0.1:5432`, so the compose service publishes `5433:5432`. The container internal port stays 5432 so other services in the compose network still reach it via `db:5432`.

Smaller ones: Vite envs must be passed as `--build-arg` because they're baked at build time, not runtime; and the React Router SPA needs an `nginx try_files ... /index.html` fallback for direct loads of `/places/:id`.

### 3. How did you handle environment variables and secrets in production vs locally?

Three layers, each with a single source of truth:

- **Per-service `.env`** (`server/.env`, `client/.env`) for non-Docker local dev — gitignored.
- **Root `.env`** consumed by `docker-compose` for full-stack local dev — also gitignored. Mirrors the per-service values plus Postgres credentials. Copy from [`.env.example`](../../.env.example).
- **Hosting dashboards** in production: Render for the backend (`AUTH0_*`, `CLIENT_ORIGIN`, `DATABASE_URL` auto-wired), Vercel for the frontend (`VITE_API_BASE_URL`, three `VITE_AUTH0_*`).

[`render.yaml`](../../render.yaml) declares which keys exist and which are auto-wired (`DATABASE_URL` from the managed Postgres reference) vs `sync: false` (everything sensitive, set manually in the dashboard). Nothing sensitive ever round-trips through git, and the only "configuration" committed alongside code is shape information in `.env.example` files.

### 4. What would you do differently if you had one more week?

- **Seed data** so the deployed Browse page shows real spaces and reviews on first load.
- **Sync Auth0 users to the backend `User` table** on first login so reviews can attribute authors properly. Right now `Review.userId` is nullable for that reason and the frontend hides author metadata.
- **Tighten `helmet()`'s Content Security Policy** with an explicit allow-list once we know exactly which domains the SPA hits.
- **Rate limiting** on POST endpoints (`express-rate-limit`).
- **End-to-end tests** against the deployed URL via Playwright — currently we only have integration tests for the API and unit tests for components.
- **Backend `Space` schema additions** (`venueType`, `tags`, `imageUrl`) plus a migration, so the existing Browse filter UI has real data to filter on.

### 5. How did you ensure that authentication still works after deployment?

- **`audience` in the SPA configuration.** Without it, `getAccessTokenSilently` returns an opaque token instead of a JWT and the backend rejects every authenticated call as 401. We added `audience: import.meta.env.VITE_AUTH0_AUDIENCE` to [`Auth0Provider`](../../client/src/App.tsx) before the first deploy.
- **Allowed Callback URLs** in the Auth0 dashboard include both `http://localhost:5173` and the Vercel URL, so login works in either environment without flipping a flag.
- **JWKS-based verification.** The backend uses Auth0's published JWKS endpoint for RS256 signature verification (`express-oauth2-jwt-bearer`) — no shared secret to deploy, no key rotation overhead.
- **Unauthenticated `/health`** so Render's probe doesn't need a token to mark the service healthy.
- **CORS plus `credentials: true`** scoped to the same origin allow-list the SPA actually deploys to.

After the first deploy we verified end-to-end: visit the Vercel URL, click Login, get redirected to the Auth0 tenant, log in, get redirected back, submit a review — and the backend stored it.
