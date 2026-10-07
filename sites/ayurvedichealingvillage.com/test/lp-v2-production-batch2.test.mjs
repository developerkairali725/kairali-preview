// Live ad routes, batch 2 (/pain-management.html, /family-ayurvedic-retreat-kerala.html) on the campaign-v2 kit: the
// content worker's final frozen copy and the contracts of the pages they replace. Provenance; unchanged URLs,
// canonicals, robots and lead identity; the family form exactly as the R10 familyFields form (fields, limits, request
// body, compared byte for byte with a port of that form); the family-only copy bindings (inclusion headings, the
// health-field note); the site's own contact links (exact values only); media, doctors, villas, table and topics as
// independently reviewed; the quarantined written testimonials; batch 1 unchanged.
// A failing content assertion is a finding for the copy owner, never a reason to edit the copy here.
// Every request is intercepted: no network, no real lead.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { productionCampaign, PRODUCTION_SLUGS, archivalLongFormWords } from "../campaign-v2/production/load.ts";
import { ROUTES } from "../campaign-v2/production/bindings.ts";
import { productionMetadata, productionJsonLd } from "../campaign-v2/production/metadata.ts";
import { PRODUCTION_CAMPAIGN_FORM, PRODUCTION_PAIN_FORM, resolveSchema, validateStep, CONSENT_FIELD, MESSAGES } from "../campaign-v2/forms/schema.ts";
import { buildProductionLead, productionLeadAdapter, familyMessage, familyGender } from "../campaign-v2/forms/adapter.ts";
import { validationProblem } from "../lib/lead-validation.ts";
import { normaliseCampaignPhone } from "../lib/campaign-phone.ts";
import { safeHref, isKnownContactHref, isKnownContactLink, KNOWN_CONTACT_LINKS, bodyLinks } from "../campaign-v2/kit/lint/body.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { PRICE, RATE_LINK } from "../campaign-v2/kit/lint/pricing.ts";
import { inlineText, renderedTexts, isQuotedParagraph, isExternal } from "../campaign-v2/production/body-model.ts";
import { interactionForLink } from "../campaign-v2/production/interaction-map.ts";
import { parseMarkdown } from "../campaign-v2/sections/markdown.ts";
import { contact } from "../campaign-v110/lib/site.ts";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...p) => path.join(SITE, ...p);
const read = (p) => fs.readFileSync(P(p), "utf8");
const sha256 = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const NOW = new Date(Date.UTC(2026, 9, 7, 12));
const TOKEN = "00000000-0000-4000-8000-000000000000";
const PAIN = "pain-management";
const FAMILY = "family-ayurvedic-retreat";
const B2 = [PAIN, FAMILY];
const C = Object.fromEntries(B2.map((s) => [s, productionCampaign(s)]));
const RAW = Object.fromEntries(B2.map((s) => [s, JSON.parse(read(`campaign-v2/production/content/${s}.json`)).copy]));
const blocksOf = (c) => [...c.body.sections.flatMap((s) => s.blocks), ...c.body.closing];
const FAMILY_NOTE = "Share any health concerns you would like to discuss with the doctor. This field is optional.";

/** Every visible string of a production page (authored copy, doctor cards, the source body as rendered). */
function pageStrings(c) {
  const t = [
    c.hero.overline, c.hero.h1, c.hero.standfirst, c.admission.heading, ...c.admission.steps.flatMap((s) => [s.title, s.body]),
    ...c.included, ...c.chargedSeparately, c.stillness.heading, c.stillness.body, c.village.heading, c.village.body,
    ...c.faq.flatMap((f) => [f.q, f.a]), c.feePresentation.heading, c.feePresentation.body, c.feePresentation.cta,
    c.cta.primary, c.cta.primarySupport, c.cta.secondary,
    ...(c.inclusionHeadings ? [c.inclusionHeadings.included, c.inclusionHeadings.chargedSeparately] : []),
    ...c.doctors.flatMap((d) => [d.name, d.role, d.qualification, d.tenure ?? "", d.focus ?? "", ...(Array.isArray(d.languages) ? d.languages : [])]),
    ...c.gallery.map((g) => g.image.alt), c.hero.mobileImage.alt,
  ];
  for (const b of parseMarkdown(c.body.intro.join("\n\n"))) t.push(...(b.type === "ul" ? b.items : [b.text]));
  for (const b of blocksOf(c)) {
    t.push(...renderedTexts(b));
    if (b.type === "image") t.push(b.alt);
  }
  return t.filter((x) => typeof x === "string" && x);
}

