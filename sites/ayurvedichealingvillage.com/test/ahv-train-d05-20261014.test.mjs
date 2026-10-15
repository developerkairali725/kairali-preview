// Train D05, 14 Oct 2026 — staff workbook User Review 9 Oct, standing owner implementation authority.
// AHV-WB.213.change: cleansing heading; AHV-WB.308.change: weight 14-night routine from the programme's approved Dinacharya;
// eight *.benefit-copy rows: one plain line per English campaign lead, from that page's own reviewed facts;
// AHV-WB.546.change: RU alt for kt-199 uses the approved procedure terminology, not "massage".
// The exact reversible delta lives in test/fixtures/train-d05-20261014.json and is applied by the existing pins.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { UI } from "../campaign-v2/production/ui.ts";
import fixture from "./fixtures/train-d05-20261014.json" with { type: "json" };
import { candidateSource, reverseDecision23Config } from "./fixtures/train-b-20261015.mjs";

const NOW = new Date(Date.UTC(2026, 9, 14, 12));
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
// Train B (15 Oct 2026): AHV-WB.452 (lp-treatment-kerala) and AHV-WB.473 (lp-treatment-packages) were rejected by
// train-d05/REVIEW.json and are reverted (fixture trainBExclusions); six benefit rows remain.
const BENEFIT = ["lp-south-india", "lp-hospital-kerala", "lp-cleansing-centre", "lp-pain-management", "lp-panchakarma", "lp-weight-management"];
const EXCLUDED = { "AHV-WB.452.benefit-copy": "lp-treatment-kerala", "AHV-WB.473.benefit-copy": "lp-treatment-packages" };

test("AHV-WB.213: the cleansing lead heading names the care; paragraphs and points unchanged", () => {
  const c = productionCampaign("cleansing-centre");
  assert.equal(c.route, "/kairali-cleansing-centre.html");
  assert.equal(c.page.lead.heading, "Ayurvedic cleansing (detox) at an NABH hospital in Kerala");
  assert.equal(c.hero.overline, "Kairali Cleansing Centre · Palakkad, Kerala", "overline and ad match keep the centre name");
  assert.ok(c.adMatch.keywords.includes("kairali cleansing centre"));
});

test("AHV-WB.308: the weight routine uses only the approved programme times and inclusions, with no outcome", () => {
  const c = productionCampaign("weight-management");
  assert.equal(c.route, "/weight-loss.html");
  const step = c.page.pathway.steps[2];
  assert.equal(step.title, "Your 14-night routine");
  for (const t of ["06:30", "09:30", "15:30", "13:00", "14:00", "18:30"]) assert.ok(step.body.includes(t), t);
  // Every time used is one of the approved Dinacharya times of /weight-loss-programme/.
  const view = fs.readFileSync(new URL("../public/ahv/views/ahv-page-weight-loss-programme-desktop.json", import.meta.url), "utf8");
  for (const t of step.body.match(/\b\d{2}:\d{2}\b/g)) assert.ok(view.includes(`time: '${t}'`), `approved time ${t}`);
  assert.ok(view.includes("Two Ayurvedic therapies a day, including herbal steam"), "two therapies a day is this programme's inclusion");
  assert.ok(view.includes("farm, village or nature walk"), "weekly walk is this programme's inclusion");
  assert.ok(step.body.includes("follow your doctor’s plan"), "doctor sets types, times and durations");
  assert.ok(!/\b(kg|kilos?|lose|loss|result|guarantee)/i.test(step.body), "no weight outcome or promise");
  assert.deepEqual(c.admission.steps[2], step, "mirrored admission step");
});

test("benefit-copy rows: one added lead line per English campaign, the two reviewed paragraphs kept first", () => {
  for (const slug of BENEFIT) {
    // Train B: owner decision 23 later reworded the lp-panchakarma lead's first sentence; reversed exactly first.
    const c = reverseDecision23Config(slug, JSON.parse(JSON.stringify(productionCampaign(slug))));
    const [{ before, after }] = fixture.configChanges[slug];
    assert.deepEqual(c.page.lead.paragraphs, after, slug);
    assert.deepEqual(c.page.lead.paragraphs.slice(0, 2), before, `${slug}: reviewed paragraphs unchanged and first`);
    const line = c.page.lead.paragraphs[2];
    assert.ok(!/\b(guests?|cure[sd]?|heal(s|ed)?|relief|results?|recover\w*|detox|cleanse[sd]?|guarantee\w*|luxury|resort|spa|journey)\b/i.test(line), `${slug}: register and claim words`);
  }
});

test("Train B: the two rejected benefit rows are reverted exactly (the reviewed two-paragraph lead)", () => {
  assert.deepEqual(fixture.trainBExclusions.map((x) => x.row).sort(), Object.keys(EXCLUDED).sort());
  for (const x of fixture.trainBExclusions) {
    const slug = EXCLUDED[x.row];
    assert.equal(x.file, `campaign-v2/production/pages/${slug}.ts`);
    const [{ before }] = x.configChanges;
    assert.deepEqual(productionCampaign(slug).page.lead.paragraphs, before, slug);
  }
});

test("AHV-WB.546: RU alt for kt-199 uses the approved procedure term, not massage", () => {
  assert.equal(UI.ru.alt["kt-199"], "Два терапевта проводят абхьянгу — процедуру всего тела с тёплым лечебным маслом");
  assert.ok(!UI.ru.alt["kt-199"].includes("массаж"));
});

test("changed campaigns lint without errors", () => {
  for (const slug of ["cleansing-centre", "weight-management", ...BENEFIT, "lp-treatment-kerala-ru"]) {
    assert.deepEqual(lintCampaign(productionCampaign(slug), NOW).errors.map((i) => `${i.rule} ${i.path}`), [], slug);
  }
});

test("fixture reverses every source file to its base bytes", () => {
  for (const [p, e] of Object.entries(fixture.files)) {
    // Train B: the integrated file holds other candidates' deltas too; candidateSource gives exactly D05's own bytes
    // (c54e2795e plus this fixture's delta), after checking every Train B and Train A delta (fixtures/train-b-20261015.mjs).
    let s = candidateSource("train D05", p, fs.readFileSync(new URL("../" + p, import.meta.url), "utf8"));
    assert.equal(sha(s), e.afterSHA256, p);
    for (const { before, after } of e.replacements) { assert.equal(s.split(after).length - 1, 1, p); s = s.replace(after, before); }
    assert.equal(sha(s), e.beforeSHA256, p);
  }
});
