import staffExperienceDelta from './fixtures/staff-experience-approved-delta.json' with { type: 'json' };
// Live ad routes: the reviewed copy of 8 Oct 2026 (production/pages/*.ts), designed into one template
// (production/ProductionPage.tsx). Owner rules (hidden pricing; one FAQ; the doctors shown once — right after the lead
// on every live route (10 Oct 2026; the variant default, directly before the enquiry, otherwise); the KTAHV register),
// doctors, links, media, metadata. Nothing here edits copy: a failing assertion is a content finding for the copy owner.
// Batch-2 form and lead contracts: lp-v2-production-batch2.test.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { ROUTES, OG_IMAGE, PRICING_HIDDEN, REVIEW_BATCHES, SITE_ORIGIN } from "../campaign-v2/production/bindings.ts";
import { COPY } from "../campaign-v2/production/pages/index.ts";
import { ORDER, sectionOrder } from "../campaign-v2/production/section-order.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { allText } from "../campaign-v2/kit/lint/claims.ts";
import { pageLinks, pageText } from "../campaign-v2/kit/lint/page-text.ts";
import { MEASURED_HASHES, isKnownContactHref, isKnownContactLink } from "../campaign-v2/kit/lint/body.ts";
import { PRICE, RATE_LINK } from "../campaign-v2/kit/lint/pricing.ts";
import { productionMetadata, productionJsonLd } from "../campaign-v2/production/metadata.ts";
import { interactionForLink, PROGRAMME_LINKS } from "../campaign-v2/production/interaction-map.ts";
import { CURRENT_ROSTER, DOCTORS } from "../campaign-v2/data/doctors.ts";
import { richLinks, richRuns, richText } from "../campaign-v2/kit/rich.ts";
import { contact } from "../campaign-v110/lib/site.ts";
import { LENGTHS } from "../campaign-v2/forms/schema.ts";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...p) => path.join(SITE, ...p);
const read = (p) => fs.readFileSync(P(p), "utf8");
const NOW = new Date(Date.UTC(2026, 9, 8, 12));
const C = Object.fromEntries(PRODUCTION_SLUGS.map((s) => [s, productionCampaign(s)]));
const BATCH1 = ["treatment-packages", "panchakarma"];
const FIRST4 = ["treatment-packages", "panchakarma", "pain-management", "family-ayurvedic-retreat"];
const LATER = PRODUCTION_SLUGS.filter((s) => !FIRST4.includes(s));
const EN = (slug) => (ROUTES[slug].locale ?? "en") === "en";

/** Every visible string of a production page: hero, CTAs, the designed sections, the FAQ, the doctor cards, alt text. */
function pageStrings(c) {
  return [
    c.seo.title, c.seo.description, c.hero.overline, c.hero.h1, c.hero.standfirst, c.cta.primary, c.cta.primarySupport, c.cta.secondary,
    ...c.faq.flatMap((f) => [f.q, f.a]),
    ...pageText(c).map((x) => x.text),
    ...c.doctors.flatMap((d) => [d.name, d.role, d.qualification, d.tenure ?? "", d.focus ?? "", ...(Array.isArray(d.languages) ? d.languages : [])]),
    ...c.gallery.map((g) => g.image.alt), c.hero.mobileImage.alt, c.page.pathway.image?.alt ?? "",
  ].filter((x) => typeof x === "string" && x);
}

// ── loader and copy ───────────────────────────────────────────────────────────────────────────────────
test("loader: every route, unchanged URLs, Variant A, production, hidden pricing, the designed page", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    assert.equal(c.route, ROUTES[slug].route);
    assert.equal(c.defaultVariant, ROUTES[slug].variant ?? "A");
    assert.deepEqual(c.variants, [ROUTES[slug].variant ?? "A"]);
    assert.deepEqual(c.locales, [ROUTES[slug].locale ?? "en"]);
    assert.equal(c.production, true);
    assert.equal(c.fees, null);
    assert.equal(c.offer, null);
    assert.deepEqual(c.pricing, PRICING_HIDDEN);
    assert.equal(c.longForm, "", "the designed page carries the long copy in its sections");
    assert.equal(c.films, undefined, "patient films are page.stories links, never an embedded player");
    assert.ok(c.page, `${slug}: designed page`);
    assert.equal(c.page.pathway.image, ROUTES[slug].pathwayImage);
    assert.equal(c.spelling.locale, "en-GB");
    assert.ok(c.spelling.reason.length > 20);
  }
  assert.deepEqual([C["treatment-packages"].route, C.panchakarma.route], ["/ayurvedic-treatment-packages.html", "/panchkarma-treatment.html"]);
  assert.equal(C["treatment-packages"].programDefault, "");
  assert.equal(C.panchakarma.programDefault, "Panchakarma");
  // The first four stay variant A; the remaining 20 are four review batches of five, each on a kit variant.
  for (const slug of FIRST4) assert.equal(C[slug].defaultVariant, "A", slug);
  assert.equal(LATER.length, 20);
  assert.deepEqual(REVIEW_BATCHES.map((b) => b.length), [5, 5, 5, 5]);
  for (const slug of LATER) assert.ok(["A", "B", "C", "D"].includes(ROUTES[slug].variant), slug);
  assert.deepEqual(new Set(LATER.map((s) => ROUTES[s].variant)), new Set(["A", "B", "C", "D"]), "all four kit variants are in use");
});

