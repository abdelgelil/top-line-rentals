import i18n from "../../../i18n.js";
import { translateText } from '../../../utils/translateContent.js';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bath, Bed, Heart, MapPin, Ruler, Users } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { getFirstImage } from '../../utils/getImageUrl';

export const ApartmentCard = ({ unit, priority = false }) => {
  const apartmentId = unit._id || unit.id;
  const { isSignedIn } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const favorited = isFavorite(apartmentId);
  const apartmentUrl = `/apartments/${apartmentId}`;
  const title = translateText(unit.title || unit.name || i18n.t('Apartment Unit'));
  const location = translateText(unit.address || unit.location || unit.tower || 'Alamein, Egypt');

  const handleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isSignedIn) return navigate('/sign-in');
    toggleFavorite(apartmentId, unit);
  };

  const specs = [
    { Icon: Bed, value: unit.bedrooms || 1, label: i18n.t('Beds') },
    { Icon: Bath, value: unit.bathrooms || 1, label: i18n.t('Baths') },
    { Icon: Users, value: unit.guests || unit.maxGuests || 2, label: i18n.t('Guests') },
    { Icon: Ruler, value: unit.sizeSqM ? `${unit.sizeSqM} m²` : '—', label: '' },
  ];

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e7dfd1] bg-[#f9f8f5] text-[#080d1a] shadow-[0_12px_30px_-20px_rgba(15,23,42,0.3)] transition duration-200 hover:-translate-y-1 hover:border-[#c6a052]/70 dark:border-[#1f2e4d] dark:bg-[#0b1325] dark:text-[#f9f8f5] dark:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.65)] dark:hover:border-[#c6a052]/50">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[#e7dfd1] dark:bg-[#080d1a]">
        <OptimizedImage
          src={getFirstImage(unit)}
          alt={title}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          width={priority ? 900 : 640}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          decoding="async"
          className="absolute inset-0 h-full w-full"
          imageClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080d1a]/60 via-transparent to-[#080d1a]/75" />

        <div className="absolute left-3 top-3 flex max-w-[calc(100%-4.5rem)] items-center gap-1.5 truncate rounded-full border border-[#c6a052]/30 bg-[#080d1a]/85 px-2.5 py-1 text-[11px] font-semibold text-[#f9f8f5] shadow-sm backdrop-blur-sm">
          <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#dfbe74]" />
          <span className="truncate">{unit.floor ? `${unit.floor}${i18n.t('th')} Floor · ` : ''}{translateText(unit.tower || 'Tower Residence')}</span>
        </div>

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorited ? 'Remove from saved apartments' : 'Save apartment'}
          aria-pressed={favorited}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#080d1a]/75 text-[#f9f8f5] shadow-sm backdrop-blur-sm transition hover:scale-105 hover:text-[#dfbe74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbe74]"
        >
          <Heart className={`h-4 w-4 ${favorited ? 'fill-rose-400 text-rose-400' : ''}`} />
        </button>

        <div className="absolute inset-x-3 bottom-2">
          <p className="font-[var(--heading)] text-lg font-bold leading-none text-[#dfbe74] drop-shadow sm:text-xl">
            {formatCurrency(unit.pricePerNight || unit.price)}
            <span className="ml-1 font-[var(--sans)] text-[10px] font-semibold uppercase tracking-wide text-[#f9f8f5]">/ {i18n.t('night')}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5 sm:p-4">
        <div>
          <p className="mb-1 flex min-w-0 items-center gap-1.5 text-xs font-medium text-[#785910] dark:text-[#dfbe74]">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </p>
          <h3 className="truncate font-[var(--heading)] text-lg font-semibold leading-tight text-[#080d1a] dark:text-[#f9f8f5]" title={title}>{title}</h3>
          <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-relaxed text-slate-600 dark:text-[#d4cebf]">
            {translateText(unit.description || 'Luxury serviced suite with beach access.')}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-1 rounded-xl bg-[#eee9df] px-1.5 py-2.5 text-center dark:bg-[#080d1a]/70">
          {specs.map(({ Icon, value, label }) => (
            <div key={label || 'size'} className="flex min-w-0 flex-col items-center gap-1 text-[10px] font-semibold leading-tight text-slate-700 dark:text-[#f9f8f5]">
              <Icon aria-hidden="true" className="h-4 w-4 text-[#a68032] dark:text-[#dfbe74]" />
              <span className="truncate">{value}{label ? ` ${label}` : ''}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-1.5 pt-0.5">
          <Link to={apartmentUrl} className="flex min-h-9 items-center justify-center rounded-full bg-[#c6a052] px-3 text-xs font-bold tracking-wide text-[#080d1a] transition-colors hover:bg-[#dfbe74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbe74]">
            {i18n.t('Instant Book')}
          </Link>
          <Link to={apartmentUrl} className="flex min-h-9 items-center justify-center rounded-full border border-[#d4cebf] bg-white px-3 text-xs font-semibold text-[#080d1a] transition-colors hover:border-[#a68032] hover:bg-[#f4f0e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a68032] dark:border-[#1f2e4d] dark:bg-[#152038] dark:text-[#f9f8f5] dark:hover:border-[#c6a052]/50 dark:hover:bg-[#1f2e4d] dark:focus-visible:ring-[#dfbe74]">
            {i18n.t('Details')}
          </Link>
        </div>
      </div>
    </article>
  );
};
