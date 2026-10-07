// Live ad routes, batch 1: the content worker's frozen copy, rendered faithfully. Provenance (SHA-256), the
// owner rules (hidden pricing; >=95% of the useful source copy, measured), the structured body (links, tables,
// videos, photographs, attributed quotes), doctors, links, media, metadata. Nothing here edits copy: a failing
// assertion is a content finding for the copy owner.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { productionCampaign, PRODUCTION_SLUGS, archivalLongFormWords } from "../campaign-v2/production/load.ts";
import { ROUTES, OG_IMAGE, PRICING_HIDDEN, SOURCE_PRESERVATION } from "../campaign-v2/production/bindings.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { allText, bodyText } from "../campaign-v2/kit/lint/claims.ts";
import { bodyLinks, MEASURED_HASHES } from "../campaign-v2/kit/lint/body.ts";
import { PRICE, RATE_LINK } from "../campaign-v2/kit/lint/pricing.ts";
import { inlineText, renderedTexts } from "../campaign-v2/production/body-model.ts";
import { productionMetadata, productionJsonLd } from "../campaign-v2/production/metadata.ts";
import { parseMarkdown } from "../campaign-v2/sections/markdown.ts";
import { contact } from "../campaign-v110/lib/site.ts";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...p) => path.join(SITE, ...p);
const read = (p) => fs.readFileSync(P(p), "utf8");
const NOW = new Date(Date.UTC(2026, 9, 7, 12));
const C = Object.fromEntries(PRODUCTION_SLUGS.map((s) => [s, productionCampaign(s)]));
const blocksOf = (c) => [...c.body.sections.flatMap((s) => s.blocks), ...c.body.closing];

/** Every visible string of a production page (authored copy, doctor cards, the source body as rendered). */
function pageStrings(c) {
  const t = [
    c.hero.overline, c.hero.h1, c.hero.standfirst, c.admission.heading, ...c.admission.steps.flatMap((s) => [s.title, s.body]),
    ...c.included, ...c.chargedSeparately, c.stillness.heading, c.stillness.body, c.village.heading, c.village.body,
    ...c.faq.flatMap((f) => [f.q, f.a]), c.feePresentation.heading, c.feePresentation.body, c.feePresentation.cta,
    c.cta.primary, c.cta.primarySupport, c.cta.secondary,
    ...c.doctors.flatMap((d) => [d.name, d.role, d.qualification, d.tenure ?? "", d.focus ?? "", ...(Array.isArray(d.languages) ? d.languages : [])]),
    ...c.gallery.map((g) => g.image.alt), c.hero.mobileImage.alt,
  ];
  for (const b of parseMarkdown(c.body.intro.join("\n\n"))) t.push(...(b.type === "ul" ? b.items : [b.text]));
  for (const b of blocksOf(c)) {
    t.push(...renderedTexts(b));
    if (b.type === "programme" && b.sanskrit) t.push(`${b.label} ${b.sanskrit}`); // one list item on the page
    if (b.type === "image") t.push(b.alt);
  }
  return t.filter((x) => typeof x === "string" && x);
}
const norm = (s) => s.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[^\p{L}\p{N}'%₹ -]+/gu, " ").replace(/\s+/g, " ").trim();

// ── provenance ────────────────────────────────────────────────────────────────────────────────────────
test("provenance: the copy and the disposition records are the content worker's frozen files (SHA-256)", () => {
  const manifest = JSON.parse(read("campaign-v2/production/content/SOURCES.json"));
  for (const [file, rec] of Object.entries(manifest.files)) {
    const sha = crypto.createHash("sha256").update(fs.readFileSync(P("campaign-v2/production/content", file))).digest("hex");
    assert.equal(sha, rec.sha256, file);
  }
  assert.deepEqual(Object.keys(manifest.files).sort(), ["panchakarma.disposition.json", "panchakarma.json", "treatment-packages.disposition.json", "treatment-packages.json"]);
});

test("loader: both routes, unchanged URLs, Variant A, production, hidden pricing, no archival longForm", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    assert.equal(c.route, ROUTES[slug].route);
    assert.equal(c.defaultVariant, "A");
    assert.deepEqual(c.variants, ["A"]);
    assert.equal(c.production, true);
    assert.equal(c.fees, null);
    assert.equal(c.offer, null);
    assert.deepEqual(c.pricing, PRICING_HIDDEN);
    assert.equal(c.feePresentation.mode, "enquiry-only");
    assert.equal(c.longForm, "", "the superseded longForm is never rendered");
    assert.deepEqual(c.sourcePreservation, SOURCE_PRESERVATION);
    assert.equal(c.spelling.locale, "en-GB");
    assert.ok(c.spelling.reason.length > 20);
    assert.equal(c.films, undefined, "films live in the source body");
  }
  assert.deepEqual([C["treatment-packages"].route, C.panchakarma.route], ["/ayurvedic-treatment-packages.html", "/panchkarma-treatment.html"]);
  assert.equal(C["treatment-packages"].programDefault, "");
  assert.equal(C.panchakarma.programDefault, "Panchakarma");
});

