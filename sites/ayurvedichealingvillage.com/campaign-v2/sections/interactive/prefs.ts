// Small preference helpers shared by the interactive sections (and the server, for the locale cookie).
// Storage can throw (private mode, blocked site data), so nothing here ever throws.

import type { Locale } from "../../kit/types.ts";

type S = { getItem(k: string): string | null; setItem(k: string, v: string): void };

export function readPref(s: S | undefined, key: string): string | null {
  try { return s ? s.getItem(key) : null; } catch { return null; }
}
export function writePref(s: S | undefined, key: string, value: string): void {
  try { s?.setItem(key, value); } catch { /* storage blocked */ }
}

/**
 * The language override cookie. The locale switcher (Task 13b) writes it and reloads with ?lang=xx;
 * the layout reads it via cookies() for <html lang dir>, because a layout cannot see searchParams.
 */
export const LANG_COOKIE = "lp-lang";

/** The candidate as a Locale when this campaign offers it, else null. Exact match only. */
export function localeOverride(candidate: unknown, locales: readonly Locale[]): Locale | null {
  if (typeof candidate !== "string") return null;
  const c = candidate.trim();
  return (locales as readonly string[]).includes(c) ? (c as Locale) : null;
}
