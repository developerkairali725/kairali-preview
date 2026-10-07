// Pure helpers for the 13b interactive pieces (locale switcher, currency, gallery). No DOM, no React,
// so node --test runs them directly. Erasable TypeScript only.

import type { Currency, Locale } from "../../kit/types.ts";
import { CURRENCIES } from "../../kit/currency.ts";
import { LANG_COOKIE } from "./prefs.ts";

/** localStorage key for the visitor's currency choice. */
export const CURRENCY_PREF = "lp-currency";
/** window CustomEvent name; detail = the new Currency. Fees, PriceText and the switcher chip listen. */
export const CURRENCY_EVENT = "lp-currency";

/** document.cookie string for the language override (read by the /lp-v2 layout and page). */
export function langCookie(code: Locale): string {
  return `${LANG_COOKIE}=${encodeURIComponent(code)}; Path=/lp-v2; Max-Age=31536000; SameSite=Lax`;
}

/** The same URL with ?lang=<code>, keeping every other query param and the hash. Returns href unchanged if unparsable. */
export function langUrl(href: string, code: Locale): string {
  try {
    const u = new URL(href);
    u.searchParams.set("lang", code);
    return u.toString();
  } catch {
    return href;
  }
}

export function isCurrency(v: unknown): v is Currency {
  return typeof v === "string" && (CURRENCIES as readonly string[]).includes(v);
}

/** A stored currency choice wins over the geo default, but only when it is a currency we offer. */
export function reconcileCurrency(stored: unknown, geo: Currency): Currency {
  return isCurrency(stored) ? stored : geo;
}

/** Wraps a lightbox index into 0..n-1 (prev from 0 → last, next from last → 0). n ≤ 0 → 0. */
export function wrapIndex(i: number, n: number): number {
  if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(i)) return 0;
  return ((Math.trunc(i) % n) + n) % n;
}

/** Short chip code for a locale: "EN", "DE", "ZH" (zh-Hans). */
export function localeChip(code: Locale): string {
  return code.split("-")[0].toUpperCase();
}
