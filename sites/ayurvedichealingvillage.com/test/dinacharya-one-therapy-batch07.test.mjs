// N12.07 — approved indicative Dinacharya for the 8 one-therapy views (Preventive Health &
// Regenerative, Digestive Wellness, Yoga & Meditation, Yoga based Stress & Energy Reset).
// Checks the parsed routine: approved role anchors and ranges, exactly one included therapy
// at 09:30 with rest and the doctor-plan note, 15:30 personal time with no second therapy or
// upsell, 17:00 gentle practice only on the two Yoga programmes, no factory tour, the six
// corrected one-therapy icon labels, and byte-for-byte preservation outside the routine,
// split and icon label. The one-a-day entitlement is read from each page's Included list or
// the frozen tariff, never from the old icon. Preservation fixtures bind the current integrated release before this scoped change; accepted routine semantics are unchanged.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/%20/g, " ")), "..");
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const read = (file) => fs.readFileSync(path.join(SITE, file), "utf8");
const view = (name) => JSON.parse(read(`public/ahv/views/${name}.json`));
const ROUTINE = /const routine = \[[\s\S]*?\n\s*\];/;
const SPLIT = /routineA: routine\.slice\(0, (?:\d+|Math\.ceil\(routine\.length \/ 2\))\), routineB: routine\.slice\((?:\d+|Math\.ceil\(routine\.length \/ 2\))\)/;
const ICON = /Daily (?:2 Therapies|1 Therapy) Per Person/;
const masked = (v) => sha(JSON.stringify({ ...v, logic: v.logic.replace(ROUTINE, "<<ROUTINE>>").replace(SPLIT, "<<SPLIT>>"), template: v.template.replace(ICON, "<<ICON>>") }));
const minutes = (t) => { const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(t); assert.ok(m, `bad time ${t}`); return +m[1] * 60 + +m[2]; };

function routineOf(v) {
  const literal = ROUTINE.exec(v.logic);
  assert.ok(literal, "routine literal missing");
  const routine = vm.runInNewContext(literal[0].replace(/^const routine = /, "(").replace(/;$/, ")"));
  const split = SPLIT.exec(v.logic);
  assert.ok(split, "column split missing");
  const cols = vm.runInNewContext(`({ ${split[0]} })`, { routine });
  return { routine: Array.from(routine), cols };
}

// One-a-day entitlement from the page's Included list, the Preventive exception it states,
// or the frozen yoga tariff (programme URL + its "One Ayurvedic therapy a day" inclusion).
const yogaTariff = JSON.parse(read("english-candidate/final-rates/yoga.json"));
const strings = JSON.parse(read("english-candidate/final-rates/strings.en.json"));
const yogaUrls = new Set(yogaTariff.groups.flatMap((g) => g.programmes.map((p) => new URL(p.url).pathname)));
function includedTherapies(v, route) {
  const basis = [];
  const m = /<li>(One|Two) Ayurvedic therap(?:y|ies) a day([^<]*)<\/li>/.exec(v.template);
  if (m && m[1] === "One") basis.push(1);
  if (m && m[1] === "Two" && /one a day in the Preventive Health &amp; Regenerative programme/.test(m[2])) basis.push(route === "/preventive-and-regenerative-treatment/" ? 1 : 2);
  if (m && m[1] === "Two" && !/one a day in the Preventive/.test(m[2])) basis.push(2);
  if (yogaUrls.has(route)) basis.push(strings.yoga.included.some((s) => /^One Ayurvedic therapy a day/.test(s)) ? 1 : null);
  assert.ok(basis.length, `${route}: no entitlement basis`);
  assert.ok(basis.every((n) => n === basis[0]), `${route}: conflicting entitlement basis ${basis}`);
  return basis[0];
}

