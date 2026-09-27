import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building, KeyRound, MapPin, PhoneCall, ShieldCheck, Waves } from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-slate-950';

function CtaPair({ t, variant = 'hero' }) {
  const isBanner = variant === 'banner';
  const bookClass = isBanner
    ? 'bg-white text-blue-700 font-semibold hover:bg-blue-50'
    : 'bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 motion-reduce:hover:scale-100';

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Link to="/sign-in" className={`inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold shadow-xl transition-all motion-reduce:transition-none ${bookClass} ${focusRing}`}>
        {t('welcome.bookNow')}
      </Link>
      <Link to="/contact" className={`inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 motion-reduce:transition-none ${focusRing}`}>
        {t('welcome.contactUs')}
      </Link>
    </div>
  );
}

const identityCards = [
  { icon: MapPin, title: 'welcome.locationTitle', text: 'welcome.locationText' },
  { icon: Building, title: 'welcome.purposeTitle', text: 'welcome.purposeText' },
  { icon: PhoneCall, title: 'welcome.hospitalityTitle', text: 'welcome.hospitalityText' },
];

const highlights = [
  { icon: Waves, title: 'welcome.viewsTitle', text: 'welcome.viewsText' },
  { icon: KeyRound, title: 'welcome.checkinTitle', text: 'welcome.checkinText' },
  { icon: ShieldCheck, title: 'welcome.qualityTitle', text: 'welcome.qualityText' },
];

export default function Welcome() {
  const { t } = useTranslation();
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('welcome-revealed', entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <style>{`
        [data-reveal], [data-reveal-stagger] > * { opacity: 0; transform: translate3d(0, 24px, 0); transition: opacity 650ms ease, transform 650ms cubic-bezier(.2,.75,.25,1); }
        [data-reveal].welcome-revealed, [data-reveal-stagger].welcome-revealed > * { opacity: 1; transform: translate3d(0, 0, 0); }
        [data-reveal-stagger].welcome-revealed > :first-child { transition-delay: 0ms; }
        [data-reveal-stagger].welcome-revealed > :nth-child(2) { transition-delay: 90ms; }
        [data-reveal-stagger].welcome-revealed > :nth-child(3) { transition-delay: 180ms; }
        @media (prefers-reduced-motion: reduce) { [data-reveal], [data-reveal-stagger] > *, [data-reveal].welcome-revealed, [data-reveal-stagger].welcome-revealed > * { opacity: 1; transform: none; transition: none; } }
      `}</style>
      <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden bg-slate-950">
        <img src={HERO_IMAGE} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-blue-950/75" />
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl" data-reveal>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md">{t('welcome.badge')}</span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl lg:leading-[1.1]">{t('welcome.headline')}</h1>
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{t('welcome.subtitle')}</p>
            <div className="mt-10"><CtaPair t={t} /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8" data-reveal>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{t('welcome.identityTitle')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{t('welcome.identitySubtitle')}</p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3" data-reveal-stagger>
          {identityCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white"><Icon aria-hidden="true" className="h-6 w-6" /></div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{t(title)}</h3>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8" data-reveal>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 sm:p-10 md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('welcome.featuresTitle')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-200">{t('welcome.featuresSubtitle')}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3" data-reveal-stagger>
            {highlights.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-slate-700/60 bg-slate-800/80 p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white"><Icon aria-hidden="true" className="h-6 w-6" /></div>
                <h3 className="mt-6 text-xl font-semibold text-white">{t(title)}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{t(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8" data-reveal>
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-2xl sm:p-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('welcome.bannerTitle')}</h2>
              <p className="mt-4 text-lg text-blue-100">{t('welcome.bannerSubtitle')}</p>
            </div>
            <CtaPair t={t} variant="banner" />
          </div>
        </div>
      </section>
    </main>
  );
}
