// Train F (15 Oct 2026): page-specific hero and steps photographs under owner decisions 10 and 15
// (deliverables/WOPS-WEBSITE-SEQUENTIAL-20261008-001/recovery-20261014/OWNER-DECISIONS-20261014-ANSWERS.json). Rows
// AHV-WB.005/.031/.058/.192/.218/.311/.377 hero-image, AHV-WB.192/.335 how-image, AHV-WB.403.change.
// Source-level checks only: no build, no browser.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PHOTO_PICKS_20261015, ROUTES } from "../campaign-v2/production/bindings.ts";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { IMAGES } from "../campaign-v2/data/images.ts";
import { APPROVED_GALLERY_IMAGES } from "../campaign-v2/data/gallery-images.ts";
import { TRAIN_F, reverseTrainFBindings, reverseTrainFConfig, reverseTrainFSource } from "./fixtures/train-f-20261015.mjs";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");
const PICKS = TRAIN_F.photoPicks;

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

// Built by tools/build-train-f-20261015-photos.py (1600 px and 768 px WebP) or, for ahv-img-009/018/045, the files already
// published (owner-approved batch 1 of 28 Sep 2026; owner decision 10 of 14 Oct 2026).
const NEW_FILES = {
  "ahv-pkd-50": { sha: "e166d6e2989c927ef8372a0c35d6a9f397e3555bac0747b756ca0237f5b1b6ea", sha768: "54f5f602d8068a1a94ab613341b253b19c9d4082fead9612779322522f6a658c" },
  "ahv-pkd-180": { sha: "f19715ce9944da683e1989ba45e0a14ac86958ec94c5ff9573be883783322b93", sha768: "4caaa9d4000e1327b16615f31f11616f59a3151e35eb60005d118edc3fe3aed3" },
  "ahv-pkd-115": { sha: "3d0da5c6f7262d0baadb83f92506c60071f3f5dc2a7a81d9a1e0543d490f5d11", sha768: "c3f80aefb2611167410bbbc63c6e1860693ceaf2ed1ef37345ce9dd8c8c0568d" },
  "ahv-pkd-132": { sha: "9ff9122c559d371d78f3d8530109f9cf4cb08164bba20b13d9be61a4b20e0dd4", sha768: "959137256dbbd2096eced587ceb0f5f3f1bf2d8020bde8db2fffdafcd45e9821" },
  "ahv-pkd-307": { sha: "ff60f56df54563e485cea2c0f7046acb04579e107e49582850f9d515b826e463", sha768: "3d9cd7ba9743e09bc204e1ee7530b6e0d50ad74150c6a1d4f368b8b4ac675b71" },
  "ahv-img-009": { sha: "5abe98cd927c490f1b2b8649beb971662c9c5e1b20de1bf11b37f9c2f20f993a" },
  "ahv-img-018": { sha: "51589ed279c55479a8f6b0ddd68286c5fd28f747797faf5ff73e4f666b357677" },
  "ahv-img-045": { sha: "13cc225808f4fbca77e8c38f94c3a46d83a6467acc392c6ea7d7a2faa3db2de6" },
};

