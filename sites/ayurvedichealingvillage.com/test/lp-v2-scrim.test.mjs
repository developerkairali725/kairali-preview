// Task 19: text over photos must sit on a guaranteed backing (scrim or panel) that holds over ANY photo.
// The browser-level proof is tools/lp-contrast.mjs (real photos and --white); this guards the parts that can be
// checked without a browser: the skin tokens, the CSS that uses them, and the marker classes in the markup.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SKINS, contrast, over } from "../campaign-v2/kit/skins.ts";

const css = readFileSync(new URL("../campaign-v2/sections/sections.css", import.meta.url), "utf8");
const src = (f) => readFileSync(new URL(`../campaign-v2/sections/${f}`, import.meta.url), "utf8");
const WHITE = "#FFFFFF";

test("every skin's scrim keeps on-night text >= 4.5:1 over a pure white photo", () => {
  for (const [v, s] of Object.entries(SKINS)) {
    const bg = over(s.scrim.color, s.scrim.copy / 100, WHITE);
    // Text over a scrim: on-night, on-night at 72% (film caption kind) and 85% (Stillness body), on-night-accent.
    for (const [name, fg] of [
      ["onNight", s.vars.onNight], ["onNight@85%", over(s.vars.onNight, 0.85, bg)],
      ["onNight@72%", over(s.vars.onNight, 0.72, bg)], ["onNightAccent", s.vars.onNightAccent],
    ]) {
      const r = contrast(fg, bg);
      assert.ok(r >= 4.5, `${v} ${name} on scrim ${s.scrim.color}@${s.scrim.copy}% over white = ${r.toFixed(2)}`);
    }
    assert.ok(s.scrim.copy <= 92, `${v}: a scrim this opaque is a panel; use a darker scrim colour instead`);
  }
});

test("the scrim token is defined once and every overlay backing uses it", () => {
  assert.match(css, /\.lp\{--lp-scrim-solid:color-mix\(in srgb,var\(--lp-scrim\) var\(--lp-scrim-copy\),transparent\)\}/);
  const rule = (selector) => {
    const i = css.indexOf(selector + "{");
    assert.ok(i > -1, `missing rule ${selector}`);
    return css.slice(i, css.indexOf("}", i));
  };
  // Each text-over-photo block, and the backing it must draw from the scrim token.
  for (const sel of [
    '[data-variant="A"] .lp-header::before',
    '  .lp-still__card',
    '  [data-variant="C"] .lp-still__card::before',
    ".lp-vil__more",
    ".lp-film--featured .lp-film__text",
  ]) assert.match(rule(sel), /var\(--lp-scrim-solid\)/, sel.trim());
});

test("no overlay falls back to a bare photo: text-shadow alone is never the backing", () => {
  // The C Stillness card has no background of its own; it must keep its ::before scrim.
  assert.match(css, /\[data-variant="C"\] \.lp-still__card\{[^}]*background:none/);
  assert.match(css, /\[data-variant="C"\] \.lp-still__card::before\{[^}]*content:""/);
});

test("overlay markup carries the scrim/panel marker classes", () => {
  assert.match(src("Header.tsx"), /"lp-header lp-scrim"/);
  assert.match(src("Stillness.tsx"), /"lp-still__card lp-scrim" : "lp-still__card lp-panel"/);
  assert.match(src("interactive/Films.tsx"), /"lp-film__text lp-scrim"/);
  assert.match(src("Village.tsx"), /lp-vil__more lp-panel/);
  assert.match(src("Hero.tsx"), /lp-hero__chip lp-panel/);
  assert.match(src("ConsultBar.tsx"), /"lp-consult lp-panel"/);
});