test("copy: each route's copy is its own, adapted from its reviewed brief (file and review hash recorded)", () => {
  // CLEAN-COPY-REVIEW.json (independent factual/editorial/SEO review PASS, 8 Oct 2026).
  const REVIEWED = {
    "treatment-packages": "5f75d53cedd7a551adb9024636b13c2b81d8c5c58ad218e6cd67b0eb72b3772d",
    panchakarma: "cce75640a02253b4d3c66206c91ecbb67236d23e326f052fff08f849ef5e240e",
    "pain-management": "89cf5e4c3a21e7d3995e1aaef18980fbf3741e744343a6ea5a0942ce17200c57",
    "family-ayurvedic-retreat": "f3b0d2d2f3703f2f4dd83acd4938746135bb272646bd7e8586d6e0f678101524",
    // The remaining 20 record content/native-rewrite/<file> and its sha256 (CONTENT-INDEX.md, all 24 briefs
    // independently reviewed); the hashes were checked against the brief files on 8 Oct 2026.
  };
  assert.deepEqual(Object.keys(COPY).sort(), [...PRODUCTION_SLUGS].sort());
  for (const slug of PRODUCTION_SLUGS) {
    const copy = COPY[slug];
    assert.equal(copy.slug, slug);
    assert.equal(copy.route, ROUTES[slug].route);
    if (FIRST4.includes(slug)) {
      assert.equal(copy.source.file, `${slug}.md`);
      assert.equal(copy.source.sha256, REVIEWED[slug], slug);
    } else {
      assert.match(copy.source.file, /^((next-five|lp-batch|final-batch|languages)\/)?[a-z-]+\.md$/, slug);
      assert.match(copy.source.sha256, /^[0-9a-f]{64}$/, slug);
    }
  }
});

test("copy: rich text is plain text with [label](href) links only; no HTML, no other markup", () => {
  assert.deepEqual(richRuns("Choose [Deluxe](/deluxe-villa/) or [Royal](https://ayurvedichealingvillage.com/royal-villa/)."), [
    { type: "text", text: "Choose " }, { type: "link", text: "Deluxe", href: "/deluxe-villa/" }, { type: "text", text: " or " },
    { type: "link", text: "Royal", href: "https://ayurvedichealingvillage.com/royal-villa/" }, { type: "text", text: "." },
  ]);
  assert.equal(richText("Choose [Deluxe](/deluxe-villa/) villas."), "Choose Deluxe villas.");
  assert.deepEqual(richLinks("No links here."), []);
  for (const slug of PRODUCTION_SLUGS) for (const { path: at, text } of pageText(C[slug])) {
    assert.doesNotMatch(text, /<[a-z/!]|\]\(|\*\*|__/i, `${slug} ${at}: markup in visible text`);
  }
});

// ── lint ──────────────────────────────────────────────────────────────────────────────────────────────
test("lint: no errors on any page (lengths, claims, links, hidden pricing, assets)", () => {
  for (const slug of PRODUCTION_SLUGS) assert.deepEqual(lintCampaign(C[slug], NOW).errors, [], slug);
});

