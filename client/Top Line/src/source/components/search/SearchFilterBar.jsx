import React from 'react';
import { Building, Calendar, Users, Search } from 'lucide-react';

export const SearchFilterBar = ({
  towerFilter,
  setTowerFilter,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  onSearch
}) => {
  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-left">

      {/* Tower Location Dropdown */}
      <div className="md:col-span-4 px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
          <Building className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
          <span>Tower Location</span>
        </label>
        <select
          value={towerFilter}
          onChange={(e) => setTowerFilter(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
        >
          <option value="All" className="dark:bg-slate-900">All Towers</option>
          <option value="Tower 1" className="dark:bg-slate-900">Tower 1</option>
          <option value="Tower 2" className="dark:bg-slate-900">Tower 2</option>
          <option value="Tower 3" className="dark:bg-slate-900">Tower 3</option>
        </select>
      </div>

      {/* Check-In & Check-Out Dates */}
      <div className="md:col-span-4 px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
          <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
          <span>Check-In & Check-Out</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Guests Dropdown */}
      <div className="md:col-span-2 px-4 py-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
          <Users className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
          <span>Guests</span>
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num} className="dark:bg-slate-900">
              {num} {num === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <div className="md:col-span-2">
        <button
          onClick={onSearch}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all text-sm"
        >
          <Search className="w-4 h-4" />
          <span>Search Units</span>
        </button>
      </div>

    </div>
  );
};

export default SearchFilterBar;