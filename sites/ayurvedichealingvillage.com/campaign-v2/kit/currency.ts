import type { Currency, Locale } from "./types.ts";

export const CURRENCIES: readonly Currency[] = ["INR", "USD", "EUR", "GBP", "AED"];
const GULF = new Set(["AE", "SA", "QA", "KW", "OM", "BH"]);
const EUROZONE = new Set(["AT","BE","BG","HR","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES"]);

export function currencyForCountry(cc: string | null): Currency {
  const c = (cc || "").toUpperCase();
  if (c === "IN") return "INR";
  if (GULF.has(c)) return "AED";
  if (EUROZONE.has(c)) return "EUR";
  if (c === "GB") return "GBP";
  return "USD";
}

const INTL: Record<Locale, string> = {
  en: "en-IN", hi: "hi-IN", ar: "ar-AE", de: "de-DE", fr: "fr-FR", es: "es-ES", it: "it-IT",
  pt: "pt-PT", nl: "nl-NL", ru: "ru-RU", "zh-Hans": "zh-CN", ja: "ja-JP", ko: "ko-KR",
};

// Grouping locale depends on the currency so Western currencies never get Indian lakh grouping.
function groupingLocale(c: Currency, locale: Locale): string {
  if (c === "INR" && (locale === "en" || locale === "hi")) return locale === "en" ? "en-IN" : "hi-IN";
  if (locale === "en" || locale === "hi") return c === "GBP" || c === "EUR" ? "en-GB" : "en-US";
  return INTL[locale];
}

export function formatMoney(amount: number, c: Currency, locale: Locale): string {
  return new Intl.NumberFormat(groupingLocale(c, locale), {
    style: "currency", currency: c, maximumFractionDigits: 0, numberingSystem: "latn",
    ...(c === "USD" ? { currencyDisplay: "code" as const } : {}), // never a bare "$"
  }).format(amount);
}
