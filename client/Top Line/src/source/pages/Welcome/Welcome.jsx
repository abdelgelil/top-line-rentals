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
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-transparent" />
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold tracking-wide text-blue-400 sm:text-sm">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>{i18n.t('Premier Coastal & City Living')}</span>
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl">{i18n.t('Experience Luxury Living & Effortless Stays with TopLine')}</h1>
            <p className="max-w-2xl text-lg leading-7 text-slate-300 md:text-xl md:leading-8">{i18n.t('Fully serviced, premium apartments designed for comfort, private beach access, and panoramic views.')}</p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link to="/sign-in" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">{i18n.t('Book Now')}<ArrowRight className="h-5 w-5" /></Link>
              <Link to="/contact" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40">{i18n.t('Contact Us')}</Link>
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
            <article key={title} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"><Icon className="h-6 w-6" /></span>
              <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{i18n.t(title)}</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{i18n.t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 pt-20 sm:px-8 lg:px-12 lg:pt-28">
        <div className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white md:grid-cols-3 md:p-12">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6">
              <Icon className="h-7 w-7 text-blue-400" />
              <h3 className="mt-4 text-lg font-semibold text-white">{i18n.t(title)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{i18n.t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 pt-20 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white shadow-xl shadow-blue-500/10 md:flex-row md:p-12 md:text-left">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{i18n.t('Ready for your next unforgettable getaway?')}</h2>
            <p className="mt-2 text-base text-blue-100">{i18n.t('Find a place that feels like yours, wherever the coast takes you.')}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to="/sign-in" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-blue-600 shadow-md transition-all hover:bg-blue-50">{i18n.t('Book Now')}<ArrowRight className="h-5 w-5" /></Link>
            <Link to="/contact" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-8 py-3.5 font-semibold text-white transition-all hover:bg-white/10">{i18n.t('Contact Us')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
