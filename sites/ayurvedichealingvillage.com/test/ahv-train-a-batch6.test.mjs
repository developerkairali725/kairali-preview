// Train A batch 6 (14 Oct 2026), source-level only: no browser, build or network. Rendered first-screen fit, real
// playback, consent interaction and the live public result still need the release owner's runtime acceptance.
//   AHV-WB.020.current-month · AHV-WB.021/459.phone-example · AHV-WB.021/161/304.checkbox-wording ·
//   AHV-WB.530.first-screen-cta · AHV-WB.249/320/430/272 guest-video + villa-gallery
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { ROUTES } from "../campaign-v2/production/bindings.ts";
import { COPY } from "../campaign-v2/production/pages/index.ts";
import { UI } from "../campaign-v2/production/ui.ts";
import { D_VILLAGE_AND_STORIES, ORDER, sectionOrder } from "../campaign-v2/production/section-order.ts";
import { FILMS } from "../campaign-v2/data/films.ts";
import { APPROVED_GALLERY_ADDITIONS } from "../campaign-v2/data/gallery-images.ts";
import { GUEST_VIDEO_ROUTES, routeAllowed, filmIdFromHref } from "../campaign-v2/production/sections/guest-video-policy.mjs";
import {
  MESSAGES, PRODUCTION_CAMPAIGN_FORM, campaignEnquiryForm, monthOptions, validateStep, CONSENT_FIELD,
} from "../campaign-v2/forms/schema.ts";
import { BATCH6 } from "./fixtures/train-a-batch6-20261014.mjs";
import { reverseTrainASource } from "./fixtures/train-a-20261014.mjs";
import { reverseTrainBSource } from "./fixtures/train-b-20261015.mjs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
// Train A integration: batch 7 (AHV-WB.*.whatsapp-message) later edited the same Enquiry wiring line; its exact recorded
// edits (test/fixtures/whatsapp-prefill-delta.json) are reversed before the batch 6 wiring assertion below.
const unWhatsApp = (p) => {
  let text = read(p);
  for (const e of [...JSON.parse(read("test/fixtures/whatsapp-prefill-delta.json")).edits[p]].reverse()) {
    assert.equal(text.split(e.to).length - 1, 1, `${p}: batch 7 edit occurs once`);
    text = text.replace(e.to, e.from);
  }
  return text;
};

// The production form's message lookup, as EnquiryForm.tsx writes it (pinned below).
const say = (ui, e) => ui?.errors[e.field === "fullName" ? "name" : e.field] ?? ui?.errors[e.code] ?? e.message;

