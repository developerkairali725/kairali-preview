// Owner decision 21 (7 Oct 2026): banner only where law requires it.
import { GRANTED_ALL, DENIED_ALL, CONSENT_STORAGE_KEY } from "@kairali/consent/core"; // subpath: index.ts pulls .tsx, which node --test cannot load

const EU27 = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"];
export const CONSENT_COUNTRIES: ReadonlySet<string> = new Set([...EU27, "IS", "LI", "NO", "GB", "CH"]);

// Unknown/anonymous geo values emitted by Cloudflare/Vercel/MaxMind. Not real countries → fail safe.
const GEO_SENTINELS: ReadonlySet<string> = new Set(["XX","ZZ","T1","A1","A2","AP","EU","O1"]);

/** false (no banner) ONLY for a well-formed, known, non-consent country code. Everything else fails safe. */
export function requiresConsent(cc: string | null): boolean {
  if (!cc) return true;
  const code = cc.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || GEO_SENTINELS.has(code)) return true;
  return CONSENT_COUNTRIES.has(code);
}

// Escape "<" so interpolated JSON can never close the surrounding <script>.
const js = (v: unknown): string => JSON.stringify(v).replace(/</g, "\\u003c");

/** Inline <head> script. Must run before any tag loader. */
export function geoConsentDefaultSnippet(required: boolean): string {
  const defaults = required ? { ...DENIED_ALL, wait_for_update: 500 } : GRANTED_ALL;
  const key = js(CONSENT_STORAGE_KEY);
  // required: denied default, then re-apply any stored choice (wait_for_update gives it 500ms).
  // not required: granted default, but a previously stored explicit DENIAL must still win.
  const stored = required
    ? `try{var c=JSON.parse(localStorage.getItem(${key})||'null');if(c&&c.consent){window.gtag('consent','update',c.consent);}}catch(e){}`
    : `try{var c=JSON.parse(localStorage.getItem(${key})||'null');if(c&&c.granted===false&&c.consent){window.gtag('consent','update',c.consent);}}catch(e){}`;
  return [
    "window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};",
    `window.gtag('consent','default',${js(defaults)});`,
    stored,
    `window.__ahvConsentRequired=${required ? "true" : "false"};`,
  ].join("");
}
