import { clerkClient } from '@clerk/express';

// Middleware to enforce authentication
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing bearer token' });
    }

    const token = authHeader.split(' ')[1];
    const session = await clerkClient.verifyToken(token);

    if (!session || !session.sub) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    // Attach Clerk userId to request context
    req.userId = session.sub;
    next();
  } catch (error) {
    console.error('Auth Verification Error:', error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication failed' });
  }
};

// Middleware to restrict access to Admins only
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await clerkClient.users.getUser(req.userId);
    const isAdmin = user.publicMetadata?.role === 'admin' || user.emailAddresses?.some(e => e.emailAddress.endsWith('@toplinerentals.com'));

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