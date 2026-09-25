import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

// Relative imports matching src/source structure
import { ClientLayout } from "./source/components/common/ClientLayout";
import { AdminLayout } from "./source/components/common/AdminLayout";

// Page Module Imports (handles named exports safely)
import { Home } from "./source/pages/Home/Home";
import { Checkout } from "./source/pages/Checkout/Checkout";
import { SignInPage, SignUpPage } from "./source/pages/Auth/AuthPages";
import { ContactUs } from "./source/pages/Contact/ContactUs";
import AdminDashboard from "./source/components/admin/AdminDashboard";
import { AdminMessages } from "./source/pages/Admin/Messages/AdminMessages";
import ApartmentDetails from "./source/pages/ApartmentDetails/ApartmentDetails";
import MyBookings from "./source/pages/Bookings/MyBookings";
import { syncUserProfile } from "./source/services/api";

const RoleContext = createContext({ role: "", resolved: false });

const RoleAwareLayout = () => {
  const { user, isSignedIn, isLoaded } = useUser();
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
      setRoleResolved(false);
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
  const Layout = isLoaded && isAdmin ? AdminLayout : ClientLayout;

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

  if (!isLoaded || (isSignedIn && !resolved)) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-500">
        Loading session...
      </div>
    );
  }

  const isAdmin = isSignedIn && role === "admin";

  if (!isSignedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
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
            <Route path="analytics" element={<AdminDashboard />} />
            <Route path="reservations" element={<AdminDashboard />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="add-apartment" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="analytics" replace />} />
          </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
