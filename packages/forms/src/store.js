/**
 * Store-first lead capture — Satyam's PRODUCTION spec (email 14 Jul 2026):
 * every submission is written to OUR Supabase database FIRST so a lead can
 * never be lost; the CRM fetches/reprocesses from there. No direct-to-webhook
 * in production. The full canonical CRM payload (buildPayload) is preserved in
 * the jsonb `payload` column so the CRM can reconstruct it exactly, PLUS a
 * boolean `consent` field with a timestamp (DPDP proof).
 *
 * SERVER-SIDE ONLY — uses the service_role key from env. Never import into a
 * client bundle; call it from a route handler / server action.
 */
import { buildPayload } from "./index.js";

const TABLE = "form_submissions";

/**
 * @param {Record<string, unknown>} input  canonical form input (CRM_FIELDS)
 * @param {{
 *   site: string, formType?: string, consent: boolean, sourceUrl?: string,
 *   supabaseUrl?: string, serviceKey?: string, fetchImpl?: typeof fetch
 * }} opts
 * @returns {Promise<{ ok: true, id: string, status: string }>}
 */
export async function storeLead(input, {
  site,
  formType = "enquiry",
  consent,
  sourceUrl,
  supabaseUrl = process.env.SUPABASE_URL,
  serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY,
  fetchImpl = fetch,
} = {}) {
  if (!supabaseUrl || !serviceKey) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
  if (!site) throw new Error("site is required");
  if (consent !== true) throw new Error("consent must be explicitly granted before storing a lead");

  const payload = buildPayload(input);
  for (const req of ["fullName", "phone", "email", "message"]) {
    if (!payload[req]) throw new Error(`Missing required field: ${req}`);
  }

  const row = {
    site,
    form_type: formType,
    name: payload.fullName,
    email: payload.email,
    phone: [payload.countrycode, payload.phone].filter(Boolean).join(" ") || payload.phone,
    message: payload.message,
    consent: true,
    consent_at: new Date().toISOString(),
    source_url: sourceUrl || payload.landingPage,
    payload, // full canonical CRM payload — the CRM reads this to reconstruct exactly
    status: "new",
  };

  const res = await fetchImpl(`${supabaseUrl}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase insert failed ${res.status}: ${text.slice(0, 200)}`);
  }
  const [saved] = await res.json();
  return { ok: true, id: saved.id, status: saved.status };
}