// ── provenance and registration ───────────────────────────────────────────────────────────────────────────
test("provenance: the batch-2 copy is the final frozen packet of FINAL-REVIEW-REVISION (SHA-256), recorded in SOURCES.json", () => {
  const FROZEN = {
    "pain-management.json": "9e25e2be878ce6d5978564b2eaed8bbe43d598e8a8847cbd1269adee92c3371b",
    "family-ayurvedic-retreat.json": "adaf23cedfc6d2f9e10d5c99a6574bce60942d2e381d3a65eecd7790db0a1d4a",
  };
  const manifest = JSON.parse(read("campaign-v2/production/content/SOURCES.json"));
  for (const [file, sha] of Object.entries(FROZEN)) {
    assert.equal(sha256(P("campaign-v2/production/content", file)), sha, file);
    assert.equal(manifest.files[file].sha256, sha, `SOURCES.json ${file}`);
  }
  for (const slug of B2) {
    assert.ok(PRODUCTION_SLUGS.includes(slug), slug);
    assert.equal(RAW[slug].slug, slug);
    assert.equal(RAW[slug].longForm, "", `${slug}: no archival long form in the batch-2 packet`);
    assert.equal(archivalLongFormWords(slug), 0);
    assert.equal(C[slug].longForm, "");
    assert.ok(C[slug].body.sections.length >= 10, `${slug}: the source body renders`);
  }
});

test("routes: unchanged URLs, canonicals and robots (indexable only on the production build, as before); no OG alt or breadcrumb the replaced pages lacked", () => {
  const old = read("app/(campaign)/_traffic/TrafficLanding.tsx");
  assert.match(old, /robots:\{index:process\.env\.AHV_STAGING==='0',follow:true\}/); // the replaced pages' rule
  assert.match(old, /images:\[\{url:image,width:1200,height:630\}\]/); // their OG image: no alt
  const URL = { [PAIN]: "/pain-management.html", [FAMILY]: "/family-ayurvedic-retreat-kerala.html" };
  for (const slug of B2) {
    const c = C[slug];
    const canonical = `https://ayurvedichealingvillage.com${URL[slug]}`;
    assert.equal(c.route, URL[slug]);
    assert.equal(ROUTES[slug].canonical, canonical);
    const live = productionMetadata(slug, c, { AHV_STAGING: "0" });
    assert.equal(live.alternates.canonical, canonical);
    assert.deepEqual(live.robots, { index: true, follow: true });
    assert.deepEqual(productionMetadata(slug, c, { AHV_STAGING: "1" }).robots, { index: false, follow: true });
    assert.deepEqual(productionMetadata(slug, c, {}).robots, { index: false, follow: true });
    assert.deepEqual(live.openGraph.images, [{ url: "https://ayurvedichealingvillage.com/landing/r10/og.jpg", width: 1200, height: 630 }]);
    assert.equal(live.openGraph.url, canonical);
    assert.equal(live.title, c.seo.title);
    assert.equal(live.description, c.seo.description);
    const [page, faq] = productionJsonLd(slug, c);
    assert.equal(page["@type"], "WebPage");
    assert.equal(page.url, canonical);
    assert.equal(page.breadcrumb, undefined);
    assert.equal(faq["@type"], "FAQPage");
    assert.equal(faq.mainEntity.length, c.faq.length);
  }
});

test("lead identity: the replaced pages' form_variant (r10-<formType>), no guide download, the family profile only on family", () => {
  const traffic = read("app/(campaign)/_traffic/TrafficLanding.tsx");
  assert.match(traffic, /formType=\{kind==='pain'\?'pain-management':'family-retreat'\} familyFields=\{kind==='family'\}/);
  assert.match(traffic, /downloadGuide=\{false\}/);
  assert.match(read("app/(campaign)/ayurvedic-treatment-packages.html/EnquiryForm.tsx"), /form_variant:`r10-\$\{formType\}`/);
  assert.deepEqual(C[PAIN].productionForm, { formVariant: "r10-pain-management", downloadGuide: false, profile: "pain-management" });
  assert.deepEqual(C[FAMILY].productionForm, { formVariant: "r10-family-retreat", downloadGuide: false, profile: "family-retreat" });
  for (const slug of B2) assert.equal(C[slug].form.adapterId, "ahv-production");
  assert.equal(C[PAIN].form.schema, PRODUCTION_PAIN_FORM);
});

