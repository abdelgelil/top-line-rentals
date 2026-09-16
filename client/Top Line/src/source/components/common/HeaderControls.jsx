import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const HeaderControls = () => {
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Language Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all border border-slate-200/50 dark:border-slate-700/50"
        >
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span>{language === 'AR' ? 'العربية' : 'English'}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showLangMenu && (
          <div className="absolute right-0 ltr:right-0 rtl:left-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1 z-50">
            {[
              { code: 'EN', label: 'English' },
              { code: 'AR', label: 'العربية' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setShowLangMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-semibold transition-all ${
                  language === lang.code
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && <Check className="w-3.5 h-3.5 text-amber-500" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};