// N12.08 — training is preserved, not rescheduled. The approved Dinacharya draft adds a
// training timetable only where two PERSONAL treatments are explicitly included; no course
// includes them, so each course keeps its documented allocation. This test parses the course
// copy (english-candidate/course-pages.json), the hub and course datasets, the training tariff
// and the finder, and checks them against the recorded course constraints and each other:
// theory/practical hours, days and published totals, the therapy experience each course states,
// personal treatments charged separately, Coming Soon status, the canonical hub and the old
// alias. It also guards against any routine or generic two-personal-therapy timetable reaching
// the training pages. Fixtures were frozen at 5a9be584 (23 inputs equal the a831 baseline).
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/%20/g, " ")), "..");
const read = (file) => fs.readFileSync(path.join(SITE, file), "utf8");
const json = (file) => JSON.parse(read(file));
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(path.join(SITE, file))).digest("hex");
const dataset = (file) => { const window = {}; vm.runInNewContext(read(file), { window }); return JSON.parse(JSON.stringify(window)); };
const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, nine: 9, ten: 10, fifteen: 15, twenty: 20, forty: 40, eighty: 80 };
const num = (w) => { const n = /^\d+$/.test(w) ? +w : WORDS[w.toLowerCase()]; assert.ok(Number.isFinite(n), `unparsed number "${w}"`); return n; };

