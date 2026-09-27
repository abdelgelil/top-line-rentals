import React from 'react';
import { Link } from 'react-router-dom';
import { Building, KeyRound, MapPin, PhoneCall, ShieldCheck, Waves } from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-slate-950';

function CtaPair({ variant = 'hero' }) {
  const isBanner = variant === 'banner';
  const bookClass = isBanner
    ? 'bg-white text-blue-700 shadow-blue-600/30 hover:bg-blue-50'
    : 'bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 motion-reduce:hover:scale-100';

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Link to="/sign-in" className={`inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold shadow-xl transition-all motion-reduce:transition-none ${bookClass} ${focusRing}`}>
        Book Now
      </Link>
      <Link to="/contact" className={`inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 motion-reduce:transition-none ${focusRing}`}>
        Contact Us
      </Link>
    </div>
  );
}

const identityCards = [
  { icon: MapPin, title: 'Prime Locations', text: 'San Stefano, Four Seasons, and the Alamein coast. Every home is steps from the water and the best of the city.' },
  { icon: Building, title: 'Our Purpose', text: 'We combine the privacy of a home with the standards of luxury hospitality, so you get space and service in one stay.' },
  { icon: PhoneCall, title: 'Hospitality Standard', text: '24/7 guest support, seamless check-in, and amenities we verify ourselves before every booking.' },
];

const highlights = [
  { icon: Waves, title: 'Prime Beach & Panoramic Views', text: 'Private beach access and wide sea views from living rooms, balconies, and bedrooms.' },
  { icon: KeyRound, title: 'Instant & Secure Check-In', text: 'Digital access codes sent before you arrive. No queues, no waiting for keys.' },
  { icon: ShieldCheck, title: 'Verified Quality & Support', text: 'Each apartment is inspected and photographed as it is, with our team on call day and night.' },
];

export default function Welcome() {
  return (
    <main className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden bg-slate-950">
        <img src={HERO_IMAGE} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">Premier Coastal &amp; City Living</span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl lg:leading-[1.1]">Experience Luxury Living &amp; Effortless Stays with TopLine</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">Fully serviced apartments with private beach access and panoramic views, ready for you from the moment you arrive.</p>
            <div className="mt-10"><CtaPair /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Settled in the Heart of Coastal Excellence</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Discover thoughtfully selected homes in Alexandria&apos;s most sought-after coastal destinations.</p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {identityCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white"><Icon aria-hidden="true" className="h-6 w-6" /></div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 sm:p-10 md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">What every stay includes</h2>
            <p className="mt-4 text-lg text-slate-300">The details that make a TopLine apartment feel like a hotel suite and a home at once.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white"><Icon aria-hidden="true" className="h-6 w-6" /></div>
                <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-2xl sm:p-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready for your next unforgettable getaway?</h2>
              <p className="mt-4 text-lg text-blue-50">Choose your apartment, pick your dates, and we will take care of the rest.</p>
            </div>
            <CtaPair variant="banner" />
          </div>
        </div>
      </section>
    </main>
  );
}
