// Train G rework (15 Oct 2026), built on the Train B head dae94e21c (Train F on Train B). Composed exactly as Train F composes
// on Train B (fixtures/train-f-20261015.mjs): callers reverse Train G FIRST, then hand the result to the Train F / Train B /
// Train A reversals, and every older config pin runs unchanged.
//
// The only production-config change in Train G is AHV-WB.548.phone-example: the Russian campaign enquiry form's phone
// placeholder is the Russian example its own validation message gives (campaign-v2/forms/schema.ts
// CAMPAIGN_PHONE_PLACEHOLDER). reverseTrainGConfig asserts the exact new value on exactly that route and field and
// restores the shared "+91 …"; every other route must still carry "+91 …" untouched.
import assert from "node:assert/strict";

export const TRAIN_G_REWORK = Object.freeze({
  base: "dae94e21cac638a57f715a9081b3583dc680b338",
  phonePlaceholder: Object.freeze({ slug: "lp-treatment-kerala-ru", field: "phone", before: "+91 …", after: "+7 900 000 00 00" }),
});

/** A production config (JSON copy) with Train G's exact change reversed. Use the returned value. */
export function reverseTrainGConfig(slug, c) {
  const p = TRAIN_G_REWORK.phonePlaceholder;
  const fields = c?.form?.schema?.steps?.[0]?.fields;
  const phone = Array.isArray(fields) ? fields.find((f) => f.name === p.field) : undefined;
  if (slug !== p.slug) {
    if (phone && "placeholder" in phone) assert.notEqual(phone.placeholder, p.after, `${slug}: Train G changed only ${p.slug}`);
    return c;
  }
  assert.ok(phone, `${slug}: phone field present`);
  assert.equal(phone.placeholder, p.after, `${slug}: exactly the Train G placeholder`);
  phone.placeholder = p.before;
  return c;
}

// Integration into Train G (codex/ahv-train-g-20261015, 15 Oct 2026). The only source file both Train G (the accepted Train E
// rows, test/fixtures/train-g-20261015.json) and this rework edit is public/design/family-header.css: the rework inserts the
// AHV-M008.02 over-consent layering rule, Train G the AHV-I01.nav Air India scroll-margin rule, in different places. Train G's
// history pins its exact after-bytes, so the rework rule is removed FIRST, exactly. Two states are accepted, both by full
// SHA-256: the integrated file (Train G + rework), which reverses to the Train G after-bytes; and the Train G after-bytes,
// which pass through. Any other state fails.

import { createHash } from "node:crypto";
const sha256 = (s) => createHash("sha256").update(s).digest("hex");
export const TRAIN_G_REWORK_SOURCES = Object.freeze({
  "public/design/family-header.css": Object.freeze({
    row: "AHV-M008.02",
    insert: "/* AHV-M008.02: only when no usable room is left above the compact consent notice (family-header.js place()) */\n.ahv-fh-panel[data-ahv-fh-over-consent] { z-index:1000000; }\n",
    afterSHA256: "0b0f2519f9074acc2c746b1f179aafe070043bac27c061f51536097ac168c73c",
    beforeSHA256: "263d667c3a504e0ed0af3f1fa1bdfc43bef0e6d4268ae7f664eedfe6032cd192",
  }),
});

/** Source text with the rework's exact change on a Train G file removed; other paths pass through. */
export function reverseTrainGReworkSource(path, text) {
  const e = TRAIN_G_REWORK_SOURCES[path];
  if (!e) return text;
  if (sha256(text) === e.beforeSHA256) return text;
  assert.equal(sha256(text), e.afterSHA256, `${path}: exactly the integrated Train G rework source`);
  assert.equal(text.split(e.insert).length - 1, 1, `${path}: the ${e.row} rule occurs once`);
  const out = text.replace(e.insert, () => "");
  assert.equal(sha256(out), e.beforeSHA256, `${path}: reverses to the Train G after-bytes`);
  return out;
}