// ── the family form ───────────────────────────────────────────────────────────────────────────────────────
const FS = resolveSchema(C[FAMILY].form.schema, { campaign: C[FAMILY], locale: "en", now: NOW });
const fam = (over = {}) => ({
  fullName: "Asha Menon", rdogender: "", email: "asha@example.com", dialCode: "+91", phone: "98470 12345",
  country: "India", duration: "", message: "", [CONSENT_FIELD]: true, marketing: false, honeypot: "", channel: "whatsapp", ...over,
});

test("family form: the R10 familyFields contract — fields, order, required, limits, options, labels; the copy's note on the health field", () => {
  const fields = FS.steps[0].fields;
  assert.deepEqual(fields.map((f) => f.name), ["fullName", "rdogender", "email", "dialCode", "phone", "country", "duration", "message"]);
  const f = Object.fromEntries(fields.map((x) => [x.name, x]));
  assert.deepEqual([f.rdogender.type, f.rdogender.label, f.rdogender.required], ["radio", "Gender", false]);
  assert.deepEqual(f.rdogender.options, [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]);
  assert.deepEqual([f.country.type, f.country.label, f.country.required, f.country.maxLength, f.country.autocomplete], ["text", "Country", true, 100, "country-name"]);
  assert.deepEqual([f.duration.type, f.duration.label, f.duration.required, f.duration.defaultValue], ["select", "Preferred duration", false, ""]);
  assert.deepEqual(f.duration.options, [
    { value: "", label: "Select duration" }, { value: "7 days", label: "7 days" }, { value: "14 days", label: "14 days" }, { value: "21 days", label: "21 days" },
  ]);
  assert.deepEqual([f.message.type, f.message.label, f.message.required, f.message.maxLength], ["textarea", "Any existing health conditions?", false, 2700]);
  assert.equal(f.message.hint, FAMILY_NOTE);
  assert.equal(RAW[FAMILY].familyFormNote, FAMILY_NOTE);
  // name, email and the phone pair are the default production form's, unchanged
  for (const n of ["fullName", "email", "dialCode", "phone"]) {
    assert.deepEqual(C[FAMILY].form.schema.steps[0].fields.find((x) => x.name === n), PRODUCTION_CAMPAIGN_FORM.steps[0].fields.find((x) => x.name === n), n);
  }
  assert.equal(FS.consentLabels.whatsapp, "I have read and agree to the privacy policy and terms");
  assert.equal(FS.genericNote, false); // no contradictory "No medical details needed" line
  assert.equal(FS.lede, undefined); // nor the generic lede that says the same
  // the replaced form's own values
  const r10 = read("app/(campaign)/ayurvedic-treatment-packages.html/EnquiryForm.tsx");
  for (const s of [
    'name="country" autoComplete="country-name" required maxLength={100}', '<option value="">Select duration</option>',
    '<option value="7 days">7 days</option>', '<option value="14 days">14 days</option>', '<option value="21 days">21 days</option>',
    "'Any existing health conditions?'", "maxLength={familyFields?2700:3000}",
    'name="rdogender" type="radio" value="Male"', 'name="rdogender" type="radio" value="Female"',
  ]) assert.ok(r10.includes(s), s);
  assert.doesNotMatch(r10, /name="rdogender"[^>]*required/); // gender was never required
  assert.doesNotMatch(r10, /name="duration"[^>]*required/); // nor the duration
});

test("family form validation: country required with its own message, duration and health optional, gender optional but only its values", () => {
  const errs = (over) => validateStep(FS, 0, fam(over), "whatsapp").map((e) => [e.field, e.code]);
  assert.deepEqual(validateStep(FS, 0, fam(), "whatsapp"), []);
  assert.deepEqual(validateStep(FS, 0, fam({ country: " " }), "whatsapp").map((e) => [e.field, e.message]), [["country", MESSAGES.country]]);
  assert.deepEqual(errs({ country: "x".repeat(101) }), [["country", "too_long"]]);
  assert.deepEqual(errs({ rdogender: "Female", duration: "14 days", message: "Knee stiffness" }), []);
  assert.deepEqual(errs({ duration: "28 nights" }), [["duration", "required"]]);
  assert.deepEqual(errs({ rdogender: "Other" }), [["rdogender", "required"]]);
  assert.deepEqual(errs({ message: "x".repeat(2700) }), []);
  assert.deepEqual(errs({ message: "x".repeat(2701) }), [["message", "too_long"]]);
  assert.deepEqual(errs({ phone: "" }), [["phone", "phone"]]);
  assert.deepEqual(errs({ fullName: " " }), [["fullName", "required"]]);
  assert.deepEqual(errs({ [CONSENT_FIELD]: false }), [[CONSENT_FIELD, "consent"]]);
});

