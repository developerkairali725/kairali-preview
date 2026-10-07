import type { Locale } from "./types.ts";

export const SUPPORTED_LOCALES: readonly Locale[] = ["en","hi","ar","de","fr","es","it","pt","nl","ru","zh-Hans","ja","ko"];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English", hi: "हिन्दी", ar: "العربية", de: "Deutsch", fr: "Français", es: "Español",
  it: "Italiano", pt: "Português", nl: "Nederlands", ru: "Русский", "zh-Hans": "中文", ja: "日本語", ko: "한국어",
};

function toLocale(tag: string): Locale | null {
  const t = tag.trim().toLowerCase();
  // zh-Hans is the only Chinese locale the site has, so all Chinese variants (zh-TW, zh-HK, zh-Hant...) fall back to it.
  if (t === "zh" || t.startsWith("zh-")) return "zh-Hans";
  const base = t.split("-")[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(base) ? (base as Locale) : null;
}

function parseQ(params: string[]): number {
  for (const p of params) {
    const m = /^q\s*=\s*(.*)$/i.exec(p.trim());
    if (m) {
      const n = Number(m[1].trim());
      return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 1; // malformed q → treated as 1
    }
  }
  return 1;
}

// Callers always pass >= 1 locale; "en" is the safe default if they ever pass none.
export function pickLocale(acceptLanguage: string | null, available: readonly Locale[]): Locale {
  const fallback: Locale = available.includes("en") ? "en" : (available[0] ?? "en");
  if (!acceptLanguage) return fallback;
  const ranked = acceptLanguage.split(",").map((part, i) => {
    const [tag, ...params] = part.split(";");
    return { tag, q: parseQ(params), i };
  }).filter((r) => r.q > 0) // q=0 means "not acceptable"
    .sort((a, b) => b.q - a.q || a.i - b.i);
  for (const r of ranked) {
    // "*" is intentionally ignored (toLocale returns null) so the fallback applies.
    const l = toLocale(r.tag);
    if (l && available.includes(l)) return l;
  }
  return fallback;
}

export const isRtl = (l: Locale): boolean => l === "ar";
