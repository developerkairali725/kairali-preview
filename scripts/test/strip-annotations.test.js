// X-19 regression. On 15 Jul we handed the Perplexity fact-gate demand.md WITH
// our quarantine header attached; it recited our conclusions back as "findings".
// An echo is not verification — and it is how a future agent could fake a
// passing fact-check by pre-loading the answer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripAnnotations, isSelfReferentialEvidence } from "../lib/strip-annotations.mjs";

test("strips the REAL demand.md quarantine header that contaminated the audit", () => {
  const raw = readFileSync("docs/whatisayurveda-research/demand.md", "utf8");
  const { clean, wasContaminated, stripped } = stripAnnotations(raw);
  assert.equal(wasContaminated, true, "the real file IS contaminated by our header");
  assert.ok(stripped.length > 0);
  for (const tell of ["DO NOT USE", "⛔", "GPT-5 audit", "Superseded by"]) {
    assert.ok(!clean.includes(tell), `our conclusion "${tell}" must not reach the auditor`);
  }
  // …but the actual data under review MUST survive
  assert.ok(clean.includes("ashwagandha"), "the artifact's real content must survive stripping");
  assert.ok(clean.includes("search demand map"), "the artifact's own heading must survive");
});

test("sentinel-wrapped analysis is removed exactly", () => {
  const r = stripAnnotations("real content\n<!-- AGENT-ANALYSIS-START -->our take<!-- AGENT-ANALYSIS-END -->\nmore real");
  assert.ok(!r.clean.includes("our take"));
  assert.ok(r.clean.includes("real content") && r.clean.includes("more real"));
});

test("does NOT strip a clean artifact — over-stripping makes the auditor judge a phantom", () => {
  const src = "# Herbs\n\n> Ashwagandha is traditionally used as a rasayana.\n\nBody text.";
  const r = stripAnnotations(src);
  assert.equal(r.wasContaminated, false, "a legitimate quote must not be mistaken for our analysis");
  assert.equal(r.clean, src);
});

test("catches a verdict that cites the artifact instead of a real source", () => {
  assert.ok(isSelfReferentialEvidence("The artifact itself states the data is flawed."));
  assert.ok(isSelfReferentialEvidence("As noted in the document, shilajit is zero."));
  assert.ok(!isSelfReferentialEvidence("Per NIH ODS, shilajit demand is substantial [1]."));
});