// The replaced page's request body: app/(campaign)/ayurvedic-treatment-packages.html/EnquiryForm.tsx submit(), ported
// line for line (FormData → plain object; consent "on" when ticked; `company` is its honeypot).
function r10Body({ formType, familyFields, data, location, referrer, attribution, lang = "en" }) {
  const phone = String(data.phone || "").trim();
  const dialCode = String(data.dialCode || "").trim();
  const fullPhone = normaliseCampaignPhone(phone.startsWith("+") ? phone : dialCode + " " + phone);
  const incoming = new URLSearchParams(location.search);
  const campaign = attribution?.() || Object.fromEntries(["gclid", "gbraid", "wbraid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].flatMap((k) => {
    const pattern = k.startsWith("utm_") ? /^[a-zA-Z0-9_.~ &-]{1,120}$/ : /^[a-zA-Z0-9_.~-]{1,120}$/;
    const value = incoming.getAll(k).find((v) => pattern.test(v));
    return value ? [[k, value]] : [];
  }));
  const query = new URLSearchParams(campaign);
  const sourceUrl = location.origin + location.pathname + (query.toString() ? "?" + query.toString() : "");
  let ref = "";
  try { ref = new URL(referrer).origin + "/"; } catch { /* none */ }
  return {
    form: "landing-page", company: String(data.company || ""), submissionToken: TOKEN, site_language: lang, lead_source_url: sourceUrl, referrer: ref, ...campaign,
    fields: {
      landing_page_path: location.pathname, form_variant: `r10-${formType}`, campaign_name: campaign.utm_campaign || "", utm_keyword: campaign.utm_term || "",
      fname: String(data.fullName).trim(), rdogender: String(data.rdogender || ""), email: String(data.email).trim(), phone: fullPhone,
      message: (familyFields ? `Country: ${String(data.country || "").trim()}\nPreferred duration: ${String(data.duration || "").trim()}\n` : "") + String(data.message || "").trim(),
      consent: data.consent === "on",
    },
  };
}
const asFormData = (v) => ({
  fullName: v.fullName, rdogender: v.rdogender, dialCode: v.dialCode, phone: v.phone, email: v.email, country: v.country,
  duration: v.duration, message: v.message, consent: v[CONSENT_FIELD] ? "on" : null, company: v.honeypot,
});
const envFor = (pathname, over = {}) => ({
  location: { origin: "https://ayurvedichealingvillage.com", pathname, search: "?gclid=Cj0KCQ_abc&utm_source=google&utm_medium=cpc&utm_campaign=Family%20%26%20Care&utm_term=family%20ayurveda&gad_source=1&email=asha%40example.com" },
  referrer: "https://www.google.com/search?q=ayurveda", ...over,
});

test("family request: byte-identical to the replaced R10 familyFields form (Country / Preferred duration prefix, gender, attribution)", () => {
  const route = ROUTES[FAMILY].route;
  const cases = [
    fam({ rdogender: "Female", country: " Germany ", duration: "14 days", message: " Lower back stiffness after long drives. " }),
    fam(), // gender unanswered, no duration, no health text
    fam({ rdogender: "Male", country: "x".repeat(100), duration: "21 days", message: "y".repeat(2700) }), // the maxima
    fam({ dialCode: "+44", phone: "7700 900123", honeypot: "Acme Trading" }),
  ];
  for (const values of cases) {
    for (const env of [envFor(route), envFor(route, { attribution: () => ({ gclid: "FROM-RUNTIME" }) })]) {
      const kit = buildProductionLead(values, { token: TOKEN, locale: "en", production: C[FAMILY].productionForm, env });
      const old = r10Body({ formType: "family-retreat", familyFields: true, data: asFormData(values), location: env.location, referrer: env.referrer, attribution: env.attribution });
      assert.equal(JSON.stringify(kit), JSON.stringify(old));
      assert.equal(validationProblem("landing-page", { ...kit.fields }), null);
      assert.ok(kit.fields.message.length <= 3000, `${kit.fields.message.length}`);
    }
  }
  assert.equal(familyMessage(fam()), "Country: India\nPreferred duration: \n");
  assert.equal(familyMessage(fam({ duration: "7 days", message: "Asthma" })), "Country: India\nPreferred duration: 7 days\nAsthma");
  assert.deepEqual(["Male", "Female", "", "other", undefined].map(familyGender), ["Male", "Female", "", "", ""]);
});