const isTherapy = (r) => /therap/i.test(r.title);
const BASE_ROLES = [
  ["wake", "06:00", (s) => /wake|self-care/i.test(s)],
  ["yoga/pranayama", "06:30", (s) => /yoga/i.test(s) && /pranayama/i.test(s) && !/gentle/i.test(s), ["06:30", "07:30"]],
  ["breakfast", "08:00", (s) => /breakfast/i.test(s), ["08:00", "09:00"]],
  ["morning therapy", "09:30", null],
  ["lunch", "13:00", (s) => /lunch/i.test(s)],
  ["rotating activity", "14:00", (s) => /cooking|garden|workshop|lecture/i.test(s)],
  ["personal time", "15:30", (s) => /personal time/i.test(s)],
  ["meditation", "18:30", (s) => /meditation/i.test(s)],
  ["dinner", "19:30", (s) => /dinner/i.test(s)],
  ["retire", "22:00", (s) => /sleep|retire/i.test(s)],
];
const GENTLE = ["gentle yoga", "17:00", (s) => /gentle/i.test(s) && /yoga/i.test(s)];
const rolesFor = (gentle) => gentle ? [...BASE_ROLES.slice(0, 7), GENTLE, ...BASE_ROLES.slice(7)] : BASE_ROLES;

const PROGRAMMES = {
 "ahv-page-digestive-wellness-gut-health-desktop": {
  "route": "/digestive-wellness-gut-health-yoga-therapy/",
  "gentleYoga": false,
  "iconCorrected": true
 },
 "ahv-page-digestive-wellness-gut-health-mobile": {
  "route": "/digestive-wellness-gut-health-yoga-therapy/",
  "gentleYoga": false,
  "iconCorrected": true
 },
 "ahv-page-preventive-regenerative-desktop": {
  "route": "/preventive-and-regenerative-treatment/",
  "gentleYoga": false,
  "iconCorrected": false
 },
 "ahv-page-preventive-regenerative-mobile": {
  "route": "/preventive-and-regenerative-treatment/",
  "gentleYoga": false,
  "iconCorrected": false
 },
 "ahv-page-yoga-and-meditation-package-desktop": {
  "route": "/yoga-and-meditation-package/",
  "gentleYoga": true,
  "iconCorrected": true
 },
 "ahv-page-yoga-and-meditation-package-mobile": {
  "route": "/yoga-and-meditation-package/",
  "gentleYoga": true,
  "iconCorrected": true
 },
 "ahv-page-yoga-stress-reset-desktop": {
  "route": "/yoga-based-stress-energy-reset-program/",
  "gentleYoga": true,
  "iconCorrected": true
 },
 "ahv-page-yoga-stress-reset-mobile": {
  "route": "/yoga-based-stress-energy-reset-program/",
  "gentleYoga": true,
  "iconCorrected": true
 }
};
// Masked b345de43 hashes: view JSON with the routine literal, column split and icon label removed.
const BATCH = {
  "ahv-page-digestive-wellness-gut-health-desktop": "66758f72d533ba154f4446ba9ab95b712b1d572fb713ed6b126255a70db2f0a0",
  "ahv-page-digestive-wellness-gut-health-mobile": "f58253f9ae84a0324c6be155993407dcc1b4068298aec078a8cc0eb6c56ff718",
  "ahv-page-preventive-regenerative-desktop": "01d7716b4ebb8d6d1ae82150a2d6fc090f3df56365142946d6b9be9e8040bad7",
  "ahv-page-preventive-regenerative-mobile": "08457cef0fc8746441005a18ee96552130a4f3eb64ed921eeef7f52e8667611a",
  "ahv-page-yoga-and-meditation-package-desktop": "4c7db1ae5c6aa124c5a86764acb2e484c23a9144c7bf10a419bc8fcb3fff895d",
  "ahv-page-yoga-and-meditation-package-mobile": "73a23322893979c6def0ad2e356a48aadbc4997ffb51c96e8cf1501f4df9f8f2",
  "ahv-page-yoga-stress-reset-desktop": "7509122a2720fcb437e571b0776b7b33d9f70120929c49ec3dd7df1fe3f6e840",
  "ahv-page-yoga-stress-reset-mobile": "bafaeecbea0f9fc2806d58e4c2695e9066dd6d9b88770b20c891bef5507a43cf"
};
const ACCEPTED_06A = {
  "public/ahv/views/ahv-page-breath-respiratory-desktop.json": "c63e4232b17ad20648420d47f71b0faad02d7865f838d1e82563ff678bc494c6",
  "public/ahv/views/ahv-page-breath-respiratory-mobile.json": "a9e09d8085ca9c9791ea7b3f85b7162ad5a8898cd4cc014ad2bf7e0fe4a8cff8",
  "public/ahv/views/ahv-page-chronic-back-pain-desktop.json": "e197efade9db590c2b0b31f4f36c007861c33cc90ca65bb37e68e8d45d83d286",
  "public/ahv/views/ahv-page-chronic-back-pain-mobile.json": "92168426ca4c0936dc10ddf04e51c41a0e9849b06c620ac6fa9cb838478bc646",
  "public/ahv/views/ahv-page-de-addiction-rehabilitation-desktop.json": "986dd7868d6ad85c5e0463769061092907776818c8c86affa77b18371f34cb93",
  "public/ahv/views/ahv-page-de-addiction-rehabilitation-mobile.json": "a05525fc16e7a44e76d8fc0b3f77e6668462ff30483f6d4770733e025444b953",
  "public/ahv/views/ahv-page-diabetes-metabolic-balance-desktop.json": "eb8ba2ac422837043dbe8d4e588b6c9f1c2927c8e80b4253782e3f195b09ba6c",
  "public/ahv/views/ahv-page-diabetes-metabolic-balance-mobile.json": "d48cf44fdd571bef4df30ad65aba01765f17775dc6783c6b4b1d5c6902d6144f",
  "public/ahv/views/ahv-page-facial-paralysis-desktop.json": "75084f5da85efb33a1df944548e8226cde3b5aa40bcbc158aa3e6c8990a326fb",
  "public/ahv/views/ahv-page-facial-paralysis-mobile.json": "0182f28bebcab212c8faf52c3c43b7c754cd32b41626ee95248af1d48d29599a",
  "public/ahv/views/ahv-page-holistic-rejuvenation-detoxification-desktop.json": "7a41851cea8ffe384e70d4ef90707d46886d94624ee37303bc033a88378bff70",
  "public/ahv/views/ahv-page-holistic-rejuvenation-detoxification-mobile.json": "c6859dc16b030974feacdbe73d3a969ef75b125217c6537a06dd0c449570b890",
  "public/ahv/views/ahv-page-hypertension-desktop.json": "c7828185f87dba0a975b8f47c977bae0a5edcec5d8efe7922401d9846f7b1c89",
  "public/ahv/views/ahv-page-hypertension-mobile.json": "e8d4f71357f27e159a290b5cc6b8d1e1af85b079ea9a2a511e43032a6b07d943",
  "public/ahv/views/ahv-page-immunity-executive-health-desktop.json": "9359f554a39322d5a26da8e56a82a98aab78e02824113fbd71a6d597e330f568",
  "public/ahv/views/ahv-page-immunity-executive-health-mobile.json": "8a72d199a2e2db540aa021e93ee210cf1ff09919cb1ef69200c7ed71571d154a",
  "public/ahv/views/ahv-page-joint-rehabilitation-arthritis-desktop.json": "fb498127c4e41dbeed31b7c061062a67126e3b0f9457b3617aa6e06f73930d7c",
  "public/ahv/views/ahv-page-joint-rehabilitation-arthritis-mobile.json": "4233a6d6df98aa8b44ed4bcea10b80fa594ae717a1ae25bbb0d04a8f9dc68b0c",
  "public/ahv/views/ahv-page-neck-upper-back-desktop.json": "e85bafd5633e0329615bda8666177322251bef8c92bff20398d749c25473086c",
  "public/ahv/views/ahv-page-neck-upper-back-mobile.json": "1afdac16b7629b9c99b567d18ef1ceea3e2ce4ec819db31faba9a5e76c312148",
  "public/ahv/views/ahv-page-nervous-disability-desktop.json": "008b82af6b6e872439484a942c3d6b62e850c070cd2e0dd0d8dffdb63b1756ea",
  "public/ahv/views/ahv-page-nervous-disability-mobile.json": "d63fd011703bd77818e7a4bf0af0493185deb874e3a937f357ed1846b5e6b8f4",
  "public/ahv/views/ahv-page-panchakarma-therapy-desktop.json": "aed3a0a9b6e2ec7c11d2a5a3393f1f7b5284284789f2c662290f8619e2eca9dc",
  "public/ahv/views/ahv-page-panchakarma-therapy-mobile.json": "7f9162aecf3c0aabacecf3b364af1c40b0efacd2c2811393ac51f8084bdeb709"
};
const ACCEPTED_06B = {
  "public/ahv/views/ahv-page-paralysis-recovery-desktop.json": "a67b7dc22bcdf22f7247339b65ff2515e12e2badccae8cab53d5763023f8b997",
  "public/ahv/views/ahv-page-paralysis-recovery-mobile.json": "b9de3f44166b927dab2f2833f9a31d5a6b9cc38949ba33d5d1b6b497c8cbc557",
  "public/ahv/views/ahv-page-personalized-customized-healing-desktop.json": "e379d2a47adb6ad9bdc1e5252d57790218c3549a5dffd962970634f645d28134",
  "public/ahv/views/ahv-page-personalized-customized-healing-mobile.json": "be92dbb85cd41eb8cf3b719b39e7312128722bf0c7e34c8d18413340e7cb54b3",
  "public/ahv/views/ahv-page-post-pregnancy-health-programme-desktop.json": "43757da4f8aa14c9937c1eff317c892348fdc5e0f29d3e210be836017ada6183",
  "public/ahv/views/ahv-page-post-pregnancy-health-programme-mobile.json": "db6580134e61cdf5d4bda9caa4ddb9275f188e2568a33f20be1642e9b6348bca",
  "public/ahv/views/ahv-page-psoriasis-desktop.json": "21fa8ce5f6240de276a0146d082d04d369fc04bda74bf6b6c7565b88cea92835",
  "public/ahv/views/ahv-page-psoriasis-mobile.json": "92feae2c722cd4126194ca571d93bf86c296f2b5ab9570f3f92a2f3917523bdb",
  "public/ahv/views/ahv-page-sinus-migraine-desktop.json": "320e040f900c0e74ad424274a8c697169723a88add836516744efa872b41e419",
  "public/ahv/views/ahv-page-sinus-migraine-mobile.json": "103628d6368d9c6d39692621b2a377dabdc8055424eedd436320fa260b302822",
  "public/ahv/views/ahv-page-skin-vitality-desktop.json": "9e8624be83047d4cac2efe18406795a5bcd8ada146bc5cf99f93c56426fb2815",
  "public/ahv/views/ahv-page-skin-vitality-mobile.json": "8abb61b35cedd83c12dd1eb5fc2b17c8779151092b9edb5402c4f7e27a4d4dec",
  "public/ahv/views/ahv-page-sleep-restoration-desktop.json": "de50af175f745e79ad4d1f5049cf32a768eca6c774d9d2207601a9a5563b0df9",
  "public/ahv/views/ahv-page-sleep-restoration-mobile.json": "eb21c40655d832334a752f2481be22d6312243573ba5980417b6676b34e4a33b",
  "public/ahv/views/ahv-page-spinal-disc-nerve-restoration-desktop.json": "eaf86a03716c26fc8b3c61654c8a4fe590424c5bf656c047529cc44f310723ef",
  "public/ahv/views/ahv-page-spinal-disc-nerve-restoration-mobile.json": "7fab179c50ca563b633b803da52f61c9d76d5f6af14b75c0df550e26192ea3dc",
  "public/ahv/views/ahv-page-spondylitis-desktop.json": "95871e9ecde5af66b4a79869726842d61a690eea0517e6dc41a2a4cff4e9ef63",
  "public/ahv/views/ahv-page-spondylitis-mobile.json": "14d96d6e1754744ad139a4753cdb06b0dc8a5ee909ba70a9c22247c7e080e7d5",
  "public/ahv/views/ahv-page-stress-strain-desktop.json": "63aecb728ec10786599f14b144772c0e6c2d4dbbb2e01218d40242fb4fc9f1f0",
  "public/ahv/views/ahv-page-stress-strain-mobile.json": "5c28f396d7bdf5c502e41dd96a6678c21b675d55c9270ddf07cf6ff70da92195",
  "public/ahv/views/ahv-page-supportive-care-cancer-desktop.json": "f779fcc42f5453f4c53af6682178ecd1fedf5a3ff18a89cfb1049369c80b5e44",
  "public/ahv/views/ahv-page-supportive-care-cancer-mobile.json": "8ed8038f38d508ad6fab6d64a4f8428176eca9e21e7e802530609cfbf6a9ae2e",
  "public/ahv/views/ahv-page-vision-eye-rejuvenation-desktop.json": "3c0230a0684765afef82c4589a91db7624b7ff698d8557ce0ea4d6fef3fafea1",
  "public/ahv/views/ahv-page-vision-eye-rejuvenation-mobile.json": "064fca97e2427cd76e8f33bd544e481350e2adc010abdb0eb90abc1f1df9a383"
};
const ACCEPTED_06C = {
  "public/ahv/views/ahv-page-weight-loss-programme-desktop.json": "37c6bc60a017f7167f8acd2b38193da6f54a83e4cbee08a14f0482fb7b396cf3",
  "public/ahv/views/ahv-page-weight-loss-programme-mobile.json": "b74c9e096cfae70f07cca49e54aecac6a8c3b54cbd6633bbb9baae10f473637a",
  "public/ahv/views/ahv-page-womens-hormonal-balance-desktop.json": "852fe014afe4c5f4d3826cb83e6fd677573276a0c2b6949e6928751e6c1f0294",
  "public/ahv/views/ahv-page-womens-hormonal-balance-mobile.json": "d83c2c3e251ceecbb029f297ca5ec0748c82051dafde650273f146dce566f67d"
};
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
  "public/ahv/views/ahv-page-ayurveda-training-programs-mobile.json": "29c41453798fbd31c437d0c35a1e92decf2ab88be03bd70f9fd22f7dafd2ae68",
  "english-candidate/final-rates/yoga.json": "7a335d163af6e2ef673c36cf99966fd6fb8fd865e9deab736dee9cb487c32a88",
  "english-candidate/final-rates/route-map.json": "61dc3faf7ddd591e3f6f627a78ccb9efd863f96ab810049c2da2d70f78f85144"
};

