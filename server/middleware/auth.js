import { verifyToken } from '@clerk/backend';
import { getAuth, clerkClient as clerkClientExport } from '@clerk/express';

function getClerkClient() {
  if (typeof clerkClientExport === 'function') {
    return clerkClientExport({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    });
  }
  return clerkClientExport;
}

function readAuthState(req) {
  try {
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

export const requireAuth = async (req, res, next) => {
  try {
    const auth = readAuthState(req);
    const middlewareUserId = auth?.userId || (auth?.isAuthenticated ? auth.userId : null);

    if (middlewareUserId) {
      req.userId = middlewareUserId;
      req.auth = { userId: middlewareUserId };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing bearer token' });
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token || token === 'undefined' || token === 'null') {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing bearer token' });
    }

    if (!process.env.CLERK_SECRET_KEY && !process.env.CLERK_JWT_KEY) {
      console.error('Auth Verification Error: CLERK_SECRET_KEY is not set');
      return res.status(500).json({
        success: false,
        message: 'Server authentication is not configured',
      });
    }

    const verifyOptions = {
      secretKey: process.env.CLERK_SECRET_KEY,
      clockSkewInMs: 15_000,
    };
    if (process.env.CLERK_JWT_KEY) {
      verifyOptions.jwtKey = process.env.CLERK_JWT_KEY;
    }

    const result = await verifyToken(token, verifyOptions);
    const errors = result?.errors;
    if (errors && (Array.isArray(errors) ? errors.length : true)) {
      const first = Array.isArray(errors) ? errors[0] : errors;
      console.error('Auth Verification Error:', first?.reason || first?.message || first);
      return res.status(401).json({ success: false, message: 'Unauthorized: Authentication failed' });
    }

    const session = payloadFromVerifyResult(result);
    if (!session?.sub) {
      console.error('Auth Verification Error: token payload missing sub');
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    req.userId = session.sub;
    req.auth = { userId: session.sub };
    next();
  } catch (error) {
    console.error('Auth Verification Error:', error.reason || error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication failed' });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await getClerkClient().users.getUser(req.userId);
    const isAdmin =
      user.publicMetadata?.role === 'admin' ||
      user.emailAddresses?.some((e) => e.emailAddress.endsWith('@toplinerentals.com'));

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin privilege required' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin Auth Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server authorization error' });
  }
};
