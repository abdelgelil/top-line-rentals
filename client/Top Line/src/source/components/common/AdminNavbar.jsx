import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Building2, LayoutDashboard, ShieldCheck, Mail, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { LanguageToggle } from './LanguageToggle';

const AdminNavbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

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
              <ShieldCheck className="w-3 h-3" /> Admin Portal
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/admin" className={linkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('nav.adminDashboard')}</span>
            </NavLink>
            <NavLink to="/apartments" className={linkClass}>
              <Building2 className="w-4 h-4" />
              <span>{t('nav.apartments')}</span>
            </NavLink>
            <NavLink to="/admin/messages" className={linkClass}>
              <Mail className="w-4 h-4" />
              <span>{t('nav.messages')}</span>
            </NavLink>
            <div className="pl-4 border-l border-blue-500/20 flex items-center gap-3">
              <LanguageToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors active:scale-90"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden absolute top-full right-4 w-64 mt-2 p-3 bg-slate-900/95 backdrop-blur-md shadow-xl rounded-2xl border border-slate-800/50 z-50 flex flex-col gap-1 transition-all animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <NavLink
            to="/admin"
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t('nav.adminDashboard')}</span>
          </NavLink>
          <NavLink
            to="/apartments"
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Building2 className="w-4 h-4" />
            <span>{t('nav.apartments')}</span>
          </NavLink>
          <NavLink
            to="/admin/messages"
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Mail className="w-4 h-4" />
            <span>{t('nav.messages')}</span>
          </NavLink>
          <div className="pt-2 mt-2 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-blue-500/20">
              <LanguageToggle />
              <UserButton afterSignOutUrl="/" />
              <span className="text-sm font-medium text-slate-300">Administrator</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;
