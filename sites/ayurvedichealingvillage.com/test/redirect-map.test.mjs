/**
 * Protection-map integrity — the twelve 301s the owner ruled on 2026-09-19.
 *
 * Registry gate `redirect-map-tests` (gates/registry.yaml) is status: planned —
 * its generated per-URL spec lands at M2. Under CLAUDE.md §10 (activation
 * semantics) a dormant gate still binds conduct, so this asserts what that gate
 * asks for on the artefact that exists today: every 301 hits its exact
 * single-hop target, no chains, no legacy URL outside the map, and nothing that
 * ranks is moved into a thin page.
 *
 * This is a STATIC assertion over the map and the route manifest — it needs no
 * server. The live-response half (301 + exact Location per URL) is asserted
 * against a running build; see docs/reports/2026-09-19-ahv-redirect-map.md.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const map = JSON.parse(readFileSync(join(SITE, "english-candidate/redirect-map.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(SITE, "english-candidate/route-manifest.json"), "utf8"));
const overrides = JSON.parse(readFileSync(join(SITE, "english-candidate/route-overrides.json"), "utf8"));

const sources = Object.keys(map.redirects);
const known = new Set(manifest.routes.map((r) => r.path));

test("the owner's ruling is carried in full — twelve routes, no more, no fewer", () => {
  assert.equal(sources.length, 12, `expected 12 redirects, found ${sources.length}`);
});

test("301, because that is what was asked for", () => {
  assert.equal(map.statusCode, 301);
});

test("every source is a real approved route, not a guess", () => {
  for (const s of sources) {
    assert.ok(known.has(s), `${s} is not in route-manifest.json — redirecting a path that never existed`);
  }
});

test("every target is a real approved route", () => {
  for (const [s, rule] of Object.entries(map.redirects)) {
    assert.ok(known.has(rule.to), `${s} -> ${rule.to}: the target is not an approved route`);
  }
});

test("no chains — a target is never itself a source", () => {
  for (const [s, rule] of Object.entries(map.redirects)) {
    assert.ok(!sources.includes(rule.to), `${s} -> ${rule.to} -> ... : that is two hops`);
  }
});

test("no route redirects to itself", () => {
  for (const [s, rule] of Object.entries(map.redirects)) {
    assert.notEqual(rule.to, s, `${s} redirects to itself`);
  }
});

test("source and target both carry the site's trailing slash", () => {
  for (const [s, rule] of Object.entries(map.redirects)) {
    assert.ok(s.startsWith("/") && s.endsWith("/"), `${s} is not trailing-slash normalised`);
    assert.ok(rule.to.startsWith("/") && rule.to.endsWith("/"), `${rule.to} is not trailing-slash normalised`);
  }
});

test("nothing that earns clicks is being redirected", () => {
  for (const [s, rule] of Object.entries(map.redirects)) {
    assert.equal(rule.gsc.clicks, 0, `${s} earns ${rule.gsc.clicks} clicks — redirecting it needs its own ruling`);
  }
});

test("every redirect carries a written reason", () => {
  for (const [s, rule] of Object.entries(map.redirects)) {
    assert.ok(typeof rule.reason === "string" && rule.reason.length > 30, `${s} has no real reason recorded`);
  }
});

test("a redirected route never also carries a conflicting canonical override", () => {
  for (const s of sources) {
    const o = overrides.routes[s];
    if (!o?.metadata?.canonical) continue;
    const canonicalPath = o.metadata.canonical.replace(/^https?:\/\/[^/]+/, "");
    assert.equal(
      canonicalPath,
      map.redirects[s].to,
      `${s}: canonical says ${canonicalPath} but the 301 goes to ${map.redirects[s].to} — two answers to one question`,
    );
  }
});

test("no legacy URL is left outside the map — the leftovers the audit named are all covered", () => {
  // The audit's list, docs/reports/2026-09-19-ahv-article-template-families-and-design-brief.md §7.
  const named = [
    "/test-page/", "/test-page-2/", "/testing/", "/gift-test/", "/my-account/",
    "/how-to-reach-old/", "/contact-us-old/", "/enquiry-form-old/",
    "/online-consultation-old/", "/cart/", "/checkout/", "/offers/new/",
  ];
  for (const n of named) {
    assert.ok(sources.includes(n), `${n} was named in the ruling but is not in the map`);
  }
});
