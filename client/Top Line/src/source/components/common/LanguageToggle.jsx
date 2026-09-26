import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const current = i18n.language || 'en';
    const nextLang = current.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const isArabic = (i18n.language || 'en').startsWith('ar');

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all"
      aria-label="Toggle Language"
    >
      <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"/>
      <span>{isArabic ? 'English' : 'العربية'}</span>
    </button>
  );
};
