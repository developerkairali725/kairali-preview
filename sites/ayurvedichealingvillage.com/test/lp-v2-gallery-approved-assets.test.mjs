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
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...p) => path.join(SITE, ...p);
const NOW = new Date(Date.UTC(2026, 9, 10, 12));
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const FIRST4 = ["treatment-packages", "panchakarma", "pain-management", "family-ayurvedic-retreat"];
const BATCH2 = [
  "monsoon-wellness", "rejuvenation-detox", "ayurveda-retreat", "wellness-kerala", "cleansing-centre", "treatment-kerala",
  "weight-management", "lp-hospital-kerala", "lp-cleansing-centre", "lp-pain-management", "lp-treatment-kerala", "lp-treatment-packages",
];
const TARGETS = [...FIRST4, ...BATCH2];
// Variant D (no village, so no gallery on the page) and the later batch (lp-weight-management, German, Russian).
const UNTARGETED = ["south-india-cities", "brand", "lp-south-india", "lp-brand", "lp-panchakarma", "lp-weight-management", "lp-behandlung-kerala", "lp-treatment-kerala-ru"];

// Frozen before the additions (first four at a831a6348, batch 2 at d9aabf28): each target route's gallery, in order.
const BASE_GALLERY = {
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
// routes' bindings without `gallery` and the eight untargeted routes' full bindings (d9aabf28, same as a831a6348 for
// those). Any change to those fields or routes changes the hash.
const BASE_FIRST4_NO_GALLERY_HASH = "2f13ed04cdb22313676ad5ab4174f86640d7d9941178f24cf6a95720827d58d9";
const BASE_BATCH2_NO_GALLERY_HASH = "0300b401a6dac87a8b1c5ad621352023a8fb974ced6100df121eac546df85aa6";
const BASE_UNTARGETED_HASH = "87665e4d24357679ce5f1a06da43bd0365ba1566353ab0d67a32815c4e83a6a6";
const pick = (slugs, dropGallery) => Object.fromEntries(slugs.map((s) => {
  if (!dropGallery) return [s, ROUTES[s]];
  const { gallery, ...rest } = ROUTES[s];
  return [s, rest];
}));

const ADDED_IDS = APPROVED_GALLERY_IMAGES.map((a) => a.image.id);

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
  assert.equal(TARGETS.length, 16);
  assert.equal(new Set([...TARGETS, ...UNTARGETED]).size, 24);
  assert.deepEqual([...TARGETS, ...UNTARGETED].sort(), [...PRODUCTION_SLUGS].sort());
  for (const slug of TARGETS) {
    const g = ROUTES[slug].gallery;
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

test("targets: hero, phone hero, stillness, steps photograph and every other field are unchanged", () => {
  assert.equal(sha256(JSON.stringify(pick(FIRST4, true))), BASE_FIRST4_NO_GALLERY_HASH);
  assert.equal(sha256(JSON.stringify(pick(BATCH2, true))), BASE_BATCH2_NO_GALLERY_HASH);
  for (const slug of TARGETS) {
    const b = ROUTES[slug];
    const steps = b.pathwayImage.id;
    // The steps photograph stays in the gallery but outside the five mosaic tiles; no hero repeats in the gallery.
    assert.ok(b.gallery.some((g) => g.image.id === steps), slug);
    assert.ok(!b.gallery.slice(0, 5).some((g) => g.image.id === steps), slug);
    for (const id of ADDED_IDS) assert.ok(![b.heroImage.id, b.mobileImage.id, b.stillnessImage.id, steps].includes(id), `${slug}: ${id}`);
  }
});

test("the eight untargeted routes are unchanged and carry none of the additions", () => {
  assert.equal(UNTARGETED.length, 8);
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
    // Every target is an English page that shows the village (mosaic + dialog); no non-English route is a target.
    assert.deepEqual(c.locales, ["en"], slug);
    assert.ok(c.page.place, `${slug}: shows the village`);
    assert.deepEqual(c.gallery, ROUTES[slug].gallery, slug);
    // Village.tsx Mosaic: more = pool.length - tiles.length (pool = gallery on a standard page); the dialog gets c.gallery.
    const pool = c.gallery;
    const tiles = pool.slice(0, 5);
    assert.equal(pool.length - tiles.length, BASE_GALLERY[slug].length + APPROVED_GALLERY_ADDITIONS.length - 5, slug);
    assert.ok(c.gallery.length <= 24, slug); // kit lint count.gallery: 6-24
  }
});

test("assets are unique: no addition repeats an id, file or source already in the route", () => {
  assert.equal(new Set(ADDED_IDS).size, ADDED_IDS.length);
  assert.equal(new Set(APPROVED_GALLERY_IMAGES.map((a) => a.image.src)).size, ADDED_IDS.length);
  assert.equal(new Set(APPROVED_GALLERY_IMAGES.map((a) => a.provenance.librarySha256)).size, ADDED_IDS.length);
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
    // Never consent "confirmed" on a filename: the additions are frames with no identifiable person.
    assert.equal(image.consent, "not-applicable", image.id);
    assert.match(pv.people, /^No identifiable (person|patient or staff member)/, image.id);
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

test("lint: the sixteen target routes stay free of kit lint errors (alt length, size, consent, duplicates, count)", () => {
  for (const slug of TARGETS) assert.deepEqual(lintCampaign(productionCampaign(slug), NOW).errors, [], slug);
});
