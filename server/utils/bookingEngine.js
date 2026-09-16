import Booking from '../models/booking.js';

/**
 * Checks if an apartment is available for the given date range using Mongoose
 */
export async function isApartmentAvailable(apartmentId, checkIn, checkOut) {
  const overlapExists = await Booking.checkOverlap(apartmentId, checkIn, checkOut);
  return !overlapExists;
}

/**
 * Calculates pricing breakdown based on stay duration
 */
export function calculateBookingPrice(baseRate, cleaningFee, securityDeposit, minNights, checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const totalNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (isNaN(totalNights) || totalNights <= 0) {
    throw new Error('Invalid check-in or check-out dates.');
  }

  const minimumStay = minNights || 1;
  if (totalNights < minimumStay) {
    throw new Error(`Minimum stay length for this unit is ${minimumStay} nights.`);
  }

  const rate = Number(baseRate) || 0;
  const cleaning = Number(cleaningFee) || 0;
  const deposit = Number(securityDeposit) || 0;

  const subtotal = totalNights * rate;
  const grandTotal = subtotal + cleaning + deposit;

  return {
    totalNights,
    nightlyRate: rate,
    subtotal,
    cleaningFee: cleaning,
    securityDeposit: deposit,
    grandTotal
  };
}