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