test("no truncation: the archival long form exceeds the kit's 1200-word cap, and the preserved body renders in full", () => {
  for (const slug of PRODUCTION_SLUGS) {
    assert.ok(archivalLongFormWords(slug) > 1200, `${slug}: ${archivalLongFormWords(slug)}`);
    const words = bodyText(C[slug]).reduce((n, x) => n + x.text.trim().split(/\s+/).length, 0);
    assert.ok(words > 1200, `${slug}: body renders ${words} words`);
  }
  assert.deepEqual(PRODUCTION_SLUGS.map(archivalLongFormWords), [1354, 1676]);
});

// ── lint ──────────────────────────────────────────────────────────────────────────────────────────────
test("lint: no errors on either page apart from hidden-pricing findings (asserted separately below)", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const { errors } = lintCampaign(C[slug], NOW);
    assert.deepEqual(errors.filter((e) => !e.rule.startsWith("price.")), [], slug);
  }
});

test("lint: authored copy keeps the KTAHV register (no banned word, no claim); preserved-source findings are listed, not hidden", (t) => {
  for (const slug of PRODUCTION_SLUGS) {
    const { warnings } = lintCampaign(C[slug], NOW);
    assert.deepEqual(warnings.filter((w) => w.rule === "register" || w.rule === "reply-time" || w.rule === "claims"), [], slug);
    for (const w of warnings.filter((w) => w.rule.endsWith(".preservedSource"))) t.diagnostic(`${slug} ${w.rule} ${w.path}: ${w.message}`);
    for (const { path, text } of allText(C[slug])) assert.doesNotMatch(text, /\b(spa|resort|holiday|luxury|cure[sd]?|journey|guests?)\b/i, `${slug} ${path}`);
  }
});

// ── owner rule: hidden pricing ────────────────────────────────────────────────────────────────────────
test("hidden pricing: no numeric price anywhere on either page", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const leaks = pageStrings(C[slug]).filter((s) => PRICE.test(s));
    assert.deepEqual(leaks, [], slug);
    assert.deepEqual(lintCampaign(C[slug], NOW).errors.filter((e) => e.rule === "price.leak"), [], slug);
  }
});

test("hidden pricing: no rate or tariff link on either page (content finding: needs the copy owner's decision)", () => {
  const found = PRODUCTION_SLUGS.flatMap((slug) => bodyLinks(C[slug])
    .filter((l) => RATE_LINK.test(l.href) || RATE_LINK.test(l.text))
    .map((l) => `${slug} ${l.path}: "${l.text}" -> ${l.href}`));
  assert.deepEqual(found, []);
});

// ── owner rule: >=95% of the useful source copy ───────────────────────────────────────────────────────
test("source preservation: >=95% of the useful words of the live page render (baseline: the content worker's line disposition)", (t) => {
  for (const slug of PRODUCTION_SLUGS) {
    const corpus = ` ${pageStrings(C[slug]).map(norm).join(" | ")} `;
    const d = JSON.parse(read(`campaign-v2/production/content/${slug}.disposition.json`));
    let useful = 0, rendered = 0;
    const missing = [];
    const omitted = {};
    for (const m of d.mapping) {
      if (m.action === "omit") { omitted[m.reason] = (omitted[m.reason] ?? 0) + 1; continue; }
      const text = m.action === "replace" ? m.output : m.source;
      const n = norm(text);
      if (!n) continue;
      const w = n.split(" ").length;
      useful += w;
      if (corpus.includes(` ${n} `) || corpus.includes(n)) rendered += w;
      else missing.push(`line ${m.line} (${m.action}): ${text}`);
    }
    const ratio = rendered / useful;
    t.diagnostic(`${slug}: ${rendered}/${useful} useful words rendered = ${(ratio * 100).toFixed(2)}% (floor ${SOURCE_PRESERVATION.minRetention * 100}%)`);
    for (const [reason, n] of Object.entries(omitted)) t.diagnostic(`${slug}: omitted by the content worker, ${n} line(s): ${reason}`);
    for (const m of missing) t.diagnostic(`${slug}: not rendered: ${m}`);
    assert.ok(ratio >= SOURCE_PRESERVATION.minRetention, `${slug}: ${(ratio * 100).toFixed(2)}%`);
    // omissions are only the recorded owner/UI categories
    for (const reason of Object.keys(omitted)) assert.match(reason, /owner PPC06|repeated UI|numerical proof-strip/, reason);
  }
});