test("AHV-WB.020: month choices start at the current month; values, length and Flexible unchanged", () => {
  const m = monthOptions({ locale: "en", now: new Date(Date.UTC(2026, 9, 14, 12)) });
  assert.deepEqual(m.map((o) => o.value), ["2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "flexible"]);
  assert.equal(m[0].label, "October 2026");
  assert.ok(m.slice(0, 6).every((o) => /^\d{4}-\d{2}$/.test(o.value)));
});

test("AHV-WB.021/459/161/304: English production errors name one box and no example number; kit, DE and RU unchanged", () => {
  const en = UI.en.form.errors;
  assert.deepEqual(en, {
    phone: "Please enter your WhatsApp or phone number with the country code.",
    consent: "Please tick the box so we can reply to you.",
  });
  assert.doesNotMatch(en.phone, /\d|\+/, "no invented or foreign example number");
  assert.doesNotMatch(en.consent, /first/);
  // The kit's English (non-production previews, multi-box three-step form) keeps its words.
  assert.equal(MESSAGES.consent, "Please tick the first box so we can reply to you.");
  assert.equal(MESSAGES.phone, "Please enter your WhatsApp or phone number with the country code, like +44 7700 900000.");
  assert.equal(UI.de.form.errors.phone, "Bitte geben Sie Ihre Telefonnummer mit Ländervorwahl ein, z. B. +49 30 123456.");
  assert.equal(UI.de.form.errors.consent, "Bitte setzen Sie das Häkchen, damit wir Ihnen antworten können.");
  assert.equal(UI.ru.form.errors.phone, "Пожалуйста, укажите номер телефона с кодом страны, например +7 900 000 00 00.");
  assert.equal(UI.ru.form.errors.consent, "Пожалуйста, отметьте согласие, чтобы мы могли вам ответить.");
  // The lookup the production form uses, and the wiring that hands it the page language's words.
  assert.match(read("campaign-v2/sections/interactive/EnquiryForm.tsx"),
    /const say = \(e: FieldError\) => ui\?\.errors\[e\.field === "fullName" \? "name" : e\.field\] \?\? ui\?\.errors\[e\.code\] \?\? e\.message;/);
  assert.match(unWhatsApp("campaign-v2/sections/interactive/Enquiry.tsx"), /\{\.\.\.\(production \? \{ production, ui: ui\.form \} : \{\}\)\}/);
  // R10 production form: missing consent, a bad dial code and a bad number all read the new English words.
  const r10 = validateStep(PRODUCTION_CAMPAIGN_FORM, 0, { fullName: "A", email: "a@b.co", dialCode: "91", phone: "12", [CONSENT_FIELD]: false }, "whatsapp");
  assert.deepEqual(r10.map((e) => [e.field, say(UI.en.form, e)]), [
    ["dialCode", en.phone], ["phone", en.phone], ["consent", en.consent],
  ]);
  // Campaign enquiry form (/lp/ and DcPage routes): optional phone, same words when one is entered wrongly.
  const lp = validateStep(campaignEnquiryForm("en"), 0, { fullName: "A", email: "a@b.co", phone: "12", [CONSENT_FIELD]: false }, "whatsapp");
  assert.deepEqual(lp.map((e) => [e.field, say(UI.en.form, e)]), [["phone", en.phone], ["consent", en.consent]]);
  // Requiredness and validation are unchanged: a complete form still passes, and an empty optional phone is not an error.
  assert.deepEqual(validateStep(campaignEnquiryForm("en"), 0, { fullName: "A", email: "a@b.co", phone: "", [CONSENT_FIELD]: true }, "whatsapp"), []);
});

test("AHV-WB.530: the Russian phone first screen shows the existing consultation button; Ask and other routes unchanged", () => {
  const css = read("campaign-v2/production/production.css");
  const block = BATCH6.files["campaign-v2/production/production.css"].replacements[0].after;
  assert.equal(css.split(block).length - 1, 1);
  const rules = [...block.matchAll(/^\s+([^{}\n]+?) \{ ([^}]+) \}$/gm)].map((m) => [m[1], m[2]]);
  assert.deepEqual(rules, [
    ['.lp-prod[data-variant="C"]:lang(ru) .lp-hero__ctas', "display: flex;"],
    ['.lp-prod[data-variant="C"]:lang(ru) .lp-hero__ctas .lp-btn', "width: 100%;"],
    ['.lp-prod[data-variant="C"]:lang(ru) .lp-hero__ask', "display: none;"],
  ]);
  assert.match(block, /@media \(max-width: 767px\) \{/);
  // The kit rule it overrides on phones, and the only C route in Russian.
  assert.match(read("campaign-v2/sections/sections.css"), /\[data-variant="C"\] \.lp-hero__ctas\{display:none\}/);
  const ruC = PRODUCTION_SLUGS.filter((s) => ROUTES[s].locale === "ru" && ROUTES[s].variant === "C");
  assert.deepEqual(ruC, ["lp-treatment-kerala-ru"]);
  const c = productionCampaign("lp-treatment-kerala-ru");
  assert.equal(c.cta.primary, "Бесплатная консультация врача");
  // Same link, label and tracking: the hero's existing primary button.
  assert.match(read("campaign-v2/sections/Hero.tsx"), /<a className="lp-btn lp-btn--primary lp-hero__cta" href="#enquiry" data-track="cta_click" data-track-cta="consult" data-track-position="hero">\{primary\}<\/a>/);
  // The mobile Ask label still reads the (hidden) hero Ask control.
  assert.match(read("campaign-v2/production/mobile-ask-label.ts"), /\.lp-prod\[data-variant="C"\] \.lp-hero__ask/);
  // The generated bundle carries it.
  assert.equal(read("campaign-v2/production/document.css").split(block).length - 1, 1);
});

const SOURCES = {
  "south-india-cities": ["treatment-kerala", "lp-hospital-kerala"],
  "lp-south-india": ["lp-hospital-kerala", "ayurveda-retreat"],
  "brand": ["ayurveda-retreat", "lp-treatment-packages"],
  "lp-panchakarma": ["lp-cleansing-centre", "lp-cleansing-centre"],
};

test("AHV-WB.249/320/430/272: four D routes show the existing village and consented films, reviewed copy reused verbatim", () => {
  assert.deepEqual([...D_VILLAGE_AND_STORIES].sort(), Object.keys(SOURCES).sort());
  assert.deepEqual([...BATCH6.dSlugs].sort(), Object.keys(SOURCES).sort());
  assert.deepEqual(ORDER.D, ["lead", "offering", "pathway", "stay", "physicians"], "the D default is unchanged");
  const addedIds = new Set(APPROVED_GALLERY_ADDITIONS.map((g) => g.image.id));
  for (const [slug, [placeFrom, storiesFrom]] of Object.entries(SOURCES)) {
    const c = productionCampaign(slug);
    assert.equal(ROUTES[slug].variant, "D", slug);
    assert.equal(ROUTES[slug].locale ?? "en", "en", slug);
    assert.deepEqual(sectionOrder(c, "D"), ["lead", "physicians", "offering", "pathway", "place", "stories", "stay"], slug);
    assert.deepEqual(COPY[slug].page.place, COPY[placeFrom].page.place, `${slug}: village copy from ${placeFrom}`);
    assert.deepEqual(COPY[slug].page.stories, COPY[storiesFrom].page.stories, `${slug}: films from ${storiesFrom}`);
    for (const f of c.page.stories.films) {
      const id = filmIdFromHref(f.href);
      assert.ok(id && FILMS[id]?.consent === true, `${slug}: ${f.href} is a consented registry film`);
      assert.ok(fs.existsSync(new URL(`../public${f.thumb.src}`, import.meta.url)), f.thumb.src);
    }
    assert.match(c.page.stories.body, /Individual experiences vary\./);
    assert.ok(routeAllowed(ROUTES[slug].route, "en"), slug);
    assert.ok(GUEST_VIDEO_ROUTES.includes(ROUTES[slug].route), slug);
    // The village shows the route's own approved gallery; the yoga-consented additions stay out of these routes.
    assert.ok(c.gallery.length >= 5, slug);
    assert.ok(c.gallery.every((g) => !addedIds.has(g.image.id)), `${slug}: no APPROVED_GALLERY_ADDITIONS`);
    assert.ok(c.gallery.every((g) => g.image.id !== ROUTES[slug].heroImage.id), `${slug}: the hero is not repeated`);
  }
  // lp-brand (no batch-6 row) keeps the shortest D path, no films and no player.
  const lpBrand = productionCampaign("lp-brand");
  assert.deepEqual(sectionOrder(lpBrand, "D"), ["lead", "physicians", "offering", "pathway", "stay"]);
  assert.equal(routeAllowed(ROUTES["lp-brand"].route, "en"), false);
});

test("batch 6 deltas reverse exactly to the prior source bytes", () => {
  for (const path of Object.keys(BATCH6.files)) {
    // Train A: later candidates edited some of these files too; the composed reversal checks batch 6's own after-bytes.
    // Train B (15 Oct 2026): its exact deltas are removed first (fixtures/train-b-20261015.mjs).
    const trainA = reverseTrainBSource(path, read(path));
    const before = reverseTrainASource(path, trainA);
    assert.notEqual(before, trainA, path);
  }
  assert.equal(BATCH6.base.length, 40);
});
