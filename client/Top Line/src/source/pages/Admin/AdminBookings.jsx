import i18n from "../../../i18n.js";
import { translateText } from '../../../utils/translateContent.js';
import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, Building, Clock, CheckCircle2, XCircle } from 'lucide-react';
import * as apiServices from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const fetchFn = apiServices.fetchAdminBookings || apiServices.fetchBookings;
        if (typeof fetchFn === 'function') {
          const res = await fetchFn();
          const data = res?.data?.data || res?.data || res;
          setBookings(Array.isArray(data) ? data : []);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Cancelled') return ['cancelled', 'canceled'].includes(b.status?.toLowerCase());
    return b.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Header & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{' '}{i18n.t("Reservations Overview")}{' '}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{' '}{i18n.t("Track active reservations, user contacts, and apartment assignments.")}{' '}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start">
          {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
        {i18n.t('Reservations remain pending until you receive the payment screenshot in WhatsApp. Confirm only after checking the WhatsApp chat.')}
      </p>

      {/* Bookings Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-slate-200 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-800 dark:text-slate-200 font-semibold text-base">{i18n.t("No reservations found")}</p>
          <p className="text-slate-400 dark:text-slate-300 text-xs mt-1">{i18n.t("There are currently no bookings matching the selected filter.")}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  <th className="p-4 pl-6">{i18n.t("Apartment")}</th>
                  <th className="p-4">{i18n.t("Customer Contact")}</th>
                  <th className="p-4">{i18n.t("Dates & Guests")}</th>
                  <th className="p-4">{i18n.t("Total Price")}</th>
                  <th className="p-4">{i18n.t("Deposit / Status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredBookings.map((b) => {
                  const apartment = b.apartmentId || b.apartment || {};
                  const user = b.guestInfo || b.userId || (typeof b.user === 'object' ? b.user : {}) || {};

                  return (
                    <tr key={b._id || b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      
                      {/* Apartment Info */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#c6a052]/10 text-[#785910] dark:text-[#dfbe74] flex items-center justify-center shrink-0">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {translateText(apartment.title || 'Apartment Unit')}
                            </p>
                            <span className="text-xs text-[#785910] dark:text-[#dfbe74] font-semibold">
                              {translateText(apartment.tower || 'Tower 1')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Guest Contact Details */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.guestName || user.name || user.fullName || 'Guest'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <a href={`tel:${user.phone || user.phoneNumber}`} className="hover:underline text-[#785910] dark:text-[#dfbe74] font-mono">
                              {b.guestPhone || user.phone || user.phoneNumber || 'N/A'}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.guestEmail || user.email || 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Dates & Guests */}
                      <td className="p-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.checkIn} â†’ {b.checkOut}</span>
                          </div>
                          <p className="text-slate-400 pl-5">{b.guests || 1}{' '}{i18n.t("Guests")}</p>
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="p-4">
                        <span className="font-black text-slate-900 dark:text-white">
                          {b.totalPrice ? formatCurrency(b.totalPrice) : 'N/A'}
                        </span>
                        <p className="mt-1 text-xs text-slate-500">{i18n.t('Deposit')}: {b.depositAmount != null ? formatCurrency(b.depositAmount) : '—'}</p>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === 'confirmed' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : ['cancelled', 'canceled'].includes(b.status)
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'bg-[#c6a052]/10 text-[#785910] dark:text-[#dfbe74]'
                        }`}>
                          {b.status === 'confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {b.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                          {b.status !== 'confirmed' && b.status !== 'cancelled' && <Clock className="w-3.5 h-3.5" />}
                          <span className="capitalize">{i18n.t(b.status || 'Pending')}</span>
                          {['cancelled', 'canceled'].includes(b.status) && (
                            <span className="block mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              {i18n.t('Apartment available for these dates')}
                            </span>
                          )}
                        </span>
                        <div className="mt-2 max-w-48 text-xs text-slate-600 dark:text-slate-300">
                          <p>{i18n.t(b.paymentMethod === 'vodafone_cash' ? 'Vodafone Cash' : 'InstaPay')} · {i18n.t(b.paymentStatus || 'No deposit details')}</p>
                          {b.paymentReference && <p className="mt-1 break-all">{i18n.t('Reference')}: {b.paymentReference}</p>}
                          {b.status !== 'confirmed' && ['awaiting_whatsapp', 'submitted'].includes(b.paymentStatus) && (
                            <button type="button" onClick={async () => {
                              try {
                                await apiServices.updateBookingStatus(b._id, 'confirmed');
                                setBookings((items) => items.map((item) => item._id === b._id ? { ...item, status: 'confirmed', paymentStatus: 'verified' } : item));
                              } catch (error) {
                                console.error('Failed to verify deposit:', error);
                              }
                            }} className="mt-2 min-h-9 rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-700">{i18n.t('Screenshot received on WhatsApp — confirm booking')}</button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
