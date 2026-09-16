import React, { useState, useEffect } from 'react';
import { useParams } from 'react';
import { Bed, Bath, Maximize2, Users, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { fetchApartmentById } from '../../services/api';
import { BookingWidget } from '../../components/booking/BookingWidget';

export const ApartmentDetails = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      try {
        setLoading(true);
        // Fallback to query param or path param
        const apartmentId = id || new URLSearchParams(window.location.search).get('id') || '1';
        const data = await fetchApartmentById(apartmentId);
        setApartment(data.data);
      } catch (err) {
        console.error('Error fetching unit:', err);
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="text-center py-24 backdrop-blur-xl bg-white/20 dark:bg-slate-900/30 rounded-3xl border border-white/20">
        <p className="text-slate-500">Apartment details could not be found.</p>
      </div>
    );
  }

  const {
    title,
    description,
    tower_name,
    bedrooms,
    bathrooms,
    max_guests,
    area_sqm,
    images = [],
    amenities = ['High-Speed Wi-Fi', 'Air Conditioning', 'Private Balcony', 'Sea View', '24/7 Security', 'Elevator Access']
  } = apartment;

  const defaultImg = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
  const primaryImage = images[0]?.url || defaultImg;
  const galleryImages = images.slice(1, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 pt-6">
      
      {/* Title & Header Location */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            {tower_name || 'San Stefano Towers'}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="w-4 h-4 text-indigo-500" />
          <span>Coastal Corniche Road, Alexandria, Egypt</span>
        </p>
      </div>

      {/* Image Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-2xl">
        <div className="md:col-span-2 h-96 bg-slate-200 dark:bg-slate-800">
          <img src={primaryImage} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-4 h-96">
          {galleryImages.length > 0 ? (
            galleryImages.map((img, idx) => (
              <div key={idx} className="h-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))
          ) : (
            <>
              <div className="bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img src={defaultImg} alt="Gallery fallback" className="w-full h-full object-cover" />
              </div>
              <div className="bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img src={defaultImg} alt="Gallery fallback 2" className="w-full h-full object-cover" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
        
        {/* Unit Specs & Description (Left Column) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Specs Bar */}
          <div className="p-6 backdrop-blur-xl bg-white/30 dark:bg-slate-900/40 border border-white/30 dark:border-white/10 rounded-3xl grid grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <Bed className="w-5 h-5 mx-auto text-indigo-500" />
              <p className="text-xs text-slate-500">Bedrooms</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{bedrooms}</p>
            </div>
            <div className="space-y-1">
              <Bath className="w-5 h-5 mx-auto text-indigo-500" />
              <p className="text-xs text-slate-500">Bathrooms</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{bathrooms}</p>
            </div>
            <div className="space-y-1">
              <Users className="w-5 h-5 mx-auto text-indigo-500" />
              <p className="text-xs text-slate-500">Max Guests</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{max_guests}</p>
            </div>
            <div className="space-y-1">
              <Maximize2 className="w-5 h-5 mx-auto text-indigo-500" />
              <p className="text-xs text-slate-500">Living Area</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{area_sqm || '--'} m²</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-900/30 border border-white/20 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">About this residence</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {description || 'Enjoy a luxurious stay at this fully furnished coastal apartment. Offering panoramic sea views, modern appliances, high-speed Wi-Fi, and 24/7 dedicated concierge service.'}
            </p>
          </div>

          {/* Included Amenities */}
          <div className="p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-900/30 border border-white/20 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">What this unit offers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/20">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Booking Widget (Right Column) */}
        <div>
          <BookingWidget apartment={apartment} />
        </div>

      </div>
    </div>
  );
};