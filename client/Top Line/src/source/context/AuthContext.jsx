import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import API, { setupAxiosInterceptors } from '../services/api';

const AuthContext = createContext({ user: null, isLoaded: false, isSignedIn: false, signOut: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('authUser') || 'null'); } catch { return null; }
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setupAxiosInterceptors();
    const token = localStorage.getItem('token');
    if (!token) { setUser(null); setIsLoaded(true); return; }
    API.get('/auth/me').then(({ data }) => {
      setUser(data.user);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role || 'user');
    }).catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('authUser');
      localStorage.removeItem('userRole');
      setUser(null);
    }).finally(() => setIsLoaded(true));
  }, []);

  const value = useMemo(() => ({
    user,
    isLoaded,
    isSignedIn: Boolean(user),
    setAuthenticatedUser: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role || 'user');
      setUser(data.user);
      window.dispatchEvent(new Event('auth-change'));
    },
    signOut: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('authUser');
      localStorage.removeItem('userRole');
      setUser(null);
      window.dispatchEvent(new Event('auth-change'));
    },
  }), [user, isLoaded]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
