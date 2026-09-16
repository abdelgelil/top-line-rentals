import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../services/api';

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state || {};
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      const response = await API.post('/bookings', {
        apartmentId: bookingDetails.apartmentId,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        totalPrice: bookingDetails.totalPrice,
      });

      if (response.data.success) {
        alert('Booking confirmed!');
        navigate('/');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Booking creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Confirm Your Reservation</h1>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <p><strong>Apartment ID:</strong> {bookingDetails.apartmentId}</p>
        <p><strong>Total Price:</strong> ${bookingDetails.totalPrice}</p>
        <button
          onClick={handleConfirmBooking}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
        >
          {loading ? 'Processing...' : 'Confirm & Pay'}
        </button>
      </div>
    </div>
  );
};