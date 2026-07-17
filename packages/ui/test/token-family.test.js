/**
 * token-family.test.js — every ramp step must stay inside its own hue family.
 *
 * [D-RAMP-STEPS · Abilash, 17 Jul 2026]
 *
 * THE BUG THIS EXISTS FOR: `--leaf-700` was a placeholder aliasing
 * `var(--forest-500)` — hue 155° against leaf's 68.7°, a different color
 * family entirely. It measured 6.99:1 on ivory, so it sailed through every
 * contrast gate we own while being the wrong color. A "silent landmine": the
 * first site to follow ch.10 and set body text to leaf-700 would have shipped
 * forest green with a green checkmark.
 *
 * Contrast gates cannot catch this — a wrong hue can be perfectly legible.
 * Only a family check can. So: resolve every `--<family>-<step>` token to a
 * real hex (following var() aliases) and assert its hue sits near that
 * family's anchor.
 *
 * This is deliberately tolerant of LIGHTNESS (that's what a ramp IS) and
 * strict about HUE (that's what a family IS).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const TOKENS = join(resolve(import.meta.dirname, ".."), "brand-tokens.css");

/** The documented anchor step per family (Manual ch.03). */
const ANCHORS = { leaf: "500", forest: "500", marigold: "400", bronze: "400" };

/** Hue degrees a ramp step may sit from its anchor. Ramps darken/lighten;
 *  they do not change family. 10° is generous — the real bug was 86° off. */
const HUE_TOLERANCE = 10;

const hexToRgb = (h) => {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

function hue(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d === 0) return null; // achromatic — hue undefined, family check N/A
  let H;
  if (mx === r) H = 60 * (((g - b) / d) % 6);
  else if (mx === g) H = 60 * ((b - r) / d + 2);
  else H = 60 * ((r - g) / d + 4);
  return H < 0 ? H + 360 : H;
}

const hueGap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/** Parse `--name: value;` pairs, comments stripped. */
export function parseTokens(css) {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, " ");
  const out = new Map();
  for (const m of bare.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out.set(m[1], m[2].trim());
  }
  return out;
}

