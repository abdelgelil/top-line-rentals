import i18n from "../../../i18n.js";
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, LayoutDashboard, ShieldCheck, CalendarCheck, Mail, Menu, X, ExternalLink, LogOut, UserRound } from 'lucide-react';
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
    `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'text-blue-400 bg-blue-500/20 font-semibold shadow-inner' 
        : 'text-slate-300 hover:text-white hover:bg-white/10'
    }`;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <nav className="max-w-7xl mx-auto pointer-events-auto bg-slate-900/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-blue-500/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] rounded-full px-6 py-2 transition-all duration-500 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
            <span className="hidden sm:flex px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md items-center gap-1">
              <ShieldCheck className="w-3 h-3" />{' '}{i18n.t("Admin Portal")}{' '}</span>
          </div>

          <div className="hidden xl:flex items-center gap-4">
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
            <Link to="/apartments" className={linkClass({ isActive: false })}>
              <ExternalLink className="w-4 h-4" />
              <span>{i18n.t("View Public Site")}</span>
            </Link>
            <div className="pl-4 border-l border-blue-500/20 flex items-center gap-3">
              <LanguageToggle />
              <div className="hidden lg:block max-w-36 truncate text-right text-sm font-semibold text-slate-100">{user?.name || user?.phone}</div>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 text-sm font-semibold text-rose-200 transition-colors hover:border-rose-400/50 hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/30"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>{i18n.t('nav.logout')}</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            type="button"
            aria-label={i18n.t(isOpen ? 'Close menu' : 'Open menu')}
            aria-expanded={isOpen}
            className="xl:hidden flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-200 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 active:scale-95"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[60] xl:hidden">
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
            className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col border-l border-slate-700 bg-slate-900 shadow-2xl rtl:right-auto rtl:left-0 rtl:border-l-0 rtl:border-r"
          >
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">{i18n.t('nav.menu', 'Menu')}</p>
              <p className="mt-1 text-xs text-slate-400">{i18n.t('Admin Portal')}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={i18n.t('Close menu', 'Close menu')}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-blue-300">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">{i18n.t('nav.signedInAs', 'Signed in as')}</p>
              <p className="mt-1 truncate text-sm font-semibold text-white">{user?.name || user?.phone || i18n.t('Administrator')}</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 ${
              isActive
                ? 'bg-blue-500/15 text-blue-300'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
                ? 'bg-blue-500/15 text-blue-300'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
                ? 'bg-blue-500/15 text-blue-300'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{i18n.t("Bookings")}</span>
          </NavLink>
          <NavLink
            to="/admin/messages"
            className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40 ${
              isActive ? 'bg-blue-500/15 text-blue-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Mail className="w-4 h-4" />
            <span>{i18n.t('Messages')}</span>
          </NavLink>
          <Link to="/apartments" className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40" onClick={() => setIsOpen(false)}>
            <ExternalLink className="w-4 h-4" />
            <span>{i18n.t("View Public Site")}</span>
          </Link>
          </nav>
          <div className="space-y-3 border-t border-slate-800 p-4">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => { setIsOpen(false); signOut(); }}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/30"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
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
