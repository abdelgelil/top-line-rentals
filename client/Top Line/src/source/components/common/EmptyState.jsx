import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export default function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  const actionClassName = 'inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';

  return (
    <section className="flex flex-col items-center justify-center space-y-5 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900" role="status">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </div>
      <div className="max-w-lg space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="text-base text-slate-600 dark:text-slate-300">{description}</p>}
      </div>
      {actionLabel && (actionTo ? (
        <Link to={actionTo} className={actionClassName}>{actionLabel}</Link>
      ) : (
        <button type="button" onClick={onAction} className={actionClassName}>{actionLabel}</button>
      ))}
    </section>
  );
}
