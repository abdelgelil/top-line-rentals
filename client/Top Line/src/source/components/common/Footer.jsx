import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import logo from '../../../assets/Logo2.png';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.resolvedLanguage || i18n.language) === 'rtl';

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} className="mt-auto border-t border-slate-800 bg-slate-900 pt-14 pb-8 text-slate-300 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-slate-800/80 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex w-fit items-center gap-2.5">
              <img src={logo} alt="TopLine Luxury Apartments" className="w-48 rounded-lg bg-white p-2" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">{t('footer.aboutText')}</p>
            <div className="flex w-fit items-center gap-2 rounded-full border border-blue-800/50 bg-blue-950/50 px-3 py-1.5 text-xs text-blue-300">
              <ShieldCheck className="h-4 w-4" /> <span>{t('footer.verifiedProperties')}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold tracking-wide text-white">{t('footer.quickLinks')}</h2>
            <ul className="space-y-2.5 text-sm">
              <li><Link className="transition-colors hover:text-blue-400" to="/">{t('nav.home')}</Link></li>
              <li><Link className="transition-colors hover:text-blue-400" to="/apartments">{t('nav.apartments')}</Link></li>
              <li><Link className="transition-colors hover:text-blue-400" to="/my-bookings">{t('nav.myBookings')}</Link></li>
              <li><Link className="transition-colors hover:text-blue-400" to="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold tracking-wide text-white">{t('footer.contactUs')}</h2>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 shrink-0 text-blue-400" /><a href="https://maps.app.goo.gl/PZ7EcCYEGwLkZJ849?g_st=iw" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-blue-300">{t('footer.address')}</a></li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-blue-400" /><a dir="ltr" href="tel:+201000000000" className="hover:text-blue-300">+20 100 000 0000</a></li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-blue-400" /><a href="mailto:support@toplinerentals.com" className="hover:text-blue-300">support@toplinerentals.com</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold tracking-wide text-white">{t('footer.support')}</h2>
            <p className="text-sm leading-relaxed text-slate-400">{t('footer.supportNote')}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} TopLine Luxury Apartments. {t('footer.allRightsReserved', 'All rights reserved.')}</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>{t('footer.developedBy', 'Developed with quality & care by')}</span>
            <a
              href="https://www.linkedin.com/in/ahmed-abdelgelil-23bb1a2ab"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold tracking-wide text-blue-400 underline decoration-blue-500/40 underline-offset-4 transition-all duration-200 hover:text-blue-300 hover:decoration-blue-400"
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
