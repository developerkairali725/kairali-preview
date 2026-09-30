// Reads ad-tracking parameters from the landing URL so they travel with the
// enquiry. Never strips them from the URL. Kept for the session so they
// survive in-page navigation.

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_keyword",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
];
const STORE = "ahv-tracking";

export function readTracking(): Record<string, string> {
  const found: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const k of KEYS) {
      const v = params.get(k);
      if (v) found[k] = v;
    }
    if (Object.keys(found).length) {
      sessionStorage.setItem(STORE, JSON.stringify(found));
      return found;
    }
    const saved = sessionStorage.getItem(STORE);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return found;
  }
}
