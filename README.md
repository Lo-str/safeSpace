# Safe Space

> 💡 **Reading tip** — open this file in VSCode's markdown preview for better rendering: `Ctrl+Shift+V` on Windows/Linux, `Cmd+Shift+V` on Mac.

A community-driven platform for underrepresented groups to discover and review places where they feel safe, seen, and welcomed. React SPA backed by an Express + Prisma API, with Auth0 for identity. Deployed on Vercel (frontend) and Render (backend + managed Postgres).

> 💡 This repository was built as the final deliverable for a deployment module. The full submission lives in [assignment/](assignment/) — start with [01-TOC.md](assignment/01-TOC.md#table-of-contents) for a navigation index across all submission documents, or jump straight to [03-DELIVERABLE.md](assignment/03-DELIVERABLE.md#safe-space) for install / run / test / Docker / Auth0 / security / reflection.

---

## Live

| Service  | URL                                                                                          |
| -------- | -------------------------------------------------------------------------------------------- |
| Frontend | [safe-space-9q9k.vercel.app](https://safe-space-9q9k.vercel.app)                           |
| Backend  | [safespace-server-7qbc.onrender.com](https://safespace-server-7qbc.onrender.com)           |
| Health   | [/health](https://safespace-server-7qbc.onrender.com/health) → `{ "status": "ok" }`        |

---

## Tech stack

| Layer    | Tech                                                       |
| -------- | ---------------------------------------------------------- |
| Server   | Node.js 22, Express 5, TypeScript, Prisma, esbuild bundle  |
| Client   | React 19, TypeScript, Vite                                 |
| Database | PostgreSQL 16                                              |
| Auth     | Auth0 (RS256 JWT, PKCE, refresh tokens in memory)          |
| Tests    | Vitest + Supertest (server), Vitest + Testing Library (client) |
| CI/CD    | GitHub Actions                                             |
| Host     | Render (Docker web service + managed Postgres), Vercel (SPA) |

---

## Quick start

```bash
git clone https://github.com/Lo-str/safeSpace.git
cd safeSpace
```

Per-service:

```bash
cd server && npm install && npm run dev   # http://localhost:4000
cd client && npm install && npm run dev   # http://localhost:5173
```

Or full stack with Docker:

```bash
docker compose up --build
```

Both modes need environment variables — copy `.env.example` files and fill in your Auth0 + Postgres values. Step-by-step instructions and Auth0 setup are in the [deliverable](assignment/03-DELIVERABLE.md#quick-start).

---

## Tests

```bash
cd server && npm test       # 19 integration tests
cd client && npm test       # 30 component + page tests
```

---

## Repository layout

```text
client/         React + Vite SPA
server/         Express + Prisma API
docker/         Dockerfiles (server, client)
.github/        CI / deploy workflows
assignment/     Submission deliverable + media
```

---

## License

ISC. See [server/package.json](server/package.json) for details.
