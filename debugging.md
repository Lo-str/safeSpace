- Doesn't go back to website with the returning arrow

---

# Deployment Assignment — Change Log

## Phase 1 Summary — Containerization

### Files modified

**[server/package.json](server/package.json) lines 7-12** — replaced the `build` script

- Old: `"build": "tsc"` (would have produced no compiled entrypoint because [server/tsconfig.json](server/tsconfig.json) lines 3 and 19 restrict compilation to `src/**/*`)
- New: esbuild bundle command that produces a single ESM file at `dist/server.js`, externalizing `@prisma/client` and `.prisma/client` so Prisma's generated client is loaded from `node_modules` at runtime
- Added a separate `"typecheck": "tsc --noEmit"` script for CI/IDE type checking

**[server/package.json](server/package.json) line 39** — added `"esbuild": "^0.24.0"` to `devDependencies`

- ⚠️ You'll need to run `cd server && npm install` to update `package-lock.json` before the Docker build will work

### Files created

**[server/.dockerignore](server/.dockerignore)** (15 lines)

- Excludes `node_modules`, `dist`, all `.env*` files (keeps secrets out of build context), tests, logs, git metadata
- Whitelists `.env.example`

**[server/Dockerfile](server/Dockerfile)** (38 lines, multi-stage)

- Lines 4-21: **builder stage** on `node:22-alpine`, installs OpenSSL for Prisma's query engine, runs `npm ci`, `prisma generate`, then `npm run build` (esbuild bundle)
- Lines 24-37: **runtime stage** on `node:22-alpine`, copies built `dist/`, prisma schema, and full `node_modules` from builder, sets `NODE_ENV=production`, drops to non-root `node` user, exposes `4000`, runs `node dist/server.js`
- Layer caching is optimized: `package*.json` is copied before source, so dep installs don't invalidate on source changes

**[client/.dockerignore](client/.dockerignore)** (14 lines)

- Same exclusion pattern as server's

**[client/nginx.conf](client/nginx.conf)** (22 lines)

- Lines 9-13: hashed Vite assets under `/assets/` get 1-year immutable cache
- Lines 16-18: SPA fallback (`try_files $uri $uri/ /index.html;`) so React Router routes work on direct URL load and page refresh
- Lines 20-22: three security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)

**[client/Dockerfile](client/Dockerfile)** (28 lines, multi-stage)

- Lines 4-22: **builder stage** on `node:22-alpine`, declares four `VITE_*` build args (Vite bakes env vars at build time, not runtime), runs `npm run build`
- Lines 25-28: **runtime stage** on `nginx:alpine`, copies `dist/` to nginx's web root and the custom `nginx.conf` into `/etc/nginx/conf.d/default.conf`

**[docker-compose.yml](docker-compose.yml)** (47 lines)

