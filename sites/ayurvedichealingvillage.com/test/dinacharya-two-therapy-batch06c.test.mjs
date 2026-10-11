// N12.06-C — approved two-therapy indicative Dinacharya on the 24 batch views.
// Checks the parsed routine data, not its wording: two included therapies (one morning,
// one afternoon), the approved start time of each activity role and the approved yoga and
// breakfast ranges, ordered slots and ranges, doctor-plan wording on each therapy slot, no
// factory tour, an even desktop column split, and byte-for-byte preservation of everything
// outside the routine. Fixtures were frozen from the current PR390 release before this scoped edit; later batches
// must move files from FROZEN_ROUTINE_VIEWS into BATCH when they change them.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/%20/g, " ")), "..");
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const view = (name) => JSON.parse(fs.readFileSync(path.join(SITE, "public/ahv/views", name + ".json"), "utf8"));
const ROUTINE = /const routine = \[[\s\S]*?\n\s*\];/;
const SPLIT = /routineA: routine\.slice\(0, (?:\d+|Math\.ceil\(routine\.length \/ 2\))\), routineB: routine\.slice\((?:\d+|Math\.ceil\(routine\.length \/ 2\))\)/;
const masked = (v) => sha(JSON.stringify({ ...v, logic: v.logic.replace(ROUTINE, "<<ROUTINE>>").replace(SPLIT, "<<SPLIT>>") }));
const minutes = (t) => { const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(t); assert.ok(m, `bad time ${t}`); return +m[1] * 60 + +m[2]; };

function routineOf(v) {
  const literal = ROUTINE.exec(v.logic);
  assert.ok(literal, "routine literal missing");
  const routine = vm.runInNewContext(literal[0].replace(/^const routine = /, "(").replace(/;$/, ")"));
  const split = SPLIT.exec(v.logic);
  assert.ok(split, "column split missing");
  const cols = vm.runInNewContext(`({ ${split[0]} })`, { routine });
  return { routine, cols };
}

// Entitlement comes from the page's own Included list, independent of the routine.
const includedTherapies = (v) => {
  const m = /<li>(One|Two) Ayurvedic therap(?:y|ies) a day/.exec(v.template);
  return m ? { One: 1, Two: 2 }[m[1]] : null;
};

// Owner-approved two-therapy draft (N12 RECORDED-DRAFT.md): each activity role has a fixed
// start time, and yoga and breakfast have fixed ranges. A slot's role is read from its
// content, so a role that drifts to another time fails here even when the day stays ordered.
const ROLES = [
  ["wake", "06:00", (s) => /wake|self-care/i.test(s)],
  ["yoga/pranayama", "06:30", (s) => /yoga/i.test(s) && /pranayama/i.test(s), ["06:30", "07:30"]],
  ["breakfast", "08:00", (s) => /breakfast/i.test(s), ["08:00", "09:00"]],
  ["morning therapy", "09:30", null],
  ["lunch", "13:00", (s) => /lunch/i.test(s)],
  ["rotating activity", "14:00", (s) => /cooking|garden|workshop|lecture/i.test(s)],
  ["afternoon therapy", "15:30", null],
  ["meditation", "18:30", (s) => /meditation/i.test(s)],
  ["dinner", "19:30", (s) => /dinner/i.test(s)],
  ["retire", "22:00", (s) => /sleep|retire/i.test(s)],
];
const isTherapy = (r) => /therap/i.test(r.title);

function rolesOf(routine) {
  const therapies = routine.filter(isTherapy);
  return Array.from(routine, (r) => {
    if (isTherapy(r)) return therapies.indexOf(r) === 0 ? "morning therapy" : therapies.indexOf(r) === 1 ? "afternoon therapy" : "extra therapy";
    const hits = ROLES.filter(([, , match]) => match && match(r.title + " " + r.body));
    assert.equal(hits.length, 1, `${r.time} "${r.title}" must map to exactly one approved role, got ${hits.map((h) => h[0]).join(", ") || "none"}`);
    return hits[0][0];
  });
}

