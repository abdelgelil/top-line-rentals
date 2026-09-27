import i18n from "../../../i18n.js";
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Building2, Calendar, Mail, CircleHelp, LogOut, UserRound, Heart } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import Footer from './Footer';
import HelpModal from './HelpModal';
import Logo from './Logo';
import { useFavorites } from '../../context/FavoritesContext';

const ClientLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { isSignedIn, user, signOut } = useAuth();
  const { favoriteIds } = useFavorites();
  const isAuthPage = ['/sign-in', '/sign-up', '/reset-password'].includes(location.pathname);

  const navLinks = [
    { path: '/apartments', label: t('nav.apartments', 'Apartments'), icon: Building2 },
    { path: '/my-bookings', label: t('nav.myBookings', 'My Bookings'), icon: Calendar },
    ...(isSignedIn ? [{ path: '/favorites', label: `${t('nav.saved')}${favoriteIds.length ? ` (${favoriteIds.length})` : ''}`, icon: Heart }] : []),
    { path: '/contact', label: t('nav.contact', 'Contact Us'), icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;
  const closeHelp = useCallback(() => setIsHelpOpen(false), []);

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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
    {!isAuthPage && <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand / Logo */}
        <Link to="/" className="font-extrabold tracking-tight text-slate-900 dark:text-white">
          <Logo />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex min-h-12 items-center gap-2 px-4 py-3 rounded-full text-base font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            aria-label={t('accessibility.needHelp')}
            title={t('accessibility.needHelp')}
            className="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <CircleHelp className="h-6 w-6" aria-hidden="true" />
          </button>
          <LanguageToggle />

          {isSignedIn ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-slate-700">
              <div className="hidden lg:block text-right leading-tight">
                <p className="max-w-36 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || user?.phone}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{i18n.t('nav.account', 'Your account')}</p>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/30 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>{i18n.t('nav.logout')}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="min-h-12 rounded-full bg-blue-700 px-5 py-3 text-base font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50"
            >{' '}{i18n.t("Sign In")}{' '}</Link>
          )}
        </div>

        {/* Mobile Action Cluster */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />

          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-expanded={isOpen}
            aria-label={i18n.t(isOpen ? 'Close menu' : 'Toggle Menu')}
            className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            type="button"
            aria-label={i18n.t('Close menu', 'Close menu')}
            className="fixed inset-0 z-40 h-full w-full bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={i18n.t('nav.menu', 'Navigation menu')}
            className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col overflow-hidden border-l border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white rtl:right-auto rtl:left-0 rtl:border-l-0 rtl:border-r"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <Link to="/" onClick={() => setIsOpen(false)} className="min-w-0"><Logo /></Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={i18n.t('Close menu', 'Close menu')}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {isSignedIn && (
              <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{i18n.t('nav.signedInAs', 'Signed in as')}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name || user?.phone}</p>
                </div>
              </div>
            )}
            <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 ${
                      active
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => { setIsOpen(false); setIsHelpOpen(true); }}
                className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <CircleHelp className="h-5 w-5" aria-hidden="true" />
                <span>{t('accessibility.helpShort')}</span>
              </button>
            </nav>
            <div className="space-y-4 border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <LanguageToggle />
              {isSignedIn ? (
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); signOut(); }}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/30 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>{i18n.t('nav.logout')}</span>
                </button>
              ) : (
                <Link
                  to="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
                >
                  {i18n.t('Sign In')}
                </Link>
              )}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </header>}
    <main className="flex-grow">
      <Outlet />
    </main>
    {!isAuthPage && <Footer />}
    {isHelpOpen && <HelpModal onClose={closeHelp} />}
    </div>
  );
};

export { ClientLayout };
