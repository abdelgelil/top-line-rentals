import i18n from "../../../i18n.js";
import React, { useCallback, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Menu, X, Building2, Calendar, Mail, CircleHelp } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import Footer from './Footer';
import HelpModal from './HelpModal';

const ClientLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { isSignedIn } = useUser();

  const navLinks = [
    { path: '/apartments', label: t('nav.apartments', 'Apartments'), icon: Building2 },
    { path: '/my-bookings', label: t('nav.myBookings', 'My Bookings'), icon: Calendar },
    { path: '/contact', label: t('nav.contact', 'Contact Us'), icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;
  const closeHelp = useCallback(() => setIsHelpOpen(false), []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <span>{i18n.t("TopLine")}{' '}<span className="text-blue-600 dark:text-blue-400">{i18n.t("Rentals")}</span></span>
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
            <UserButton afterSignOutUrl="/" />
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

          {isSignedIn && <UserButton afterSignOutUrl="/" />}

          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label={i18n.t("Toggle Menu")}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Compact Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 right-4 left-4 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col gap-1 transition-all">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex min-h-12 items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => { setIsOpen(false); setIsHelpOpen(true); }}
            className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <CircleHelp className="h-5 w-5" aria-hidden="true" />
            <span>{t('accessibility.helpShort')}</span>
          </button>

          {!isSignedIn && (
            <Link
              to="/sign-in"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-base font-bold text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50"
            >{' '}{i18n.t("Sign In")}{' '}</Link>
          )}
        </div>
      )}
    </header>
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    {isHelpOpen && <HelpModal onClose={closeHelp} />}
    </div>
  );
};

export { ClientLayout };
