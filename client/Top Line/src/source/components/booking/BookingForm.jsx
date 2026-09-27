import i18n from "../../../i18n.js";
import toast from 'react-hot-toast';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createBooking, fetchApartmentBookings } from "../../services/api";
import { formatCurrency } from '../../utils/formatters';
import DateRangePicker, { dateRangeOverlaps, hasBookedNight } from './DateRangePicker';
import { Users, Phone, Mail, User, CreditCard } from "lucide-react";

const getStayNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const toUtcDay = (value) => {
    const [year, month, day] = value.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  };
  const nights = (toUtcDay(checkOut) - toUtcDay(checkIn)) / 86_400_000;
  return Number.isInteger(nights) && nights > 0 ? nights : 0;
};

const BookingForm = ({ apartment, currentUser, onSuccess }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState(
    currentUser?.fullName || currentUser?.name || currentUser?.firstName || ''
  );
  const [guestEmail, setGuestEmail] = useState(
    currentUser?.primaryEmailAddress?.emailAddress || currentUser?.email || ''
  );
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apartmentId = apartment?._id || apartment?.id;
  const [availability, setAvailability] = useState({ apartmentId: null, loading: true, ranges: [], error: '' });

  useEffect(() => {
    if (!apartmentId) return;
    let active = true;
    fetchApartmentBookings(apartmentId)
      .then(({ data }) => {
        if (!active) return;
        setAvailability({
          apartmentId,
          loading: false,
          ranges: (data?.data || []).map(({ checkIn, checkOut }) => ({
            checkIn: String(checkIn || '').slice(0, 10),
            checkOut: String(checkOut || '').slice(0, 10),
          })).filter(({ checkIn, checkOut }) => checkIn && checkOut),
          error: '',
        });
      })
      .catch(() => {
        if (!active) return;
        setAvailability({ apartmentId, loading: false, ranges: [], error: i18n.t('booking.availabilityFailed') });
      });
    return () => { active = false; };
  }, [apartmentId]);

  const availabilityLoading = availability.apartmentId !== apartmentId || availability.loading;
  const availabilityError = availability.apartmentId === apartmentId ? availability.error : '';
  const bookedRanges = availability.apartmentId === apartmentId ? availability.ranges : [];
  const retryAvailability = () => {
    if (!apartmentId) return;
    setAvailability({ apartmentId, loading: true, ranges: [], error: '' });
    fetchApartmentBookings(apartmentId)
      .then(({ data }) => setAvailability({
        apartmentId,
        loading: false,
        ranges: (data?.data || []).map(({ checkIn, checkOut }) => ({
          checkIn: String(checkIn || '').slice(0, 10),
          checkOut: String(checkOut || '').slice(0, 10),
        })).filter(({ checkIn, checkOut }) => checkIn && checkOut),
        error: '',
      }))
      .catch(() => setAvailability({ apartmentId, loading: false, ranges: [], error: i18n.t('booking.availabilityFailed') }));
  };

  const nightsCount = getStayNights(checkInDate, checkOutDate);
  const pricePerNight = Number(apartment?.pricePerNight || apartment?.price || 0);
  const totalPrice = nightsCount * pricePerNight;

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!isSignedIn) return;

    if (!checkInDate || !checkOutDate) {
      setError(i18n.t('Please select both Check-In and Check-Out dates.'));
      return;
    }

    const nights = getStayNights(checkInDate, checkOutDate);
    const start = new Date(`${checkInDate}T00:00:00.000Z`);
    const end = new Date(`${checkOutDate}T00:00:00.000Z`);

    if (isNaN(nights) || nights <= 0) {
      setError(i18n.t('Check-Out date must be after Check-In date.'));
      return;
    }

    if (!apartmentId) {
      setError(i18n.t('Invalid apartment selection.'));
      return;
    }

    if (availabilityLoading || availabilityError) {
      setError(availabilityError || i18n.t('booking.checkingAvailability'));
      return;
    }
    if (hasBookedNight(checkInDate, bookedRanges) || dateRangeOverlaps(checkInDate, checkOutDate, bookedRanges)) {
      setError(i18n.t('booking.datesUnavailable'));
      return;
    }

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

  return (
    <div id="booking-form" tabIndex={-1} className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-2xl">
      {/* Card Header */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">{i18n.t("Price per night")}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {formatCurrency(apartment?.pricePerNight || apartment?.price || 0)}
              </span>
              <span className="text-slate-700 dark:text-slate-200 text-base">{i18n.t("/ night")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      {!isLoaded ? (
        <div className="p-6 text-center text-base text-slate-700 dark:text-slate-200">{i18n.t("Loading sign-in status...")}</div>
      ) : !isSignedIn ? (
        <div className="p-6 space-y-4 text-center">
          <p className="text-base text-slate-700 dark:text-slate-200">{i18n.t("Sign in to reserve this apartment.")}</p>
          <Link to="/sign-in" className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-4 text-base font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:bg-blue-700 dark:hover:bg-blue-800">{i18n.t("Sign In to Book")}</Link>
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

          <DateRangePicker
            checkIn={checkInDate}
            checkOut={checkOutDate}
            onCheckInChange={setCheckInDate}
            onCheckOutChange={setCheckOutDate}
            bookedRanges={bookedRanges}
            loading={availabilityLoading}
            loadError={availabilityError}
            onRetry={retryAvailability}
          />

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

        <section className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 dark:border-blue-900 dark:bg-blue-950/30" aria-live="polite" aria-label={i18n.t('booking.priceBreakdown')}>
          <div className="flex items-center justify-between gap-4 text-base text-slate-700 dark:text-slate-200">
            <span>{i18n.t('booking.pricePerNight')}</span>
            <span className="font-semibold">{formatCurrency(pricePerNight)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-base text-slate-700 dark:text-slate-200">
            <span>{i18n.t('booking.totalNights')}</span>
            <span className="font-semibold">{nightsCount} {i18n.t('booking.night', { count: nightsCount })}</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-blue-200 pt-3 text-lg font-extrabold text-blue-800 dark:border-blue-900 dark:text-blue-200">
            <span>{i18n.t('booking.totalPrice')}</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </section>

        <button 
          type="submit" 
          disabled={loading || !checkInDate || !checkOutDate || availabilityLoading || Boolean(availabilityError)}
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
