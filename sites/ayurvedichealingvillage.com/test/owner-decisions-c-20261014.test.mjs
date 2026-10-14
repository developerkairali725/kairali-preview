// Owner decisions 9, 10 and 11 of 14 Oct 2026 (deliverables/WOPS-WEBSITE-SEQUENTIAL-20261008-001/recovery-20261014/
// OWNER-DECISIONS-20261014-ANSWERS.json). Source-level checks only: no build, no browser.
//   9  Russian WhatsApp prefill on /lp/treatment-in-kerala-russian/ (AHV-WB.536).
//   10 Doctor / pulse-check / village photographs replace bare-back therapy hero and steps photographs
//      (AHV-WB.005 hero+how, .060, .400 how, .403, .445 hero+how).
//   11 The existing English guest films on the German and Russian routes, labelled as English (AHV-WB.519, .541).
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isBareWhatsApp, prefillHref, prefillMessage, WHATSAPP_BASE } from "../campaign-v2/production/whatsapp-prefill.ts";
import { PHOTO_PICKS_20261014, ROUTES } from "../campaign-v2/production/bindings.ts";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { IMAGES } from "../campaign-v2/data/images.ts";
import { APPROVED_FILM_IDS, filmIdFromHref, routeAllowed } from "../campaign-v2/production/sections/guest-video-policy.mjs";
import fixture from "./fixtures/owner-decisions-c-20261014.json" with { type: "json" };
import { candidateSource } from "./fixtures/train-b-20261015.mjs";
import { reverseTrainFBindings, reverseTrainFConfig } from "./fixtures/train-f-20261015.mjs";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");

// ── 9: Russian WhatsApp prefill ─────────────────────────────────────────────────────────────────────────────────

test("9: the English prefill is the approved LpSticky sentence, unchanged", () => {
  const sticky = read("app/(lp)/_components/lp-sticky.tsx");
  assert.match(sticky, /const message = "Hello, I would like to enquire about " \+ document\.title \+ " \(" \+ window\.location\.pathname \+ "\)\.";/);
  assert.equal(prefillMessage("en", "T", "/p/"), "Hello, I would like to enquire about T (/p/).");
});

test("9: Russian prefill — a plain translation, same number, the text parameter URL-encoded", () => {
  const title = "Аюрведическое лечение в Керале | Kairali";
  const route = "/lp/treatment-in-kerala-russian/";
  const msg = prefillMessage("ru", title, route);
  assert.equal(msg, "Здравствуйте! Хочу узнать подробнее: «Аюрведическое лечение в Керале | Kairali» (/lp/treatment-in-kerala-russian/).");
  const href = prefillHref("ru", title, route);
  assert.equal(WHATSAPP_BASE, "https://wa.me/919289838797");
  assert.ok(href.startsWith("https://wa.me/919289838797?text="));
  const url = new URL(href);
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/919289838797");
  assert.deepEqual([...url.searchParams.keys()], ["text"]);
  assert.equal(url.searchParams.get("text"), msg);
  assert.doesNotMatch(href.slice(WHATSAPP_BASE.length + 6), /[\s«»|А-Яа-я]/, "every reserved or non-ASCII character is percent-encoded");
  assert.equal(decodeURIComponent(href.slice(WHATSAPP_BASE.length + 6)), msg);
});

test("9: only the bare site link is rewritten", () => {
  assert.equal(isBareWhatsApp("https://wa.me/919289838797"), true);
  for (const h of ["https://wa.me/919289838797?text=x", "https://wa.me/919289838777", "https://wa.me/919289838797/", "", null, undefined]) {
    assert.equal(isBareWhatsApp(h), false, String(h));
  }
});