test("the picks are exactly the recorded rows, routes and photographs, in the bindings and in every rendered variant", () => {
  assert.deepEqual(Object.keys(PHOTO_PICKS_20261015).sort(), Object.keys(PICKS).sort());
  assert.deepEqual(Object.values(PICKS).flatMap((p) => p.rows).sort(), [
    "AHV-WB.005.hero-image", "AHV-WB.031.hero-image", "AHV-WB.058.hero-image", "AHV-WB.192.hero-image", "AHV-WB.192.how-image",
    "AHV-WB.218.hero-image", "AHV-WB.311.hero-image", "AHV-WB.335.how-image", "AHV-WB.377.hero-image", "AHV-WB.403.change",
  ]);
  for (const [slug, p] of Object.entries(PICKS)) {
    const pick = PHOTO_PICKS_20261015[slug];
    assert.equal(pick.hero, p.after.heroImage === p.before.heroImage ? undefined : p.after.heroImage, `${slug}.hero`);
    assert.equal(pick.pathway, p.after.pathwayImage === p.before.pathwayImage ? undefined : p.after.pathwayImage, `${slug}.pathway`);
    assert.equal(ROUTES[slug].route, p.route, slug);
    for (const [field, id] of Object.entries(p.after)) assert.deepEqual(ROUTES[slug][field], IMAGES[id], `${slug}.${field}`);
    const c = productionCampaign(slug);
    for (const v of ["A", "B", "C", "D"]) assert.equal(c.hero.image[v].id, p.after.heroImage, `${slug}.${v}`);
    assert.equal(c.hero.mobileImage.id, p.after.mobileImage, slug);
    assert.equal(c.page.pathway.image.id, p.after.pathwayImage, slug);
    assert.deepEqual(c.gallery, ROUTES[slug].gallery, slug);
  }
  // Owner decision 15 ("let the photo be"): the pulse-check photograph is the /lp/pain-management/ hero (AHV-WB.403.change).
  assert.equal(productionCampaign("lp-pain-management").hero.image.A.id, "ahv-img-045");
  assert.equal(productionCampaign("lp-pain-management").hero.mobileImage.id, "ahv-img-045");
});

test("every new photograph is a Palakkad bank photograph >=1600 px wide with no identifiable person, file and size as registered", () => {
  for (const [id, f] of Object.entries(NEW_FILES)) {
    const im = IMAGES[id];
    assert.ok(im, id);
    const buf = fs.readFileSync(path.join(SITE, "public", im.src));
    assert.equal(sha256(buf), f.sha, id);
    assert.deepEqual(webpSize(buf), { width: im.width, height: im.height }, id);
    assert.ok(im.width >= 1600, id);
    if (f.sha768) {
      const small = fs.readFileSync(path.join(SITE, "public", im.src.replace(/\.webp$/, "-768.webp")));
      assert.equal(sha256(small), f.sha768, `${id} 768`);
      assert.deepEqual(webpSize(small), { width: 768, height: Math.round((im.height * 768) / im.width) }, `${id} 768`);
    }
    assert.equal(im.consent, "not-applicable", `${id}: no identifiable person`);
    assert.equal(im.location, "palakkad", id);
    assert.equal(im.gccSafe, true, id);
    assert.equal(im.decorative, false, id);
    assert.ok(im.alt.length >= 20 && im.alt.length <= 125, id);
    assert.doesNotMatch(im.alt, /\b(spa|resort|holiday|luxury|cure|journey|guests?)\b/i, `${id}: KTAHV language lock`);
  }
  const tool = read("tools/build-train-f-20261015-photos.py");
  // SHA-256-verified library originals (ahv-edited, Palakkad); never the unapplied -344/-345/-347 or the Delhi HO-centre shoot.
  for (const [n, h] of [["50", "f5798c974081c9ed7b08ba87557b282d4d467a324ef7dd050b690519e9420c0b"], ["180", "bbee193ce7c40e6745828ea2a7bcf10a3697a88d6370d1da158dc39db474aa69"],
    ["115", "04b8bedff8eda0155824423b6b4a9a1f5f8fb1b63cb5109fa8a4354e0509754f"], ["132", "8f3a8e02d98f5670c15f9916254881becc0f185cbce8d7c5033207d902af7fbc"],
    ["307", "7b21e6adce4d153a542a18b652367bc878429ee3d9e2b643c50e76f9d8cfa302"]]) assert.match(tool, new RegExp(`"${n}": \\("${h}", `), n);
  assert.match(tool, /LIB = Path\("\/Volumes\/Extreme SSD - Blue 2nd\/Kairali-Image-Library\/ahv-edited"\)/);
  assert.match(tool, /"180": \("[0-9a-f]{64}", \(548, 1965, 3648, 5096\)\)/, "-180: left-edge trim (no face) and the near-square hero window");
  assert.doesNotMatch(tool.replace(/^KHASGIWALA-344\/-345\/-347 are not used.*$/m, ""), /KHASGIWALA-(344|345|347)|ktahv-shoot-2025\/|"(344|345|347)":/);
});

