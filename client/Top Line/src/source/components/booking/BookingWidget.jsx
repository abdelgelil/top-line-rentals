import React, { useState } from 'react';
import { Calendar, Users, ShieldCheck, Sparkles, CreditCard, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const BookingWidget = ({ pricePerNight = 5000, maxGuests = 4, onReserve }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  // Calculate total nights stay
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const subtotal = pricePerNight * nights;
  const cleaningFee = Math.round(pricePerNight * 0.15);
  const serviceFee = Math.round(subtotal * 0.08);
  const totalAmount = subtotal + cleaningFee + serviceFee;

  const handleReserveSubmit = (e) => {
    e.preventDefault();
    if (onReserve) {
      onReserve({ checkIn, checkOut, guests, nights, totalAmount });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 sticky top-24">
      
      {/* Price Header */}
      <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(pricePerNight)}
          </span>
          <span className="text-xs text-slate-500 font-medium"> / night</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Best Rate Guaranteed</span>
        </div>
      </div>

      {/* Booking Form Inputs */}
      <form onSubmit={handleReserveSubmit} className="space-y-4">
        
        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="space-y-1 p-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-500" /> Check-In
            </label>
            <input
              type="date"
              required
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            />
          </div>

          <div className="space-y-1 p-2 border-l border-slate-200 dark:border-slate-700/60">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-500" /> Check-Out
            </label>
            <input
              type="date"
              required
              min={checkIn}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Guests Selector */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Users className="w-3 h-3 text-amber-500" /> Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num} className="dark:bg-slate-900">
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <CreditCard className="w-4 h-4" />
          <span>Reserve Residence</span>
        </button>
      </form>

      {/* Transparent Price Breakdown */}
      <div className="space-y-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>
            {formatCurrency(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            Cleaning & Prep Fee <Info className="w-3 h-3 text-slate-400" />
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatCurrency(cleaningFee)}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            Concierge & Service Fee <Info className="w-3 h-3 text-slate-400" />
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatCurrency(serviceFee)}
          </span>
        </div>

        {/* Total Price */}
        <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-800">
          <span>Total</span>
          <span className="text-amber-600 dark:text-amber-400">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Security Guarantee Badge */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>No instant charge. Free cancellation up to 48 hours prior.</span>
      </div>

    </div>
  );
};