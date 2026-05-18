# Safe Space

A Yelp-like platform for underrepresented groups. Users can browse places publicly and post reviews when authenticated.

---

## Tech Stack

| Layer   | Technology                   |
| ------- | ---------------------------- |
| Server  | Node.js, Express, TypeScript |
| Client  | React, TypeScript, Vite      |
| Auth    | Auth0 (JWT / RS256)          |
| Testing | Vitest, Testing Library      |
| CI/CD   | GitHub Actions               |

---

## Prerequisites

- Node.js `22+`
- npm

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd safeSpace
```

### 2. Configure environment variables

Create `server/.env`:

```env
PORT=4000
AUTH0_AUDIENCE=<your-auth0-api-audience>
AUTH0_ISSUER_BASE_URL=<your-auth0-issuer-url>
CLIENT_ORIGIN=http://localhost:5173
```

Create `client/.env`:

```env
VITE_AUTH0_DOMAIN=<your-auth0-domain>
VITE_AUTH0_CLIENT_ID=<your-auth0-client-id>
VITE_AUTH0_CALLBACK_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:4000
```

> Both `server/` and `client/` include a `.env.example` listing all required variables.

### 3. Install and run

Run both together from the root:

```bash
npm install
npm run dev
```

Or separately:

```bash
# Server — http://localhost:4000
cd server && npm install && npm run dev

# Client — http://localhost:5173
cd client && npm install && npm run dev
```

---

## Testing

```bash
# Server integration tests
cd server
npm test

# Client unit tests
cd client
npm test
```

---

## Authentication

The server validates Auth0-issued Bearer tokens using RS256 signature verification against Auth0's public JWKS. No server-side sessions are maintained.

**Protected routes:**

```
GET  /profile
POST /profile
POST /spaces
POST /spaces/:id/reviews
```

> Requests to protected routes without a valid token return `401 Unauthorized`.

---

## API Routes

| Prefix                | Methods                          | Auth required      |
|-----------------------|----------------------------------|--------------------|
| `/spaces`             | `GET` `PUT` `DELETE`             |                    |
| `/spaces`             | `POST`                           | ✓                  |
| `/spaces/:id/reviews` | `POST`                           | ✓                  |
| `/profile`            | `GET` `POST`                     | ✓                  |
| `/users`              | `GET` `POST` `PUT` `DELETE`      |                    |
| `/reviews`            | `GET` `POST` `PUT` `DELETE`      |                    |
| `/ratings`            | `GET` `POST` `PUT` `DELETE`      |                    |
| `/tags`               | `GET` `POST` `PUT` `DELETE`      |                    |
| `/categories`         | `GET` `POST` `PUT` `DELETE`      |                    |
| `/locations`          | `GET` `POST` `PUT` `DELETE`      |                    |
| `/media`              | `GET` `POST` `PUT` `DELETE`      |                    |
| `/reports`            | `GET` `POST` `PUT` `DELETE`      |                    |
| `/favorites`          | `GET` `POST` `PUT` `DELETE`      |                    |
| `/accessibility-infos`| `GET` `POST` `PUT` `DELETE`      |                    |

---

## CI/CD

GitHub Actions runs the server integration tests and client unit tests automatically on every push and pull request to `main`.
