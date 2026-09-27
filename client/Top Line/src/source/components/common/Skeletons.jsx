import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700/70 ${className}`} aria-hidden="true" />
);

export function ApartmentCardSkeleton({ count = 4 }) {
  return Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className="flex min-h-[28rem] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      aria-hidden="true"
    >
      <SkeletonBlock className="h-64 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <SkeletonBlock className="h-4 w-1/3" />
        <SkeletonBlock className="h-7 w-3/4" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-800">
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  ));
}

export function TableSkeleton({ rows = 5, columns = 5, variant = 'table' }) {
  if (variant === 'cards') {
    return (
      <div className="space-y-6" role="status" aria-label="Loading bookings" aria-busy="true">
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="flex min-h-48 flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
            <SkeletonBlock className="h-32 w-full shrink-0 rounded-2xl sm:w-40" />
            <div className="flex flex-1 flex-col justify-between gap-4 py-1">
              <div className="space-y-3">
                <SkeletonBlock className="h-6 w-2/3" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {Array.from({ length: 3 }, (_, item) => <SkeletonBlock key={item} className="h-14 w-full" />)}
                </div>
              </div>
              <SkeletonBlock className="h-12 w-full sm:w-48" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" role="status" aria-label="Loading table" aria-busy="true">
      <div className="grid gap-4 border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }, (_, column) => <SkeletonBlock key={column} className="h-4 w-3/4" />)}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid gap-4 border-b border-slate-100 p-5 last:border-0 dark:border-slate-800" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, column) => <SkeletonBlock key={column} className={`h-5 ${column === 0 ? 'w-4/5' : 'w-2/3'}`} />)}
        </div>
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default ApartmentCardSkeleton;
