/**
 * @kairali/consent core — Google Consent Mode v2 state + inline snippets.
 *
 * Law (PROJECT_CONTEXT §4.4): India DPDP 2023 baseline, GDPR posture on
 * EU-facing pages. Default is DENIED for everything, every region — consent
 * is opt-in via the banner, never assumed. The four Consent Mode v2 keys
 * (ad_storage, ad_user_data, ad_personalization, analytics_storage) plus the
 * storage keys Google documents for completeness.
 *
 * Ordering contract (enforced by composition in <ConsentScripts/>): the
 * default-denied snippet runs BEFORE any tag loader — @kairali/analytics
 * renders loaders only after these inline scripts in document order.
 */

export const CONSENT_STORAGE_KEY = "kairali-consent-v1";

/** The Consent Mode v2 signal set. */
export const CONSENT_KEYS = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
  "functionality_storage",
  "personalization_storage",
  "security_storage",
];

export const DENIED_ALL = Object.fromEntries(
  CONSENT_KEYS.map((k) => [k, k === "security_storage" ? "granted" : "denied"]),
);

export const GRANTED_ALL = Object.fromEntries(CONSENT_KEYS.map((k) => [k, "granted"]));

/**
 * Inline bootstrap snippet: dataLayer + gtag shim + default-denied consent.
 * MUST be the first script of the measurement stack. `wait_for_update` gives
 * the stored-choice re-apply (below, same inline pass) room to land before
 * tags fire their first hits.
 */
export function consentDefaultSnippet() {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag=window.gtag||gtag;",
    `gtag('consent','default',${JSON.stringify({ ...DENIED_ALL, wait_for_update: 500 })});`,
  ].join("");
}

/**
 * Inline snippet re-applying a previously stored choice (returning visitor)
 * synchronously, before any tag loads. Malformed storage = stay denied.
 */
export function storedConsentSnippet() {
  return [
    "try{",
    `var c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}));`,
    "if(c&&c.consent){gtag('consent','update',c.consent);}",
    "}catch(e){}",
  ].join("");
}

/** The record the banner stores; `granted` is the user's binary choice. */
export function choiceRecord(granted) {
  return {
    v: 1,
    granted: !!granted,
    consent: granted ? GRANTED_ALL : DENIED_ALL,
    at: new Date().toISOString(),
  };
}

/** Browser helper for the banner: read a stored record (null = no choice yet). */
export function readStoredChoice(storage) {
  try {
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.granted === "boolean" ? parsed : null;
  } catch {
    return null;
  }
}

/** Browser helper for the banner: persist + apply a choice. */
export function applyChoice(granted, { storage, gtagFn } = {}) {
  const record = choiceRecord(granted);
  try {
    storage?.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* private mode etc. — consent still applies for this page view */
  }
  gtagFn?.("consent", "update", record.consent);
  return record;
}
