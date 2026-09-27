import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { ApartmentCard } from '../components/apartment/ApartmentCard';
import { ApartmentCardSkeleton } from '../components/common/Skeletons';

export default function Favorites() {
  const { isLoaded, isSignedIn } = useAuth();
  const { favoriteApartments, isLoading } = useFavorites();

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Loading authentication status...</div>;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return (
    <section className="min-h-screen bg-white px-4 pb-20 pt-12 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="h-7 w-7 fill-rose-500 text-rose-500" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Saved Apartments</h1>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><ApartmentCardSkeleton count={4} /></div>
        ) : favoriteApartments.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteApartments.map((unit) => <ApartmentCard key={unit._id} unit={unit} />)}
          </div>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
            <Heart className="mb-5 h-12 w-12 text-rose-400" aria-hidden="true" />
            <p className="mb-6 text-lg text-slate-600 dark:text-slate-300">No saved properties yet. Explore our coastal stays and bookmark your favorites for quick access!</p>
            <Link to="/apartments" className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800">Explore Apartments</Link>
          </div>
        )}
      </div>
    </section>
  );
}
