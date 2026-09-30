#!/usr/bin/env node
/**
 * placeholder-lint.mjs — the PREVIEW-ONLY LOCK of D-EQ-CATALOG, mechanized.
 * Source of law: DECISIONS.md 2026-07-18 17:46:09 IST (D-EQ-CATALOG) +
 * launches/kairaliequipment.com/STRATEGY.md §6 ("The placeholder law,
 * mechanized") + BRIEF §4 ("this site can never go live while any placeholder
 * remains").
 *
 * WHY THIS EXISTS. The kairaliequipment build ships the FULL catalog structure
 * with UNMISTAKABLE placeholders (prices "₹X,XXX / $X,XXX", SKUs
 * "SKU-PLACEHOLDER-0NN", "— awaiting catalog —" rows, PLACEHOLDER-badged
 * assets) BY OWNER ORDER — real data was not deliverable in time. The owner's
 * counterweight is absolute: while ANY placeholder remains, the site is
 * PREVIEW-ONLY and the DNS flip is BLOCKED. A rule like that held only in
 * prose is a rule that gets forgotten at flip time; this script is the rule.
 *
 * TWO MODES, deliberately distinct (BRIEF §7: findings "BLOCK go-live, not
 * the preview"):
 *   default        — REPORT: list every placeholder hit LOUDLY, exit 0.
 *                    Placeholders are expected during the preview stage; a
 *                    finding here is information, not a defect. Runs in CI so
 *                    every PR prints the live placeholder debt.
 *   --golive       — GATE: any hit exits 2. This is the mode the go-live
 *                    checklist runs (launches/<domain>/sitewide-checklist.md);
 *                    a human flips DNS only after this passes. Gates fail
 *                    builds; they are never advisory (CLAUDE.md rule g).
 *
 * SCOPE. sites/<domain> source + public text assets for every domain listed in
 * ARMED_DOMAINS (today: kairaliequipment.com — the one site under the
 * placeholder law). Arming a new site = adding one line here, in the PR that
 * introduces its placeholders. Binary assets are matched BY FILENAME (a
 * "-placeholder." filename is itself placeholder debt — the real catalogue
 * replaces the file).
 *
 * CONTROL PROBE (§0.6): known-present text must flag and the honest negation
 * corpus must stay clean, through the real matcher, before any file is read.
 * A lint that cannot prove it still matches has not run.
 *
 * Exit codes: 0 = clean (or report mode) · 2 = --golive with findings OR
 * broken probe · 1 = harness error.
 *
 * Usage: node scripts/placeholder-lint.mjs [--golive] [--root <repo-root>] [--json]
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Domains under the placeholder law (D-EQ-CATALOG). */
export const ARMED_DOMAINS = ["kairaliequipment.com"];

/** The EXACT placeholder grammar of STRATEGY §6.1 — one pattern per form. */
export const PLACEHOLDER_PATTERNS = [
  { id: "sku", re: /SKU-PLACEHOLDER-\d+/g, note: "placeholder SKU id" },
  { id: "price", re: /[₹$]\s?X,XXX/g, note: "placeholder price value" },
  { id: "awaiting", re: /awaiting catalog/gi, note: "awaiting-catalog copy row" },
  { id: "badge", re: /PLACEHOLDER/g, note: "PLACEHOLDER badge/marker" },
];

const TEXT_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".md", ".mdx", ".html", ".txt", ".css", ".svg",
]);
const IGNORED_DIRS = new Set([
  "node_modules", ".next", ".turbo", ".git", ".vercel", "dist", "out", "build", "coverage",
]);

/** Pure text scanner — returns findings for one file's text. */
export function scanText(text, file) {
  const findings = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const p of PLACEHOLDER_PATTERNS) {
      p.re.lastIndex = 0;
      let m;
      while ((m = p.re.exec(line)) !== null) {
        findings.push({ file, line: i + 1, rule: p.id, note: p.note, match: m[0], excerpt: line.trim().slice(0, 140) });
      }
    }
  });
  return findings;
}

