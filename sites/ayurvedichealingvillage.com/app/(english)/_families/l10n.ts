/**
 * AHV localization — server-side locale context.
 *
 * Everything here is GENERATED data read at build time: the reviewed route
 * table (l10n/routes.json — English path ↔ each locale's path, including the
 * legacy German/French URLs served in place), the locale registry, and the
 * per-locale dictionaries tools/l10n/build.mjs compiles from the accepted
 * translation catalogue (head metadata, UI strings, native-page strings,
 * localized site tree and data). Nothing is translated at request time and
 * nothing is inferred: a string without an accepted translation stays English
 * and is counted in the build report, never presented as translated.
 */
import fs from "node:fs";
import path from "node:path";
import ROUTES from "../../../l10n/routes.json";
import LOCALE_TABLE from "../../../l10n/locales.json";

export type LocaleCode = "en" | "hi" | "de" | "fr" | "es" | "it" | "pt" | "nl" | "ru" | "ar" | "zh-Hans" | "ja" | "ko";
export interface LocaleInfo { prefix: string; lang: string; htmlLang: string; dir: "ltr" | "rtl"; og: string; currency: string; name: string; label?: string; pdf?: string }
export const LOCALE_INFO = LOCALE_TABLE as unknown as Record<LocaleCode, LocaleInfo>;
export const LOCALE_CODES = Object.keys(LOCALE_INFO) as LocaleCode[];
export const TARGET_CODES = LOCALE_CODES.filter((c) => c !== "en");
export const ORIGIN = "https://ayurvedichealingvillage.com";

type RouteRow = Record<string, string>;
const TABLE = (ROUTES as unknown as { routes: Record<string, RouteRow> }).routes;
const REVERSE = new Map<string, { en: string; loc: LocaleCode }>();
for (const [en, row] of Object.entries(TABLE)) for (const [loc, p] of Object.entries(row)) REVERSE.set(p, { en, loc: loc as LocaleCode });

/** The localized path of an English route, or null when the route is not localized (campaign/excluded). */
export function localizedPath(enPath: string, loc: LocaleCode): string | null {
  if (loc === "en") return enPath;
  return TABLE[enPath]?.[loc] ?? null;
}
/** Resolve a locale's URL segments (after the prefix dir) to its English route path. */
export function enPathFor(loc: LocaleCode, segments: string[] | undefined): string | null {
  const prefix = LOCALE_INFO[loc].prefix;
  const p = "/" + [prefix, ...(segments ?? [])].filter(Boolean).join("/") + "/";
  const hit = REVERSE.get(p.replace(/\/+/g, "/"));
  return hit && hit.loc === loc ? hit.en : null;
}
/** Every locale path (segments after the prefix) this locale serves — for generateStaticParams. */
export function localeSegments(loc: LocaleCode): string[][] {
  const prefix = "/" + LOCALE_INFO[loc].prefix + "/";
  return Object.values(TABLE).map((row) => row[loc]).filter(Boolean).map((p) => p.slice(prefix.length).split("/").filter(Boolean));
}
/** hreflang cluster for a route: every locale that has this page, fully qualified. */
export function alternates(enPath: string): Record<string, string> {
  const row = TABLE[enPath];
  if (!row) return {};
  const out: Record<string, string> = {};
  for (const c of LOCALE_CODES) if (row[c]) out[LOCALE_INFO[c].htmlLang === "en-US" ? "en" : LOCALE_INFO[c].lang] = ORIGIN + row[c];
  out["x-default"] = ORIGIN + row.en;
  return out;
}

export interface LocaleData {
  locale: string;
  missingUnits: number;
  meta: Record<string, { path: string | null; title: string | null; description: string | null; ogTitle: string | null; ogDescription: string | null }>;
  ui: Record<string, string>;
  native: Record<string, string>;
  data: Record<string, unknown>;
}
const cache = new Map<string, LocaleData>();
export function localeData(loc: LocaleCode): LocaleData | null {
  if (loc === "en") return null;
  if (!cache.has(loc)) {
    const file = path.join(process.cwd(), "l10n", "generated", `${loc}.json`);
    cache.set(loc, JSON.parse(fs.readFileSync(file, "utf8")) as LocaleData);
  }
  return cache.get(loc)!;
}
/** UI string lookup: accepted translation, else the English source (counted as missing at build). */
export function t(loc: LocaleCode, english: string): string {
  if (loc === "en") return english;
  const d = localeData(loc);
  const key = english.replace(/[\s ]+/g, " ").trim();
  return d?.ui[key] ?? d?.native[key] ?? english;
}

/**
 * Full-catalogue lookup for server-rendered text that is not a UI string
 * (schema labels, breadcrumb names, native-page data): unit id = hash of the
 * normalised English text, exactly as tools/l10n/lib.mjs computes it.
 */
import crypto from "node:crypto";
const catalogs = new Map<string, Record<string, string>>();
export function translate(loc: LocaleCode, english: string): string {
  if (loc === "en" || !english) return english;
  if (!catalogs.has(loc)) {
    const file = path.join(process.cwd(), "l10n", "generated", `${loc}.catalog.json`);
    catalogs.set(loc, fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, string>) : {});
  }
  const norm = english.replace(/[\s ]+/g, (m) => (m.includes(" ") && !/[\t\n\r ]/.test(m) ? " " : " ")).trim();
  const id = "t_" + crypto.createHash("sha256").update(norm, "utf8").digest("hex").slice(0, 20);
  return catalogs.get(loc)![id] ?? english;
}

/** The reviewed route table (English path → locale paths). */
export function routeTable(): Record<string, RouteRow> {
  return TABLE;
}
