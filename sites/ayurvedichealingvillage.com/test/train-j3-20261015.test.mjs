// Train J batch 3 (15 Oct 2026) on the Train I head 00e944e44. Source only: no build, deploy, network, form submission or
// lead. Exact deltas and reversal: fixtures/train-j3-20261015.json / .mjs (peeled first by the Train I chain).
//   AHV-WB.123.change / AHV-WB.166.change   each page its own share picture (monsoon, ayurveda retreat)
//   AHV-WB.253.change                       South India travel FAQ: verified airports + owner decision 6 pick-up line
//   AHV-WB.298.change / AHV-WB.454.change   card photographs and shorter card text (weight, /lp/treatment-in-kerala/)
//   AHV-WB.304.checkbox-wording             already in the head (Train A batch 6): one box, no "first"
//   AHV-WB.362.guest-video / .villa-gallery /lp/kairali-brand/ village section and consented films, as its sibling
//   AHV-WB.372.change                       the heritage answer names NABH accreditation and the group (no year)
//   AHV-WB.452.benefit-copy                 one non-repeating, non-outcome stay line on /lp/treatment-in-kerala/
//   AHV-WB.514.whatsapp-message             German page-context WhatsApp prefill (owner decisions 9 and 39)
//   AHV-WB.526 / AHV-WB.549.legal-links-layout  the form's privacy link uses the page footer's own label
//   AHV-LATER-023.01                        owner decision 38: the first campaign of the visit carries into later enquiries
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { runInNewContext } from "node:vm";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { ROUTES, CARD_PICKS_20261015J3 } from "../campaign-v2/production/bindings.ts";
import { productionMetadata, productionJsonLd } from "../campaign-v2/production/metadata.ts";
import { IMAGES } from "../campaign-v2/data/images.ts";
import { UI } from "../campaign-v2/production/ui.ts";
import { D_VILLAGE_AND_STORIES, sectionOrder } from "../campaign-v2/production/section-order.ts";
import { APPROVED_FILM_IDS, GUEST_VIDEO_ROUTES, routeAllowed, filmIdFromHref } from "../campaign-v2/production/sections/guest-video-policy.mjs";
import { prefillHref, prefillMessage, WHATSAPP_BASE } from "../campaign-v2/production/whatsapp-prefill.ts";
import { CAMPAIGN_ENQUIRY_COPY, campaignEnquiryForm } from "../campaign-v2/forms/schema.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { TRAIN_J3, ABSENT, reverseTrainJ3Source, peelTrainJ3Source, reverseTrainJ3Config, reverseTrainJ3Binding } from "./fixtures/train-j3-20261015.mjs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const plain = (v) => JSON.parse(JSON.stringify(v));
const C = Object.fromEntries(PRODUCTION_SLUGS.map((s) => [s, productionCampaign(s)]));
const sentences = (t) => t.split(/(?<=[.!?])\s+/).filter(Boolean);

