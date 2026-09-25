import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Building2, LayoutDashboard, ShieldCheck, Mail, Menu, X } from 'lucide-react';
import Logo from './Logo';

const AdminNavbar = () => {
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
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/apartments" className={linkClass}>
              <Building2 className="w-4 h-4" />
              <span>Apartments</span>
            </NavLink>
            <NavLink to="/admin/messages" className={linkClass}>
              <Mail className="w-4 h-4" />
              <span>Messages</span>
            </NavLink>
            <div className="pl-4 border-l border-blue-500/20">
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
        <div className="fixed inset-0 z-[100] flex justify-end pointer-events-auto">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300 pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
          <div className={`relative w-full sm:w-80 h-full bg-slate-900/90 backdrop-blur-3xl shadow-2xl transition-transform duration-500 ease-out transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col border-l border-blue-500/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] pointer-events-auto`}>
            <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
              <span className="text-xl font-bold text-white">Admin Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <NavLink to="/admin" className={linkClass} onClick={() => setIsOpen(false)}>
                <LayoutDashboard className="w-6 h-6" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/apartments" className={linkClass} onClick={() => setIsOpen(false)}>
                <Building2 className="w-6 h-6" />
                <span>Apartments</span>
              </NavLink>
              <NavLink to="/admin/messages" className={linkClass} onClick={() => setIsOpen(false)}>
                <Mail className="w-6 h-6" />
                <span>Messages</span>
              </NavLink>
            </div>
            <div className="p-6 border-t border-blue-500/20 bg-white/5">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-blue-500/20 shadow-sm">
                <UserButton afterSignOutUrl="/" />
                <span className="text-sm font-medium text-slate-300">Administrator</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;
