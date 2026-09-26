import { createPublicKey, verify as cryptoVerify } from 'node:crypto';
import { verifyToken } from '@clerk/backend';
import { getAuth, clerkClient as clerkClientExport } from '@clerk/express';
import User from '../models/User.js';

const CLOCK_SKEW_MS = 15_000;
const jwksCache = new Map();

export function getClerkClient() {
  if (typeof clerkClientExport === 'function') {
    return clerkClientExport({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    });
  }
  return clerkClientExport;
}

function frontendApiFromPublishableKey(publishableKey) {
  if (!publishableKey) return null;
  try {
    const raw = publishableKey.replace(/^pk_(test|live)_/i, '');
    const decoded = Buffer.from(raw, 'base64').toString('utf8').replace(/\$+$/, '').trim();
    return decoded || null;
  } catch {
    return null;
  }
}

function isTrustedIssuer(iss) {
  try {
    const url = new URL(iss);
    if (url.protocol !== 'https:') return false;

    const host = url.hostname.toLowerCase();
    const fapi = frontendApiFromPublishableKey(process.env.CLERK_PUBLISHABLE_KEY);
    if (fapi && host === fapi.toLowerCase()) return true;
    if (process.env.CLERK_FRONTEND_API && host === process.env.CLERK_FRONTEND_API.replace(/^https?:\/\//, '').toLowerCase()) {
      return true;
    }

    return (
      host.endsWith('.clerk.accounts.dev') ||
      host.endsWith('.lcl.dev') ||
      host.endsWith('.clerk.com')
    );
  } catch {
    return false;
  }
}

function readAuthState(req) {
  try {
    if (typeof req.auth === 'function') {
      return req.auth();
    }
    return getAuth(req);
  } catch (error) {
    console.error('getAuth error:', error.message);
    return null;
  }
}

function payloadFromVerifyResult(result) {
  if (!result) return null;
  if (result.sub) return result;
  if (result.data?.sub) return result.data;
  return null;
}

function decodeJwtPart(part) {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
}

function isReasonSecretKeyInvalid(errorLike) {
  const reason = errorLike?.reason || errorLike?.code || errorLike?.message || '';
  return String(reason).toLowerCase().includes('secret-key-invalid')
    || String(reason).toLowerCase().includes('clerk_key_invalid');
}

function authorizedParties() {
  return [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://steadfast-blessing-production-ffff.up.railway.app',
  ].filter(Boolean);
}

async function loadJwks(issuer) {
  const cached = jwksCache.get(issuer);
  if (cached && Date.now() - cached.fetchedAt < 60 * 60 * 1000) {
    return cached.keys;
  }

  const url = `${issuer.replace(/\/$/, '')}/.well-known/jwks.json`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`JWKS fetch failed (${response.status})`);
  }
  const body = await response.json();
  const keys = Array.isArray(body?.keys) ? body.keys : [];
  jwksCache.set(issuer, { keys, fetchedAt: Date.now() });
  return keys;
}

function verifyJwtSignature(token, jwk, alg) {
  const [header, payload, signature] = token.split('.');
  const key = createPublicKey({ key: jwk, format: 'jwk' });
  const data = Buffer.from(`${header}.${payload}`);
  const sig = Buffer.from(signature, 'base64url');

  if (alg?.startsWith('ES')) {
    const hash = alg.replace('ES', 'SHA');
    return cryptoVerify(hash, data, { key, dsaEncoding: 'ieee-p1363' }, sig);
  }

  const rsaAlg = {
    RS256: 'RSA-SHA256',
    RS384: 'RSA-SHA384',
    RS512: 'RSA-SHA512',
  }[alg];

  if (!rsaAlg) {
    throw new Error(`Unsupported JWT alg: ${alg}`);
  }

  return cryptoVerify(rsaAlg, data, key, sig);
}

function assertFreshClaims(payload) {
  const now = Date.now();
  if (payload.nbf && payload.nbf * 1000 - CLOCK_SKEW_MS > now) {
    throw new Error('token-not-active-yet');
  }
  if (payload.exp && payload.exp * 1000 + CLOCK_SKEW_MS < now) {
    throw new Error('token-expired');
  }
}

