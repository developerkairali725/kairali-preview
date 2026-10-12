import { test } from "node:test";
import assert from "node:assert/strict";
import { SKINS, contrast, skinCssVars, SHARED_PAIRS } from "../campaign-v2/kit/skins.ts";
import { SECTION_ORDER } from "../campaign-v2/kit/variants.ts";

test("every shared text pair in every skin meets 4.5:1", () => {
  for (const [v, s] of Object.entries(SKINS)) for (const [fg, bg] of SHARED_PAIRS) {
    const r = contrast(s.vars[fg], s.vars[bg]);
    assert.ok(r >= 4.5, `${v} ${fg} on ${bg} = ${r.toFixed(2)}`);
  }
});

test("contrast() matches known values", () => {
  assert.equal(contrast("#2A2118", "#F7F4EA").toFixed(1), "14.4");
});

test("contrast() throws on invalid hex", () => {
  assert.throws(() => contrast("#abc", "#F7F4EA"), /Unsupported color/);
  assert.throws(() => contrast("#2A2118", "#gg0000"), /Unsupported color/);
});

test("skinCssVars returns exact key set", () => {
  const expected = [
    "--lp-radius", "--lp-scrim", "--lp-scrim-copy", "--lp-ground", "--lp-surface", "--lp-ink", "--lp-muted",
    "--lp-primary", "--lp-on-primary", "--lp-accent-text", "--lp-accent-line",
    "--lp-night", "--lp-on-night", "--lp-on-night-accent", "--lp-wa", "--lp-on-wa", "--lp-error"
  ];
  for (const v of ["A","B","C","D"]) {
    const keys = Object.keys(skinCssVars(v)).sort();
    const exp = expected.sort();
    assert.deepEqual(keys, exp, `Variant ${v}`);
  }
});

test("variant orders: B leads with village, C with story/stillness, D is short and hides story sections", () => {
  assert.equal(SECTION_ORDER.B.indexOf("village") < SECTION_ORDER.B.indexOf("admission"), true);
  assert.equal(SECTION_ORDER.C.indexOf("stillness") < SECTION_ORDER.C.indexOf("doctors"), true);
  for (const hidden of ["stillness", "films", "village", "longForm", "consultBar"]) assert.equal(SECTION_ORDER.D.includes(hidden), false, hidden);
  for (const v of ["A","B","C","D"]) { assert.equal(SECTION_ORDER[v][0], "header"); assert.equal(SECTION_ORDER[v].at(-1), "footer"); assert.ok(SECTION_ORDER[v].includes("enquiry")); }
});