// ── the recorded delta ────────────────────────────────────────────────────────────────────────────────────────────
test("J3 fixture: every recorded file is exactly the Train J3 bytes and reverses exactly to the Train I head", () => {
  assert.equal(TRAIN_J3.base, "00e944e4440c4b1710bffc29cc7c2bea8b385fdc");
  assert.equal(Object.keys(TRAIN_J3.files).length, 12);
  for (const [p, e] of Object.entries(TRAIN_J3.files)) {
    const now = read(p);
    assert.equal(sha(now), e.afterSHA256, p);
    const head = reverseTrainJ3Source(p, now);
    assert.equal(sha(head), e.beforeSHA256, p);
    assert.equal(reverseTrainJ3Source(p, head), head, `${p}: head bytes pass through`);
    assert.equal(peelTrainJ3Source(p, now), head, p);
    assert.equal(peelTrainJ3Source(p, "other"), "other", p);
    for (const r of e.replacements) assert.ok(TRAIN_J3.rows.some((id) => r.row.includes(id)), `${p}: ${r.row}`);
  }
  assert.throws(() => reverseTrainJ3Source("campaign-v2/production/bindings.ts", "neither state"), /exactly the Train J3 source/);
  // Each config change reverses exactly, and a head-state config passes through.
  for (const slug of Object.keys(TRAIN_J3.configChanges)) {
    const c = reverseTrainJ3Config(slug, plain(C[slug]));
    for (const { path, before } of TRAIN_J3.configChanges[slug]) {
      const parent = path.slice(0, -1).reduce((o, k) => o[k], c);
      if (before === ABSENT) assert.equal(Object.hasOwn(parent, path.at(-1)), false, `${slug} ${path.join(".")}`);
      else assert.deepEqual(parent[path.at(-1)], before, `${slug} ${path.join(".")}`);
    }
    assert.deepEqual(reverseTrainJ3Config(slug, plain(c)), c, `${slug}: head config passes through`);
  }
  for (const slug of Object.keys(TRAIN_J3.bindings)) {
    const b = reverseTrainJ3Binding(slug, ROUTES[slug]);
    for (const f of Object.keys(TRAIN_J3.bindings[slug]).filter((k) => k !== "row")) assert.equal(Object.hasOwn(b, f), false, `${slug}.${f}`);
  }
});

// ── AHV-WB.123.change / AHV-WB.166.change ─────────────────────────────────────────────────────────────────────────
test("AHV-WB.123/166: monsoon and ayurveda retreat each have their own 1200×630 share picture; nothing else moves", () => {
  const ogFile = (url) => fs.readFileSync(new URL(`../public${new URL(url).pathname}`, import.meta.url));
  const frame = (buf) => {
    assert.deepEqual([...buf.subarray(0, 3)], [0xff, 0xd8, 0xff]);
    let at = 2;
    while (buf[at] === 0xff && !(buf[at + 1] >= 0xc0 && buf[at + 1] <= 0xc2)) at += 2 + buf.readUInt16BE(at + 2);
    return { height: buf.readUInt16BE(at + 5), width: buf.readUInt16BE(at + 7) };
  };
  const m = ROUTES["monsoon-wellness"];
  assert.deepEqual(m.og, { url: "https://ayurvedichealingvillage.com/images/og/share-monsoon-wellness.jpg", width: 1200, height: 630, locale: "en_IN" });
  assert.equal(m.ogImageAlt, IMAGES["ahv-img-016"].alt);
  assert.equal(IMAGES["ahv-img-016"].gccSafe, true);
  const rec = TRAIN_J3.shareImages["public/images/og/share-monsoon-wellness.jpg"];
  const buf = ogFile(m.og.url);
  assert.deepEqual(frame(buf), { height: 630, width: 1200 });
  assert.equal(sha(buf), rec.sha256);
  assert.equal(rec.source, IMAGES["ahv-img-016"].src);
  assert.equal(sha(fs.readFileSync(new URL(`../public${rec.source}`, import.meta.url))), rec.sourceSHA256);
  const r = ROUTES["ayurveda-retreat"];
  assert.deepEqual(r.og, { url: "https://ayurvedichealingvillage.com/images/og/ayurveda-retreat-kerala.html.jpg", width: 1200, height: 630, locale: "en_IN" });
  assert.equal(r.ogImageAlt, undefined);
  assert.deepEqual(frame(ogFile(r.og.url)), { height: 630, width: 1200 });
  for (const [slug, alt] of [["monsoon-wellness", IMAGES["ahv-img-016"].alt], ["ayurveda-retreat", undefined]]) {
    const live = productionMetadata(slug, C[slug], { AHV_STAGING: "0" });
    assert.deepEqual(live.openGraph.images, [{ url: ROUTES[slug].og.url, width: 1200, height: 630, ...(alt ? { alt } : {}) }], slug);
    assert.deepEqual(live.twitter.images, [ROUTES[slug].og.url], slug);
    assert.equal(live.openGraph.locale, "en_IN");
    assert.equal(live.openGraph.siteName, "Kairali Ayurvedic Healing Village");
  }
  // Every route's share picture is now its own: no two production routes share an og:image, and none uses the R10 image.
  const urls = PRODUCTION_SLUGS.map((s) => productionMetadata(s, C[s], { AHV_STAGING: "0" }).openGraph.images[0].url);
  const shared = urls.filter((u, i) => urls.indexOf(u) !== i);
  assert.ok(!urls.includes("https://ayurvedichealingvillage.com/landing/r10/og.jpg"), "no route left on the shared R10 image");
  // The two /lp/ routes that already shared wx-hero before this batch (lp-hospital-kerala, lp-brand) and the two that shared
  // consultation-pulse.webp are outside these rows; nothing in Train J3 adds a new duplicate.
  for (const u of shared) assert.ok(!["https://ayurvedichealingvillage.com/images/og/share-monsoon-wellness.jpg", "https://ayurvedichealingvillage.com/images/og/ayurveda-retreat-kerala.html.jpg"].includes(u), u);
  // Only these two bindings gain an og.
  for (const slug of PRODUCTION_SLUGS) {
    const before = reverseTrainJ3Binding(slug, ROUTES[slug]);
    if (!["monsoon-wellness", "ayurveda-retreat"].includes(slug)) assert.deepEqual(before.og, ROUTES[slug].og, slug);
  }
});

