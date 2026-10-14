// Train B integration (15 Oct 2026), composed exactly as Train A was (fixtures/train-a-20261014.mjs). Every Train B
// candidate was built on c54e2795e and recorded its own exact source delta (before/after text replacements plus
// before/after SHA-256) and, where it changed campaign configs, its own exact config reversal. Train B sits on top of the
// integrated Train A tree, so no candidate's after-hash can hold on the integrated file. This module composes them
// without loosening any pin:
//   - removing every Train B candidate's delta from the integrated text (newest merge first, each edit occurring exactly
//     once) must hash to the integrated Train A bytes recorded in train-b-20261015.json `trainABytesSHA256`;
//   - those bytes, with Train A reversed by reverseTrainASource, are the c54e2795e base; each candidate's recorded
//     before-SHA-256 must equal them, and applying that candidate's own delta to them must give exactly its recorded
//     after-SHA-256 (so each candidate's exact bytes are still checked).
// Callers then hand the returned Train A bytes to reverseTrainASource and every older pin runs unchanged.
// Config reversals run newest first, each asserting the exact field it restores (see reverseTrainBConfig).
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { IMAGES } from "../../campaign-v2/data/images.ts";
import { reverseTrainASource } from "./train-a-20261014.mjs";

const json = (name) => JSON.parse(fs.readFileSync(new URL(`./${name}`, import.meta.url), "utf8"));
const sha = (s) => createHash("sha256").update(s).digest("hex");
const plain = (v) => JSON.parse(JSON.stringify(v));

export const TRAIN_B = json("train-b-20261015.json");
const OWNER_DECISIONS_C = json("owner-decisions-c-20261014.json");
const SURVIVOR_LINK = json("yoga-survivor-link-20261014.json");
const D03 = json("d03-copy-corrections-20261014.json");
const D04 = json("train-d04-copy-20261014.json");
const D05 = json("train-d05-20261014.json");
const D06 = json("train-d06-copy-20261015.json");

/** Candidates in merge order: name and per-file entries ({beforeSHA256, afterSHA256, replacements: [{before, after}]}). */
export const TRAIN_B_CANDIDATES = Object.freeze([
  { name: "owner decisions C", files: { ...OWNER_DECISIONS_C.files, ...TRAIN_B.recordedDeltas["owner decisions C"].files } },
  { name: "queued batch 15", files: SURVIVOR_LINK.files },
  { name: "train C02", files: TRAIN_B.recordedDeltas["train C02"].files },
  { name: "trains C03/C04", files: TRAIN_B.recordedDeltas["trains C03/C04"].files },
  { name: "trains C01/C02/D01/D02 entity", files: TRAIN_B.recordedDeltas["trains C01/C02/D01/D02 entity"].files },
  { name: "train D04", files: D04.files },
  { name: "train D05", files: D05.files },
  { name: "train D06", files: D06.files },
  { name: "owner decision 23", files: TRAIN_B.recordedDeltas["owner decision 23"].files },
  { name: "train D03", files: D03.files },
]);

