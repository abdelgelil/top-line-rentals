import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="p-8 text-center text-slate-500">Loading authentication status...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="p-8 text-center text-slate-500">Checking permissions...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
