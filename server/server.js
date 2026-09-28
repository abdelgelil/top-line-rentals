import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import User from './models/User.js';

// Resolve directory paths correctly in ES Module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load .env BEFORE importing routes
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, './.env') });

// 2. Dynamic Route Imports
const apartmentRoutes = (await import('./routes/apartmentRoutes.js')).default;
const bookingRoutes = (await import('./routes/bookingRoutes.js')).default;
const userRoutes = (await import('./routes/userRoutes.js')).default;
const favoriteRoutes = (await import('./routes/favoriteRoutes.js')).default;
const authRoutes = (await import('./routes/authRoutes.js')).default;
const messageRoutes = (await import('./routes/messageRoutes.js')).default;
const reviewRoutes = (await import('./routes/reviewRoutes.js')).default;

const app = express();

// Required when deployed behind proxies like Railway/Nginx
app.set('trust proxy', 1);

// --- CORS CONFIGURATION ---
const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  'https://steadfast-blessing-production-ffff.up.railway.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean).map((origin) => origin.replace(/\/$/, '')));

app.use(cors({
  origin(origin, callback) {
    // Permit non-browser clients that do not send an Origin header.
    if (!origin || allowedOrigins.has(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'X-Requested-With',
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  optionsSuccessStatus: 204,
}));

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
  // All API calls share this IP bucket, including reads; allow normal browsing
  // on shared mobile carrier and office networks without removing the API guard.
  limit: 1000,
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
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    success: false,
    message: 'Too many authentication or admin attempts. Please try again in 15 minutes.',
  }),
});

app.use('/api/', generalLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/users/make-admin', authLimiter);
app.use('/api/users/claim-first-admin', authLimiter);

// Keep request bodies small before they are parsed into memory.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Lightweight Railway/container readiness endpoint.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static upload directory (fallback if storing images locally)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- REGISTER API ENDPOINTS ---
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

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

async function startServer() {
  try {
    mongoose.set('autoIndex', false);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15_000 });
    // Older releases required email and created a non-sparse unique index. Convert it
    // before accepting requests so accounts without email can coexist.
    const usersCollectionExists = await mongoose.connection.db.listCollections({ name: 'users' }).hasNext();
    if (!usersCollectionExists) await mongoose.connection.db.createCollection('users');
    const userCollection = mongoose.connection.collection('users');
    const indexes = await userCollection.listIndexes().toArray();
    const emailIndex = indexes.find((index) => index.key?.email === 1);
    if (emailIndex && !emailIndex.sparse) await userCollection.dropIndex(emailIndex.name);
    await User.collection.createIndex({ phone: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log('MongoDB connected successfully');

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on 0.0.0.0:${PORT}`);
    });
    server.on('error', (error) => {
      console.error('HTTP server failed to bind:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Database connection failed; server was not started:', error);
    await mongoose.disconnect().catch((disconnectError) => {
      console.error('MongoDB cleanup failed:', disconnectError);
    });
    process.exit(1);
  }
}

startServer();

export default app;
