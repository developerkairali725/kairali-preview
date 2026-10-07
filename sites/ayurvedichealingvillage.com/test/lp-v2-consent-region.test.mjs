import { test } from "node:test";
import assert from "node:assert/strict";
import { requiresConsent, geoConsentDefaultSnippet, CONSENT_COUNTRIES } from "../campaign-v2/kit/consent-region.ts";

test("EU/EEA/UK/CH require consent; IN, AE, US do not", () => {
  for (const cc of ["DE","FR","IT","IE","NO","IS","LI","GB","CH"]) assert.equal(requiresConsent(cc), true, cc);
  for (const cc of ["IN","AE","SA","US","SG","AU"]) assert.equal(requiresConsent(cc), false, cc);
  assert.equal(CONSENT_COUNTRIES.size, 32);
});

test("unknown country fails safe to consent required", () => {
  assert.equal(requiresConsent(null), true);
  assert.equal(requiresConsent(""), true);
  // Sentinel / malformed geo values must fail safe (banner shown)
  for (const cc of ["XX","ZZ","T1","A1","A2","AP","EU","O1","D","DEU","1A"]) assert.equal(requiresConsent(cc), true, cc);
  assert.equal(requiresConsent(" de "), true); // trimmed DE is EU
  assert.equal(requiresConsent("in"), false);
  assert.equal(requiresConsent("US"), false);
});

test("non-EU snippet honours stored denial; no </script; snippets parse", () => {
  const out = geoConsentDefaultSnippet(false);
  assert.match(out, /granted===false/);
  assert.match(out, /"ad_storage":"granted"/);
  for (const r of [false, true]) {
    const s = geoConsentDefaultSnippet(r);
    assert.ok(!/<\/script/i.test(s), "no </script");
    assert.ok(!s.includes("<"), "no raw <");
    assert.doesNotThrow(() => new Function(s));
    assert.match(s, /window\.gtag=window\.gtag\|\|function/);
  }
});

test("snippet sets default granted outside, denied inside, and honours a stored choice", () => {
  const out = geoConsentDefaultSnippet(false);
  assert.match(out, /'consent','default',\{[^}]*"ad_storage":"granted"/);
  const inside = geoConsentDefaultSnippet(true);
  assert.match(inside, /"ad_storage":"denied"/);
  assert.match(inside, /wait_for_update/);
  assert.match(inside, /kairali-consent-v1/);
});