- Lines 2-18: **db** service — `postgres:16-alpine`, named volume `db-data` for persistence, healthcheck via `pg_isready` so the server doesn't start before the DB is ready
- Lines 20-37: **server** service — builds from `./server`, wires `DATABASE_URL` to the `db` service hostname, exposes `4000`, `depends_on: db (condition: service_healthy)`. Line 36: `command:` override runs `prisma db push` to create tables from the schema (local-dev convenience; production will use `prisma migrate deploy` against Render's managed DB in Phase 2)
- Lines 39-49: **client** service — builds with the four `VITE_*` build args defaulted to the local URLs, maps host `5173` to container `80` so the existing client URL keeps working

**[.env.example](.env.example)** (root, 17 lines)

- Template for the root-level `.env` consumed by docker-compose. Variables split into three groups: Postgres credentials, server (Auth0 + CORS origin), client (the four `VITE_*` build args). Per-service `.env` files in `server/` and `client/` remain for non-Docker local dev

### Files deliberately NOT changed

- [server/tsconfig.json](server/tsconfig.json) — no longer needs the `rootDir`/`include` change originally discussed, because esbuild handles entry point + import resolution. tsconfig is now only used for type checking via the new `typecheck` script
- [server/prisma/schema.prisma](server/prisma/schema.prisma) — left without explicit `binaryTargets` because `prisma generate` runs inside the Alpine builder and auto-detects `linux-musl-openssl-3.0.x`
- Root [.gitignore](.gitignore) — already ignores `.env`, so the new root `.env` won't be committed

### Design decisions locked in (for the README reflection later)

- **Server base image:** `node:22-alpine` — smallest image, requires the `openssl` apk package for Prisma
- **Client container:** multi-stage build → `nginx:alpine` serving static `dist/` (chosen over `vite preview` for production realism and smaller image)
- **File layout:** Dockerfiles inside each app, `docker-compose.yml` at repo root
- **Local Postgres:** included as a compose service with named volume, so the whole stack runs with one command
- **Server build strategy:** esbuild bundle into a single ESM file (chosen over `tsx` runtime and over adding `.js` extensions everywhere — zero source changes, smallest runtime)
- **Vite env strategy:** build args in docker-compose from a root `.env` (chosen over runtime envsubst, matches how Vercel will inject env in production)

### Verification steps to run (no code changes needed)

```bash
cd server && npm install                         # picks up esbuild dep
cd ..
cp .env.example .env                             # fill in real Auth0 values
docker compose build                             # builds both images
docker compose up                                # brings up db + server + client
# Then visit http://localhost:5173 (client) and http://localhost:4000/spaces (server)
```

### Known limitations / what Phase 2 will address

- The compose `command:` uses `prisma db push` for local schema creation. Production needs proper migrations — Phase 2 will run `prisma migrate dev` once locally to generate a `prisma/migrations/` folder, then `prisma migrate deploy` against Render's Postgres
- The client's [client/src/services/api.ts](client/src/services/api.ts) lines 6-10 still reference stale `/gyms` and `/auth/login` paths — Phase 3 will fix this when wiring the frontend to the deployed backend
- No healthcheck on the server service yet (would require adding a `/health` endpoint to [server/src/app.ts](server/src/app.ts), which is a code-touching change — to be added in Phase 2 or a separate ask)

---

## Phase 2 Summary — Database & Backend Deploy Prep

### Files modified

**[server/src/app.ts](server/src/app.ts) lines 22-24** — added `/health` endpoint

- New three-line route mounted **before** the CORS middleware so it's reachable without an `Origin` header (Render's health probe sends none)
- Returns `200 { status: "ok" }`. Used by: Render's `healthCheckPath`, the compose healthcheck, and the production-behavior test coming in Phase 5

**[docker-compose.yml](docker-compose.yml) line 14** — Postgres host port mapping changed

- Was `5432:5432`, now `5433:5432` (with a comment). Reason: a system Postgres is already listening on `127.0.0.1:5432`. Container-internal port stays 5432, so the server service connects via `db:5432` — only host-side tooling (e.g. `prisma migrate` from your host shell) needs to use `5433`

**[docker-compose.yml](docker-compose.yml) lines 36-43** — server service updated

- Line 36: `command:` changed from `prisma db push` to `prisma migrate deploy`. Now uses the real migration history. Same command runs in production
- Lines 38-43: added healthcheck that hits `http://localhost:4000/health` via Node's global `fetch` (Node 22 has it built-in, no `curl`/`wget` needed in the Alpine image)

**[server/Dockerfile](server/Dockerfile) lines 32-39** — runtime command + healthcheck

- Lines 34-35: `HEALTHCHECK` directive (uses the same Node fetch pattern). Active when running `docker run` outside compose (e.g. when Render runs the image)
- Line 39: `CMD` changed to `sh -c "npx prisma migrate deploy && node dist/server.js"` — migrations run before the server accepts traffic. `prisma migrate deploy` is idempotent

### Files created

**[render.yaml](render.yaml)** (root, 36 lines) — Render Blueprint (Infrastructure as Code)

- Lines 6-11: `safespace-db` managed Postgres on free tier, region `frankfurt`
- Lines 13-26: `safespace-server` Web Service, `runtime: docker`, builds from `./server/Dockerfile`, branch `main`, `autoDeploy: true`, `healthCheckPath: /health`
- Lines 24-34: env vars. `DATABASE_URL` auto-wired from the managed Postgres via `fromDatabase`. `AUTH0_AUDIENCE`, `AUTH0_ISSUER_BASE_URL`, `CLIENT_ORIGIN` marked `sync: false` — you set these manually in the Render dashboard after the Blueprint is applied (so they never live in the repo). `NODE_ENV=production` baked in

