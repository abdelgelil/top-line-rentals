import express from 'express';
import User from '../models/User.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/make-admin', requireAuth, requireAdmin, async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
    if (!email && !phone) return res.status(400).json({ message: 'Enter an email address, phone number, or both.' });
    const query = email && phone ? { email, phone } : email ? { email } : { phone };
    const user = await User.findOneAndUpdate(query, { role: 'admin' }, { new: true });
    if (!user) return res.status(404).json({ message: 'No account found with the supplied details.' });
    return res.json({ success: true, message: `${user.phone} has been promoted to admin.`, data: { id: user._id, email: user.email || '', phone: user.phone, role: user.role } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/claim-first-admin', async (req, res) => {
  try {
    const phone = String(req.body.phone || '').trim();
    const setupKey = req.body.setupKey;
    if (!phone || !setupKey) return res.status(400).json({ message: 'Phone and setupKey are required.' });
    if (!process.env.SETUP_SECRET || setupKey !== process.env.SETUP_SECRET) return res.status(403).json({ message: 'Invalid setup secret key.' });
    const user = await User.findOneAndUpdate({ phone }, { role: 'admin' }, { new: true });
    if (!user) return res.status(404).json({ message: 'Register and verify this phone number before claiming admin access.' });
    return res.json({ success: true, data: { id: user._id, phone: user.phone, role: user.role } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
