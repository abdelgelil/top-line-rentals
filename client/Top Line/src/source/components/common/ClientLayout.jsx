import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Building2, CalendarDays, CircleHelp, Heart, LayoutDashboard, LogOut, Mail, Menu, UserRound, X } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';
import HelpModal from './HelpModal';
import Logo from './Logo';

export const ClientLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { isSignedIn, user, signOut } = useAuth();
  const { favoriteIds } = useFavorites();
  const isAuthPage = ['/sign-in', '/sign-up', '/reset-password'].includes(location.pathname);
  const isAdmin = String(user?.role || user?.publicMetadata?.role || '').toLowerCase() === 'admin';

  const navLinks = [
    { path: '/apartments', label: t('nav.apartments', 'Apartments'), icon: Building2 },
    { path: '/my-bookings', label: t('nav.myBookings', 'My Bookings'), icon: CalendarDays },
    { path: '/favorites', label: `${t('nav.saved', 'Saved')}${favoriteIds.length ? ` (${favoriteIds.length})` : ''}`, icon: Heart },
    { path: '/contact', label: t('nav.contact', 'Contact Us'), icon: Mail },
  ];
  const closeHelp = useCallback(() => setIsHelpOpen(false), []);
  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`));

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => { if (event.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const linkClass = (path) => `relative inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[13px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052] ${isActive(path) ? 'bg-[#c6a052]/12 text-[#785910] ring-1 ring-inset ring-[#c6a052]/20 dark:bg-[#c6a052]/15 dark:text-[#dfbe74] dark:ring-[#c6a052]/30' : 'text-slate-600 hover:bg-[#c6a052]/8 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-[#f9f8f5]'}`;
  const drawerLinkClass = (path) => `flex min-h-12 items-center gap-3 rounded-xl border-s-2 px-4 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052]/60 ${isActive(path) ? 'border-s-[#a68032] bg-[#f7f3e8] text-[#4e3700] dark:border-s-[#dfbe74] dark:bg-[#152038] dark:text-[#f9f8f5]' : 'border-s-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-[#131b2e] dark:hover:text-white'}`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#020617] dark:text-slate-100">
      {!isAuthPage && <header className="sticky top-0 z-50 w-full px-3 py-3 transition-colors sm:px-5">
        <div className="mx-auto max-w-[1504px] rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_12px_36px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-[#c6a052]/20 dark:bg-[#0b1325]/95 dark:shadow-[0_16px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(223,190,116,0.08)] sm:rounded-full">
          <div className="mx-auto grid min-h-[72px] max-w-[1440px] grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 xl:grid-cols-[1fr_auto_1fr] xl:px-8">
          <Link to="/" aria-label="Topline Luxury Apartments home" className="min-w-0 justify-self-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052]">
            <Logo />
          </Link>

          <nav aria-label={t('Main navigation', 'Main navigation')} className="hidden items-center gap-1 xl:flex">
            {navLinks.map(({ path, label, icon: Icon }) => <Link key={path} to={path} aria-current={isActive(path) ? 'page' : undefined} className={linkClass(path)}>
              <Icon aria-hidden="true" className="h-4 w-4"/><span>{label}</span>
              {isActive(path) && <span aria-hidden="true" className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-[#c6a052]"/>}
            </Link>)}
          </nav>

          <div className="hidden min-w-0 items-center justify-self-end gap-2 xl:flex">
            <LanguageToggle />
            <ThemeToggle />
            <button type="button" onClick={() => setIsHelpOpen(true)} aria-label={t('accessibility.needHelp')} title={t('accessibility.needHelp')} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052] dark:text-slate-300 dark:hover:bg-slate-800">
              <CircleHelp aria-hidden="true" className="h-5 w-5" />
            </button>
            {isSignedIn ? <div className="ml-1 flex min-w-0 items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-700">
              {isAdmin && <Link to="/admin" className="rounded-full border border-[#c6a052]/40 bg-[#c6a052]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#785910] dark:text-[#dfbe74]">Admin</Link>}
              <span className="hidden max-w-28 truncate text-xs font-semibold text-slate-700 2xl:block dark:text-slate-200" title={user?.name || user?.fullName || user?.phone}>{user?.name || user?.fullName || user?.phone}</span>
              <button type="button" onClick={signOut} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052] dark:border-slate-700 dark:text-slate-200 dark:hover:border-rose-900 dark:hover:bg-rose-950/40 dark:hover:text-rose-200"><LogOut aria-hidden="true" className="h-4 w-4"/><span>{t('nav.logout', 'Logout')}</span></button>
            </div> : <Link to="/sign-in" className="inline-flex min-h-10 items-center rounded-full bg-[#c6a052] px-4 text-sm font-bold text-slate-950 shadow-sm transition-colors hover:bg-[#dfbe74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052]">{t('Sign In', 'Sign In')}</Link>}
          </div>

          <div className="flex items-center gap-2 justify-self-end xl:hidden">
            <LanguageToggle compact />
            <ThemeToggle compact />
            <button type="button" onClick={() => setIsOpen(true)} aria-expanded={isOpen} aria-label={t('Open navigation menu', 'Open navigation menu')} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052] dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800">
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          </div>
        </div>
      </header>}

      <main className="flex-grow"><Outlet /></main>
      {!isAuthPage && <Footer />}
      {isHelpOpen && <HelpModal onClose={closeHelp} />}

      {isOpen && createPortal(<div className="fixed inset-0 z-[100] xl:hidden" role="presentation">
        <button type="button" aria-label={t('Close menu', 'Close menu')} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <aside role="dialog" aria-modal="true" aria-label={t('Main navigation', 'Main navigation')} className="absolute inset-y-0 right-0 flex w-[min(24rem,90vw)] flex-col border-l border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-[#c6a052]/20 dark:bg-[#0b1325] dark:text-white rtl:right-auto rtl:left-0 rtl:border-l-0 rtl:border-r">
          <div className="flex min-h-[72px] items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
            <Link to="/" onClick={() => setIsOpen(false)} className="min-w-0"><Logo /></Link>
            <button type="button" onClick={() => setIsOpen(false)} aria-label={t('Close menu', 'Close menu')} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052] dark:text-slate-300 dark:hover:bg-slate-800"><X aria-hidden="true" className="h-5 w-5"/></button>
          </div>
          {isSignedIn && <div className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-[#c6a052]/20 dark:bg-[#131b2e]"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#785910] dark:bg-[#080d1a] dark:text-[#dfbe74]">{isAdmin ? <LayoutDashboard className="h-5 w-5"/> : <UserRound className="h-5 w-5"/>}</span><div className="min-w-0 flex-1"><p className="text-xs text-slate-500 dark:text-slate-400">{isAdmin ? 'Administrator' : t('nav.account', 'Your account')}</p><p className="truncate text-sm font-semibold">{user?.name || user?.fullName || user?.phone}</p></div>{isAdmin && <span className="rounded-full border border-[#a68032]/30 bg-[#f7f3e8] px-2.5 py-1 text-[11px] font-bold text-[#4e3700] dark:border-[#c6a052]/25 dark:bg-[#080d1a]/60 dark:text-[#dfbe74]">Admin</span>}</div>}
          <nav aria-label={t('Main navigation', 'Main navigation')} className="flex-1 space-y-1 overflow-y-auto p-4">
            {navLinks.map(({ path, label, icon: Icon }) => <Link key={path} to={path} onClick={() => setIsOpen(false)} aria-current={isActive(path) ? 'page' : undefined} className={drawerLinkClass(path)}><Icon aria-hidden="true" className="h-5 w-5"/><span>{label}</span></Link>)}
            {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className={drawerLinkClass('/admin')}><LayoutDashboard aria-hidden="true" className="h-5 w-5"/><span>{t('nav.adminDashboard', 'Admin dashboard')}</span></Link>}
            <button type="button" onClick={() => { setIsOpen(false); setIsHelpOpen(true); }} className="flex min-h-12 w-full items-center gap-3 rounded-xl border-s-2 border-s-transparent px-4 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052]/60 dark:text-slate-300 dark:hover:bg-[#131b2e] dark:hover:text-white"><CircleHelp aria-hidden="true" className="h-5 w-5"/><span>{t('accessibility.helpShort', 'Need Help?')}</span></button>
          </nav>
          <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-2"><LanguageToggle/><ThemeToggle/></div>
            {isSignedIn ? <button type="button" onClick={() => { setIsOpen(false); signOut(); }} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><LogOut aria-hidden="true" className="h-4 w-4"/>{t('nav.logout', 'Logout')}</button> : <Link to="/sign-in" onClick={() => setIsOpen(false)} className="flex min-h-12 items-center justify-center rounded-full bg-[#c6a052] text-sm font-bold text-slate-950 hover:bg-[#dfbe74]">{t('Sign In', 'Sign In')}</Link>}
          </div>
        </aside>
      </div>, document.body)}
    </div>
  );
};
