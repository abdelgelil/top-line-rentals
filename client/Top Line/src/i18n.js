import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation dictionaries
const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        apartments: "Apartments",
        myBookings: "My Bookings",
        adminDashboard: "Admin Dashboard",
        addApartment: "Add Apartment",
        logout: "Logout",
        language: "Language"
      },
      common: {
        search: "Search",
        filter: "Filter",
        price: "Price",
        details: "View Details",
        bookNow: "Book Now",
        status: "Status",
        actions: "Actions"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        apartments: "الوحدات والشقق",
        myBookings: "حجوزاتي",
        adminDashboard: "لوحة التحكم",
        addApartment: "إضافة شقة",
        logout: "تسجيل الخروج",
        language: "اللغة"
      },
      common: {
        search: "بحث",
        filter: "تصفية",
        price: "السعر",
        details: "عرض التفاصيل",
        bookNow: "احجز الآن",
        status: "الحالة",
        actions: "الإجراءات"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Automatically handle RTL / LTR document direction switching
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
