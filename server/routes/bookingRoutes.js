import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// GET /api/bookings/my-bookings (Protected: Logged-in user's bookings)
router.get('/my-bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate('apartmentId');
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings (Protected: Create new reservation)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { apartmentId, checkIn, checkOut, guests, totalPrice } = req.body;

    const newBooking = await Booking.create({
      userId: req.userId,
      apartmentId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'confirmed'
    });

    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/bookings/admin/all (Admin Only: Fetch all system bookings)
router.get('/admin/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('apartmentId');
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admin data' });
  }
});

export default router;