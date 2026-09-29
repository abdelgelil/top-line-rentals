import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, ShieldCheck, Facebook, Instagram } from 'lucide-react';
import { COMPOUND_ADDRESS, COMPOUND_NAME, CONTACT_PHONE, CONTACT_PHONE_DISPLAY, FACEBOOK_URL, INSTAGRAM_URL } from '../../constants/contactDetails';
import Logo from './Logo';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.resolvedLanguage || i18n.language) === 'rtl';

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} className="mt-auto border-t border-slate-800 bg-slate-900 pt-14 pb-8 text-slate-300 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-slate-800/80 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" aria-label={t('Topline Luxury Apartments home', 'Topline Luxury Apartments home')} className="group flex w-fit items-center gap-4 rounded-full pr-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052]">
              <Logo showText={false} size="large" />
              <span className="flex flex-col gap-1">
                <span className="font-[Playfair_Display,serif] text-lg font-semibold tracking-tight text-[#f9f8f5] transition-colors group-hover:text-[#dfbe74]">Topline Luxury Apartments</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dfbe74]">Luxury coastal stays</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">{t('footer.aboutText')}</p>
            <div className="flex w-fit items-center gap-2 rounded-full border border-[#a68032]/50 bg-[#080d1a]/50 px-3 py-1.5 text-xs text-[#dfbe74]">
              <ShieldCheck className="h-4 w-4" /> <span>{t('footer.verifiedProperties')}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold tracking-wide text-white">{t('footer.quickLinks')}</h2>
            <ul className="space-y-2.5 text-sm">
              <li><Link className="transition-colors hover:text-[#dfbe74]" to="/">{t('nav.home')}</Link></li>
              <li><Link className="transition-colors hover:text-[#dfbe74]" to="/apartments">{t('nav.apartments')}</Link></li>
              <li><Link className="transition-colors hover:text-[#dfbe74]" to="/my-bookings">{t('nav.myBookings')}</Link></li>
              <li><Link className="transition-colors hover:text-[#dfbe74]" to="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold tracking-wide text-white">{t('footer.contactUs')}</h2>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 shrink-0 text-[#dfbe74]" /><a href="https://maps.app.goo.gl/PZ7EcCYEGwLkZJ849?g_st=iw" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#dfbe74]">{COMPOUND_ADDRESS}, {COMPOUND_NAME}</a></li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-[#dfbe74]" /><a dir="ltr" href={`tel:${CONTACT_PHONE}`} className="hover:text-[#dfbe74]">{CONTACT_PHONE_DISPLAY}</a></li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-[#dfbe74]" /><a href="mailto:support@toplinerentals.com" className="hover:text-[#dfbe74]">support@toplinerentals.com</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold tracking-wide text-white">{t('footer.support')}</h2>
            <p className="text-sm leading-relaxed text-slate-400">{t('footer.supportNote')}</p>
            <div className="flex items-center gap-3 pt-1">
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-[#dfbe74] hover:text-[#dfbe74]"><Facebook className="h-5 w-5" /></a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-[#dfbe74] hover:text-[#dfbe74]"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 pt-8 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Topline Luxury Apartments. {t('footer.allRightsReserved', 'All rights reserved.')}</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>{t('footer.developedBy', 'Developed with quality & care by')}</span>
            <a
              href="https://www.linkedin.com/in/ahmed-abdelgelil-23bb1a2ab"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold tracking-wide text-[#dfbe74] underline decoration-[#c6a052]/40 underline-offset-4 transition-all duration-200 hover:text-[#dfbe74] hover:decoration-[#dfbe74]"
            >
              Ahmed Abdelgelil
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
