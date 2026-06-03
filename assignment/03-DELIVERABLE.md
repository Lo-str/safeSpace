# Safe Space

> 💡 **Reading tip** — open this file in VSCode's markdown preview for better rendering: `Ctrl+Shift+V` on Windows/Linux, `Cmd+Shift+V` on Mac.

A platform for underrepresented groups. Anyone can browse and read reviews; authenticated users can submit new spaces and reviews. React + TypeScript SPA, Express + Prisma API, PostgreSQL, Auth0 for identity.

> 💡 This README is the final assignment deliverable for the deployment module. It covers install / run / test / Docker / Auth0 / security / reflection, with an assignment checklist at the end.

---

## Deployed URLs

| Service  | URL                                                                                      |
| -------- | ---------------------------------------------------------------------------------------- |
| Frontend | [https://safe-space-9q9k.vercel.app](https://safe-space-9q9k.vercel.app)                 |
| Backend  | [https://safespace-server-7qbc.onrender.com](https://safespace-server-7qbc.onrender.com) |
| Health   | [/health](https://safespace-server-7qbc.onrender.com/health) → `{ "status": "ok" }`      |

---

## Tech stack

| Layer    | Tech                                                           |
| -------- | -------------------------------------------------------------- |
| Server   | Node.js 22, Express 5, TypeScript, Prisma, esbuild bundle      |
| Client   | React 18, TypeScript, Vite                                     |
| Database | PostgreSQL 16                                                  |
| Auth     | Auth0 (RS256 JWT, PKCE, refresh tokens in memory)              |
| Tests    | Vitest + Supertest (server), Vitest + Testing Library (client) |
| CI/CD    | GitHub Actions                                                 |
| Host     | Render (Docker web service + managed Postgres), Vercel (SPA)   |

---

## Quick start

### Prerequisites

- Node.js 22 or newer and npm
- Docker + Docker Compose (only for the full-stack local mode)
- An Auth0 tenant — see [Auth0 setup](#auth0-setup)

### Option A — without Docker

1. Copy [server/.env.example](../server/.env.example) → `server/.env` and fill:
   - `DATABASE_URL` (e.g. `postgresql://safespace:safespace@localhost:5433/safespace`)
   - `AUTH0_AUDIENCE`
   - `AUTH0_ISSUER_BASE_URL`
   - `CLIENT_ORIGIN=http://localhost:5173`
2. Copy [client/.env.example](../client/.env.example) → `client/.env` and fill `VITE_API_BASE_URL` + the three `VITE_AUTH0_*` values.
3. Make sure Postgres is reachable (either local or `docker compose up -d db`).
4. Install, migrate, run:

```bash
cd server && npm install && npx prisma migrate deploy && npm run dev   # http://localhost:4000
cd client && npm install && npm run dev                                # http://localhost:5173
```

### Option B — with Docker

1. Copy [.env.example](../.env.example) → `.env` at the repo root and fill Auth0 + Postgres values.
2. From the repo root:

```bash
docker compose up --build
```

Brings up three services:

- `db` — `postgres:16-alpine`, host port `5433`, named volume `db-data`
- `server` — runs `prisma migrate deploy` then `node dist/server.js`, listens on `:4000`, `/health` probed every 10 s
- `client` — Vite build served by `nginx:alpine` on `:5173`

---

## Running tests

```bash
cd server && npm test       # 19 tests across 5 files
cd client && npm test       # 30 tests across 7 files
cd server && npm run typecheck
```

The server suite covers auth-middleware behaviour, the spaces controller, CORS allow-list enforcement, and the `/health` endpoint. The client suite covers Browse / Profile / Cards / Review pages plus the shared `PlaceList` component.

### Test evidence

See [04-TESTING.md](04-TESTING.md) for the full per-file breakdown — every backend and frontend test listed, with terminal-output screenshots for each, plus the GitHub Actions runs proving the suites pass in CI.

---

## Build and run with Docker

All Dockerfiles live in [docker/](../docker/). Build contexts stay per-service (`./server`, `./client`) so each service's `.dockerignore` controls exactly what enters its image.

### Server image only

Multi-stage Alpine build; the runtime stage runs as the non-root `node` user. See [docker/server.Dockerfile](../docker/server.Dockerfile).

```bash
docker build -t safespace-server -f docker/server.Dockerfile ./server

docker run --rm -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e AUTH0_AUDIENCE="https://safe-space-api" \
  -e AUTH0_ISSUER_BASE_URL="https://<tenant>.auth0.com/" \
  -e CLIENT_ORIGIN="https://safe-space-9q9k.vercel.app" \
  safespace-server
```

The container's `CMD` runs `npx prisma migrate deploy && node dist/server.js`, so migrations apply idempotently on every start.

### Client image only

Two-stage: Node 22 Alpine builds Vite, then `nginx:alpine` serves the static `dist/`. See [docker/client.Dockerfile](../docker/client.Dockerfile) and [client/nginx.conf](../client/nginx.conf).

```bash
docker build -t safespace-client -f docker/client.Dockerfile \
  --build-arg VITE_API_BASE_URL="https://safespace-server-7qbc.onrender.com" \
  --build-arg VITE_AUTH0_DOMAIN="<tenant>.auth0.com" \
  --build-arg VITE_AUTH0_CLIENT_ID="<client-id>" \
  --build-arg VITE_AUTH0_AUDIENCE="https://safe-space-api" \
  ./client

docker run --rm -p 8080:80 safespace-client
```

Vite envs are passed as `--build-arg` because Vite bakes them at build time. The nginx config adds an SPA fallback (so React Router routes resolve on direct load), a 1-year cache on hashed assets, and three security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy.

### Full stack via compose

Covered above in [Option B](#option-b--with-docker-full-stack). `docker compose up --build` is the one-liner.

---

## Auth0 setup

1. Create one tenant in the region closest to your users.
2. Create an **API**. Identifier becomes `AUTH0_AUDIENCE`. Signing algorithm: RS256. Enable **Allow Offline Access** so refresh tokens work.
3. Create a **Single Page Application**. Domain becomes `VITE_AUTH0_DOMAIN`, Client ID becomes `VITE_AUTH0_CLIENT_ID`.
4. In the SPA's Settings, add both `http://localhost:5173` and the Vercel URL (comma-separated) to **Allowed Callback URLs**, **Allowed Logout URLs**, **Allowed Web Origins**, and **Allowed Origins (CORS)**.

---

## Environment variables

| Var                     | Where set                          | Notes                                                                                       |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | `server/.env`, Render (auto-wired) | Postgres connection string                                                                  |
| `PORT`                  | `server/.env`, Render (injected)   | Defaults to `4000`                                                                          |
| `AUTH0_AUDIENCE`        | `server/.env`, Render              | Identifier of your Auth0 API                                                                |
| `AUTH0_ISSUER_BASE_URL` | `server/.env`, Render              | `https://<tenant>.auth0.com/` (trailing slash required)                                     |
| `CLIENT_ORIGIN`         | `server/.env`, Render              | Comma-separated CORS allow-list. Production includes the Vercel URL + optionally localhost. |
| `VITE_API_BASE_URL`     | `client/.env`, Vercel              | Render URL in production, `http://localhost:4000` locally                                   |
| `VITE_AUTH0_DOMAIN`     | `client/.env`, Vercel              | Auth0 tenant domain without protocol                                                        |
| `VITE_AUTH0_CLIENT_ID`  | `client/.env`, Vercel              | Auth0 SPA Client ID                                                                         |
| `VITE_AUTH0_AUDIENCE`   | `client/.env`, Vercel              | Same value as backend `AUTH0_AUDIENCE`                                                      |

> ❗ `.env*` files are gitignored. Production secrets live only in the Render and Vercel dashboards. CI uses GitHub Secrets.

---

## Security

Each item below maps directly to the assignment's production security checklist, with the actual implementation and reasoning.

### 1. No secrets in the repository

All secrets live in gitignored `.env` files or the Render / Vercel dashboards. The repo only contains `.env.example` templates that document the variable shape. CI uses GitHub Secrets in [.github/workflows/server.yml](../.github/workflows/server.yml). [server/.dockerignore](../server/.dockerignore) and [client/.dockerignore](../client/.dockerignore) exclude every `.env*` from the build context so secrets can't end up baked into images.

### 2. CORS is restricted to the deployed frontend URL

[server/src/app.ts](../server/src/app.ts) parses `CLIENT_ORIGIN` as a comma-separated allow-list and hands the array to `cors()`. No wildcards. Production sets exactly the Vercel URL (plus localhost when I want to test the local frontend against the prod backend). Anything else is rejected at the browser preflight. The [cors.test.ts](../server/tests/integration/cors.test.ts) integration test asserts both behaviours: allowed origins are echoed in `Access-Control-Allow-Origin`, disallowed origins are not.

### 3. Tokens are never stored in localStorage

[client/src/App.tsx](../client/src/App.tsx) configures `Auth0Provider` with `cacheLocation="memory"`. Access and refresh tokens live only in JavaScript memory and are wiped on full page refresh — a new session is established by redirecting to Auth0. See the [Why in-memory token cache](#why-in-memory-token-cache) section for the trade-offs.

### 4. credentials: "include" is used on all authenticated frontend requests

Every fetch in [client/src/services/api.ts](../client/src/services/api.ts) sets `credentials: "include"`. On the server, the matching flag is `credentials: true` in the `cors()` config, scoped to the same allow-list as item 2.

The app currently sends auth via Bearer tokens (Auth0 SPA flow), not cookies, so this flag does not strictly do anything today. I include it anyway — first because the assignment requires it, and second because if I ever switch to a cookie-based session, the client side will already be correct.

### 5. Docker image does not contain .env files or node_modules from host

[server/.dockerignore](../server/.dockerignore) and [client/.dockerignore](../client/.dockerignore) exclude `node_modules`, every `.env*` file, build outputs, tests, logs, and git metadata from the build context. Dependencies install fresh inside the builder stage from `package-lock.json`, so nothing leaks from the developer's machine. The multi-stage layout also discards build tooling (esbuild, Prisma CLI dev pieces) from the final runtime image.

### 6. The deployed backend uses HTTPS

Render terminates TLS at its load balancer for every Web Service — there's no opt-in. I also call `helmet()` in [server/src/app.ts](../server/src/app.ts) which adds the Strict-Transport-Security header (HSTS), so browsers refuse to downgrade to HTTP. Helmet's defaults also cover X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and the Cross-Origin-\* family.

### 7. Authentication callbacks use the deployed URL, not localhost

The Auth0 SPA application's Allowed Callback / Logout / Web Origin / CORS Origin lists include the Vercel URL alongside `http://localhost:5173`. Vite injects the right `VITE_AUTH0_*` env vars at build time, so the production bundle never references localhost. I verified the redirect lands on `https://safe-space-9q9k.vercel.app/...` after login from the deployed site.

---

## Why in-memory token cache

> 💡 The assignment requires **"no tokens in `localStorage`"**. This section explains the choice I landed on and the trade-offs.

I configure Auth0 with `cacheLocation="memory"` and `useRefreshTokens={true}`. That means:

| Storage option      | XSS exposure | CSRF exposure                 | Persists across refresh | Persists across tabs |
| ------------------- | ------------ | ----------------------------- | ----------------------- | -------------------- |
| `localStorage`      | **High**     | None                          | Yes                     | Yes                  |
| `sessionStorage`    | **High**     | None                          | Yes (same tab)          | No                   |
| Cookies (HttpOnly)  | Low          | **High** without CSRF defence | Yes                     | Yes                  |
| **Memory (chosen)** | **Low**      | None                          | No — re-login required  | No                   |

Memory storage minimises the impact of a cross-site scripting (XSS) attack. If malicious code somehow runs in the SPA, it cannot read tokens out of any place it can inspect — not `window.localStorage`, not `document.cookie`, not `sessionStorage`. The tokens only exist inside the Auth0 SDK, locked away in JavaScript memory that the rest of the page cannot reach.

The trade-off is that a hard refresh or a new tab loses the session. I accept that for two reasons:

- The re-login is fast. It uses the Auth0 session cookie that lives on Auth0's own domain (not mine), so the user just sees a brief redirect rather than a full login form.
- I explicitly enabled `useRefreshTokens` and "Allow Offline Access" on the Auth0 API, which keeps the in-memory session alive without forcing a redirect mid-session. This mattered for Firefox: its Enhanced Tracking Protection blocks the third-party cookies used by Auth0's silent-renew iframe, so the refresh-token path is what makes the app actually work in Firefox.

The refresh tokens themselves never touch `localStorage` either — the Auth0 SDK keeps them in memory alongside the access token.

---

## CI/CD

Three workflows in [.github/workflows/](../.github/workflows/):

| Workflow     | Trigger     | What it does                                                                              |
| ------------ | ----------- | ----------------------------------------------------------------------------------------- |
| `server.yml` | PR → main   | Server vitest suite (19 tests) — blocks merge if red                                      |
| `client.yml` | PR → main   | Client vitest suite (30 tests) — blocks merge if red                                      |
| `deploy.yml` | Push → main | Re-runs both suites, then on green deploys server via Render hook + client via Vercel CLI |

### Deploy gate (Pattern A)

The assignment asks for "auto-deploys on push". I took the production-grade interpretation: **every push to `main` deploys automatically, but only after the test suites pass on the GitHub Actions runner**. Render's and Vercel's native auto-deploy is suppressed so they can't race the gate:

- **Render** — native Auto-Deploy is **off** (Service → Settings → Build & Deploy). The `deploy-server` job in [deploy.yml](../.github/workflows/deploy.yml) `curl`s a Render Deploy Hook stored as the `RENDER_DEPLOY_HOOK` secret. That's the only path the backend has to production.
- **Vercel** — Vercel doesn't expose a clean "disable production auto-deploy" toggle, and its **Ignored Build Step** runs for deploy-hook builds too, so I switched to the Vercel CLI. The `deploy-client` job uses `vercel pull` / `vercel build --prod` / `vercel deploy --prebuilt --prod` authenticated with three secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Native Git pushes are blocked by an Ignored Build Step (`[ "$VERCEL_GIT_COMMIT_REF" = "main" ]`), which exits 0 on `main` and tells Vercel to cancel the build.

**Visible side-effect: two deployment entries per commit on Vercel** — one Canceled (Git push, blocked by the gate) and one Ready (CLI, only created after tests pass). That's the gate working, not a bug:

![Vercel Deployments showing a Canceled Git-push entry and a Ready CLI entry for the same commit](media/vercelDeploy.png)

> 💡 If you fork this repo, replicate the gate by:
>
> 1. turning Render Auto-Deploy off + creating a Deploy Hook
> 2. Adding the four secrets (`RENDER_DEPLOY_HOOK`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) to GitHub
> 3. Pasting `[ "$VERCEL_GIT_COMMIT_REF" = "main" ]` into Vercel → Settings → Build and Deployment → Ignored Build Step.

---

## Reflection

### 1. Why did I choose this deployment platform? What were the alternatives?

Render + Vercel is the assignment's recommended stack. Render gave me a managed PostgreSQL database on the same provider as the backend (so low latency between them, and one dashboard to manage everything), a configuration file ([render.yaml](../render.yaml)) that describes the entire setup as code, and free TLS encryption. Vercel auto-detected my Vite-based frontend, handled single-page-app URL rewrites with zero configuration via [client/vercel.json](../client/vercel.json), and has a free tier.

Alternatives:

- **Railway** — friendlier developer experience, but its small monthly free credit can run out mid-grading.
- **Fly.io** — better global distribution. Steeper learning curve through its fly.toml config.
- **Netlify** and **Cloudflare Pages** — excellent for static sites. Weaker Docker support for the backend.
- **DigitalOcean App Platform** — more general-purpose option. Less specialised for the frontend-plus-backend shape of my project.

### 2. What challenges did I face with Docker? How did I solve them?

- **ESM extension mismatch.** The server uses `"type": "module"` but the existing source uses extensionless relative imports. Node's ESM resolver rejects those at runtime; the tsx dev runner only tolerates them in dev. Rather than touch every import I use **esbuild** in the builder stage to bundle the whole server into a single ESM file (`dist/server.js`), resolving imports at build time. Zero source changes and a tiny runtime image.
- **Prisma on Alpine.** Prisma's query engine binary needs OpenSSL inside the Alpine builder; without it `prisma generate` fails to detect a target. I added `apk add --no-cache openssl` to both stages. The schema's default `binaryTargets` auto-detects `linux-musl-openssl-3.0.x` because `prisma generate` runs inside the Alpine builder.
- **Port conflict.** A system Postgres was already listening on `127.0.0.1:5432`, so the compose service publishes `5433:5432`. The container internal port stays `5432` so other services in the compose network still reach it via `db:5432`.

Smaller ones: Vite envs must be passed as `--build-arg` because they're baked at build time, not runtime; and the React Router SPA needs an `nginx try_files ... /index.html` fallback for direct loads of `/places/:id`.

### 3. How did I handle environment variables and secrets in production vs locally?

Three layers, each with a single source of truth:

- **Per-service `.env`** (`server/.env`, `client/.env`) for non-Docker local dev — gitignored.
- **Root `.env`** consumed by `docker-compose` for full-stack local dev — also gitignored. Mirrors the per-service values plus Postgres credentials. Copy from [.env.example](../.env.example).
- **Hosting dashboards** in production: Render for the backend (`AUTH0_*`, `CLIENT_ORIGIN`, `DATABASE_URL` auto-wired), Vercel for the frontend (`VITE_API_BASE_URL`, three `VITE_AUTH0_*`).

[render.yaml](../render.yaml) declares which keys exist and which are auto-wired (`DATABASE_URL` from the managed Postgres reference) vs `sync: false` (everything sensitive, set manually in the dashboard). Nothing sensitive ever round-trips through git, and the only "configuration" committed alongside code is shape information in `.env.example` files.

### 4. What would I do differently if I had one more week?

- **Seed data** so the deployed Browse page shows real spaces and reviews on first load.
- **Sync Auth0 users to the backend `User` table** on first login so reviews can attribute authors properly. Right now `Review.userId` is nullable for that reason and the frontend hides author metadata.
- **Tighten `helmet()`'s Content Security Policy** with an explicit allow-list once I know exactly which domains the SPA hits.
- **Rate limiting** on POST endpoints, via the express-rate-limit middleware.
- **End-to-end tests** against the deployed URL via Playwright — currently I only have integration tests for the API and unit tests for components.
- **Backend `Space` schema additions** (`venueType`, `tags`, `imageUrl`) plus a migration, so the existing Browse filter UI has real data to filter on.

### 5. How did I ensure that authentication still works after deployment?

- **`audience` in the SPA configuration.** Without it, `getAccessTokenSilently` returns an opaque token instead of a JWT and the backend rejects every authenticated call as 401. I added `audience: import.meta.env.VITE_AUTH0_AUDIENCE` to [Auth0Provider](../client/src/App.tsx) before the first deploy.
- **Allowed Callback URLs** in the Auth0 dashboard include both `http://localhost:5173` and the Vercel URL, so login works in either environment without flipping a flag.
- **JWKS-based verification.** The backend uses Auth0's published JWKS endpoint for RS256 signature verification, via the express-oauth2-jwt-bearer middleware — no shared secret to deploy, no key rotation overhead.
- **Unauthenticated `/health`** so Render's probe doesn't need a token to mark the service healthy. Asserted by [health.test.ts](../server/tests/integration/health.test.ts).
- **CORS plus `credentials: true`** scoped to the same origin allow-list the SPA actually deploys to.
- **Firefox-specific fix.** Firefox's Enhanced Tracking Protection blocks third-party cookies, which broke Auth0's silent-renew iframe. I switched to refresh tokens (`useRefreshTokens: true`) + enabled Allow Offline Access on the Auth0 API, so renewal no longer depends on third-party cookies.

After the first deploy I verified end-to-end: visit the Vercel URL, click Login, get redirected to the Auth0 tenant, log in, get redirected back, submit a review — and the backend stored it.

---

## Assignment checklist

### Deployment

- [x] Backend deployed and reachable over HTTPS
- [x] Frontend deployed and reachable over HTTPS
- [x] Managed Postgres provisioned and reachable from backend
- [x] `/health` endpoint returns `200` and is used by the platform's health probe
- [x] Deployment is reproducible from [render.yaml](../render.yaml) (Render Blueprint)

### Docker

- [x] Server Dockerfile uses multi-stage build
- [x] Server runtime image runs as a non-root user (`node`)
- [x] Client Dockerfile uses multi-stage build (Vite → nginx)
- [x] `docker compose up --build` brings up the full stack locally
- [x] All Dockerfiles live in a clear top-level folder ([docker/](../docker/))
- [x] `.dockerignore` files exclude `.env*`, `node_modules`, build output, tests, git

### Auth0

- [x] SPA application configured (Domain, Client ID)
- [x] API configured (Audience, RS256, Allow Offline Access)
- [x] Allowed Callback / Logout / Web Origin / CORS Origin URLs include the deployed frontend
- [x] Backend validates JWTs via JWKS (no shared secret)
- [x] Frontend never stores tokens in `localStorage` (memory cache)

### Tests + CI

- [x] Server tests run in CI on every PR ([.github/workflows/server.yml](../.github/workflows/server.yml))
- [x] Client tests run in CI on every PR ([.github/workflows/client.yml](../.github/workflows/client.yml))
- [x] At least 2 production-like server tests ([cors.test.ts](../server/tests/integration/cors.test.ts), [health.test.ts](../server/tests/integration/health.test.ts))
- [x] Auto-deploy on push to `main` is **gated** by passing tests ([.github/workflows/deploy.yml](../.github/workflows/deploy.yml))

### Security

- [x] No secrets committed to the repository
- [x] CORS allow-list is explicit (no wildcards), restricted to the deployed frontend
- [x] Tokens are not stored in `localStorage`
- [x] Frontend uses `credentials: "include"` on authenticated requests
- [x] Docker images do not contain `.env` files or host `node_modules`
- [x] Backend uses HTTPS (Render TLS + HSTS via helmet)
- [x] Auth0 callbacks point to the deployed URL

### Documentation

- [x] README explains install / run / test
- [x] README explains how to build and run with Docker (per-image and via compose)
- [x] README documents Auth0 setup
- [x] README documents environment variables
- [x] README addresses the 7-item security checklist
- [x] README 5 reflection questions
