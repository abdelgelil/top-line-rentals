import i18n from "../../../i18n.js";
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { CalendarDays, ChevronLeft, ShieldCheck, Users } from 'lucide-react';

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
        toast.success(i18n.t('Booking confirmed!'));
        navigate('/my-bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || i18n.t('Booking creation failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] bg-[#f9f8f5] px-4 py-12 text-[#080d1a] sm:px-6 sm:py-16 dark:bg-[#080d1a] dark:text-[#f9f8f5]">
      <div className="mx-auto max-w-3xl">
        <Link to="/apartments" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#785910] hover:text-[#a68032] dark:text-[#dfbe74]"><ChevronLeft className="h-4 w-4" />{i18n.t('Continue browsing', 'Continue browsing')}</Link>
        <div className="mb-8 mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#785910] dark:text-[#dfbe74]">{i18n.t('Reservation')}</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{i18n.t('Confirm Your Reservation')}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-[#d4cebf]">{i18n.t('Review your stay details before confirming your booking.')}</p>
        </div>
        <section className="overflow-hidden rounded-2xl border border-[#c6a052]/30 bg-white shadow-[0_20px_50px_-28px_rgba(8,13,26,.28)] dark:bg-[#0b1325]" aria-label={i18n.t('Reservation summary')}>
          <div className="border-b border-[#1f2e4d]/15 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">{bookingDetails.apartmentName || bookingDetails.title || i18n.t('Your selected apartment')}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 h-5 w-5 text-[#a68032] dark:text-[#dfbe74]"/><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#d4cebf]">{i18n.t('Stay dates')}</p><p className="mt-1 text-sm font-semibold">{bookingDetails.checkIn || '—'} <span aria-hidden="true">→</span> {bookingDetails.checkOut || '—'}</p></div></div>
              <div className="flex items-start gap-3"><Users className="mt-0.5 h-5 w-5 text-[#a68032] dark:text-[#dfbe74]"/><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#d4cebf]">{i18n.t('Guests')}</p><p className="mt-1 text-sm font-semibold">{bookingDetails.guests || '—'}</p></div></div>
            </div>
          </div>
          <div className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4"><span className="text-sm text-slate-600 dark:text-[#d4cebf]">{i18n.t('Total price')}</span><span className="text-2xl font-semibold text-[#785910] dark:text-[#dfbe74]">{formatCurrency(bookingDetails.totalPrice || 0)}</span></div>
            <button onClick={handleConfirmBooking} disabled={loading || !bookingDetails.apartmentId} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#c6a052] px-6 font-bold text-[#080d1a] shadow-lg transition-colors hover:bg-[#dfbe74] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#dfbe74]/40 disabled:cursor-not-allowed disabled:opacity-50">
              <ShieldCheck className="h-5 w-5"/>{loading ? i18n.t('Processing...') : i18n.t('Confirm & Pay')}
            </button>
            <p className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-500 dark:text-[#d4cebf]"><ShieldCheck className="h-4 w-4 shrink-0"/>{i18n.t('Your reservation details are handled securely.')}</p>
            {!bookingDetails.apartmentId && <p role="alert" className="text-center text-sm text-rose-700 dark:text-rose-300">{i18n.t('Your booking details are missing. Choose an apartment to continue.')}</p>}
          </div>
        </section>
      </div>
    </main>
  );
};
