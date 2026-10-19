import test from "node:test";
import { fileURLToPath } from "node:url";
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
  const findings = lintBrandDir(fileURLToPath(new URL("../../../sites/arogyakendra.com", import.meta.url)));
  assert.deepEqual(errs(findings), [], JSON.stringify(errs(findings), null, 2));
});

test("brand 'none' sites are exempt with an info trail; missing config is an error", () => {
  const none = lintBrandDir(fileURLToPath(new URL("../../../sites/kairali.ai", import.meta.url)));
  assert.equal(errs(none).length, 0);
  assert.equal(none[0].severity, "info");
  const missing = lintBrandDir("/nonexistent-dir-for-test");
  assert.equal(missing[0].severity, "error");
  assert.equal(missing[0].rule, "config");
});

// ── Rule 6: bronze-text (D-BRONZE-CONTRAST, Abilash 17 Jul 2026) ─────────────
// Both directions, same run: the banned shape must FAIL and every legitimate
// bronze use must PASS. A rule that flags decoration would be switched off in
// a week, and then it protects nothing.

test("bronze-400 as a text color is an error; bronze-600 is the sanctioned text bronze", () => {
  const bad = errs(lintBrandText(`.overline { color: var(--bronze-400); }`, { file: "a.css" }));
  assert.equal(bad.length, 1);
  assert.equal(bad[0].rule, "bronze-text");
  assert.match(bad[0].message, /2\.80:1 on ivory/);
  assert.match(bad[0].message, /--bronze-600/);

  // the fix shape must be silent
  assert.equal(errs(lintBrandText(`.overline { color: var(--bronze-600); }`, { file: "a.css" })).length, 0);
});

test("bronze-text reads ONLY `color:` — decoration keeps bronze-400 (borders, shadows, tints)", () => {
  const decoration = [
    `--hairline-bronze: 1px solid color-mix(in srgb, var(--bronze-400) 26%, transparent);`,
    `.shelf-row::before { border-top: 2px solid color-mix(in srgb, var(--bronze-400) 55%, transparent); }`,
    `.hero-cover img { box-shadow: 0 24px 48px color-mix(in srgb, var(--bronze-400) 26%, transparent); }`,
    `.card { border: 1.5px solid var(--bronze-400); }`,
    `.x { border-color: var(--bronze-400); }`,
  ];
  for (const css of decoration) {
    const f = lintBrandText(css, { file: "a.css" }).filter((x) => x.rule === "bronze-text");
    assert.equal(f.length, 0, `decoration wrongly flagged: ${css}`);
  }
});

test("bronze-400 text on a dark ground is suppressible, and the suppression is reported, never silent", () => {
  const f = lintBrandText(
    `.hero .kicker { color: var(--bronze-400); /* brand-allow: bronze-text */ }`,
    { file: "a.css" },
  );
  assert.equal(errs(f).length, 0);
  const info = f.find((x) => x.rule === "bronze-text");
  assert.equal(info.severity, "info");
  assert.match(info.message, /dark ground or as logo\/tagline artwork/);
});

test("the shipped fleet is clean under bronze-text — the 20 real violations stay fixed", () => {
  const findings = lintBrandDir("sites/kairaliyoga.com").filter((f) => f.rule === "bronze-text");
  assert.deepEqual(findings.filter((f) => f.severity === "error"), []);
});

// ---------------------------------------------------------------------------
// Rule 7 — leaf-text (D-RAMP-STEPS, Abilash 17 Jul 2026)
// Same both-directions standard as rule 6. The difference worth remembering:
// rule 6 was written to fix 20 live failures; rule 7 flags NOTHING today. It is
// armed before the first leaf text node exists, because the leaf-700 alias bug
// survived four days precisely by guarding a token nobody had used yet.
// ---------------------------------------------------------------------------

test("leaf-500 as a text color is an error; leaf-700 is the sanctioned text leaf", () => {
  const bad = errs(lintBrandText(`.lede { color: var(--leaf-500); }`, { file: "a.css" }));
  assert.equal(bad.length, 1);
  assert.equal(bad[0].rule, "leaf-text");
  assert.match(bad[0].message, /2\.72:1 on ivory/);
  assert.match(bad[0].message, /--leaf-700/);

  // the fix shape must be silent
  assert.equal(errs(lintBrandText(`.lede { color: var(--leaf-700); }`, { file: "a.css" })).length, 0);
});