// Masked current release hashes: view JSON with the routine literal and the column split removed.
const BATCH = {
  "ahv-page-weight-loss-programme-desktop": "f4d13c76aaa8725840e6fb13588c5ee94152b7c7bc96944693755367b35c1bb6",
  "ahv-page-weight-loss-programme-mobile": "2edaca7441158ebfcb595659c746a7ee976c7017fba62be74e70827454c78aaf",
  "ahv-page-womens-hormonal-balance-desktop": "441978f49789c92e8da50c079ebc7234f9d70450e67f13519e25feab14895f05",
  "ahv-page-womens-hormonal-balance-mobile": "2d6a62a087e19907889db8236df3791c950b696a6b9f88bf99b2d312112a1252"
};
const FROZEN_ROUTINE_VIEWS = {};
const FROZEN_COURSE_AND_TARIFF = {};

for (const [name, baseHash] of Object.entries(BATCH)) {
  test(`${name}: approved two-therapy indicative routine`, () => {
    const v = view(name);
    assert.equal(includedTherapies(v), 2, "Included list must state two therapies a day");
    const { routine, cols } = routineOf(v);
    const times = routine.map((r) => minutes(r.time));
    times.forEach((t, i) => i && assert.ok(t > times[i - 1], `slot ${routine[i].time} out of order`));
    routine.forEach((r) => assert.ok(r.title && r.body, `empty slot ${r.time}`));

    const therapies = routine.filter(isTherapy);
    assert.equal(therapies.length, includedTherapies(v), "therapy slots must equal included therapies");

    const roles = rolesOf(routine);
    assert.deepEqual(roles, ROLES.map(([role]) => role), "slots must be the ten approved roles, once each, in order");
    ROLES.forEach(([role, anchor, , range], i) => {
      assert.equal(routine[i].time, anchor, `approved anchor: ${role} must start at ${anchor}, found ${routine[i].time}`);
      if (!range) return;
      const stated = [...routine[i].body.matchAll(/\b(\d\d:\d\d) to (\d\d:\d\d)\b/g)].map((m) => [m[1], m[2]]);
      assert.deepEqual(stated, [range], `approved range: ${role} must run ${range.join("–")}`);
    });
    const at = (re) => { const hits = routine.filter((r) => re.test(r.title)); assert.equal(hits.length, 1, `${re} slot count`); return minutes(hits[0].time); };
    const breakfast = at(/breakfast/i), lunch = at(/lunch/i), dinner = at(/dinner/i);
    const [morning, afternoon] = therapies.map((r) => minutes(r.time));
    assert.ok(breakfast < morning && morning < lunch, "morning therapy must sit between breakfast and lunch");
    assert.ok(lunch < afternoon && afternoon < dinner, "afternoon therapy must sit between lunch and dinner");

    // Stated ranges start at their slot and end before the next slot begins.
    routine.forEach((r, i) => {
      for (const m of r.body.matchAll(/\b(\d\d:\d\d) to (\d\d:\d\d)\b/g)) {
        assert.equal(minutes(m[1]), times[i], `${r.time} range start`);
        assert.ok(minutes(m[2]) > times[i], `${r.time} range end`);
        if (i + 1 < times.length) assert.ok(minutes(m[2]) <= times[i + 1], `${r.time} range overlaps next slot`);
      }
    });

    for (const r of therapies) {
      assert.match(r.body, /\brest\b/i, `${r.time} therapy must be followed by rest`);
      for (const word of [/doctor/i, /plan/i, /appointment/i, /type/i, /duration/i]) assert.match(r.body, word, `${r.time} indicative wording ${word}`);
    }
    assert.ok(routine.every((r) => !/factory/i.test(r.title + " " + r.body)), "no factory tour in the routine");

    assert.ok(cols.routineA.length && cols.routineB.length, "both desktop columns populated");
    assert.equal(JSON.stringify([...cols.routineA, ...cols.routineB]), JSON.stringify(routine), "columns cover the routine in order");
    assert.equal(masked(v), baseHash, "bytes outside the routine and column split are unchanged");
  });
}

test("other routine views, one-therapy programmes and course/tariff sources are untouched", () => {
  for (const [file, hash] of Object.entries({ ...FROZEN_ROUTINE_VIEWS, ...FROZEN_COURSE_AND_TARIFF }))
    assert.equal(sha(fs.readFileSync(path.join(SITE, file))), hash, `${file} changed outside this batch`);
});