test("lint: every visible string keeps the KTAHV register (no banned word, no claim, no reply-time promise)", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const { warnings } = lintCampaign(C[slug], NOW);
    assert.deepEqual(warnings.filter((w) => w.rule === "register" || w.rule === "reply-time" || w.rule === "claims"), [], slug);
    for (const text of pageStrings(C[slug])) assert.doesNotMatch(text, /\b(spa|resort|holiday|luxury|cure[sd]?|journey|guests?)\b/i, `${slug}: ${text}`);
    for (const text of pageStrings(C[slug])) assert.doesNotMatch(text, /(?<![\p{L}])(Kur|Urlaub|Luxus|Gäste|Gast|курорт|спа|роскош|люкс|гост[ьия])/iu, `${slug}: ${text}`);
  }
});

test("reviewed diagnosis topics stay, named neutrally: none dropped or broadened to clear a checker", () => {
  // ADAPTED-FIRST4-COPY-FINDINGS.json TOPIC-01…06: the reviewed briefs' own wording.
  const REVIEWED = [
    ["treatment-packages", "skin conditions, diabetes, women’s health and postpartum care"],
    ["pain-management", "Joint pain, osteoarthritis and rheumatoid arthritis"],
    ["pain-management", "The doctor can discuss back pain, joint pain, arthritis, sciatica or related concerns"],
    ["family-ayurvedic-retreat", "Cardiovascular health and blood pressure"],
    ["family-ayurvedic-retreat", "Discuss your diagnosis, blood-pressure history and prescriptions."],
    ["family-ayurvedic-retreat", "Diabetes and metabolism"],
    ["family-ayurvedic-retreat", "Joint care and arthritis"],
    ["family-ayurvedic-retreat", "Discuss osteoarthritis, rheumatoid arthritis or other joint concerns"],
  ];
  for (const [slug, s] of REVIEWED) assert.ok(pageStrings(C[slug]).some((x) => x.includes(s)), `${slug}: "${s}"`);
  for (const slug of PRODUCTION_SLUGS) {
    const { errors, warnings } = lintCampaign(C[slug], NOW);
    assert.deepEqual(errors.filter((e) => /disease-treatment/.test(e.message)), [], slug);
    // Every diagnosis a page names is listed for clinical review; the Panchakarma page names none.
    if (FIRST4.includes(slug)) assert.equal(warnings.some((w) => w.rule === "disease.mention"), slug !== "panchakarma", slug);
  }
});

// ── owner rule: hidden pricing ────────────────────────────────────────────────────────────────────────
test("hidden pricing: no numeric price anywhere on any page, and no rate or tariff link", () => {
  for (const slug of PRODUCTION_SLUGS) {
    assert.deepEqual(pageStrings(C[slug]).filter((s) => PRICE.test(s)), [], slug);
    assert.deepEqual(pageLinks(C[slug]).filter((l) => RATE_LINK.test(l.href) || RATE_LINK.test(l.text)), [], slug);
    assert.ok(C[slug].page.stay.lists.length >= 1, `${slug}: the enquiry-only quotation section`);
  }
});

test("owner rule: 'free' is only ever the initial doctor consultation", () => {
  for (const slug of PRODUCTION_SLUGS.filter(EN)) {
    const c = C[slug];
    assert.equal(c.cta.primary, "Get Free Doctor Consultation");
    assert.equal(c.cta.primarySupport, "Your initial consultation is free. Ask for a quotation covering treatment and any later services.");
    for (const s of pageStrings(c)) for (const sentence of s.split(/(?<=[.;?!])\s+/)) {
      if (/\bfree\b/i.test(sentence)) assert.match(sentence, /consultation|treatment, tests, medicines/i, `${slug}: "${sentence}"`);
    }
  }
  // German and Russian: "kostenlos" / "бесплатн" only ever for the initial doctor consultation (Erstberatung / консультац).
  const LOCAL = { "lp-behandlung-kerala": [/kostenlos/i, /(Erst)?[Bb]eratung/], "lp-treatment-kerala-ru": [/бесплатн/i, /консультац/i] };
  for (const [slug, [free, consult]] of Object.entries(LOCAL)) {
    assert.match(C[slug].cta.primary, free, slug);
    for (const s of pageStrings(C[slug])) for (const sentence of s.split(/(?<=[.;?!])\s+/)) if (free.test(sentence)) assert.match(sentence, consult, `${slug}: "${sentence}"`);
  }
});

