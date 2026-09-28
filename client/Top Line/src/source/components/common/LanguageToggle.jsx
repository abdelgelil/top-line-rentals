import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageToggle = ({ compact = false }) => {
  const { i18n, t } = useTranslation();
  const isArabic = (i18n.resolvedLanguage || i18n.language || 'en').toLowerCase().startsWith('ar');
  const nextLanguage = isArabic ? 'en' : 'ar';

  return (
    <button
      onClick={() => i18n.changeLanguage(nextLanguage)}
      type="button"
      aria-label={t(isArabic ? 'language.switchToEnglish' : 'language.switchToArabic')}
      title={t(isArabic ? 'language.english' : 'language.arabic')}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a052] dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 ${compact ? 'w-11 px-0' : ''}`}
    >
      <Globe aria-hidden="true" className="h-4 w-4 shrink-0 text-[#785910] dark:text-[#dfbe74]" />
      <span dir="auto" className={compact ? 'sr-only' : ''}>{t(isArabic ? 'language.english' : 'language.arabic')}</span>
    </button>
  );
};
