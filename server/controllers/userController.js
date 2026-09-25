import User from '../models/User.js';

/**
 * Promotes the first administrative user during initial deployment or recovery.
 * Auto-creates the user record if they haven't authenticated on the frontend yet.
 */
export const claimFirstAdmin = async (req, res) => {
  try {
    const { email, setupKey } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Verify secret key against env variable or fallback
    const validSecret = process.env.SETUP_SECRET || "TopLine2026AdminKey";
    if (setupKey !== validSecret) {
      return res.status(403).json({ success: false, message: "Invalid setup key" });
    }

    // Search for existing user or initialize new record
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        role: 'admin',
        clerkId: `manual_${Date.now()}` // Temporary ID until Clerk syncs on first login
      });
    } else {
      user.role = 'admin';
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${email} successfully promoted to admin`,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Promotes an existing user to admin by email (Triggered from Admin Dashboard UI)
 */
export const promoteUserToAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found with this email" });
    }

    user.role = 'admin';
    await user.save();

    return res.status(200).json({
      success: true,
      message: `${email} has been promoted to admin`,
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Synchronizes user data from Clerk authentication middleware
 */
export const syncCurrentUser = async (req, res) => {
  try {
    const { clerkId, email, name } = req.user; // Set by Clerk auth middleware

    let user = await User.findOne({ $or: [{ clerkId }, { email: email?.toLowerCase() }] });

    if (!user) {
      user = new User({
        clerkId,
        email: email.toLowerCase(),
        name,
        role: 'user'
      });
    } else if (user.clerkId !== clerkId) {
      // Link manual auto-created admin entry to actual Clerk ID upon first login
      user.clerkId = clerkId;
    }

    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get profile of currently authenticated user
 */
export const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};