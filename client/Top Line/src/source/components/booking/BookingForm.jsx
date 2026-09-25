import React, { useState } from "react";
import { createBooking } from "../../services/api";
import { Calendar, Users, Phone, Mail, User, CreditCard } from "lucide-react";

const BookingForm = ({ apartment, currentUser, onSuccess }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState(
    currentUser?.fullName || currentUser?.name || currentUser?.firstName || ''
  );
  const [guestEmail, setGuestEmail] = useState(
    currentUser?.primaryEmailAddress?.emailAddress || currentUser?.email || ''
  );
  const [guestPhone, setGuestPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const pricePerNight = Number(apartment?.pricePerNight || apartment?.price || 0);
    return nights > 0 ? nights * pricePerNight : 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!checkIn || !checkOut) {
      setError('Please select both Check-In and Check-Out dates.');
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isNaN(nights) || nights <= 0) {
      setError('Check-Out date must be after Check-In date.');
      return;
    }

    const apartmentId = apartment?._id || apartment?.id;
    if (!apartmentId) {
      setError('Invalid apartment selection.');
      return;
    }

    const pricePerNight = Number(apartment?.pricePerNight || apartment?.price || 0);
    const totalPrice = nights * pricePerNight;

    setLoading(true);

    try {
      const payload = {
        apartment: apartmentId,
        user: currentUser?.id || currentUser?._id || null,
        guestName: guestName || 'Guest User',
        guestEmail: guestEmail || 'guest@example.com',
        guestPhone: guestPhone || '',
        checkIn: start.toISOString(),
        checkOut: end.toISOString(),
        guests: Number(guests),
        totalPrice: Number(totalPrice),
      };

      const response = await createBooking(payload);

      if (response.data.success) {
        if (onSuccess) onSuccess(response.data.data);
        alert('Booking reserved successfully!');
      }
    } catch (err) {
      console.error('Booking submission failed:', err);
      const serverMessage =
        err.response?.data?.message || err.response?.data?.error || 'Booking request failed.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-2xl">
      {/* Card Header */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Price per night</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ${apartment?.pricePerNight || apartment?.price || '0'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">/ night</span>
            </div>
          </div>
          {total > 0 && (
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Estimate</p>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">${total}</span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleBooking} className="p-6 space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="Enter full name"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Email Address <span className="text-slate-400 font-normal">(Optional)</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Check-In</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Check-Out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                min="1"
                max={apartment?.guests || 10}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-amber-600 text-white font-bold text-sm transition-all hover:bg-slate-800 dark:hover:bg-amber-700 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Reserve Now</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