/** A filename that names itself a placeholder is placeholder debt too. */
export function scanFilename(file) {
  return /placeholder/i.test(file.split("/").pop() ?? "")
    ? [{ file, line: 0, rule: "filename", note: "placeholder-named asset file", match: file.split("/").pop(), excerpt: "(binary/asset — matched by name)" }]
    : [];
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else yield p;
  }
}

export function scanSite(siteDir, root) {
  const findings = [];
  for (const p of walk(siteDir)) {
    const rel = relative(root, p);
    findings.push(...scanFilename(rel));
    if (TEXT_EXTENSIONS.has(extname(p))) {
      findings.push(...scanText(readFileSync(p, "utf8"), rel));
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Control probes
// ---------------------------------------------------------------------------
export function runControlProbes() {
  const broken = [];
  const probeText = [
    'sku: "SKU-PLACEHOLDER-001"',
    "price renders ₹X,XXX / $X,XXX until the catalogue lands",
    "<td>— awaiting catalog —</td>",
    '<span class="ph-tag">PLACEHOLDER</span>',
  ].join("\n");
  const hits = scanText(probeText, "<probe>");
  const seen = new Set(hits.map((h) => h.rule));
  for (const p of PLACEHOLDER_PATTERNS) {
    if (!seen.has(p.id)) broken.push(`probe: rule "${p.id}" did not flag its known-present text`);
  }
  // negation corpus — our best honest sentences must stay clean
  const anti = [
    "Pathi — Wooden Massage Bed (Droni), 8.5 × 3 ft (2591 × 914 mm), medicated wood with brass work.",
    "Prices, lead times and export terms are shared at quote stage.",
    "Write to info@kairali.com for specifications and dimensions.",
  ].join("\n");
  if (scanText(anti, "<anti-probe>").length > 0) {
    broken.push("anti-probe: honest copy was flagged — the lint would cry wolf and get switched off");
  }
  if (scanFilename("sites/x/public/catalogue-placeholder.pdf").length !== 1) {
    broken.push("probe: placeholder-named asset file was not flagged");
  }
  if (scanFilename("sites/x/public/images/wooden-massage-bed.jpg").length !== 0) {
    broken.push("anti-probe: a real asset filename was flagged");
  }
  return broken;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
function main(argv) {
  const golive = argv.includes("--golive");
  const asJson = argv.includes("--json");
  const rootArg = argv.indexOf("--root");
  const root = resolve(rootArg >= 0 ? argv[rootArg + 1] : REPO_ROOT);

  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\nplaceholder-lint: CONTROL PROBE FAILED — this lint did not run.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  let findings = [];
  const scanned = [];
  for (const domain of ARMED_DOMAINS) {
    const dir = join(root, "sites", domain);
    if (!existsSync(dir)) continue; // site not on this branch — nothing to scan
    scanned.push(domain);
    findings = findings.concat(scanSite(dir, root));
  }

  if (asJson) {
    console.log(JSON.stringify({ mode: golive ? "golive" : "report", scanned, findings }, null, 2));
  } else {
    console.log(`\nplaceholder-lint (${golive ? "GO-LIVE GATE" : "report"}) — domains under D-EQ-CATALOG: ${scanned.join(", ") || "(none on this branch)"}`);
    for (const f of findings) {
      console.log(`  ${f.file}:${f.line} [${f.rule}] ${f.note} — "${f.match}"`);
    }
    console.log(`\n${findings.length} placeholder hit(s).`);
  }

  if (findings.length === 0) {
    console.log("CLEAN — no placeholder remains; the D-EQ-CATALOG preview-only lock no longer binds this site.");
    return 0;
  }
  if (golive) {
    console.log(`
FAIL — PREVIEW-ONLY LOCK (D-EQ-CATALOG): ${findings.length} placeholder(s) still on the site.
This site can NEVER go live while any placeholder remains — the DNS flip is
BLOCKED until the real catalogue swaps in route-for-route and this gate exits 0.`);
    return 2;
  }
  console.log(`PREVIEW-ONLY: placeholders are owner-ordered and expected at this stage (BRIEF §7).
They BLOCK go-live, not this preview — the go-live checklist runs this lint with --golive, which fails while any hit remains.`);
  return 0;
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`placeholder-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
