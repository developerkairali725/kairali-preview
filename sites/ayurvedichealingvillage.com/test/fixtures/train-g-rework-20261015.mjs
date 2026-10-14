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
