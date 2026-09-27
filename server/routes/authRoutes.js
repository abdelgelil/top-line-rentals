import crypto from 'node:crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { sendOTP } from '../utils/sendOtp.js';

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
const resetLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false });
const phonePattern = /^\+[1-9]\d{7,14}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizePhone = (phone) => String(phone || '').replace(/[\s().-]/g, '');
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');
const safeUser = (user) => ({ id: String(user._id), username: user.username || user.name || '', name: user.username || user.name || '', email: user.email || '', phone: user.phone, role: user.role });
const createToken = (user) => jwt.sign({ id: String(user._id), phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d', issuer: 'top-line' });

router.post('/register', authLimiter, async (req, res) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim().slice(0, 100) : '';
    const phone = normalizePhone(req.body.phone);
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email) delete req.body.email;
    else req.body.email = email;
    if (!username || !phone || !password) return res.status(400).json({ message: 'Username, phone, and password are required.' });
    if (!phonePattern.test(phone)) return res.status(400).json({ message: 'Enter a valid phone number with country code.' });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ message: 'Use a password between 8 and 128 characters.' });
    if (email && !emailPattern.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (await User.exists({ phone })) return res.status(409).json({ message: 'An account already exists for this phone number. Sign in instead.' });
    if (email && await User.exists({ email })) return res.status(409).json({ message: 'An account already exists for this email address.' });
    const user = await User.create({ username, name: username, phone, ...(email ? { email } : {}), password: await bcrypt.hash(password, 12), isVerified: true, emailVerified: true });
    return res.status(201).json({ success: true, token: createToken(user), user: safeUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      console.error('Duplicate registration rejected:', { keyPattern: error.keyPattern, keyValue: error.keyValue });
      return res.status(409).json({ message: 'An account already exists with these details.' });
    }
    console.error('Registration failed:', error.message);
    return res.status(500).json({ message: 'Could not create your account.' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const user = await User.findOne({ phone }).select('+password +passwordHash');
    if (!user || !password) return res.status(401).json({ message: 'Phone number or password is incorrect.' });
    let valid = user.password ? await bcrypt.compare(password, user.password) : false;
    // Upgrade accounts created by the previous scrypt based auth implementation on first login.
    if (!valid && !user.password && user.passwordHash) {
      const [salt, stored] = user.passwordHash.split(':');
      if (salt && stored) {
        const legacyHash = await new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key)));
        const expected = Buffer.from(stored, 'hex');
        valid = legacyHash.length === expected.length && crypto.timingSafeEqual(legacyHash, expected);
        if (valid) { user.username ||= user.name || user.phone; user.password = await bcrypt.hash(password, 12); await user.save(); }
      }
    }
    if (!valid) return res.status(401).json({ message: 'Phone number or password is incorrect.' });
    return res.json({ success: true, token: createToken(user), user: safeUser(user) });
  } catch (error) {
    console.error('Login failed:', error.message);
    return res.status(500).json({ message: 'Could not sign in.' });
  }
});

router.post('/forgot-password', resetLimiter, async (req, res) => {
  try {
    const identifier = typeof req.body.identifier === 'string' ? req.body.identifier.trim() : '';
    const targetEmail = typeof req.body.targetEmail === 'string' ? req.body.targetEmail.trim().toLowerCase() : '';
    if (!identifier || !emailPattern.test(targetEmail)) return res.status(400).json({ message: 'Enter an account phone number or username and a valid email address.' });
    const user = await User.findOne({ $or: [{ phone: normalizePhone(identifier) }, { username: identifier }] });
    if (!user) return res.status(404).json({ message: 'No account found with this phone number or username.' });
    const otp = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    user.resetOtp = hashOtp(otp);
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    try {
      await sendOTP({ email: targetEmail, otpCode: otp, purpose: 'password reset' });
    } catch (emailError) {
      console.error('[forgot-password] Email delivery failed:', emailError.message || emailError);
      return res.status(500).json({ message: 'Could not send a reset code. Please ensure email is configured and try again.' });
    }
    return res.json({ success: true, message: 'A password reset code has been sent to your email address.' });
  } catch (error) {
    console.error('[forgot-password] Unexpected error:', error.message || error);
    return res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
  }
});

router.post('/reset-password', resetLimiter, async (req, res) => {
  try {
    const identifier = typeof req.body.identifier === 'string' ? req.body.identifier.trim() : '';
    const otp = String(req.body.otp || '').trim();
    const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';
    if (!identifier || !/^\d{6}$/.test(otp)) return res.status(400).json({ message: 'Enter an account phone number or username and a six-digit code.' });
    if (newPassword.length < 8 || newPassword.length > 128) return res.status(400).json({ message: 'Use a password between 8 and 128 characters.' });
    const user = await User.findOne({ $or: [{ phone: normalizePhone(identifier) }, { username: identifier }] }).select('+password +resetOtp +resetOtpExpires');
    if (!user || !user.resetOtp || !user.resetOtpExpires || user.resetOtpExpires <= new Date()) return res.status(400).json({ message: 'This reset code is invalid or expired. Request a new one.' });
    const submittedHash = Buffer.from(hashOtp(otp));
    const storedHash = Buffer.from(user.resetOtp);
    if (submittedHash.length !== storedHash.length || !crypto.timingSafeEqual(submittedHash, storedHash)) return res.status(400).json({ message: 'This reset code is invalid or expired. Request a new one.' });
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();
    return res.json({ success: true, message: 'Password updated successfully. You can now log in.' });
  } catch (error) {
    console.error('Password reset failed:', error.message);
    return res.status(500).json({ message: 'Could not reset your password.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('username name email phone role');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  return res.json({ user: safeUser(user) });
});

export default router;