for (const [name, baseHash] of Object.entries(BATCH)) {
  test(`${name}: approved one-therapy indicative routine`, () => {
    const prog = PROGRAMMES[name];
    const v = view(name);
    assert.equal(includedTherapies(v, prog.route), 1, "programme must include one therapy a day");
    const { routine, cols } = routineOf(v);
    const times = routine.map((r) => minutes(r.time));
    times.forEach((t, i) => i && assert.ok(t > times[i - 1], `slot ${routine[i].time} out of order`));

    const therapies = routine.filter(isTherapy);
    assert.equal(therapies.length, 1, "exactly one therapy slot for a one-therapy programme");
    const mentions = routine.filter((r) => /therap/i.test(r.title + " " + r.body));
    assert.equal(mentions.length, 1, "no other slot may mention a therapy");
    const roles = Array.from(routine, (r) => {
      if (isTherapy(r)) return "morning therapy";
      const hits = rolesFor(prog.gentleYoga).filter(([, , match]) => match && match(r.title + " " + r.body));
      assert.equal(hits.length, 1, `${r.time} "${r.title}" must map to exactly one approved role, got ${hits.map((x) => x[0]).join(", ") || "none"}`);
      return hits[0][0];
    });
    const expected = rolesFor(prog.gentleYoga);
    assert.deepEqual(roles, expected.map(([role]) => role), "slots must be the approved roles, once each, in order");
    expected.forEach(([role, anchor, , range], i) => {
      assert.equal(routine[i].time, anchor, `approved anchor: ${role} must start at ${anchor}, found ${routine[i].time}`);
      if (!range) return;
      const stated = [...routine[i].body.matchAll(/\b(\d\d:\d\d) to (\d\d:\d\d)\b/g)].map((m) => [m[1], m[2]]);
      assert.deepEqual(stated, [range], `approved range: ${role} must run ${range.join("–")}`);
    });

    const [therapy] = therapies;
    assert.match(therapy.body, /\brest\b/i, "therapy must be followed by rest");
    for (const word of [/doctor/i, /plan/i, /appointment/i, /type/i, /duration/i]) assert.match(therapy.body, word, `indicative wording ${word}`);
    assert.doesNotMatch(therapy.body, /session [12]|first|second/i, "one-therapy slot must not imply a second session");
    const afternoon = routine.find((r) => r.time === "15:30");
    assert.ok(afternoon && !/therap/i.test(afternoon.title + afternoon.body), "15:30 is personal time, not a therapy");
    const text = routine.map((r) => r.title + " " + r.body).join(" ");
    assert.doesNotMatch(text, /second|additional|extra|upgrade|add-on|optional|on request|supplement/i, "no second-therapy or upsell promise");
    assert.doesNotMatch(text, /factory/i, "no factory tour in the routine");
    const at17 = routine.filter((r) => r.time === "17:00");
    if (prog.gentleYoga) {
      assert.equal(at17.length, 1, "Yoga programme keeps the 17:00 gentle practice");
      assert.match(at17[0].body, /suitable/i, "17:00 practice only where suitable");
      assert.match(at17[0].body, /advised/i, "17:00 practice as advised");
      assert.doesNotMatch(at17[0].body, /private|session|book/i, "17:00 practice must not promise another booked session");
    } else assert.equal(at17.length, 0, "no 17:00 slot added outside the Yoga programmes");

    if (prog.iconCorrected) {
      assert.equal(v.template.split("Daily 1 Therapy Per Person").length - 1, 1, "icon label states one therapy");
      assert.doesNotMatch(v.template, /Daily 2 Therap/, "no two-therapy icon label remains");
    } else assert.doesNotMatch(v.template, ICON, "no therapy-count icon on this page");

    assert.ok(cols.routineA.length && cols.routineB.length, "both desktop columns populated");
    assert.equal(JSON.stringify([...cols.routineA, ...cols.routineB]), JSON.stringify(routine), "columns cover the routine in order");
    assert.equal(masked(v), baseHash, "bytes outside the routine, column split and icon label are unchanged");
  });
}

for (const [label, frozen] of [["N12.06-A", ACCEPTED_06A], ["N12.06-B", ACCEPTED_06B], ["N12.06-C", ACCEPTED_06C]])
  test(`accepted ${label} two-therapy views are untouched`, () => {
    for (const [file, hash] of Object.entries(frozen)) assert.equal(sha(fs.readFileSync(path.join(SITE, file))), hash, `${file} accepted view changed`);
  });

test("course hours, Coming Soon, training and tariff sources are untouched", () => {
  for (const [file, hash] of Object.entries(FROZEN_COURSE_AND_TARIFF))
    assert.equal(sha(fs.readFileSync(path.join(SITE, file))), hash, `${file} course/training/tariff source changed`);
});
