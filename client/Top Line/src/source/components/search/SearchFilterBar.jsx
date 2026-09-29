import i18n from "../../../i18n.js";
import React, { useEffect, useRef, useState } from 'react';
import { Building, Calendar, Users, Search, ChevronDown, Check, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const towerOptions = [
  { value: 'All', label: 'All Towers' },
  { value: 'Tower 1', label: 'Tower 1' },
  { value: 'Tower 2', label: 'Tower 2' },
  { value: 'Tower 3', label: 'Tower 3' },
];

const getToday = () => {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};

const parseDate = (value) => {
  if (!value) return new Date();
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
};

const toDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DatePicker = ({ value, min, onSelect, onClose, align = 'start' }) => {
  const [month, setMonth] = useState(() => {
    const initial = parseDate(value || min);
    return new Date(initial.getFullYear(), initial.getMonth(), 1, 12);
  });
  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const today = getToday();
  const minValue = min || today;
  const formatter = new Intl.DateTimeFormat(i18n.language?.startsWith('ar') ? 'ar-EG' : 'en-US', {
    month: 'long', year: 'numeric',
  });
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(2026, 5, 7 + index);
    return new Intl.DateTimeFormat(i18n.language?.startsWith('ar') ? 'ar-EG' : 'en-US', { weekday: 'short' }).format(date);
  });

  return (
    <div role="dialog" aria-label={i18n.t('Choose a date')} className={`absolute ${align === 'end' ? 'end-0' : 'start-0'} top-full z-40 mt-2 w-[calc(100vw_-_1.5rem)] max-w-80 rounded-xl border border-[#dfbe74]/35 bg-[#152038]/[0.98] p-3 text-[#f9f8f5] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.65),0_0_1px_1px_rgba(198,160,82,0.18)] backdrop-blur-xl sm:w-80 sm:p-4`}>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label={i18n.t('Previous month')} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1, 12))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#d4cebf] transition-colors hover:bg-white/10 hover:text-[#dfbe74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbe74]">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold text-[#f9f8f5]">{formatter.format(month)}</p>
        <button type="button" aria-label={i18n.t('Next month')} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1, 12))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#d4cebf] transition-colors hover:bg-white/10 hover:text-[#dfbe74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbe74]">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0 text-center sm:gap-1">
        {weekdays.map((weekday, index) => <span key={`${weekday}-${index}`} className="py-1 text-[11px] font-semibold text-[#d4cebf]">{weekday}</span>)}
        {Array.from({ length: firstWeekday }, (_, index) => <span key={`empty-${index}`} aria-hidden="true" />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const date = new Date(month.getFullYear(), month.getMonth(), index + 1, 12);
          const dateValue = toDateValue(date);
          const disabled = dateValue < minValue;
          const selected = dateValue === value;
          const isToday = dateValue === today;
          return (
            <button key={dateValue} type="button" disabled={disabled} aria-pressed={selected}
              aria-label={new Intl.DateTimeFormat(i18n.language || 'en', { dateStyle: 'full' }).format(date)}
              onClick={() => { onSelect(dateValue); onClose(); }}
              className={`h-8 w-8 justify-self-center rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbe74] sm:h-9 sm:w-9 ${selected ? 'bg-[#c6a052] font-bold text-[#080d1a]' : isToday ? 'border border-[#dfbe74]/60 text-[#dfbe74]' : 'text-[#f9f8f5] hover:bg-[#c6a052]/20 hover:text-[#dfbe74]'} disabled:cursor-not-allowed disabled:text-[#d4cebf]/30`}>
              {new Intl.NumberFormat(i18n.language || 'en').format(index + 1)}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
        <button type="button" onClick={() => { onSelect(''); onClose(); }} className="text-xs font-medium text-[#d4cebf] transition-colors hover:text-[#dfbe74]">{i18n.t('Clear')}</button>
        <button type="button" onClick={() => { onSelect(today < minValue ? minValue : today); onClose(); }} className="text-xs font-semibold text-[#dfbe74] transition-colors hover:text-[#ffdea2]">{i18n.t('Today')}</button>
      </div>
    </div>
  );
};

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
  const [openMenu, setOpenMenu] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!filterRef.current?.contains(event.target)) setOpenMenu(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const selectedTower = towerOptions.find((option) => option.value === towerFilter) || towerOptions[0];
  const today = getToday();

  return (
    <div ref={filterRef} className="mx-auto grid w-full grid-cols-1 items-center overflow-visible rounded-2xl border border-slate-200 bg-[#f9f8f5] p-2 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] dark:border-[#c6a052]/20 dark:bg-[#0b1325] dark:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.7)] lg:grid-cols-2 xl:grid-cols-[minmax(220px,1.05fr)_minmax(390px,1.75fr)_minmax(190px,0.8fr)_190px] xl:rounded-[1.5rem] xl:p-3">
      <div className="relative min-w-0 border-b border-slate-200/80 px-3 py-3 dark:border-[#c6a052]/15 md:px-5 xl:border-b-0 xl:border-e xl:py-4">
        <p className="mb-2 flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.08em] text-[#785910] dark:text-[#dfbe74]">
          <Building className="h-4 w-4 shrink-0 text-[#a68032] dark:text-[#dfbe74]" />{i18n.t('Tower Location')}
        </p>
        <button type="button" aria-haspopup="listbox" aria-expanded={openMenu === 'tower'}
          onClick={() => setOpenMenu(openMenu === 'tower' ? null : 'tower')}
          className={`flex min-h-11 w-full items-center justify-between rounded-lg border px-3 text-sm font-semibold transition-colors ${openMenu === 'tower' ? 'border-[#c6a052] bg-white dark:bg-[#152038]' : 'border-transparent bg-white/70 hover:border-[#c6a052]/50 hover:bg-white dark:bg-[#131b2e] dark:hover:border-[#c6a052]/40 dark:hover:bg-[#152038]'} text-slate-900 dark:text-[#f9f8f5]`}>
          <span>{i18n.t(selectedTower.label)}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-[#a68032] transition-transform dark:text-[#dfbe74] ${openMenu === 'tower' ? 'rotate-180' : ''}`} />
        </button>
        {openMenu === 'tower' && (
          <div role="listbox" aria-label={i18n.t('Tower Location')} className="absolute inset-x-3 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#c6a052]/35 bg-[#f9f8f5] p-1.5 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.25)] dark:bg-[#152038] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] md:inset-x-5">
            {towerOptions.map((option) => {
              const selected = option.value === towerFilter;
              return (
                <button key={option.value} type="button" role="option" aria-selected={selected}
                  onClick={() => { setTowerFilter(option.value); setOpenMenu(null); }}
                  className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-medium transition-colors ${selected ? 'bg-[#c6a052]/15 text-[#785910] dark:bg-[#c6a052]/20 dark:text-[#f0d99d]' : 'text-slate-700 hover:bg-[#c6a052]/10 hover:text-[#785910] dark:text-[#dbe2fb] dark:hover:bg-[#c6a052]/10 dark:hover:text-[#dfbe74]'}`}>
                  {i18n.t(option.label)}{selected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="min-w-0 border-b border-slate-200/80 px-3 py-3 dark:border-[#c6a052]/15 md:px-5 xl:border-b-0 xl:border-e xl:py-4">
        <p className="mb-2 flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.08em] text-[#785910] dark:text-[#dfbe74]">
          <Calendar className="h-4 w-4 shrink-0 text-[#a68032] dark:text-[#dfbe74]" />{i18n.t('Check-In & Check-Out')}
        </p>
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <button type="button" aria-label={i18n.t('Check-In')} aria-haspopup="dialog" aria-expanded={openMenu === 'checkIn'} onClick={() => setOpenMenu(openMenu === 'checkIn' ? null : 'checkIn')}
              className={`flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-white px-2 text-left text-[13px] font-medium transition-colors dark:bg-[#080d1a] sm:px-3 sm:text-sm ${openMenu === 'checkIn' ? 'border-[#c6a052] ring-2 ring-[#c6a052]/15 dark:border-[#dfbe74]' : 'border-slate-200 text-slate-800 hover:border-[#c6a052]/70 dark:border-[#4e4638] dark:text-[#dbe2fb]'}`}>
              <span className="truncate">{checkIn ? new Intl.DateTimeFormat(i18n.language?.startsWith('ar') ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parseDate(checkIn)) : 'mm/dd/yyyy'}</span>
              <Calendar className="h-4 w-4 shrink-0 text-[#a68032] dark:text-[#dfbe74]" />
            </button>
            {openMenu === 'checkIn' && <DatePicker key="checkIn" value={checkIn} min={today} onSelect={(value) => { setCheckIn(value); if (checkOut && value && value >= checkOut) setCheckOut(''); }} onClose={() => setOpenMenu(null)} />}
          </div>
          <span className="shrink-0 text-xs font-medium text-[#a68032] dark:text-[#dfbe74]">–</span>
          <div className="relative min-w-0 flex-1">
            <button type="button" aria-label={i18n.t('Check-Out')} aria-haspopup="dialog" aria-expanded={openMenu === 'checkOut'} onClick={() => setOpenMenu(openMenu === 'checkOut' ? null : 'checkOut')}
              className={`flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-white px-2 text-left text-[13px] font-medium transition-colors dark:bg-[#080d1a] sm:px-3 sm:text-sm ${openMenu === 'checkOut' ? 'border-[#c6a052] ring-2 ring-[#c6a052]/15 dark:border-[#dfbe74]' : 'border-slate-200 text-slate-800 hover:border-[#c6a052]/70 dark:border-[#4e4638] dark:text-[#dbe2fb]'}`}>
              <span className="truncate">{checkOut ? new Intl.DateTimeFormat(i18n.language?.startsWith('ar') ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parseDate(checkOut)) : 'mm/dd/yyyy'}</span>
              <Calendar className="h-4 w-4 shrink-0 text-[#a68032] dark:text-[#dfbe74]" />
            </button>
            {openMenu === 'checkOut' && <DatePicker key="checkOut" value={checkOut} min={checkIn || today} onSelect={setCheckOut} onClose={() => setOpenMenu(null)} align="end" />}
          </div>
        </div>
      </div>

      <div className="relative min-w-0 border-b border-slate-200/80 px-3 py-3 dark:border-[#c6a052]/15 lg:border-b-0 md:px-5 xl:py-4">
        <p className="mb-2 flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.08em] text-[#785910] dark:text-[#dfbe74]">
          <Users className="h-4 w-4 shrink-0 text-[#a68032] dark:text-[#dfbe74]" />{i18n.t('Guests')}
        </p>
        <button type="button" aria-haspopup="dialog" aria-expanded={openMenu === 'guests'}
          onClick={() => setOpenMenu(openMenu === 'guests' ? null : 'guests')}
          className={`flex min-h-11 w-full items-center justify-between rounded-lg border px-3 text-sm font-semibold transition-colors ${openMenu === 'guests' ? 'border-[#c6a052] bg-white dark:bg-[#152038]' : 'border-transparent bg-white/70 hover:border-[#c6a052]/50 hover:bg-white dark:bg-[#131b2e] dark:hover:border-[#c6a052]/40 dark:hover:bg-[#152038]'} text-slate-900 dark:text-[#f9f8f5]`}>
          <span>{guests} {i18n.t(guests === 1 ? 'Guest' : 'Guests')}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-[#a68032] transition-transform dark:text-[#dfbe74] ${openMenu === 'guests' ? 'rotate-180' : ''}`} />
        </button>
        {openMenu === 'guests' && (
          <div role="dialog" aria-label={i18n.t('Guests')} className="absolute start-0 top-full z-30 mt-2 w-80 max-w-[calc(100vw_-_2rem)] rounded-xl border border-[#c6a052]/35 bg-[#f9f8f5] p-4 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.25)] dark:bg-[#152038] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900 dark:text-[#f9f8f5]">{i18n.t('Guests')}</p><p className="mt-0.5 whitespace-nowrap text-xs text-slate-500 dark:text-[#d4cebf]">{i18n.t('Choose up to 10 guests')}</p></div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" aria-label={i18n.t('Decrease guests')} disabled={guests <= 1} onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c6a052]/50 text-[#785910] transition-colors hover:bg-[#c6a052]/15 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#dfbe74]"><Minus className="h-4 w-4" /></button>
                <span className="min-w-5 text-center font-semibold text-slate-900 dark:text-[#f9f8f5]">{guests}</span>
                <button type="button" aria-label={i18n.t('Increase guests')} disabled={guests >= 10} onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c6a052]/50 text-[#785910] transition-colors hover:bg-[#c6a052]/15 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#dfbe74]"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
            <button type="button" onClick={() => setOpenMenu(null)} className="mt-4 w-full rounded-lg bg-[#c6a052] px-3 py-2 text-sm font-semibold text-[#080d1a] transition-colors hover:bg-[#dfbe74]">{i18n.t('Done')}</button>
          </div>
        )}
      </div>

      <div className="px-3 py-3 md:px-5 xl:py-4 xl:pl-3">
        <button type="button" onClick={onSearch}
          className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#a68032]/30 bg-[#c6a052] px-4 text-sm font-semibold text-[#080d1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_8px_20px_-12px_rgba(166,128,50,0.8)] transition-colors duration-200 hover:bg-[#dfbe74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f8f5] active:bg-[#a68032] dark:focus-visible:ring-offset-[#0b1325]">
          <Search className="h-4 w-4 transition-transform group-hover:scale-110" /><span>{i18n.t('Search Units')}</span>
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
