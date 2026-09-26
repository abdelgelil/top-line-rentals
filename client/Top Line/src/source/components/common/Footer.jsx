import i18n from "../../../i18n.js";
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-20 px-4 md:px-8 max-w-7xl mx-auto pb-10">
      <div className="backdrop-blur-xl bg-white/20 dark:bg-slate-900/30 border border-white/30 dark:border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 text-slate-700 dark:text-slate-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl tracking-tight">
              <div className="p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span>{i18n.t("TopLine")}{' '}<span className="text-indigo-600 dark:text-indigo-400 font-light">{i18n.t("Rentals")}</span></span>
            </Link>
            <p className="text-sm leading-relaxed opacity-80">{' '}{i18n.t("Premium coastal residences and luxury tower apartments with seamless booking and hospitality.")}{' '}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-base mb-4">{i18n.t("Quick Links")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-indigo-500 transition-colors">{i18n.t("Home Overview")}</Link></li>
              <li><Link to="/apartments" className="hover:text-indigo-500 transition-colors">{i18n.t("Available Units")}</Link></li>
              <li><Link to="/admin" className="hover:text-indigo-500 transition-colors">{i18n.t("Property Management")}</Link></li>
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-base mb-4">{i18n.t("Host Guarantee")}</h4>
            <ul className="space-y-2.5 text-sm opacity-80">
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" />{' '}{i18n.t("Verified Listings")}</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" />{' '}{i18n.t("Direct Owner Pricing")}</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" />{' '}{i18n.t("Instant Reservation")}</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-base mb-4">{i18n.t("Contact & Support")}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5 opacity-80">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{i18n.t("San Stefano Towers, Alexandria")}</span>
              </div>
              <div className="flex items-center gap-2.5 opacity-80">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>+20 100 000 0000</span>
              </div>
              <div className="flex items-center gap-2.5 opacity-80">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{i18n.t("support@toplinerentals.com")}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-white/20 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-70">
          <p>© {new Date().getFullYear()}{' '}{i18n.t("TopLine Rentals. All rights reserved.")}</p>
          <p className="flex items-center gap-1">{' '}{i18n.t("Engineered with")}{' '}<Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />{' '}{i18n.t("for luxury living")}{' '}</p>
        </div>
      </div>
    </footer>
  );
};
