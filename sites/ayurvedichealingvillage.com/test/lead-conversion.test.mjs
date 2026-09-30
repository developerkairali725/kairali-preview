/**
 * Candidate tests — WOPS-AHV-GO-LIVE-MEASUREMENT-PERFORMANCE-AUDIT-001.
 *
 * NOTHING here touches the network, Google Ads, WordPress or a lead store.
 * gtag is a spy, storage is a fake, and every response shape is taken from the
 * real contract in packages/forms/src/route-handler.ts — not invented.
 *
 * The behaviour under test is the one already required in the 27 Aug 2026
 * measurement plan: never fire because a URL was opened or reloaded; fire once
 * only after the server confirms an accepted lead; deduplicate by a unique
 * non-personal id; no personal data in the payload.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  acceptedLeadId,
  recordAcceptedLead,
  createSeenStore,
  FIRED,
  SKIPPED_DISABLED,
  SKIPPED_NO_CONSENT,
  SKIPPED_NOT_ACCEPTED,
  SKIPPED_DUPLICATE,
} from "../app/(english)/_families/lead-conversion.mjs";

const SEND_TO = "AW-972059125/fqrBCJvyugcQ9ePBzwM";

/** A gtag spy. No network, no tag, no Google. */
function spy() {
  const calls = [];
  const fn = (...args) => calls.push(args);
  fn.calls = calls;
  return fn;
}

/** In-memory Storage stand-in. */
function fakeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    _map: map,
  };
}

function env(overrides = {}) {
  return {
    config: { adsSendTo: SEND_TO },
    consent: () => "accepted",
    seen: createSeenStore(fakeStorage()),
    gtag: spy(),
    ...overrides,
  };
}

const accepted = (id = "lead_abc123") => ({ status: 201, body: { ok: true, id } });

// ---------------------------------------------------------------- acceptance

test("acceptance requires 201 AND ok:true AND a non-empty id", () => {
  assert.equal(acceptedLeadId(accepted("x1")), "x1");
  // The honeypot path: 200 + ok:true + NO id. A bot must never be a conversion.
  assert.equal(acceptedLeadId({ status: 200, body: { ok: true } }), null);
  assert.equal(acceptedLeadId({ status: 201, body: { ok: true } }), null);
  assert.equal(acceptedLeadId({ status: 201, body: { ok: true, id: "" } }), null);
  assert.equal(acceptedLeadId({ status: 201, body: { ok: true, id: "   " } }), null);
  assert.equal(acceptedLeadId({ status: 201, body: { ok: false, id: "x" } }), null);
  assert.equal(acceptedLeadId({ status: 200, body: { ok: true, id: "x" } }), null);
  assert.equal(acceptedLeadId(null), null);
});

// -------------------------------------------------------------------- success

test("SUCCESS: a confirmed accepted lead fires exactly one conversion", () => {
  const e = env();
  const r = recordAcceptedLead(accepted("lead_1"), e);
  assert.equal(r.outcome, FIRED);
  assert.equal(e.gtag.calls.length, 1);
  const [eventName, action, payload] = e.gtag.calls[0];
  assert.equal(eventName, "event");
  assert.equal(action, "conversion");
  assert.equal(payload.send_to, SEND_TO, "must use the EXISTING conversion action");
  assert.equal(payload.transaction_id, "lead_1", "dedup key is the lead id");
});

test("SUCCESS: the payload carries no personal data, only the correlation id", () => {
  const e = env();
  recordAcceptedLead(
    { status: 201, body: { ok: true, id: "lead_2", name: "A Patient", phone: "+91...", email: "a@b.c" } },
    e,
  );
  const payload = e.gtag.calls[0][2];
  assert.deepEqual(Object.keys(payload).sort(), ["send_to", "transaction_id"]);
  const serialised = JSON.stringify(payload);
  for (const leak of ["Patient", "+91", "a@b.c"]) {
    assert.ok(!serialised.includes(leak), `payload must not contain ${leak}`);
  }
});

// -------------------------------------------------------------------- failure

test("FAILURE: no conversion on 400, 422, 500 or the 503 staging guard", () => {
  for (const res of [
    { status: 400, body: { ok: false, error: "invalid body" } },
    { status: 422, body: { ok: false, error: "consent must be explicitly granted before storing a lead" } },
    { status: 500, body: { ok: false, error: "could not submit" } },
    { status: 503, body: { ok: false, staging: true, error: "not accepted here" } },
  ]) {
    const e = env();
    const r = recordAcceptedLead(res, e);
    assert.equal(r.outcome, SKIPPED_NOT_ACCEPTED, `status ${res.status}`);
    assert.equal(e.gtag.calls.length, 0, `status ${res.status} must dispatch nothing`);
  }
});

test("FAILURE: the honeypot's pretend-success never becomes a conversion", () => {
  const e = env();
  const r = recordAcceptedLead({ status: 200, body: { ok: true } }, e);
  assert.equal(r.outcome, SKIPPED_NOT_ACCEPTED);
  assert.equal(e.gtag.calls.length, 0);
});

// ------------------------------------------------- double-click / retry / refresh

