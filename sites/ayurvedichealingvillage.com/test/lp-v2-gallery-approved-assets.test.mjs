import { productionCss } from "../scripts/build-production-css.mjs";
// Approved gallery photographs on the live ad routes (campaign-v2/data/gallery-images.ts): the first four (batch 1)
// and the twelve English village routes of batch 2. Data-level
// checks only: the bindings, the campaign config each page renders from, the published gallery manifest and the files
// in public/. Not a browser check: nothing here renders the mosaic or opens the dialog.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ROUTES } from "../campaign-v2/production/bindings.ts";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { IMAGES } from "../campaign-v2/data/images.ts";
import { APPROVED_GALLERY_IMAGES, APPROVED_GALLERY_ADDITIONS } from "../campaign-v2/data/gallery-images.ts";
import { UI } from "../campaign-v2/production/ui.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import ownerDecisionsC from "./fixtures/owner-decisions-c-20261014.json" with { type: "json" };

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...p) => path.join(SITE, ...p);
const NOW = new Date(Date.UTC(2026, 9, 10, 12));
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const FIRST4 = ["treatment-packages", "panchakarma", "pain-management", "family-ayurvedic-retreat"];
const BATCH2 = [
  "monsoon-wellness", "rejuvenation-detox", "ayurveda-retreat", "wellness-kerala", "cleansing-centre", "treatment-kerala",
  "weight-management", "lp-hospital-kerala", "lp-cleansing-centre", "lp-pain-management", "lp-treatment-kerala", "lp-treatment-packages",
];
const BATCH3 = ["lp-weight-management", "lp-behandlung-kerala", "lp-treatment-kerala-ru"];
const TARGETS = [...FIRST4, ...BATCH2, ...BATCH3];
// Variant D has no visible gallery; preserve these five routes.
const UNTARGETED = ["south-india-cities", "brand", "lp-south-india", "lp-brand", "lp-panchakarma"];

