import crypto from 'node:crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import OtpChallenge from '../models/OtpChallenge.js';
import { requireAuth } from '../middleware/auth.js';
import { sendOTP } from '../utils/sendOtp.js';

const router = express.Router();
const requestOtpLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false });
const verifyOtpLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false });
const phonePattern = /^\+[1-9]\d{7,14}$/;
const authSecretsConfigured = () => (process.env.JWT_SECRET?.length >= 32 && process.env.OTP_SECRET?.length >= 32);
const normalizePhone = (phone) => String(phone || '').replace(/[\s().-]/g, '');
const maskEmail = (email) => {
  const [local = '', domain = ''] = String(email || '').split('@');
  return `${local.slice(0, 1)}${local.length > 1 ? '•••' : ''}@${domain}`;
};
const hashOtp = (phone, code) => crypto.createHash('sha256').update(`${phone}:${code}:${process.env.OTP_SECRET}`).digest('hex');
const scrypt = (password, salt) => new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key)));
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${(await scrypt(password, salt)).toString('hex')}`;
}
async function verifyPassword(password, storedHash) {
  const [salt, hash] = String(storedHash || '').split(':');
  if (!salt || !hash) return false;
  const actual = await scrypt(password, salt);
  const expected = Buffer.from(hash, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

const requestOtp = async (req, res) => {
  try {
    if (!authSecretsConfigured()) return res.status(503).json({ message: 'Authentication is not configured.' });
    const phone = normalizePhone(req.body.phone);
    const purpose = req.body.purpose;
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const name = typeof req.body.name === 'string' ? req.body.name.trim().slice(0, 100) : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!phonePattern.test(phone)) return res.status(400).json({ message: 'Enter a valid phone number with country code.' });
    if (!['register', 'login', 'reset'].includes(purpose)) return res.status(400).json({ message: 'Invalid verification purpose.' });
    if (password.length < 12 || password.length > 128) return res.status(400).json({ message: 'Use a password between 12 and 128 characters.' });
    if (purpose === 'register' && !email) return res.status(400).json({ message: 'Email is required.' });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    const existing = await User.findOne({ phone }).select(purpose === 'login' ? '+passwordHash' : '');
    if (purpose === 'register' && existing) return res.status(409).json({ message: 'An account already exists for this phone number. Sign in instead.' });
    if (purpose === 'register' && await User.exists({ email })) return res.status(409).json({ message: 'An account already exists for this email address.' });
    if (purpose === 'login' && (!existing || !(await verifyPassword(password, existing.passwordHash)))) {
      return res.status(401).json({ message: 'Phone number or password is incorrect.' });
    }
    if (purpose === 'reset' && !existing) return res.status(404).json({ message: 'No account found for this phone number.' });
    if (purpose === 'register' && !name) return res.status(400).json({ message: 'Name is required.' });
    const deliveryEmail = purpose === 'register' ? email : existing.email;
    if (!deliveryEmail) return res.status(400).json({ message: 'An email address is required for verification.' });
    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    await OtpChallenge.deleteMany({ phone });
    await OtpChallenge.create({ phone, purpose, name, email: deliveryEmail, ...(purpose !== 'login' ? { passwordHash: await hashPassword(password) } : {}), otpHash: hashOtp(phone, code), otpExpires: new Date(Date.now() + 10 * 60 * 1000) });
    try { await sendOTP({ email: deliveryEmail, otpCode: code }); }
    catch (error) { await OtpChallenge.deleteMany({ phone }); throw error; }
    return res.json({ success: true, message: 'Verification code sent to your email.', destination: maskEmail(deliveryEmail) });
  } catch (error) {
    console.error('OTP delivery failed:', error.message);
    return res.status(503).json({ message: error.message === 'Email verification is not configured.' ? error.message : 'Could not send verification code. Try again shortly.' });
  }
};

router.post('/request-otp', requestOtpLimiter, requestOtp);
router.post('/register', requestOtpLimiter, (req, res, next) => {
  req.body = { ...req.body, purpose: 'register' };
  next();
}, requestOtp);

router.post('/verify-otp', verifyOtpLimiter, async (req, res) => {
  try {
    if (!authSecretsConfigured()) return res.status(503).json({ message: 'Authentication is not configured.' });
    const phone = normalizePhone(req.body.phone);
    const code = String(req.body.code || '').trim();
    const challenge = await OtpChallenge.findOne({ phone }).sort({ createdAt: -1 });
    if (!challenge) return res.status(400).json({ message: 'Request a new verification code.' });
    if (challenge.otpExpires <= new Date() || challenge.attempts >= 5) {
      await challenge.deleteOne();
      return res.status(400).json({ message: 'This code has expired. Request a new one.' });
    }
    const attemptedHash = Buffer.from(hashOtp(phone, code));
    const storedHash = Buffer.from(challenge.otpHash);
    if (!/^\d{6}$/.test(code) || attemptedHash.length !== storedHash.length || !crypto.timingSafeEqual(attemptedHash, storedHash)) {
      challenge.attempts += 1;
      await challenge.save();
      return res.status(400).json({ message: 'Incorrect verification code.' });
    }
    let user = await User.findOne({ phone });
    if (challenge.purpose === 'register') {
      if (user) return res.status(409).json({ message: 'An account already exists for this phone number.' });
      user = await User.create({ phone, name: challenge.name, email: challenge.email, passwordHash: challenge.passwordHash, role: 'user', emailVerified: true });
    } else if (!user) return res.status(404).json({ message: 'Account not found.' });
    else if (challenge.purpose === 'reset') {
      user.passwordHash = challenge.passwordHash;
      user.emailVerified = true;
      await user.save();
    }
    if (challenge.purpose === 'login' && !user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }
    await challenge.deleteOne();
    const token = jwt.sign({ id: String(user._id), phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d', issuer: 'top-line' });
    return res.json({ success: true, token, user: { id: String(user._id), name: user.name || '', email: user.email || '', phone: user.phone, role: user.role } });
  } catch (error) {
    console.error('OTP verification failed:', error.message);
    return res.status(500).json({ message: 'Could not verify code.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email phone role');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  return res.json({ user: { id: String(user._id), name: user.name || '', email: user.email || '', phone: user.phone, role: user.role } });
});

export default router;
