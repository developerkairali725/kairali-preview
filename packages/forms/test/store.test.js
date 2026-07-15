// Unit tests for the store-first path — CI-safe (mock fetch, no live Supabase).
// The live end-to-end insert is proven separately against real Supabase.
import { test } from "node:test";
import assert from "node:assert/strict";
import { storeLead } from "../src/store.js";

const ENV = { supabaseUrl: "https://x.supabase.co", serviceKey: "svc-key" };
const GOOD = { fullName: "Asha Menon", phone: "9876543210", countrycode: "+91", email: "asha@example.com", message: "Enquiry about panchakarma" };

function mockFetch(captured) {
  return async (url, opts) => {
    captured.url = url;
    captured.opts = opts;
    return { ok: true, status: 201, json: async () => [{ id: "uuid-123", status: "new" }] };
  };
}

test("storeLead writes the canonical row + jsonb payload + consent, returns id", async () => {
  const cap = {};
  const r = await storeLead(GOOD, { ...ENV, site: "kairalicenters.com", consent: true, sourceUrl: "https://kairalicenters.com/centres/kuwait", fetchImpl: mockFetch(cap) });
  assert.equal(r.ok, true);
  assert.equal(r.id, "uuid-123");
  const body = JSON.parse(cap.opts.body);
  assert.equal(body.site, "kairalicenters.com");
  assert.equal(body.name, "Asha Menon");
  assert.equal(body.phone, "+91 9876543210");
  assert.equal(body.consent, true);
  assert.ok(body.consent_at, "consent_at timestamp present");
  assert.equal(body.status, "new");
  assert.equal(body.payload.email, "asha@example.com"); // full CRM payload preserved
  assert.match(cap.url, /\/rest\/v1\/form_submissions$/);
  assert.equal(cap.opts.headers.apikey, "svc-key");
});

test("storeLead refuses to store without explicit consent", async () => {
  await assert.rejects(
    () => storeLead(GOOD, { ...ENV, site: "x.com", consent: false, fetchImpl: mockFetch({}) }),
    /consent must be explicitly granted/,
  );
});

test("storeLead enforces required fields", async () => {
  await assert.rejects(
    () => storeLead({ fullName: "A" }, { ...ENV, site: "x.com", consent: true, fetchImpl: mockFetch({}) }),
    /Missing required field/,
  );
});

test("storeLead requires site + credentials", async () => {
  await assert.rejects(() => storeLead(GOOD, { ...ENV, consent: true, fetchImpl: mockFetch({}) }), /site is required/);
  await assert.rejects(() => storeLead(GOOD, { site: "x.com", consent: true, fetchImpl: mockFetch({}) }), /not set/);
});
