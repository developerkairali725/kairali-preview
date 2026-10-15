// Train J batch 3 (15 Oct 2026): AHV-WB.123/166/253/298/362/372/452/454/514/526/549 and AHV-LATER-023.01 on the Train I
// head 00e944e44 (fixtures/train-j3-20261015.json). Composed exactly as Train I composes on Train G
// (fixtures/train-i-20261015.mjs): callers reverse Train J3 FIRST, then hand the result to the older reversals, and every
// older pin runs unchanged.
//   - reverseTrainJ3Source removes Train J3's recorded source delta. Two states are accepted per file, both by full
//     SHA-256: the Train J3 bytes (reversed, then the head bytes asserted) and the head bytes (passed through).
//   - peelTrainJ3Source is the hook older chains call first: it reverses exactly the Train J3 bytes and passes any other
//     text through, so each older layer still asserts its own states.
//   - reverseTrainJ3Config restores every production-config field Train J3 changed (configChanges), asserting each
//     field's exact Train J3 value first; a field already at its head value passes through.
//   - reverseTrainJ3Binding restores the route-binding fields (bindings.ts: og, ogImageAlt, offeringImages) on a copy.
//   - reverseTrainJ3List / routeAllowedBeforeTrainJ3 / baseOrderBeforeTrainJ3 give the exported lists and pure helpers as
//     they were at the head (D_VILLAGE_AND_STORIES without lp-brand, GUEST_VIDEO_ROUTES without /lp/kairali-brand/).
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";

export const TRAIN_J3 = JSON.parse(fs.readFileSync(new URL("./train-j3-20261015.json", import.meta.url), "utf8"));
export const ABSENT = "__absent__";
const sha = (s) => createHash("sha256").update(s).digest("hex");
const plain = (v) => JSON.parse(JSON.stringify(v));

/** The Train I head text of `path` (unchanged when Train J3 did not touch it, or when it is already the head text). */
export function reverseTrainJ3Source(path, text) {
  const e = TRAIN_J3.files[path];
  if (!e || typeof text !== "string") return text;
  if (sha(text) === e.beforeSHA256) return text;
  assert.equal(sha(text), e.afterSHA256, `${path}: exactly the Train J3 source`);
  let value = text;
  for (const { row, before, after } of [...e.replacements].reverse()) {
    assert.equal(value.split(after).length - 1, 1, `${path}: Train J3 delta (${row}) occurs exactly once`);
    value = value.replace(after, () => before);
  }
  assert.equal(sha(value), e.beforeSHA256, `${path}: exactly the Train I head bytes`);
  return value;
}

/** For older layers' chains: the Train J3 bytes of a Train J3 file are reversed exactly; any other text passes through. */
export function peelTrainJ3Source(path, text) {
  const e = TRAIN_J3.files[path];
  return e && typeof text === "string" && sha(text) === e.afterSHA256 ? reverseTrainJ3Source(path, text) : text;
}

const at = (c, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), c);
const valueAt = (c, path) => {
  const parent = at(c, path.slice(0, -1));
  return parent != null && Object.hasOwn(parent, path.at(-1)) ? parent[path.at(-1)] : ABSENT;
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** A production config (JSON copy) with Train J3's field changes reversed exactly. Mutates and returns `c`. */
export function reverseTrainJ3Config(slug, c) {
  const changes = TRAIN_J3.configChanges[slug];
  if (!changes || !c) return c;
  // Each field is in exactly one of its two recorded states; a raw page copy (pages/*.ts, no route photographs) or an
  // older layer's config carries only some of the fields, so the check is per field.
  const present = changes.filter(({ path }) => at(c, path.slice(0, -1)) != null);
  for (const { path, before, after } of [...present].reverse()) {
    if (same(valueAt(c, path), before)) continue;
    assert.ok(same(valueAt(c, path), after), `${slug}: exact Train J3 field ${path.join(".")}`);
    const parent = at(c, path.slice(0, -1));
    if (before === ABSENT) delete parent[path.at(-1)];
    else parent[path.at(-1)] = plain(before);
  }
  return c;
}

/** A route binding (a copy) with Train J3's binding fields restored (og / ogImageAlt / offeringImages). */
export function reverseTrainJ3Binding(slug, binding) {
  const b = TRAIN_J3.bindings[slug];
  if (!b || !binding) return binding;
  const r = plain(binding);
  for (const [field, { before, after }] of Object.entries(b)) {
    if (field === "row") continue;
    const now = field === "offeringImages" ? r[field]?.map((i) => i.id) : r[field];
    if (same(now ?? ABSENT, before)) continue;
    assert.ok(same(now, after), `${slug}: exact Train J3 binding ${field}`);
    if (before === ABSENT) delete r[field];
    else r[field] = plain(before);
  }
  return r;
}

/** An exported list as at the Train I head: Train J3's recorded additions removed (each asserted present exactly once). */
export function reverseTrainJ3List(name, list) {
  const l = TRAIN_J3.lists[name];
  assert.ok(l, `no Train J3 list ${name}`);
  const added = l.appended ?? l.added;
  const out = [...list];
  for (const x of added) {
    assert.equal(out.filter((y) => y === x).length, 1, `${name}: Train J3 addition ${x} occurs exactly once`);
    out.splice(out.indexOf(x), 1);
  }
  if (l.appended) assert.deepEqual(list.slice(-added.length), added, `${name}: appended at the end`);
  if (l.insertedAfter) assert.equal(list[list.indexOf(added[0]) - 1], l.insertedAfter, `${name}: inserted after ${l.insertedAfter}`);
  return out;
}

/** guest-video-policy routeAllowed as at the head: the Train J3 route is not allowed; everything else is unchanged. */
export const routeAllowedBeforeTrainJ3 = (routeAllowed) => (pathname, lang) =>
  !TRAIN_J3.lists.GUEST_VIDEO_ROUTES.added.includes(pathname) && routeAllowed(pathname, lang);

/** section-order baseOrder as at the head: a route Train J3 appended to D_VILLAGE_AND_STORIES keeps its variant default. */
export const baseOrderBeforeTrainJ3 = (baseOrder, ORDER) => (slug, v) =>
  TRAIN_J3.lists.D_VILLAGE_AND_STORIES.appended.includes(slug) ? [...ORDER[v]] : baseOrder(slug, v);
