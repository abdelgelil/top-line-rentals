import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, CalendarCheck, Mail, Menu, X, User, LayoutDashboard, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { useFavorites } from '../../context/FavoritesContext';

const ClientNavbar = () => {
  const { t } = useTranslation();
  const { isSignedIn, user, signOut } = useAuth();
  const { favoriteIds } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => { if (event.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 pointer-events-none">
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

            {isSignedIn && <NavLink to="/favorites" className={desktopLinkClass}>
              <Heart className="w-4 h-4" />
              <span>Saved{favoriteIds.length > 0 ? ` (${favoriteIds.length})` : ''}</span>
            </NavLink>}

            {!isSignedIn && (
              <NavLink to="/contact" className={desktopLinkClass}>
                <Mail className="w-4 h-4" />
                <span>{t('nav.contact')}</span>
              </NavLink>
            )}

            <div className="flex items-center gap-3 pl-4 border-l border-blue-100/50 dark:border-blue-500/10">
              <LanguageToggle />
              {isSignedIn ? (
                <button onClick={signOut} className="min-h-12 rounded-full px-3 text-sm font-semibold text-slate-700 dark:text-slate-200" aria-label={t('nav.logout')}>{t('nav.logout')}</button>
              ) : (
                <Link
                  to="/sign-in"
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

      <div className={`md:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} aria-hidden={!isOpen} inert={!isOpen}>
        <div aria-hidden="true" onClick={() => setIsOpen(false)} className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity" />
        <aside role="dialog" aria-modal="true" aria-label={t('nav.menu', 'Navigation menu')} className={`absolute inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 rtl:right-auto rtl:left-0 rtl:border-l-0 rtl:border-r ${isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <Link to="/" onClick={() => setIsOpen(false)}><Logo /></Link>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              aria-label={t('Close menu')}
              className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <NavLink
            to="/apartments"
            className={({ isActive }) => `flex min-h-12 items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
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
                className={({ isActive }) => `flex min-h-12 items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
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
                  className={({ isActive }) => `flex min-h-12 items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
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

          {isSignedIn && <NavLink
            to="/favorites"
            className={({ isActive }) => `flex min-h-12 items-center gap-3 px-5 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/20 shadow-inner' : 'text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'}`}
            onClick={() => setIsOpen(false)}
          ><Heart className="w-4 h-4" /><span>Saved{favoriteIds.length > 0 ? ` (${favoriteIds.length})` : ''}</span></NavLink>}

          {!isSignedIn && (
            <NavLink
              to="/contact"
              className={({ isActive }) => `flex min-h-12 items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Mail className="w-4 h-4" />
              <span>{t('nav.contact')}</span>
            </NavLink>
          )}
          </nav>
          <div className="mt-auto border-t border-slate-100 p-4 dark:border-slate-800">
             {isSignedIn ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400">
                  <LanguageToggle />
                  <User className="h-5 w-5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{user?.fullName || user?.name || 'Member'}</span>
                  <button onClick={() => { setIsOpen(false); signOut(); }} className="min-h-11 rounded-xl px-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40" aria-label={t('nav.logout')}>{t('nav.logout')}</button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <LanguageToggle />
                  <Link
                    to="/sign-in"
                    className="block w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ClientNavbar;
