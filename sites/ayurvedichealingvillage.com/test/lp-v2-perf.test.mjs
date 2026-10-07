// Task 19: the performance set-up a campaign must not undo (campaign-v2/PERF.md). Static checks only; the
// measured check is `pnpm lp:perf <slug>` (pre-publish, needs a production build and Chrome).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../campaign-v2/sections/", import.meta.url);
const files = [...readdirSync(dir).filter((f) => f.endsWith(".tsx")), ...readdirSync(new URL("interactive/", dir)).filter((f) => f.endsWith(".tsx")).map((f) => `interactive/${f}`)];
const src = Object.fromEntries(files.map((f) => [f, readFileSync(new URL(f, dir), "utf8")]));
const code = (s) => s.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");

test("exactly one priority image: the hero", () => {
  for (const [f, s] of Object.entries(src)) {
    const c = code(s);
    const prio = (c.match(/\bpriority\b(?!:)/g) ?? []).length + (c.match(/priority:\s*true/g) ?? []).length;
    const high = (c.match(/fetchPriority(=|:\s*)"high"/g) ?? []).length;
    if (f === "Hero.tsx") {
      assert.equal((c.match(/priority:\s*true/g) ?? []).length, 1, "Hero: one getImageProps priority");
      assert.match(c, /<img \{\.\.\.mobProps\} fetchPriority="high" loading="eager"/);
      assert.match(c, /preload\(mobProps\.src, \{ as: "image"[^)]*media: MOBILE/);
    } else {
      assert.equal(prio, 0, `${f} marks an image priority`);
      assert.equal(high, 0, `${f} sets fetchPriority high`);
      if (f !== "Header.tsx") assert.doesNotMatch(c, /loading="eager"/, `${f} eager-loads an image`);
    }
  }
  assert.match(src["Header.tsx"], /loading="eager" fetchPriority="low"/, "the header logo must not compete with the hero");
});

test("one font preload: Marcellus latin; every other family preload: false, display: swap", () => {
  const doc = src["Document.tsx"];
  const calls = doc.match(/= (Marcellus|Mulish|Instrument_Serif|Plus_Jakarta_Sans)\(\{[^}]*\}\)/g) ?? [];
  assert.equal(calls.length, 4);
  for (const c of calls) {
    assert.match(c, /display: "swap"/, c);
    if (c.startsWith("= Marcellus")) { assert.match(c, /subsets: \["latin"\]/); assert.doesNotMatch(c, /preload: false/); }
    else assert.match(c, /preload: false/, c);
  }
});

test("no scripts in sections outside the integrations layer, and no /design/ JS", () => {
  for (const [f, s] of Object.entries(src)) {
    const c = code(s);
    assert.doesNotMatch(c, /from "next\/script"/, f);
    if (f !== "Document.tsx") assert.doesNotMatch(c, /<script/, f);
    assert.doesNotMatch(c, /\/design\/[^"]*\.js/, f);
  }
});

test("below-the-fold photos are lazy and sized", () => {
  for (const f of ["Admission.tsx", "Stillness.tsx", "Doctors.tsx", "Village.tsx", "interactive/Films.tsx"]) {
    for (const tag of code(src[f]).match(/<Image[\s\S]*?\/>/g) ?? []) {
      assert.match(tag, /loading="lazy"/, `${f}: ${tag.slice(0, 60)}`);
      assert.match(tag, /width=\{/, f);
      assert.match(tag, /sizes=/, f);
    }
  }
});

test("no content-visibility on the landing page (Safari #enquiry jumps, scroll_depth)", () => {
  const css = readFileSync(new URL("sections.css", dir), "utf8");
  assert.ok(!/content-visibility/.test(css.replace(/\/\*[\s\S]*?\*\//g, "")), "content-visibility must not come back (Task 19 review I3)");
});
