import i18n from "../../../i18n.js";
import { translateText } from '../../../utils/translateContent.js';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { cancelBooking, fetchUserBookings } from '../../services/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, MapPin, ChevronRight, Home, MessageCircle, Info } from 'lucide-react';

export default function MyBookings() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    let active = true;
    fetchUserBookings(user.id)
      .then(({ data }) => {
        if (active) setBookings(data?.data || []);
      })
      .catch(() => {
        if (active) setError(i18n.t('Unable to load your bookings. Please try again later.'));
      });
    return () => { active = false; };
  }, [isLoaded, isSignedIn, user?.id]);

  const calculateNights = (start, end) => {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'pending':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'cancelled':
      case 'canceled':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/30';
    }
  };

  const handleCancelBooking = async (booking) => {
    const confirmed = await new Promise((resolve) => {
      let answered = false;
      const answer = (value, toastId) => {
        if (answered) return;
        answered = true;
        toast.dismiss(toastId);
        resolve(value);
      };

      toast.custom((toastItem) => (
        <div className="w-[min(360px,calc(100vw-32px))] rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 shadow-xl">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
            <p className="text-xs font-medium">{i18n.t('Are you sure you want to cancel this booking?')}</p>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => answer(false, toastItem.id)}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
            >
              {i18n.t('Keep Booking')}
            </button>
            <button
              type="button"
              onClick={() => answer(true, toastItem.id)}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
            >
              {i18n.t('Yes, cancel')}
            </button>
          </div>
        </div>
      ), { duration: Infinity });
    });
    if (!confirmed) return;

    setCancellingId(booking._id);
    try {
      const { data } = await cancelBooking(booking._id);
      const updatedBooking = data?.data;
      setBookings((current) => current.map((item) => item._id === booking._id
        ? { ...item, ...updatedBooking, apartment: updatedBooking?.apartment || item.apartment }
        : item));
      toast.success(i18n.t('Booking canceled successfully.'));
    } catch (err) {
      toast.error(err.response?.data?.message || i18n.t('Failed to cancel booking.'));
    } finally {
      setCancellingId(null);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!isSignedIn) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 p-12 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-blue-100/60 dark:border-blue-500/20 shadow-xl max-w-md">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
          <Home className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{i18n.t("Access Required")}</h2>
        <p className="text-slate-600 dark:text-slate-400">{i18n.t("Please sign in to view and manage your luxury property reservations.")}</p>
        <Link className="block w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30" to="/auth">{' '}{i18n.t("Sign In Now")}{' '}</Link>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full pb-20">
      {/* Ambient background glow */}
      <div className="bg-blue-500/10 blur-[120px] fixed top-1/4 -left-20 w-96 h-96 rounded-full -z-10 pointer-events-none"></div>
      <div className="bg-sky-500/10 blur-[120px] fixed bottom-1/4 -right-20 w-96 h-96 rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* Page Header */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 bg-clip-text text-transparent">{' '}{i18n.t("My Reservations")}{' '}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto">{' '}{i18n.t("Manage and track your active luxury apartment bookings and residency details.")}{' '}</p>
        </header>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 rounded-2xl text-center font-medium">
            {error}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-blue-100/60 dark:border-blue-500/20 rounded-3xl shadow-xl text-center space-y-6">
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600">
              <Calendar className="w-12 h-12 opacity-50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{i18n.t("No Bookings Found")}</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">{' '}{i18n.t("You haven't reserved any residences yet. Start exploring our luxury towers.")}{' '}</p>
            </div>
            <Link 
              to="/apartments" 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >{' '}{i18n.t("Explore Residences")}{' '}</Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const nights = calculateNights(booking.checkIn, booking.checkOut);
            const statusStyles = getStatusStyles(booking.status);

            return (
              <article 
                key={booking._id} 
                className="group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-blue-100/60 dark:border-blue-500/20 shadow-xl shadow-blue-900/5 rounded-3xl p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-300/60 flex flex-col md:flex-row gap-6 items-center md:items-start"
              >
                {/* Property Thumbnail */}
                <div className="relative w-full md:w-40 h-32 md:h-32 shrink-0 overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    src={booking.apartment?.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'} 
                    alt={translateText(booking.apartment?.title)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-md text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    {translateText(booking.apartment?.tower || 'Residence')}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 w-full space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        {translateText(booking.apartment?.title || 'Luxury Apartment')}
                      </h2>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                        <MapPin className="w-3 h-3" />
                        <span>{translateText(booking.apartment?.location || 'The Towers, Coastal District')}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles}`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusStyles.includes('emerald') ? 'bg-emerald-500' : statusStyles.includes('amber') ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                      {i18n.t(booking.status || 'Pending')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">{i18n.t("Dates")}</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'} 
                          <span className="mx-1 text-slate-400">—</span> 
                          {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">{i18n.t("Duration")}</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {nights ? `${nights} Nights` : 'TBD'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">{i18n.t("Guests")}</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {booking.guests || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      <Link 
                        to={`/apartments/${booking.apartment?._id || booking.apartment?.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50/80 dark:bg-slate-800 text-blue-600 dark:text-blue-300 rounded-xl text-xs font-bold transition-all hover:bg-blue-100 dark:hover:bg-slate-700 group/btn"
                      >{' '}{i18n.t("View Details")}{' '}<ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                      <Link 
                        to="/contact" 
                        className="flex items-center gap-2 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />{' '}{i18n.t("Support")}{' '}</Link>
                    </div>
                    {['pending', 'confirmed'].includes(booking.status?.toLowerCase()) && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking)}
                          disabled={cancellingId === booking._id}
                          className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          {cancellingId === booking._id ? i18n.t('Canceling...') : i18n.t('Cancel Booking')}
                        </button>
                      </div>
                    )}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">{i18n.t("Total Investment")}</span>
                      <span className="text-2xl font-black text-blue-600 dark:text-sky-400">
                        ${booking.totalPrice?.toLocaleString() || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
