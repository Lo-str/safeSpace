# Safe Space — Project Presentation

> 💡 **Reading tip** — open this file in VSCode's markdown preview for better rendering: `Ctrl+Shift+V` on Windows/Linux, `Cmd+Shift+V` on Mac.

> ❗ **Disclaimer** — While developping personal projects I would opt for different tools. After researching I feel more comfortable using some alternatives that match more accuratly my personal values as a developer in terms of ethic and privacy. The tools used in this project are part of the stack recommended for this assignment.

A walkthrough of the Safe Space project, from the initial group prototype to the final deployed application. Written to follow the reasoning behind each step, and serving as a complete record of the technical decisions made along the way.

---

## What Safe Space is

Safe Space is a small web application built specifically for underrepresented communities. Users can browse places, read reviews from people with similar experiences, and — once they log in — contribute their own reviews. The goal is to help marginalized groups find spaces where they actually feel welcomed, rather than relying on generic review platforms that may not surface the information they need.

The project was developed in two stages: a group-built **prototype** that focused on building a functioning application with proper authentication and automated testing, followed by a **deployment phase** that took the working prototype and made it live on the internet with the engineering discipline that production-grade software demands.

---

## Phase 1 — Building the prototype

The first part of the project was a group effort with three contributors: Lo Streit, Mina Rostami, and Rut Wintzell. The objective was to build a working web application from scratch, covering the full stack:

- **Backend** — written in Node.js with Express. It exposes a REST API, that the frontend can call to fetch or change information.
- **Frontend** — React with TypeScript. It is a _single page application_ (SPA), so the browser loads the app once and then handles navigation internally without reloading the page.
- **Authentication** — we used Auth0 to handle the complexities of user login securely.
- **Tests** — backend uses Vitest, with Supertest and frontend uses React Testing Library to verify that the code behave as intended.
- **Continuous Integration (CI)** — CI catches if changes break anything automatically before the change is merged into the main project.

By the end of Phase 1, the application worked locally on each team member's machine, had a test suite of 30 tests on the frontend, 13 on the backend, and ran those tests automatically through GitHub Actions on every pull request.

---

## Phase 2 — Choosing a deployment platform

For the deployment module, I needed to put the application online so anyone with the URL could use it. Two services were chosen:

- **Render** for the **backend** (and the database). As a hosting platform that supports container-based deployments and provides managed databases, I found that Render was well-suited for my Node.js + PostgreSQL application.
- **Vercel** for the **frontend**. Since specialized in static sites and single-page applications, I opted for Vercel. It also has excellent support for the build tools I used.

---

## Phase 3 — Deploying the backend

The server is reachable at a stable URL with HTTPS encryption, have a working database, and apply database migrations on every startup so the database structure stays in sync with the code.

I described all of this in a configuration file (`render.yaml`) so the entire deployment is reproducible from code — if someone clones the project, they can recreate the exact same setup. Render reads this file and provisions the database and the web service automatically.

The backend was packaged into a **Docker image**: which includes the application code, all its dependencies, and the operating-system pieces needed.

### Bugs encountered

Three issues came up during this phase:

- **Module format mismatch.** My Node.js code used a modern module system, but some of the existing source files were not fully compliant. Instead of rewriting every file, I used a tool called _esbuild_ to combine the entire backend into a single file before deployment. This sidestepped the issue completely without changing the source code.
- **Missing encryption library.** My database tool needed an encryption library that was not installed by default in the minimal version of Linux I used inside Docker. I added a single line to the Docker recipe to install it.
- **Port conflict.** The default PostgreSQL port (5432) was already in use on the development machine, so I configured the local database to use a different port (5433) when running with Docker, while keeping the in-container port at 5432 so other services in the cluster could still reach it as expected.

---

## Phase 4 — Deploying the frontend

The frontend deployment to Vercel was simpler in concept but had its own complications.

The build tool I used (Vite) bakes environment-specific values — such as the backend URL and the Auth0 configuration — directly into the JavaScript file at build time, not at runtime. This means I had to pass those values to Vercel as _build arguments_ and the production build hard-coded them. A different deployment environment would need a separate build.

The frontend also uses client-side routing: the URL changes as you navigate, but the actual page never reloads. For deep links like `/places/123` to work when typed directly into the browser, the web server needs to fall back to serving the main HTML file regardless of the URL path. This is handled by a small configuration on the static-file server (nginx).

### Bugs encountered

- **Package manager version mismatch.** Two different versions of the npm package manager produce slightly different _lockfiles_, which record exact dependency versions. Vercel used a different version than my development machines, and the strict install command failed. Switching to a more permissive install command resolved it.
- **Missing build dependency.** Vercel runs builds in "production" mode by default, which skips installing tools meant for development. But the build tool I needed (Vite) is technically classified as a development tool. Adding a flag to include development dependencies fixed this.

---

## Phase 5 — Connecting authentication in production

The first time I tried to log in to the deployed version, it failed with a cryptic error: _"Service not found: https://safe-space-api%0A"_. That `%0A` at the end is the URL-encoded representation of a newline character. When the environment variable was pasted into Vercel's dashboard, an invisible newline got included at the end. The system was trying to find an Auth0 API named `https://safe-space-api[newline]`, which obviously did not exist.

