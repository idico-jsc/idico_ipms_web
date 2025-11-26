import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { IS_DEV } from '@/constants/env';

// Import English translation files
import enCommon from '@/locales/en/common.json';
import enButtons from '@/locales/en/buttons.json';
import enFields from '@/locales/en/fields.json';
import enMessages from '@/locales/en/messages.json';
import enModals from '@/locales/en/modals.json';
import enDialogs from '@/locales/en/dialogs.json';
import enPages from '@/locales/en/pages.json';

// Import Vietnamese translation files
import viCommon from '@/locales/vi/common.json';
import viButtons from '@/locales/vi/buttons.json';
import viFields from '@/locales/vi/fields.json';
import viMessages from '@/locales/vi/messages.json';
import viModals from '@/locales/vi/modals.json';
import viDialogs from '@/locales/vi/dialogs.json';
import viPages from '@/locales/vi/pages.json';

// Define resources with multiple namespaces
const resources = {
  en: {
    common: enCommon,
    buttons: enButtons,
    fields: enFields,
    messages: enMessages,
    modals: enModals,
    dialogs: enDialogs,
    pages: enPages,
  },
  vi: {
    common: viCommon,
    buttons: viButtons,
    fields: viFields,
    messages: viMessages,
    modals: viModals,
    dialogs: viDialogs,
    pages: viPages,
  },
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: IS_DEV,

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Namespace configuration
    ns: ['common', 'buttons', 'fields', 'messages', 'modals', 'dialogs', 'pages'],
    defaultNS: 'common',
  });

export default i18n;