test("structured body: inline runs render exactly their text (adjacent tokens joined by one space)", () => {
  for (const slug of PRODUCTION_SLUGS) for (const b of blocksOf(C[slug])) {
    if ((b.type === "h2" || b.type === "h3" || b.type === "p") && b.inline) assert.equal(inlineText(b.inline), b.text, `${slug}: ${b.text}`);
  }
  const nabh = blocksOf(C.panchakarma).find((b) => b.type === "p" && b.inline?.length === 2 && b.inline[0].text === "NABH accredited");
  assert.equal(inlineText(nabh.inline), "NABH accredited Ayurvedic hospital");
});

test("structured body: programmes, tables, rooms, videos, photographs, doctors and quotes as reviewed", () => {
  const count = (slug, type) => blocksOf(C[slug]).filter((b) => b.type === type).length;
  assert.equal(count("treatment-packages", "programme"), 31);
  assert.equal(C["treatment-packages"].body.sections.find((s) => s.sourceSection === "section-1").blocks.filter((b) => b.type === "programme").length, 27);
  assert.equal(C["treatment-packages"].body.sections.find((s) => s.sourceSection === "section-6").blocks.filter((b) => b.type === "programme").length, 4);
  assert.ok(blocksOf(C["treatment-packages"]).filter((b) => b.type === "programme").every((b) => b.href.startsWith("/") && b.sanskrit));
  assert.equal(count("treatment-packages", "table"), 2);
  for (const tb of blocksOf(C["treatment-packages"]).filter((b) => b.type === "table")) assert.ok(tb.rows.every((r) => r.length === tb.headers.length));
  const rooms = bodyLinks(C["treatment-packages"]).filter((l) => /villa|suite/i.test(l.href)).map((l) => l.href);
  assert.deepEqual(rooms, ["/deluxe-villa/", "/classic-villa/", "/royal-villa/", "/maharaja-suite/"]);
  assert.equal(count("treatment-packages", "videoLink") + count("panchakarma", "videoLink"), 10);
  assert.equal(count("panchakarma", "image"), 7);
  for (const slug of PRODUCTION_SLUGS) {
    const names = blocksOf(C[slug]).filter((b) => b.type === "h3" && /^Dr\. /.test(b.text)).map((b) => b.text);
    assert.deepEqual(names, ["Dr. Deepu John", "Dr. Rahul R", "Dr. Akhila Oommen", "Dr. Adhina U.B.", "Dr. Aashitha P.S."], slug);
  }
  const quote = blocksOf(C.panchakarma).find((b) => b.type === "quote");
  assert.equal(quote.attribution, "Ashish Saini · Panchakarma guest");
  assert.deepEqual(C["treatment-packages"].body.sections.map((s) => s.sourceSection), ["section-0", "section-1", "section-2", "section-3", "section-4", "section-5", "doctors", "section-6", "section-7", "section-8"]);
});

// ── links and media ───────────────────────────────────────────────────────────────────────────────────
const ROUTE_SET = new Set(JSON.parse(read("english-candidate/routes.json")).routes.map((r) => r.path));