I re-entered the value without the trailing newline. This took some time to spot because the value _looked_ identical to the correct one in the dashboard.

Beyond that, getting authentication working in production required updating the Auth0 dashboard to include the production URL (`https://safe-space-9q9k.vercel.app`) in four different allow-lists: Allowed Callback URLs, Allowed Logout URLs, Allowed Web Origins, and Allowed Origins (CORS). I also updated the backend's CORS configuration to accept requests from the deployed frontend URL.

---

## Phase 6 — Fixing Firefox

Once authentication was working in Chrome, I discovered it was broken in Firefox. Login would complete (the server received the user's credentials), but the application would automatically go back to the landing page when cliking on login or profile when authenticated.

The cause was Firefox's **Enhanced Tracking Protection**, which blocks third-party cookies by default. Auth0's mechanism for silently keeping the user logged in across page refreshes relied on a hidden iframe that tried to read an Auth0 cookie from a different domain. Firefox blocked it; from the application's perspective, the user had disapeared after login.

The fix was to switch from cookie-based session management to **refresh tokens**, this mechanism does not rely on cross-domain cookies. Refresh tokens are stored in the browser's memory rather than in any cookie or persistent storage, which has the added benefit of being more resistant to certain kinds of attacks. I also enabled "Allow Offline Access" on the Auth0 API, which is needed for the refresh-token flow to work.

---

## Phase 7 — Polishing for delivery

With the application working end-to-end, I realized I needed to make some changes to bring the project up to the standard of a production codebase:

- **Reorganized the Docker files** into a dedicated `docker/` folder, making the deployment recipes easier to find at a glance.
- **Added two new tests** that verify behaviour critical to production: that the cross-origin security policy only allows requests from the configured frontend, and that the `/health` endpoint that Render uses to verify the service is alive remains accessible without authentication.
- **Reorganized the test automation** — renamed the workflow files neater and for an easier understanding (`server.yml`, `client.yml`) and changed them to run only on pull requests, with production deployments handled by a separate workflow.
- **Rewrote the documentation** — the README at the root of the repository, plus a thorough assignment deliverable document with install instructions, security reasoning, reflection answers, and a checklist of every assignment requirement.

---

## Phase 8 — Building the deploy gate

The most ambitious piece of the polish phase was building a **deploy gate**. By default, both Render and Vercel deploy whatever code lands on the main branch — instantly, automatically, no questions asked. If a developer accidentally pushes broken code, production breaks immediately.

The deploy gate inverts this. Production deploys **only** if the tests pass first. The flow is:

1. Code is pushed to the `main` branch.
2. GitHub Actions runs all the tests.
3. If the tests pass, GitHub Actions then tells Render and Vercel to deploy.
4. If the tests fail, nothing deploys.

Setting this up required two parallel pieces of work.

On the **Render side**, I created a _deploy hook_ (a special URL that triggers a deploy when called) and disabled Render's native auto-deploy. GitHub Actions calls the hook only after tests pass.

On the **Vercel side**, the first attempt used the same deploy-hook approach, but it did not work... Vercel has a feature called "Ignored Build Step" that lets you skip builds based on a script — I thought to use it to block native auto-deploys on the main branch. The problem was that this script also ran for deploy-hook builds, which meant the hook-triggered deploys were being cancelled along with everything else.

The solution was to abandon the hook approach for Vercel and use Vercel's command-line interface directly from GitHub Actions, authenticated with an API token. This gave me full control: the CLI builds and deploys completely outside Vercel's Git integration, so the Ignored Build Step never runs for it.

The only side-effect of the gate is that every push to main now produces **two entries** in Vercel's Deployments list: one marked "Canceled" (the native push attempt, blocked by the Ignored Build Step) and one marked "Ready" (the CLI deploy, only after tests pass).

![The deploy gate in action: a canceled push attempt and a ready CLI deploy for the same commit](media/vercelDeploy.png)

---

## Reflection

If I had another week, I would likely:

- **Add real seed data** so the deployed Browse page shows actual reviews instead of being empty.
- **Sync logged-in users to the backend database**, which currently does not store user records (it relies entirely on Auth0's identity service). This would let reviews be attributed to specific users.
- **Add rate-limiting and stricter security policies** to protect the backend from abuse.
- **Build end-to-end tests** that exercise the actual deployed application from a real browser, beyond the existing unit and integration tests.

Beyond the technical material, a few lessons that stand out:

- **Deployment is more than uploading code.** A surprising amount of the work is reading other people's documentation, debugging environment-specific issues, and reconciling small differences between local and production setups.
- **Good error messages save hours.** The newline character bug would have been spotted in seconds if the error message had said "trailing whitespace" instead of "service not found".
- **Browsers are not interchangeable.** Code that works in Chrome can break in Firefox for reasons that have nothing to do with the application itself.
- **Tests are an investment.** They take time to write, but every bug they catch _before_ production saves much more time than they cost.
