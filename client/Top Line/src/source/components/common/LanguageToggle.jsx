import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const isArabic = i18n.language.startsWith('ar');

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      title="Switch Language / تغيير اللغة"
    >
      <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300"/>
      <span className="text-slate-800 dark:text-slate-200 font-semibold">
        {isArabic ? 'English' : 'العربية'}
      </span>
    </button>
  );
};
