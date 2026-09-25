import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Create a new contact message
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    // Check if the sender is a registered user to link their account
    let userId = null;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      userId = user._id;
    }

    const newMessage = new Message({
      fullName,
      email: email.toLowerCase(),
      phone,
      subject,
      message,
      userId
    });

    await newMessage.save();
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all messages (Admin only - Middleware should be applied in server.js or here)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('userId', 'email role')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
