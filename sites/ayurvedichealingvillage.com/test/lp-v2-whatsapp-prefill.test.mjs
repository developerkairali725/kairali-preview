// AHV-WB.*.whatsapp-message (train-a batch 7): the live ad routes' pre-submit WhatsApp links open with a neutral
// message naming the page (campaign-v2/production/whatsapp.ts). The real Header, Footer and Enquiry are rendered
// (TypeScript transpile + react-dom/server) from the 24 routes' real configs (production/load.ts). Source only: this
// does not prove what the WhatsApp app or WhatsApp Web shows, or the public routes after release.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { htmlToDOM, Element } from "html-react-parser";
import ts from "typescript";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { WHATSAPP_HREF, WHATSAPP_PAGE_MESSAGE, whatsappHref, whatsappPageName } from "../campaign-v2/production/whatsapp.ts";
import { interactionForLink } from "../campaign-v2/production/interaction-map.ts";
import { channelLink } from "../campaign-v2/kit/handoff.ts";

const require = createRequire(import.meta.url);
import { reverseTrainBSource } from "./fixtures/train-b-20261015.mjs";
import { reverseTrainHSource } from "./fixtures/train-h-20261015.mjs";
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const delta = JSON.parse(read("test/fixtures/whatsapp-prefill-delta.json"));
const BARE = "https://wa.me/919289838797";
// ProductionPage.tsx productionRequest (a .tsx module node cannot import): the route language on the production surface.
const productionRequest = (c) => ({ locale: c.locales[0] ?? "en", dir: "ltr", currency: "INR", consentRequired: true, surface: "production" });
assert.match(read("campaign-v2/production/ProductionPage.tsx"), /export const productionRequest = \(c: CampaignConfig\): LpRequest => \(\{ \.\.\.PRODUCTION_REQUEST, locale: c\.locales\[0\] \?\? "en" \}\);/);
assert.match(read("campaign-v2/production/ProductionPage.tsx"), /PRODUCTION_REQUEST: LpRequest = \{ locale: "en", dir: "ltr", currency: "INR", consentRequired: true, surface: "production" \}/);

/** A section and its imports, transpiled and run (next/image as a plain <img>: links only are under test). */
function loadSection(rel) {
  const cache = new Map();
  const image = { __esModule: true, default: (p) => React.createElement("img", { src: p.src, alt: p.alt }), getImageProps: () => ({ props: {} }) };
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const mod = { exports: {} };
    cache.set(filename, mod);
    const js = ts.transpileModule(fs.readFileSync(filename, "utf8"), { fileName: filename, compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const req = (name) => {
      if (name === "next/image") return image;
      if (/\.css$/.test(name)) return {};
      if (!name.startsWith(".")) return require(name);
      const base = path.resolve(path.dirname(filename), name);
      const hit = [base, base + ".tsx", base + ".ts"].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
      assert.ok(hit, `resolve ${name} from ${filename}`);
      return load(hit);
    };
    vm.runInNewContext(js, { module: mod, exports: mod.exports, require: req, process }, { filename });
    return mod.exports;
  }
  return load(path.join(SITE, rel)).default;
}
const Header = loadSection("campaign-v2/sections/Header.tsx");
const Footer = loadSection("campaign-v2/sections/Footer.tsx");
const Enquiry = loadSection("campaign-v2/sections/interactive/Enquiry.tsx");

const all = (nodes, pred) => nodes.flatMap((n) => (n instanceof Element ? [...(pred(n) ? [n] : []), ...all(n.children, pred)] : []));
function waLinks(C, props) {
  const nodes = htmlToDOM(renderToStaticMarkup(React.createElement(C, props)));
  return all(nodes, (n) => n.name === "a" && /wa\.me\//.test(n.attribs.href || ""));
}
const expected = (c) => {
  const t = WHATSAPP_PAGE_MESSAGE[c.locales[0]];
  return t ? `${BARE}?text=${encodeURIComponent(t.replace("{page}", whatsappPageName(c)))}` : BARE;
};

test("all 24 live routes: header, enquiry and footer WhatsApp links carry the route's own page-context message", () => {
  assert.equal(PRODUCTION_SLUGS.length, 24);
  const seen = { en: 0, de: 0, ru: 0 };
  for (const slug of PRODUCTION_SLUGS) {
    const c = productionCampaign(slug), req = productionRequest(c), v = c.defaultVariant, p = { c, v, req };
    const links = [
      ...waLinks(Header, p).map((a) => ["header", a]), ...waLinks(Enquiry, p).map((a) => ["section", a]), ...waLinks(Footer, p).map((a) => ["footer", a]),
    ];
    assert.deepEqual(links.map(([pos]) => pos), ["header", "section", "footer"], slug);
    for (const [pos, a] of links) {
      assert.equal(a.attribs.href, expected(c), `${slug} ${pos}`);
      assert.equal(a.attribs.href, whatsappHref(c, req), `${slug} ${pos}`);
      assert.equal(a.attribs["data-track"], "cta_click", `${slug} ${pos}`);
      assert.equal(a.attribs["data-track-cta"], "whatsapp", `${slug} ${pos}`);
      assert.equal(a.attribs["data-track-position"], pos, `${slug} ${pos}`);
      assert.deepEqual(interactionForLink(a.attribs.href, false), ["contact_click", "whatsapp"], `${slug} ${pos}`);
    }
    seen[req.locale]++;
  }
  assert.deepEqual(seen, { en: 22, de: 1, ru: 1 });
});

test("the message is neutral: the page name only; no visitor data, digits, path, query or tracking value", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const c = productionCampaign(slug), href = whatsappHref(c, productionRequest(c));
    if (c.locales[0] === "ru") { assert.equal(href, BARE, "Russian keeps the bare link (no reviewed Russian message)"); continue; }
    if (c.locales[0] === "de") { assert.equal(href, BARE, "German keeps the bare link (AHV-WB.514 rejected: no accepted German message)"); continue; }
    const url = new URL(href);
    assert.equal(`${url.origin}${url.pathname}`, BARE, slug);
    assert.deepEqual([...url.searchParams.keys()], ["text"], slug);
    const text = url.searchParams.get("text");
    const name = whatsappPageName(c);
    assert.ok(name.length > 0 && !name.includes("|"), slug);
    assert.ok(c.seo.title.startsWith(name), `${slug}: the name is the route's own reviewed title`);
    assert.ok(text.includes(name), slug);
    assert.doesNotMatch(text, /\d|https?:|\/|utm|gclid|@|\?/i, slug);
    assert.doesNotMatch(text, /\b(cure|spa|resort|holiday|luxury|journey|guests?)\b/i, slug);
  }
  const de = productionCampaign("lp-behandlung-kerala");
  assert.equal(whatsappHref(de, productionRequest(de)), BARE, "AHV-WB.514 excluded: /lp/behandlung-in-kerala/ keeps the bare link");
  assert.deepEqual(Object.keys(WHATSAPP_PAGE_MESSAGE), ["en"], "only the reviewed English message exists");
  const en = productionCampaign("treatment-packages");
  assert.equal(new URL(whatsappHref(en, productionRequest(en))).searchParams.get("text"), "Hello, I would like to enquire about your “Ayurvedic Treatment Packages in Kerala” page.");
});

