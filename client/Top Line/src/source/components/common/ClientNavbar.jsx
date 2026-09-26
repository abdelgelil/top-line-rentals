import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Building2, CalendarCheck, Mail, Menu, X, User, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { LanguageToggle } from './LanguageToggle';

const ClientNavbar = () => {
  const { t } = useTranslation();
  const { isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const desktopLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/20 font-semibold shadow-sm'
        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/20 shadow-inner'
        : 'text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
    }`;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <nav className="max-w-7xl mx-auto pointer-events-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-blue-100/50 dark:border-blue-500/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] rounded-full px-6 py-2 transition-all duration-500 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6)]">
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/apartments" className={desktopLinkClass}>
              <Building2 className="w-4 h-4" />
              <span>{t('nav.apartments')}</span>
            </NavLink>

            {isSignedIn && (
              isAdmin ? (
                <NavLink to="/admin" className={desktopLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('nav.adminDashboard')}</span>
                </NavLink>
              ) : (
                <>
                  <NavLink to="/my-bookings" className={desktopLinkClass}>
                    <CalendarCheck className="w-4 h-4" />
                    <span>{t('nav.myBookings')}</span>
                  </NavLink>
                  <NavLink to="/contact" className={desktopLinkClass}>
                    <Mail className="w-4 h-4" />
                    <span>{t('nav.contact')}</span>
                  </NavLink>
                </>
              )
            )}

            {!isSignedIn && (
              <NavLink to="/contact" className={desktopLinkClass}>
                <Mail className="w-4 h-4" />
                <span>{t('nav.contact')}</span>
              </NavLink>
            )}

            <div className="flex items-center gap-3 pl-4 border-l border-blue-100/50 dark:border-blue-500/10">
              <LanguageToggle />
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Link
                  to="/auth"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-95 hover:shadow-blue-500/40"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded-full bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 z-50 transition-all active:scale-90 border border-white/50 dark:border-blue-500/10"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden absolute top-full right-4 w-64 mt-2 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 z-50 flex flex-col gap-1 transition-all animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <NavLink
            to="/apartments"
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Building2 className="w-4 h-4" />
            <span>{t('nav.apartments')}</span>
          </NavLink>

          {isSignedIn && (
            isAdmin ? (
              <NavLink
                to="/admin"
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('nav.adminDashboard')}</span>
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{t('nav.myBookings')}</span>
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Mail className="w-4 h-4" />
                  <span>{t('nav.contact')}</span>
                </NavLink>
              </>
            )
          )}

          {!isSignedIn && (
            <NavLink
              to="/contact"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Mail className="w-4 h-4" />
              <span>{t('nav.contact')}</span>
            </NavLink>
          )}
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
             {isSignedIn ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400">
                  <LanguageToggle />
                  <UserButton afterSignOutUrl="/" />
                  <span className="truncate">{user?.fullName || 'Member'}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <LanguageToggle />
                  <Link
                    to="/auth"
                    className="block w-full py-2 text-center text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientNavbar;
