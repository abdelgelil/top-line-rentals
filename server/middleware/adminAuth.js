import User from '../models/User.js';

export const requireAdmin = async (req, res, next) => {
  try {
    // req.auth is populated by Clerk middleware
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required'
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Access denied. Admins only.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during admin authorization check'
    });
  }
};