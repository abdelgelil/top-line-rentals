import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Building, KeyRound, MapPin, Phone, PhoneCall, Search, ShieldCheck, Waves } from 'lucide-react';
import { fetchApartments } from '../services/api';
import { ApartmentCard } from '../components/apartment/ApartmentCard';
import { ApartmentCardSkeleton } from '../components/common/Skeletons';
import OptimizedImage from '../components/common/OptimizedImage';
import { COMPOUND_ADDRESS, COMPOUND_NAME, CONTACT_PHONE, CONTACT_PHONE_DISPLAY, HOTLINE_PHONE, HOTLINE_PHONE_DISPLAY } from '../constants/contactDetails';

const HERO_IMAGE = '/welcome1.jpg';
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#dfbe74] focus-visible:ring-offset-[#080d1a]';

function CtaPair({ t, variant = 'hero' }) {
  const isBanner = variant === 'banner';
  const bookClass = isBanner
    ? 'bg-[#c6a052] text-[#080d1a] font-semibold hover:bg-[#dfbe74]'
    : 'bg-[#c6a052] text-[#080d1a] shadow-amber-900/30 hover:bg-[#dfbe74] hover:scale-105 motion-reduce:hover:scale-100';
  const contactClass = isBanner
    ? 'border-slate-300 bg-white/70 text-slate-800 hover:bg-white dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
    : 'border-slate-300 bg-white/80 text-slate-800 hover:bg-white dark:border-white/25 dark:bg-[#131b2e] dark:text-white dark:hover:bg-[#222a3d] lg:border-white/25 lg:bg-white/5 lg:text-white lg:hover:bg-white/10';

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
      <Link to="/sign-in" className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-xl transition-all motion-reduce:transition-none sm:w-auto sm:px-8 sm:py-4 sm:text-base ${bookClass} ${focusRing}`}>
        {t('welcome.bookNow')}
      </Link>
      <Link to="/contact" className={`inline-flex min-h-12 w-full items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold backdrop-blur-md transition-all motion-reduce:transition-none sm:w-auto sm:px-8 sm:py-4 sm:text-base ${contactClass} ${focusRing}`}>
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
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    let active = true;
    fetchApartments().then((response) => {
      const list = response?.data?.data || response?.data || response;
      if (active) setFeatured(Array.isArray(list) ? list.slice(0, 3) : []);
    }).catch(() => { if (active) setFeatured([]); }).finally(() => { if (active) setLoadingFeatured(false); });
    return () => { active = false; };
  }, []);
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
    <main className="bg-[#f9f8f5] text-slate-900 transition-colors duration-300 dark:bg-[#080d1a] dark:text-[#f9f8f5]">
      <style>{`
        [data-reveal], [data-reveal-stagger] > * { opacity: 0; transform: translate3d(0, 24px, 0); transition: opacity 650ms ease, transform 650ms cubic-bezier(.2,.75,.25,1); }
        [data-reveal].welcome-revealed, [data-reveal-stagger].welcome-revealed > * { opacity: 1; transform: translate3d(0, 0, 0); }
        [data-reveal-stagger].welcome-revealed > :first-child { transition-delay: 0ms; }
        [data-reveal-stagger].welcome-revealed > :nth-child(2) { transition-delay: 90ms; }
        [data-reveal-stagger].welcome-revealed > :nth-child(3) { transition-delay: 180ms; }
        @media (prefers-reduced-motion: reduce) { [data-reveal], [data-reveal-stagger] > *, [data-reveal].welcome-revealed, [data-reveal-stagger].welcome-revealed > * { opacity: 1; transform: none; transition: none; } }
      `}</style>
      <section className="relative isolate flex flex-col overflow-hidden bg-[#f9f8f5] transition-colors duration-300 dark:bg-[#080d1a] lg:min-h-[90vh] lg:justify-center lg:block">
        <div className="relative z-0 mx-4 mt-4 aspect-video w-auto shrink-0 overflow-hidden rounded-2xl bg-[#0b1325] shadow-[0_24px_70px_-24px_rgba(0,0,0,0.25)] ring-1 ring-[#a68032]/35 dark:shadow-[0_24px_70px_-24px_rgba(0,0,0,0.85)] dark:ring-[#dfbe74]/25 sm:mx-0 sm:mt-0 sm:w-full sm:rounded-none sm:shadow-none sm:ring-0 lg:absolute lg:inset-0 lg:aspect-auto">
          <OptimizedImage src={HERO_IMAGE} alt="Topline Luxury Apartments at Adly Plaza Compound" className="absolute inset-0 h-full w-full" imageClassName="h-full w-full object-cover object-center lg:object-[center_38%]" loading="eager" fetchPriority="high" width={1920} sizes="100vw" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080d1a]/35 via-transparent to-[#080d1a]/10 lg:bg-gradient-to-r lg:from-[#080d1a]/75 lg:via-[#080d1a]/35 lg:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 hidden grid-cols-2 gap-x-3 gap-y-1 border-t border-[#dfbe74]/40 bg-[#080d1a]/95 px-3 py-2 text-white backdrop-blur-sm sm:px-6 lg:flex lg:items-center lg:justify-center lg:gap-8 lg:px-8 lg:py-3">
            <a dir="ltr" href={`tel:${CONTACT_PHONE}`} className="flex min-w-0 items-center justify-center gap-1.5 text-xs font-semibold sm:text-sm">
              <Phone aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#dfbe74]" />
              <span><span className="block text-[10px] font-medium text-slate-300 sm:text-xs">{t('Contact Us')}</span>{CONTACT_PHONE_DISPLAY}</span>
            </a>
            <a dir="ltr" href={`tel:${HOTLINE_PHONE}`} className="flex min-w-0 items-center justify-center gap-1.5 text-xs font-semibold sm:text-sm">
              <PhoneCall aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#dfbe74]" />
              <span><span className="block text-[10px] font-medium text-slate-300 sm:text-xs">{t('Hotline')}</span>{HOTLINE_PHONE_DISPLAY}</span>
            </a>
            <div className="col-span-2 flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-200 sm:text-xs lg:col-span-1">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#dfbe74]" />
              {COMPOUND_ADDRESS} · {COMPOUND_NAME}
            </div>
          </div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-8 sm:px-6 sm:py-12 lg:px-8 lg:py-24">
          <div className="max-w-2xl" data-reveal>
            <span className="inline-flex rounded-full border border-[#a68032]/30 bg-[#f3ecdc] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#785910] sm:text-xs dark:border-[#dfbe74]/35 dark:bg-[#131b2e] dark:text-[#dfbe74]">{t('welcome.badge')}</span>
            <h1 className="mt-5 font-[Playfair_Display,serif] text-4xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:mt-6 sm:text-5xl dark:text-white lg:text-6xl lg:leading-[1.1] lg:text-white lg:drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)]">{t('welcome.headline')}</h1>
            <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-slate-600 sm:mt-6 sm:text-lg dark:text-slate-300 lg:text-slate-200 lg:drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{t('welcome.subtitle')}</p>
            <div className="mt-7 sm:mt-10"><CtaPair t={t} /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8" data-reveal>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-[#f9f8f5]">{t('welcome.identityTitle')}</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-[#d4cebf]">{t('welcome.identitySubtitle')}</p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3" data-reveal-stagger>
          {identityCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-[#a68032]/20 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition-all hover:border-[#a68032]/45 hover:shadow-xl motion-reduce:transition-none sm:p-8 dark:border-[#c6a052]/20 dark:bg-[#0b1325] dark:hover:border-[#c6a052]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#a68032]/30 bg-[#f7f3e8] text-[#785910] dark:border-[#c6a052]/40 dark:bg-[#c6a052]/10 dark:text-[#dfbe74]"><Icon aria-hidden="true" className="h-6 w-6" /></div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-[#f9f8f5]">{t(title)}</h3>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-[#d4cebf]">{t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8" aria-label={t('Search apartments')}>
        <form onSubmit={(event) => { event.preventDefault(); navigate('/apartments'); }} className="grid gap-4 rounded-2xl border border-[#a68032]/25 bg-white p-4 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.24)] sm:grid-cols-[1fr_auto] sm:items-end sm:p-6 dark:border-[#c6a052]/30 dark:bg-[#131b2e] dark:shadow-[0_20px_50px_-30px_rgba(0,0,0,.8)]">
          <div className="text-sm font-semibold text-slate-700 dark:text-[#d4cebf]">
            <p>{t('Where would you like to stay?', 'Where would you like to stay?')}</p>
            <div className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-[#f8f5ed] px-4 text-slate-700 dark:border-[#1f2e4d] dark:bg-[#080d1a] dark:text-[#d4cebf]"><Search className="h-5 w-5 shrink-0 text-[#785910] dark:text-[#dfbe74]" aria-hidden="true" /><span>{t('Explore coastal residences in Alamein City', 'Explore coastal residences in Alamein City')}</span></div>
          </div>
          <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c6a052] px-6 font-bold text-[#080d1a] transition-colors hover:bg-[#dfbe74]">{t('Search stays', 'Search stays')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 sm:pb-24 lg:px-8" aria-labelledby="welcome-featured-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#785910] dark:text-[#dfbe74]">{t('Curated stays', 'Curated stays')}</p><h2 id="welcome-featured-title" className="mt-2 text-3xl font-semibold text-slate-900 dark:text-[#f9f8f5]">{t('Featured residences', 'Featured residences')}</h2></div>
          <Link to="/apartments" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#a68032]/50 px-5 text-sm font-semibold text-[#785910] transition-colors hover:bg-[#f7f3e8] dark:border-[#c6a052]/50 dark:text-[#dfbe74] dark:hover:bg-[#dfbe74]/10">{t('View all apartments')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        {loadingFeatured ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><ApartmentCardSkeleton count={3} /></div> : featured.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((unit, index) => <ApartmentCard key={unit._id || unit.id} unit={unit} priority={index === 0} />)}</div> : <div className="rounded-2xl border border-dashed border-[#a68032]/40 bg-white p-8 text-center text-slate-700 dark:border-[#c6a052]/40 dark:bg-[#0b1325] dark:text-[#d4cebf]">{t('Explore all available residences and find your ideal stay.', 'Explore all available residences and find your ideal stay.')}</div>}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 sm:pb-24 lg:px-8" data-reveal>
        <div className="rounded-3xl border border-[#a68032]/20 bg-white p-5 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.3)] sm:p-10 md:p-12 dark:border-[#c6a052]/20 dark:bg-slate-900">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t('welcome.featuresTitle')}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-200">{t('welcome.featuresSubtitle')}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3" data-reveal-stagger>
            {highlights.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-[#a68032]/20 bg-[#f8f5ed] p-5 sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#a68032]/30 bg-white text-[#785910] dark:border-[#c6a052]/40 dark:bg-[#c6a052]/10 dark:text-[#dfbe74]"><Icon aria-hidden="true" className="h-6 w-6" /></div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{t(title)}</h3>
                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{t(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 sm:pb-24 lg:px-8" data-reveal>
        <div className="rounded-3xl border border-[#a68032]/30 bg-gradient-to-br from-white via-[#f8f5ed] to-[#eee3ca] p-6 text-slate-900 shadow-[0_22px_60px_-35px_rgba(15,23,42,0.35)] sm:p-10 md:p-14 dark:border-[#c6a052]/40 dark:from-[#152038] dark:via-[#131b2e] dark:to-[#0b1325] dark:text-white dark:shadow-2xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t('welcome.bannerTitle')}</h2>
              <p className="mt-4 text-base text-slate-600 sm:text-lg dark:text-[#d4cebf]">{t('welcome.bannerSubtitle')}</p>
            </div>
            <CtaPair t={t} variant="banner" />
          </div>
        </div>
      </section>
    </main>
  );
}
