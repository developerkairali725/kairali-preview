import type { Currency, Locale } from "./kit/types.ts";
import { pickLocale, isRtl } from "./kit/locale.ts";
import { currencyForCountry } from "./kit/currency.ts";
import { requiresConsent } from "./kit/consent-region.ts";

export function resolveRequest(h: { acceptLanguage: string | null; country: string | null }, available: Locale[]) {
  const locale = pickLocale(h.acceptLanguage, available);
  return {
    locale,
    dir: (isRtl(locale) ? "rtl" : "ltr") as "ltr" | "rtl",
    currency: currencyForCountry(h.country) as Currency,
    consentRequired: requiresConsent(h.country),
  };
}

// Edge "unknown / anonymous / regional" codes that are not a visitor's country (Cloudflare XX/T1, legacy
// MaxMind A1/A2/AP/EU/O1, user-assigned ZZ).
const COUNTRY_SENTINELS = new Set(["XX", "ZZ", "T1", "A1", "A2", "AP", "EU", "O1"]);

/** The visitor's ISO 3166-1 alpha-2 country from the edge header, or undefined. Pure. */
export function countryCode(raw: unknown): string | undefined {
  return typeof raw === "string" && /^[A-Z]{2}$/.test(raw) && !COUNTRY_SENTINELS.has(raw) ? raw : undefined;
}
