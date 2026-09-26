import React, { createContext, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { i18n, t } = useTranslation();
  const language = i18n.language?.toLowerCase().startsWith('ar') ? 'AR' : 'EN';
  const setLanguage = (nextLanguage) => i18n.changeLanguage(nextLanguage === 'AR' ? 'ar' : 'en');
  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
