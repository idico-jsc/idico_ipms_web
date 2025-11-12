import 'i18next';

// Import translation resources
import common from '@/locales/en/common.json';
import buttons from '@/locales/en/buttons.json';
import fields from '@/locales/en/fields.json';
import messages from '@/locales/en/messages.json';
import modals from '@/locales/en/modals.json';
import dialogs from '@/locales/en/dialogs.json';
import pages from '@/locales/en/pages.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      buttons: typeof buttons;
      fields: typeof fields;
      messages: typeof messages;
      modals: typeof modals;
      dialogs: typeof dialogs;
      pages: typeof pages;
    };
  }
}

