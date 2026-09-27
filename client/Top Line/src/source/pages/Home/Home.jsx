import i18n from "../../../i18n.js";
import React, { useState, useEffect } from 'react';
import { Sparkles, Building2, ShieldCheck, Waves, MapPin, Calendar, PhoneCall, ArrowRight, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApartments } from '../../services/api';
import { SearchFilterBar } from '../../components/search/SearchFilterBar';
import { ApartmentCard } from '../../components/apartment/ApartmentCard';
import { ApartmentCardSkeleton } from '../../components/common/Skeletons';
import EmptyState from '../../components/common/EmptyState';

const apartmentsListPromise = { current: fetchApartments() };

export const Home = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

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
        setLoadError(false);
        const res = await apartmentsListPromise.current;
        const units = res?.data?.data || res?.data || res;

        if (Array.isArray(units)) {
          setApartments(units);
        } else {
          setApartments([]);
        }
      } catch (err) {
        console.error('Error fetching apartments:', err);
        apartmentsListPromise.current = fetchApartments();
        try {
          const retry = await apartmentsListPromise.current;
          const units = retry?.data?.data || retry?.data || retry;
          setApartments(Array.isArray(units) ? units : []);
        } catch {
          setApartments([]);
          setLoadError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadUnits();
  }, []);

  const filteredApartments = apartments.filter((apt) => {
    const aptTower = apt.tower || apt.tower_name || '';
    if (towerFilter !== 'All' && aptTower !== towerFilter) return false;

    if (selectedAmenities.length > 0) {
      const aptAmenities = apt.amenities || [];
      const hasAll = selectedAmenities.every((amenity) => aptAmenities.includes(amenity));
      if (!hasAll) return false;
    }
    return true;
  });

  const heroImage = apartments.find((apartment) => apartment.images?.[0])?.images?.[0];

  return (
    <div className="w-full min-h-screen bg-white pb-20 text-slate-900 dark:bg-slate-950 dark:text-white">

      <section className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-slate-950 px-4 pb-28 pt-32 sm:px-8 lg:min-h-[760px] lg:px-12">
        {heroImage && <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-900/75 to-slate-900/40" />
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-500/15 px-4 py-2 text-xs font-bold tracking-wide text-blue-100 sm:text-sm">
              <Sparkles className="h-4 w-4 text-sky-300" />
              <span>{i18n.t('Premier Coastal & City Living')}</span>
            </div>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">{i18n.t('Experience Luxury Living & Effortless Stays with TopLine')}</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-xl sm:leading-8">{i18n.t('Fully serviced, premium apartments designed for comfort, private beach access, and panoramic views.')}</p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link to="/apartments" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:scale-[1.03] hover:bg-blue-500 hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">{i18n.t('Book Now')}<ArrowRight className="h-5 w-5" /></Link>
              <Link to="/contact" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40">{i18n.t('Contact Us')}</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
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
      </div>

      <section className="container mx-auto max-w-7xl space-y-8 px-4 pt-20 sm:px-8 lg:px-12 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">{i18n.t('Welcome to TopLine')}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">{i18n.t('Settled in the Heart of Coastal Excellence')}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{i18n.t("Discover thoughtfully selected homes in Alexandria's most sought-after coastal destinations.")}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: MapPin, title: 'Prime Locations', text: 'Explore sought-after stays around San Stefano, Four Seasons, and the Alamein coast.' },
            { icon: Building2, title: 'Our Purpose', text: 'Enjoy the warmth and privacy of an apartment with the convenience of a considered hospitality experience.' },
            { icon: PhoneCall, title: 'Hospitality Standard', text: 'Rely on 24/7 guest support, seamless self check-in, and verified amenities.' },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/70">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{i18n.t(title)}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{i18n.t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 pt-20 sm:px-8 lg:px-12 lg:pt-28">
        <div className="grid gap-6 rounded-3xl bg-slate-900 p-6 text-white sm:p-10 md:grid-cols-3 dark:border dark:border-slate-800">
          {[
            { icon: Waves, title: 'Prime Beach & Panoramic Views', text: 'Wake up to refreshing sea air, coastal scenery, and a little more room to unwind.' },
            { icon: KeyRound, title: 'Instant & Secure Check-In', text: 'A straightforward reservation and arrival experience helps you settle in with ease.' },
            { icon: ShieldCheck, title: 'Verified Quality & Support', text: 'Comfortable, carefully presented residences with a helpful team when you need us.' },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Icon className="h-7 w-7 text-sky-300" />
              <h3 className="mt-4 text-lg font-bold">{i18n.t(title)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{i18n.t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Residences Grid Section */}
      <section className="container mx-auto max-w-7xl space-y-8 px-4 pt-20 sm:px-8 lg:px-12 lg:pt-28" id="residences">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{i18n.t("Available Residences")}</h2>
            <p className="text-xs sm:text-sm text-slate-500">{' '}{i18n.t("Showing")}{' '}{filteredApartments.length}{' '}{i18n.t("handpicked premium suites")}{' '}</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Tower 1', 'Tower 2', 'Tower 3'].map((tower) => (
              <button
                key={tower}
                onClick={() => setTowerFilter(tower)}
                className={`min-h-12 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  towerFilter === tower
                    ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-lg shadow-blue-500/30'
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
            <ApartmentCardSkeleton count={4} />
          </div>
        ) : loadError ? (
          <EmptyState
            title={i18n.t('Unable to load apartments')}
            description={i18n.t('Please check your connection and try again.')}
            actionLabel={i18n.t('Try Again')}
            onAction={() => {
              apartmentsListPromise.current = fetchApartments();
              setLoadError(false);
              setLoading(true);
              apartmentsListPromise.current
                .then((res) => {
                  const units = res?.data?.data || res?.data || res;
                  setApartments(Array.isArray(units) ? units : []);
                })
                .catch(() => setLoadError(true))
                .finally(() => setLoading(false));
            }}
          />
        ) : filteredApartments.length === 0 ? (
          <EmptyState
            title={i18n.t('No apartments found matching your filters')}
            description={i18n.t('Try a different tower or clear your selected dates and guest count.')}
            actionLabel={i18n.t('Reset Filters')}
            onAction={() => {
              setTowerFilter('All');
              setCheckIn('');
              setCheckOut('');
              setGuests(1);
              setSelectedAmenities([]);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApartments.map((unit, index) => (
              <ApartmentCard key={unit._id || unit.id} unit={unit} priority={index === 0} />
            ))}
          </div>
        )}
      </section>

      {/* Perks Banner */}
      <section className="container mx-auto max-w-7xl px-4 pt-8 sm:px-8 lg:px-12">
        <div className="backdrop-blur-2xl bg-slate-900 dark:bg-slate-900 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left shadow-2xl border border-blue-500/20">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto sm:mx-0">
              <Waves className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">{i18n.t("Panoramic Views")}</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{' '}{i18n.t("Every apartment features unobstructed Mediterranean horizons and private high-floor balconies.")}{' '}</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto sm:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">{i18n.t("24/7 Concierge")}</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{' '}{i18n.t("Enjoy private parking, round-the-clock security, and room service upon request.")}{' '}</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto sm:mx-0">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">{i18n.t("Prime Access")}</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{' '}{i18n.t("Direct indoor elevator access to luxury shopping centers, cinema, and dining.")}{' '}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 pt-20 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white shadow-xl shadow-blue-900/20 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">{i18n.t('Ready for your next unforgettable getaway?')}</h2>
            <p className="mt-2 text-blue-100">{i18n.t('Find a place that feels like yours, wherever the coast takes you.')}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to="/apartments" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-800 transition hover:bg-blue-50">{i18n.t('Book Now')}<Calendar className="h-5 w-5" /></Link>
            <Link to="/contact" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20">{i18n.t('Contact Us')}</Link>
          </div>
        </div>
      </section>

    </div>
  );
};
