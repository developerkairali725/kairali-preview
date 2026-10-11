// N12.06-B — approved two-therapy indicative Dinacharya on the 24 batch views.
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
  "ahv-page-paralysis-recovery-desktop": "c3b2e1d40a949601df34bf256daece96d9fdd7fce179f982daec31823e91a1b4",
  "ahv-page-paralysis-recovery-mobile": "2c66d304a94a044ab20144e9ae234bc5d9de3e8d192c4e900acb461ddce03ec4",
  "ahv-page-personalized-customized-healing-desktop": "6a847a31400456d874038ce98d04f0b19451ba1e9bfd0797156611a616b7b266",
  "ahv-page-personalized-customized-healing-mobile": "0802b65df4bb57eb8e52b09fd389719bb3266326921f466ca957ae04a8fa340c",
  "ahv-page-post-pregnancy-health-programme-desktop": "8e93e5996e8ad14a0f4e7e5d5c252af6fa1f9c352b8b5160a117c847e5c88c54",
  "ahv-page-post-pregnancy-health-programme-mobile": "2c1aaf2f1c3e171f832855014d1cae7928b926f686b9a2bdc1381871d65f5aa5",
  "ahv-page-psoriasis-desktop": "23aca75c8692d6d54e139cc9658aef8d8f2e8be8978efa142713d052e8b7efaa",
  "ahv-page-psoriasis-mobile": "a6c933b9587af7a09e5f161f6d955801d33c6bfe412b1097e2762fdec1332536",
  "ahv-page-sinus-migraine-desktop": "7cce7b9c12226790751c644bac2e668162863a7a8b9d2664779de2e1ddb10483",
  "ahv-page-sinus-migraine-mobile": "b7d2094ad377fb98f1d40045ebeddf251d06b971d53ceeaadc9e09a5a900cee7",
  "ahv-page-skin-vitality-desktop": "d77c157a811a08ea50a5ac079eaf98c5df424a7dcd7ceeee7cfba0ae0f038dae",
  "ahv-page-skin-vitality-mobile": "6e4f04f0a8e6e24222cb472864940f6bcfc15a88e20e7e2430af138a9389717b",
  "ahv-page-sleep-restoration-desktop": "533d1a75003fc35ab4f133bd45e90a66a04c9c7291f5918423becd788bc2fa51",
  "ahv-page-sleep-restoration-mobile": "66ef0c299507c31dc8d9be27ecd95ef0cad211b369c3fca48ed25fe0e33174ab",
  "ahv-page-spinal-disc-nerve-restoration-desktop": "b7339a5a3ee4eeecae64d71a4da85e384d2fcb363194b6d13ce7c2ff1799cffb",
  "ahv-page-spinal-disc-nerve-restoration-mobile": "c8cd329bd2c695f191f13f71774284413bc633b36ff4416862cc39bafc98ea16",
  "ahv-page-spondylitis-desktop": "e0bf4e52a82377706de991ab8541556284d0b752b2f3525659612b63c09ad114",
  "ahv-page-spondylitis-mobile": "65f3952874bc5f619cd963c5a1cafcb1d2f932bc3a166f8a2ebfcf4627264425",
  "ahv-page-stress-strain-desktop": "e4f32ccaf4bee9efb4c6cb3f2c9d664d620be2d548d874adce6ba5836cdedb6c",
  "ahv-page-stress-strain-mobile": "7bbccfdc83cba1a41c1c5938fd89a8090527f0454b47fa5919e8698925ad5645",
  "ahv-page-supportive-care-cancer-desktop": "0a8fa775bd00c0282003d95b795f4c72e0c8b7255f60918ab3b469c58b4a1ef0",
  "ahv-page-supportive-care-cancer-mobile": "44d6b7e815478bea7e012dba608f6f3acff221202ec9c545de7348abae1cd3bc",
  "ahv-page-vision-eye-rejuvenation-desktop": "a68edd9e8aa8cf8fcbaded2b29bbbaf71765effcbd38f8feebd277770839f743",
  "ahv-page-vision-eye-rejuvenation-mobile": "810fc82a08e513ae31ee31ca5599994ea56d90d0da20f3449cb9107766965c35"
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
