/**
 * Kairali brand lint — the STATIC layer of Ship Gate A4 ("brand lint fails
 * the build", docs/ENGINEERING_STANDARDS.md). Companion to the BROWSER layer
 * in tests/factory/factory-site.spec.ts, which verifies what statics cannot:
 * computed touch-target sizes (≥44px) and visible focus rings on real
 * elements. Together they mechanize A4.
 *
 * Rules:
 *  1. rogue-hex     — hex color literals in site source. Brand tokens only;
 *                     the ONLY homes for hex are packages/ui/brand-tokens.css
 *                     and raag-tokens.css (the brand manuals win, CLAUDE.md d).
 *  2. rogue-color   — raw rgb()/rgba()/hsl()/oklch() literals in site CSS.
 *                     Shadows/overlays come from tokens (--shadow-warm etc.).
 *  3. marigold-text — `color: var(--marigold-400)` = ERROR (ch.10: 1.9:1,
 *                     never text on white). marigold-300 in a color property
 *                     = WARNING (legal ONLY as descriptors on dark surfaces
 *                     per ch.08 — verify the surface, or suppress).
 *  4. focus-strip   — a CSS rule block setting `outline: none|0` without a
 *                     replacement (box-shadow / --focus-ring / outline re-set)
 *                     = ERROR (ch.07/10: visible focus on EVERY control).
 *  5. tokens-import — a branded site must import its token sheet
 *                     (brand-tokens.css, or raag-tokens.css for Raag).
 *  6. bronze-text   — `color: var(--bronze-400)` = ERROR. It measures 2.80:1
 *                     on ivory: it fails AA (4.5:1) and even the 3:1
 *                     large-text bar, so every text-level bronze on a light
 *                     ground uses --bronze-600 (#875F1F, 5.16:1) —
 *                     D-BRONZE-CONTRAST (Abilash, 17 Jul 2026), which reads
 *                     the manual's own ch.10 line ("body uses Bronze 600")
 *                     one step stricter because our ground is ivory, not
 *                     white. This rule reads ONLY `color:`, so bronze-400
 *                     stays legal for borders/shadows/tints, and the logo
 *                     lockup's ARTWORK (ch.02, never recolored, WCAG-exempt).
 *                     All 20 fleet instances failed before this landed; the
 *                     rule exists so they cannot drift back.
 *
 * Scope: sites/<domain> with site.config.json. The `brand` field picks the
 * token law: "kairali" (default) | "raag" | "none" (exempt — imported
 * personal/internal surfaces; exemptions are Abilash's to ratify, see
 * QUESTIONS.md 14 Jul 2026).
 *
 * Suppression: `brand-allow: <rule>` in a comment on the same line —
 * reported as info, never silent.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "out",
  ".git",
  ".vercel",
  "public", // static assets (svg favicons etc.) are exported artwork, not styling
]);

/** Extensions scanned for color literals. */
const SOURCE_EXTENSIONS = new Set([".css", ".scss", ".ts", ".tsx", ".js", ".jsx", ".mdx"]);