test("pain request: preserves the original optional gender and message without a family prefix", () => {
  const route = ROUTES[PAIN].route;
  const values = { fullName: "Ravi K", email: "ravi@example.com", dialCode: "+91", phone: "98470 12345", message: "Knee pain when climbing stairs", [CONSENT_FIELD]: true, honeypot: "", rdogender: "Male", country: "India", duration: "7 days" };
  const kit = buildProductionLead(values, { token: TOKEN, locale: "en", production: C[PAIN].productionForm, env: envFor(route) });
  assert.equal(kit.fields.form_variant, "r10-pain-management");
  assert.equal(kit.fields.rdogender, "Male");
  assert.equal(kit.fields.message, "Knee pain when climbing stairs"); // no family prefix
  const old = r10Body({ formType: "pain-management", familyFields: false, data: asFormData(values), location: envFor(route).location, referrer: envFor(route).referrer });
  assert.equal(JSON.stringify(kit), JSON.stringify(old));
  assert.equal(validationProblem("landing-page", { ...kit.fields }), null);
});

test("family adapter: one same-origin POST of exactly that body; the route never downloads a guide", async () => {
  let n = 0, last;
  const ok = async (url, init) => { n++; last = { url, init }; return new Response(JSON.stringify({ ok: true, status: "received", guideUrl: "/documents/kairali-guide.pdf" }), { status: 200 }); };
  const env = envFor(ROUTES[FAMILY].route);
  const values = fam({ rdogender: "Female", duration: "7 days", message: "Mild asthma" });
  const r = await productionLeadAdapter.submit(values, {
    schema: FS, campaign: { tracking: C[FAMILY].tracking }, variant: "A", locale: "en", token: TOKEN, tracking: {},
    pageUrl: "https://ayurvedichealingvillage.com/family-ayurvedic-retreat-kerala.html", referrer: "", fetch: ok,
    production: C[FAMILY].productionForm, env, timeoutMs: 200,
  });
  assert.deepEqual(r, { status: "received", ref: "", token: TOKEN });
  assert.equal(n, 1);
  assert.equal(last.url, "/api/lead/");
  assert.equal(last.init.body, JSON.stringify(buildProductionLead(values, { token: TOKEN, locale: "en", production: C[FAMILY].productionForm, env })));
});

// ── family-only copy bindings ─────────────────────────────────────────────────────────────────────────────
test("family copy bindings: the quotation-confirmation inclusion headings and lists; pain keeps the kit headings", () => {
  assert.deepEqual(C[FAMILY].inclusionHeadings, { included: "Confirm each person’s programme", chargedSeparately: "Ask about additional charges" });
  assert.deepEqual(C[FAMILY].inclusionHeadings, RAW[FAMILY].inclusionHeadings);
  assert.deepEqual(C[FAMILY].included, RAW[FAMILY].included);
  assert.deepEqual(C[FAMILY].chargedSeparately, RAW[FAMILY].chargedSeparately);
  // INCLUSION-FACTS: the yoga tariff includes private sessions, so the family page never lists them as uniformly extra
  assert.ok(!C[FAMILY].chargedSeparately.some((x) => /private/i.test(x)), C[FAMILY].chargedSeparately.join(" | "));
  assert.equal(C[PAIN].inclusionHeadings, undefined);
  assert.equal(RAW[PAIN].inclusionHeadings, undefined);
  assert.equal(RAW[PAIN].familyFormNote, undefined);
  const adm = read("campaign-v2/sections/Admission.tsx");
  assert.match(adm, /\{c\.inclusionHeadings\?\.included \?\? "Included"\}/);
  assert.match(adm, /\{c\.inclusionHeadings\?\.chargedSeparately \?\? "Charged separately"\}/);
});

