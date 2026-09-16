import express from 'express';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/profile (Protected: Get current user's profile or create one if it doesn't exist)
router.get('/profile', requireAuth, async (req, res) => {
  try {
    let user = await User.findOne({ clerkId: req.userId });

    // Auto-create user record in MongoDB if visiting for the first time
    if (!user) {
      user = await User.create({
        clerkId: req.userId,
        email: req.user?.emailAddresses?.[0]?.emailAddress || 'pending@clerk.user',
        firstName: req.user?.firstName || '',
        lastName: req.user?.lastName || ''
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/users/profile (Protected: Update user details)
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: req.userId },
      { firstName, lastName, phone },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/users/admin/all (Admin Only: List all registered users)
router.get('/admin/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;