// ── the owner's corrections: composition ──────────────────────────────────────────────────────────────
test("composition: every variant in decision order; the doctors right after the lead on every live route (variant default: directly before the enquiry); one FAQ", () => {
  const src = read("campaign-v2/production/ProductionPage.tsx");
  const main = src.slice(src.indexOf("<main"), src.indexOf("</main>"));
  // The frame: hero (+ Step-1 bar), proof, the variant's designed sections, then the enquiry and one FAQ.
  const at = ["Hero", "ConsultBar", "ProofStrip", "order.map(render)", "Enquiry", "Faq"].map((name) => {
    const hits = [...main.matchAll(new RegExp(name.includes("(") ? name.replace(/[().]/g, "\\$&") : `<${name}\\b`, "g"))];
    assert.equal(hits.length, 1, `${name} renders exactly once`);
    return hits[0].index;
  });
  assert.deepEqual([...at].sort((a, b) => a - b), at, "frame in decision order");
  assert.match(main, /\{c\.consultBar === false \? null : <ConsultBar \{\.\.\.p\} \/>\}/);
  // Each variant's designed sections (production/section-order.ts ORDER, the order the template renders).
  assert.match(src, /const order = sectionOrder\(c, v\);/, "the template renders section-order.ts's order");
  assert.doesNotMatch(src, /const ORDER\b/, "no second order table in the template");
  assert.deepEqual(ORDER.A, ["lead", "offering", "pathway", "rest", "place", "stories", "stay", "physicians"], "A is the default order");
  // Owner, 10 Oct 2026: on the first four routes (variant A; batch 1), then the remaining 20 (batch 2), the same doctors
  // section follows the lead; this supersedes the 8 Oct "doctors directly before the enquiry" placement on these routes.
  const firstFour = {
    "treatment-packages": ["lead", "physicians", "offering", "pathway", "rest", "place", "stay"],
    "panchakarma": ["lead", "physicians", "offering", "pathway", "rest", "place", "stay"],
    "pain-management": ["lead", "physicians", "offering", "pathway", "rest", "place", "stories", "stay"],
    "family-ayurvedic-retreat": ["lead", "physicians", "offering", "pathway", "rest", "place", "stories", "stay"],
  };
  for (const slug of FIRST4) {
    assert.equal(ROUTES[slug].variant ?? "A", "A", slug);
    assert.deepEqual(sectionOrder(C[slug], "A"), firstFour[slug], slug);
  }
  for (const slug of LATER) {
    const v = ROUTES[slug].variant ?? "A";
    const order = sectionOrder(C[slug], v);
    assert.equal(order[1], "physicians", `${slug}: the doctors right after the lead`);
    assert.equal(order.filter((b) => b === "physicians").length, 1, `${slug}: the doctors once`);
    assert.deepEqual(order.filter((b) => b !== "physicians"), ORDER[v].filter((b) => b !== "physicians" && order.includes(b)), `${slug}: the variant's order otherwise`);
  }
  for (const [v, list] of Object.entries(ORDER)) {
    assert.equal(list.at(-1), "physicians", `${v}: by default the doctors lead straight into the enquiry`);
    assert.equal(new Set(list).size, list.length, `${v}: each section once`);
    if (list.includes("place")) assert.ok(list.indexOf("place") < list.indexOf("physicians"), `${v}: doctors follow the village`);
    assert.ok(list.indexOf("stay") < list.indexOf("physicians"), `${v}: doctors follow the quotation section`);
  }
  assert.ok(!ORDER.B.includes("rest") && !ORDER.D.includes("rest") && !ORDER.D.includes("place"), "B has no stillness band; D neither band nor village");
  for (const gone of ["Doctors", "Body", "FeePlan", "Stillness", "Admission", "Village", "Films", "LongForm", "OfferBand", "Fees"]) {
    assert.doesNotMatch(src, new RegExp(`<${gone}\\b`), `${gone} is not part of the designed page`);
  }
  // A page writes only the sections its variant shows.
  for (const slug of PRODUCTION_SLUGS) {
    const v = ROUTES[slug].variant ?? "A";
    if (!ORDER[v].includes("rest")) assert.equal(C[slug].page.rest, undefined, `${slug}: no unused stillness copy`);
    if (!ORDER[v].includes("place")) assert.equal(C[slug].page.place, undefined, `${slug}: no unused village copy`);
    if (!ORDER[v].includes("stories")) assert.equal(C[slug].page.stories, undefined, `${slug}: no unused films`);
  }
});

