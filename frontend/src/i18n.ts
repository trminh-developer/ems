import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  vi: { translation: vi },
  en: { translation: en }
};

const savedLang = typeof window !== 'undefined' ? (localStorage.getItem('hc_lang') || 'vi') : 'vi';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en'],
    load: 'languageOnly',
    debug: false,
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'hc_lang',
      caches: ['localStorage'],
    }
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hc_lang', lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
