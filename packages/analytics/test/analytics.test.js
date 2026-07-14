import test from "node:test";
import assert from "node:assert/strict";
import {
  readIds,
  gtagSrc,
  ga4ConfigSnippet,
  gtmSnippet,
  ctaListenerSnippet,
} from "../src/core.js";

test("readIds: absent env = null IDs (never invented)", () => {
  assert.deepEqual(readIds({}), { ga4: null, gtm: null });
  assert.deepEqual(readIds({ NEXT_PUBLIC_GA4_ID: "  " }), { ga4: null, gtm: null });
});

test("readIds: shape-validates so a wrong secret never ships silently", () => {
  assert.deepEqual(readIds({ NEXT_PUBLIC_GA4_ID: "G-ABC123", NEXT_PUBLIC_GTM_ID: "GTM-XYZ9" }), {
    ga4: "G-ABC123",
    gtm: "GTM-XYZ9",
  });
  assert.throws(() => readIds({ NEXT_PUBLIC_GA4_ID: "UA-12345-1" }), /does not look like a GA4 id/);
  assert.throws(() => readIds({ NEXT_PUBLIC_GTM_ID: "G-ABC" }), /does not look like a GTM id/);
});

test("gtagSrc + ga4ConfigSnippet reference the given id only", () => {
  assert.equal(gtagSrc("G-ABC123"), "https://www.googletagmanager.com/gtag/js?id=G-ABC123");
  const s = ga4ConfigSnippet("G-ABC123");
  assert.ok(s.includes(`gtag('config',"G-ABC123")`));
  assert.ok(s.indexOf("dataLayer") < s.indexOf("config"), "shim precedes config");
});

test("gtmSnippet is the documented loader with the container id", () => {
  const s = gtmSnippet("GTM-XYZ9");
  assert.ok(s.includes("googletagmanager.com/gtm.js"));
  assert.ok(s.includes(`"GTM-XYZ9"`));
  assert.ok(s.includes("gtm.start"));
});

test("ctaListenerSnippet: data-cta delegation, guarded when gtag absent", () => {
  const s = ctaListenerSnippet();
  assert.ok(s.includes("closest?e.target.closest('[data-cta]')"));
  assert.ok(s.includes("window.gtag&&window.gtag('event'"));
  assert.ok(s.includes("capture:true"));
});