test("leaf-text reads ONLY `color:` — focus rings, borders and tints keep leaf-500", () => {
  const legitimate = [
    `--focus-ring: 0 0 0 3px color-mix(in srgb, var(--leaf-500) 55%, transparent);`,
    `.banner { border-top: 1px solid var(--leaf-500); }`,
    `.chip { background: color-mix(in srgb, var(--leaf-500) 12%, transparent); }`,
    `.x { border-color: var(--leaf-500); }`,
  ];
  for (const css of legitimate) {
    const f = lintBrandText(css, { file: "a.css" }).filter((x) => x.rule === "leaf-text");
    assert.equal(f.length, 0, `legitimate leaf-500 use wrongly flagged: ${css}`);
  }
});

test("leaf-500 text on a dark ground is suppressible, and the suppression is reported, never silent", () => {
  const f = lintBrandText(
    `.surface-dark .tag { color: var(--leaf-500); /* brand-allow: leaf-text */ }`,
    { file: "a.css" },
  );
  assert.equal(errs(f).length, 0);
  const info = f.find((x) => x.rule === "leaf-text");
  assert.ok(info, "suppression must still be reported as info — never silent");
  assert.equal(info.severity, "info");
});

test("Premium v3 requires its central palette and still rejects local colors", async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = mkdtempSync(join(tmpdir(), "brand-profile-"));
  try {
    writeFileSync(join(dir, "site.config.json"), JSON.stringify({ brand: "kairali", brandTokenProfile: "premium-v3" }));
    writeFileSync(join(dir, "site.css"), '@import "@kairali/ui/kairali-premium-v3-tokens.css";');
    assert.equal(errs(lintBrandDir(dir)).length, 0);
    writeFileSync(join(dir, "site.css"), '@import "@kairali/ui/kairali-premium-v3-tokens.css";\n.x{color:#ff0000}');
    assert.ok(errs(lintBrandDir(dir)).some(f => f.rule === "rogue-hex"));
    writeFileSync(join(dir, "site.css"), '.x{color:var(--ivory)}');
    assert.ok(errs(lintBrandDir(dir)).some(f => f.rule === "tokens-import"));
    writeFileSync(join(dir, "site.config.json"), JSON.stringify({ brand: "kairali", brandTokenProfile: "unapproved" }));
    assert.ok(errs(lintBrandDir(dir)).some(f => f.rule === "config"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("Premium v4 is a second opt-in profile with its own sheet and the same rules", async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = mkdtempSync(join(tmpdir(), "brand-profile-v4-"));
  try {
    writeFileSync(join(dir, "site.config.json"), JSON.stringify({ brand: "kairali", brandTokenProfile: "premium-v4" }));
    writeFileSync(join(dir, "site.css"), '@import "@kairali/ui/kairali-premium-v4-tokens.css";');
    assert.equal(errs(lintBrandDir(dir)).length, 0);
    writeFileSync(join(dir, "site.css"), '@import "@kairali/ui/kairali-premium-v4-tokens.css";\n.x{color:#ff0000}');
    assert.ok(errs(lintBrandDir(dir)).some(f => f.rule === "rogue-hex"));
    writeFileSync(join(dir, "site.css"), '@import "@kairali/ui/kairali-premium-v4-tokens.css";\n.x{color:rgba(0,0,0,.5)}');
    assert.ok(errs(lintBrandDir(dir)).some(f => f.rule === "rogue-color"));
    // the v3 sheet does not satisfy a v4 profile (and vice versa) — each profile names its own sheet
    writeFileSync(join(dir, "site.css"), '@import "@kairali/ui/kairali-premium-v3-tokens.css";');
    assert.ok(errs(lintBrandDir(dir)).some(f => f.rule === "tokens-import"));
    writeFileSync(join(dir, "site.config.json"), JSON.stringify({ brand: "raag", brandTokenProfile: "premium-v4" }));
    assert.ok(errs(lintBrandDir(dir)).some(f => f.rule === "config"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
