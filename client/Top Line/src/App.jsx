import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { CurrencyProvider } from './source/context/CurrencyContext';
import { LanguageProvider } from './source/context/LanguageContext';

// Layout & Security Components
import { Navbar } from './source/components/common/Navbar';
import { Footer } from './source/components/common/Footer';
import { ProtectedRoute, AdminRoute } from './source/components/auth/ProtectedRoutes';

// Pages
import { Home } from './source/pages/Home/Home';
import { ApartmentDetails } from './source/pages/ApartmentDetails/ApartmentDetails';
import { Checkout } from './source/pages/Checkout/Checkout';
import { Admin } from './source/pages/Admin/Admin';
import { LoginPage, SignUpPage } from './source/pages/Auth/AuthPages';

export default function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <Router>
          <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/listing" element={<Home />} />
                <Route path="/apartment/:id" element={<ApartmentDetails />} />
                <Route path="/login/*" element={<LoginPage />} />
                <Route path="/signup/*" element={<SignUpPage />} />

                {/* Authenticated User Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                </Route>

                {/* Admin Only Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>

                {/* Fallback Catch-all */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CurrencyProvider>
    </LanguageProvider>
  );
}