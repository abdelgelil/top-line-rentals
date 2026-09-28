import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import i18n from '../../../i18n.js';

export const HeaderControls = () => {
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const options = [{ code: 'EN', label: 'English' }, { code: 'AR', label: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©' }];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowLangMenu((open) => !open)}
          aria-label={i18n.t('Toggle Language')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all border border-slate-200/50 dark:border-slate-700/50"
        >
          <Globe className="w-3.5 h-3.5 text-[#c6a052]" />
          <span>{language === 'AR' ? 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©' : 'English'}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
        {showLangMenu && (
          <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1 z-50">
            {options.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => { setLanguage(option.code); setShowLangMenu(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-semibold transition-all ${language === option.code ? 'bg-[#c6a052]/10 text-[#785910] dark:text-[#dfbe74] font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <span>{option.label}</span>
                {language === option.code && <Check className="w-3.5 h-3.5 text-[#c6a052]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
