import i18n from "../../../i18n.js";
import { translateText } from '../../../utils/translateContent.js';
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bed, CalendarCheck } from 'lucide-react';

export const ApartmentCard = ({ unit }) => {
  const apartmentId = unit._id || unit.id;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={unit.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}
          alt={translateText(unit.title || unit.name)}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md border border-white/20 text-sky-400 font-bold px-3 py-1 rounded-full text-xs shadow-md">
          ${unit.pricePerNight || unit.price}{' '}{i18n.t("/ night")}{' '}</div>
        <Link
          to={`/apartments/${apartmentId}`}
          className="absolute bottom-4 left-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-bold text-white shadow-lg transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/70"
        >
          <CalendarCheck className="h-5 w-5" aria-hidden="true" />
          {i18n.t('accessibility.quickBook')}
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
        <div>
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
            {translateText(unit.tower || 'Tower Residence')}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {translateText(unit.title || unit.name)}
          </h3>
          <p className="text-base text-slate-700 dark:text-slate-200 mt-2 line-clamp-2">
            {translateText(unit.description || 'Luxury serviced suite with beach access.')}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-base text-slate-700 dark:text-slate-200 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-500 dark:text-sky-400" />
            <span>{unit.maxGuests || 2}{' '}{i18n.t("Guests")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-blue-500 dark:text-sky-400" />
            <span>{unit.bedrooms || 1}{' '}{i18n.t("Beds")}</span>
          </div>
        </div>

        {/* Action Link to Apartment Details */}
        <Link
          to={`/apartments/${apartmentId}`}
          className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 dark:bg-blue-700 dark:hover:bg-blue-800"
        >{' '}{i18n.t("View & Book Residence")}{' '}</Link>
      </div>
    </div>
  );
};
