# Table of contents

> 💡 **Reading tip** — open this file in VSCode's markdown preview for better rendering: `Ctrl+Shift+V` on Windows/Linux, `Cmd+Shift+V` on Mac.

A navigation index for everything in the `assignment/` folder. Click any entry to jump directly to that section or document.

---

## Documents

| Document                           | Purpose                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| [01-TOC.md](01-TOC.md#table-of-contents)                                 | Table of content                                                                                 |
| [02-PRESENTATION.md](02-PRESENTATION.md#safe-space-project-presentation) | Walkthrough of the full project journey                                                          |
| [03-DELIVERABLE.md](03-DELIVERABLE.md#safe-space)                         | The full assignment deliverable — install, Docker, Auth0, environment, security, reflection      |
| [04-TESTING.md](04-TESTING.md#safe-space-test-suite)                     | Every test file with terminal-output screenshots, plus CI evidence (server, client, deploy gate) |

---

## 03-DELIVERABLE.md

- [Deployed URLs](03-DELIVERABLE.md#deployed-urls)
- [Tech stack](03-DELIVERABLE.md#tech-stack)
- [Quick start](03-DELIVERABLE.md#quick-start)
  - [Prerequisites](03-DELIVERABLE.md#prerequisites)
  - [Option A — without Docker](03-DELIVERABLE.md#option-a-without-docker)
  - [Option B — with Docker](03-DELIVERABLE.md#option-b-with-docker)
- [Running tests](03-DELIVERABLE.md#running-tests)
  - [Test evidence](03-DELIVERABLE.md#test-evidence)
- [Build and run with Docker](03-DELIVERABLE.md#build-and-run-with-docker)
  - [Server image only](03-DELIVERABLE.md#server-image-only)
  - [Client image only](03-DELIVERABLE.md#client-image-only)
  - [Full stack via compose](03-DELIVERABLE.md#full-stack-via-compose)
- [Auth0 setup](03-DELIVERABLE.md#auth0-setup)
- [Environment variables](03-DELIVERABLE.md#environment-variables)
- [Security](03-DELIVERABLE.md#security)
  - [1. No secrets in the repository](03-DELIVERABLE.md#1-no-secrets-in-the-repository)
  - [2. CORS is restricted to the deployed frontend URL](03-DELIVERABLE.md#2-cors-is-restricted-to-the-deployed-frontend-url)
  - [3. Tokens are never stored in `localStorage`](03-DELIVERABLE.md#3-tokens-are-never-stored-in-localstorage)
  - [4. `credentials: "include"` is used on all authenticated frontend requests](03-DELIVERABLE.md#4-credentials-include-is-used-on-all-authenticated-frontend-requests)
  - [5. Docker image does not contain `.env` files or `node_modules` from host](03-DELIVERABLE.md#5-docker-image-does-not-contain-env-files-or-node_modules-from-host)
  - [6. The deployed backend uses HTTPS](03-DELIVERABLE.md#6-the-deployed-backend-uses-https)
  - [7. Authentication callbacks use the deployed URL, not localhost](03-DELIVERABLE.md#7-authentication-callbacks-use-the-deployed-url-not-localhost)
- [Why in-memory token cache](03-DELIVERABLE.md#why-in-memory-token-cache)
- [CI/CD](03-DELIVERABLE.md#cicd)
  - [Deploy gate (Pattern A)](03-DELIVERABLE.md#deploy-gate-pattern-a)
- [Reflection](03-DELIVERABLE.md#reflection)
  - [1. Why did I choose this deployment platform? What were the alternatives?](03-DELIVERABLE.md#1-why-did-i-choose-this-deployment-platform-what-were-the-alternatives)
  - [2. What challenges did I face with Docker? How did I solve them?](03-DELIVERABLE.md#2-what-challenges-did-i-face-with-docker-how-did-i-solve-them)
  - [3. How did I handle environment variables and secrets in production vs locally?](03-DELIVERABLE.md#3-how-did-i-handle-environment-variables-and-secrets-in-production-vs-locally)
  - [4. What would I do differently if I had one more week?](03-DELIVERABLE.md#4-what-would-i-do-differently-if-i-had-one-more-week)
  - [5. How did I ensure that authentication still works after deployment?](03-DELIVERABLE.md#5-how-did-i-ensure-that-authentication-still-works-after-deployment)
- [Assignment checklist](03-DELIVERABLE.md#assignment-checklist)
  - [Deployment](03-DELIVERABLE.md#deployment)
  - [Docker](03-DELIVERABLE.md#docker)
  - [Auth0](03-DELIVERABLE.md#auth0-setup)
  - [Tests + CI](03-DELIVERABLE.md#tests-ci)
  - [Security](03-DELIVERABLE.md#security-1)
  - [Documentation](03-DELIVERABLE.md#documentation)

---

## 04-TESTING.md

- [Summary](04-TESTING.md#summary)
- [Backend tests](04-TESTING.md#backend-tests)
  - [`auth.test.ts` — Auth middleware enforcement](04-TESTING.md#authtestts-auth-middleware-enforcement)
  - [`auth-success.test.ts` — Authenticated route bypass](04-TESTING.md#auth-successtestts-authenticated-route-bypass)
  - [`space.test.ts` — Spaces controller](04-TESTING.md#spacetestts-spaces-controller)
  - [`cors.test.ts` — Production-like CORS allow-list](04-TESTING.md#corstestts-production-like-cors-allow-list) _(new)_
  - [`health.test.ts` — Production-like health endpoint](04-TESTING.md#healthtestts-production-like-health-endpoint) _(new)_
- [Frontend tests](04-TESTING.md#frontend-tests)
  - [Component tests](04-TESTING.md#component-tests)
    - [PlaceInfo.test.tsx](04-TESTING.md#placeinfotesttsx)
    - [PlaceList.test.tsx](04-TESTING.md#placelisttesttsx)
    - [ReviewForm.test.tsx](04-TESTING.md#reviewformtesttsx)
  - [Page tests](04-TESTING.md#page-tests)
    - [Browse.test.tsx](04-TESTING.md#browsetesttsx)
    - [Cards.test.tsx](04-TESTING.md#cardstesttsx)
    - [Login.test.tsx](04-TESTING.md#logintesttsx)
    - [Profile.test.tsx](04-TESTING.md#profiletesttsx)
- [Continuous Integration](04-TESTING.md#continuous-integration)
  - [Backend tests in CI (`server.yml`)](04-TESTING.md#backend-tests-in-ci-serveryml)
  - [Frontend tests in CI (`client.yml`)](04-TESTING.md#frontend-tests-in-ci-clientyml)
  - [Deploy workflow (`deploy.yml`) — the full Pattern A gate](04-TESTING.md#deploy-workflow-deployyml-the-full-pattern-a-gate) _(new)_

---

## 02-PRESENTATION.md

- [What Safe Space is](02-PRESENTATION.md#what-safe-space-is)
- [Phase 1 — Building the prototype](02-PRESENTATION.md#phase-1-building-the-prototype)
- [Phase 2 — Choosing a deployment platform](02-PRESENTATION.md#phase-2-choosing-a-deployment-platform)
- [Phase 3 — Deploying the backend](02-PRESENTATION.md#phase-3-deploying-the-backend)
  - [Bugs encountered](02-PRESENTATION.md#bugs-encountered)
- [Phase 4 — Deploying the frontend](02-PRESENTATION.md#phase-4-deploying-the-frontend)
  - [Bugs encountered](02-PRESENTATION.md#bugs-encountered-1)
- [Phase 5 — Connecting authentication in production](02-PRESENTATION.md#phase-5-connecting-authentication-in-production)
- [Phase 6 — Fixing Firefox](02-PRESENTATION.md#phase-6-fixing-firefox)
- [Phase 7 — Polishing for delivery](02-PRESENTATION.md#phase-7-polishing-for-delivery)
- [Phase 8 — Building the deploy gate](02-PRESENTATION.md#phase-8-building-the-deploy-gate)
- [Reflection](02-PRESENTATION.md#reflection)