test("DOUBLE-CLICK: the same lead id twice fires once", () => {
  const e = env();
  assert.equal(recordAcceptedLead(accepted("lead_3"), e).outcome, FIRED);
  assert.equal(recordAcceptedLead(accepted("lead_3"), e).outcome, SKIPPED_DUPLICATE);
  assert.equal(e.gtag.calls.length, 1);
});

test("RETRY: a genuine second enquiry with a NEW id does fire", () => {
  const e = env();
  recordAcceptedLead(accepted("lead_4"), e);
  assert.equal(recordAcceptedLead(accepted("lead_5"), e).outcome, FIRED);
  assert.equal(e.gtag.calls.length, 2);
});

test("REFRESH: dedup survives a page reload via persisted storage", () => {
  const storage = fakeStorage();
  const before = env({ seen: createSeenStore(storage) });
  assert.equal(recordAcceptedLead(accepted("lead_6"), before).outcome, FIRED);
  // New page view, new module instance, SAME browser storage.
  const after = env({ seen: createSeenStore(storage) });
  assert.equal(recordAcceptedLead(accepted("lead_6"), after).outcome, SKIPPED_DUPLICATE);
  assert.equal(after.gtag.calls.length, 0);
});

test("REFRESH: dedup still covers one page view when storage is unavailable", () => {
  // Private mode: createSeenStore(null) falls back to memory.
  const e = env({ seen: createSeenStore(null) });
  assert.equal(recordAcceptedLead(accepted("lead_7"), e).outcome, FIRED);
  assert.equal(recordAcceptedLead(accepted("lead_7"), e).outcome, SKIPPED_DUPLICATE);
  assert.equal(e.gtag.calls.length, 1);
});

// --------------------------------------------------- direct thank-you access

test("DIRECT THANK-YOU ACCESS: a page view can never produce a conversion", () => {
  // This is the defect being replaced. On the live site a bare GET of
  // /ppc-thanks/ dispatches the conversion. Here there is no page-view path at
  // all: the only entry point requires a handler response, and a navigation
  // supplies none.
  const e = env();
  for (const notAResponse of [undefined, null, {}, { status: 200, body: null }, { status: 200, body: "<html>" }]) {
    assert.equal(recordAcceptedLead(notAResponse, e).outcome, SKIPPED_NOT_ACCEPTED);
  }
  assert.equal(e.gtag.calls.length, 0);
});

// ------------------------------------------------------------------- consent

test("CONSENT REJECTED: an accepted lead does not dispatch", () => {
  const e = env({ consent: () => "declined" });
  const r = recordAcceptedLead(accepted("lead_8"), e);
  assert.equal(r.outcome, SKIPPED_NO_CONSENT);
  assert.equal(e.gtag.calls.length, 0);
});

test("CONSENT ABSENT: no stored choice does not dispatch", () => {
  const e = env({ consent: () => null });
  assert.equal(recordAcceptedLead(accepted("lead_9"), e).outcome, SKIPPED_NO_CONSENT);
  assert.equal(e.gtag.calls.length, 0);
});

test("CONSENT WITHDRAWN: read at fire time, so a later lead does not dispatch", () => {
  let choice = "accepted";
  const e = env({ consent: () => choice });
  assert.equal(recordAcceptedLead(accepted("lead_10"), e).outcome, FIRED);
  choice = "declined"; // visitor withdraws
  assert.equal(recordAcceptedLead(accepted("lead_11"), e).outcome, SKIPPED_NO_CONSENT);
  assert.equal(e.gtag.calls.length, 1, "only the pre-withdrawal lead dispatched");
});

test("CONSENT WITHDRAWN then RE-GRANTED: an already-counted lead is not re-counted", () => {
  let choice = "accepted";
  const e = env({ consent: () => choice });
  recordAcceptedLead(accepted("lead_12"), e);
  choice = "declined";
  recordAcceptedLead(accepted("lead_12"), e);
  choice = "accepted";
  assert.equal(recordAcceptedLead(accepted("lead_12"), e).outcome, SKIPPED_DUPLICATE);
  assert.equal(e.gtag.calls.length, 1);
});

// ------------------------------------------------------------ staging is inert

test("STAGING: with measurement off nothing dispatches even with consent", () => {
  const e = env({ config: undefined });
  const r = recordAcceptedLead(accepted("lead_13"), e);
  assert.equal(r.outcome, SKIPPED_DISABLED);
  assert.equal(e.gtag.calls.length, 0);
});

test("STAGING: with no gtag on the page nothing dispatches and nothing throws", () => {
  const e = env({ gtag: undefined });
  assert.equal(recordAcceptedLead(accepted("lead_14"), e).outcome, SKIPPED_DISABLED);
});

test("a dispatch failure leaves the lead eligible for a retry, not silently lost", () => {
  const throwing = () => {
    throw new Error("transport down");
  };
  const e = env({ gtag: throwing });
  assert.throws(() => recordAcceptedLead(accepted("lead_15"), e));
  // Not marked as seen, so a later attempt can still record it.
  const ok = env({ seen: e.seen });
  assert.equal(recordAcceptedLead(accepted("lead_15"), ok).outcome, FIRED);
});
