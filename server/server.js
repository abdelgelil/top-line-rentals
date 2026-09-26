import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

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
const messageRoutes = (await import('./routes/messageRoutes.js')).default;

const app = express();

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
    'X-Requested-With, Content-Type, Authorization, Accept'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// --- SECURITY MIDDLEWARE ---
// A05: Security Misconfiguration - Helmet for HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP by default to avoid breaking frontend images/scripts, enable in production with specific sources
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// A03: Injection - Sanitize MongoDB operators
// Temporarily commenting out mongoSanitize due to 'Cannot set property query' conflict with Express 5.x
// app.use(mongoSanitize());

// A07: Rate Limiting - Protect critical endpoints from brute-force/DoS
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit sensitive auth requests
  message: { success: false, message: 'Too many authentication attempts, please try again in an hour' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/users/sync', authLimiter);
app.use('/api/users/claim-first-admin', authLimiter);

// Register API Endpoints
app.use('/api/apartments', apartmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Root healthcheck
app.get('/', (req, res) => {
  res.send('API running securely...');
});

// A05: Production Error Handling - Mask stack traces
app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.error(`[Error]: ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: isProduction ? 'An internal server error occurred' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in your .env file.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));
