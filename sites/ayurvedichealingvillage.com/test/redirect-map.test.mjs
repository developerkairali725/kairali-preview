/**
 * Protection-map integrity — the twelve 301s the owner ruled on 2026-09-19, plus
 * the two legacy ad destinations he ruled on 2026-09-20 ("Build monsoon, 301 the
 * rest").
 *
 * The second ruling adds a class the first did not have: a source that is NOT in
 * route-manifest.json, because it was never in the rebuild. Three assertions below
 * are therefore split by class rather than relaxed — the `legacy: true` entries
 * must clear a bar the manifest routes do not even face (a recorded live status
 * and recorded Search Console numbers), because for them "this URL really exists"
 * cannot be read off the manifest and has to be measured.
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
import { peelTrainJ1Source } from "./fixtures/train-j1-20261015.mjs";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const map = JSON.parse(readFileSync(join(SITE, "english-candidate/redirect-map.json"), "utf8"));
// Train J batch 1 adds one owner-approved merge (AHV-M016.02, /the-baoli-special-deal/); every invariant below runs on
// the current map including it, and the ruling count is checked on the map with that exact recorded delta peeled
// (fixtures/train-j1-20261015.mjs), so the historical count stays as pinned.
const priorMap = JSON.parse(peelTrainJ1Source("english-candidate/redirect-map.json", readFileSync(join(SITE, "english-candidate/redirect-map.json"), "utf8")));
const manifest = JSON.parse(readFileSync(join(SITE, "english-candidate/route-manifest.json"), "utf8"));
const overrides = JSON.parse(readFileSync(join(SITE, "english-candidate/route-overrides.json"), "utf8"));

const sources = Object.keys(map.redirects);
const known = new Set([...manifest.routes.map((r) => r.path), ...JSON.parse(readFileSync(join(SITE, "campaign-v110/routes.json"), "utf8"))]);
const CONSOLIDATED_MERGES = {"/yoga-and-ayurveda/":"/archive-yoga-retreat/","/ayurveda-package/": "/ayurvedic-treatments/", "/packages/": "/ayurvedic-treatments/", "/treatment-programs/": "/ayurvedic-treatments/", "/ayurveda-training/": "/ayurveda-training-programme/", "/training-programs/": "/ayurveda-training-programme/", "/ayurveda-offers/": "/offers/", "/special-offers/": "/offers/", "/defence-and-paramilitary-forces/": "/offers/defence-and-paramilitary/", "/offers/defence-paramilitary-personnel-get-upto-30-off/": "/offers/defence-and-paramilitary/"};
const isLegacy = (s) => map.redirects[s].legacy === true;
const manifestSources = sources.filter((s) => !isLegacy(s));
const legacySources = sources.filter(isLegacy);

test("both rulings are carried in full — historical rulings, ten approved catalogue/offer/archive moves and two legacy destinations", () => {
  // 18 from the 19 Sep / 24 Sep rulings + /ayurveda-gallery/ (EF-21) + the six content-duplication merges, owner
  // rulings 28 Sep 2026. /prav-simona-yoga-retreat/ is NOT here: the owner kept both retreats (AHV-DUP-012).
  const priorManifest = Object.keys(priorMap.redirects).filter((s) => priorMap.redirects[s].legacy !== true);
  const priorLegacy = Object.keys(priorMap.redirects).filter((s) => priorMap.redirects[s].legacy === true);
  assert.equal(priorManifest.length, 27 + Object.keys(CONSOLIDATED_MERGES).length, `expected historical plus approved manifest redirects, found ${priorManifest.length}`);
  assert.equal(priorLegacy.length, 2, `expected 2 legacy redirects, found ${priorLegacy.length}`);
  assert.deepEqual(sources.filter((s) => !(s in priorMap.redirects)), ["/the-baoli-special-deal/"], "Train J1 adds exactly the Baoli merge");
  assert.equal(legacySources.length, 2, `expected 2 legacy redirects, found ${legacySources.length}`);
});

test("301, because that is what was asked for", () => {
  assert.equal(map.statusCode, 301);
});

test("every source is a real approved route, not a guess", () => {
  for (const s of manifestSources) {
    assert.ok(known.has(s), `${s} is not in route-manifest.json — redirecting a path that never existed`);
  }
});

test("a legacy source proves it existed by measurement, since the manifest cannot vouch for it", () => {
  for (const s of legacySources) {
    const rule = map.redirects[s];
    assert.ok(!known.has(s), `${s} is in the manifest — it is not a legacy destination, drop the flag`);
    assert.equal(typeof rule.liveStatus, "number", `${s}: no live status recorded, so nothing evidences the URL`);
    assert.ok([200, 404].includes(rule.liveStatus), `${s}: live status ${rule.liveStatus} is not one this ruling covered`);
    assert.equal(typeof rule.gsc.impressions, "number", `${s}: no Search Console impressions recorded`);
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

test("source and target are both site-absolute, and directory routes keep their trailing slash", () => {
  // The legacy estate is .html files, not directories; requiring a trailing slash
  // there would assert a shape the live URLs have never had.
  const normalised = (p) => p.startsWith("/") && (p.endsWith("/") || p.endsWith(".html"));
  for (const [s, rule] of Object.entries(map.redirects)) {
    assert.ok(normalised(s), `${s} is neither a trailing-slash route nor a .html legacy URL`);
    assert.ok(normalised(rule.to), `${rule.to} is neither a trailing-slash route nor a .html legacy URL`);
    if (!isLegacy(s)) assert.ok(s.endsWith("/"), `${s} is a manifest route and must be trailing-slash normalised`);
  }
});

const OWNER_MERGES = {
  "/privacy-policy/": "/new-privacy-policy/", "/privacy-statement/": "/new-privacy-policy/", "/enquiry-form/": "/contact-us/",
  "/ayurveda-training-programs/": "/ayurveda-training-programme/", "/our-story/": "/about-us/", "/things-to-do-in-property/": "/things-to-do/",
};

test("the owner's keep-both ruling holds — the two Prav/Simona retreats stay separate pages (AHV-DUP-012)", () => {
  assert.ok(!sources.includes("/prav-simona-yoga-retreat/"), "two separate back-to-back retreats: neither redirects");
  assert.ok(!sources.includes("/prav-simona-monsoon-yoga-retreat/"), "two separate back-to-back retreats: neither redirects");
});

test("the enquiry-form merge leaves no chain — the old duplicate goes straight to /contact-us/", () => {
  assert.equal(map.redirects["/enquiry-form-old/"].to, "/contact-us/");
});

test("original zero-click rulings and explicit owner consolidations are distinguished", () => {
  for (const [s, rule] of Object.entries(map.redirects)) {
    if (s === "/yoga-retreats/" || s === "/revitalizing-and-strengthening-treatment-for-cancer-patients/") {
      assert.equal(rule.to, s === "/yoga-retreats/" ? "/yoga-therapy-individual/" : "/revitalizing-and-strengthening/");
      assert.match(rule.ownerApproval, /approved as per search data; M005\/M009\/M010/);
      assert.match(rule.gsc.basis, /5 July–4 October 2026/);
      assert.equal(rule.gsc.clicks, s === "/yoga-retreats/" ? 0 : 6);
      continue;
    }
    if (CONSOLIDATED_MERGES[s]) {
      assert.equal(rule.to, CONSOLIDATED_MERGES[s]);
      assert.equal(rule.ownerApproval, "2026-10-07 consolidated release: MOVE-REVIEW-INVENTORY.json");
      assert.equal(rule.gsc.clicks, null, "historical measurements must not be represented as current proof");
      continue;
    }
    if (s.startsWith("/attractions-")) {
      assert.equal(rule.to, "/sightseeing/");
      assert.equal(rule.ownerApproval, "2026-09-24 explicit consolidation request");
      assert.equal(rule.gsc.clicks, null);
      assert.equal(rule.gsc.impressions, null);
      continue;
    }
    if (s === "/map/") {
      assert.equal(rule.to, "/how-to-reach/");
      assert.equal(rule.ownerApproval, "2026-09-24 explicit consolidation request");
      assert.equal(rule.gsc.clicks, null);
      continue;
    }
    if (s === "/ayurveda-gallery/") {
      // EF-21: the page earns clicks, so it moves only under its own recorded owner ruling — asserted, not assumed
      assert.equal(rule.to, "/treatments-gallery/");
      assert.equal(rule.ownerApproval, "2026-09-28 EF-21 owner selected option 1 (OWNER-DECISIONS-LATEST.md)");
      assert.equal(typeof rule.gsc.clicks, "number", "the measured clicks stay on record");
      continue;
    }
    if (OWNER_MERGES[s]) {
      // 28 Sep 2026 content-duplication decisions: some of these earn clicks, so each moves only under its recorded
      // owner ruling, to the exact destination the owner named
      assert.equal(rule.to, OWNER_MERGES[s]);
      assert.match(rule.ownerApproval, /^2026-09-28 owner content-duplication decisions \(IMPLEMENTATION-QUEUE\.json/);
      assert.equal(typeof rule.gsc.clicks, "number", "the measured clicks stay on record");
      continue;
    }
    if (s === "/founders-message/") {
      assert.equal(rule.to, "/about-us/");
      assert.equal(rule.ownerApproval, "2026-09-24 explicit consolidation request");
      assert.equal(rule.gsc.clicks, null);
      continue;
    }
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

test("the 2026-09-20 ruling is carried exactly — monsoon is built, the other two redirect", () => {
  // "Build monsoon, 301 the rest." So /karkidaka-…/ must be a ROUTE, not a redirect,
  // and the Russian LP must be a route too ("Keep it, build it") — asserting the
  // shape of the ruling, not just the half of it that lives in this file.
  assert.ok(!sources.includes("/karkidaka-chikitsha-or-monsoon-wellness.html"),
    "monsoon was ruled BUILD — it must not be in the redirect map");
  assert.ok(sources.includes("/deaddiction-treatment-program.html"), "de-addiction was ruled 301");
  assert.ok(sources.includes("/panchakarma-treatment.html"), "the panchakarma misspelling was ruled 301");
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