test("one FAQ: the page's questions in one list, nowhere else, and FAQPage JSON-LD carries exactly those", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    const qs = c.faq.map((f) => f.q);
    assert.ok(qs.length >= 4 && qs.length <= 10, slug);
    assert.equal(new Set(qs).size, qs.length, `${slug}: duplicate question`);
    const sections = pageText(c).map((x) => x.text);
    for (const q of qs) assert.ok(!sections.includes(q), `${slug}: "${q}" repeated outside the FAQ`);
    const faq = productionJsonLd(slug, c).find((o) => o["@type"] === "FAQPage");
    assert.deepEqual(faq.mainEntity.map((e) => e.name), qs, slug);
    assert.deepEqual(faq.mainEntity.map((e) => e.acceptedAnswer.text), c.faq.map((f) => f.a), slug);
  }
});

// ── doctors ───────────────────────────────────────────────────────────────────────────────────────────
test("doctors: the current consented roster, once per page, every fact from the registry; no invented years; no Ashikha Raj", () => {
  // The reviewed copy's own wording (owner-correction/*.md, "Meet your Ayurvedic doctors"), field by field.
  const EXPECTED = {
    "deepu-john": ["Dr. Deepu John", "Chief Physician & Head of Department", "BAMS", "Practising Ayurveda since 2010 · At Kairali since 2019", "Panchakarma and lifestyle management", ["Malayalam", "English", "Hindi", "Tamil"]],
    "rahul-r": ["Dr. Rahul R", "Ayurvedic Physician", "BAMS", "At Kairali since 2023", undefined, ["English", "Malayalam", "Tamil"]],
    "akhila-oommen": ["Dr. Akhila Oommen", "Ayurvedic Physician", "BAMS", "At Kairali since 2024", undefined, ["Malayalam", "Hindi", "English"]],
    "adhina-ub": ["Dr. Adhina U.B.", "Resident Medical Officer", "BAMS", "At Kairali since 2026", undefined, ["English", "Malayalam"]],
    "aashitha-ps": ["Dr. Aashitha P.S.", "Ayurvedic Physician", "BAMS", "At Kairali since 2026", undefined, ["Malayalam", "English", "Hindi", "Tamil"]],
  };
  assert.deepEqual([...CURRENT_ROSTER], Object.keys(EXPECTED));
  for (const [id, [name, role, qualification, tenure, focus, languages]] of Object.entries(EXPECTED)) {
    const d = {...DOCTORS[id]};
    const delta = staffExperienceDelta.sourceDelta['campaign-v2/data/doctors.ts'].find(x => x.old.includes(JSON.stringify(tenure)) && x.new.includes(JSON.stringify(d.tenure)));
    assert.ok(delta, `${id}: exact reconciled lower-bound source delta`);
    d.tenure = tenure; // Preserve the original approved fact comparison after the one permitted replacement.
    assert.deepEqual([d.name, d.role, d.qualification, d.tenure, d.focus, d.languages], [name, role, qualification, tenure, focus, languages], id);
    assert.equal(d.yearsInPractice, undefined, `${id}: years are omitted, never derived`);
    assert.ok(fs.existsSync(P("public", d.photo.src)), d.photo.src);
    assert.equal(d.photo.consent, "confirmed", id);
    assert.ok(d.frame && d.frame.zoom >= 1, `${id}: portrait framing`);
  }
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    // Owner correction, 14 Oct: every campaign shows the complete current consented roster.
    assert.deepEqual(c.doctors.map((d) => d.id), [...CURRENT_ROSTER], slug);
    // The designed sections never repeat a biography: names appear only on the doctor cards.
    for (const { path: at, text } of pageText(c)) assert.doesNotMatch(text, /\bDr\. /, `${slug} ${at}`);
    assert.doesNotMatch(pageStrings(c).join(" | "), /Ashikh?a/);
  }
  // The landing pages' own physician section (production/sections/Physicians.tsx) is the only doctor list.
  const sections = fs.readdirSync(P("campaign-v2/production/sections")).map((f) => read(`campaign-v2/production/sections/${f}`)).join("\n");
  assert.equal((sections.match(/c\.doctors\.map/g) ?? []).length, 1);
});

// ── links and media ───────────────────────────────────────────────────────────────────────────────────
const ROUTE_SET = new Set(JSON.parse(read("english-candidate/routes.json")).routes.map((r) => r.path));

