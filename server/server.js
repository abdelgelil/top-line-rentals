import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Resolve directory paths correctly in ES Module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load .env BEFORE importing routes
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, './.env') });

const { clerkMiddleware } = await import('@clerk/express');

// 2. Dynamic Route Imports
const apartmentRoutes = (await import('./routes/apartmentRoutes.js')).default;
const bookingRoutes = (await import('./routes/bookingRoutes.js')).default;
const userRoutes = (await import('./routes/userRoutes.js')).default;
const messageRoutes = (await import('./routes/messageRoutes.js')).default;

const app = express();

// Required when deployed behind proxies like Railway/Nginx
app.set('trust proxy', 1);

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://steadfast-blessing-production-ffff.up.railway.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// --- SECURITY & BODY PARSING MIDDLEWARE ---
app.use(
  helmet({
    contentSecurityPolicy: false, // Prevents blocking external image hosts like Cloudinary
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// --- RATE LIMITING ---
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again in 15 minutes.',
  }),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    success: false,
    message: 'Too many authentication or admin attempts. Please try again in 15 minutes.',
  }),
});

app.use('/api/', generalLimiter);
app.use('/api/users/sync', authLimiter);
app.use('/api/users/make-admin', authLimiter);
app.use('/api/users/claim-first-admin', authLimiter);

// Keep request bodies small before they are parsed into memory.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static upload directory (fallback if storing images locally)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!process.env.CLERK_SECRET_KEY) {
  console.error('WARNING: CLERK_SECRET_KEY is not set. Admin API routes will return 401.');
}

// Parses Clerk session JWTs from Authorization Bearer tokens / cookies
app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  })
);

// --- REGISTER API ENDPOINTS ---
app.use('/api/apartments', apartmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Root healthcheck
app.get('/', (req, res) => {
  res.send('API running securely...');
});

// --- GLOBAL ERROR HANDLING MIDDLEWARE ---
app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.error(`[Express Error Handler]: ${err.stack || err.message}`);

  // Multer File Size Limit Error Handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'One or more image files are too large. Maximum size per file is 10MB.',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred',
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));

export default app;
