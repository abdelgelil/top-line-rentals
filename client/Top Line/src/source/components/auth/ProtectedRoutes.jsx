import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

// Protects routes that require a logged-in user
export const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Protects admin-only routes via custom metadata or role check
export const AdminRoute = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fallback role check via publicMetadata
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.primaryEmailAddress?.emailAddress?.endsWith('@toplinerentals.com');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};