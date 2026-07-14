/**
 * @kairali/i18n — keyed strings + locale gates (PROJECT_CONTEXT §6, Checklist A7).
 *
 * Rules encoded here:
 *  - EN always exists. Other locales only where the site brief declares them
 *    (site.config.json "locales"). Transcreation, not translation — the
 *    dictionaries carry per-locale copy written for that audience.
 *  - A declared locale missing a key is a BUILD FAILURE, never a silent EN
 *    fallback ("a page missing a locale is flagged, never silently EN-only").
 *  - hreflang is complete and reciprocal BY CONSTRUCTION: every page emits the
 *    full alternates set for the site's declared locales + x-default, so no
 *    page can reference a locale that doesn't reference it back.
 *  - URL convention (matches KTAHV /fr/… and the kairali.guru donor):
 *    default locale (EN) at "/", every other locale under "/<locale>/…".
 */

/** Locales written right-to-left (AR needed for kairali.guru family). */
const RTL_LOCALES = new Set(["ar", "he", "fa", "ur"]);

export function isRtl(locale) {
  return RTL_LOCALES.has(String(locale).toLowerCase());
}

/** Declared locales for a site config; EN is always required. */
export function declaredLocales(config) {
  const locales = Array.isArray(config?.locales) ? config.locales : [];
  if (!locales.includes("en")) {
    throw new Error(
      `i18n: site "${config?.domain ?? "?"}" must declare "en" in site.config.json locales (EN always ships)`,
    );
  }
  return locales;
}

export function defaultLocale() {
  return "en";
}

/**
 * Locale-prefixed path. EN lives at the bare path; other locales under
 * /<locale>/. Path must start with "/".
 */
export function localePath(path, locale, { defaultLoc = "en" } = {}) {
  if (!path.startsWith("/")) throw new Error(`i18n: path must start with "/": ${path}`);
  if (locale === defaultLoc) return path;
  return path === "/" ? `/${locale}/` : `/${locale}${path}`;
}

/**
 * Full reciprocal hreflang map for one page → Next.js Metadata
 * `alternates.languages` shape, always including x-default → EN.
 * Keys are BCP-47 language codes; values absolute URLs.
 */
export function hreflangLanguages(config, path, { baseUrl } = {}) {
  const base = (baseUrl ?? `https://${config.domain}`).replace(/\/$/, "");
  const locales = declaredLocales(config);
  /** @type {Record<string, string>} */
  const languages = {};
  for (const locale of locales) {
    languages[locale] = base + localePath(path, locale);
  }
  languages["x-default"] = base + localePath(path, "en");
  return languages;
}

/**
 * Verify every declared locale's dictionary carries every key the EN
 * dictionary has (and no locale ships undeclared). Returns a list of
 * problems — empty means complete. Used by createTranslator and by specs.
 */
export function dictionaryGaps(dictionaries, config) {
  const problems = [];
  const locales = declaredLocales(config);
  const en = dictionaries?.en;
  if (!en) {
    problems.push(`dictionary "en" is missing entirely`);
    return problems;
  }
  const enKeys = Object.keys(en);
  for (const locale of locales) {
    const dict = dictionaries[locale];
    if (!dict) {
      problems.push(`declared locale "${locale}" has no dictionary`);
      continue;
    }
    for (const key of enKeys) {
      if (dict[key] === undefined || dict[key] === "") {
        problems.push(`locale "${locale}" is missing key "${key}"`);
      }
    }
  }
  for (const locale of Object.keys(dictionaries)) {
    if (!locales.includes(locale)) {
      problems.push(`dictionary "${locale}" exists but the site does not declare that locale`);
    }
  }
  return problems;
}

/**
 * Build a translator for a site. THROWS at construction if any declared
 * locale is incomplete — this is the locale gate: the build fails rather
 * than a page shipping silently EN-only.
 *
 *   const t = createTranslator({ en: {...}, de: {...} }, siteConfig);
 *   t("de", "hero.title")
 */
export function createTranslator(dictionaries, config) {
  const gaps = dictionaryGaps(dictionaries, config);
  if (gaps.length > 0) {
    throw new Error(
      `i18n locale gate failed for ${config?.domain ?? "?"} (fix the dictionaries or amend the site brief):\n - ` +
        gaps.join("\n - "),
    );
  }
  return function t(locale, key) {
    const dict = dictionaries[locale];
    if (!dict) throw new Error(`i18n: locale "${locale}" is not declared for ${config.domain}`);
    const value = dict[key];
    if (value === undefined) throw new Error(`i18n: key "${key}" missing in locale "${locale}"`);
    return value;
  };
}
