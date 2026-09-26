import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/booking.js';
import Apartment from '../models/Apartment.js';
import Message from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/* ==========================================================================
   GET /api/bookings/analytics - Fetch Admin Dashboard Analytics & VIP Clients
   ========================================================================== */
router.get('/analytics', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: { $in: ['cancelled', 'canceled'] } });

    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Aggregate frequent visiting clients by email
    const topClients = await Booking.aggregate([
      {
        $group: {
          _id: '$guestEmail',
          guestName: { $first: '$guestName' },
          guestPhone: { $first: '$guestPhone' },
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] },
          },
          totalSpent: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, '$totalPrice', 0] },
          },
          lastBookingDate: { $max: '$createdAt' },
        },
      },
      { $sort: { totalBookings: -1, totalSpent: -1 } },
      { $limit: 10 },
    ]);

    return res.json({
      success: true,
      data: {
        metrics: {
          totalBookings,
          confirmedBookings,
          pendingBookings,
          cancelledBookings,
          totalRevenue,
        },
        topClients,
      },
    });
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =======================================================================
   PATCH /api/bookings/:id/cancel - Cancel the signed-in user's reservation
   ======================================================================= */
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid booking ID' });
  }

  try {
    const booking = await Booking.findById(id).populate('apartment');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (String(booking.user) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own bookings.' });
    }
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(409).json({ success: false, message: 'This booking can no longer be canceled.' });
    }

    const previousStatus = booking.status;
    const canceledBooking = await Booking.findOneAndUpdate(
      { _id: id, status: { $in: ['pending', 'confirmed'] } },
      { $set: { status: 'canceled' } },
      { new: true }
    ).populate('apartment');

    if (!canceledBooking) {
      return res.status(409).json({ success: false, message: 'This booking has already changed.' });
    }

    const apartmentTitle = canceledBooking.apartment?.title || 'Unknown apartment';
    const checkIn = new Date(canceledBooking.checkIn).toLocaleDateString('en-CA');
    const checkOut = new Date(canceledBooking.checkOut).toLocaleDateString('en-CA');
    const content = [
      `${canceledBooking.guestName} (${canceledBooking.guestEmail}) canceled a reservation.`,
      `Apartment: ${apartmentTitle}`,
      `Reserved dates: ${checkIn} to ${checkOut}`,
    ].join('\n');

    try {
      await Message.create({
        fullName: canceledBooking.guestName,
        email: canceledBooking.guestEmail,
        phone: canceledBooking.guestPhone || 'Not provided',
        subject: 'Booking Cancellation Alert',
        message: content,
        type: 'cancellation_alert',
        apartmentTitle,
        bookingId: canceledBooking._id,
      });
    } catch (messageError) {
      await Booking.findOneAndUpdate(
        { _id: id, status: 'canceled' },
        { $set: { status: previousStatus } }
      );
      throw messageError;
    }

    return res.json({ success: true, data: canceledBooking, message: 'Booking canceled and admin notified.' });
  } catch (error) {
    console.error('Booking cancellation failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
});

/* ==========================================================================
   POST /api/bookings - Create new reservation
   ========================================================================== */
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      apartment,
      apartmentId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    } = req.body;

    const targetApartmentId = apartment || apartmentId;
    const targetUserId = req.userId;

    if (!targetApartmentId || !mongoose.Types.ObjectId.isValid(targetApartmentId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid Apartment ID is required.',
      });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Both Check-In and Check-Out dates are required.',
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format provided.' });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date.',
      });
    }

    // --- DATE OVERLAP VALIDATION ---
    // A booking overlaps if (NewStart < ExistingEnd) AND (NewEnd > ExistingStart)
    const overlappingBookings = await Booking.find({
      apartment: targetApartmentId,
      status: { $in: ['confirmed', 'pending'] },
      $and: [
        { checkIn: { $lt: endDate } },
        { checkOut: { $gt: startDate } },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This apartment is already reserved for the selected dates. Please choose different dates.',
      });
    }
    // -------------------------------

    const apartmentDoc = await Apartment.findById(targetApartmentId);
    if (!apartmentDoc) {
      return res.status(404).json({ success: false, message: 'Apartment not found.' });
    }

    const diffTime = Math.abs(endDate - startDate);
    const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const calculatedTotalPrice =
      totalPrice && !isNaN(Number(totalPrice))
        ? Number(totalPrice)
        : calculatedNights * (apartmentDoc.pricePerNight || apartmentDoc.price || 0);

    const bookingPayload = {
      apartment: targetApartmentId,
      user: targetUserId ? String(targetUserId) : null,
      guestName: guestName ? String(guestName).trim() : 'Guest',
      guestEmail: guestEmail ? String(guestEmail).trim() : 'guest@example.com',
      guestPhone: guestPhone ? String(guestPhone).trim() : '',
      checkIn: startDate,
      checkOut: endDate,
      guests: Number(guests) || 1,
      totalPrice: calculatedTotalPrice,
      status: 'pending',
    };

    const newBooking = await Booking.create(bookingPayload);

    return res.status(201).json({
      success: true,
      data: newBooking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('❌ BOOKING CREATION FAILED:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create booking.',
    });
  }
});

/* ==========================================================================
   GET /api/bookings - Fetch all reservations (Global Admin + Optional User Filter)
   ========================================================================== */
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    let filter = {};
    if (userId && userId !== 'undefined' && userId !== 'null') {
      filter = { user: String(userId) };
    }

    const bookings = await Booking.find(filter)
      .populate('apartment')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   PATCH /api/bookings/:id/status - Update reservation status
   ========================================================================== */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('apartment');

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.json({ success: true, data: updatedBooking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   DELETE /api/bookings/:id - Delete reservation document
   ========================================================================== */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID format' });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: 'Reservation document not found' });
    }

    return res.json({
      success: true,
      message: 'Reservation document deleted successfully',
      data: deletedBooking,
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