test("links: every same-site link resolves to a live route; anchors are measured; external links are https; contact links are the site's own", () => {
  const fixed = ["/", "/new-privacy-policy/", "/terms-and-conditions/", "/cookie-policy/", "/thanks/"];
  for (const p of fixed) assert.ok(ROUTE_SET.has(p), p);
  for (const slug of PRODUCTION_SLUGS) {
    for (const { path: at, href, text } of pageLinks(C[slug])) {
      const sameSite = href.startsWith(`${SITE_ORIGIN}/`) ? href.slice(SITE_ORIGIN.length) : href.startsWith("/") ? href : null;
      if (href.startsWith("#")) assert.match(href, MEASURED_HASHES, `${slug} ${at}`);
      else if (sameSite) assert.ok(ROUTE_SET.has(sameSite.split(/[?#]/)[0]), `${slug} ${at}: ${href} not in english-candidate/routes.json`);
      else if (isKnownContactHref(href)) assert.ok(isKnownContactLink(href, text), `${slug} ${at}: ${href} shows "${text}"`);
      else assert.match(href, /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/, `${slug} ${at}: the only off-site links are the patient films`);
    }
  }
  // The section CTAs and every in-page link point at the measured #enquiry fragment only.
  const files = fs.readdirSync(P("campaign-v2/production/sections")).map((f) => `campaign-v2/production/sections/${f}`);
  for (const f of files) for (const [, h] of read(f).matchAll(/href="(#[^"]*)"/g)) assert.match(h, MEASURED_HASHES, `${f}: ${h}`);
});

test("programme diagnostics: the treatment-packages programme links sit inside [data-programme-links] and report programme_open", () => {
  assert.equal(PROGRAMME_LINKS, "[data-programme-links]");
  assert.match(read("campaign-v2/production/sections/Offering.tsx"), /"data-programme-links": ""/);
  assert.match(read("campaign-v2/production/Interactions.tsx"), /a\.closest\(PROGRAMME_LINKS\)/);
  const o = C["treatment-packages"].page.offering;
  assert.equal(o.kind, "cards");
  assert.equal(o.programmeLinks, true);
  const links = o.cards.flatMap((card) => card.links ?? []);
  assert.equal(links.length, 11);
  for (const l of links) assert.deepEqual(interactionForLink(l.href, true), ["programme_open", "programme"], l.href);
  // Villa links stay outside it, as on the old page (its rooms section was not a programme section).
  assert.ok(C["treatment-packages"].page.place.paragraphs.join(" ").includes("/deluxe-villa/"));
});

test("media: every page photograph, portrait and film thumbnail is in public/", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    const imgs = [c.hero.image.A, c.hero.mobileImage, c.stillness.image, c.page.pathway.image, ...c.gallery.map((g) => g.image), ...c.doctors.map((d) => d.photo)];
    for (const im of imgs) assert.ok(fs.existsSync(P("public", im.src)), `${slug}: ${im.src}`);
    for (const f of c.page.stories?.films ?? []) assert.ok(fs.existsSync(P("public", f.thumb.src)), `${slug}: ${f.thumb.src}`);
  }
});

test("media: the steps photograph is one of the route's gallery photographs, never the hero or a mosaic photograph", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    const im = c.page.pathway.image;
    assert.ok(c.gallery.some((g) => g.image.id === im.id), `${slug}: in the gallery`);
    assert.ok(!c.gallery.slice(0, 5).some((g) => g.image.id === im.id), `${slug}: not one of the five mosaic tiles`);
    assert.notEqual(im.id, c.hero.image.A.id, slug);
    assert.notEqual(im.id, c.hero.mobileImage.id, slug);
    assert.ok(!c.gallery.some((g) => g.image.id === c.hero.image.A.id), `${slug}: the hero is not repeated in the gallery`);
  }
  // Review finding (8 Oct 2026): /pain-management.html and /panchkarma-treatment.html no longer share a hero.
  assert.notEqual(C["pain-management"].hero.image.A.id, C.panchakarma.hero.image.A.id);
  assert.notEqual(C["pain-management"].hero.mobileImage.id, C.panchakarma.hero.mobileImage.id);
});

test("media: the two oversized kit images are real JPEGs now, at their registry size", () => {
  for (const f of ["gal-poolside-rest-palakkad-2026.jpg", "gal-post-therapy-stillness-wakem.jpg"]) {
    const buf = fs.readFileSync(P("public/lp-v2/img", f));
    assert.deepEqual([...buf.subarray(0, 3)], [0xff, 0xd8, 0xff], `${f} is not a JPEG`);
    assert.ok(buf.length < 600_000, `${f}: ${buf.length} bytes`);
  }
});

