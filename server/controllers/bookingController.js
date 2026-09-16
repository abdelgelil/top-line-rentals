import Apartment from '../models/Apartment.js';
import Booking from '../models/booking.js';
import { isApartmentAvailable, calculateBookingPrice } from '../utils/bookingEngine.js';

export const createBooking = async (req, res) => {
  try {
    const { apartmentId, guestName, guestEmail, guestPhone, checkIn, checkOut, totalGuests } = req.body;

    // 1. Fetch apartment pricing metrics from MongoDB
    const apt = await Apartment.findById(apartmentId);
    if (!apt) {
      return res.status(404).json({ success: false, message: 'Apartment not found.' });
    }

    // 2. Validate availability against overlap dates
    const available = await isApartmentAvailable(apartmentId, checkIn, checkOut);
    if (!available) {
      return res.status(400).json({ success: false, message: 'Apartment is already booked for these dates.' });
    }

    // 3. Compute billing costs using apartment model fields
    const pricing = calculateBookingPrice(
      apt.price_per_night || apt.base_nightly_rate,
      apt.cleaning_fee || 0,
      apt.security_deposit || 0,
      apt.min_nights || 1,
      checkIn,
      checkOut
    );

    // 4. Save booking into MongoDB using static model method
    const newBooking = await Booking.createBooking({
      apartmentId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      totalNights: pricing.totalNights,
      totalGuests,
      nightlyRate: pricing.nightlyRate,
      subtotal: pricing.subtotal,
      cleaningFee: pricing.cleaningFee,
      securityDeposit: pricing.securityDeposit,
      grandTotal: pricing.grandTotal
    });

    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};