import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import Apartment from '../models/Apartment.js';
import Booking from '../models/booking.js';
import Review from '../models/Review.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const reviewLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });

router.get('/apartment/:apartmentId', async (req, res) => {
  const { apartmentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(apartmentId)) return res.status(400).json({ success: false, message: 'Invalid apartment ID.' });
  try {
    const reviews = await Review.find({ apartment: apartmentId, approved: true })
      .select('guestName rating comment createdAt')
      .sort({ createdAt: -1 }).lean();
    const ratingTotal = reviews.reduce((total, review) => total + review.rating, 0);
    return res.json({ success: true, data: reviews, averageRating: reviews.length ? ratingTotal / reviews.length : null, count: reviews.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to load reviews.' });
  }
});

router.get('/eligible/:apartmentId', requireAuth, async (req, res) => {
  const { apartmentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(apartmentId)) return res.status(400).json({ success: false, message: 'Invalid apartment ID.' });
  try {
    const bookings = await Booking.find({
      apartment: apartmentId,
      user: String(req.userId),
      status: 'confirmed',
      checkOut: { $lte: new Date() },
    }).select('_id guestName checkOut').sort({ checkOut: -1 }).lean();
    const existing = await Review.find({ booking: { $in: bookings.map(({ _id }) => _id) } }).distinct('booking');
    const reviewedIds = new Set(existing.map(String));
    return res.json({ success: true, data: bookings.filter(({ _id }) => !reviewedIds.has(String(_id))) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to check review eligibility.' });
  }
});

router.post('/', requireAuth, reviewLimiter, async (req, res) => {
  const { bookingId, rating, comment } = req.body || {};
  if (!mongoose.Types.ObjectId.isValid(bookingId)) return res.status(400).json({ success: false, message: 'A valid booking is required.' });
  const numericRating = Number(rating);
  const cleanComment = typeof comment === 'string' ? comment.trim() : '';
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) return res.status(400).json({ success: false, message: 'Choose a rating from 1 to 5.' });
  if (cleanComment.length < 5 || cleanComment.length > 1000) return res.status(400).json({ success: false, message: 'Review comments must be 5 to 1000 characters.' });
  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      user: String(req.userId),
      status: 'confirmed',
      checkOut: { $lte: new Date() },
    }).populate('apartment', 'title');
    if (!booking) return res.status(403).json({ success: false, message: 'Only guests with a completed confirmed stay can review.' });
    const review = await Review.create({
      apartment: booking.apartment._id,
      booking: booking._id,
      user: String(req.userId),
      guestName: booking.guestName,
      rating: numericRating,
      comment: cleanComment,
    });
    return res.status(201).json({ success: true, data: review, message: 'Review submitted for approval.' });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'This stay has already been reviewed.' });
    if (error?.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Please check the review details.' });
    return res.status(500).json({ success: false, message: 'Unable to submit review.' });
  }
});

router.get('/admin', requireAuth, requireAdmin, async (req, res) => {
  try {
    const reviews = await Review.find().populate('apartment', 'title').sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to load review moderation.' });
  }
});

router.patch('/:id/approval', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid review ID.' });
  if (typeof req.body?.approved !== 'boolean') return res.status(400).json({ success: false, message: 'Approval must be true or false.' });
  try {
    const review = await Review.findByIdAndUpdate(id, { approved: req.body.approved }, { new: true, runValidators: true }).populate('apartment', 'title');
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    return res.json({ success: true, data: review });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to update review approval.' });
  }
});

export default router;
