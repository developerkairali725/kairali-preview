// Train H merged into Train G (codex/ahv-train-g-20261015, 15 Oct 2026). Both trains were built on the Train F head
// dae94e21c. Their recorded source fixtures (train-g-20261015.json `files`/`views` and train-h-20261015.json `files`) are
// disjoint, but the Train G rework (f883eedb3, not in a recorded fixture) and Train H edited four of the same files:
//   - app/(english)/_families/design-view.tsx: Train H adds the AHV-M001.01 RTL skip-link rule; the rework (AHV-M030.01)
//     routes the locale canonical through keepsLocaleCanonical. Different lines; both kept;
//   - public/ahv/assets/reader25a-family-render.js: the same AHV-I04 renderer exemption in both (identical code); the
//     merged file is Train H's bytes exactly, so nothing is recorded here;
//   - public/ahv/assets/reader25a-family-data.js: both retarget 'Yoga programmes' from the 301 /yoga-retreats/ to
//     /yoga-meditation-programs/ (identical); only the rework also retargets 'Ayurveda training programmes' from
//     /ayurveda-training-programs/ to /ayurveda-training-programme/ (AHV-I04.M066.links);
//   - campaign-v2/forms/schema.ts: Train H's per-language phone example (AHV-WB.525, de "+49 …") and the rework's
//     (AHV-WB.548, ru "+7 900 000 00 00") become one table, under Train H's name CAMPAIGN_ENQUIRY_PHONE_PLACEHOLDER.
// reverseTrainGHIntegrationSource removes exactly the rework's delta from the merged bytes, so Train H's own pin
// (reverseTrainHSource, which calls this first) sees exactly the Train H after-bytes. Two states are accepted per file,
// both by full SHA-256: the merged bytes (reversed, then the Train H after-bytes asserted) and the Train H after-bytes
// (passed through). Any other state fails.
//
// The two phone examples are also reversed per language for the value checks each train's own test makes:
// reverseTrainHPhoneExample undoes only Train H's German example, reverseTrainGReworkPhoneExample only the rework's
// Russian one. Each asserts the exact value it undoes and that no other language carries it.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
// Train I (15 Oct 2026): its exact delta on a shared file is removed first (fixtures/train-i-20261015.mjs).
import { peelTrainISource } from "./train-i-20261015.mjs";

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