test("links: every same-site link resolves to a live route; anchors are measured; external links are https", () => {
  const fixed = ["/", "/new-privacy-policy/", "/terms-and-conditions/", "/cookie-policy/", "/ppc-thanks/"];
  for (const p of fixed) assert.ok(ROUTE_SET.has(p), p);
  for (const slug of PRODUCTION_SLUGS) {
    for (const { path: at, href } of bodyLinks(C[slug])) {
      if (href.startsWith("#")) assert.match(href, MEASURED_HASHES, `${slug} ${at}`);
      else if (href.startsWith("/")) assert.ok(ROUTE_SET.has(href.split(/[?#]/)[0]), `${slug} ${at}: ${href} not in english-candidate/routes.json`);
      else assert.match(href, /^https:\/\//, `${slug} ${at}`);
    }
  }
});

test("media: every body photograph and video thumbnail is in public/ or restored at build (npm run assets:restore)", () => {
  const restored = new Set([
    ...JSON.parse(read("english-candidate/gallery-assets-release.json")).files.map((f) => f.file),
    ...JSON.parse(read("english-candidate/runtime-assets-release.json")).files.map((f) => f.file),
  ]);
  for (const slug of PRODUCTION_SLUGS) {
    const srcs = blocksOf(C[slug]).flatMap((b) => (b.type === "image" ? [b.src] : b.type === "videoLink" && b.thumbnail ? [b.thumbnail] : []));
    for (const src of srcs) assert.ok(fs.existsSync(P("public", src)) || restored.has(`public${src}`), `${slug}: ${src}`);
    const pageImgs = [C[slug].hero.image.A, C[slug].hero.mobileImage, C[slug].stillness.image, ...C[slug].gallery.map((g) => g.image), ...C[slug].doctors.map((d) => d.photo)];
    for (const im of pageImgs) assert.ok(fs.existsSync(P("public", im.src)), im.src);
  }
});

test("media: the two oversized kit images are real JPEGs now, at their registry size", () => {
  for (const f of ["gal-poolside-rest-palakkad-2026.jpg", "gal-post-therapy-stillness-wakem.jpg"]) {
    const buf = fs.readFileSync(P("public/lp-v2/img", f));
    assert.deepEqual([...buf.subarray(0, 3)], [0xff, 0xd8, 0xff], `${f} is not a JPEG`);
    assert.ok(buf.length < 600_000, `${f}: ${buf.length} bytes`);
  }
});

// ── doctors ───────────────────────────────────────────────────────────────────────────────────────────
test("doctors: cards only from the approved registry ids; source wording; no invented years; no Ashikha Raj", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const c = C[slug];
    assert.deepEqual(c.doctors.map((d) => d.id), ["deepu-john", "akhila-oommen"]);
    const body = ` ${pageStrings(c).join(" | ")} `;
    for (const d of c.doctors) {
      assert.equal(d.yearsInPractice, undefined, `${d.id}: years are omitted, never derived`);
      assert.ok(body.includes(d.tenure), `${slug} ${d.id}: tenure "${d.tenure}" is the source's wording`);
      if (d.focus) assert.ok(body.includes(d.focus), `${slug} ${d.id}: focus`);
      assert.ok(body.includes(`${d.role} · ${d.qualification}`), `${slug} ${d.id}: role line`);
      assert.ok(body.includes(`Speaks ${d.languages.join(", ")}`), `${slug} ${d.id}: languages`);
      assert.doesNotMatch(`${d.role} ${d.qualification} ${d.tenure} ${d.focus ?? ""}`, /\b\d+\+?\s*years?\b/i);
    }
    assert.doesNotMatch(body, /Ashikha/);
  }
});

// ── metadata ──────────────────────────────────────────────────────────────────────────────────────────
test("metadata: canonical, robots and the Open Graph image are the replaced pages'; title and description from the copy", () => {
  const ALT = { "treatment-packages": "Kairali Ayurvedic Healing Village in Palakkad, Kerala", panchakarma: "Kairali Ayurvedic Healing Village, Palakkad" };
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
    assert.deepEqual(live.openGraph.images, [{ url: "https://ayurvedichealingvillage.com/landing/r10/og.jpg", width: 1200, height: 630, alt: ALT[slug] }]);
    assert.equal(live.openGraph.url, live.alternates.canonical);
    assert.equal(live.openGraph.locale, "en_IN");
    assert.deepEqual(live.twitter.images, [OG_IMAGE.url]);
  }
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
  assert.ok(!JSON.stringify(productionJsonLd("panchakarma", C.panchakarma)).match(/"@type":"(Offer|Product|MedicalClinic|VideoObject)"/));
});

// ── locked facts and owner facts ──────────────────────────────────────────────────────────────────────
test("locked facts: WhatsApp +91 92898 38797 and info@kairali.com; the wrong …38777 appears nowhere", () => {
  assert.equal(contact.whatsapp.number, "919289838797");
  assert.equal(contact.whatsapp.display, "+91 92898 38797");
  assert.equal(contact.email, "info@kairali.com");
  for (const f of ["campaign-v2/production/Body.tsx", "campaign-v2/sections/Footer.tsx", "campaign-v2/sections/Header.tsx", "campaign-v2/production/content/treatment-packages.json", "campaign-v2/production/content/panchakarma.json"]) {
    assert.doesNotMatch(read(f), /38777/, f);
  }
});

test("owner facts: the 14–21 night Panchakarma stay matches its source line; no year or opening date in the authored copy", () => {
  assert.match(C.panchakarma.seo.description, /14–21 night/);
  assert.ok(blocksOf(C.panchakarma).some((b) => b.type === "h3" && b.text === "A 14–21 night stay at Kairali, Kerala"));
  for (const slug of PRODUCTION_SLUGS) for (const { path: at, text } of allText(C[slug])) assert.doesNotMatch(text, /\b(18|19|20)\d{2}\b/, `${slug} ${at}`);
  assert.equal(C.panchakarma.cta.primarySupport, "Your initial consultation is free. Ask for a quotation covering treatment and any later services.");
});
