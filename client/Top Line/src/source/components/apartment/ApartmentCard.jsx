import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight, Maximize2, Users, Layers } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ApartmentCard = ({ unit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fallback image list
  const defaultImages = [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  ];

  const images = unit.images?.length > 0 ? unit.images.map((img) => img.url || img) : defaultImages;

  // Initialize wishlist state from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('topline_wishlist') || '[]');
    setIsFavorite(favorites.includes(unit.id));
  }, [unit.id]);

  // Toggle favorite status
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem('topline_wishlist') || '[]');
    let updated;

    if (isFavorite) {
      updated = favorites.filter((id) => id !== unit.id);
    } else {
      updated = [...favorites, unit.id];
    }

    localStorage.setItem('topline_wishlist', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  // Carousel navigation
  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Link
      to={`/apartment/${unit.id}`}
      className="group relative backdrop-blur-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
    >
      <div>
        {/* Image Carousel Header */}
        <div className="relative h-60 overflow-hidden group/carousel">
          <img
            src={images[currentImageIndex]}
            alt={unit.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 opacity-80" />

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 z-10 border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>4.9</span>
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-slate-950/60 backdrop-blur-md text-white flex items-center justify-center z-10 hover:scale-110 active:scale-95 transition-all border border-white/10"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'text-amber-500 fill-amber-500' : 'text-white'
              }`}
            />
          </button>

          {/* Navigation Controls (Shown on hover) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 hover:bg-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 hover:bg-slate-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            {unit.tower_name || 'San Stefano Tower'}
          </span>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {unit.title}
          </h3>

          {/* Enhanced Unit Specs Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
              <Users className="w-3.5 h-3.5 text-amber-500 mb-0.5" />
              <span className="text-[10px] font-bold">{unit.max_guests || 4} Guests</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
              <Maximize2 className="w-3.5 h-3.5 text-amber-500 mb-0.5" />
              <span className="text-[10px] font-bold">{unit.area_sqm || 140} m²</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
              <Layers className="w-3.5 h-3.5 text-amber-500 mb-0.5" />
              <span className="text-[10px] font-bold">Floor {unit.floor_level || 18}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Pricing */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(unit.price_per_night)}
          </span>
          <span className="text-xs text-slate-500"> / night</span>
        </div>
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
          View Details →
        </span>
      </div>
    </Link>
  );
};