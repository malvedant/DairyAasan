import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './Languages/en/translation.json';
import hi from './Languages/hi/translation.json';
import mr from './Languages/mr/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
