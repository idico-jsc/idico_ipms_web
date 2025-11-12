import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/constants/languages";

export function useLanguage() {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language as LanguageCode;

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.setAttribute("lang", currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = useCallback(
    async (lang: LanguageCode) => {
      await i18n.changeLanguage(lang);
    },
    [i18n],
  );

  const getCurrentLanguageData = useCallback(() => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage);
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    getCurrentLanguageData,
    t,
  };
}