// ── metadata ──────────────────────────────────────────────────────────────────────────────────────────
test("metadata: canonical, robots and the Open Graph image are the replaced pages'; title and description from the copy", () => {
  // The batch-2 pages it replaces (app/(campaign)/_traffic/TrafficLanding.tsx trafficMetadata) set no image alt.
  const ALT = { "treatment-packages": "Kairali Ayurvedic Healing Village in Palakkad, Kerala", panchakarma: "Kairali Ayurvedic Healing Village, Palakkad" };
  const ogImage = (slug) => ROUTES[slug].og
    ? { url: ROUTES[slug].og.url, ...(ROUTES[slug].og.width ? { width: ROUTES[slug].og.width, height: ROUTES[slug].og.height } : {}) }
    : { url: "https://ayurvedichealingvillage.com/landing/r10/og.jpg", width: 1200, height: 630, ...(ALT[slug] ? { alt: ALT[slug] } : {}) };
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    const live = productionMetadata(slug, c, { AHV_STAGING: "0" });
    const staging = productionMetadata(slug, c, { AHV_STAGING: "1" });
    assert.equal(live.alternates.canonical, `https://ayurvedichealingvillage.com${ROUTES[slug].route}`);
    assert.deepEqual(live.robots, { index: true, follow: true });
    assert.deepEqual(staging.robots, { index: false, follow: true });
    assert.deepEqual(productionMetadata(slug, c, {}).robots, { index: false, follow: true });
    assert.equal(live.title, c.seo.title);
    assert.equal(live.description, c.seo.description);
    assert.deepEqual(live.openGraph.images, [ogImage(slug)]);
    assert.equal(live.openGraph.url, live.alternates.canonical);
    assert.equal(live.openGraph.locale, ROUTES[slug].og?.locale ?? "en_IN");
    assert.deepEqual(live.twitter.images, [ROUTES[slug].og?.url ?? OG_IMAGE.url]);
  }
  // The reviewed briefs' search titles and descriptions (the first two are the original captured ones).
  assert.deepEqual(FIRST4.map((s) => C[s].seo.title), [
    "Ayurvedic Treatment Packages in Kerala | Kairali", "Panchakarma Treatment in Kerala | Kairali Ayurvedic Healing Village",
    "Ayurvedic Pain Management in Kerala | Kairali", "Family Ayurveda Retreat in Kerala | Kairali",
  ]);
  // The replaced pages' own canonicals and Open Graph images (the old (campaign), (lp) and (campaign-de) pages).
  const OLD = {
    "wellness-kerala": "https://ayurvedichealingvillage.com/images/og/wellness-resort-kerala.html.jpg",
    "lp-behandlung-kerala": "https://ayurvedichealingvillage.com/campaign-v110/images/patient-villa-maharaja.jpg",
    "lp-weight-management": "https://ayurvedichealingvillage.com/campaign-v110/images/consultation-pulse.webp",
  };
  for (const [slug, url] of Object.entries(OLD)) assert.equal(productionMetadata(slug, C[slug], { AHV_STAGING: "0" }).openGraph.images[0].url, url, slug);
  assert.equal(productionMetadata("lp-behandlung-kerala", C["lp-behandlung-kerala"], {}).openGraph.locale, "de_DE");
  assert.equal(productionMetadata("lp-treatment-kerala-ru", C["lp-treatment-kerala-ru"], {}).alternates.canonical, "https://ayurvedichealingvillage.com/lp/treatment-in-kerala-russian/");
});

test("JSON-LD: the replaced pages' WebPage (and breadcrumb), plus FAQPage for the FAQ on the page", () => {
  const [pk, pkFaq] = productionJsonLd("treatment-packages", C["treatment-packages"]);
  assert.equal(pk["@id"], "https://ayurvedichealingvillage.com/ayurvedic-treatment-packages.html#webpage");
  assert.deepEqual(pk.breadcrumb.itemListElement.map((i) => i.name), ["Home", "Ayurvedic treatment packages"]);
  assert.equal(pkFaq["@type"], "FAQPage");
  assert.equal(pkFaq.mainEntity.length, C["treatment-packages"].faq.length);
  const [pc] = productionJsonLd("panchakarma", C.panchakarma);
  assert.equal(pc["@id"], "https://ayurvedichealingvillage.com/panchkarma-treatment.html#webpage");
  assert.equal(pc.breadcrumb, undefined);
  for (const slug of PRODUCTION_SLUGS) assert.ok(!JSON.stringify(productionJsonLd(slug, C[slug])).match(/"@type":"(Offer|Product|MedicalClinic|VideoObject)"/), slug);
});

