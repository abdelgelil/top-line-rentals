import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Footer } from './Footer';
import ClientNavbar from './ClientNavbar';

export const ClientLayout = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith('ar');

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200"
    >
      <ClientNavbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default ClientLayout;