function strip(path, text, replacements, name) {
  let value = text;
  for (const { before, after } of [...replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: ${name} delta occurs exactly once`);
    value = value.replace(after, before);
  }
  return value;
}

function apply(path, text, replacements, name) {
  let value = text;
  for (const { before, after } of replacements) {
    assert.equal(value.split(before).length - 1, 1, `${path}: ${name} delta applies exactly once to the base`);
    value = value.replace(before, after);
  }
  return value;
}

// Train A batch 7 (WhatsApp prefill) recorded its delta in whatsapp-prefill-delta.json, outside reverseTrainASource.
const WHATSAPP_PREFILL = json("whatsapp-prefill-delta.json").edits;
/** The c54e2795e bytes of `path` from its integrated Train A bytes: reverseTrainASource, then batch 7's exact delta. */
function trainABase(path, trainA) {
  return [...(WHATSAPP_PREFILL[path] ?? [])].reverse().reduce((x, e) => {
    assert.equal(x.split(e.to).length - 1, 1, `${path}: approved WhatsApp delta occurs once`);
    return x.replace(e.to, e.from);
  }, reverseTrainASource(path, trainA));
}

/** The integrated Train A text of `path` with every Train B candidate delta removed (unchanged if none touched it). */
export function reverseTrainBSource(path, text) {
  const touching = TRAIN_B_CANDIDATES.filter((c) => c.files[path]);
  if (!touching.length) return text;
  const trainA = [...touching].reverse().reduce((t, c) => strip(path, t, c.files[path].replacements, c.name), text);
  assert.equal(sha(trainA), TRAIN_B.trainABytesSHA256[path], `${path}: exactly the integrated Train A bytes`);
  const base = trainABase(path, trainA);
  for (const c of touching) {
    assert.equal(sha(base), c.files[path].beforeSHA256, `${path}: base bytes (${c.name})`);
    assert.equal(sha(apply(path, base, c.files[path].replacements, c.name)), c.files[path].afterSHA256, `${path}: exactly the ${c.name} source`);
  }
  return trainA;
}

/** The exact c54e2795e base text plus only `name`'s own recorded delta (that candidate's own after-bytes, asserted). */
export function candidateSource(name, path, text) {
  const own = TRAIN_B_CANDIDATES.find((c) => c.name === name);
  assert.ok(own?.files[path], `${path}: ${name} recorded`);
  const base = trainABase(path, reverseTrainBSource(path, text));
  const value = apply(path, base, own.files[path].replacements, name);
  assert.equal(sha(value), own.files[path].afterSHA256, `${path}: exactly the ${name} source`);
  return value;
}

// Owner decisions C (14 Oct 2026, decisions 10-11): the hero/steps photograph picks (fixtures/owner-decisions-c-20261014.json
// photoPicks, as integrated: AHV-WB.005.hero-image and AHV-WB.403.change excluded, the /lp/treatment-in-kerala/ phone cover
// kept as Train A's AHV-WB.457 kt-314) and the English-film Stories band on the DE/RU routes.
const PHOTO_PICKS = OWNER_DECISIONS_C.photoPicks.routes;

/** Owner decisions C config reversal: hero (A-D), phone hero, steps photograph, appended gallery entry, DE/RU Stories. */
export function reverseOwnerDecisionsCConfig(slug, c, { pagesOnly = false } = {}) {
  const picked = pagesOnly ? undefined : PHOTO_PICKS[slug];
  if (picked) {
    const id = (field) => ({ heroImage: c.hero.image.A.id, mobileImage: c.hero.mobileImage.id, pathwayImage: c.page.pathway.image.id })[field];
    for (const [field, want] of Object.entries(picked.after)) assert.equal(id(field), want, `${slug}.${field}`);
    const before = (field) => plain(IMAGES[picked.before[field]]);
    for (const v of ["A", "B", "C", "D"]) { assert.equal(c.hero.image[v].id, picked.after.heroImage, slug); c.hero.image[v] = before("heroImage"); }
    c.hero.mobileImage = before("mobileImage"); c.page.pathway.image = before("pathwayImage");
    if (picked.galleryAppended) {
      assert.deepEqual(c.gallery.at(-1), { category: picked.galleryCategory, image: IMAGES[picked.galleryAppended] }, slug);
      c.gallery.pop();
    }
  }
  if (OWNER_DECISIONS_C.storiesAddedTo.includes(slug)) { assert.equal(c.page.stories.films.length, 3, slug); delete c.page.stories; }
  return c;
}

/** Bindings (production/bindings.ts ROUTES picks): restore the prior hero, phone hero and steps photograph exactly. */
export function reverseTrainBBindings(bindings) {
  for (const [slug, b] of Object.entries(bindings)) {
    const pick = PHOTO_PICKS[slug];
    if (!pick) continue;
    for (const [field, id] of Object.entries(pick.after)) assert.deepEqual(b[field], IMAGES[id], `${slug}.${field}`);
    for (const [field, id] of Object.entries(pick.before)) b[field] = IMAGES[id];
  }
  return bindings;
}

/** 1 where owner decision 10 appended a steps photograph to the route's gallery, else 0. */
export const trainBGalleryAppended = (slug) => (PHOTO_PICKS[slug]?.galleryAppended ? 1 : 0);

/** The gallery without the one steps photograph decision 10 appended last (asserted exactly), else the gallery. */
export function trainBGalleryBefore(slug, g) {
  const appended = PHOTO_PICKS[slug]?.galleryAppended;
  if (!appended) return g;
  assert.deepEqual(g.at(-1), { category: PHOTO_PICKS[slug].galleryCategory, image: IMAGES[appended] }, `${slug}: appended steps photograph`);
  assert.equal(g.filter((x) => x.image.id === appended).length, 1, `${slug}: appended once`);
  return g.slice(0, -1);
}

// Queued batch 15 (AHV-WB.026.change): the one treatment-packages "Personalised yoga" link now points at the survivor URL.
export function reverseBatch15Config(slug, c) {
  if (slug !== "treatment-packages") return c;
  const hits = c.page.offering.cards.flatMap((x) => x.links ?? []).filter((l) => l.href === SURVIVOR_LINK.survivorHref.after);
  assert.equal(hits.length, 1, `${slug}: exactly one approved survivor link`);
  hits[0].href = SURVIVOR_LINK.survivorHref.before;
  return c;
}

// Train C02 (AHV-WB.054.change; the same commit is in C01): the approved Pain Abhyangam description.
export function reverseC02Config(slug, c) {
  if (slug !== "pain-management") return c;
  return walkReplace(slug, c, "Abhyangam, a medicated oil massage", "Abhyangam – full-body medicated oil therapy", 1, 1, "C02");
}

// Trains C03/C04 (rest photo rows): the approved rest photograph ahv-img-016 on eight more routes (bindings.ts stillness).
export const TRAIN_B_REST_ROUTES = Object.freeze(["lp-cleansing-centre", "lp-pain-management", "lp-treatment-kerala", "lp-weight-management",
  "lp-treatment-kerala-ru", "monsoon-wellness", "rejuvenation-detox", "lp-behandlung-kerala"]);
export function reverseRestConfig(slug, c, { pagesOnly = false } = {}) {
  if (pagesOnly || !TRAIN_B_REST_ROUTES.includes(slug)) return c;
  assert.deepEqual(c.stillness.image, IMAGES["ahv-img-016"], `${slug}: approved rest photograph`);
  c.stillness.image = plain(IMAGES["gal-post-therapy-stillness-wakem"]);
  return c;
}

/** Replace `after` by `before` in every string of a config; the hit count must lie in [min, max]. */
function walkReplace(slug, c, before, after, min, max, name) {
  let hits = 0;
  const walk = (o) => { for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === "string" && v.includes(after)) { hits += v.split(after).length - 1; o[k] = v.replaceAll(after, before); } else if (v && typeof v === "object") walk(v); } };
  walk(c);
  assert.ok(hits >= min && hits <= max, `${slug}: exact ${name} copy correction (${hits} hits)`);
  return c;
}

// Train D03 (accepted rows only): its exact page-copy deletions/terminology, reversed in the loaded config (a pathway step
// is mirrored into admission.steps, so one source edit can appear twice; the callers' config hash pins are the exactness check).
export function reverseD03Config(slug, c) {
  const entry = D03.files[`campaign-v2/production/pages/${slug}.ts`];
  if (!entry) return c;
  for (const { before, after } of [...entry.replacements].reverse()) walkReplace(slug, c, before, after, 1, 2, "D03");
  return c;
}

/** Field-level config changes [{path, before, after, removed?}] (the D04/D05/D06 fixture form), reversed exactly. */
function reverseFields(slug, c, changes, name) {
  for (const { path, before, after, removed } of [...changes].reverse()) {
    let o = c;
    for (const k of path.slice(0, -1)) o = o[k];
    const k = path.at(-1);
    if (removed) assert.ok(!(k in o), `${slug}: ${name} removed ${path.join(".")}`);
    else assert.deepEqual(o[k], after, `${slug}: exact ${name} field ${path.join(".")}`);
    o[k] = plain(before);
  }
  return c;
}
// Owner decision 22 (AHV-LATER-010.02/.03): the family form's optional duration choices are nights (forms/schema.ts
// FAMILY_DURATIONS), on every config that carries that form.
const FAMILY_NIGHTS = [["7 days", "7 nights"], ["14 days", "14 nights"], ["21 days", "21 nights"]];
export function reverseDecision22Config(slug, c) {
  const fields = (c.form?.schema?.steps ?? []).flatMap((s) => s.fields ?? []).filter((f) => f.name === "duration" && f.type === "select");
  if (!fields.length) return c;
  assert.equal(fields.length, 1, `${slug}: one family duration select`);
  const options = fields[0].options;
  assert.deepEqual(options.map((o) => [o.value, o.label]), [["", "Select duration"], ...FAMILY_NIGHTS.map(([, n]) => [n, n])], `${slug}: owner decision 22 durations`);
  FAMILY_NIGHTS.forEach(([days], i) => { options[i + 1].value = days; options[i + 1].label = days; });
  return c;
}

// Owner decision 23 (AHV-WB.434.change): the /lp/panchkarma-treatment/ lead no longer says "cost" (prices stay hidden).
export function reverseDecision23Config(slug, c) {
  if (slug !== "lp-panchakarma") return c;
  return walkReplace(slug, c, "it is natural to look at length and cost first.", "it is natural to look at length first.", 1, 1, "owner decision 23");
}
export const reverseD06Config = (slug, c) => reverseFields(slug, c, D06.configChanges.filter((x) => x.slug === slug), "train D06");
export const reverseD05Config = (slug, c) => reverseFields(slug, c, D05.configChanges[slug] ?? [], "train D05");
export const reverseD04Config = (slug, c) => reverseFields(slug, c, D04.configChanges[slug] ?? [], "train D04");

/**
 * A JSON copy of a production config with every Train B candidate's exact config change reversed, newest first.
 * Use the returned value: a reversal may return a new object.
 */
export function reverseTrainBConfig(slug, config, options = {}) {
  // Newest merge first: owner decisions 23 and 22, D06, D05, D04, D03, C03/C04 rest photos, C02, queued batch 15, owner decisions C.
  const newestFirst = [reverseDecision23Config, reverseDecision22Config, reverseD06Config, reverseD05Config, reverseD04Config, reverseD03Config,
    reverseRestConfig, reverseC02Config, reverseBatch15Config, reverseOwnerDecisionsCConfig];
  return newestFirst.reduce((c, reverse) => reverse(slug, c, options), config);
}

/**
 * As reverseTrainBConfig, but only the changes made in campaign page sources (production/pages/*.ts). For tests whose
 * baseline loads the old page sources with the current bindings.ts, where the binding-level photo picks belong to both.
 */
export const reverseTrainBPageConfig = (slug, config) => reverseTrainBConfig(slug, config, { pagesOnly: true });
