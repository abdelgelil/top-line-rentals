import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, KeyRound, MapPin, PhoneCall, ShieldCheck, Sparkles, Waves } from 'lucide-react';
import i18n from '../../../i18n.js';
import { fetchApartments } from '../../services/api';

export function Welcome() {
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    let active = true;
    fetchApartments()
      .then((response) => {
        const apartments = response?.data?.data || response?.data || response;
        const image = Array.isArray(apartments) ? apartments.find((apartment) => apartment.images?.[0])?.images?.[0] : '';
        if (active && image) setHeroImage(image);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const identityCards = [
    { icon: MapPin, title: 'Prime Locations', text: 'Explore sought-after stays around San Stefano, Four Seasons, and the Alamein coast.' },
    { icon: Building2, title: 'Our Purpose', text: 'Enjoy the warmth and privacy of an apartment with the convenience of a considered hospitality experience.' },
    { icon: PhoneCall, title: 'Hospitality Standard', text: 'Rely on 24/7 guest support, seamless self check-in, and verified amenities.' },
  ];

  const features = [
    { icon: Waves, title: 'Prime Beach & Panoramic Views', text: 'Wake up to refreshing sea air, coastal scenery, and a little more room to unwind.' },
    { icon: KeyRound, title: 'Instant & Secure Check-In', text: 'A straightforward reservation and arrival experience helps you settle in with ease.' },
    { icon: ShieldCheck, title: 'Verified Quality & Support', text: 'Comfortable, carefully presented residences with a helpful team when you need us.' },
  ];

  return (
    <div className="w-full bg-white pb-20 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-slate-950 px-4 pb-24 pt-28 sm:px-8 lg:min-h-[720px] lg:px-12">
        {heroImage && <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-900/75 to-slate-900/40" />
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-6">
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

      <section className="container mx-auto max-w-7xl space-y-8 px-4 pt-20 sm:px-8 lg:px-12 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">{i18n.t('Welcome to TopLine')}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">{i18n.t('Settled in the Heart of Coastal Excellence')}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{i18n.t("Discover thoughtfully selected homes in Alexandria's most sought-after coastal destinations.")}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {identityCards.map(({ icon: Icon, title, text }) => (
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
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Icon className="h-7 w-7 text-sky-300" />
              <h3 className="mt-4 text-lg font-bold">{i18n.t(title)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{i18n.t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 pt-20 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white shadow-xl shadow-blue-900/20 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">{i18n.t('Ready for your next unforgettable getaway?')}</h2>
            <p className="mt-2 text-blue-100">{i18n.t('Find a place that feels like yours, wherever the coast takes you.')}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to="/apartments" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-800 transition hover:bg-blue-50">{i18n.t('Book Now')}<ArrowRight className="h-5 w-5" /></Link>
            <Link to="/contact" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20">{i18n.t('Contact Us')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
