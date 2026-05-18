import { auth } from 'express-oauth2-jwt-bearer';
import type { RequestHandler } from 'express';

const auth0Audience = process.env.AUTH0_AUDIENCE;
const auth0IssuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;

if (!auth0Audience || !auth0IssuerBaseURL) {
  throw new Error('Missing Auth0 environment variable: AUTH0_AUDIENCE or AUTH0_ISSUER_BASE_URL');
}

const requireAuth: RequestHandler = auth({
  audience: auth0Audience,
  issuerBaseURL: auth0IssuerBaseURL,
  tokenSigningAlg: 'RS256',
});

export default requireAuth;
