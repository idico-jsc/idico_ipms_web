export const LANGUAGES = {
  EN: 'en',
  VI: 'vi',
} as const;

export type LanguageCode = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: LANGUAGES.EN,
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
  },
  {
    code: LANGUAGES.VI,
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
  },
];

export const DEFAULT_LANGUAGE = LANGUAGES.EN;
