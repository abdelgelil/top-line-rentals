import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import ClientNavbar from './ClientNavbar';

export const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <ClientNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
