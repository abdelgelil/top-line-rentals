import i18n from "./i18n.js";
import React, { createContext, lazy, Suspense, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { Toaster } from 'react-hot-toast';

// Relative imports matching src/source structure
import { ClientLayout } from "./source/components/common/ClientLayout";
import { AdminLayout } from "./source/components/common/AdminLayout";

import { prefetchAdminData, syncUserProfile } from "./source/services/api";

// Keep route-specific code out of the initial bundle.
const Home = lazy(() => import("./source/pages/Home/Home").then(({ Home: component }) => ({ default: component })));
const Checkout = lazy(() => import("./source/pages/Checkout/Checkout").then(({ Checkout: component }) => ({ default: component })));
const SignInPage = lazy(() => import("./source/pages/Auth/AuthPages").then(({ SignInPage: component }) => ({ default: component })));
const SignUpPage = lazy(() => import("./source/pages/Auth/AuthPages").then(({ SignUpPage: component }) => ({ default: component })));
const ContactUs = lazy(() => import("./source/pages/Contact/ContactUs").then(({ ContactUs: component }) => ({ default: component })));
const AdminDashboard = lazy(() => import("./source/components/admin/AdminDashboard"));
const AdminMessages = lazy(() => import("./source/pages/Admin/Messages/AdminMessages").then(({ AdminMessages: component }) => ({ default: component })));
const ApartmentDetails = lazy(() => import("./source/pages/ApartmentDetails/ApartmentDetails"));
const MyBookings = lazy(() => import("./source/pages/Bookings/MyBookings"));

const RoleContext = createContext({ role: "", resolved: false });

const RoleAwareLayout = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const location = useLocation();
  const [storedRole, setStoredRole] = useState(() => localStorage.getItem("userRole") || "");
  const [roleResolved, setRoleResolved] = useState(false);

  useEffect(() => {
    const syncRole = () => setStoredRole(localStorage.getItem("userRole") || "");
    window.addEventListener("auth-change", syncRole);
    window.addEventListener("storage", syncRole);
    return () => {
      window.removeEventListener("auth-change", syncRole);
      window.removeEventListener("storage", syncRole);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const clerkUserRole = user?.publicMetadata?.role || user?.unsafeMetadata?.role;
    if (!isSignedIn) {
      localStorage.removeItem("userRole");
      setStoredRole("");
      setRoleResolved(true);
      window.dispatchEvent(new Event("auth-change"));
      return;
    }

    let active = true;
    if (clerkUserRole) {
      const nextRole = String(clerkUserRole);
      localStorage.setItem("userRole", nextRole);
      setStoredRole(nextRole);
      setRoleResolved(true);
      window.dispatchEvent(new Event("auth-change"));
    } else if (user?.id) {
      if (!localStorage.getItem("userRole")) setRoleResolved(false);
      const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
      syncUserProfile({ clerkId: user.id, email })
        .then(({ data }) => {
          if (!active) return;
          const nextRole = data?.data?.role || data?.user?.role || "";
          if (nextRole) localStorage.setItem("userRole", String(nextRole));
          else localStorage.removeItem("userRole");
          setStoredRole(String(nextRole));
        })
        .catch(() => {
          if (!active) return;
          localStorage.removeItem("userRole");
          setStoredRole("");
        })
        .finally(() => {
          if (active) {
            setRoleResolved(true);
            window.dispatchEvent(new Event("auth-change"));
          }
        });
    } else {
      setRoleResolved(true);
    }

    return () => { active = false; };
  }, [isLoaded, isSignedIn, user]);

  const clerkRole = (user?.publicMetadata?.role || user?.unsafeMetadata?.role || "")
    .toString()
    .toLowerCase();
  const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "";
  const hasAdminEmail = email.toLowerCase().endsWith("@toplinerentals.com");
  const effectiveRole = hasAdminEmail ? "admin" : clerkRole || storedRole.toLowerCase();
  const isAdmin = isSignedIn && effectiveRole === "admin";
  const isAdminRoute = location.pathname.startsWith("/admin");
  const Layout = isLoaded && (isAdmin || isAdminRoute) ? AdminLayout : ClientLayout;

  if (location.pathname === "/" && isAdmin && roleResolved) {
    return <Navigate to="/admin/analytics" replace />;
  }

  return (
    <RoleContext.Provider value={{ role: effectiveRole, resolved: roleResolved }}>
      <Layout />
    </RoleContext.Provider>
  );
};

// Protected Route Wrapper for Admin Access
const ProtectedAdminRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  const { role, resolved } = useContext(RoleContext);
  const isAdmin = isSignedIn && role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    prefetchAdminData();
  }, [isAdmin]);

  if (!isLoaded || (isSignedIn && !resolved && !isAdmin)) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-500">{' '}{i18n.t("Loading session...")}{' '}</div>
    );
  }

  if (!isSignedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { i18n: activeI18n } = useTranslation();
  return (
    <>
    <Toaster
      position={activeI18n.dir(activeI18n.language) === 'rtl' ? 'top-left' : 'top-right'}
      toastOptions={{
        duration: 3200,
        style: {
          background: '#0f172a',
          color: '#e2e8f0',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          borderRadius: '12px',
          padding: '10px 12px',
          fontSize: '13px',
          maxWidth: 'min(360px, calc(100vw - 32px))',
        },
        iconTheme: { primary: '#60a5fa', secondary: '#0f172a' },
        success: { iconTheme: { primary: '#38bdf8', secondary: '#0f172a' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#0f172a' } },
      }}
    />
    <Suspense fallback={(
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500" role="status" aria-live="polite">
        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
        {i18n.t("Loading session...")}
      </div>
    )}>
    <Routes>
      <Route element={<RoleAwareLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/auth/*" element={<Navigate to="/sign-in" replace />} />
            <Route path="/apartments" element={<Home />} />
            <Route path="/apartments/:id" element={<ApartmentDetails />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/listing" element={<Navigate to="/apartments" replace />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Outlet />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="analytics" replace />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="add-apartment" element={<Navigate to="apartments" replace />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </Suspense>
    </>
  );
}

export default App;
