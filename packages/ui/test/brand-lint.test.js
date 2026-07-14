import test from "node:test";
import assert from "node:assert/strict";
import { lintBrandText, lintBrandDir } from "../src/brand-lint.js";

const errs = (f) => f.filter((x) => x.severity === "error");
const rules = (f) => f.map((x) => x.rule);

test("rogue hex in CSS and TSX is an error; brand-allow downgrades to info", () => {
  const css = lintBrandText(`.x { color: #ff0000; }`, { file: "a.css" });
  assert.equal(errs(css).length, 1);
  assert.equal(css[0].rule, "rogue-hex");

  const tsx = lintBrandText(`const c = "#8E9D35";`, { file: "a.tsx" });
  assert.equal(errs(tsx).length, 1);

  const allowed = lintBrandText(
    `.x { color: #ff0000; } /* brand-allow: rogue-hex */`,
    { file: "a.css" },
  );
  assert.equal(errs(allowed).length, 0);
  assert.equal(allowed[0].severity, "info");
});

test("pure fragment anchors are not hexes; styled hexy strings are", () => {
  const anchor = lintBrandText(`<a href="#abc">x</a>`, { file: "a.tsx" });
  assert.equal(anchor.length, 0);
  const styled = lintBrandText(`<a href="#abc" style={{color:"#abc"}}>x</a>`, { file: "a.tsx" });
  assert.ok(errs(styled).length >= 1);
});

test("raw color functions flagged in CSS only", () => {
  const css = lintBrandText(`.x { box-shadow: 0 0 4px rgba(0,0,0,.5); }`, { file: "a.css" });
  assert.equal(errs(css).length, 1);
  assert.equal(css[0].rule, "rogue-color");
  const tsx = lintBrandText(`fill="rgb(0,0,0)"`, { file: "icon.tsx" });
  assert.equal(tsx.filter((f) => f.rule === "rogue-color").length, 0);
});

test("marigold as text: 400 = error, 300 = warning (dark-surface rule)", () => {
  const bad = lintBrandText(`.x { color: var(--marigold-400); }`, { file: "a.css" });
  assert.equal(bad[0].severity, "error");
  assert.equal(bad[0].rule, "marigold-text");
  const dark = lintBrandText(`.overline-dark { color: var(--marigold-300); }`, { file: "a.css" });
  assert.equal(dark[0].severity, "warning");
  // background/border marigold is the accent law working as intended — no finding
  const accent = lintBrandText(`.rule { background: var(--marigold-400); }`, { file: "a.css" });
  assert.equal(accent.filter((f) => f.rule === "marigold-text").length, 0);
});

test("outline:none without replacement = error; with box-shadow/--focus-ring = pass", () => {
  const stripped = lintBrandText(`a:focus { outline: none; }`, { file: "a.css" });
  assert.equal(errs(stripped).length, 1);
  assert.equal(stripped[0].rule, "focus-strip");
  const replaced = lintBrandText(
    `:where(a, button):focus-visible {\n  outline: none;\n  box-shadow: var(--focus-ring);\n}`,
    { file: "a.css" },
  );
  assert.equal(replaced.filter((f) => f.rule === "focus-strip" && f.severity === "error").length, 0);
});

test("arogyakendra.com passes the brand lint today (fixture = the real site)", () => {
  const findings = lintBrandDir(new URL("../../../sites/arogyakendra.com", import.meta.url).pathname);
  assert.deepEqual(errs(findings), [], JSON.stringify(errs(findings), null, 2));
});

test("brand 'none' sites are exempt with an info trail; missing config is an error", () => {
  const none = lintBrandDir(new URL("../../../sites/kairali.ai", import.meta.url).pathname);
  assert.equal(errs(none).length, 0);
  assert.equal(none[0].severity, "info");
  const missing = lintBrandDir("/nonexistent-dir-for-test");
  assert.equal(missing[0].severity, "error");
  assert.equal(missing[0].rule, "config");
});
