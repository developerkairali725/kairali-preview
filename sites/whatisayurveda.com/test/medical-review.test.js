// The review claim is the site's core trust asset. These tests exist because we
// shipped code that stamped EVERY page "Medically reviewed by Dr. Deepu John
// (BAMS), 14 July 2026" for reviews that never happened. Never again.
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveReview, REVIEWERS, HEAD_REVIEWER_KEY } from "../app/lib/medical-review.ts";

test("no reviewedOn => NO review claim (the honest default)", () => {
  assert.equal(resolveReview(undefined, undefined, "/herbs"), null);
});

test("a reviewer named without a real date is a FALSE CLAIM and fails the build", () => {
  assert.throws(() => resolveReview(undefined, "deepu-john", "/herbs"), /false claim/);
});

test("a real review resolves to the named physician + the TRUE date", () => {
  const r = resolveReview("2026-07-15", "deepu-john", "/herbs");
  assert.equal(r.date, "2026-07-15");
  assert.equal(r.reviewer.name, "Dr. Deepu John");
  assert.equal(r.reviewer.credentials, "BAMS");
});

test("reviewedBy defaults to the panel head", () => {
  assert.equal(resolveReview("2026-07-15").reviewer.key, HEAD_REVIEWER_KEY);
});

test("an off-panel reviewer fails the build (no inventing physicians)", () => {
  assert.throws(() => resolveReview("2026-07-15", "dr-nobody"), /not on the panel/);
});

test("a malformed date fails the build (no build-clock stamps)", () => {
  assert.throws(() => resolveReview("14 July 2026"), /YYYY-MM-DD/);
  assert.throws(() => resolveReview(new Date().toISOString()), /YYYY-MM-DD/);
});

test("the roster is the single source of truth — head exists on the panel", () => {
  assert.ok(REVIEWERS[HEAD_REVIEWER_KEY], "head reviewer must be on the panel");
});

test("every panel member is BAMS only — no invented MD/MS/PhD (roster verified 15 Jul)", () => {
  for (const r of Object.values(REVIEWERS)) {
    assert.equal(r.credentials, "BAMS", `${r.name}: only BAMS is published for any Kairali physician`);
  }
});

test("no panel member may carry a placeholder or guessed name", () => {
  for (const r of Object.values(REVIEWERS)) {
    assert.match(r.name, /^Dr\. \S+/, `${r.name}: must be a real published physician name`);
    assert.ok(!/\//.test(r.name), `${r.name}: an ambiguous "A/B" spelling means we do NOT know the name — keep them off the panel`);
    assert.ok(r.title && r.key && r.anchor, `${r.name}: incomplete roster entry`);
  }
});

test("Dr. Deepu John's title matches the live sources (not the truncated one)", () => {
  assert.match(REVIEWERS["deepu-john"].title, /Head of Department/);
});
