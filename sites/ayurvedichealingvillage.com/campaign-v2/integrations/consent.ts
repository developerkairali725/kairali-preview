// Consent helpers shared by track() and the adapters. FAIL CLOSED: consent counts as required unless the
// geo consent default (kit/consent-region.ts) explicitly set window.__ahvConsentRequired = false.

import { CONSENT_STORAGE_KEY, DENIED_ALL } from "@kairali/consent/core";

type W = {
  __ahvConsentRequired?: boolean;
  localStorage?: { getItem(k: string): string | null };
};

export function consentRequired(w: W): boolean {
  return w.__ahvConsentRequired !== false;
}

function storedGranted(w: W): boolean | null {
  try {
    const raw = w.localStorage?.getItem(CONSENT_STORAGE_KEY);
    const rec = raw ? JSON.parse(raw) : null;
    if (!rec || typeof rec !== "object") return null;
    return rec.granted === true ? true : rec.granted === false ? false : null;
  } catch {
    return null;
  }
}

/** Gate for non-Consent-Mode tools: consent region → needs a granted record; elsewhere → a stored denial still wins. */
export function consentAllowsNonCm(w: W): boolean {
  const g = storedGranted(w);
  return consentRequired(w) ? g === true : g !== false;
}

/** May we write our own identifiers (e.g. the lead de-dupe list) to localStorage? */
export function mayPersist(w: W): boolean {
  return !consentRequired(w) || storedGranted(w) === true;
}

// ---- "Cookie preferences" (footer, consent regions only) ----
// The footer renders <button data-ahv-cookie-choices>. Clicking it withdraws the stored choice: the record is
// removed, Consent Mode goes back to denied, and the page reloads so the banner shows again and no
// non-Consent-Mode tool stays loaded. Withdrawal is one click, as easy as giving consent (spec §9).

export const COOKIE_CHOICES_SELECTOR = "[data-ahv-cookie-choices]";

type ChoiceEl = { closest(sel: string): ChoiceEl | null };
export type CookieChoicesEnv = {
  storage?: { removeItem(k: string): void } | null;
  gtag?: ((...args: unknown[]) => void) | undefined;
  reload: () => void;
};

/** Pure: did this click land on (or inside) the Cookie preferences control? Exported for tests. */
export function isCookieChoicesClick(target: unknown): boolean {
  const el = target as ChoiceEl | null;
  return !!el && typeof el.closest === "function" && el.closest(COOKIE_CHOICES_SELECTOR) !== null;
}

/** Clear the stored choice, reset Consent Mode to denied, reload. Each step is best-effort. Exported for tests. */
export function reopenConsent(env: CookieChoicesEnv): void {
  try { env.storage?.removeItem(CONSENT_STORAGE_KEY); } catch { /* storage blocked: the reload still re-asks */ }
  try { env.gtag?.("consent", "update", DENIED_ALL); } catch { /* gtag not present */ }
  env.reload();
}

/** One delegated click listener for the page. Returns an uninstall function. Browser only. */
export function installCookieChoices(): () => void {
  if (typeof document === "undefined" || typeof window === "undefined") return () => {};
  const onClick = (e: Event) => {
    if (!isCookieChoicesClick(e.target)) return;
    e.preventDefault();
    let storage: Storage | null = null;
    try { storage = window.localStorage; } catch { /* blocked */ }
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    reopenConsent({ storage, gtag: w.gtag, reload: () => window.location.reload() });
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