// Frozen before the additions (first four at a831a6348, batch 2 at d9aabf28): each target route's gallery, in order.
const BASE_GALLERY = {
  // Final three galleries frozen from PR402 before the additions.
  "lp-weight-management": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Therapies", "kt-199"], ["Therapies", "kt-190"], ["Therapies", "kt-202"]],
  "lp-behandlung-kerala": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-202"], ["Therapies", "kt-199"]],
  "lp-treatment-kerala-ru": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-190"], ["Therapies", "kt-199"]],

  "treatment-packages": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-199"]],
  panchakarma: [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-202"]],
  "pain-management": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-202"]],
  "family-ayurvedic-retreat": [["Villas", "kt-116"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-199"], ["Therapies", "kt-202"]],
  "monsoon-wellness": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-199"], ["Therapies", "kt-202"]],
  "rejuvenation-detox": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-190"], ["Therapies", "kt-199"]],
  "ayurveda-retreat": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-202"], ["Therapies", "kt-190"], ["Therapies", "kt-199"]],
  "wellness-kerala": [["Villas", "kt-116"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-199"], ["Therapies", "kt-190"], ["Therapies", "kt-202"]],
  "cleansing-centre": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-199"]],
  "treatment-kerala": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-202"]],
  "weight-management": [["Villas", "kt-116"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-199"], ["Therapies", "kt-190"], ["Therapies", "kt-202"]],
  "lp-hospital-kerala": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-202"], ["Therapies", "kt-190"], ["Therapies", "kt-199"]],
  "lp-cleansing-centre": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-199"], ["Therapies", "kt-202"]],
  "lp-pain-management": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-199"]],
  "lp-treatment-kerala": [["Villas", "kt-116"], ["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-190"], ["Therapies", "kt-202"]],
  "lp-treatment-packages": [["Villas", "kt-314"], ["Grounds", "wx-hero"], ["Grounds", "gal-poolside-rest-palakkad-2026"], ["Dining", "wx-dining"], ["Therapies", "kt-202"], ["Therapies", "kt-190"], ["Therapies", "kt-199"]],
};
// Frozen SHA-256 of JSON.stringify of: the first four routes' bindings without `gallery` (a831a6348); the twelve batch-2
// routes' bindings without `gallery` and the five untargeted routes' full bindings (d9aabf28, same as a831a6348 for
// those). Any change to those fields or routes changes the hash.
const BASE_FIRST4_NO_GALLERY_HASH = "2f13ed04cdb22313676ad5ab4174f86640d7d9941178f24cf6a95720827d58d9";
const BASE_BATCH2_NO_GALLERY_HASH = "0300b401a6dac87a8b1c5ad621352023a8fb974ced6100df121eac546df85aa6";
const BASE_BATCH3_NO_GALLERY_HASH = "8a2c23c0c441a1320d26d748c665d79840e6402724bc946970102e8eed3bb1ce";
const BASE_UNTARGETED_HASH = "b715fa590241da12ef34b076c5ef6dff32a60359c276a307c8ff7b8fbbca7ba6";
const pick = (slugs, dropGallery) => Object.fromEntries(slugs.map((s) => {
  if (!dropGallery) return [s, ROUTES[s]];
  const { gallery, ...rest } = ROUTES[s];
  return [s, rest];
}));

const ADDED_IDS = APPROVED_GALLERY_IMAGES.map((a) => a.image.id);

// Owner decision 10 (14 Oct 2026, fixtures/owner-decisions-c-20261014.json photoPicks): exact reversal of the newest
// hero/steps photograph delta, applied before the historical checks below; every frozen value stays as it was.
const PHOTO_PICKS = ownerDecisionsC.photoPicks.routes;
/** The gallery without the one steps photograph decision 10 appended last (asserted exactly), else the gallery. */
function galleryBeforePicks(slug) {
  const g = ROUTES[slug].gallery;
  const appended = PHOTO_PICKS[slug]?.galleryAppended;
  if (!appended) return g;
  assert.deepEqual(g.at(-1), { category: PHOTO_PICKS[slug].galleryCategory, image: IMAGES[appended] }, `${slug}: appended steps photograph`);
  assert.equal(g.filter((x) => x.image.id === appended).length, 1, `${slug}: appended once`);
  return g.slice(0, -1);
}
/** Restore the prior hero, phone hero and steps photograph on picked bindings (asserting the current ones exactly). */
function reversePhotoPicks(bindings) {
  for (const [slug, b] of Object.entries(bindings)) {
    const pick = PHOTO_PICKS[slug];
    if (!pick) continue;
    for (const [field, id] of Object.entries(pick.after)) assert.deepEqual(b[field], IMAGES[id], `${slug}.${field}`);
    for (const [field, id] of Object.entries(pick.before)) b[field] = IMAGES[id];
  }
  return bindings;
}

/** Width and height from a WebP header (VP8X, VP8 or VP8L). */
function webpSize(buf) {
  assert.equal(buf.toString("ascii", 0, 4), "RIFF");
  assert.equal(buf.toString("ascii", 8, 12), "WEBP");
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21);
    return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
  }
  throw new Error(`unknown WebP chunk ${chunk}`);
}

test("targets: the existing gallery is kept entry for entry, then only the approved additions are appended", () => {
  assert.ok(APPROVED_GALLERY_ADDITIONS.length >= 1);
  assert.equal(TARGETS.length, 19);
  assert.equal(new Set([...TARGETS, ...UNTARGETED]).size, 24);
  assert.deepEqual([...TARGETS, ...UNTARGETED].sort(), [...PRODUCTION_SLUGS].sort());
  for (const slug of TARGETS) {
    const g = galleryBeforePicks(slug);
    const base = BASE_GALLERY[slug];
    assert.equal(g.length, base.length + APPROVED_GALLERY_ADDITIONS.length, slug);
    base.forEach(([category, id], i) => {
      assert.equal(g[i].category, category, `${slug}[${i}]`);
      assert.deepEqual(g[i].image, IMAGES[id], `${slug}[${i}] ${id}`);
    });
    assert.deepEqual(g.slice(base.length), APPROVED_GALLERY_ADDITIONS, slug);
    // The five mosaic photographs are exactly the base's first five.
    assert.deepEqual(g.slice(0, 5).map((x) => x.image.id), base.slice(0, 5).map(([, id]) => id), `${slug}: mosaic`);
  }
});

test("targets: only the eight approved rest images change; all prior gallery and other-field preservation checks remain", () => {
  const approvedRest = {
    id: "ahv-img-016", src: "/ahv/assets/img/owner-approved-20260928/ahv-img-016.webp",
    width: 1600, height: 1067, alt: "Cottage, garden path and water channel among palms at the Healing Village in Palakkad",
    decorative: false, gccSafe: true, location: "palakkad", consent: "not-applicable",
  };
  assert.deepEqual(IMAGES["ahv-img-016"], approvedRest);
  const file = fs.readFileSync(P("public" + approvedRest.src));
  assert.equal(sha256(file), "52bb11bb871ff8b2a9e325149e79a010df5f7023294c15ee905a5621be1e49b2");
  assert.deepEqual(webpSize(file), { width: 1600, height: 1067 });
  const first4BeforeRestChange = reversePhotoPicks(pick(FIRST4, true));
  for (const slug of FIRST4) {
    assert.deepEqual(ROUTES[slug].stillnessImage, approvedRest, slug);
    assert.deepEqual(productionCampaign(slug).stillness.image, approvedRest, slug);
    assert.ok(!ROUTES[slug].gallery.some(g => g.image.id === approvedRest.id), slug);
    // Reverse only this reviewed delta; retain the original baseline hash and every other field.
    first4BeforeRestChange[slug].stillnessImage = IMAGES["gal-post-therapy-stillness-wakem"];
  }
  assert.equal(sha256(JSON.stringify(first4BeforeRestChange)), BASE_FIRST4_NO_GALLERY_HASH);
  // Batch 2 adopts only these four route images; reverse them before the original historical hash check.
  const batch2BeforeRestChange = reversePhotoPicks(pick(BATCH2, true));
  for (const slug of ["cleansing-centre", "treatment-kerala", "weight-management", "lp-hospital-kerala"]) {
    assert.deepEqual(ROUTES[slug].stillnessImage, approvedRest, slug);
    assert.deepEqual(productionCampaign(slug).stillness.image, approvedRest, slug);
    assert.ok(!ROUTES[slug].gallery.some(g => g.image.id === approvedRest.id), slug);
    batch2BeforeRestChange[slug].stillnessImage = IMAGES["gal-post-therapy-stillness-wakem"];
  }
  assert.equal(sha256(JSON.stringify(batch2BeforeRestChange)), BASE_BATCH2_NO_GALLERY_HASH);
  assert.equal(sha256(JSON.stringify(pick(BATCH3, true))), BASE_BATCH3_NO_GALLERY_HASH);
  for (const slug of TARGETS) {
    const b = ROUTES[slug];
    const steps = b.pathwayImage.id;
    // The steps photograph stays in the gallery but outside the five mosaic tiles; no hero repeats in the gallery.
    assert.ok(b.gallery.some((g) => g.image.id === steps), slug);
    assert.ok(!b.gallery.slice(0, 5).some((g) => g.image.id === steps), slug);
    for (const id of ADDED_IDS) assert.ok(![b.heroImage.id, b.mobileImage.id, b.stillnessImage.id, steps].includes(id), `${slug}: ${id}`);
  }
});

test("the five untargeted routes are unchanged and carry none of the additions", () => {
  assert.equal(UNTARGETED.length, 5);
  assert.deepEqual(Object.keys(ROUTES).filter((s) => !TARGETS.includes(s)), UNTARGETED);
  assert.equal(sha256(JSON.stringify(pick(UNTARGETED, false))), BASE_UNTARGETED_HASH);
  for (const slug of UNTARGETED) {
    for (const g of ROUTES[slug].gallery) assert.ok(!ADDED_IDS.includes(g.image.id), `${slug}: ${g.image.id}`);
    assert.ok(!productionCampaign(slug).gallery.some((g) => ADDED_IDS.includes(g.image.id)), slug);
  }
});

test("counts: the page config carries the binding's gallery, so the mosaic chip and the dialog count follow it", () => {
  for (const slug of TARGETS) {
    const c = productionCampaign(slug);
    assert.equal(c.modesty, "standard", slug);
    // Preserve the existing single locale on each route, including German and Russian.
    assert.deepEqual(c.locales, [ROUTES[slug].locale ?? "en"], slug);
    assert.ok(c.page.place, `${slug}: shows the village`);
    assert.deepEqual(c.gallery, ROUTES[slug].gallery, slug);
    // Village.tsx Mosaic: more = pool.length - tiles.length (pool = gallery on a standard page); the dialog gets c.gallery.
    const pool = c.gallery;
    const tiles = pool.slice(0, 5);
    // Plus the one steps photograph appended by owner decision 10, where recorded (fixtures/owner-decisions-c-20261014.json).
    assert.equal(pool.length - tiles.length, BASE_GALLERY[slug].length + APPROVED_GALLERY_ADDITIONS.length + (PHOTO_PICKS[slug]?.galleryAppended ? 1 : 0) - 5, slug);
    assert.ok(c.gallery.length <= 24, slug); // kit lint count.gallery: 6-24
  }
});

test("assets are unique: no addition repeats an id, file or source already in the route", () => {
  assert.equal(new Set(ADDED_IDS).size, ADDED_IDS.length);
  assert.equal(new Set(APPROVED_GALLERY_IMAGES.map((a) => a.image.src)).size, ADDED_IDS.length);
  assert.equal(new Set(APPROVED_GALLERY_IMAGES.map((a) => a.provenance.librarySha256 ?? a.provenance.publishedSha256)).size, ADDED_IDS.length);
  for (const id of ADDED_IDS) assert.equal(IMAGES[id], undefined, `${id} is not a registry image key`);
  for (const slug of TARGETS) {
    const g = ROUTES[slug].gallery;
    assert.equal(new Set(g.map((x) => x.image.id)).size, g.length, slug);
    assert.equal(new Set(g.map((x) => x.image.src)).size, g.length, slug);
  }
});

test("provenance: each addition is in the named published manifest with the same URL, size and alt, verbatim", () => {
  const m = JSON.parse(fs.readFileSync(P("english-candidate/galleries-2026.json"), "utf8"));
  assert.match(m.directive, /D-20260922-31/);
  for (const { image, provenance: pv } of APPROVED_GALLERY_IMAGES) {
    let entry;
    if (pv.manifest === "english-candidate/galleries-2026.json") {
      const route = m.routes.find((r) => r.path === pv.manifestRoute);
      assert.ok(route, pv.manifestRoute);
      const chapter = route.chapters.find((c) => c.id === pv.manifestChapter);
      assert.ok(chapter, `${pv.manifestRoute} ${pv.manifestChapter}`);
      entry = chapter.images.find((i) => i.src === image.src);
    } else if (pv.manifest === "english-candidate/prerender/deluxe-villa.html") {
      assert.equal(pv.manifestRoute, "/deluxe-villa/");
      const source = fs.readFileSync(P(pv.manifest), "utf8");
      const tags = [...source.matchAll(/<img\b[^>]*>/g)].map(x => x[0]);
      const tag = tags.find(x => x.includes(`src="${image.src}"`) && x.includes(`data-dc-tpl="${pv.manifestChapter}"`));
      assert.ok(tag, image.src);
      const attr = name => tag.match(new RegExp(`${name}="([^"\n]+)"`))?.[1];
      assert.deepEqual(pv.publishedSize, { width: Number(attr("width")), height: Number(attr("height")) });
      assert.equal(pv.libraryPath, undefined); // No invented library-original provenance.
      assert.equal(pv.librarySha256, undefined);
      entry = { src: attr("src"), alt: attr("alt"), width: image.width, height: image.height };
      // Actual intrinsic dimensions and bytes are checked independently below.
    } else {
      assert.equal(pv.manifest, "public/ahv/assets/enquiry-family-data.js");
      const source = fs.readFileSync(P(pv.manifest), "utf8");
      const data = JSON.parse(source.slice(source.indexOf("{")).trim().replace(/;$/, ""));
      assert.equal(pv.manifestChapter, "heroImage");
      entry = data.routes.find((r) => r.path === pv.manifestRoute)?.heroImage;
      assert.equal(entry?.src, image.src);
    }
    assert.ok(entry, image.src);
    assert.equal(entry.width, image.width);
    assert.equal(entry.height, image.height);
    assert.equal(entry.alt, pv.publishedAlt ?? image.alt);
    assert.equal(entry.libraryPath ?? entry.libraryPathPrivate, pv.libraryPath);
    assert.equal(pv.ownerDecision.decision, "yes");
    // Consent is specific to the owner-approved photograph, never inferred from a filename.
    if (image.id === "ahv-yoga-hall-consented-20261014") {
      assert.equal(image.src, "/ahv/assets/img/gallery-2026/photo/yoga-large-hall-exposed-03.webp");
      assert.equal(pv.publishedSha256, "5ea375faff82fcf26adddda817e81eced1f4a4f3eb0dcbd45f64630c319a5a81");
      assert.equal(pv.ownerDecision.id, "AHV-YOGA-CONSENT-20261014");
      assert.equal(pv.ownerDecision.record, "deliverables/WOPS-WEBSITE-SEQUENTIAL-20261008-001/recovery-20261014/yoga-gallery-consent/CONSENT-BINDING.json");
      assert.equal(image.consent, "confirmed");
      assert.match(image.alt, /^Two people practising yoga/);
      assert.match(pv.people, /^Two people practising yoga; direct owner consent/);
    } else {
      assert.equal(image.consent, "not-applicable", image.id);
      assert.match(pv.people, /^No identifiable (person|patient or staff member)/, image.id);
    }
    assert.equal(image.decorative, false);
  }
});

test("files: each addition is in public/, tracked in git, a WebP of the stated size and the recorded bytes", () => {
  for (const { image, provenance: pv } of APPROVED_GALLERY_IMAGES) {
    const file = P("public", image.src);
    assert.ok(fs.existsSync(file), image.src);
    const buf = fs.readFileSync(file);
    assert.deepEqual(webpSize(buf), { width: image.width, height: image.height }, image.src);
    assert.equal(sha256(buf), pv.publishedSha256, image.src);
    const tracked = execFileSync("git", ["ls-files", "--error-unmatch", path.join("public", image.src)], { cwd: SITE, encoding: "utf8" }).trim();
    assert.equal(tracked, path.join("public", image.src));
  }
});

test("lint: the nineteen target routes stay free of kit lint errors (alt length, size, consent, duplicates, count)", () => {
  for (const slug of TARGETS) assert.deepEqual(lintCampaign(productionCampaign(slug), NOW).errors, [], slug);
});

test("German and Russian additions retain localized accessible descriptions", () => {
  for (const locale of ["de", "ru"]) for (const { image } of APPROVED_GALLERY_IMAGES) {
    assert.ok(UI[locale].alt[image.id]?.length > 20, `${locale}: ${image.id}`);
    assert.notEqual(UI[locale].alt[image.id], image.alt);
  }
});

// Desktop gallery dialogs must override the shared dialog token just as mobile does.
test("gallery outer dialog has sharp corners at desktop and phone widths", () => {
  const css = fs.readFileSync(P("campaign-v2/production/document.css"), "utf8");
  assert.equal(css, productionCss(), "checked CSS is generated from the maintained sources");
  const override = ".lp-prod .lp-gal{border-radius:0}";
  const production = fs.readFileSync(P("campaign-v2/production/production.css"), "utf8");
  assert.ok(production.includes(override), "maintained production source sets sharp gallery corners");
  const page = fs.readFileSync(P("campaign-v2/production/ProductionPage.tsx"), "utf8");
  assert.match(page, /className="lp lp-prod"/);
  assert.ok(page.indexOf('<Gallery items=') > page.indexOf('className="lp lp-prod"'));
  const gallery = fs.readFileSync(P("campaign-v2/sections/interactive/Gallery.tsx"), "utf8");
  assert.match(gallery, /<dialog ref=\{ref\} className="lp-dlg lp-gal"/);
  assert.doesNotMatch(gallery, /createPortal/);

  assert.ok(css.lastIndexOf(override) > css.indexOf(".lp-dlg{"), "gallery override follows shared dialog radius");
  assert.match(css, /@media \(max-width:767px\)\{\s*\.lp-gal\{[^}]*border-radius:0\}/);
});