test("no Step-1 ConsultBar on batch 2: the replaced forms asked no program, month or length; copy.programDefault stays editorial", () => {
  for (const slug of B2) {
    assert.equal(C[slug].consultBar, false, slug);
    assert.equal(C[slug].programDefault, "", slug);
    assert.ok(RAW[slug].programDefault, `${slug}: the packet still names the programme (editorial context)`);
  }
  assert.doesNotMatch(read("app/(campaign)/ayurvedic-treatment-packages.html/EnquiryForm.tsx"), /name="(program|month|length)"/);
  assert.match(read("campaign-v2/production/ProductionPage.tsx"), /\{c\.consultBar === false \? null : <ConsultBar \{\.\.\.p\} \/>\}/);
});

// ── contact links ─────────────────────────────────────────────────────────────────────────────────────────
test("contact links: only the site's own phone and email, exact strings with their own text; never a protocol allowance", () => {
  assert.deepEqual(KNOWN_CONTACT_LINKS, [{ href: "tel:+919555156156", text: "+91 9555 156 156" }, { href: "mailto:info@kairali.com", text: "info@kairali.com" }]);
  assert.deepEqual(KNOWN_CONTACT_LINKS.map((k) => k.href), [contact.phone.href, `mailto:${contact.email}`]);
  for (const ok of ["tel:+919555156156", "mailto:info@kairali.com"]) {
    assert.equal(safeHref(ok), true, ok);
    assert.equal(isKnownContactHref(ok), true, ok);
  }
  for (const bad of [
    "tel:+919555156157", "tel:919555156156", "tel:+91 9555156156", "tel:+919555156156?x=1", " tel:+919555156156", "TEL:+919555156156",
    "tel:+919289838797", "tel:", "mailto:", "mailto:INFO@kairali.com", "mailto:info@kairali.com?subject=Hi", "mailto:info@kairali.com,x@example.com",
    "mailto:someone@example.com", "sms:+919555156156", "javascript:alert(1)", "data:text/html,x", "//evil.example", "vbscript:x",
  ]) {
    assert.equal(safeHref(bad), false, bad);
    assert.equal(isKnownContactHref(bad), false, bad);
  }
  assert.equal(isKnownContactLink("tel:+919555156156", "+91 9555 156 156"), true);
  assert.equal(isKnownContactLink("tel:+919555156156", "+91 92898 38797"), false);
  assert.equal(isKnownContactLink("mailto:info@kairali.com", "Email us"), false);
  // rendered as a plain same-tab link and measured by the replaced page's own mapping
  assert.equal(isExternal("tel:+919555156156"), false);
  assert.deepEqual(interactionForLink("tel:+919555156156", false), ["contact_click", "phone"]);
  assert.deepEqual(interactionForLink("mailto:info@kairali.com", false), ["contact_click", "email"]);
});

test("family body keeps its source contact line with the locked values; no other tel:/mailto: on either page; lint clean", () => {
  const b = C[FAMILY].body.sections[0].blocks[2];
  assert.equal(b.type, "p");
  assert.equal(b.text, "Call +91 9555 156 156 or email info@kairali.com");
  assert.equal(inlineText(b.inline), b.text);
  assert.deepEqual(b.inline.filter((r) => r.type === "link").map((r) => [r.href, r.text]), [["tel:+919555156156", "+91 9555 156 156"], ["mailto:info@kairali.com", "info@kairali.com"]]);
  const contacts = B2.flatMap((s) => bodyLinks(C[s]).filter((l) => /^(tel|mailto):/i.test(l.href)).map((l) => `${s} ${l.href}`));
  assert.deepEqual(contacts, [`${FAMILY} tel:+919555156156`, `${FAMILY} mailto:info@kairali.com`]);
  for (const slug of B2) {
    const errors = lintCampaign(C[slug], NOW).errors.filter((e) => e.rule === "body.href" || e.rule === "body.contact");
    assert.deepEqual(errors, [], slug);
  }
});

