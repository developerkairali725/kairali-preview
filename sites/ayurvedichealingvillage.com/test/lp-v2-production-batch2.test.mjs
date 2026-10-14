// Live ad routes, batch 2 (/pain-management.html, /family-ayurvedic-retreat-kerala.html) on the campaign-v2 kit: the
// reviewed copy of 8 Oct 2026 designed into the production template, and the contracts of the pages they replace.
// Unchanged URLs, canonicals, robots and lead identity; the family form exactly as the R10 familyFields form (fields,
// limits, request body, compared byte for byte with a port of that form); the pain form's optional gender; the
// site's own contact links (exact values only); films, doctors, villas and topics as the reviewed copy gives them;
// the quarantined written testimonials; batch 1 unchanged.
// A failing content assertion is a finding for the copy owner, never a reason to edit the copy here.
// Every request is intercepted: no network, no real lead.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { ROUTES } from "../campaign-v2/production/bindings.ts";
import { COPY } from "../campaign-v2/production/pages/index.ts";
import { productionMetadata, productionJsonLd } from "../campaign-v2/production/metadata.ts";
import { PRODUCTION_CAMPAIGN_FORM, PRODUCTION_PAIN_FORM, resolveSchema, validateStep, CONSENT_FIELD, MESSAGES } from "../campaign-v2/forms/schema.ts";
import { buildProductionLead, productionLeadAdapter, familyMessage, familyGender } from "../campaign-v2/forms/adapter.ts";
import { validationProblem } from "../lib/lead-validation.ts";
import { normaliseCampaignPhone } from "../lib/campaign-phone.ts";
import { safeHref, isKnownContactHref, isKnownContactLink, KNOWN_CONTACT_LINKS } from "../campaign-v2/kit/lint/body.ts";
import { pageLinks, pageText } from "../campaign-v2/kit/lint/page-text.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { PRICE, RATE_LINK } from "../campaign-v2/kit/lint/pricing.ts";
import { interactionForLink } from "../campaign-v2/production/interaction-map.ts";
import { CURRENT_ROSTER } from "../campaign-v2/data/doctors.ts";
import { contact } from "../campaign-v110/lib/site.ts";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...p) => path.join(SITE, ...p);
const read = (p) => fs.readFileSync(P(p), "utf8");
const NOW = new Date(Date.UTC(2026, 9, 8, 12));
const TOKEN = "00000000-0000-4000-8000-000000000000";
const PAIN = "pain-management";
const FAMILY = "family-ayurvedic-retreat";
const B2 = [PAIN, FAMILY];
const C = Object.fromEntries(B2.map((s) => [s, productionCampaign(s)]));
const FAMILY_NOTE = "Share any health concerns you would like to discuss with the doctor. This field is optional.";

/** Every visible string of a production page: hero, CTAs, the designed sections, the FAQ, the doctor cards, alt text. */
function pageStrings(c) {
  return [
    c.hero.overline, c.hero.h1, c.hero.standfirst, c.cta.primary, c.cta.primarySupport, c.cta.secondary,
    ...c.faq.flatMap((f) => [f.q, f.a]),
    ...pageText(c).map((x) => x.text),
    ...c.doctors.flatMap((d) => [d.name, d.role, d.qualification, d.tenure ?? "", d.focus ?? "", ...(Array.isArray(d.languages) ? d.languages : [])]),
    ...c.gallery.map((g) => g.image.alt), c.hero.mobileImage.alt,
  ].filter((x) => typeof x === "string" && x);
}

// ── registration and routes ───────────────────────────────────────────────────────────────────────────────
test("registration: both batch-2 routes are production slugs with their own reviewed copy and the designed page", () => {
  for (const slug of B2) {
    assert.ok(PRODUCTION_SLUGS.includes(slug), slug);
    assert.equal(COPY[slug].slug, slug);
    assert.equal(COPY[slug].route, ROUTES[slug].route);
    assert.equal(C[slug].longForm, "");
    assert.ok(C[slug].page, slug);
  }
});

