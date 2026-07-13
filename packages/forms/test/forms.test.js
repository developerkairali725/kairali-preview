import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPayload, trackingFromLocation, CRM_FIELDS, submitLead } from "../src/index.js";

test("payload contains only canonical fields, stringified", () => {
  const p = buildPayload({ fullName: "A", phone: 9876543210, email: "a@b.c", message: "m", rogue: "x" });
  assert.equal(p.phone, "9876543210");
  assert.ok(!("rogue" in p));
  for (const k of Object.keys(p)) assert.ok(CRM_FIELDS.includes(k));
});

test("tracking extraction from URL", () => {
  const t = trackingFromLocation("https://kairalitea.com/lp/monsoon?utm_source=google&utm_medium=cpc&gclid=abc", "https://google.com/");
  assert.equal(t.landingPage, "https://kairalitea.com/lp/monsoon");
  assert.equal(t.utm_source, "google");
  assert.equal(t.gclid, "abc");
  assert.equal(t.referrer, "https://google.com/");
});

test("submitLead requires endpoint and required fields", async () => {
  await assert.rejects(() => submitLead({ fullName: "A" }, { endpoint: "" }), /CRM_WEBHOOK_URL/);
  await assert.rejects(() => submitLead({ fullName: "A" }, { endpoint: "https://x", fetchImpl: async () => ({ ok: true, status: 200 }) }), /Missing required field/);
  const r = await submitLead(
    { fullName: "A", phone: "1", email: "a@b.c", message: "m" },
    { endpoint: "https://x", fetchImpl: async () => ({ ok: true, status: 200 }) }
  );
  assert.equal(r.ok, true);
});
