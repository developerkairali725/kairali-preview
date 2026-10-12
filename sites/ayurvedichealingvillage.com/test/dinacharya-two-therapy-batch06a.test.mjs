// N12.06-A — approved two-therapy indicative Dinacharya on the 24 batch views.
// Checks the parsed routine data, not its wording: two included therapies (one morning,
// one afternoon), the approved start time of each activity role and the approved yoga and
// breakfast ranges, ordered slots and ranges, doctor-plan wording on each therapy slot, no
// factory tour, an even desktop column split, and byte-for-byte preservation of everything
// outside the routine. Fixtures were frozen from current Weight release 807c535e3 before this scoped edit; later batches
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
  "ahv-page-breath-respiratory-desktop": "aa7616aa2275e912d0a97e313d3bc0cad8363f6c53f54723d037a519b79c4d6a",
  "ahv-page-breath-respiratory-mobile": "698704b83686433950ac1e759445100c5f4ddaa1bcb1ea00af0d57cb2e879685",
  "ahv-page-chronic-back-pain-desktop": "929a6cc734d04ea074b31317e0714a1ae9c64b08b98ff82bfd2393f6bd3cc935",
  "ahv-page-chronic-back-pain-mobile": "878c5690d76e9d322a989e823e3a6764d05d7ee5c22ff9f8c29a754d2248b986",
  "ahv-page-de-addiction-rehabilitation-desktop": "8bd90cf96f502bc859f14f2a7a5aaaccd60e96a474ef17f1d4f8198e3629b8fa",
  "ahv-page-de-addiction-rehabilitation-mobile": "357e8ae928f464ac4100780bb687bd068338a3dc152b629b6750b614292725b1",
  "ahv-page-diabetes-metabolic-balance-desktop": "7a84c4bac2362517539e8b3499177e5766b80a98dae2abcde3731c865af2ff8c",
  "ahv-page-diabetes-metabolic-balance-mobile": "78b2c377ad74a52df896fdacd7ecb2d0240a8ba4e12625cd5db6d7caef6c3366",
  "ahv-page-facial-paralysis-desktop": "025906f0b2ffd542f5f3844be8fdfd6f21aea2c10070f9063465211bc4ce0bf9",
  "ahv-page-facial-paralysis-mobile": "c909f0c2fdec849b6ff9edf9b062ca2e820d67070b920a55c288ebd60d018e80",
  "ahv-page-holistic-rejuvenation-detoxification-desktop": "34386573b2bf1d0830a220d53ecd997ba80657a2d507af4a4028cdfba4eb3e7b",
  "ahv-page-holistic-rejuvenation-detoxification-mobile": "dd4e0f6aab47b23cc1e9eece0508731d345947151460e435f0e2abe61d39c842",
  "ahv-page-hypertension-desktop": "034922f17d6bb4dc31c3566ce2146e28fd5f86aa56a606e70b15f4b1fd67c62e",
  "ahv-page-hypertension-mobile": "d6b9e8f6805760ab4f668b6606ecdc884a5f4d99f48770e5572dee156df2ca5e",
  "ahv-page-immunity-executive-health-desktop": "0bf2da300380c6594dd772b362da373d4a3232bbd5f29356d6a90ce23735a7cf",
  "ahv-page-immunity-executive-health-mobile": "12602221a3eebd5a2e66fba6e5549829822564496734ea9509d76b8b476b5d98",
  "ahv-page-joint-rehabilitation-arthritis-desktop": "8ec24d15fd910b2a460ad050b589646ece84effe443a8bd892c1bc290621bf77",
  "ahv-page-joint-rehabilitation-arthritis-mobile": "4371598373a2b6d7613c54fc52c715d65c2bbda1412fc61e0010c759132d74bf",
  "ahv-page-neck-upper-back-desktop": "b292f395be59d91be4b6d066071f48c7f47adff55ddf06094c39697e4b1069ff",
  "ahv-page-neck-upper-back-mobile": "102301c2cdb1e47603343d0bb42066d0d62b64e500888280c63d8735d024afc2",
  "ahv-page-nervous-disability-desktop": "09c136dda9b07b2d6a5c1db802c2d599cc8eb0d4825c7af1d3c7315d55fb5ba2",
  "ahv-page-nervous-disability-mobile": "2149f151b595d5968167ee23e2a392d10efc3fb9e86ea1e211d958fc4959c508",
  "ahv-page-panchakarma-therapy-desktop": "ac5c70dec9d26e3e94992516e72bf938a37c955af20a836ef939d3f1436c5dc4",
  "ahv-page-panchakarma-therapy-mobile": "40b841b792f9d702d66217b306e32105496d9f17c1898df6e5d1f85582df4950"
};
const FROZEN_ROUTINE_VIEWS = {};
const FROZEN_COURSE_AND_TARIFF = {
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
