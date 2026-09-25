import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bed, ShieldCheck } from 'lucide-react';

export const ApartmentCard = ({ unit }) => {
  const apartmentId = unit._id || unit.id;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={unit.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}
          alt={unit.title || unit.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md border border-white/20 text-sky-400 font-bold px-3 py-1 rounded-full text-xs shadow-md">
          ${unit.pricePerNight || unit.price} / night
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {unit.tower || 'Tower Residence'}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {unit.title || unit.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            {unit.description || 'Luxury serviced suite with beach access.'}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-500 dark:text-sky-400" />
            <span>{unit.maxGuests || 2} Guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-blue-500 dark:text-sky-400" />
            <span>{unit.bedrooms || 1} Beds</span>
          </div>
        </div>

        {/* Action Link to Apartment Details */}
        <Link
          to={`/apartments/${apartmentId}`}
          className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs rounded-xl text-center shadow-md transition-all block"
        >
          View & Book Residence
        </Link>
      </div>
    </div>
  );
};