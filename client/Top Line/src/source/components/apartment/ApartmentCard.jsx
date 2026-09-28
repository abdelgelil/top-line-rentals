import i18n from "../../../i18n.js";
import { translateText } from '../../../utils/translateContent.js';
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bed, CalendarCheck, Heart } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import { getFirstImage } from '../../utils/getImageUrl';

export const ApartmentCard = ({ unit, priority = false }) => {
  const apartmentId = unit._id || unit.id;
  const { isSignedIn } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const favorited = isFavorite(apartmentId);

  const handleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isSignedIn) return navigate('/sign-in');
    toggleFavorite(apartmentId, unit);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#1f2e4d] bg-[#0b1325] shadow-sm transition-all hover:-translate-y-1 hover:border-[#c6a052]/50 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,.65)]">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <OptimizedImage
          src={getFirstImage(unit)}
          alt={translateText(unit.title || unit.name)}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          width={priority ? 900 : 640}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          decoding="async"
          className="h-full w-full"
          imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorited ? 'Remove from saved apartments' : 'Save apartment'}
          aria-pressed={favorited}
          className={`absolute top-3 right-3 z-10 rounded-full p-2 backdrop-blur-md transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${favorited ? 'bg-white text-red-500 dark:bg-slate-900' : 'bg-white/80 text-slate-600 dark:bg-slate-900/80 dark:text-slate-300'}`}
        >
          <Heart className={`h-5 w-5 ${favorited ? 'fill-red-500' : ''}`} />
        </button>
        <div className="absolute top-4 left-4 rounded-full border border-[#c6a052]/50 bg-[#080d1a]/85 px-3 py-1 text-xs font-bold text-[#dfbe74] shadow-md backdrop-blur-md">
          {formatCurrency(unit.pricePerNight || unit.price)}{' '}{i18n.t("/ night")}{' '}</div>
        <Link
          to={`/apartments/${apartmentId}`}
          className="absolute bottom-4 left-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#c6a052] px-5 py-3 text-base font-bold text-[#080d1a] shadow-lg transition-colors hover:bg-[#dfbe74] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#dfbe74]/70"
        >
          <CalendarCheck className="h-5 w-5" aria-hidden="true" />
          {i18n.t('accessibility.quickBook')}
        </Link>
      </div>

      {/* Card Body */}
      <div className="flex flex-grow flex-col justify-between space-y-4 p-6 text-[#f9f8f5]">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-[#dfbe74]">
            {translateText(unit.tower || 'Tower Residence')}
          </span>
          <h3 className="mt-1 text-xl font-semibold text-[#f9f8f5]">
            {translateText(unit.title || unit.name)}
          </h3>
          <p className="mt-2 line-clamp-2 text-base text-[#d4cebf]">
            {translateText(unit.description || 'Luxury serviced suite with beach access.')}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 border-t border-[#1f2e4d] pt-4 text-base text-[#d4cebf]">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-[#dfbe74]" />
            <span>{unit.guests || unit.maxGuests || 2}{' '}{i18n.t("Guests")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-[#dfbe74]" />
            <span>{unit.bedrooms || 1}{' '}{i18n.t("Beds")}</span>
          </div>
        </div>

        {/* Action Link to Apartment Details */}
        <Link
          to={`/apartments/${apartmentId}`}
          className="mt-2 flex min-h-12 w-full items-center justify-center rounded-full border border-[#c6a052] bg-transparent px-5 py-3 text-base font-bold text-[#f9f8f5] transition-all hover:bg-[#dfbe74] hover:text-[#080d1a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#dfbe74]/50"
        >{' '}{i18n.t("View & Book Residence")}{' '}</Link>
      </div>
    </div>
  );
};
