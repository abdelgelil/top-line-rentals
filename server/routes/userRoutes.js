import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users/role/:clerkId - Fetch role for client-side routing
router.get('/role/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }

    return res.status(200).json({ success: true, role: user.role });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/users/sync - Sync or create user record upon login
router.post('/sync', async (req, res) => {
  try {
    const { clerkId, email } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ success: false, message: 'clerkId and email are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. First check if user already exists by clerkId
    let user = await User.findOne({ clerkId });

    if (!user) {
      // 2. If not found by clerkId, check by email (for pre-seeded admins)
      user = await User.findOne({ email: normalizedEmail });

      if (user) {
        // Update existing pre-seeded document with real clerkId
        user.clerkId = clerkId;
        await user.save();
      } else {
        // Create new user document
        user = await User.create({
          clerkId,
          email: normalizedEmail,
          role: 'client'
        });
      }
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Sync Error:', error.message);
    
    // Fallback: If duplicate key error occurs, try finding the user directly by clerkId or email
    try {
      const fallbackUser = await User.findOne({
        $or: [{ clerkId: req.body.clerkId }, { email: req.body.email?.toLowerCase().trim() }]
      });
      if (fallbackUser) {
        return res.status(200).json({ success: true, data: fallbackUser });
      }
    } catch (fallbackErr) {
      // continue to 500 return
    }

    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/users/make-admin - Promote a user to Admin by email (From Admin Dashboard)
router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'No registered user found with this email. Please ask them to sign up first!' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: `${email} has been successfully promoted to Admin!`,
      data: updatedUser 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/users/claim-first-admin - Initial seed key setup for the primary owner
router.post('/claim-first-admin', async (req, res) => {
  try {
    const { email, setupKey } = req.body;

    if (!email || !setupKey) {
      return res.status(400).json({ success: false, message: 'Email and setupKey are required' });
    }

    const secretKey = process.env.SETUP_SECRET || 'TopLine2026AdminKey';
    if (setupKey !== secretKey) {
      return res.status(403).json({ success: false, message: 'Invalid setup secret key' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const updatedUser = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { 
        $set: { role: 'admin' },$setOnInsert: { clerkId: `manual_${Date.now()}` }
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({ 
      success: true, 
      message: 'First admin successfully assigned!', 
      data: updatedUser 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;