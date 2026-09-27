import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteApartments, setFavoriteApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!isLoaded || !isSignedIn) {
      setFavoriteIds([]);
      setFavoriteApartments([]);
      return undefined;
    }
    setIsLoading(true);
    API.get('/favorites').then(({ data }) => {
      if (cancelled) return;
      const apartments = data?.data || [];
      setFavoriteApartments(apartments);
      setFavoriteIds(apartments.map((apartment) => String(apartment._id)));
    }).catch(() => {
      if (!cancelled) toast.error('Unable to load saved apartments.');
    }).finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn]);

  const toggleFavorite = useCallback(async (propertyId, apartment) => {
    const id = String(propertyId);
    if (!isSignedIn) return false;
    const wasFavorite = favoriteIds.includes(id);
    const previousIds = favoriteIds;
    const previousApartments = favoriteApartments;
    setFavoriteIds(wasFavorite ? previousIds.filter((favoriteId) => favoriteId !== id) : [...previousIds, id]);
    setFavoriteApartments(wasFavorite
      ? previousApartments.filter((savedApartment) => String(savedApartment._id) !== id)
      : [...previousApartments.filter((savedApartment) => String(savedApartment._id) !== id), apartment].filter(Boolean));
    try {
      const { data } = await API.post('/favorites/toggle', { propertyId: id });
      if (Array.isArray(data?.data?.favorites)) setFavoriteIds(data.data.favorites.map(String));
      return true;
    } catch {
      setFavoriteIds(previousIds);
      setFavoriteApartments(previousApartments);
      toast.error('Unable to update saved apartment. Please try again.');
      return false;
    }
  }, [favoriteIds, favoriteApartments, isSignedIn]);

  const value = useMemo(() => ({
    favoriteIds,
    favoriteApartments,
    isLoading,
    isFavorite: (id) => favoriteIds.includes(String(id)),
    toggleFavorite,
  }), [favoriteIds, favoriteApartments, isLoading, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
