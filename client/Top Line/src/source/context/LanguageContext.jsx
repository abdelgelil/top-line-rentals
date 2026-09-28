import React, { createContext, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { i18n, t } = useTranslation();
  const language = i18n.language?.toLowerCase().startsWith('ar') ? 'AR' : 'EN';
  const setLanguage = (nextLanguage) => {
    if (typeof i18n?.changeLanguage !== 'function') {
      return Promise.reject(new Error('The i18n instance is not initialized'));
    }
    return i18n.changeLanguage(nextLanguage === 'AR' ? 'ar' : 'en');
  };
  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
