import i18n from "../../../i18n.js";
import toast from 'react-hot-toast';
import React, { useState } from "react";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { createBooking } from "../../services/api";
import { Calendar, Users, Phone, Mail, User, CreditCard } from "lucide-react";

const BookingForm = ({ apartment, currentUser, onSuccess }) => {
  const { isLoaded, isSignedIn } = useUser();
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

    if (!isSignedIn) return;

    if (!checkIn || !checkOut) {
      setError(i18n.t('Please select both Check-In and Check-Out dates.'));
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isNaN(nights) || nights <= 0) {
      setError(i18n.t('Check-Out date must be after Check-In date.'));
      return;
    }

    const apartmentId = apartment?._id || apartment?.id;
    if (!apartmentId) {
      setError(i18n.t('Invalid apartment selection.'));
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
        toast.success(i18n.t('Your reservation is saved!'));
      }
    } catch (err) {
      console.error('Booking submission failed:', err);
      const serverMessage =
        err.response?.data?.message || err.response?.data?.error || 'Booking request failed.';
      setError(serverMessage);
      toast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div id="booking-form" tabIndex={-1} className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-2xl">
      {/* Card Header */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">{i18n.t("Price per night")}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ${apartment?.pricePerNight || apartment?.price || '0'}
              </span>
              <span className="text-slate-700 dark:text-slate-200 text-base">{i18n.t("/ night")}</span>
            </div>
          </div>
          {total > 0 && (
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">{i18n.t("Total Estimate")}</p>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${total}</span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      {!isLoaded ? (
        <div className="p-6 text-center text-base text-slate-700 dark:text-slate-200">{i18n.t("Loading sign-in status...")}</div>
      ) : !isSignedIn ? (
        <div className="p-6 space-y-4 text-center">
          <p className="text-base text-slate-700 dark:text-slate-200">{i18n.t("Sign in to reserve this apartment.")}</p>
          <SignInButton mode="modal" forceRedirectUrl={window.location.href}>
            <button
              type="button"
              className="min-h-14 w-full rounded-2xl bg-slate-900 px-5 py-4 text-base font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:bg-blue-700 dark:hover:bg-blue-800"
            >{' '}{i18n.t("Sign In to Book")}{' '}</button>
          </SignInButton>
        </div>
      ) : <form onSubmit={handleBooking} className="p-6 space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="booking-guest-name" className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5 block">{i18n.t("Full Name")}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="booking-guest-name"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/40 focus:border-blue-600 outline-none transition-all text-base min-h-12"
                placeholder={i18n.t("Enter full name")}
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="booking-guest-email" className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5 block">{i18n.t("Email Address")}{' '}<span className="text-slate-600 dark:text-slate-300 font-normal">{i18n.t("(Optional)")}</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="booking-guest-email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/40 focus:border-blue-600 outline-none transition-all text-base min-h-12"
                placeholder={i18n.t("email@example.com")}
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="booking-guest-phone" className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5 block">{i18n.t("Phone Number")}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="booking-guest-phone"
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/40 focus:border-blue-600 outline-none transition-all text-base min-h-12"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="booking-check-in" className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5 block">{i18n.t("Check-In")}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="booking-check-in"
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/40 focus:border-blue-600 outline-none transition-all text-base min-h-12"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="booking-check-out" className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5 block">{i18n.t("Check-Out")}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="booking-check-out"
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/40 focus:border-blue-600 outline-none transition-all text-base min-h-12"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="booking-guest-count" className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5 block">{i18n.t("Guests")}</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="booking-guest-count"
                type="number"
                min="1"
                max={apartment?.guests || 10}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/40 focus:border-blue-600 outline-none transition-all text-base min-h-12"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="min-h-14 w-full rounded-2xl bg-slate-900 px-5 py-4 text-base font-bold text-white transition-all hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>{i18n.t("Reserve Now")}</span>
            </>
          )}
        </button>
      </form>}
    </div>
  );
};

export default BookingForm;