test("preview (non-production) surface and the post-submit reference handoff are unchanged", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const c = productionCampaign(slug), req = { ...productionRequest(c), surface: undefined }, p = { c, v: c.defaultVariant, req };
    assert.equal(whatsappHref(c, req), BARE, slug);
    for (const C of [Header, Enquiry, Footer]) for (const a of waLinks(C, p)) assert.equal(a.attribs.href, BARE, slug);
  }
  assert.equal(WHATSAPP_HREF, BARE);
  assert.equal(channelLink("whatsapp", "KT-7Q4MZ2"), "https://wa.me/919289838797?text=Hello%2C%20my%20enquiry%20reference%20is%20KT-7Q4MZ2");
  const form = read("campaign-v2/sections/interactive/EnquiryForm.tsx");
  assert.match(form, /const waHref = whatsappHref \?\? `https:\/\/wa\.me\/\$\{contact\.whatsapp\.number\}`;/);
  assert.match(read("campaign-v2/sections/interactive/Enquiry.tsx"), /\{\.\.\.\(production \? \{ production, ui: ui\.form, whatsappHref: wa \} : \{\}\)\}/);
});

test("EN chat choices: 'WhatsApp us' takes the page's own prefilled header link, and only that", () => {
  const src = read("public/design/review-chrome.js");
  const fn = src.slice(src.indexOf("  function campaignWhatsApp()"), src.indexOf("  // TF-18 (owner, 28 Sep 2026)"));
  assert.match(src, /priyaWidget\(\); campaignWhatsApp\(\); ctaBar\(\);/);
  const run = (ownHref) => {
    const choice = { href: BARE, getAttribute() { return this.href; }, setAttribute(_, v) { this.href = v; } };
    const own = ownHref ? { getAttribute: () => ownHref } : null;
    const ctx = { WA_HREF: BARE, document: { querySelector: (s) => (s === "#ahv-contact-controls .ahv-contact-wa" ? choice : null) },
      campaignRoot: { querySelector: (s) => (s === `a.lp-header__wa[href^="${BARE}?text="]` && ownHref && ownHref.startsWith(`${BARE}?text=`) ? own : null) } };
    vm.runInNewContext(fn + "\ncampaignWhatsApp();", ctx);
    return choice.href;
  };
  const c = productionCampaign("weight-management"), href = whatsappHref(c, productionRequest(c));
  assert.equal(run(href), href);
  assert.equal(run(null), BARE);
  assert.equal(run(BARE), BARE);
});

test("only the exact approved edits changed the six pinned files (reversal reproduces the base bytes)", () => {
  const digest = (s) => crypto.createHash("sha256").update(s).digest("hex");
  assert.equal(delta.base, "c54e2795e");
  for (const [file, edits] of Object.entries(delta.edits)) {
    // Train B (15 Oct 2026): later approved deltas (C02/C03 header Call prefix) are removed exactly first; Train H
    // (15 Oct 2026, AHV-WB.124: the Karkidaka route's own stay lengths in Enquiry.tsx) before them.
    let text = reverseTrainBSource(file, reverseTrainHSource(file, read(file)));
    for (const e of [...edits].reverse()) {
      assert.equal(text.split(e.to).length - 1, 1, `${file}: approved edit occurs exactly once`);
      text = text.replace(e.to, e.from);
    }
    assert.equal(digest(text), delta.baseHashes[file], file);
  }
  assert.deepEqual(Object.keys(delta.edits).sort(), [
    "campaign-v2/sections/Footer.tsx", "campaign-v2/sections/Header.tsx", "campaign-v2/sections/Hero.tsx",
    "campaign-v2/sections/interactive/Enquiry.tsx", "campaign-v2/sections/interactive/EnquiryForm.tsx", "public/design/review-chrome.js",
  ]);
});
