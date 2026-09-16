import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  EN: {
    home: 'Home',
    apartments: 'Apartments',
    adminPortal: 'Admin Portal',
    bookNow: 'Book Now',
    tagline: 'Luxury Coastal Living',
    heroTitle: 'Find Your Perfect Residence in The Towers',
    heroSubtitle: 'Book fully serviced apartments with panoramic Mediterranean views and private beach access.',
    availableResidences: 'Available Residences',
    handpickedSuites: 'handpicked premium suites',
    allTowers: 'All Towers',
    sanStefano: 'San Stefano Tower',
    fourSeasons: 'Four Seasons Tower',
    resetFilters: 'Reset Filters',
    noResidences: 'No residences match your current filters',
    noResidencesSub: 'Try clearing your amenity filters or selecting another tower location.',
    panoramicViews: 'Panoramic Views',
    panoramicViewsDesc: 'Every apartment features unobstructed Mediterranean horizons and private high-floor balconies.',
    concierge: '24/7 Concierge',
    conciergeDesc: 'Enjoy private parking, round-the-clock security, and room service upon request.',
    primeAccess: 'Prime Access',
    primeAccessDesc: 'Direct indoor elevator access to luxury shopping centers, cinema, and dining.'
  },
  AR: {
    home: 'الرئيسية',
    apartments: 'الشقق والوحدات',
    adminPortal: 'لوحة التحكم',
    bookNow: 'احجز الآن',
    tagline: 'إقامة ساحلية فاخرة',
    heroTitle: 'اعثر على إقامتك المثالية في أرق أجنحة الأبراج',
    heroSubtitle: 'احجز شققاً مفروشة ومجهزة بالكامل مع إطلالات بانورامية على البحر المتوسط وخيارات دخول للشاطئ الخاص.',
    availableResidences: 'الوحدات المتاحة',
    handpickedSuites: 'أجنحة فاخرة مختارة بعناية',
    allTowers: 'جميع الأبراج',
    sanStefano: 'برج سان ستيفانو',
    fourSeasons: 'برج الفور سيزونز',
    resetFilters: 'إعادة ضبط الفلاتر',
    noResidences: 'لا توجد وحدات تطابق خيارات البحث الحالية',
    noResidencesSub: 'جرب إزالة بعض الفلاتر أو اختيار موقع برج آخر.',
    panoramicViews: 'إطلالات بانورامية',
    panoramicViewsDesc: 'تتميز كل شقة بإطلالات ساحلية مفتوحة وطوابق عليا بشرفات خاصة.',
    concierge: 'خدمة كونسيرج على مدار الساعة',
    conciergeDesc: 'استمتع بمواقف سيارات خاصة، أمن على مدار الساعة، وخدمات الغرف عند الطلب.',
    primeAccess: 'موقع متميز ومباشر',
    primeAccessDesc: 'دخول مباشر للمصاعد المؤدية للمراكز التجارية الفاخرة، المجمع السينمائي والمطاعم.'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('topline_lang') || 'EN');

  useEffect(() => {
    localStorage.setItem('topline_lang', language);
    if (language === 'AR') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [language]);

  const t = (key) => TRANSLATIONS[language]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);