import test from "node:test";
import assert from "node:assert/strict";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_KEYS,
  DENIED_ALL,
  GRANTED_ALL,
  consentDefaultSnippet,
  storedConsentSnippet,
  choiceRecord,
  readStoredChoice,
  applyChoice,
} from "../src/core.js";

test("Consent Mode v2 keys present, incl. the two v2 additions", () => {
  assert.ok(CONSENT_KEYS.includes("ad_user_data"));
  assert.ok(CONSENT_KEYS.includes("ad_personalization"));
  assert.ok(CONSENT_KEYS.includes("ad_storage"));
  assert.ok(CONSENT_KEYS.includes("analytics_storage"));
});

test("default state: everything denied except security_storage", () => {
  assert.equal(DENIED_ALL.ad_storage, "denied");
  assert.equal(DENIED_ALL.ad_user_data, "denied");
  assert.equal(DENIED_ALL.ad_personalization, "denied");
  assert.equal(DENIED_ALL.analytics_storage, "denied");
  assert.equal(DENIED_ALL.security_storage, "granted");
  assert.ok(Object.values(GRANTED_ALL).every((v) => v === "granted"));
});

test("default snippet: gtag shim + consent default BEFORE any loader could run", () => {
  const s = consentDefaultSnippet();
  assert.ok(s.indexOf("dataLayer") < s.indexOf("consent"), "shim precedes consent call");
  assert.ok(s.includes(`'consent','default'`));
  assert.ok(s.includes(`"ad_user_data":"denied"`));
  assert.ok(s.includes("wait_for_update"));
});

test("stored snippet re-applies a saved choice and swallows malformed storage", () => {
  const s = storedConsentSnippet();
  assert.ok(s.includes(CONSENT_STORAGE_KEY));
  assert.ok(s.includes("'consent','update'"));
  assert.ok(s.startsWith("try{") && s.endsWith("}catch(e){}"));
});

test("choiceRecord + applyChoice round-trip through a fake storage/gtag", () => {
  const calls = [];
  const store = new Map();
  const storage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
  };
  const gtagFn = (...args) => calls.push(args);

  assert.equal(readStoredChoice(storage), null, "no choice yet");
  applyChoice(true, { storage, gtagFn });
  assert.deepEqual(calls[0], ["consent", "update", GRANTED_ALL]);
  const stored = readStoredChoice(storage);
  assert.equal(stored.granted, true);

  applyChoice(false, { storage, gtagFn });
  assert.deepEqual(calls[1], ["consent", "update", DENIED_ALL]);
  assert.equal(readStoredChoice(storage).granted, false);

  storage.setItem(CONSENT_STORAGE_KEY, "{corrupt");
  assert.equal(readStoredChoice(storage), null, "malformed = no choice (stay denied)");
});