// ── media, doctors, villas, table, topics (INDEPENDENT-REVIEW.json) ───────────────────────────────────────
test("structure as independently reviewed: 3 films, 7 captioned photographs, 5 doctor bios, 4 villas; family 16 topics and a 7-row routine table", () => {
  const VIDEOS = ["https://www.youtube.com/watch?v=3vWviQfW1Ug", "https://www.youtube.com/watch?v=4x01PtWfNnk", "https://www.youtube.com/watch?v=DcTMckQD3rc"];
  const PHOTOS = [
    "/ahv/assets/img/gallery-2026/yoga/practice-yoga-instructor-guiding-female-07.webp",
    "/ahv/assets/img/gallery-2026/property/block-facility-physician-consultation-room-01.webp",
    "/ahv/assets/img/gallery-2026/photo/villas-villa-exterior-stone-cottage-bay-09.webp",
    "/ahv/assets/img/gallery-2026/treatments/rooms-therapy-prep-therapist-hands-kneading-08.webp",
    "/ahv/assets/img/gallery-2026/retreats/welcome-people-woman-cream-handloom-01.webp",
    "/ahv/assets/img/gallery-2026/treatments/rooms-treatment-therapy-room-corner-09.webp",
    "/landing/r10/home-wx-hero.webp",
  ];
  const DOCTORS = ["Dr. Deepu John", "Dr. Rahul R", "Dr. Akhila Oommen", "Dr. Adhina U.B.", "Dr. Aashitha P.S."];
  const VILLAS = ["/classic-villa/", "/deluxe-villa/", "/maharaja-suite/", "/royal-villa/"];
  for (const slug of B2) {
    const blocks = blocksOf(C[slug]);
    assert.deepEqual(blocks.filter((b) => b.type === "videoLink").map((b) => b.href).sort(), VIDEOS, slug);
    assert.ok(blocks.filter((b) => b.type === "videoLink").every((b) => b.label && b.thumbnail), slug);
    const photos = blocks.filter((b) => b.type === "image");
    assert.deepEqual(photos.map((b) => b.src).sort(), [...PHOTOS].sort(), slug);
    assert.ok(photos.every((b) => b.alt && b.caption), slug);
    assert.deepEqual(blocks.filter((b) => b.type === "h3" && /^Dr\. /.test(b.text)).map((b) => b.text), DOCTORS, slug);
    assert.deepEqual([...new Set(bodyLinks(C[slug]).map((l) => l.href).filter((h) => /-(villa|suite)\/$/.test(h)))].sort(), VILLAS, slug);
  }
  const tables = blocksOf(C[FAMILY]).filter((b) => b.type === "table");
  assert.equal(tables.length, 1);
  assert.deepEqual(tables[0].headers, ["Time", "Activity", "What to expect"]);
  assert.equal(tables[0].rows.length, 7);
  assert.ok(tables[0].rows.every((r) => r.length === 3));
  assert.equal(blocksOf(C[PAIN]).filter((b) => b.type === "table").length, 0);
  const TOPICS = [
    "Panchakarma Detox", "Addiction Recovery", "Skin Vitality", "Respiratory Health", "Cardiovascular Health", "Chronic Back Pain",
    "Stress & Mental Wellness", "Diabetes & Metabolism", "Digestive & Gut Health", "Immunity & Executive Health", "Joint Rehabilitation",
    "Neurological Wellness", "Women's Hormonal Balance", "Weight Management", "Yoga & Meditation", "Wholesome Family Dining",
  ];
  const programmes = C[FAMILY].body.sections.find((s) => s.sourceSection === "section-3");
  const h3 = programmes.blocks.filter((b) => b.type === "h3").map((b) => b.text);
  assert.deepEqual(TOPICS.filter((t) => !h3.includes(t)), []);
  assert.equal(TOPICS.length, 16);
});

test("written family testimonials stay quarantined: no byline, title or excerpt of the source's written stories renders; no quote blocks", () => {
  const raw = read("app/(campaign)/family-ayurvedic-retreat-kerala.html/content.ts");
  const html = JSON.parse(raw.match(/export const \w+ = (".*");/s)[1]);
  const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').trim();
  const pick = (re) => [...html.matchAll(re)].map((m) => decode(m[1]));
  const quarantined = [
    ...pick(/class="guest-byline">([^<]+)</g),
    ...pick(/<article class="family-guest"><h3>([^<]+)</g),
    ...pick(/class="story-excerpt">([^<]+)</g),
  ];
  assert.equal(quarantined.length, 12, quarantined.join(" | "));
  const page = ` ${pageStrings(C[FAMILY]).join(" | ")} `;
  for (const q of quarantined) assert.ok(!page.includes(q), `rendered: ${q}`);
  assert.equal(blocksOf(C[FAMILY]).filter((b) => b.type === "quote").length, 0);
  assert.ok(!blocksOf(C[FAMILY]).some((b) => isQuotedParagraph(b)));
  assert.match(page, /filmed accounts\. Individual experiences vary\./); // the video-only introduction
});

