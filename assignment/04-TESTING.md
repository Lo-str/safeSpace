# Safe Space — Test Suite

> 💡 **Reading tip** — open this file in VSCode's markdown preview for better rendering: `Ctrl+Shift+V` on Windows/Linux, `Cmd+Shift+V` on Mac.

This document collects every automated test in the project and demonstrates that each one passes both locally and in continuous integration. Tests are written with **Vitest** (a fast JavaScript test runner) and use **Supertest** on the backend to simulate HTTP requests, and **React Testing Library** on the frontend to mount components in a virtual browser.

---

## Summary

| Suite     | Files  | Tests  | Tool stack                             |
| --------- | ------ | ------ | -------------------------------------- |
| Backend   | 5      | 19     | Vitest + Supertest                     |
| Frontend  | 7      | 30     | Vitest + React Testing Library + jsdom |
| **Total** | **12** | **49** |                                        |

Backend test files marked **New** below were added during the deployment phase to meet the requirements for at least two production-like tests.

To run a single file locally and capture its output:

```bash
cd server && npx vitest run --reporter=verbose tests/integration/<file>.test.ts
cd client && npx vitest run --reporter=verbose src/<path>/<file>.test.tsx
```

To run the full suite per service:

```bash
cd server && npm test
cd client && npm test
```

---

## Backend tests

The backend has 19 integration tests across 5 files, all under [server/tests/integration/](../server/tests/integration/).

### `auth.test.ts` — Auth middleware enforcement

Verifies that protected routes reject unauthenticated requests with `401 Unauthorized`, and that `GET /spaces` remains public.

![Backend auth middleware test output](media/backendAuth.png)

### `auth-success.test.ts` — Authenticated route bypass

Verifies that, with a mocked successful authentication, protected routes return their expected success responses. Pairs with `auth.test.ts` to prove the middleware allows valid tokens through, not just blocks invalid ones.

![Backend authenticated-route test output](media/backendAuthSuccess.png)

### `space.test.ts` — Spaces controller

Exercises the spaces API end-to-end with the authentication middleware mocked out. Confirms list / detail / 404 / create / review flows.

![Backend spaces controller test output](media/backendSpace.png)

### `cors.test.ts` — Production-like CORS allow-list

> 💡 **New** — added during the deployment phase.

Verifies that the cross-origin policy enforces the allow-list configured via `CLIENT_ORIGIN` and properly responds to preflight requests, with credentials enabled.

![Backend CORS test output](media/backendCors.png)

### `health.test.ts` — Production-like health endpoint

> 💡 **New** — added during the deployment phase.

Verifies that the `/health` endpoint used by Render's health probe is always reachable, regardless of authentication or `Origin` headers (it is mounted before any auth or CORS middleware).

![Backend /health endpoint test output](media/backendHealth.png)

---

## Frontend tests

The frontend has 30 tests across 7 files. Component tests live in [client/src/components/__tests__/](../client/src/components/__tests__/) and page tests in [client/src/pages/__test__/](../client/src/pages/__test__/).

### Component tests

#### `PlaceInfo.test.tsx`

![Frontend PlaceInfo test output](media/frontendPlaceInfo.png)

#### `PlaceList.test.tsx`

![Frontend PlaceList test output](media/frontendPlaceList.png)

#### `ReviewForm.test.tsx`

![Frontend ReviewForm test output](media/frontendReviewForm.png)

### Page tests

#### `Browse.test.tsx`

![Frontend Browse page test output](media/frontendBrowse.png)

#### `Cards.test.tsx`

![Frontend Cards page test output](media/frontendCards.png)

#### `Login.test.tsx`

![Frontend Login page test output](media/frontendLogin.png)

#### `Profile.test.tsx`

![Frontend Profile page test output](media/frontendProfile.png)

---

## Continuous Integration

The same test suites run automatically on every pull request to the `main` branch via GitHub Actions. The workflows are defined in [.github/workflows/](../.github/workflows/):

- [server.yml](../.github/workflows/server.yml) — runs the backend test suite
- [client.yml](../.github/workflows/client.yml) — runs the frontend test suite
- [deploy.yml](../.github/workflows/deploy.yml) — runs both suites on push to `main`, then deploys to Render + Vercel via API if everything passes

### Backend tests in CI (`server.yml`)

Runs on every pull request to `main`.

![GitHub Actions: backend tests passing](media/ciServerTests.png)

### Frontend tests in CI (`client.yml`)

Runs on every pull request to `main`.

![GitHub Actions: frontend tests passing](media/ciClientTests.png)

### Deploy workflow (`deploy.yml`) — the full Pattern A gate

> 💡 **New** — the test-gated deploy was built during the deployment phase.

Runs on every push to `main`. Has four jobs: server tests + client tests run in parallel, and both deploy jobs (Render + Vercel) only run if both test jobs pass. All four green means the gate worked end-to-end — tests passed, both deploys worked.

![GitHub Actions: full Deploy workflow with tests gating both deploys](media/ciDeployTests.png)