async function verifyWithIssuerJwks(token) {
  const [headerPart, payloadPart, signaturePart] = token.split('.');
  if (!headerPart || !payloadPart || !signaturePart) {
    throw new Error('token-invalid');
  }

  const header = decodeJwtPart(headerPart);
  const payload = decodeJwtPart(payloadPart);
  if (!payload?.sub || !payload?.iss) {
    throw new Error('token payload missing sub');
  }

  if (!isTrustedIssuer(payload.iss)) {
    throw new Error(`token issuer invalid: ${payload.iss}`);
  }

  const keys = await loadJwks(payload.iss);
  const jwk = keys.find((key) => key.kid === header.kid) || keys[0];
  if (!jwk) {
    throw new Error('jwk-remote-missing');
  }

  const valid = verifyJwtSignature(token, jwk, header.alg);
  if (!valid) {
    throw new Error('token-invalid-signature');
  }

  assertFreshClaims(payload);
  return payload;
}

async function verifySessionToken(token) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const jwtKey = process.env.CLERK_JWT_KEY;

  if (jwtKey || secretKey) {
    try {
      const verifyOptions = {
        clockSkewInMs: CLOCK_SKEW_MS,
        authorizedParties: authorizedParties(),
      };
      if (secretKey) verifyOptions.secretKey = secretKey;
      if (jwtKey) verifyOptions.jwtKey = jwtKey;

      const result = await verifyToken(token, verifyOptions);
      const errors = result?.errors;
      if (!errors || (Array.isArray(errors) && errors.length === 0)) {
        const session = payloadFromVerifyResult(result);
        if (session?.sub) return session;
      }

      const first = Array.isArray(errors) ? errors[0] : errors;
      if (!isReasonSecretKeyInvalid(first)) {
        const fallback = await verifyWithIssuerJwks(token);
        if (fallback?.sub) return fallback;
        throw first || new Error('Unauthorized: Authentication failed');
      }
    } catch (error) {
      if (!isReasonSecretKeyInvalid(error) && error?.reason && !isReasonSecretKeyInvalid({ reason: error.reason })) {
        try {
          return await verifyWithIssuerJwks(token);
        } catch {
          throw error;
        }
      }
    }
  }

  return verifyWithIssuerJwks(token);
}

function attachUser(req, userId) {
  req.userId = userId;
  if (typeof req.auth !== 'function') {
    req.auth = { userId };
  }
}

export const requireAuth = async (req, res, next) => {
  try {
    const auth = readAuthState(req);
    const middlewareUserId = auth?.userId || (auth?.isAuthenticated ? auth.userId : null);

    if (middlewareUserId) {
      attachUser(req, middlewareUserId);
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth failed: Missing Bearer token');
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing bearer token' });
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token || token === 'undefined' || token === 'null') {
      console.log('Auth failed: Token is empty or invalid string');
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing bearer token' });
    }

    console.log('Attempting to verify token...');
    const session = await verifySessionToken(token);
    
    if (!session?.sub) {
      console.error('Auth failed: Token payload missing sub');
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    console.log('Token verified successfully for user:', session.sub);
    attachUser(req, session.sub);
    req.sessionClaims = session;
    next();
  } catch (error) {
    console.error('Auth Verification Error Detail:', error.reason || error.message);
    return res.status(401).json({ 
      success: false, 
      message: `Unauthorized: ${error.reason || error.message}` 
    });
  }
};

function emailIsAdmin(email) {
  return typeof email === 'string' && email.toLowerCase().endsWith('@toplinerentals.com');
}

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const dbUser = await User.findOne({ clerkId: req.userId });
    if (dbUser?.role === 'admin' || emailIsAdmin(dbUser?.email)) {
      req.user = dbUser;
      return next();
    }

    try {
      const clerkUser = await getClerkClient().users.getUser(req.userId);
      const isAdmin =
        clerkUser.publicMetadata?.role === 'admin' ||
        clerkUser.emailAddresses?.some((e) => emailIsAdmin(e.emailAddress));

      if (isAdmin) {
        req.user = clerkUser;
        return next();
      }
    } catch (error) {
      console.error('Admin Clerk lookup skipped:', error.message);
    }

    return res.status(403).json({ success: false, message: 'Forbidden: Admin privilege required' });
  } catch (error) {
    console.error('Admin Auth Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server authorization error' });
  }
};
