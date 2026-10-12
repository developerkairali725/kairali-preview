// Weight performance repair (8 Oct 2026): the Weight snapshot and boot script ship in the server HTML once,
// not a second time in the Flight data inlined after it. Covers the slot store, the client boundary, and
// the design view's scoping and attribute parity. The built-page check (markup present in the HTML, absent
// from Flight, in all 13 locales) runs against the production build in the acceptance harness.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SSR_ONLY_HTML_ROUTES, putSsrOnlyHtml, readSsrOnlyHtml } from "../app/(english)/_families/ssr-only-html.mjs";

const VIEW = fs.readFileSync("app/(english)/_families/design-view.tsx", "utf8");
const SLOT = fs.readFileSync("app/(english)/_families/ssr-only-html-slot.tsx", "utf8");

test("server-only markup is scoped to Contact, Offers, Weight and the traced programme routes", () => {
  assert.deepEqual([...SSR_ONLY_HTML_ROUTES], ["/contact-us/", "/offers/", "/weight-loss-programme/", "/treatment-for-bronchial-diseases/", "/holistic-treatment-for-rejuvenation-and-detoxification/", "/treatment-for-hypertension/", "/treatment-for-paralysis/", "/treatment-for-skin-diseases/", "/karkidaka-chikitsha-or-monsoon-wellness.html", "/advanced-ayurveda-lifestyle-consultant-and-therapist-training-program-kerala-aalct-hv/"]);
});

test("slot store returns the stored markup and fails loudly when a slot is missing", () => {
  const html = '<div id="dc-root"><p>Weight</p></div>';
  assert.equal(putSsrOnlyHtml("test:/weight-loss-programme/:snapshot", html), "test:/weight-loss-programme/:snapshot");
  assert.equal(readSsrOnlyHtml("test:/weight-loss-programme/:snapshot"), html);
  // repeat reads return the same markup (a second server render must not get an empty page)
  assert.equal(readSsrOnlyHtml("test:/weight-loss-programme/:snapshot"), html);
  assert.equal(putSsrOnlyHtml("test:empty", ""), "test:empty");
  assert.equal(readSsrOnlyHtml("test:empty"), "");
  assert.throws(() => readSsrOnlyHtml("test:never-stored"), /missing for test:never-stored/);
  assert.throws(() => putSsrOnlyHtml("test:bad", undefined), TypeError);
});

test("client boundary renders the stored markup on the server and an empty string in the browser", () => {
  assert.match(SLOT, /^"use client";/);
  assert.match(SLOT, /const html = typeof window === "undefined" \? readSsrOnlyHtml\(slot\) : "";/);
  assert.match(SLOT, /suppressHydrationWarning: true, dangerouslySetInnerHTML: \{ __html: html \}/);
  // only the slot id and attributes cross Flight, never the markup itself
  assert.match(SLOT, /\{ as, slot, attrs \}: \{ as: "div" \| "script"; slot: string; attrs\?: Attrs \}/);
});

test("design view routes only the snapshot and boot through the boundary, on Weight only", () => {
  assert.match(VIEW, /const serverHtmlOnly = SSR_ONLY_HTML_ROUTES\.has\(route\.path\);/);
  assert.match(VIEW, /const slot = `\$\{locale\}:\$\{route\.path\}`;/);
  assert.match(VIEW, /<SsrOnlyHtml as="div" slot=\{putSsrOnlyHtml\(`\$\{slot\}:snapshot`, snapshot\)\} attrs=\{rootAttrs\} \/>/);
  assert.match(VIEW, /<div \{\.\.\.rootAttrs\} suppressHydrationWarning dangerouslySetInnerHTML=\{\{ __html: snapshot \}\} \/>/);
  assert.match(VIEW, /<SsrOnlyHtml as="script" slot=\{putSsrOnlyHtml\(`\$\{slot\}:boot`, bootScript\)\} \/>/);
  assert.match(VIEW, /<script dangerouslySetInnerHTML=\{\{ __html: bootScript \}\} \/>/);
  assert.equal((VIEW.match(/<SsrOnlyHtml /g) || []).length, 2);
  // route config, structured data and route styles keep their existing server rendering
  assert.match(VIEW, /id=\{ROUTE_CONFIG_ID\}/);
  assert.match(VIEW, /__html: jsonForScript\(cfg\)/);
  assert.match(VIEW, /<style data-ahv-route-styles="" dangerouslySetInnerHTML=\{\{ __html: routeStylesFor\(route\.path\) \}\} \/>/);
});

test("design root keeps every attribute in the same order on both paths", () => {
  const block = VIEW.slice(VIEW.indexOf("const rootAttrs = {"), VIEW.indexOf("};", VIEW.indexOf("const rootAttrs = {")));
  const keys = [...block.matchAll(/^\s+("?[\w-]+"?):/gm)].map((m) => m[1].replace(/"/g, ""));
  assert.deepEqual(keys, ["id", "role", "data-ahv-route", "data-ahv-locale", "data-ahv-family", "data-ahv-consistency", "data-ahv-snapshot-state", "data-ahv-bg-defer"]);
  assert.match(block, /id: DESIGN_ROOT_ID,/);
  assert.match(block, /"data-ahv-snapshot-state": snapshot \? "held" : undefined,/);
  assert.match(block, /"data-ahv-bg-defer": "",/);
});
