import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#020617] dark:text-slate-100 font-sans">
      <AdminNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};
