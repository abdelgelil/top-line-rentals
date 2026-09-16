import React, { useState, useEffect } from 'react';
import { Sparkles, Building2, Shield, Waves } from 'lucide-react';
import { fetchApartments } from '../../services/api';
import { SearchFilterBar } from '../../components/search/SearchFilterBar';
import { ApartmentCard } from '../../components/apartment/ApartmentCard';

// Default mock listings displayed if backend array is empty or unavailable
const FALLBACK_APARTMENTS = [
  {
    id: '1',
    title: 'Royal Sea View Suite',
    tower_name: 'San Stefano Tower',
    price_per_night: 6500,
    bedrooms: 3,
    bathrooms: 2,
    max_guests: 6,
    area_sqm: 180,
    floor_level: 22,
    amenities: ['Sea View', 'Private Balcony', 'High Floor', 'Pool Access'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    id: '2',
    title: 'Panoramic Mediterranean Penthouse',
    tower_name: 'Four Seasons Tower',
    price_per_night: 8200,
    bedrooms: 4,
    bathrooms: 3,
    max_guests: 8,
    area_sqm: 240,
    floor_level: 28,
    amenities: ['Sea View', 'Private Balcony', 'Jacuzzi', 'High Floor'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  {
    id: '3',
    title: 'Executive Coastal Residence',
    tower_name: 'San Stefano Tower',
    price_per_night: 4800,
    bedrooms: 2,
    bathrooms: 2,
    max_guests: 4,
    area_sqm: 130,
    floor_level: 15,
    amenities: ['Sea View', 'Pool Access'],
    images: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80' }
    ]
  }
];

export const Home = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [towerFilter, setTowerFilter] = useState('All');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        setLoading(true);
        const res = await fetchApartments();
        if (res && res.data && res.data.length > 0) {
          setApartments(res.data);
        } else {
          setApartments(FALLBACK_APARTMENTS);
        }
      } catch (err) {
        console.error('Error fetching apartments, falling back to mock data:', err);
        setApartments(FALLBACK_APARTMENTS);
      } finally {
        setLoading(false);
      }
    };
    loadUnits();
  }, []);

  const filteredApartments = apartments.filter((apt) => {
    if (towerFilter !== 'All' && apt.tower_name !== towerFilter) return false;
    if (selectedAmenities.length > 0) {
      const aptAmenities = apt.amenities || [];
      const hasAll = selectedAmenities.every((amenity) => aptAmenities.includes(amenity));
      if (!hasAll) return false;
    }
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 space-y-16">
      
      {/* Hero Section */}
      <section className="w-full pt-8 md:pt-16 px-4 sm:px-8 lg:px-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-bold tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Luxury Coastal Living</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-5xl mx-auto leading-tight">
          Find Your Perfect Residence in The Towers
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Book fully serviced apartments with panoramic Mediterranean views and private beach access.
        </p>

        <div className="pt-4">
          <SearchFilterBar
            towerFilter={towerFilter}
            setTowerFilter={setTowerFilter}
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guests={guests}
            setGuests={setGuests}
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
            onSearch={() => {}}
          />
        </div>
      </section>

      {/* Residences Grid Section */}
      <section className="w-full px-4 sm:px-8 lg:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Available Residences</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Showing {filteredApartments.length} handpicked premium suites
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'San Stefano', 'Four Seasons'].map((tower) => (
              <button
                key={tower}
                onClick={() => setTowerFilter(tower)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  towerFilter === tower
                    ? 'bg-slate-900 text-white dark:bg-amber-600 dark:text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tower}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        ) : filteredApartments.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-900 dark:text-white font-bold text-lg">No residences match your current filters</p>
            <p className="text-slate-500 text-sm">Try clearing your amenity filters or selecting another tower location.</p>
            <button
              onClick={() => {
                setTowerFilter('All');
                setSelectedAmenities([]);
              }}
              className="mt-2 px-5 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApartments.map((unit) => (
              <ApartmentCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </section>

      {/* Perks Banner */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pt-8">
        <div className="backdrop-blur-2xl bg-slate-900 dark:bg-slate-900 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left shadow-2xl border border-slate-800">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto sm:mx-0">
              <Waves className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Panoramic Views</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every apartment features unobstructed Mediterranean horizons and private high-floor balconies.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto sm:mx-0">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">24/7 Concierge</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Enjoy private parking, round-the-clock security, and room service upon request.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto sm:mx-0">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Prime Access</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Direct indoor elevator access to luxury shopping centers, cinema, and dining.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};