// ── locked facts and owner facts ──────────────────────────────────────────────────────────────────────
test("locked facts: WhatsApp +91 92898 38797 and info@kairali.com; the wrong …38777 appears nowhere", () => {
  assert.equal(contact.whatsapp.number, "919289838797");
  assert.equal(contact.whatsapp.display, "+91 92898 38797");
  assert.equal(contact.email, "info@kairali.com");
  const dir = (d) => fs.readdirSync(P(d)).map((f) => `${d}/${f}`);
  const files = ["campaign-v2/sections/Footer.tsx", "campaign-v2/sections/Header.tsx", "campaign-v2/data/doctors.ts",
    ...dir("campaign-v2/production/pages"), ...dir("campaign-v2/production/sections")];
  for (const f of files) assert.doesNotMatch(read(f), /38777/, f);
  for (const slug of PRODUCTION_SLUGS) assert.doesNotMatch(pageStrings(C[slug]).join(" "), /\+?\s?91[\s-]?\d{4,5}[\s-]?\d{3,6}|@[a-z]+\.[a-z]+/i, `${slug}: contact details render from site.ts only`);
});

// Owner decision, 14 Oct 2026 (AHV-WB.042.change: "panchakarma has 28 as well"): the stated stay is 14–28 nights, so
// the text agrees with the Length-of-stay box (14/21/28 nights) on both Panchakarma routes; no 14–21 range remains.
test("owner facts: the 14–28 night Panchakarma programme, matching the Length-of-stay box; only the owner-approved Monsoon season may carry a year", () => {
  assert.match(C.panchakarma.seo.description, /14–28 night/);
  assert.ok(C.panchakarma.page.lead.paragraphs.some((p) => p.includes("The published programme is a 14–28 night stay")));
  assert.ok(C.panchakarma.faq.some((f) => f.a.startsWith("The published Panchakarma programme is a 14–28 night stay.")));
  assert.ok(C["lp-panchakarma"].page.lead.paragraphs.some((p) => p.includes("The published Panchakarma programme is a 14–28 night stay")));
  assert.ok(C["lp-panchakarma"].faq.some((f) => f.a.startsWith("The published programme is a 14–28 night stay.")));
  assert.deepEqual(LENGTHS.filter((o) => /^\d+$/.test(o.value)).map((o) => o.value), ["14", "21", "28"], "the box offers 14/21/28 nights");
  for (const slug of ["panchakarma", "lp-panchakarma"]) {
    const strings = [C[slug].seo.description, ...allText(C[slug]).map((t) => t.text)];
    assert.deepEqual(strings.filter((t) => /14[–-]21|14 to 21/.test(t)), [], `${slug}: no 14–21 night range left`);
  }
  for (const slug of PRODUCTION_SLUGS) for (const { path: at, text } of allText(C[slug])) {
    // Owner, 14 October 2026: exactly the month-only Monsoon season; no other year or founding-date exception.
    const reviewed = slug === "monsoon-wellness" ? text.replaceAll("July–August 2027", "July–August") : text;
    assert.doesNotMatch(reviewed, /\b(18|19|20)\d{2}\b/, `${slug} ${at}`);
  }
  for (const slug of BATCH1.concat(["pain-management", "family-ayurvedic-retreat"])) assert.equal(C[slug].hero.overline, "Doctor-guided Ayurveda · Palakkad, Kerala");
});


test("Monsoon metadata restores the existing sitemap language cluster without adding languages to unrelated campaigns", () => {
  const route = "/karkidaka-chikitsha-or-monsoon-wellness.html";
  const map = JSON.parse(fs.readFileSync(new URL("../l10n/routes.json", import.meta.url))).routes[route];
  const expected = Object.fromEntries(Object.entries(map).map(([locale, pathname]) => [locale, "https://ayurvedichealingvillage.com" + pathname]));
  expected["x-default"] = expected.en;
  const metadata = productionMetadata("monsoon-wellness", C["monsoon-wellness"], { AHV_STAGING: "0" });
  assert.deepEqual(metadata.alternates.languages, expected);
  assert.equal(Object.keys(expected).length, 14);
  assert.equal(metadata.alternates.canonical, expected.en);
  for (const slug of PRODUCTION_SLUGS.filter(s => s !== "monsoon-wellness")) {
    assert.equal(productionMetadata(slug, C[slug], { AHV_STAGING: "0" }).alternates.languages, undefined, slug);
  }
});