// ── owner rules ───────────────────────────────────────────────────────────────────────────────────────────
test("owner rules: Get Free Doctor Consultation; 'free' only for the initial consultation; no amounts and no tariff access", () => {
  for (const slug of B2) {
    const c = C[slug];
    assert.equal(c.cta.primary, "Get Free Doctor Consultation");
    assert.equal(c.feePresentation.cta, "Get Free Doctor Consultation");
    assert.equal(c.cta.primarySupport, "Your initial consultation is free. Ask for a quotation covering treatment and any later services.");
    const strings = [...pageStrings(c), c.seo.title, c.seo.description];
    assert.deepEqual(strings.filter((s) => PRICE.test(s)), [], slug);
    assert.deepEqual(bodyLinks(c).filter((l) => RATE_LINK.test(l.href) || RATE_LINK.test(l.text)).map((l) => l.href), [], slug);
    for (const s of strings) for (const sentence of s.split(/(?<=[.?!])\s+/)) {
      if (/\bfree\b/i.test(sentence)) assert.match(sentence, /consultation/i, `${slug}: "${sentence}"`);
    }
  }
});

// ── batch 1 unchanged ─────────────────────────────────────────────────────────────────────────────────────
test("batch 1 unchanged: default form and body, no batch-2 keys, the generic note and kit headings still render there", () => {
  for (const slug of ["treatment-packages", "panchakarma"]) {
    const c = productionCampaign(slug);
    assert.equal(c.form.schema, PRODUCTION_CAMPAIGN_FORM);
    assert.equal("inclusionHeadings" in c, false, slug);
    assert.equal("consultBar" in c, false, slug);
    assert.deepEqual(Object.keys(ROUTES[slug].productionForm).sort(), ["downloadGuide", "formVariant"], slug);
    assert.equal(ROUTES[slug].inclusionHeadings, undefined);
    assert.equal(ROUTES[slug].consultBar, undefined);
    // family-shaped answers never change a batch-1 body
    const values = { ...fam({ rdogender: "Female", duration: "14 days", message: "Hello" }) };
    const body = buildProductionLead(values, { token: TOKEN, locale: "en", production: ROUTES[slug].productionForm, env: envFor(ROUTES[slug].route) });
    assert.equal(body.fields.rdogender, "");
    assert.equal(body.fields.message, "Hello");
  }
  assert.equal(productionCampaign("panchakarma").programDefault, "Panchakarma");
  const S = resolveSchema(PRODUCTION_CAMPAIGN_FORM, { campaign: { programDefault: "" }, locale: "en", now: NOW });
  assert.equal("genericNote" in S, false);
  assert.equal(S.lede, PRODUCTION_CAMPAIGN_FORM.lede);
  assert.deepEqual(S.steps[0].fields.map((f) => f.name), ["fullName", "email", "dialCode", "phone", "message"]);
  assert.match(read("campaign-v2/sections/interactive/EnquiryForm.tsx"),
    /\{i === 0 && schema\.genericNote !== false \? <p className="lp-enq__note">No medical details needed\. Your doctor asks for those privately at consultation\.<\/p> : null\}/);
});

 test("pain gender stays optional and unanswered by default; valid selections preserve original payload", () => {
  const schema = resolveSchema(C[PAIN].form.schema, { campaign: C[PAIN], locale: "en", now: NOW });
  const fields = schema.steps[0].fields;
  assert.deepEqual(fields.map(f => f.name), ["fullName", "rdogender", "email", "dialCode", "phone", "message"]);
  const gender = fields.find(f => f.name === "rdogender");
  assert.equal(gender.required, false);
  assert.equal(gender.defaultValue, "");
  for (const value of ["", "Male", "Female"]) {
    const values = fam({ rdogender: value, message: "Hello" });
    assert.deepEqual(validateStep(schema, 0, values, "whatsapp"), []);
    const env = envFor(ROUTES[PAIN].route);
    const body = buildProductionLead(values, { token: TOKEN, locale: "en", production: C[PAIN].productionForm, env });
    assert.equal(body.fields.rdogender, value);
    assert.equal(body.fields.message, "Hello");
  }
});