test("per route: no bare-back or model photograph in the hero; hero, steps and mosaic never repeat; siblings keep different heroes", () => {
  const MODEL_OR_BARE_BACK = ["kt-199", "kt-190"];
  const ADDED = APPROVED_GALLERY_IMAGES.map((a) => a.image.id);
  for (const [slug, p] of Object.entries(PICKS)) {
    const c = productionCampaign(slug);
    const hero = c.hero.image.A.id, steps = c.page.pathway.image.id;
    assert.ok(![hero, c.hero.mobileImage.id, steps].some((id) => MODEL_OR_BARE_BACK.includes(id)), slug);
    assert.notEqual(hero, "kt-202", `${slug}: the old therapy hero is replaced`);
    assert.notEqual(steps, hero, slug);
    assert.ok(!c.gallery.some((g) => g.image.id === hero), `${slug}: hero not in the gallery`);
    assert.ok(!ADDED.includes(hero), `${slug}: hero is not an approved gallery addition`);
    assert.ok(!c.gallery.slice(0, 5).some((g) => [hero, steps].includes(g.image.id)), `${slug}: mosaic`);
    if (p.galleryAppended) {
      assert.deepEqual(c.gallery.at(-1), { category: p.galleryCategory, image: IMAGES[p.galleryAppended] }, slug);
      assert.equal(c.gallery.filter((g) => g.image.id === p.galleryAppended).length, 1, slug);
    }
    assert.ok(c.gallery.length >= 6 && c.gallery.length <= 24, slug);
  }
  const hero = (s) => productionCampaign(s).hero.image.A.id;
  for (const [a, b] of [["pain-management", "lp-pain-management"], ["panchakarma", "lp-panchakarma"], ["cleansing-centre", "lp-cleansing-centre"],
    ["treatment-kerala", "lp-treatment-kerala"], ["treatment-packages", "lp-treatment-packages"], ["lp-south-india", "south-india-cities"]])
    assert.notEqual(hero(a), hero(b), `${a} / ${b}`);
  // /pain-management.html and /panchkarma-treatment.html must not look alike (review finding, Gaurav, 8 Oct 2026).
  assert.notEqual(hero("pain-management"), hero("panchakarma"));
  const heroes = Object.entries(PICKS).filter(([, p]) => p.after.heroImage !== p.before.heroImage).map(([s]) => hero(s));
  assert.equal(new Set(heroes).size, heroes.length, "every re-picked hero is different");
  for (const slug of PRODUCTION_SLUGS) for (const h of heroes)
    assert.ok(!productionCampaign(slug).gallery.slice(0, 5).some((g) => g.image.id === h), `${slug} mosaic: ${h}`);
});

test("only the picked routes change, and reversing Train F gives back the Train B head exactly", () => {
  for (const [p, e] of Object.entries(TRAIN_F.files)) assert.equal(sha256(reverseTrainFSource(p, read(p))), e.beforeSHA256, p);
  const before = reverseTrainFBindings(JSON.parse(JSON.stringify(ROUTES)));
  for (const slug of PRODUCTION_SLUGS) {
    if (PICKS[slug]) {
      for (const [field, id] of Object.entries(PICKS[slug].before)) assert.deepEqual(before[slug][field], IMAGES[id], `${slug}.${field}`);
      const c = reverseTrainFConfig(slug, JSON.parse(JSON.stringify(productionCampaign(slug))));
      assert.deepEqual(c.gallery, before[slug].gallery, slug);
      continue;
    }
    assert.deepEqual(before[slug], JSON.parse(JSON.stringify(ROUTES[slug])), slug);
    const b = ROUTES[slug];
    for (const id of ["ahv-pkd-50", "ahv-pkd-180", "ahv-pkd-115", "ahv-pkd-132", "ahv-pkd-307", "ahv-img-009"])
      assert.ok(![b.heroImage.id, b.mobileImage.id, b.pathwayImage.id, ...b.gallery.map((g) => g.image.id)].includes(id), `${slug}: ${id}`);
  }
});

