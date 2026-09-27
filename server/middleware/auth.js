import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized access' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};
