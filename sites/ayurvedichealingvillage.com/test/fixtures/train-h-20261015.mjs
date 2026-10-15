// Train H (15 Oct 2026): twelve tracker rows on the Train F head dae94e21c (fixtures/train-h-20261015.json). Composed
// exactly as Train F composes on Train B (fixtures/train-f-20261015.mjs):
//   - reverseTrainHSource removes Train H's recorded source delta (each edit occurring exactly once) and must hash to the
//     Train F head bytes (beforeSHA256), after first checking the current bytes are exactly Train H's (afterSHA256);
//     callers then hand the result to reverseTrainFSource and every older pin runs unchanged;
//   - reverseTrainHConfig / reverseTrainHBindings restore lp-hospital-kerala's Train F hero (desktop A-D and phone) and
//     remove the monsoon-wellness / rejuvenation-detox programme-card photographs; reverseTrainHConfig also restores the
//     German campaign enquiry form's +91 phone example (AHV-WB.525). Every field they restore is asserted first.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { IMAGES } from "../../campaign-v2/data/images.ts";
// Train G integration (15 Oct 2026): Train H is merged onto Train G. The Train G rework also edited three of Train H's files
// (design-view.tsx, forms/schema.ts, reader25a-family-data.js); that exact delta is removed first, so Train H's pins run unchanged.
import { reverseTrainGHIntegrationSource } from "./train-gh-integration-20261015.mjs";

export const TRAIN_H = JSON.parse(fs.readFileSync(new URL("./train-h-20261015.json", import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const plain = (v) => JSON.parse(JSON.stringify(v));
const PICKS = TRAIN_H.photoPicks;

/** The Train F head text of `path` (unchanged when Train H did not touch it). */
export function reverseTrainHSource(path, rawText) {
  const e = TRAIN_H.files[path];
  if (!e) return rawText;
  const text = reverseTrainGHIntegrationSource(path, rawText);
  assert.equal(sha(text), e.afterSHA256, `${path}: exactly the Train H source`);
  let value = text;
  for (const { before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train H delta occurs exactly once`);
    value = value.replace(after, before);
  }
  assert.equal(sha(value), e.beforeSHA256, `${path}: exactly the Train F head bytes`);
  return value;
}

/** A production config (JSON copy) with Train H's photographs reversed exactly. Use the returned value. */
export function reverseTrainHConfig(slug, c) {
  const phone = TRAIN_H.phonePlaceholders[slug];
  const fields = (c.form?.schema?.steps ?? []).flatMap((s) => s.fields);
  if (phone) assert.ok(fields.some((f) => f.name === "phone"), `${slug}: phone field`);
  for (const field of fields) {
    if (field.name !== "phone" || field.placeholder === undefined) continue;
    // AHV-WB.525.phone-example: only the German campaign enquiry form's example prefix changed.
    if (phone) { assert.equal(field.placeholder, phone.after, `${slug}: phone placeholder`); field.placeholder = phone.before; }
    else assert.notEqual(field.placeholder, "+49 …", `${slug}: phone placeholder unchanged`);
  }
  const p = PICKS[slug];
  if (!p) return c;
  if (p.after) {
    assert.equal(c.hero.mobileImage.id, p.after.mobileImage, `${slug}.mobileImage`);
    for (const v of ["A", "B", "C", "D"]) {
      assert.equal(c.hero.image[v].id, p.after.heroImage, `${slug}.hero.${v}`);
      c.hero.image[v] = plain(IMAGES[p.before.heroImage]);
    }
    c.hero.mobileImage = plain(IMAGES[p.before.mobileImage]);
  }
  if (p.cards) {
    assert.equal(c.page.offering.kind, "cards", `${slug}: programme cards`);
    assert.equal(c.page.offering.cards.length, p.cards.length, `${slug}: one photograph per card`);
    c.page.offering.cards = c.page.offering.cards.map((card, i) => {
      assert.deepEqual(card.image, plain(IMAGES[p.cards[i]]), `${slug}.offering.cards[${i}].image`);
      const { image: _image, ...rest } = card;
      return rest;
    });
  }
  return c;
}

/** Bindings (production/bindings.ts ROUTES entries, a mutable copy): restore the Train F hero and phone hero; drop the
 *  card photographs. */
export function reverseTrainHBindings(bindings) {
  for (const [slug, b] of Object.entries(bindings)) {
    const p = PICKS[slug];
    if (!p) { assert.equal(b.offeringImages, undefined, `${slug}: no card photographs`); continue; }
    if (p.after) {
      for (const [field, id] of Object.entries(p.after)) assert.deepEqual(b[field], IMAGES[id], `${slug}.${field}`);
      for (const [field, id] of Object.entries(p.before)) b[field] = IMAGES[id];
    }
    if (p.cards) {
      assert.deepEqual(b.offeringImages, p.cards.map((id) => IMAGES[id]), `${slug}.offeringImages`);
      delete b.offeringImages;
    } else assert.equal(b.offeringImages, undefined, `${slug}: no card photographs`);
  }
  return bindings;
}
