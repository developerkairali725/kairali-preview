// I2: pending() in any string slot must render as visible "[id]" text, never crash a section or the metadata.
import { test } from "node:test";
import assert from "node:assert/strict";
import template from "../campaign-v2/campaigns/_template.ts";
import panchakarma from "../campaign-v2/campaigns/panchakarma.ts";
import { resolvePlaceholders } from "../campaign-v2/kit/resolve.ts";
import { servableCampaign, campaignMetadata } from "../campaign-v2/servable.ts";
import { collectPending, pending } from "../campaign-v2/kit/pending.ts";
import { t } from "../campaign-v2/sections/text.ts";

// Slots whose sections render a Pending object on purpose (Fees, OfferBand, Faq answer, Doctors via t()).
const STRUCTURAL = /^\$\.(fees|offer|doctors\[\d+\]\.\w+|faq\[\d+\]\.a)$/;

test("placeholders: the template keeps no Pending object outside the structural slots once resolved", () => {
  assert.ok(collectPending(template).length > 20, "the template really is full of pending()");
  const left = collectPending(resolvePlaceholders(template)).map((p) => p.path);
  assert.deepEqual(left.filter((p) => !STRUCTURAL.test(p)), []);
});

test("placeholders: every string slot the sections render raw shows the visible [id] text", () => {
  const r = resolvePlaceholders(template);
  // Village, Stillness, Admission, Faq question, ConsultBar <option>, Hero and the metadata
  assert.equal(r.village.heading, "[village.heading]");
  assert.equal(r.village.body, "[village.body]");
  assert.equal(r.stillness.heading, "[stillness.heading]");
  assert.equal(r.stillness.body, "[stillness.body]");
  assert.equal(r.admission.heading, "[admission.heading]");
  assert.deepEqual(r.admission.steps[0], { title: "[s1.title]", body: "[s1.body]" });
  assert.deepEqual(r.included, ["[i1]", "[i2]", "[i3]", "[i4]"]);
  assert.deepEqual(r.chargedSeparately, ["[c1]"]);
  assert.equal(r.faq[0].q, "[faq.q]");
  assert.equal(r.programDefault, "[programDefault]");
  assert.equal(r.hero.h1, "[hero.h1]");
  assert.equal(r.tracking.campaignName, "[tracking.campaignName]");
  // Structural slots still reach their sections as Pending, which render "[id]" through t().
  assert.equal(t(r.faq[0].a), "[faq]");
  assert.equal(r.fees.__pending, true);
});

test("placeholders: every leaf of a resolved template is a string, number, boolean or null outside structural slots", () => {
  const r = resolvePlaceholders(template);
  const bad = [];
  const walk = (v, path) => {
    if (STRUCTURAL.test(path)) return;
    if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`));
    if (v && typeof v === "object") {
      assert.notEqual(v.__pending, true, path);
      return Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`));
    }
    if (!["string", "number", "boolean", "undefined"].includes(typeof v) && v !== null) bad.push(path);
  };
  walk(r, "$");
  assert.deepEqual(bad, []);
});

test("placeholders: metadata of a pending seo block is plain text, never an object", () => {
  const m = campaignMetadata(resolvePlaceholders(template));
  assert.equal(m.title, "[seo.title]");
  assert.equal(m.description, "[seo.description]");
  assert.deepEqual(m.robots, { index: false, follow: false });
  assert.deepEqual(campaignMetadata(undefined), { robots: { index: false, follow: false } });
});

test("placeholders: servableCampaign guards _template and unknown slugs, and leaves the preview pilot's copy unchanged", () => {
  const previous = process.env.AHV_STAGING;
  try {
    // CI is a production build; this assertion intentionally exercises preview mode.
    process.env.AHV_STAGING = "1";
    assert.equal(servableCampaign("_template"), undefined);
    assert.equal(servableCampaign("nope"), undefined);
    assert.equal(servableCampaign("constructor"), undefined);
    const p = servableCampaign("panchakarma");
    assert.deepEqual(JSON.parse(JSON.stringify(p)), JSON.parse(JSON.stringify(panchakarma)));
    assert.equal(campaignMetadata(p).title, panchakarma.seo.title);
  } finally {
    if (previous === undefined) delete process.env.AHV_STAGING;
    else process.env.AHV_STAGING = previous;
  }
});

test("placeholders: production never serves even the known preview pilot", () => {
  const previous = process.env.AHV_STAGING;
  try {
    process.env.AHV_STAGING = "0";
    assert.equal(servableCampaign("panchakarma"), undefined);
    assert.deepEqual(campaignMetadata(servableCampaign("panchakarma")), { robots: { index: false, follow: false } });
  } finally {
    if (previous === undefined) delete process.env.AHV_STAGING;
    else process.env.AHV_STAGING = previous;
  }
});

test("placeholders: resolving never mutates the source config and keeps form code untouched", () => {
  const before = JSON.stringify(template);
  resolvePlaceholders(template);
  assert.equal(JSON.stringify(template), before);
  const fn = () => [];
  const c = { ...template, form: { schemaId: "three-step", schema: { id: "x", steps: [], options: fn } } };
  const r = resolvePlaceholders(c);
  assert.equal(r.form, c.form);
  assert.equal("form" in resolvePlaceholders(template), false);
  assert.equal(resolvePlaceholders({ ...template, longForm: pending("lf", "x") }).longForm, "[lf]");
});
