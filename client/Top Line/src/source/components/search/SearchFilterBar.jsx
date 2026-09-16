import React, { useState } from 'react';
import { Building2, Calendar, Users, Search, ChevronDown, Check, Minus, Plus } from 'lucide-react';

export const SearchFilterBar = ({
  towerFilter = 'All',
  setTowerFilter,
  checkIn = '',
  setCheckIn,
  checkOut = '',
  setCheckOut,
  guests = 1,
  setGuests,
  onSearch
}) => {
  const [towerMenuOpen, setTowerMenuOpen] = useState(false);
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);

  const towerOptions = ['All', 'San Stefano Tower', 'Four Seasons Tower'];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form
        onSubmit={handleSearchSubmit}
        className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 shadow-2xl rounded-3xl p-2 md:p-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 transition-all"
      >
        {/* 1. Tower Selection Dropdown */}
        <div className="relative w-full md:w-1/3 px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/80">
          <label className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-amber-500 mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Tower Location</span>
          </label>

          <button
            type="button"
            onClick={() => {
              setTowerMenuOpen(!towerMenuOpen);
              setGuestMenuOpen(false);
            }}
            className="w-full flex items-center justify-between text-left text-slate-800 dark:text-slate-100 font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            <span className="truncate">{towerFilter === 'All' ? 'All Towers' : towerFilter}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${towerMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {towerMenuOpen && (
            <div className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              {towerOptions.map((tower) => {
                const isSelected = towerFilter === tower || (tower === 'All' && towerFilter === 'All');
                return (
                  <button
                    key={tower}
                    type="button"
                    onClick={() => {
                      setTowerFilter(tower);
                      setTowerMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{tower === 'All' ? 'All Towers' : tower}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Dates Selection Inputs */}
        <div className="w-full md:w-2/5 px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/80">
          <label className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-amber-500 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Check-in & Check-out</span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-1/2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <span className="text-slate-300 dark:text-slate-600">-</span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-1/2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* 3. Modern Guest Counter Popover */}
        <div className="relative w-full md:w-1/4 px-4 py-3">
          <label className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-amber-500 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Guests</span>
          </label>

          <button
            type="button"
            onClick={() => {
              setGuestMenuOpen(!guestMenuOpen);
              setTowerMenuOpen(false);
            }}
            className="w-full flex items-center justify-between text-left text-slate-800 dark:text-slate-100 font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${guestMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {guestMenuOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Total Guests</p>
                  <p className="text-[10px] text-slate-400">Adults & Children</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 w-4 text-center">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests(guests + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Action Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 active:scale-95 shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Search Units</span>
        </button>
      </form>
    </div>
  );
};