// Hand-maintained declarations for src/index.js (plain-ESM house style).
// Keep in sync with the JSDoc there.

export interface SiteConfig {
  domain: string;
  locales: string[];
  [key: string]: unknown;
}

export function isRtl(locale: string): boolean;
export function declaredLocales(config: SiteConfig): string[];
export function defaultLocale(): "en";
export function localePath(
  path: string,
  locale: string,
  opts?: { defaultLoc?: string },
): string;
export function hreflangLanguages(
  config: SiteConfig,
  path: string,
  opts?: { baseUrl?: string },
): Record<string, string>;
export function dictionaryGaps(
  dictionaries: Record<string, Record<string, string>>,
  config: SiteConfig,
): string[];
export function createTranslator(
  dictionaries: Record<string, Record<string, string>>,
  config: SiteConfig,
): (locale: string, key: string) => string;
