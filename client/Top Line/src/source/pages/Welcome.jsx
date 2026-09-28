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

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
      <Link to="/sign-in" className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-xl transition-all motion-reduce:transition-none sm:w-auto sm:px-8 sm:py-4 sm:text-base ${bookClass} ${focusRing}`}>
        {t('welcome.bookNow')}
      </Link>
      <Link to="/contact" className={`inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 motion-reduce:transition-none sm:w-auto sm:px-8 sm:py-4 sm:text-base ${focusRing}`}>
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
    <main className="bg-[#080d1a] text-[#f9f8f5]">
      <style>{`
        [data-reveal], [data-reveal-stagger] > * { opacity: 0; transform: translate3d(0, 24px, 0); transition: opacity 650ms ease, transform 650ms cubic-bezier(.2,.75,.25,1); }
        [data-reveal].welcome-revealed, [data-reveal-stagger].welcome-revealed > * { opacity: 1; transform: translate3d(0, 0, 0); }
        [data-reveal-stagger].welcome-revealed > :first-child { transition-delay: 0ms; }
        [data-reveal-stagger].welcome-revealed > :nth-child(2) { transition-delay: 90ms; }
        [data-reveal-stagger].welcome-revealed > :nth-child(3) { transition-delay: 180ms; }
        @media (prefers-reduced-motion: reduce) { [data-reveal], [data-reveal-stagger] > *, [data-reveal].welcome-revealed, [data-reveal-stagger].welcome-revealed > * { opacity: 1; transform: none; transition: none; } }
      `}</style>
      <section className="relative isolate flex flex-col overflow-hidden bg-[#080d1a] lg:min-h-[90vh] lg:justify-center lg:block">
        <div className="relative z-0 mx-4 mt-4 aspect-video w-auto shrink-0 overflow-hidden rounded-2xl bg-[#0b1325] shadow-[0_24px_70px_-24px_rgba(0,0,0,0.85)] ring-1 ring-[#dfbe74]/25 sm:mx-0 sm:mt-0 sm:w-full sm:rounded-none sm:shadow-none sm:ring-0 lg:absolute lg:inset-0 lg:aspect-auto">
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
            <span className="inline-flex rounded-full border border-[#dfbe74]/35 bg-[#131b2e] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#dfbe74] sm:text-xs">{t('welcome.badge')}</span>
            <h1 className="mt-5 font-[Playfair_Display,serif] text-4xl font-semibold leading-[1.12] tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)] sm:mt-6 sm:text-5xl lg:text-6xl lg:leading-[1.1]">{t('welcome.headline')}</h1>
            <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-slate-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:mt-6 sm:text-lg">{t('welcome.subtitle')}</p>
            <div className="mt-7 sm:mt-10"><CtaPair t={t} /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8" data-reveal>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#f9f8f5] sm:text-4xl">{t('welcome.identityTitle')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-[#d4cebf]">{t('welcome.identitySubtitle')}</p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3" data-reveal-stagger>
          {identityCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-[#c6a052]/20 bg-[#0b1325] p-8 shadow-sm transition-all hover:border-[#c6a052]/50 hover:shadow-xl motion-reduce:transition-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#c6a052]/40 bg-[#c6a052]/10 text-[#dfbe74]"><Icon aria-hidden="true" className="h-6 w-6" /></div>
              <h3 className="mt-6 text-xl font-semibold text-[#f9f8f5]">{t(title)}</h3>
              <p className="mt-3 leading-relaxed text-[#d4cebf]">{t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8" aria-label={t('Search apartments')}>
        <form onSubmit={(event) => { event.preventDefault(); navigate('/apartments'); }} className="grid gap-4 rounded-2xl border border-[#c6a052]/30 bg-[#131b2e] p-4 shadow-[0_20px_50px_-30px_rgba(0,0,0,.8)] sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
          <div className="text-sm font-semibold text-[#d4cebf]">
            <p>{t('Where would you like to stay?', 'Where would you like to stay?')}</p>
            <div className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-[#1f2e4d] bg-[#080d1a] px-4 text-[#d4cebf]"><Search className="h-5 w-5 shrink-0 text-[#dfbe74]" aria-hidden="true" /><span>{t('Explore coastal residences in Alamein City', 'Explore coastal residences in Alamein City')}</span></div>
          </div>
          <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c6a052] px-6 font-bold text-[#080d1a] transition-colors hover:bg-[#dfbe74]">{t('Search stays', 'Search stays')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8" aria-labelledby="welcome-featured-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#dfbe74]">{t('Curated stays', 'Curated stays')}</p><h2 id="welcome-featured-title" className="mt-2 text-3xl font-semibold text-[#f9f8f5]">{t('Featured residences', 'Featured residences')}</h2></div>
          <Link to="/apartments" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#c6a052]/50 px-5 text-sm font-semibold text-[#dfbe74] transition-colors hover:bg-[#dfbe74]/10">{t('View all apartments')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        {loadingFeatured ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><ApartmentCardSkeleton count={3} /></div> : featured.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((unit, index) => <ApartmentCard key={unit._id || unit.id} unit={unit} priority={index === 0} />)}</div> : <div className="rounded-2xl border border-dashed border-[#c6a052]/40 bg-[#0b1325] p-8 text-center text-[#d4cebf]">{t('Explore all available residences and find your ideal stay.', 'Explore all available residences and find your ideal stay.')}</div>}
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#c6a052]/40 bg-[#c6a052]/10 text-[#dfbe74]"><Icon aria-hidden="true" className="h-6 w-6" /></div>
                <h3 className="mt-6 text-xl font-semibold text-white">{t(title)}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{t(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8" data-reveal>
        <div className="rounded-3xl border border-[#c6a052]/40 bg-gradient-to-r from-[#152038] to-[#0b1325] p-8 text-white shadow-2xl sm:p-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('welcome.bannerTitle')}</h2>
              <p className="mt-4 text-lg text-[#d4cebf]">{t('welcome.bannerSubtitle')}</p>
            </div>
            <CtaPair t={t} variant="banner" />
          </div>
        </div>
      </section>
    </main>
  );
}