// ── AHV-WB.253.change ─────────────────────────────────────────────────────────────────────────────────────────────
test("AHV-WB.253: the travel FAQ names the verified CJB/COK/CCJ road distances and the owner's pick-up line, in the FAQ schema too", () => {
  const faq = C["south-india-cities"].faq.find((f) => f.q === "Which airport or station should I use?");
  assert.equal(faq.a, "The nearest airport is Coimbatore International Airport (CJB), about 66 km by road; Cochin International Airport (COK) is about 114 km and Calicut International Airport (CCJ) about 116 km. Share your starting point and proposed itinerary with patient care, and ask about onward travel to the Healing Village. Airport pick-up can be arranged on request at an extra charge.");
  // Owner decision 6: no prices or travel times; no unverified railway distance.
  assert.doesNotMatch(faq.a, /₹|INR|Rs\.?|\d+\s*(?:min|minutes|hours?)|railway|Junction/i);
  const ld = productionJsonLd("south-india-cities", C["south-india-cities"]).find((n) => n["@type"] === "FAQPage");
  assert.ok(JSON.stringify(ld).includes("about 66 km by road"), "FAQPage schema carries the same answer");
  assert.deepEqual(lintCampaign(C["south-india-cities"]).errors, []);
});

// ── AHV-WB.298.change / AHV-WB.454.change ─────────────────────────────────────────────────────────────────────────
test("AHV-WB.298/454: each programme card carries one new, no-person image-bank photograph and one shorter sentence", () => {
  assert.deepEqual(Object.keys(CARD_PICKS_20261015J3), ["weight-management", "lp-treatment-kerala"]);
  const SAFETY = { "lp-treatment-kerala": [/does not automatically include all five classical procedures/, /outcomes vary between individuals/] , "weight-management": [/injury or limitation/] };
  for (const [slug, ids] of Object.entries(CARD_PICKS_20261015J3)) {
    const c = C[slug];
    const head = reverseTrainJ3Config(slug, plain(c));
    const b = ROUTES[slug];
    const own = new Set([b.heroImage.id, b.mobileImage.id, b.pathwayImage.id, ...b.gallery.map((g) => g.image.id)]);
    assert.equal(new Set(ids).size, ids.length, slug);
    assert.deepEqual(c.page.offering.cards.map((card) => card.image?.id), ids, slug);
    for (const id of ids) {
      const im = IMAGES[id];
      assert.ok(im && !own.has(id), `${slug}: ${id} is a registry photograph and not the route's own`);
      assert.equal(im.gccSafe, true, id);
      assert.ok(["not-applicable", "confirmed"].includes(im.consent), `${id}: ${im.consent}`);
      assert.match(im.src, /^\/ahv\/assets\/img\/owner-(?:approved-20260928|decision-20261015)\//, `${id}: owner-approved image bank`);
      assert.equal(im.location, "palakkad", id);
      assert.ok(fs.existsSync(new URL(`../public${im.src}`, import.meta.url)), im.src);
    }
    c.page.offering.cards.forEach((card, i) => {
      const was = head.page.offering.cards[i].paragraphs.join(" ");
      const now = card.paragraphs.join(" ");
      assert.equal(card.title, head.page.offering.cards[i].title, `${slug} card ${i}: title unchanged`);
      assert.equal(card.paragraphs.length, 1);
      assert.equal(sentences(now).length, 1, `${slug} card ${i}: one sentence`);
      assert.ok(now.length < was.length, `${slug} card ${i}: shorter (${now.length} < ${was.length})`);
    });
    for (const re of SAFETY[slug]) assert.match(JSON.stringify(c.page.offering), re, `${slug}: safety line kept`);
    assert.deepEqual(lintCampaign(c).errors, [], slug);
  }
  // Weight copy: no new weight or clinical claim (weight-management.ts header).
  assert.doesNotMatch(JSON.stringify(C["weight-management"].page.offering), /\bkg\b|kilo|BMI|lose|loss|result|guarantee/i);
  // /lp/treatment-in-kerala/ steps I and III are one sentence each; step II is untouched.
  const steps = C["lp-treatment-kerala"].page.pathway.steps;
  const headSteps = reverseTrainJ3Config("lp-treatment-kerala", plain(C["lp-treatment-kerala"])).page.pathway.steps;
  assert.deepEqual(steps.map((s) => sentences(s.body).length), [1, 1, 1]);
  assert.equal(steps[1].body, headSteps[1].body);
  assert.match(steps[0].body, /health history, current medicines, relevant records/);
  assert.match(steps[2].body, /before discharge, ask which guidance to continue at home/);
});

// ── AHV-WB.304.checkbox-wording (already satisfied in the head) ──────────────────────────────────────────────────
test("AHV-WB.304: the production English consent error names one box (Train A batch 6, unchanged here)", () => {
  assert.equal(UI.en.form.errors.consent, "Please tick the box so we can reply to you.");
  assert.doesNotMatch(UI.en.form.errors.consent, /first/);
  assert.equal(TRAIN_J3.files["campaign-v2/production/ui.ts"], undefined);
});

// ── AHV-WB.362.guest-video / .villa-gallery ───────────────────────────────────────────────────────────────────────
test("AHV-WB.362: /lp/kairali-brand/ shows the village section and the consented films of its sibling brand page", () => {
  assert.deepEqual(D_VILLAGE_AND_STORIES, ["south-india-cities", "brand", "lp-south-india", "lp-panchakarma", "lp-brand"]);
  const c = C["lp-brand"];
  assert.equal(c.variant ?? ROUTES["lp-brand"].variant, "D");
  assert.deepEqual(sectionOrder(c, "D"), ["lead", "physicians", "offering", "pathway", "place", "stories", "stay"]);
  assert.deepEqual(c.page.place, C.brand.page.place);
  assert.deepEqual(c.page.stories, C.brand.page.stories);
  assert.deepEqual(c.page.stories.films.map((f) => filmIdFromHref(f.href)), ["iPARaMRASUs", "3vWviQfW1Ug", "4x01PtWfNnk"]);
  for (const f of c.page.stories.films) assert.ok(APPROVED_FILM_IDS.includes(filmIdFromHref(f.href)));
  assert.ok(GUEST_VIDEO_ROUTES.includes("/lp/kairali-brand/"));
  assert.equal(GUEST_VIDEO_ROUTES.length, 20);
  assert.equal(routeAllowed("/lp/kairali-brand/", "en"), true);
  assert.equal(routeAllowed("/lp/kairali-brand/", "de"), false);
  // The village gallery is the route's own approved registry photographs (no consent-bound yoga or staff photograph).
  const ids = ROUTES["lp-brand"].gallery.map((g) => g.image.id);
  assert.ok(ids.includes("kt-116") && ids.includes("kt-314") && ids.includes("wx-dining"));
  assert.ok(!ids.some((id) => /yoga|ahv-img-010/.test(id)), ids.join(","));
  assert.deepEqual(lintCampaign(c).errors, []);
});

// ── AHV-WB.372.change ─────────────────────────────────────────────────────────────────────────────────────────────
test("AHV-WB.372: the heritage answer names the NABH accreditation and the group; no year (owner year rule) and no award text", () => {
  const a = C["lp-brand"].faq.find((f) => f.q === "What does Kairali’s Ayurvedic heritage refer to?").a;
  assert.match(a, /The Healing Village is an NABH-accredited Ayurvedic hospital of the Kairali Ayurvedic Group\./);
  assert.doesNotMatch(a, /\b(18|19|20)\d{2}\b|Tripadvisor|award/i);
});

// ── AHV-WB.452.benefit-copy ───────────────────────────────────────────────────────────────────────────────────────
test("AHV-WB.452: one stay line that repeats no earlier lead sentence and makes no outcome claim", () => {
  const p = C["lp-treatment-kerala"].page.lead.paragraphs;
  const head = reverseTrainJ3Config("lp-treatment-kerala", plain(C["lp-treatment-kerala"])).page.lead.paragraphs;
  assert.deepEqual(p.slice(0, 2), head);
  assert.equal(p.length, 3);
  assert.equal(p[2], "What your stay gives you: a private villa in the village gardens, a patient care team for companion, access and travel arrangements, and the hours between appointments to walk in the gardens or simply rest.");
  for (const s of sentences(head.join(" "))) assert.ok(!p[2].includes(s), s);
  assert.doesNotMatch(p[2], /relie|cure|heal|result|improv|better|guarantee|outcome/i);
  // Every clause comes from the page's own approved copy (rest and place).
  const own = JSON.stringify([C["lp-treatment-kerala"].page.rest, C["lp-treatment-kerala"].page.place]);
  for (const w of ["Private villas", "gardens", "companion", "access", "travel arrangements", "walk in the gardens", "simply rest"]) assert.ok(own.includes(w), w);
});

// ── AHV-WB.514.whatsapp-message ───────────────────────────────────────────────────────────────────────────────────
test("AHV-WB.514: the German page gets the same page-context prefill as the Russian page, same number, text only", () => {
  assert.equal(prefillMessage("de", "Ayurvedische Behandlung in Kerala", "/lp/behandlung-in-kerala/"), "Hallo, ich möchte mich nach „Ayurvedische Behandlung in Kerala“ erkundigen (/lp/behandlung-in-kerala/).");
  const href = prefillHref("de", "T", "/lp/behandlung-in-kerala/");
  assert.ok(href.startsWith(`${WHATSAPP_BASE}?text=`));
  assert.equal(new URL(href).searchParams.get("text"), "Hallo, ich möchte mich nach „T“ erkundigen (/lp/behandlung-in-kerala/).");
  assert.deepEqual([...new URL(href).searchParams.keys()], ["text"]);
  // English and Russian are unchanged.
  assert.equal(prefillMessage("en", "T", "/p/"), "Hello, I would like to enquire about T (/p/).");
  assert.equal(prefillMessage("ru", "T", "/p/"), "Здравствуйте! Хочу узнать подробнее: «T» (/p/).");
  const page = read("app/(ppc-v2-de)/lp/behandlung-in-kerala/page.tsx");
  assert.equal(page.match(/<WhatsAppPrefill locale="de" \/>/g)?.length, 1);
  assert.match(page, /import WhatsAppPrefill from "\.\.\/\.\.\/\.\.\/\.\.\/campaign-v2\/production\/WhatsAppPrefill";/);
  // The server-rendered template file is untouched.
  assert.equal(TRAIN_J3.files["campaign-v2/production/whatsapp.ts"], undefined);
});

// ── AHV-WB.526 / AHV-WB.549.legal-links-layout ────────────────────────────────────────────────────────────────────
test("AHV-WB.526/549: the form's privacy link reads the page footer's own label; consent wording, targets and English unchanged", () => {
  assert.equal(CAMPAIGN_ENQUIRY_COPY.de.privacy, UI.de.footer.privacy);
  assert.equal(CAMPAIGN_ENQUIRY_COPY.ru.privacy, UI.ru.footer.privacy);
  assert.equal(campaignEnquiryForm("de").privacyLabel, "Datenschutz (EN)");
  assert.equal(campaignEnquiryForm("ru").privacyLabel, "Конфиденциальность (EN)");
  assert.equal(campaignEnquiryForm("en").privacyLabel, "Privacy policy");
  assert.equal(CAMPAIGN_ENQUIRY_COPY.de.consent, "Ich stimme zu, zu meiner Anfrage kontaktiert zu werden.");
  assert.equal(CAMPAIGN_ENQUIRY_COPY.ru.consent, "Я согласен(на), чтобы со мной связались по поводу моего запроса.");
  for (const slug of ["lp-behandlung-kerala", "lp-treatment-kerala-ru"]) {
    const c = C[slug];
    const head = reverseTrainJ3Config(slug, plain(c));
    const { privacyLabel: _a, ...now } = plain(c.form.schema);
    const { privacyLabel: _b, ...was } = head.form.schema;
    assert.deepEqual(now, was, `${slug}: only the link text changed`);
    const locale = slug === "lp-behandlung-kerala" ? "de" : "ru";
    for (const ch of ["whatsapp", "email", "phone"]) assert.equal(c.form.schema.consentLabel(ch), CAMPAIGN_ENQUIRY_COPY[locale].consent, `${slug} ${ch}: consent wording unchanged`);
  }
  const form = read("campaign-v2/sections/interactive/EnquiryForm.tsx");
  assert.match(form, /href=\{production \? "\/new-privacy-policy\/" : privacyHref\}/);
  assert.equal(TRAIN_J3.files["campaign-v2/sections/interactive/EnquiryForm.tsx"], undefined);
});

// ── AHV-LATER-023.01 (owner decision 38) ──────────────────────────────────────────────────────────────────────────
const consentSource = read("app/(english)/_families/consent-runtime.ts");
const consentRuntime = consentSource.slice(consentSource.indexOf("`") + 1, consentSource.lastIndexOf("`"));
function browser(choice, search) {
  const items = new Map([["ktahv-consent", choice]]);
  const storage = { getItem: (k) => items.get(k) ?? null, setItem: (k, v) => items.set(k, String(v)), removeItem: (k) => items.delete(k) };
  const ctx = {
    URL, URLSearchParams, JSON, Date, Promise, localStorage: storage, sessionStorage: storage,
    location: { origin: "https://ayurvedichealingvillage.com", pathname: "/lp/kairali-brand/", search, hash: "", href: "https://ayurvedichealingvillage.com/lp/kairali-brand/" + search, assign() {}, reload() {} },
    document: { referrer: "", addEventListener() {}, createElement: () => ({}), head: { appendChild() {} }, getElementById: () => null },
    setTimeout() {},
  };
  ctx.window = ctx;
  runInNewContext(`var cfg={measurement:{ga4:"G-test",adsTagId:"GT-TEST",adsSendTo:"AW-test/action",environment:"production"}};var host=document.body;${consentRuntime}\nwindow.AHV_SET_CONSENT({analytics:${choice === "accepted"},advertising:${choice === "accepted"}});`, ctx);
  return ctx;
}
test("AHV-LATER-023.01: with advertising consent, the first campaign of the visit carries to later pages and later ad clicks", () => {
  const ctx = browser("accepted", "?utm_source=google&utm_campaign=Brand&gclid=first123");
  assert.deepEqual({ ...ctx.AHV_MEASUREMENT.attribution() }, { gclid: "first123", utm_source: "google", utm_campaign: "Brand" });
  // Programme exploration: another page without campaign parameters.
  ctx.location.search = ""; ctx.location.pathname = "/panchakarma-therapy/";
  assert.equal(ctx.AHV_MEASUREMENT.attribution().gclid, "first123");
  // A later click on another ad in the same visit does not overwrite the original campaign.
  ctx.location.search = "?utm_campaign=Other&gclid=second456";
  assert.deepEqual({ ...ctx.AHV_MEASUREMENT.attribution() }, { gclid: "first123", utm_source: "google", utm_campaign: "Brand" });
  // The visit continues while pages read it (30 minutes without one ends it).
  const key = "ahv-paid-attribution-v1";
  const saved = JSON.parse(ctx.sessionStorage.getItem(key));
  ctx.sessionStorage.setItem(key, JSON.stringify({ at: Date.now() - 1799000, values: saved.values }));
  ctx.location.search = "";
  assert.equal(ctx.AHV_MEASUREMENT.attribution().gclid, "first123");
  assert.ok(Date.now() - JSON.parse(ctx.sessionStorage.getItem(key)).at < 5000, "reading refreshes the visit");
  ctx.sessionStorage.setItem(key, JSON.stringify({ at: Date.now() - 1800001, values: saved.values }));
  assert.equal(Object.keys(ctx.AHV_MEASUREMENT.attribution()).length, 0, "expired after 30 minutes without a page");
  assert.equal(ctx.sessionStorage.getItem(key), null);
  // After expiry a new paid arrival starts a new visit.
  ctx.location.search = "?gclid=next789";
  assert.equal(ctx.AHV_MEASUREMENT.attribution().gclid, "next789");
  // Unsafe stored values are never returned; only the allow-listed keys are kept.
  ctx.sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), values: { gclid: "bad value!", email: "a@b.c" } }));
  ctx.location.search = "?gclid=ok1";
  assert.deepEqual({ ...ctx.AHV_MEASUREMENT.attribution() }, { gclid: "ok1" });
});
test("AHV-LATER-023.01: without advertising consent nothing is stored or carried (consent behaviour unchanged)", () => {
  const ctx = browser("declined", "?gclid=first123&utm_campaign=Brand");
  assert.deepEqual({ ...ctx.AHV_MEASUREMENT.attribution() }, { gclid: "first123", utm_campaign: "Brand" });
  assert.equal(ctx.sessionStorage.getItem("ahv-paid-attribution-v1"), null);
  ctx.location.search = "";
  assert.deepEqual({ ...ctx.AHV_MEASUREMENT.attribution() }, {});
  // Withdrawal still clears the stored visit (AHV_SET_CONSENT, unchanged).
  assert.match(consentRuntime, /if \(changed && measurementStarted\) \{\n\s+\/\/ Revoke first[\s\S]*?sessionStorage\.removeItem\("ahv-paid-attribution-v1"\)/);
  // Payload fields only: no new tag, script or endpoint in the delta.
  const delta = TRAIN_J3.files["app/(english)/_families/consent-runtime.ts"].replacements.map((r) => r.after).join("\n");
  assert.doesNotMatch(delta, /createElement|gtag\(|fbq\(|clarity\(|https?:\/\//);
});
