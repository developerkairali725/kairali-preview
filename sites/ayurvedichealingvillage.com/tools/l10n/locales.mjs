/** Locale registry — URL prefix, html lang/dir, OG locale, tariff currency, PDF folder. */
export const LOCALES = {
  hi: { prefix: "hi", lang: "hi", dir: "ltr", og: "hi_IN", currency: "INR", pdf: "hi", name: "हिन्दी", label: "Hindi" },
  de: { prefix: "de", lang: "de", dir: "ltr", og: "de_DE", currency: "EUR", pdf: "de", name: "Deutsch", label: "German" },
  fr: { prefix: "fr", lang: "fr", dir: "ltr", og: "fr_FR", currency: "EUR", pdf: "fr", name: "Français", label: "French" },
  es: { prefix: "es", lang: "es", dir: "ltr", og: "es_ES", currency: "EUR", pdf: "es", name: "Español", label: "Spanish" },
  it: { prefix: "it", lang: "it", dir: "ltr", og: "it_IT", currency: "EUR", pdf: "it", name: "Italiano", label: "Italian" },
  pt: { prefix: "pt", lang: "pt", dir: "ltr", og: "pt_PT", currency: "EUR", pdf: "pt", name: "Português", label: "Portuguese" },
  nl: { prefix: "nl", lang: "nl", dir: "ltr", og: "nl_NL", currency: "EUR", pdf: "nl", name: "Nederlands", label: "Dutch" },
  ru: { prefix: "ru", lang: "ru", dir: "ltr", og: "ru_RU", currency: "USD", pdf: "ru", name: "Русский", label: "Russian" },
  ar: { prefix: "ar", lang: "ar", dir: "rtl", og: "ar_AR", currency: "USD", pdf: "ar", name: "العربية", label: "Arabic" },
  "zh-Hans": { prefix: "zh", lang: "zh-Hans", dir: "ltr", og: "zh_CN", currency: "USD", pdf: "zh", name: "简体中文", label: "Chinese (Simplified)" },
  ja: { prefix: "ja", lang: "ja", dir: "ltr", og: "ja_JP", currency: "USD", pdf: "ja", name: "日本語", label: "Japanese" },
  ko: { prefix: "ko", lang: "ko", dir: "ltr", og: "ko_KR", currency: "USD", pdf: "ko", name: "한국어", label: "Korean" },
};
export const EN = { prefix: "", lang: "en", dir: "ltr", og: "en_US", currency: "INR", pdf: "en", name: "English", label: "English" };
export const CODES = Object.keys(LOCALES);