export const TRAIN_GH_INTEGRATION = Object.freeze({
  trainGHead: "0b2d4391df63ba8beedaea4e0c8260f7073ffa85",
  trainHHead: "e9313951ccad828bce4a9172e2d3c5ac7494c639",
  files: Object.freeze({
    "app/(english)/_families/design-view.tsx": Object.freeze({
      rows: ["AHV-M030.01"],
      mergedSHA256: "4decf0cc647cc1b835778008251d4e5cffbfecc9ec2df046a58097f80de63e5a",
      trainHSHA256: "14b78bcad0c74f328c29418699bea9a9b7f38a13281a7730095d5281d6259976",
      replacements: Object.freeze([
        Object.freeze({
          before: "import { reviewedTitleFor, reviewedCatalogueTitle } from \"./localized-title.mjs\";",
          after: "import { reviewedTitleFor, reviewedCatalogueTitle, keepsLocaleCanonical } from \"./localized-title.mjs\";",
        }),
        Object.freeze({
          before: "(reviewedLocaleTitle || (route.path === \"/karkidaka-chikitsha-or-monsoon-wellness.html\" && locale !== \"en\"))",
          after: "(reviewedLocaleTitle || keepsLocaleCanonical(route.path, locale))",
        }),
      ]),
    }),
    "campaign-v2/forms/schema.ts": Object.freeze({
      rows: ["AHV-WB.548.phone-example"],
      mergedSHA256: "f5aafa2a66af7bf0cf777b7f3f139b60c752d73f12002f052711c23aeb76431b",
      trainHSHA256: "fbd15b965cf2e5ec54cd473dd6a84afc23e557d7fe312a52d285cdb2415f1d59",
      replacements: Object.freeze([
        Object.freeze({
          before: " * English and Russian keep the form's existing +91 example. Only the placeholder differs; the field is unchanged.\n */\nexport const CAMPAIGN_ENQUIRY_PHONE_PLACEHOLDER: Record<\"en\" | \"de\" | \"ru\", string> = { en: \"+91 …\", de: \"+49 …\", ru: \"+91 …\" };",
          after: " * English and Russian keep the form's existing +91 example. Only the placeholder differs; the field is unchanged.\n * AHV-WB.548.phone-example (Train G rework, 15 Oct 2026; composed with Train H in the Train G integration): the Russian\n * page shows the Russian example its own validation message already gives (production/ui.ts, \"например +7 900 000 00 00\").\n */\nexport const CAMPAIGN_ENQUIRY_PHONE_PLACEHOLDER: Record<\"en\" | \"de\" | \"ru\", string> = { en: \"+91 …\", de: \"+49 …\", ru: \"+7 900 000 00 00\" };",
        }),
      ]),
    }),
    "public/ahv/assets/reader25a-family-data.js": Object.freeze({
      rows: ["AHV-I04.M066.links"],
      mergedSHA256: "b26a9226e3aeda061d58316c790332d564d175a13a11c776cdbc7dc6cb06045e",
      trainHSHA256: "60fee6bde0cac738ad2dddbbee4f4777ab3b633816de4d6640f236016e412b01",
      replacements: Object.freeze([
        Object.freeze({ before: "\"href\":\"/ayurveda-training-programs/\"", after: "\"href\":\"/ayurveda-training-programme/\"" }),
      ]),
    }),
  }),
  phoneExamples: Object.freeze({
    trainH: Object.freeze({ row: "AHV-WB.525.phone-example", locale: "de", before: "+91 …", after: "+49 …" }),
    trainGRework: Object.freeze({ row: "AHV-WB.548.phone-example", locale: "ru", before: "+91 …", after: "+7 900 000 00 00" }),
  }),
});

/** Train H's exact after-bytes of `path`: the rework's delta on a shared file removed; other paths pass through. */
export function reverseTrainGHIntegrationSource(path, rawText) {
  const text = peelTrainISource(path, rawText);
  const e = TRAIN_GH_INTEGRATION.files[path];
  if (!e) return text;
  if (sha256(text) === e.trainHSHA256) return text;
  assert.equal(sha256(text), e.mergedSHA256, `${path}: exactly the merged Train G + Train H source`);
  let value = text;
  for (const { before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: the Train G rework delta (${e.rows.join(", ")}) occurs exactly once`);
    value = value.replace(after, () => before);
  }
  assert.equal(sha256(value), e.trainHSHA256, `${path}: reverses to the Train H after-bytes`);
  return value;
}

function reversePhoneExample(p, locale, value) {
  if (locale !== p.locale) {
    assert.notEqual(value, p.after, `${locale}: ${p.row} changed only ${p.locale}`);
    return value;
  }
  assert.equal(value, p.after, `${locale}: exactly the ${p.row} example`);
  return p.before;
}
/** A campaign enquiry phone example with Train H's German example (AHV-WB.525) undone. */
export const reverseTrainHPhoneExample = (locale, value) => reversePhoneExample(TRAIN_GH_INTEGRATION.phoneExamples.trainH, locale, value);
/** A campaign enquiry phone example with the Train G rework's Russian example (AHV-WB.548) undone. */
export const reverseTrainGReworkPhoneExample = (locale, value) => reversePhoneExample(TRAIN_GH_INTEGRATION.phoneExamples.trainGRework, locale, value);
/** A per-language example table with one train's example undone in every language. */
export const reversePhoneTable = (table, reverse) => Object.fromEntries(Object.entries(table).map(([loc, v]) => [loc, reverse(loc, v)]));
