import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Calendar, Menu, X, LogIn } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { HeaderControls } from './HeaderControls';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('apartments'), path: '/listing' },
    { name: t('adminPortal'), path: '/admin' },
  ];

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <nav className="backdrop-blur-xl bg-white/75 dark:bg-slate-900/75 border border-white/40 dark:border-slate-800 shadow-lg rounded-2xl md:rounded-full px-4 sm:px-6 py-3 flex items-center justify-between transition-all">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1 leading-none">
            <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">TopLine</span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Rentals</span>
          </div>
        </Link>

        {/* Dynamic Desktop Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Button & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderControls />

          {/* Clerk Auth Controls */}
          <SignedOut>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <Link
            to="/listing"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/25 active:scale-95 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('bookNow')}</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90 border border-white/30 dark:border-slate-800 shadow-xl space-y-2 animate-in fade-in zoom-in-95">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600"
            >
              {link.name}
            </Link>
          ))}

          <SignedOut>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </SignedOut>

          <Link
            to="/listing"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('bookNow')}</span>
          </Link>
        </div>
      )}
    </header>
  );
};