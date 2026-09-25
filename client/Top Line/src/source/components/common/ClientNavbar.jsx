import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Building2, CalendarCheck, Mail, Menu, X, User } from 'lucide-react';
import Logo from './Logo';

const ClientNavbar = () => {
  const { isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

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
              <span>Apartments</span>
            </NavLink>

            {isSignedIn && (
              <NavLink to="/my-bookings" className={desktopLinkClass}>
                <CalendarCheck className="w-4 h-4" />
                <span>My Bookings</span>
              </NavLink>
            )}

            <NavLink to="/contact" className={desktopLinkClass}>
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </NavLink>

            <div className="flex items-center gap-3 pl-4 border-l border-blue-100/50 dark:border-blue-500/10">
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
        <div className="fixed inset-0 z-[100] flex justify-end pointer-events-auto">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300 pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
          <div className={`relative w-full sm:w-80 h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl shadow-2xl transition-transform duration-500 ease-out transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col border-l border-blue-100/50 dark:border-blue-500/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6)] pointer-events-auto`}>
            <div className="flex items-center justify-between p-6 border-b border-blue-100/50 dark:border-blue-500/10">
              <span className="text-xl font-bold text-slate-900 dark:text-white">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-full bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors border border-blue-100/50 dark:border-blue-500/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <NavLink
                to="/apartments"
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                <Building2 className="w-6 h-6" />
                <span>Apartments</span>
              </NavLink>

              {isSignedIn && (
                <NavLink
                  to="/my-bookings"
                  className={mobileLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <CalendarCheck className="w-6 h-6" />
                  <span>My Bookings</span>
                </NavLink>
              )}

              <NavLink
                to="/contact"
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                <Mail className="w-6 h-6" />
                <span>Contact Us</span>
              </NavLink>
            </div>

            <div className="p-6 border-t border-blue-100/50 dark:border-blue-500/10 bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg">
              {isSignedIn ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-blue-100/50 dark:border-blue-500/10 shadow-sm">
                  <UserButton afterSignOutUrl="/" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user?.fullName || 'Member'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="block w-full py-4 text-center text-base font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientNavbar;
