import express from 'express';
import User from '../models/User.js';
import { getClerkClient, requireAdmin, requireAuth } from '../middleware/auth.js';

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
router.post('/sync', requireAuth, async (req, res) => {
  try {
    if (req.body.clerkId && req.body.clerkId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Account ID does not match the signed-in user' });
    }

    const clerkUser = await getClerkClient().users.getUser(req.userId);
    const verifiedEmails = (clerkUser.emailAddresses || []).filter(
      (entry) => entry.verification?.status === 'verified'
    );
    const primaryEmail = verifiedEmails.find(
      (entry) => entry.id === clerkUser.primaryEmailAddressId
    ) || verifiedEmails[0];

    if (!primaryEmail?.emailAddress) {
      return res.status(400).json({ success: false, message: 'A verified email address is required' });
    }

    const normalizedEmail = primaryEmail.emailAddress.toLowerCase().trim();
    const verifiedPhone = (clerkUser.phoneNumbers || []).find(
      (entry) => entry.id === clerkUser.primaryPhoneNumberId && entry.verification?.status === 'verified'
    ) || (clerkUser.phoneNumbers || []).find((entry) => entry.verification?.status === 'verified');
    const normalizedPhone = verifiedPhone?.phoneNumber || '';
    const clerkId = req.userId;

    // 1. First check if user already exists by clerkId
    let user = await User.findOne({ clerkId });

    if (!user) {
      // Link a pre-seeded record only when Clerk confirms the email belongs to this user.
      user = await User.findOne({ email: normalizedEmail });

      if (user) {
        // Only link legacy pre-seeded records; never reassign another account.
        if (!user.clerkId.startsWith('manual_')) {
          return res.status(409).json({ success: false, message: 'This email is linked to another account' });
        }
        user.clerkId = clerkId;
        user.phone = normalizedPhone;
        await user.save();
      } else {
        // Create new user document
        user = await User.create({
          clerkId,
          email: normalizedEmail,
          phone: normalizedPhone,
          role: 'user'
        });
      }
    } else {
      user.email = normalizedEmail;
      user.phone = normalizedPhone;
      await user.save();
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Sync Error:', error.message);
    
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/users/make-admin - Promote a registered account by email and/or phone
router.post('/make-admin', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { email, phone } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';

    if (!normalizedEmail && !normalizedPhone) {
      return res.status(400).json({ success: false, message: 'Enter an email address, phone number, or both' });
    }

    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address' });
    }

    const phoneDigits = normalizedPhone.replace(/\D/g, '');
    if (normalizedPhone && (phoneDigits.length < 7 || phoneDigits.length > 15)) {
      return res.status(400).json({ success: false, message: 'Enter a valid phone number' });
    }

    const normalizePhone = (value) => String(value || '').replace(/\D/g, '');
    const clerkResult = await getClerkClient().users.getUserList({
      ...(normalizedEmail ? { emailAddress: [normalizedEmail] } : {}),
      ...(normalizedPhone ? { phoneNumber: [`+${phoneDigits}`] } : {}),
      limit: 100,
    });
    const clerkUsers = Array.isArray(clerkResult) ? clerkResult : clerkResult.data || [];
    const matchedClerkUser = clerkUsers.find((candidate) => {
      const emailMatches = !normalizedEmail || (candidate.emailAddresses || []).some(
        (entry) => (entry.emailAddress || '').toLowerCase() === normalizedEmail && entry.verification?.status === 'verified'
      );
      const phoneMatches = !normalizedPhone || (candidate.phoneNumbers || []).some(
        (entry) => normalizePhone(entry.phoneNumber) === phoneDigits && entry.verification?.status === 'verified'
      );
      return emailMatches && phoneMatches;
    });

    if (!matchedClerkUser) {
      return res.status(404).json({
        success: false,
        message: 'No active account with the supplied verified email and phone was found.',
      });
    }

    const updatedUser = await User.findOne({ clerkId: matchedClerkUser.id });
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'No active registered account matched the supplied email and phone. Ask the user to sign in and update their profile first.'
      });
    }

    const previousPublicMetadata = matchedClerkUser.publicMetadata || {};
    await getClerkClient().users.updateUserMetadata(matchedClerkUser.id, {
      publicMetadata: { ...previousPublicMetadata, role: 'admin' },
    });
    try {
      updatedUser.role = 'admin';
      await updatedUser.save();
    } catch (saveError) {
      await getClerkClient().users.updateUserMetadata(matchedClerkUser.id, {
        publicMetadata: previousPublicMetadata,
      });
      throw saveError;
    }

    return res.status(200).json({ 
      success: true, 
      message: `${updatedUser.email} has been successfully promoted to Admin!`,
      data: {
        id: updatedUser._id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      }
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
