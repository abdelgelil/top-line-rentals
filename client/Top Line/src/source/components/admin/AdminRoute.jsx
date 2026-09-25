import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-slate-500 font-medium">
        Authenticating...
      </div>
    );
  }

  const isAdmin = isSignedIn && user?.publicMetadata?.role === 'admin';

  if (!isAdmin) {
    // Redirect standard clients away from admin routes
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