**[server/prisma/migrations/20260524151814_init/migration.sql](server/prisma/migrations/20260524151814_init/migration.sql)** (177 lines)

- The initial migration generated by `prisma migrate dev --name init` against the compose Postgres. Creates all 10 tables from [server/prisma/schema.prisma](server/prisma/schema.prisma): User, Review, Space, Rating, Tag, Category, Location, Media, Report, Favorite, AccessibilityInfo, plus indexes and foreign keys

**[server/prisma/migrations/migration_lock.toml](server/prisma/migrations/migration_lock.toml)** (3 lines)

- Pins the migration provider to PostgreSQL. Auto-generated by Prisma. Must be committed alongside migrations

### What you still need to do manually (Phase 2 action items)

1. **Sign in to Render** (you mentioned you have a subscription — that's fine, free plan or paid both work with this Blueprint)
2. **New → Blueprint → connect this GitHub repo** → Render reads [render.yaml](render.yaml) and provisions the Postgres + Web Service
3. **Set the three `sync: false` env vars** in the Render dashboard:
   - `AUTH0_AUDIENCE` → value from [server/.env](server/.env) (`https://rest-api-project/`)
   - `AUTH0_ISSUER_BASE_URL` → `https://dev-r32x1zatjzntw3fr.us.auth0.com/`
   - `CLIENT_ORIGIN` → temporarily set to `*` or any placeholder; we'll update to the Vercel URL in Phase 3
4. **Wait for the deploy** to finish. Render will run `prisma migrate deploy` on container start, applying the migration to the managed Postgres
5. **Smoke test:** `curl https://<your-render-url>.onrender.com/health` should return `{"status":"ok"}`
6. **Smoke test:** `curl https://<your-render-url>.onrender.com/spaces` should return `[]` (empty array — no data yet, but the route works)

### Verification of code changes (no Render account needed)

```bash
# From repo root, with root .env created from .env.example
docker compose up --build  # builds server + client, starts db, applies migration, starts server, builds client
# In another terminal:
curl http://localhost:4000/health   # expect {"status":"ok"}
curl http://localhost:4000/spaces   # expect []
```

### Known limitations / what Phase 3 will address

- Frontend not yet deployed to Vercel
- `CLIENT_ORIGIN` on Render is a placeholder until the Vercel URL exists
- The client's [client/src/services/api.ts](client/src/services/api.ts) still references the wrong routes — Phase 3 will fix this and wire the frontend to the deployed backend
- The two CI workflows ([.github/workflows/test.yml](.github/workflows/test.yml) and [.github/workflows/frontend-test.yml](.github/workflows/frontend-test.yml)) still exist as-is; Phase 6 will consolidate into a single `deploy.yml`

---

## Branch `fix/frontendApi` — Wire Frontend to Backend

**Scope:** repair the broken API integration. Frontend was calling `/api/places/*` but the backend serves `/spaces/*`. The Vite dev proxy rewrote `/api/*` → `/*` but the resource name mismatch meant no fetch had ever worked end-to-end.

**This branch does NOT touch deployment.** Phase 3 (Vercel) will be on a separate branch.

### Files modified

**[client/src/services/api.ts](client/src/services/api.ts)** — full rewrite (53 lines)

- Was: stub exporting an unused `apiPaths` object with `/gyms` and `/auth/login` paths
- Now: real helpers (`getSpaces`, `getSpace`, `submitReview`) that use `VITE_API_BASE_URL`, share a `handleResponse` error path, and define `Space` / `Review` interfaces matching what the backend actually returns. `submitReview` accepts an Auth0 bearer token and sets the `Authorization` header

**[client/src/components/PlaceList.tsx](client/src/components/PlaceList.tsx) lines 4, 14-15** — call `getSpaces()` instead of `fetch("/api/places")`

**[client/src/components/PlaceInfo.tsx](client/src/components/PlaceInfo.tsx) lines 5, 13-22** — call `getSpace(id)` instead of `fetch("/api/places/:id")`. Added `if (!id) return` guard. Error type narrowed from `any` to `unknown` with `instanceof Error` check

**[client/src/components/ReviewForm/ReviewForm.tsx](client/src/components/ReviewForm/ReviewForm.tsx) lines 3, 12, 26-28** — call `submitReview(placeId, {rating, comment}, token)`. Now pulls a token via `getAccessTokenSilently()` from `useAuth0` (backend POST `/spaces/:id/reviews` is auth-protected). Body shape changed from `{author, rating, comment}` to `{rating, comment}` — `author` was being sent but the backend always ignored it; the displayed `Posting as ...` UI still uses the Auth0 user object

**[client/src/pages/Browse/Browse.tsx](client/src/pages/Browse/Browse.tsx) lines 6, 8-21, 134-145** — call `getSpaces()`. Interface fields tightened: `id: number` → `id: string` (backend uses UUID strings), and `venueType`/`tags`/`reviews` marked optional since the current backend Space model doesn't expose `venueType` or `tags` at all

**[client/src/pages/Cards/Cards.tsx](client/src/pages/Cards/Cards.tsx) lines 5, 13-30, 81** — call `getSpace(id)`. Review render changed from `{review.comment}` to `{review.content}` to match the backend Prisma `Review` model

**[client/src/pages/Review/Review.tsx](client/src/pages/Review/Review.tsx) lines 4, 12-15, 27** — call `getSpace(id)` instead of `fetch("/api/places/:id")`. `placeId={id!}` non-null assertion since the parent route guarantees an id

**[client/vite.config.ts](client/vite.config.ts) lines 4-10** — removed the `/api → localhost:4000` dev proxy and the leftover commented `base:` line. Frontend now uses absolute URLs via `VITE_API_BASE_URL`, so the proxy is dead config

**[server/src/controllers/spaceController.ts](server/src/controllers/spaceController.ts) lines 4-7, 21-24** — added `include: { reviews: true }` to both `findMany` and `findUnique`. Without this, the frontend's star rating component would show 0/5 on every space because the API never returned the related reviews

### Test updates

**[client/src/components/__tests__/ReviewForm.test.tsx](client/src/components/__tests__/ReviewForm.test.tsx) lines 62-115**

- URL fragment expectation: `/places/${mockPlaceId}/reviews` → `/spaces/${mockPlaceId}/reviews`
- Body assertion: `{author, rating, comment}` → `{rating, comment}`
- New `Authorization: "Bearer mock-token"` header expectation (Auth0 mock already returns `mock-token` from `getAccessTokenSilently`)
- Renamed the second test from "uses the Auth0 user name as the author" to "sends a bearer token from Auth0 when submitting" — what it actually verifies now

**[client/src/pages/__test__/Cards.test.tsx](client/src/pages/__test__/Cards.test.tsx) lines 84-85** — review fixture field renamed `comment` → `content` so the assertion `getByText("Great place!")` still finds the rendered text

### Verification

```bash
cd /home/lo/safeSpace/client
npm test -- --run
# Test Files  7 passed (7)
# Tests       30 passed (30)
```

Server typecheck (`cd server && npm run typecheck`) also clean.

### Known issues NOT touched on this branch

- [client/src/__mock__/auth0Mock.ts](client/src/__mock__/auth0Mock.ts) is broken (contains developer notes inside what should be code) — pre-existing, not imported anywhere, harmless
- Backend `Space` model has no `venueType`, `tags`, or `imageUrl` fields — Browse's filter UI for those will render but produce no matches. Would need a schema migration to fix; out of scope
- `PlaceList` and `PlaceInfo` components in `client/src/components/` are not imported by any non-test file. They got updated for consistency but are effectively dead code; could be deleted in a separate cleanup
- ReviewForm's "Your name" input for unauthenticated users still renders, but unauth submission will 401 because the backend route requires auth. Tiny UX gap — handled later when we audit auth flows

### What still needs to happen for Phase 3 proper (next branch)

- Vercel config (vercel.json) at `client/` root
- Vercel deploy: set `VITE_API_BASE_URL=https://<render-url>.onrender.com` and the four `VITE_AUTH0_*` env vars
- Update Auth0 application's Allowed Callback / Logout / Web Origin URLs to include the Vercel URL
- Update Render's `CLIENT_ORIGIN` env var to the Vercel URL
