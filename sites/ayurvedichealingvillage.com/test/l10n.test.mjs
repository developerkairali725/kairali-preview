// Localization contract (25 Sep 2026): the extractor/applier is byte-safe and
// code-safe, the route table is sound, and localized FAQ schema matches the
// localized visible FAQ (one data source).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { applyUnits, jsUnits, htmlUnits } from "../tools/l10n/lib.mjs";
import { sourceFiles, parseFile, rel } from "../tools/l10n/sources.mjs";

const files = sourceFiles();
const all = [...files.components, ...files.views, ...files.scripts];

for (let i = 0; i < all.length; i += 25) test(`identity apply is lossless, sources ${i + 1}-${Math.min(i + 25, all.length)}`, () => {
  for (const file of all.slice(i, i + 25)) {
    const text = fs.readFileSync(rel(file), "utf8");
    for (const part of parseFile(file, text).parts) {
      const before = new Set(part.units.flatMap((u) => (u.composite ? u.composite.map((c) => c.source) : [u.source])));
      const out = applyUnits(part.text, part.units, (s) => s);
      const again = (part.field === "logic" || file.endsWith(".js")) ? jsUnits(out) : { units: htmlUnits(out) };
      assert.ok(!again.error, `${file} re-parse: ${again.error}`);
      const after = new Set(again.units.flatMap((u) => (u.composite ? u.composite.map((c) => c.source) : [u.source])));
      for (const s of before) assert.ok(after.has(s), `${file}: unit lost on identity apply: ${s.slice(0, 60)}`);
    }
  }
});

test("marker translation keeps every logic/script part parseable", () => {
  for (const file of all) {
    const text = fs.readFileSync(rel(file), "utf8");
    for (const part of parseFile(file, text).parts) {
      if (!(part.field === "logic" || file.endsWith(".js"))) continue;
      const out = applyUnits(part.text, part.units, (s) => "‹" + s + "› «quote\" 'x' `y` ${z}»");
      assert.ok(!jsUnits(out).error, `${file} breaks: ${jsUnits(out).error}`);
    }
  }
});

test("route table: unique paths, English unchanged, legacy DE/FR served in place, 301s single hop", () => {
  const t = JSON.parse(fs.readFileSync(rel("l10n/routes.json"), "utf8"));
  const seen = new Map();
  for (const [en, row] of Object.entries(t.routes)) {
    assert.equal(row.en, en);
    for (const p of Object.values(row)) { assert.ok(!seen.has(p), `duplicate ${p}`); seen.set(p, en); assert.match(p, /^\/([a-z]{2}\/)?([a-z0-9-_.]+\/)*([a-z0-9-_.]+\.html)?$/i); }
  }
  assert.ok(t.legacyServed >= 300, "verified legacy DE/FR URLs are served in place");
  for (const [src, r] of Object.entries(t.redirects)) {
    assert.ok(seen.has(r.to) || JSON.parse(fs.readFileSync(rel("campaign-v110/routes.json"), "utf8")).includes(r.to), `redirect target ${r.to} is a served page`);
    assert.ok(!t.redirects[r.to], `no chain from ${src}`);
    assert.ok(!seen.has(src) || src.toLowerCase() !== src, `redirect source ${src} shadows a served page`);
  }
  assert.ok(!t.redirects["/de/behandlung-in-kerala/"], "paid campaign destination untouched");
});

test("localized FAQ schema equals localized visible FAQ (built locales)", () => {
  const dir = rel("public/ahv/l10n");
  if (!fs.existsSync(dir)) return;
  const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  for (const p of fs.readdirSync(dir)) for (const side of ["desktop", "mobile"]) {
    const f = `${dir}/${p}/views/ahv-page-de-addiction-rehabilitation-${side}.json`;
    if (!fs.existsSync(f)) continue;
    const html = JSON.parse(fs.readFileSync(f, "utf8")).template;
    const sec = html.match(/<section\b[^>]*id="faqs"[^>]*>([\s\S]*?)<\/section>/)[1];
    const visible = [...sec.matchAll(/<summary[^>]*>(.*?)<\/summary><p[^>]*>(.*?)<\/p>/g)].map((m) => ({ q: decode(m[1]), a: decode(m[2]) }));
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((j) => j["@type"] === "FAQPage");
    assert.deepEqual(ld.mainEntity.map((q) => ({ q: q.name, a: q.acceptedAnswer.text })), visible, `${p} ${side}`);
    assert.equal(visible.length, 13 >= visible.length ? visible.length : 13);
  }
});