// Recorded course constraints (N12 RECORDED-DRAFT.md / COURSE-CONSTRAINTS.json).
const RECORDED = {
  "OAP-HV": { theory: 2, practical: 1, days: 1, total: 3, therapy: "45-minute Abhyangam session" },
  "TAP-HV": { theory: 1, practical: 1, days: 3, total: 9, therapy: "one personal therapy session each day" },
  "WAP-HV": { theory: 1, practical: 1, days: 5, total: 15, therapy: "the day's therapy, each day" },
  "AATP1-HV": { theory: 2, practical: 2, days: 10, total: 40, therapy: null },
  "AALCT-HV": { theory: 2, practical: 2, days: 20, total: 80, therapy: null },
};
const COURSE_DATA = { "OAP-HV": "oap", "TAP-HV": "tap", "WAP-HV": "wap", "AATP1-HV": "aatp1", "AALCT-HV": "aalct" };
const COMING_SOON = ["/yoga-meditation-program/", "/new-to-yoga-teacher-training/"];
const HUB = "/ayurveda-training-programme/", ALIAS = "/ayurveda-training-programs/";
const FROZEN_23 = {
 "english-candidate/course-pages.json": "80f9470ae87c47698d5d660788eec969c3a472708d0ac8700c8448d061852f98",
 "english-candidate/final-rates/strings.en.json": "df4ded50ccdb7dbc04cff609bdd17a248d658e8d3cac480bb520338fef8e5a47",
 "english-candidate/final-ayurveda-rates.json": "0a4e8782a7852328ad6eaacc887d53fd47fa8be7dd2d411c3727f15447fcad46",
 "public/ahv/assets/ayurveda-training-data.js": "fe4d0c7dbcedf13898a30e5830056b17d27ceab2f1719a6cf4aa0f46531f38c0",
 "public/ahv/assets/course-aalct-hv-data.js": "0bd79c9409c3475e9153498018b306ade8d861c73d2f8d51827d3112edc0fa41",
 "public/ahv/assets/course-aatp1-hv-data.js": "981dc5ee748527a634b608a900d720021613fb39dd873477cddfc62f34037672",
 "public/ahv/assets/course-oap-hv-data.js": "4c20bc11ea58608203c36c43081bafadc7c49169ea117e831b4c53fdf1260b78",
 "public/ahv/assets/course-tap-hv-data.js": "827d14a26e2909474f493e94b43271a80b9eeb68b2b18dce793ac9cb8c84b4ac",
 "public/ahv/assets/course-wap-hv-data.js": "0e2eae94545d1e28b0f06a98f63e5ba7e22215b9e5532c6d77a9e31546524f83",
 "public/ahv/views/ahv-page-course-one-day-workshop-desktop.json": "8dd3af18fd2014d3b1b8e9a2e29c28624cb1dd8f6845ab01eece523c5ce8724e",
 "public/ahv/views/ahv-page-course-one-day-workshop-mobile.json": "78c80fcefb8c122a97c8ed61088d8cbd40e3495592eb7c07d84e4fd6774f14b4",
 "public/ahv/views/ahv-page-course-three-day-certificate-desktop.json": "f5df730d2514095f81d1450e3848eeb0f378632e44c327565fd9816824b1fbfe",
 "public/ahv/views/ahv-page-course-three-day-certificate-mobile.json": "598e117a09215377efe91744ed66e44b23edf41b96c0039e1b713b5f0c6d00f7",
 "public/ahv/views/ahv-page-course-five-day-intensive-desktop.json": "1023e4a825beb26c188dc1e18d37d2108afbc9d6b9a9e80c88ac10f78e8b26c6",
 "public/ahv/views/ahv-page-course-five-day-intensive-mobile.json": "b588e68b202dbb5846e725607ee9d20e720c3420900a1b57894e2f0789c647b2",
 "public/ahv/views/ahv-page-course-level-one-advanced-desktop.json": "4cffd9d229621d60915484c53b19f352d60984a590bb08374ceeee0e67dfcc11",
 "public/ahv/views/ahv-page-course-level-one-advanced-mobile.json": "a212c19f99af4daa18a6644893b43e6c91d693e0b1e07e7b12c34ff12a72377d",
 "public/ahv/views/ahv-page-course-consultant-therapist-desktop.json": "9dbefe06cb3b0c6f4e68cd72a8b5b5a90e7cc4a390fdb1fe982ee7d696183e92",
 "public/ahv/views/ahv-page-course-consultant-therapist-mobile.json": "7df0b7e8e193250cd9a386934899700e77774db76b2424800475a0963c0c267a",
 "public/ahv/views/ahv-page-ayurveda-training-programme-desktop.json": "1d26cbbb4ce3461e89e75e26bb8ea819ef6255da993a4b3a85e01e2072f1da2f",
 "public/ahv/views/ahv-page-ayurveda-training-programme-mobile.json": "e88754315e0c9887db5b7874aa99aad48c7908fdade2821d07a7d6c12db09738",
 "public/ahv/views/ahv-page-ayurveda-training-programs-desktop.json": "305c2219f60a784cb1d434713207fbd1db8f5e5cd6519a1b8d0080739f0eeb37",
 "public/ahv/views/ahv-page-ayurveda-training-programs-mobile.json": "29c41453798fbd31c437d0c35a1e92decf2ab88be03bd70f9fd22f7dafd2ae68"
};
const BOUND = {
 "english-candidate/final-rates/training.json": "1175165aa2a78ed11e1fefc9c06008e0dd3c7cb8c92eaa311ea17b0889475f50",
 "public/ahv/assets/all-programs-data.js": "0e2536118657369c52cb7c6c66e93458cd36d881b6ca20e778fc9c79b4d68968",
 "english-candidate/redirect-map.json": "4937f34efcee1f41ee7c357bc41b8221c20a860496a9b170449b6a103eabcde7",
 "english-candidate/route-overrides.json": "77aa7305a86afe56dbe69a66df91325392c61d0cc4a4e94288b896059c71501b",
 "english-candidate/route-manifest.json": "695301bf3362a6a67f1f01801a5ee151e1fa4697a1e0db5fc4975aa461276b16",
 "l10n/routes.json": "5ce6951b602ba1f30a56884616cb2d69bb07a7d9a5536756db27c2af822e70e2"
};

const pages = json("english-candidate/course-pages.json").courses;
const hub = dataset("public/ahv/assets/ayurveda-training-data.js").AHV_AYURVEDA_TRAINING;
const tariff = json("english-candidate/final-rates/training.json");
const strings = json("english-candidate/final-rates/strings.en.json").training;
const finder = dataset("public/ahv/assets/all-programs-data.js").AHV_FINDER;