/** Resolve a token to a hex literal, following var() aliases. */
export function resolveHex(tokens, name, seen = new Set()) {
  if (seen.has(name)) return null; // cycle
  seen.add(name);
  const v = tokens.get(name);
  if (!v) return null;
  const hex = v.match(/#[0-9a-fA-F]{3,8}\b/);
  if (hex) return hex[0];
  const alias = v.match(/var\(\s*(--[\w-]+)\s*\)/);
  if (alias) return resolveHex(tokens, alias[1], seen);
  return null;
}

const tokens = parseTokens(readFileSync(TOKENS, "utf8"));

/** Every --<family>-<step> for a family we know an anchor for. */
const rampSteps = [...tokens.keys()]
  .map((k) => ({ key: k, m: k.match(/^--([a-z]+)-(\d+)$/) }))
  .filter((x) => x.m && ANCHORS[x.m[1]])
  .map((x) => ({ key: x.key, family: x.m[1], step: x.m[2] }));

test("the ramp-step scan actually finds the tokens (guard against a dead test)", () => {
  assert.ok(rampSteps.length >= 8, `expected the real ramp steps, found ${rampSteps.length} — the parser or the token file changed shape, and a test that scans nothing is not a gate`);
  for (const f of Object.keys(ANCHORS)) {
    assert.ok(rampSteps.some((s) => s.family === f), `no steps found for family ${f}`);
  }
});

test("every ramp step resolves to a real hex (no dangling alias)", () => {
  for (const { key } of rampSteps) {
    assert.ok(resolveHex(tokens, key), `${key} does not resolve to a hex — a token that resolves to nothing renders as inherit/black`);
  }
});

test("every ramp step stays inside its own hue family", () => {
  for (const { key, family } of rampSteps) {
    const anchorKey = `--${family}-${ANCHORS[family]}`;
    const stepHex = resolveHex(tokens, key);
    const anchorHex = resolveHex(tokens, anchorKey);
    const h = hue(stepHex), a = hue(anchorHex);
    if (h === null || a === null) continue;
    const gap = hueGap(h, a);
    assert.ok(
      gap <= HUE_TOLERANCE,
      `${key} resolves to ${stepHex} (hue ${h.toFixed(1)}°) but its family anchor ${anchorKey} is ${anchorHex} (hue ${a.toFixed(1)}°) — ${gap.toFixed(1)}° apart. A ramp step changes LIGHTNESS, never family. This is the exact shape of the leaf-700→forest-500 landmine: a wrong hue can pass every contrast gate.`
    );
  }
});

/** HSL lightness 0-100. */
function lightness(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  return ((Math.max(r, g, b) + Math.min(r, g, b)) / 2) * 100;
}

// ── Direction (D-RAMP-STEPS step 2, marigold-300) ────────────────────────────
// marigold-300 is the fleet's FIRST step BELOW an anchor, so direction becomes
// checkable: in a 50→900 ramp, a lower number is LIGHTER and a higher number is
// DARKER. The family check above catches a step landing in the wrong HUE; this
// catches one landing in the wrong DIRECTION — e.g. deriving marigold-300 toward
// black (its anchor's own method) instead of toward white. That would still be
// marigold, still pass contrast on a dark band, and still be wrong.

test("a step below its anchor is LIGHTER; a step above is DARKER", () => {
  for (const { key, family, step } of rampSteps) {
    const anchorStep = ANCHORS[family];
    if (step === anchorStep) continue;
    const stepL = lightness(resolveHex(tokens, key));
    const anchorL = lightness(resolveHex(tokens, `--${family}-${anchorStep}`));
    if (Number(step) < Number(anchorStep)) {
      assert.ok(stepL > anchorL, `${key} is a LOWER step than --${family}-${anchorStep} so it must be LIGHTER, but measures L ${stepL.toFixed(1)} vs the anchor's ${anchorL.toFixed(1)}. Ramps run light→dark as the number rises (50→900).`);
    } else {
      assert.ok(stepL < anchorL, `${key} is a HIGHER step than --${family}-${anchorStep} so it must be DARKER, but measures L ${stepL.toFixed(1)} vs the anchor's ${anchorL.toFixed(1)}.`);
    }
  }
});

test("marigold-300 is a real lighter step, not the anchor aliased (the step-2 landmine)", () => {
  const m300 = resolveHex(tokens, "--marigold-300");
  const m400 = resolveHex(tokens, "--marigold-400");
  assert.notEqual(m300, m400, "--marigold-300 must not resolve to marigold-400 — an alias is not a ramp step");
  const d = lightness(m300) - lightness(m400);
  assert.ok(d > 3 && d < 11, `--marigold-300 should sit ~one step (≈6.6) lighter than its anchor; measured +${d.toFixed(1)}. The landed precedents travel 6.20–7.00 per step.`);
});

test("DETECTOR PROOF: direction check catches a 300 derived the WRONG way (toward black)", () => {
  // The plausible mistake: reuse bronze/leaf's toward-black formula on a step
  // that must go lighter. Result is still marigold, still passes on dark.
  const wrong = parseTokens(`:root{
    --marigold-400: #EEB41E;
    --marigold-300: #A67E15;   /* color-mix(marigold-400 70%, black) — darker */
  }`);
  const m300 = lightness(resolveHex(wrong, "--marigold-300"));
  const m400 = lightness(resolveHex(wrong, "--marigold-400"));
  assert.ok(m300 < m400, "fixture sanity: this wrong value IS darker");
  const gap = hueGap(hue(resolveHex(wrong, "--marigold-300")), hue(resolveHex(wrong, "--marigold-400")));
  assert.ok(gap <= HUE_TOLERANCE, "and the HUE check would NOT catch it — same family, which is exactly why the direction check has to exist");
});

test("leaf-700 specifically is leaf, not forest (the landmine, pinned)", () => {
  const leaf700 = resolveHex(tokens, "--leaf-700");
  const forest500 = resolveHex(tokens, "--forest-500");
  assert.notEqual(leaf700, forest500, "--leaf-700 must never resolve to forest-500 again");
  assert.ok(hueGap(hue(leaf700), hue(resolveHex(tokens, "--leaf-500"))) <= HUE_TOLERANCE, "--leaf-700 must sit in the leaf family");
});

test("DETECTOR PROOF: the family check catches the original bug", () => {
  // The token file exactly as it was before this PR. If the check cannot flag
  // this, it cannot flag anything — this is the control for the tests above.
  const buggy = parseTokens(`:root{
    --leaf-500: #8E9D35;
    --forest-500: #006038;
    --leaf-700: /* TODO */ var(--forest-500);
  }`);
  const leaf700 = resolveHex(buggy, "--leaf-700");
  assert.equal(leaf700, "#006038", "the buggy alias should resolve through to forest-500's hex");
  const gap = hueGap(hue(leaf700), hue(resolveHex(buggy, "--leaf-500")));
  assert.ok(gap > HUE_TOLERANCE, `the pre-PR alias must be caught — measured ${gap.toFixed(1)}° from the leaf anchor`);
});
