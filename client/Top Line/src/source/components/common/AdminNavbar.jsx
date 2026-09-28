import i18n from "../../../i18n.js";
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, LayoutDashboard, ShieldCheck, CalendarCheck, Mail, Menu, X, ExternalLink, LogOut, UserRound, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { LanguageToggle } from './LanguageToggle';

const AdminNavbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const linkClass = ({ isActive }) =>
    `flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm dark:bg-blue-500/20 dark:text-blue-300' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-3 sm:px-6">
      <nav className="pointer-events-auto mx-auto w-full max-w-[1600px] rounded-2xl border border-slate-200 bg-white/95 shadow-[0_12px_36px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/30 sm:rounded-full">
        <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 py-2 sm:px-5">
          <div className="flex shrink-0 items-center gap-3">
            <Link to="/admin" className="hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
            <span className="hidden sm:flex px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-md items-center gap-1 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300">
              <ShieldCheck className="w-3 h-3" />{' '}{i18n.t("Admin Portal")}{' '}</span>
          </div>

          <div className="hidden 2xl:flex min-w-0 flex-1 items-center justify-center gap-1">
            <NavLink to="/admin/analytics" className={linkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('nav.adminDashboard')}</span>
            </NavLink>
            <NavLink to="/admin/apartments" className={linkClass}>
              <Building2 className="w-4 h-4" />
              <span>{i18n.t("Manage Apartments")}</span>
            </NavLink>
            <NavLink to="/admin/reservations" className={linkClass}>
              <CalendarCheck className="w-4 h-4" />
              <span>{i18n.t("Bookings")}</span>
            </NavLink>
            <NavLink to="/admin/messages" className={linkClass}>
              <Mail className="w-4 h-4" />
              <span>{i18n.t('Messages')}</span>
            </NavLink>
            <NavLink to="/admin/reviews" className={linkClass}>
              <Star className="w-4 h-4" />
              <span>{i18n.t('Guest Reviews')}</span>
            </NavLink>
            <Link to="/apartments" className={linkClass({ isActive: false })}>
              <ExternalLink className="w-4 h-4" />
              <span>{i18n.t("View Public Site")}</span>
            </Link>
            <div className="ml-2 flex shrink-0 items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-700">
              <LanguageToggle />
              <div className="hidden max-w-40 truncate text-right text-sm font-semibold text-slate-700 dark:text-slate-100 2xl:block">{user?.name || user?.phone}</div>
              <button
                type="button"
                onClick={signOut}
                className="group inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-600 bg-slate-800/80 px-4 text-sm font-semibold text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-100 hover:shadow-md hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/30"
              >
                <LogOut className="h-4 w-4 text-slate-400 transition-colors group-hover:text-rose-300" aria-hidden="true" />
                <span>{i18n.t('nav.logout')}</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            type="button"
            aria-label={i18n.t(isOpen ? 'Close menu' : 'Open menu')}
            aria-expanded={isOpen}
            className="2xl:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[60] 2xl:hidden">
          <button
            type="button"
            aria-label={i18n.t('Close menu', 'Close menu')}
            className="absolute inset-0 h-full w-full bg-slate-950/60 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={i18n.t('nav.menu', 'Admin navigation menu')}
            className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col border-l border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-white rtl:right-auto rtl:left-0 rtl:border-l-0 rtl:border-r"
          >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-800 dark:text-slate-200">{i18n.t('nav.menu', 'Menu')}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{i18n.t('Admin Portal')}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={i18n.t('Close menu', 'Close menu')}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{i18n.t('nav.signedInAs', 'Signed in as')}</p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name || user?.phone || i18n.t('Administrator')}</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 ${
              isActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t('nav.adminDashboard')}</span>
          </NavLink>
          <NavLink
            to="/admin/apartments"
            className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 ${
              isActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Building2 className="w-4 h-4" />
            <span>{i18n.t("Manage Apartments")}</span>
          </NavLink>
          <NavLink
            to="/admin/reservations"
            className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 ${
              isActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{i18n.t("Bookings")}</span>
          </NavLink>
          <NavLink
            to="/admin/messages"
            className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 ${
              isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Mail className="w-4 h-4" />
            <span>{i18n.t('Messages')}</span>
          </NavLink>
          <NavLink
            to="/admin/reviews"
            className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 ${
              isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Star className="w-4 h-4" />
            <span>{i18n.t('Guest Reviews')}</span>
          </NavLink>
          <Link to="/apartments" className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white" onClick={() => setIsOpen(false)}>
            <ExternalLink className="w-4 h-4" />
            <span>{i18n.t("View Public Site")}</span>
          </Link>
          </nav>
          <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => { setIsOpen(false); signOut(); }}
              className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/80 px-4 text-sm font-semibold text-slate-200 shadow-sm transition-all duration-200 hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-100 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/30"
            >
              <LogOut className="h-4 w-4 text-slate-400 transition-colors group-hover:text-rose-300" aria-hidden="true" />
              <span>{i18n.t('nav.logout')}</span>
            </button>
          </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;
