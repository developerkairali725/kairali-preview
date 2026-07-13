/**
 * @kairali/forms v1 — FROZEN to Satyam's CRM spec (docs/integrations/crm-forms-spec.md).
 * Rule: replicate the production schema EXACTLY. Only compliance additions allowed
 * (consent checkbox client-side, Turnstile, data-cta) — none of them change the payload.
 */

export const CRM_FIELDS = [
  "fullName", "countrycode", "phone", "email", "subject",
  "country", "state", "city", "message",
  "source", "campaign", "medium", "landingPage", "referrer", "gclid", "fbclid",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
];

export const HIDDEN_FIELDS = [
  "source", "campaign", "medium", "landingPage", "referrer", "gclid", "fbclid",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
];

/** Build the exact CRM payload: only known fields, all values strings, unknown keys dropped. */
export function buildPayload(input) {
  const payload = {};
  for (const key of CRM_FIELDS) {
    if (input[key] !== undefined && input[key] !== null) payload[key] = String(input[key]);
  }
  return payload;
}

/** Collect hidden/tracking values from a browser context (URL params + referrer). */
export function trackingFromLocation(url, referrer = "") {
  const u = new URL(url);
  const q = u.searchParams;
  const pick = (k) => q.get(k) || undefined;
  return {
    landingPage: u.origin + u.pathname,
    referrer: referrer || undefined,
    gclid: pick("gclid"),
    fbclid: pick("fbclid"),
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_term: pick("utm_term"),
    utm_content: pick("utm_content"),
  };
}

/**
 * Submit a lead to the CRM webhook. Server-side only (route handler / server action).
 * Endpoint comes from env CRM_WEBHOOK_URL — never hardcoded, never client-exposed.
 */
export async function submitLead(input, { endpoint = process.env.CRM_WEBHOOK_URL, fetchImpl = fetch } = {}) {
  if (!endpoint) throw new Error("CRM_WEBHOOK_URL is not set");
  const payload = buildPayload(input);
  for (const req of ["fullName", "phone", "email", "message"]) {
    if (!payload[req]) throw new Error(`Missing required field: ${req}`);
  }
  const res = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`CRM webhook responded ${res.status}`);
  return { ok: true, status: res.status, payload };
}