test("review 15 Oct: therapy imagery leads only the pain page; Panchakarma shows the village (AHV-WB.031)", () => {
  // VIKASH-20261009-031: the page "looks like a spa, not a hospital"; asked for a doctor / pulse check, villa or family walking,
  // and back/knee treatment only for the pain page.
  const THERAPY = ["kt-199", "kt-190", "kt-202", "ahv-pkd-180"];
  for (const slug of Object.keys(PICKS)) {
    const c = productionCampaign(slug);
    if (slug === "pain-management") { assert.equal(c.hero.image.A.id, "ahv-pkd-180"); continue; }
    assert.ok(!THERAPY.includes(c.hero.image.A.id) && !THERAPY.includes(c.hero.mobileImage.id), `${slug}: no therapy hero`);
  }
  assert.equal(productionCampaign("panchakarma").hero.image.A.id, "ahv-pkd-50");
  assert.equal(fs.existsSync(path.join(SITE, "public/ahv/assets/img/owner-decision-20261015/ahv-pkd-186.webp")), false, "the rejected Kizhi file is gone");
});

test("review 15 Oct: the Janu Vasti hero keeps the oil stream, dough ring and knee in frame at 1280/1536/1920 px and on a 390 px phone (AHV-WB.058)", () => {
  // Variant A hero (production/document.css): desktop >=768px = a 46/54 grid, min-height 700px, the image object-fit:cover in
  // the 54% column at object-position 60% 50%; phone <=767px = full width x 440px at 50% 25%. The route's copy is short, so
  // the desktop frame is 0.54*vw x 700px (the widest aspect, i.e. the tightest vertical crop; a taller frame shows more).
  const css = read("campaign-v2/production/document.css");
  assert.match(css, /\[data-variant="A"\] \.lp-hero\{display:grid;grid-template-columns:minmax\(0,46fr\) minmax\(0,54fr\);min-height:700px\}/);
  assert.match(css, /@media \(min-width:768px\)\{[^@]*\[data-variant="A"\] \.lp-hero__img\{object-position:60% 50%\}/);
  assert.match(css, /\[data-variant="A"\] \.lp-hero__media\{order:-1;height:440px\}\n  \[data-variant="A"\] \.lp-hero__img\{object-position:50% 25%\}/);
  assert.equal(ROUTES["pain-management"].variant ?? "A", "A");
  const im = IMAGES["ahv-pkd-180"];
  assert.deepEqual([im.width, im.height], [1600, 1616]);
  const W = im.width, H = im.height;
  /** Visible part of the image (fractions of its width and height) under object-fit:cover in a frame of `aspect` (w/h). */
  const visible = (aspect, px, py) => {
    const [vw, vh] = aspect > W / H ? [W, W / aspect] : [H * aspect, H];
    const x0 = (W - vw) * px, y0 = (H - vh) * py;
    return { x0: x0 / W, x1: (x0 + vw) / W, y0: y0 / H, y1: (y0 + vh) / H };
  };
  // Subject boxes measured on the built 1600 px file (fractions): the dough ring with the knee under it, and the oil stream
  // from below the bowl down to the ring.
  const SUBJECT = [{ name: "ring and knee", x0: 0.29, x1: 0.71, y0: 0.47, y1: 0.81 }, { name: "oil stream", x0: 0.44, x1: 0.46, y0: 0.2, y1: 0.52 }];
  const FRAMES = [
    { name: "1280 desktop", aspect: (0.54 * 1280) / 700, px: 0.6, py: 0.5 },
    { name: "1536 desktop", aspect: (0.54 * 1536) / 700, px: 0.6, py: 0.5 },
    { name: "1920 desktop", aspect: (0.54 * 1920) / 700, px: 0.6, py: 0.5 },
    { name: "390 phone", aspect: 390 / 440, px: 0.5, py: 0.25 },
  ];
  for (const f of FRAMES) {
    const v = visible(f.aspect, f.px, f.py);
    for (const s of SUBJECT) assert.ok(s.x0 >= v.x0 && s.x1 <= v.x1 && s.y0 >= v.y0 && s.y1 <= v.y1, `${f.name}: ${s.name} in frame (${JSON.stringify(v)})`);
  }
});
