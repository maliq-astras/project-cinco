import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';

/**
 * Configure i18next for internationalization
 * 
 * This initializes the i18next library with:
 * - Language detection to automatically detect user's preferred language
 * - English and Spanish translations
 * - LocalStorage persistence
 */
const i18nextConfig = i18n
  // Use language detector to detect browser language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Resources contains all translation files
    resources: {
      en: {
        common: enCommon,
      },
      es: {
        common: esCommon,
      }
    },
    // Default language
    fallbackLng: 'en',
    // Default namespace
    defaultNS: 'common',
    // Enable debugging in development
    debug: process.env.NODE_ENV === 'development',
    // Detection options for language detector
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],
      // Cache language in localStorage
      caches: ['localStorage'],
      // localStorage key
      lookupLocalStorage: 'i18nextLng',
    },
    // Interpolation options
    interpolation: {
      // React already protects from XSS
      escapeValue: false,
    },
  });

export default i18nextConfig; 