test("9: mounted on the Russian route only, with the Russian locale", () => {
  const ru = "app/(ppc-v2-ru)/lp/treatment-in-kerala-russian/page.tsx";
  assert.match(code(read(ru)), /import WhatsAppPrefill from "\.\.\/\.\.\/\.\.\/\.\.\/campaign-v2\/production\/WhatsAppPrefill";/);
  assert.equal(code(read(ru)).match(/<WhatsAppPrefill locale="ru" \/>/g)?.length, 1);
  const users = [];
  const walk = (d) => { for (const e of fs.readdirSync(path.join(SITE, d), { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    if (e.isDirectory()) walk(p); else if (/\.(tsx?|mjs)$/.test(e.name) && code(read(p)).includes("WhatsAppPrefill")) users.push(p);
  } };
  walk("app"); walk("campaign-v2");
  assert.deepEqual(users.sort(), [ru, "campaign-v2/production/WhatsAppPrefill.tsx"].sort());
  const comp = code(read("campaign-v2/production/WhatsAppPrefill.tsx"));
  assert.match(comp, /^"use client";/);
  assert.match(comp, /isBareWhatsApp\(a\.getAttribute\("href"\)\)/, "never rewrites a link that is not the bare site link");
  assert.doesNotMatch(comp, /preventDefault|stopPropagation|fetch\(|localStorage|cookie/i, "no navigation, network or storage change");
});

// ── 10: photographs ─────────────────────────────────────────────────────────────────────────────────────────────

// Train F (15 Oct 2026, fixtures/train-f-20261015.mjs) sits on top: these decision-10 checks run on the routes with Train F's
// exact photograph picks reversed (each restored field asserted), i.e. on the Train B state this candidate integrated into.
// Train F's own picks, including its re-done AHV-WB.005.hero-image and AHV-WB.403.change, are checked in
// train-f-photos-20261015.test.mjs.
const TRAIN_B_ROUTES = reverseTrainFBindings(JSON.parse(JSON.stringify(ROUTES)));
const trainBCampaign = (slug) => reverseTrainFConfig(slug, JSON.parse(JSON.stringify(productionCampaign(slug))));

const NEW_PHOTOS = {
  "ahv-img-045": { file: "public/ahv/assets/img/owner-decision-20261014/ahv-img-045.webp", sha: "13cc225808f4fbca77e8c38f94c3a46d83a6467acc392c6ea7d7a2faa3db2de6" },
  "ahv-img-018": { file: "public/ahv/assets/img/owner-approved-20260928/ahv-img-018.webp" },
  "ahv-img-026": { file: "public/ahv/assets/img/owner-approved-20260928/ahv-img-026.webp" },
  "ahv-img-034": { file: "public/ahv/assets/img/owner-approved-20260928/ahv-img-034.webp" },
  "ahv-img-012": { file: "public/ahv/assets/img/owner-approved-20260928/ahv-img-012.webp" },
};
/** Width and height from a WebP header (VP8X, VP8 or VP8L). */
function webpSize(buf) {
  assert.equal(buf.toString("ascii", 0, 4), "RIFF");
  assert.equal(buf.toString("ascii", 8, 12), "WEBP");
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  const b = buf.readUInt32LE(21);
  return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
}

test("10: the picks are exactly the recorded rows, routes and photographs", () => {
  const recorded = Object.fromEntries(Object.entries(fixture.photoPicks.routes).map(([slug, r]) => [slug, {
    hero: r.after.heroImage === r.before.heroImage ? undefined : r.after.heroImage,
    pathway: r.after.pathwayImage === r.before.pathwayImage ? undefined : r.after.pathwayImage,
  }]));
  for (const [slug, pick] of Object.entries(PHOTO_PICKS_20261014)) {
    assert.equal(pick.hero, recorded[slug].hero, `${slug}.hero`);
    assert.equal(pick.pathway, recorded[slug].pathway, `${slug}.pathway`);
  }
  assert.deepEqual(Object.keys(PHOTO_PICKS_20261014).sort(), Object.keys(recorded).sort());
  for (const [slug, r] of Object.entries(fixture.photoPicks.routes)) {
    for (const [field, id] of Object.entries(r.after)) assert.deepEqual(TRAIN_B_ROUTES[slug][field], IMAGES[id], `${slug}.${field}`);
    const c = trainBCampaign(slug);
    assert.equal(c.hero.image.A.id, r.after.heroImage, slug);
    assert.equal(c.hero.mobileImage.id, r.after.mobileImage, slug);
    assert.equal(c.page.pathway.image.id, r.after.pathwayImage, slug);
  }
});

test("10: every pick is a non-identifying bank photograph at >=1600 px, file present, size and alt as registered", () => {
  for (const [id, f] of Object.entries(NEW_PHOTOS)) {
    const im = IMAGES[id];
    assert.ok(im, id);
    assert.equal(`public${im.src}`, f.file, id);
    const buf = fs.readFileSync(path.join(SITE, f.file));
    if (f.sha) assert.equal(sha256(buf), f.sha, id);
    assert.deepEqual(webpSize(buf), { width: im.width, height: im.height }, id);
    assert.ok(im.width >= 1600, id);
    assert.equal(im.consent, "not-applicable", `${id}: no identifiable person`);
    assert.equal(im.gccSafe, true, id);
    assert.equal(im.decorative, false, id);
    assert.ok(im.alt.length >= 20 && im.alt.length <= 125, id);
  }
  // The built file comes from the SHA-256-verified library original (the script refuses any other source).
  const tool = read("tools/build-owner-decision-20261014-photos.py");
  assert.doesNotMatch(tool, /KHASGIWALA-(111|344|345|347)\.jpg/, "no rejected or unapplied-approval source");
  assert.ok(!fs.existsSync(path.join(SITE, "public/ahv/assets/img/owner-decision-20261014/ahv-img-005.webp")));
  // Review, 14 Oct: ahv-img-010 has two staff in frame; it is recorded as such and used on no route.
  assert.equal(IMAGES["ahv-img-010"].consent, "pending");
  assert.match(IMAGES["ahv-img-010"].alt, /two staff members/);
  for (const slug of PRODUCTION_SLUGS) {
    const b = ROUTES[slug];
    assert.ok(![b.heroImage.id, b.mobileImage.id, b.pathwayImage.id, ...b.gallery.map((g) => g.image.id)].includes("ahv-img-010"), slug);
    assert.ok(![b.heroImage.id, b.pathwayImage.id].includes("ahv-img-005"), slug);
  }
  assert.match(tool, /"045": \("kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-348\.jpg", "8a253b8bd635e62c1a99054df3e8fc05deb48999f90a2c6256c1a83bc582ba3e"\)/);
});

test("10: no bare-back therapy photograph remains in a picked hero or steps slot; hero, steps and mosaic never repeat", () => {
  const THERAPY = ["kt-199", "kt-190", "kt-202"];
  for (const [slug, r] of Object.entries(fixture.photoPicks.routes)) {
    const c = trainBCampaign(slug);
    const pick = PHOTO_PICKS_20261014[slug];
    if (pick.hero) {
      assert.ok(!THERAPY.includes(c.hero.image.A.id) && !THERAPY.includes(c.hero.mobileImage.id), `${slug}: hero`);
      assert.ok(!c.gallery.some((g) => g.image.id === c.hero.image.A.id), `${slug}: hero not in gallery`);
    }
    if (pick.pathway) assert.ok(!THERAPY.includes(c.page.pathway.image.id), `${slug}: steps`);
    assert.notEqual(c.page.pathway.image.id, c.hero.image.A.id, slug);
    assert.ok(!c.gallery.slice(0, 5).some((g) => [c.hero.image.A.id, c.page.pathway.image.id].includes(g.image.id)), `${slug}: mosaic`);
    if (r.galleryAppended) {
      assert.deepEqual(c.gallery.at(-1), { category: r.galleryCategory, image: IMAGES[r.galleryAppended] }, slug);
      assert.equal(c.gallery.filter((g) => g.image.id === r.galleryAppended).length, 1, slug);
    }
  }
  // Siblings: the two pain-management routes and the two treatment-packages routes keep different heroes.
  const hero = (s) => trainBCampaign(s).hero.image.A.id;
  assert.notEqual(hero("pain-management"), hero("lp-pain-management"));
  assert.notEqual(hero("treatment-packages"), hero("lp-treatment-packages"));
  assert.notEqual(hero("lp-treatment-kerala"), hero("treatment-kerala"));
  // Train B (15 Oct 2026): AHV-WB.403.change and AHV-WB.005.hero-image are excluded (rejected by REVIEW.json), so
  // /lp/pain-management/ and /ayurvedic-treatment-packages.html keep their prior heroes; the steps photographs differ.
  assert.equal(hero("lp-pain-management"), "kt-202");
  assert.equal(hero("treatment-packages"), "kt-202");
  assert.equal(PHOTO_PICKS_20261014["lp-pain-management"].hero, undefined);
  assert.equal(PHOTO_PICKS_20261014["treatment-packages"].hero, undefined);
  assert.notEqual(trainBCampaign("lp-pain-management").page.pathway.image.id, "ahv-img-045");
  const heroPicks = Object.keys(PHOTO_PICKS_20261014).filter((s) => PHOTO_PICKS_20261014[s].hero);
  assert.deepEqual(heroPicks.sort(), ["lp-treatment-kerala", "pain-management"]);
  // No picked hero repeats any route's mosaic tile.
  for (const slug of PRODUCTION_SLUGS) for (const h of heroPicks.map(hero)) {
    assert.ok(!trainBCampaign(slug).gallery.slice(0, 5).some((g) => g.image.id === h), `${slug} mosaic: ${h}`);
  }
  // The picked heroes differ from each other.
  const picked = heroPicks.map(hero);
  assert.equal(new Set(picked).size, picked.length);
});

test("10: no other route's photographs change", () => {
  for (const slug of PRODUCTION_SLUGS) {
    if (PHOTO_PICKS_20261014[slug]) continue;
    for (const id of Object.keys(NEW_PHOTOS)) {
      const b = TRAIN_B_ROUTES[slug];
      assert.ok(![b.heroImage.id, b.mobileImage.id, b.pathwayImage.id, ...b.gallery.map((g) => g.image.id)].includes(id), `${slug}: ${id}`);
    }
  }
});

// ── 11: English films on the German and Russian routes ──────────────────────────────────────────────────────────

const LOCALIZED = {
  "lp-behandlung-kerala": { route: "/lp/behandlung-in-kerala/", lang: "de", marker: /\(Video auf Englisch\)$/, body: /^Diese Videos sind auf Englisch\./ },
  "lp-treatment-kerala-ru": { route: "/lp/treatment-in-kerala-russian/", lang: "ru", marker: /\(видео на английском\)$/, body: /^Эти видео на английском языке\./ },
};

test("11: DE and RU render the three consented English films of their English sibling, each labelled as English", () => {
  const english = productionCampaign("lp-treatment-kerala").page.stories.films.map((f) => f.href);
  for (const [slug, l] of Object.entries(LOCALIZED)) {
    const c = productionCampaign(slug);
    assert.equal(c.route, l.route);
    assert.equal(c.locales[0], l.lang);
    const s = c.page.stories;
    assert.ok(s, slug);
    assert.match(s.body, l.body, `${slug}: the section says the films are in English`);
    assert.equal(s.films.length, 3, slug);
    assert.deepEqual(s.films.map((f) => f.href), english, `${slug}: same films as /lp/treatment-in-kerala/`);
    for (const f of s.films) {
      assert.match(f.title, l.marker, `${slug}: ${f.title}`);
      const id = filmIdFromHref(f.href);
      assert.ok(id && APPROVED_FILM_IDS.includes(id), f.href);
      assert.ok(fs.existsSync(path.join(SITE, "public", f.thumb.src)), f.thumb.src);
    }
    assert.ok(productionCampaign(slug).page && read(`campaign-v2/production/pages/${slug}.ts`).includes('import { story } from "../stories.ts";'));
  }
});

test("11: the on-page player stays English-route only; the DE/RU cards are YouTube links (consent posture unchanged)", () => {
  for (const l of Object.values(LOCALIZED)) {
    assert.equal(routeAllowed(l.route, l.lang), false, l.route);
    assert.equal(routeAllowed(l.route, "en"), false, l.route);
  }
});

test("11: the copy deltas are exactly the recorded, reversible additions", () => {
  for (const [p, e] of Object.entries(fixture.files)) {
    // Train B (15 Oct 2026): the integrated files carry later deltas too; candidateSource gives exactly this
    // candidate's own bytes (c54e2795e plus its recorded delta) after checking every Train A/B delta.
    let v = candidateSource("owner decisions C", p, read(p));
    assert.equal(sha256(v), e.afterSHA256, p);
    for (const { before, after } of e.replacements) {
      assert.equal(v.split(after).length - 1, 1, p);
      v = v.replace(after, before);
    }
    assert.equal(sha256(v), e.beforeSHA256, p);
    assert.doesNotMatch(v, /stories:/, `${p}: no stories before decision 11`);
  }
});