const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const COLOR_FN_RE = /\b(?:rgb|rgba|hsl|hsla|oklch)\(/g;
const MARIGOLD_TEXT_RE = /(?<![-\w])color\s*:\s*var\(--marigold-(\d+)\)/g;
/** Rule 6 (D-BRONZE-CONTRAST): bronze-400 in a `color:` property. Matches the
 *  marigold rule's shape deliberately — `color:` is the bright line between
 *  TEXT (must pass AA) and decoration (borders/shadows/tints, which take
 *  bronze-400 freely and are untouched by this regex). */
const BRONZE_TEXT_RE = /(?<![-\w])color\s*:\s*var\(--bronze-(\d+)\)/g;

/** @typedef {{file:string,line:number,severity:"error"|"warning"|"info",rule:string,message:string,excerpt:string}} Finding */

function lineSuppresses(line, rule) {
  const m = line.match(/brand-allow:\s*([\w ,-]+)/i);
  if (!m) return false;
  return m[1].split(",").map((w) => w.trim().toLowerCase()).includes(rule);
}

/**
 * Lint one file's text.
 * @returns {Finding[]}
 */
export function lintBrandText(text, { file = "<text>" } = {}) {
  /** @type {Finding[]} */
  const findings = [];
  const lines = text.split(/\r?\n/);
  const isCss = /\.(css|scss)$/.test(file);

  const push = (i, severity, rule, message) =>
    findings.push({ file, line: i + 1, severity, rule, message, excerpt: lines[i].trim().slice(0, 160) });

  lines.forEach((line, i) => {
    // 1. rogue hex — anywhere in site source
    const hexes = line.match(HEX_RE) ?? [];
    // ignore pure fragment anchors that merely look hexy (href="#abc") — a
    // color literal in markup sits in a style/attr value, not an href.
    const realHexes = /href\s*=\s*["']#/.test(line) && !/(?:color|background|border|fill|stroke|shadow|style)/i.test(line)
      ? []
      : hexes;
    for (const hex of realHexes) {
      if (lineSuppresses(line, "rogue-hex")) {
        push(i, "info", "rogue-hex", `"${hex}" allowed by brand-allow on this line`);
      } else {
        push(i, "error", "rogue-hex", `Rogue hex "${hex}" — use brand tokens (packages/ui); no site-local colors`);
      }
    }

    // 2. raw color functions — CSS only (TSX SVG icons use currentColor)
    if (isCss) {
      const fns = line.match(COLOR_FN_RE) ?? [];
      for (const fn of fns) {
        if (lineSuppresses(line, "rogue-color")) {
          push(i, "info", "rogue-color", `"${fn})" allowed by brand-allow on this line`);
        } else {
          push(i, "error", "rogue-color", `Raw ${fn}…) literal — shadows/overlays come from tokens (--shadow-warm etc.)`);
        }
      }
    }

    // 3. marigold as text color
    for (const m of line.matchAll(MARIGOLD_TEXT_RE)) {
      const step = m[1];
      if (lineSuppresses(line, "marigold-text")) {
        push(i, "info", "marigold-text", `marigold-${step} as color allowed by brand-allow on this line`);
      } else if (step === "300") {
        push(i, "warning", "marigold-text", `marigold-300 as text — legal ONLY on dark surfaces (ch.08); verify or suppress with brand-allow: marigold-text`);
      } else {
        push(i, "error", "marigold-text", `marigold-${step} is never a text color (ch.10: 1.9:1 on white)`);
      }
    }

    // 6. bronze-400 as text color on a light ground (D-BRONZE-CONTRAST)
    for (const m of line.matchAll(BRONZE_TEXT_RE)) {
      const step = m[1];
      if (step !== "400") continue; // bronze-600 (#875F1F, 5.16:1) is the sanctioned text bronze
      if (lineSuppresses(line, "bronze-text")) {
        push(i, "info", "bronze-text", `bronze-400 as color allowed by brand-allow on this line — legal ONLY on a dark ground or as logo/tagline artwork`);
      } else {
        push(i, "error", "bronze-text", `bronze-400 as text — 2.80:1 on ivory, failing AA and even the 3:1 large-text bar. ALL text-level bronze on light grounds uses --bronze-600 (#875F1F, 5.16:1) per D-BRONZE-CONTRAST (Abilash, 17 Jul 2026). bronze-400 stays for decoration (borders/shadows/tints — this rule only reads \`color:\`); on a dark ground, suppress with brand-allow: bronze-text`);
      }
    }
  });

  // 4. focus-ring stripping — block-aware, CSS only
  if (isCss) {
    findings.push(...checkFocusBlocks(text, file, lines));
  }

  return findings;
}

/** Split CSS into rule blocks and flag outline:none/0 without a replacement. */
function checkFocusBlocks(text, file, lines) {
  /** @type {Finding[]} */
  const findings = [];
  const blockRe = /\{[^{}]*\}/g; // flat rule bodies (nested @media resolve on the inner pass)
  for (const m of text.matchAll(blockRe)) {
    const body = m[0];
    const outlineOff = /outline\s*:\s*(?:none|0)\b/.exec(body);
    if (!outlineOff) continue;
    const hasReplacement = /box-shadow\s*:|--focus-ring|outline\s*:\s*(?!none|0)/.test(
      body.replace(outlineOff[0], ""),
    );
    if (hasReplacement) continue;
    const upTo = text.slice(0, m.index + outlineOff.index).split(/\r?\n/);
    const lineIdx = upTo.length - 1;
    if (lineSuppresses(lines[lineIdx] ?? "", "focus-strip")) {
      findings.push({
        file, line: lineIdx + 1, severity: "info", rule: "focus-strip",
        message: "outline removal allowed by brand-allow on this line",
        excerpt: (lines[lineIdx] ?? "").trim().slice(0, 160),
      });
    } else {
      findings.push({
        file, line: lineIdx + 1, severity: "error", rule: "focus-strip",
        message: "outline removed with no focus replacement — every control keeps a visible focus ring (ch.07/10)",
        excerpt: (lines[lineIdx] ?? "").trim().slice(0, 160),
      });
    }
  }
  return findings;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name) || name.startsWith(".")) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function siteBrand(siteDir) {
  const cfg = join(siteDir, "site.config.json");
  if (!existsSync(cfg)) return null;
  try {
    const parsed = JSON.parse(readFileSync(cfg, "utf8"));
    return parsed.brand ?? "kairali"; // Factory premise: Kairali tokens unless declared otherwise
  } catch {
    return null;
  }
}

const TOKEN_SHEETS = { kairali: "brand-tokens.css", raag: "raag-tokens.css" };

/**
 * Lint a site directory.
 * @returns {Finding[]}
 */
export function lintBrandDir(dir, { brand } = {}) {
  /** @type {Finding[]} */
  const findings = [];
  const eff = brand ?? siteBrand(dir);
  if (eff === null) {
    return [{
      file: join(dir, "site.config.json"), line: 1, severity: "error", rule: "config",
      message: `Missing or invalid site.config.json — brand lint cannot scope (declare "brand": "kairali" | "raag" | "none")`,
      excerpt: "",
    }];
  }
  if (eff === "none") {
    return [{
      file: join(dir, "site.config.json"), line: 1, severity: "info", rule: "config",
      message: `brand "none" — site exempt from token law (imported/personal surface; exemption list is Abilash's to ratify)`,
      excerpt: "",
    }];
  }
  const sheet = TOKEN_SHEETS[eff];
  if (!sheet) {
    return [{
      file: join(dir, "site.config.json"), line: 1, severity: "error", rule: "config",
      message: `Unknown brand "${eff}" — expected "kairali" | "raag" | "none"`,
      excerpt: "",
    }];
  }

  let importsTokens = false;
  for (const file of walk(dir)) {
    const ext = extname(file).toLowerCase();
    if (!SOURCE_EXTENSIONS.has(ext)) continue;
    const text = readFileSync(file, "utf8");
    if (text.includes(`@kairali/ui/${sheet}`)) importsTokens = true;
    findings.push(...lintBrandText(text, { file }));
  }
  if (!importsTokens) {
    findings.push({
      file: dir, line: 1, severity: "error", rule: "tokens-import",
      message: `No file imports "@kairali/ui/${sheet}" — branded sites are built on the token sheet (CLAUDE.md rule d)`,
      excerpt: "",
    });
  }
  return findings;
}

export function formatBrandFindings(findings) {
  const order = { error: 0, warning: 1, info: 2 };
  const sorted = [...findings].sort(
    (a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line,
  );
  return sorted
    .map((f) => `${f.severity.toUpperCase().padEnd(7)} ${f.file}:${f.line} [${f.rule}] ${f.message}\n        > ${f.excerpt}`)
    .join("\n");
}
