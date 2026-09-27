import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import i18n from '../../../i18n.js';

const toDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const fromDateKey = (key) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};
const todayKey = toDateKey(new Date());

const hasBookedNight = (dateKey, ranges) => ranges.some(({ checkIn, checkOut }) => dateKey >= checkIn && dateKey < checkOut);
const dateRangeOverlaps = (start, end, ranges) => ranges.some(({ checkIn, checkOut }) => start < checkOut && end > checkIn);

const formatReadableDate = (dateKey) => {
  if (!dateKey) return i18n.t('booking.selectDate');
  return fromDateKey(dateKey).toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  bookedRanges = [],
  loading = false,
  loadError = '',
  onRetry,
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectionError, setSelectionError] = useState('');

  const calendarCells = useMemo(() => {
    const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const offset = first.getDay();
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(first.getFullYear(), first.getMonth(), index - offset + 1);
      return date.getMonth() === first.getMonth() ? date : null;
    });
  }, [visibleMonth]);

  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(i18n.resolvedLanguage || i18n.language || 'en', { weekday: 'short' })
      .format(new Date(2024, 0, 7 + index))), []);

  const monthLabel = visibleMonth.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'en', {
    month: 'long',
    year: 'numeric',
  });

  const handleDateClick = (dateKey) => {
    setSelectionError('');
    const selectingCheckIn = !checkIn || Boolean(checkOut) || dateKey <= checkIn;

    if (selectingCheckIn) {
      if (hasBookedNight(dateKey, bookedRanges)) return;
      onCheckInChange(dateKey);
      onCheckOutChange('');
      return;
    }

    if (dateRangeOverlaps(checkIn, dateKey, bookedRanges)) {
      setSelectionError(i18n.t('booking.datesUnavailable'));
      return;
    }
    onCheckOutChange(dateKey);
  };

  const isDisabled = (dateKey) => {
    if (!dateKey || dateKey < todayKey || loading || loadError) return true;
    const selectingCheckIn = !checkIn || Boolean(checkOut) || dateKey <= checkIn;
    if (selectingCheckIn) return hasBookedNight(dateKey, bookedRanges);
    return dateRangeOverlaps(checkIn, dateKey, bookedRanges);
  };

  const isInSelectedRange = (dateKey) => checkIn && checkOut && dateKey >= checkIn && dateKey <= checkOut;

  return (
    <section className="space-y-4" aria-label={i18n.t('booking.chooseDates')}>
      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">{i18n.t('Check-In')}</p>
          <p className="mt-1 min-h-6 text-base font-semibold text-slate-900 dark:text-white" aria-live="polite">{formatReadableDate(checkIn)}</p>
        </div>
        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">{i18n.t('Check-Out')}</p>
          <p className="mt-1 min-h-6 text-base font-semibold text-slate-900 dark:text-white" aria-live="polite">{formatReadableDate(checkOut)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label={i18n.t('booking.previousMonth')}
            onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <h3 className="text-base font-bold text-slate-900 dark:text-white" aria-live="polite">{monthLabel}</h3>
          <button
            type="button"
            aria-label={i18n.t('booking.nextMonth')}
            onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1" role="grid" aria-label={monthLabel}>
          {weekdays.map((day, index) => (
            <div key={`${day}-${index}`} className="flex min-h-10 items-center justify-center text-xs font-bold text-slate-500" role="columnheader">
              {day}
            </div>
          ))}
          {calendarCells.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} className="min-h-12" role="gridcell" aria-hidden="true" />;
            const dateKey = toDateKey(date);
            const unavailable = isDisabled(dateKey);
            const selected = dateKey === checkIn || dateKey === checkOut;
            const inRange = isInSelectedRange(dateKey);
            return (
              <div key={dateKey} role="gridcell" aria-selected={selected || inRange}>
                <button
                  type="button"
                  disabled={unavailable}
                  onClick={() => handleDateClick(dateKey)}
                  aria-label={date.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  aria-pressed={selected}
                  className={`flex min-h-12 w-full items-center justify-center rounded-xl text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:text-slate-300 disabled:line-through dark:disabled:text-slate-600 ${
                    selected
                      ? 'bg-blue-700 text-white shadow-sm'
                      : inRange
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-100'
                        : 'text-slate-800 hover:bg-blue-50 dark:text-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2" aria-live="polite">
            <CalendarDays className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
            {loading
              ? i18n.t('booking.checkingAvailability')
              : checkIn && !checkOut
                ? i18n.t('booking.chooseCheckout')
                : i18n.t('booking.chooseCheckin')}
          </p>
          {(checkIn || checkOut) && (
            <button
              type="button"
              onClick={() => {
                setSelectionError('');
                onCheckInChange('');
                onCheckOutChange('');
              }}
              className="min-h-12 rounded-lg px-3 text-left font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-blue-300"
            >
              {i18n.t('booking.clearDates')}
            </button>
          )}
        </div>
      </div>

      {(selectionError || loadError) && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200" role="alert">
          <p>{loadError || selectionError}</p>
          {loadError && onRetry && (
            <button type="button" onClick={onRetry} className="mt-2 min-h-12 rounded-lg px-3 font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              {i18n.t('Try Again')}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export { hasBookedNight, dateRangeOverlaps };
