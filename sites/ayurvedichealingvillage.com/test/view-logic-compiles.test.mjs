// The design runtime compiles each view's logic with new Function (public/ahv/support.js evalDcLogic). A logic edit that
// no longer compiles does not throw at build time: the page silently renders "with props only" (28 Sep 2026: a "$'"
// replace-pattern in a repair tool broke the villa pages' logic, emptying the gallery and every computed value).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const dirs = ["public/ahv/views"];
const L = JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"));
for (const [loc, info] of Object.entries(L)) if (loc !== "en" && fs.existsSync(`public/ahv/l10n/${info.prefix}/views`)) dirs.push(`public/ahv/l10n/${info.prefix}/views`);

test("every design view's logic compiles the way the runtime compiles it (English + built locales)", () => {
  let n = 0; const bad = [];
  for (const d of dirs) for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".json"))) {
    const { logic } = JSON.parse(fs.readFileSync(`${d}/${f}`, "utf8"));
    if (!logic) continue;
    n++;
    try { new Function("DCLogic", "StreamableLogic", "React", logic + '\n;return (typeof Component!=="undefined"&&Component)||undefined;'); }
    catch (e) { bad.push(`${d}/${f}: ${e.message}`); }
  }
  assert.ok(n > 200, `expected the view set, compiled ${n}`);
  assert.deepEqual(bad, []);
});

test("villa pages print the approved daily-admission figures (final-rates APAI, single occupancy)", () => {
  const acc = JSON.parse(fs.readFileSync("english-candidate/final-rates/accommodation.json", "utf8"));
  for (const [slug, key] of Object.entries({ "deluxe-villa": "deluxe", "classic-villa": "classic", "royal-villa": "royal", "maharaja-suite": "suite" })) {
    for (const d of ["desktop", "mobile"]) {
      const { logic, template } = JSON.parse(fs.readFileSync(`public/ahv/views/ahv-page-${slug}-${d}.json`, "utf8"));
      assert.match(template, /data-ahv-villa-rate="1"/, `${slug} ${d} rate block`);
      const m = logic.match(/const VILLA_DAY = (\{[^;]+\});/);
      assert.ok(m, `${slug} ${d} VILLA_DAY`);
      const v = Function(`return ${m[1]}`)();
      for (const c of ["INR", "USD", "EUR"]) assert.equal(v[c][key], acc.editions[c].tables.APAI[key][0], `${slug} ${d} ${c}`);
      assert.match(logic, new RegExp(`VILLA_DAY\\[villaCur\\]\\.${key}\\b`), `${slug} ${d} shows its own villa`);
    }
  }
});