test("routes: unchanged URLs, canonicals and robots (indexable only on the production build, as before); no OG alt the replaced pages lacked; Home > H1 breadcrumb (AHV-WB.069/093)", () => {
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
    // AHV-WB.069 / AHV-WB.093 (14 Oct 2026): Home > the page's visible H1, nothing else in the WebPage node changed.
    assert.deepEqual(page.breadcrumb, {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ayurvedichealingvillage.com/" },
        { "@type": "ListItem", position: 2, name: { [PAIN]: "Ayurvedic pain management in Kerala", [FAMILY]: "Family Ayurveda retreat in Kerala" }[slug], item: canonical },
      ],
    });
    assert.equal(page.breadcrumb.itemListElement[1].name, c.hero.h1);
    assert.deepEqual(Object.keys(page), ["@context", "@type", "@id", "url", "name", "description", "inLanguage", "isPartOf", "breadcrumb"]);
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

test("family form: the R10 familyFields contract — fields, order, required, limits, options, labels; the note on the health field", () => {
  const fields = FS.steps[0].fields;
  // "preferredMonth": the one optional month select added by DEC-OPTIONAL-STAY-SELECTORS (optional only); all else is R10.
  assert.deepEqual(fields.map((f) => f.name), ["fullName", "rdogender", "email", "dialCode", "phone", "country", "duration", "preferredMonth", "message"]);
  const f = Object.fromEntries(fields.map((x) => [x.name, x]));
  assert.deepEqual([f.rdogender.type, f.rdogender.label, f.rdogender.required], ["radio", "Gender", false]);
  assert.deepEqual(f.rdogender.options, [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]);
  assert.deepEqual([f.country.type, f.country.label, f.country.required, f.country.maxLength, f.country.autocomplete], ["text", "Country", true, 100, "country-name"]);
  assert.deepEqual([f.duration.type, f.duration.label, f.duration.required, f.duration.defaultValue], ["select", "Preferred duration", false, ""]);
  assert.deepEqual(f.duration.options, [
    { value: "", label: "Select duration" }, { value: "7 days", label: "7 days" }, { value: "14 days", label: "14 days" }, { value: "21 days", label: "21 days" },
  ]);
  // the month is optional and starts unanswered (no preference assumed), then the shared six months + Flexible
  assert.deepEqual([f.preferredMonth.type, f.preferredMonth.label, f.preferredMonth.required, f.preferredMonth.defaultValue, f.preferredMonth.mapsTo], ["select", "Preferred month", false, "", "message"]);
  assert.deepEqual(f.preferredMonth.options[0], { value: "", label: "Select month" });
  assert.deepEqual(f.preferredMonth.options.slice(1).map((o) => o.value), ["2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04", "flexible"]);
  assert.deepEqual([f.message.type, f.message.label, f.message.required, f.message.maxLength], ["textarea", "Any existing health conditions?", false, 2700]);
  assert.equal(f.message.hint, FAMILY_NOTE);
  assert.equal(COPY[FAMILY].familyFormNote, FAMILY_NOTE);
  assert.equal(COPY[PAIN].familyFormNote, undefined);
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
  assert.deepEqual(errs({ preferredMonth: "" }), []); // the month stays optional
  assert.deepEqual(errs({ preferredMonth: "2026-11" }), []);
  assert.deepEqual(errs({ preferredMonth: "2020-01" }), [["preferredMonth", "required"]]); // only its own options
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

// ── the quotation (owner facts) ───────────────────────────────────────────────────────────────────────────
test("quotation: what each stay includes and what to ask about, from the reviewed copy; family never lists private sessions as uniformly extra", () => {
  assert.deepEqual(C[FAMILY].page.stay.lists.map((l) => l.heading), ["Your family’s stay", "Services that may cost extra"]);
  assert.deepEqual(C[PAIN].page.stay.lists.map((l) => l.heading), ["Confirm what your stay includes", "Ask about additional charges"]);
  for (const slug of B2) {
    const [included, extra] = C[slug].page.stay.lists;
    assert.equal(included.extra, undefined, slug);
    assert.equal(extra.extra, true, slug);
    assert.deepEqual(C[slug].included, included.items, slug);
    assert.deepEqual(C[slug].chargedSeparately, extra.items, slug);
  }
  // INCLUSION-FACTS: the yoga tariff includes private sessions, so the family page never lists them as uniformly extra.
  assert.ok(!C[FAMILY].chargedSeparately.some((x) => /private/i.test(x)), C[FAMILY].chargedSeparately.join(" | "));
});

test("no Step-1 ConsultBar on batch 2: the replaced forms asked no program, month or length; the copy's programme name stays editorial", () => {
  for (const slug of B2) {
    assert.equal(C[slug].consultBar, false, slug);
    assert.equal(C[slug].programDefault, "", slug);
    assert.ok(COPY[slug].programDefault, `${slug}: the copy still names the programme (editorial context)`);
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
  assert.deepEqual(interactionForLink("tel:+919555156156", false), ["contact_click", "phone"]);
  assert.deepEqual(interactionForLink("mailto:info@kairali.com", false), ["contact_click", "email"]);
});

test("contact details: rendered from site.ts by the kit (enquiry and footer), never typed into the copy; link lint clean", () => {
  const enquiry = read("campaign-v2/sections/interactive/Enquiry.tsx");
  assert.match(enquiry, /href=\{contact\.phone\.href\}/);
  assert.match(enquiry, /href=\{`mailto:\$\{contact\.email\}`\}/);
  for (const slug of B2) {
    assert.deepEqual(pageLinks(C[slug]).filter((l) => /^(tel|mailto|sms):/i.test(l.href)), [], slug);
    const errors = lintCampaign(C[slug], NOW).errors.filter((e) => e.rule.startsWith("page."));
    assert.deepEqual(errors, [], slug);
  }
});

// ── films, doctors, villas, topics (the reviewed copy) ────────────────────────────────────────────────────
test("structure from the reviewed copy: 3 patient films as links, the 5 current doctors, 4 villas; pain 4 plan topics; family 16 care topics", () => {
  const VIDEOS = ["https://www.youtube.com/watch?v=3vWviQfW1Ug", "https://www.youtube.com/watch?v=4x01PtWfNnk", "https://www.youtube.com/watch?v=DcTMckQD3rc"];
  const VILLAS = ["/deluxe-villa/", "/classic-villa/", "/royal-villa/", "/maharaja-suite/"];
  for (const slug of B2) {
    const p = C[slug].page;
    assert.deepEqual(p.stories.films.map((f) => f.href), VIDEOS, slug);
    assert.ok(p.stories.films.every((f) => f.title.startsWith("Watch ") && fs.existsSync(P("public", f.thumb.src))), slug);
    assert.match(p.stories.body, /Individual experiences vary\./);
    assert.deepEqual(C[slug].doctors.map((d) => d.id), [...CURRENT_ROSTER], slug);
    assert.deepEqual(p.place.villas.map((v) => v.link.href), VILLAS, slug);
    assert.deepEqual(p.place.villas.map((v) => v.name), ["Deluxe Villa", "Classic Villa", "Royal Villa", "Maharaja Suite"], slug);
  }
  const pain = C[PAIN].page.offering;
  assert.equal(pain.kind, "cards");
  assert.deepEqual(pain.cards.map((c) => c.title), ["Ayurvedic therapies", "Medicines considered alongside your current care", "Food, movement and rest", "Reviews during the stay and guidance for home"]);
  const family = C[FAMILY].page.offering;
  assert.equal(family.kind, "index");
  assert.deepEqual(family.topics.map((t) => t.title), [
    "Panchakarma", "Addiction recovery", "Skin concerns", "Respiratory health", "Cardiovascular health and blood pressure", "Back pain and sciatica",
    "Stress and mental wellbeing", "Diabetes and metabolism", "Digestive and gut health", "Immunity and executive health assessment", "Joint care and arthritis",
    "Neurological care needs", "Women’s hormonal health", "Weight management", "Yoga and meditation", "Meals for the family",
  ]);
  // The day's routine, as prose in the quiet band (the old page's routine table is not carried over).
  assert.equal(C[FAMILY].page.rest.heading, "A day with time for care and time together");
});

test("written family testimonials stay quarantined: no byline, title or excerpt of the source's written stories renders", () => {
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
  for (const slug of B2) {
    const page = ` ${pageStrings(C[slug]).join(" | ")} `;
    for (const q of quarantined) assert.ok(!page.includes(q), `${slug} rendered: ${q}`);
    assert.doesNotMatch(page, /[“"][^”"]{40,}[”"]/, `${slug}: no quoted testimonial`);
  }
});

// ── owner rules ───────────────────────────────────────────────────────────────────────────────────────────
test("owner rules: Get Free Doctor Consultation; 'free' only for the initial consultation; no amounts and no tariff access", () => {
  for (const slug of B2) {
    const c = C[slug];
    assert.equal(c.cta.primary, "Get Free Doctor Consultation");
    assert.equal(c.cta.primarySupport, "Your initial consultation is free. Ask for a quotation covering treatment and any later services.");
    const strings = [...pageStrings(c), c.seo.title, c.seo.description];
    assert.deepEqual(strings.filter((s) => PRICE.test(s)), [], slug);
    assert.deepEqual(pageLinks(c).filter((l) => RATE_LINK.test(l.href) || RATE_LINK.test(l.text)).map((l) => l.href), [], slug);
    // "free" names the initial consultation, or says what is not free ("treatment, tests, medicines … are not").
    for (const s of strings) for (const sentence of s.split(/(?<=[.?!])\s+/)) {
      if (/\bfree\b/i.test(sentence)) assert.match(sentence, /consultation|treatment, tests, medicines/i, `${slug}: "${sentence}"`);
    }
  }
});

// ── batch 1 unchanged ─────────────────────────────────────────────────────────────────────────────────────
test("batch 1 unchanged: default form and body, no batch-2 keys, the generic note still renders there", () => {
  for (const slug of ["treatment-packages", "panchakarma"]) {
    const c = productionCampaign(slug);
    assert.equal(c.form.schema, PRODUCTION_CAMPAIGN_FORM);
    assert.equal("consultBar" in c, false, slug);
    assert.deepEqual(Object.keys(ROUTES[slug].productionForm).sort(), ["downloadGuide", "formVariant"], slug);
    assert.equal(ROUTES[slug].consultBar, undefined);
    assert.equal(COPY[slug].familyFormNote, undefined, slug);
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
  // The same English line; a German or Russian route passes its own words (production/ui.ts form.note).
  assert.match(read("campaign-v2/sections/interactive/EnquiryForm.tsx"),
    /\{i === 0 && schema\.genericNote !== false \? <p className="lp-enq__note">\{ui\?\.note \?\? "No medical details needed\. Your doctor asks for those privately at consultation\."\}<\/p> : null\}/);
});

test("pain gender stays optional and unanswered by default; valid selections preserve original payload", () => {
  const schema = resolveSchema(C[PAIN].form.schema, { campaign: C[PAIN], locale: "en", now: NOW });
  const fields = schema.steps[0].fields;
  assert.deepEqual(fields.map((f) => f.name), ["fullName", "rdogender", "email", "dialCode", "phone", "message"]);
  const gender = fields.find((f) => f.name === "rdogender");
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
