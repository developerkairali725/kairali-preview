// Train F (15 Oct 2026): page-specific hero / steps photographs (production/bindings.ts PHOTO_PICKS_20261015, data/images.ts),
// built on the Train B head 4c164f4c4. Composed exactly as Train B composes on Train A (fixtures/train-b-20261015.mjs):
//   - reverseTrainFSource removes Train F's recorded source delta (each edit occurring exactly once) and must hash to the
//     Train B head bytes (beforeSHA256), after first checking the current bytes are exactly Train F's (afterSHA256);
//     callers then hand the result to reverseTrainBSource and every older pin runs unchanged;
//   - reverseTrainFConfig / reverseTrainFBindings restore each picked route's exact Train B hero (A-D), phone hero, steps
//     photograph and gallery, asserting every field they restore.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { IMAGES } from "../../campaign-v2/data/images.ts";

export const TRAIN_F = JSON.parse(fs.readFileSync(new URL("./train-f-20261015.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const plain = (v) => JSON.parse(JSON.stringify(v));
const PICKS = TRAIN_F.photoPicks;

/** The Train B head text of `path` (unchanged when Train F did not touch it). */
export function reverseTrainFSource(path, text) {
  const e = TRAIN_F.files[path];
  if (!e) return text;
  assert.equal(sha(text), e.afterSHA256, `${path}: exactly the Train F source`);
  let value = text;
  for (const { before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train F delta occurs exactly once`);
    value = value.replace(after, before);
  }
  assert.equal(sha(value), e.beforeSHA256, `${path}: exactly the Train B head bytes`);
  return value;
}

/** The gallery as at Train B: the one appended steps photograph popped (asserted exactly); no other gallery entry changes. */
function galleryBefore(slug, g) {
  const p = PICKS[slug];
  let gallery = g;
  if (p.galleryAppended) {
    assert.deepEqual(gallery.at(-1), { category: p.galleryCategory, image: IMAGES[p.galleryAppended] }, `${slug}: appended steps photograph`);
    assert.equal(gallery.filter((x) => x.image.id === p.galleryAppended).length, 1, `${slug}: appended once`);
    gallery = gallery.slice(0, -1);
  }
  return gallery;
}

/** A production config (JSON copy) with Train F's photograph picks reversed exactly. Use the returned value. */
export function reverseTrainFConfig(slug, c) {
  const p = PICKS[slug];
  if (!p) return c;
  assert.equal(c.hero.mobileImage.id, p.after.mobileImage, `${slug}.mobileImage`);
  assert.equal(c.page.pathway.image.id, p.after.pathwayImage, `${slug}.pathwayImage`);
  for (const v of ["A", "B", "C", "D"]) {
    assert.equal(c.hero.image[v].id, p.after.heroImage, `${slug}.hero.${v}`);
    c.hero.image[v] = plain(IMAGES[p.before.heroImage]);
  }
  c.hero.mobileImage = plain(IMAGES[p.before.mobileImage]);
  c.page.pathway.image = plain(IMAGES[p.before.pathwayImage]);
  c.gallery = galleryBefore(slug, c.gallery);
  return c;
}

/** Bindings (production/bindings.ts ROUTES entries, a mutable copy, with or without `gallery`): restore the Train B hero, phone
 *  hero, steps photograph and (when present) gallery. */
export function reverseTrainFBindings(bindings) {
  for (const [slug, b] of Object.entries(bindings)) {
    const p = PICKS[slug];
    if (!p) continue;
    for (const [field, id] of Object.entries(p.after)) assert.deepEqual(b[field], IMAGES[id], `${slug}.${field}`);
    for (const [field, id] of Object.entries(p.before)) b[field] = IMAGES[id];
    if (b.gallery) b.gallery = galleryBefore(slug, b.gallery);
  }
  return bindings;
}

/** 1 where Train F appended a steps photograph to the route's gallery, else 0. */
export const trainFGalleryAppended = (slug) => (PICKS[slug]?.galleryAppended ? 1 : 0);

/** The route's gallery as at Train B (asserted exactly). */
export const trainFGalleryBefore = (slug, g) => (PICKS[slug] ? galleryBefore(slug, g) : g);