function profile(c) {
  const format = c.features.find((f) => f.startsWith("Format:"));
  assert.ok(format, `${c.code}: no Format feature`);
  const alloc = /(\w+) hours? of theory and (\w+) hours? of practical/.exec(format);
  assert.ok(alloc, `${c.code}: format does not state theory and practical hours`);
  const span = /^Format: (\w+) hours (?:of instruction )?over (\w+) (?:instructional )?days/.exec(format);
  const oneDay = /^A (\w+)-hour introduction/.exec(c.intro);
  return {
    theory: num(alloc[1]), practical: num(alloc[2]),
    total: span ? num(span[1]) : oneDay ? num(oneDay[1]) : null,
    days: span ? num(span[2]) : /in one day/.test(format) ? 1 : null,
    text: [c.intro, c.processLead, ...c.features, ...c.steps].join(" "),
  };
}

for (const [code, want] of Object.entries(RECORDED)) {
  test(`${code}: documented allocation, duration and therapy experience preserved`, () => {
    const c = pages.find((x) => x.code === code);
    assert.ok(c, `${code} missing from course-pages.json`);
    const p = profile(c);
    assert.equal(p.theory, want.theory, `${code} documented theory hours per day`);
    assert.equal(p.practical, want.practical, `${code} documented practical hours per day`);
    assert.equal(p.days, want.days, `${code} documented days`);
    assert.equal(p.total, want.total, `${code} documented total hours`);

    // The same figures in every other governed source for the course.
    const row = hub.courses.find((x) => x.code === code);
    assert.deepEqual([row.days, row.hours], [want.days, want.total], `${code} hub dataset days/hours`);
    const own = dataset(`public/ahv/assets/course-${COURSE_DATA[code]}-hv-data.js`).AHV_AYURVEDA_TRAINING;
    const ownRow = own.courses.find((x) => x.code === code);
    assert.deepEqual([ownRow.days, ownRow.hours], [want.days, want.total], `${code} course dataset days/hours`);
    assert.ok(JSON.stringify(own).includes(JSON.stringify(c.features.find((f) => f.startsWith("Format:")))), `${code} course dataset carries the documented format`);
    assert.equal(tariff.courses.find((x) => x.code === code).days, want.days, `${code} training tariff days`);
    const card = finder.programmes.find((x) => x.route === c.route);
    assert.equal(card.minimumNights, want.days, `${code} finder minimum nights`);
    assert.equal(card.durationDisplay, want.days === 1 ? "1 day" : `${want.days} days`, `${code} finder duration`);
    assert.deepEqual([card.availability, card.bookable], ["current", true], `${code} remains a current, bookable course`);

    // Therapy experience exactly as documented; practical training is not a guest therapy.
    if (code === "OAP-HV") { assert.match(c.intro, /45-minute Abhyangam session/); assert.match(c.intro, /two hours of guided theory/); }
    if (code === "TAP-HV") { assert.match(c.intro, /a personal therapy session/); assert.match(p.text, /plus a therapy session each day/); }
    if (code === "WAP-HV") { assert.match(p.text, /every day ends with the therapy just studied, given to the participant/); assert.match(p.text, /the day's therapy received in full/); }
    if (want.therapy === null) assert.doesNotMatch(p.text, /personal therapy|therapy session each day|given to the participant|received in full/i, `${code} must not gain a personal therapy inclusion`);
    assert.doesNotMatch(p.text, /two personal|2 personal|personal treatments? (?:are|is) included|second therapy|afternoon therapy/i, `${code} no two-personal-therapy claim`);
  });
}

test("personal treatments stay separate and charged; training tariff includes no guest therapy", () => {
  assert.ok(strings.not_included.includes("Treatments for the student's own health, prescribed and billed separately"), "tariff: own-health treatments billed separately");
  assert.match(strings.example_note, /Personal treatments and optional services are invoiced separately\./, "tariff example note");
  assert.ok(strings.included.every((s) => !/therap(?:y|ies) a day|daily therap/i.test(s)), "training tariff must not include daily guest therapies");
  assert.ok(strings.included.includes("Hands-on practical training led by senior Ayurvedic trainers and physicians"), "practical training is instruction");
  // Served course and hub views state the policy; the old twin pair (301 to the hub) never did,
  // and must not start claiming personal treatments are included.
  for (const file of Object.keys(FROZEN_23).filter((f) => f.includes("/views/"))) {
    if (/ayurveda-training-programs-/.test(file)) assert.doesNotMatch(read(file), /personal treatments? (?:are|is) included/i, `${file} twin must not include personal treatments`);
    else assert.match(read(file), /Personal treatments and optional services are charged separately\./, `${file} keeps the separate-charge policy`);
  }
});

test("training pages carry no routine and no generic two-personal-therapy timetable", () => {
  for (const file of Object.keys(FROZEN_23).filter((f) => f.includes("/views/") || f.endsWith("-data.js") || f.endsWith("course-pages.json"))) {
    const t = read(file);
    assert.doesNotMatch(t, /const routine|Wake up to wellness|Routine \(Dinacharya\)/, `${file} must not gain a daily routine`);
    assert.doesNotMatch(t, /Morning Ayurvedic Therapy|Afternoon Ayurvedic Therapy|therapy session [12]\b/i, `${file} must not gain a two-therapy timetable`);
    const times = new Set(t.match(/\b(?:[01]\d|2[0-3]):[0-5]\d\b/g) ?? []);
    for (const time of times) assert.ok(["10:00", "12:00"].includes(time), `${file} unexpected clock time ${time} (only check-out 10:00 / check-in 12:00 exist)`);
  }
});

test("Coming Soon training stays Coming Soon and not bookable", () => {
  for (const route of COMING_SOON) {
    const card = finder.programmes.find((x) => x.route === route);
    assert.ok(card, `${route} missing from finder`);
    assert.deepEqual([card.availability, card.bookable, card.from, card.durationDisplay], ["coming_soon", false, null, "Coming Soon"], `${route} Coming Soon status`);
    assert.match(card.name, /— Coming Soon$/, `${route} Coming Soon name`);
    const m = json("english-candidate/route-manifest.json").routes.find((r) => r.path === route);
    assert.match(m.metadata.title, /Coming Soon/, `${route} Coming Soon title`);
  }
  assert.equal(finder.counts.comingSoon, COMING_SOON.length, "finder Coming Soon count");
  assert.equal(finder.counts.courses, Object.keys(RECORDED).length, "finder course count");
});

test("canonical training hub and old alias keep their disposition", () => {
  const redirect = json("english-candidate/redirect-map.json").redirects[ALIAS];
  assert.equal(redirect.to, HUB, "old alias 301s to the canonical hub");
  const locales = Object.entries(json("l10n/routes.json").redirects).filter(([from]) => from.endsWith(ALIAS));
  assert.equal(locales.length, 12, "every locale alias redirects");
  const hubByLocale = new Set(Object.entries(json("l10n/routes.json").routes[HUB]).filter(([loc]) => loc !== "en").map(([, r]) => r));
  assert.deepEqual(new Set(locales.map(([, rule]) => rule.to)), hubByLocale, "locale aliases target each locale's own hub route");
  for (const [from, rule] of locales) assert.equal(from.split("/")[1], rule.to.split("/")[1], `${from} stays in its locale`);
  assert.equal(findOverride(ALIAS).sitemapExclude, true, "alias excluded from sitemap");
  const manifest = json("english-candidate/route-manifest.json").routes;
  for (const route of [HUB, ALIAS]) assert.equal(manifest.find((r) => r.path === route).metadata.canonical, `https://ayurvedichealingvillage.com${HUB}`, `${route} canonical is the hub`);
  for (const v of ["programme", "programs"]) for (const m of ["desktop", "mobile"])
    assert.match(read(`public/ahv/views/ahv-page-ayurveda-training-${v}-${m}.json`), /rel=\\"canonical\\" href=\\"https:\/\/ayurvedichealingvillage\.com\/ayurveda-training-programme\/\\"/, `${v} ${m} view canonical`);
});
function findOverride(route) {
  const o = json("english-candidate/route-overrides.json");
  const stack = [o];
  while (stack.length) { const x = stack.pop(); if (x && typeof x === "object") { if (x[route]) return x[route]; stack.push(...Object.values(x)); } }
  return {};
}

test("frozen training, course and tariff sources are byte-identical", () => {
  for (const [file, hash] of Object.entries(FROZEN_23)) assert.equal(sha(file), hash, `${file} training/course/tariff source changed`);
  for (const [file, hash] of Object.entries(BOUND)) assert.equal(sha(file), hash, `${file} bound training source changed`);
});
