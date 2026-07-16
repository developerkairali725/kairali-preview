#!/usr/bin/env node
/**
 * cta-label-lint.mjs — a CTA may not claim a channel it does not reach.
 * Rubric family: docs/process/rubrics/ (see README — this gate's rubric is open)
 *
 * THE RULE. If a CTA's href reaches the Priya WhatsApp number (919289838797),
 * its label may not use doctor / physician / clinician language. Priya is the
 * Chatbase AI ASSISTANT, not a physician — documented at
 * sites/whatisayurveda.com/app/_components/chrome.tsx:5-7 and confirmed by
 * Abilash 15 Jul 2026. We shipped "Ask a doctor on WhatsApp" pointing at that
 * bot on every article. On a YMYL health site that is a safety claim, not a
 * marketing claim: a patient who believes a doctor is reading takes different
 * risks than one who knows it is software.
 *
 * WHY THIS IS A SEPARATE GATE FROM banned-string-lint. That lint bans a STRING
 * anywhere on a site. This one is HREF-AWARE, and the difference is the point:
 *   · "Speak to a physician" on a link to the hospital's real phone line is TRUE
 *     and must pass. A blunt string ban would forbid it and be wrong.
 *   · "Talk to our doctors" on the bot's href is FALSE and must fail — even
 *     though no banned string appears anywhere in it.
 * The claim is not in the words. It is in the words RELATIVE TO THE DESTINATION.
 *
 * HOW IT RESOLVES THE DESTINATION. Bindings whose value carries the Priya digits
 * (`const WHATSAPP_URL = "https://wa.me/919289838797"`) are collected PER SITE —
 * per site, not globally, so one site's WHATSAPP_URL cannot vouch for another's.
 * Then every `href={IDENT}` / `href="…919289838797…"` is traced back to its
 * enclosing element, and the element's rendered label + aria-label + title are
 * checked. Comments are stripped first (a comment naming the ban is not a CTA).
 *
 * WHAT IT DELIBERATELY DOES NOT FLAG:
 *   · "consultation" / "consultant" — booking a consultation through a chat
 *     channel is legitimate; a human fulfils it. Banning it would flag honest
 *     lead-gen CTAs across kairalicenters and kairali.com and get this disabled.
 *   · Template-literal hrefs (`href={`…${n}`}`) — not resolved. Stated, not
 *     silently skipped; no site uses one today.
 *
 * CONTROL PROBE (§0.6). A zero here is not believed until known-violating source
 * flags and known-good source stays clean, through the real matcher, every run.
 *
 * Exit codes: 0 = clean · 2 = violation OR broken control probe · 1 = harness error.
 *
 * Usage: node scripts/cta-label-lint.mjs [--root sites] [--json]
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative, resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { stripCodeComments, IGNORED_DIRS } from "./banned-string-lint.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** The Priya Chatbase AI assistant's WhatsApp number, digits only. */
export const PRIYA_DIGITS = "919289838797";

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const CTA_TAGS = new Set(["a", "Link", "button", "Button", "NavLink"]);

/**
 * Language that asserts a human clinical channel. `consultation`/`consultant`
 * are excluded on purpose — see the header.
 */
export const CLINICAL_CLAIM =
  /\b(?:doctors?|physicians?|clinicians?|vaidyas?|medics?|specialists?|BAMS)\b|\bmedical\s+(?:advice|team|professional|expert|opinion)\b/i;

const digitsOf = (s) => s.replace(/\D/g, "");

// ---------------------------------------------------------------------------
// JSX element resolution — brace- and quote-aware, because `onClick={() => x}`
// contains a `>` and a naive /<a[^>]*>/ truncates the tag at it.
// ---------------------------------------------------------------------------

/** Index of the `>` that closes the tag opening at `i`, or -1. */
export function findTagEnd(text, i) {
  let depth = 0;
  let quote = null;
  for (let j = i; j < text.length; j++) {
    const c = text[j];
    if (quote) {
      if (c === "\\") { j++; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth <= 0) return j;
  }
  return -1;
}

/** Walk back from `idx` to the `<` that opens the element containing it. */
function findTagStart(text, idx) {
  for (let j = idx; j >= 0; j--) if (text[j] === "<") return j;
  return -1;
}

/** Inner text of the element opened at `[start, tagEnd]`, or "" if self-closing. */
function innerOf(text, tagName, tagEnd) {
  if (text[tagEnd - 1] === "/") return ""; // self-closing
  const open = new RegExp(`<${tagName}\\b`, "g");
  const close = new RegExp(`</${tagName}\\s*>`, "g");
  let depth = 1;
  let cursor = tagEnd + 1;
  while (cursor < text.length) {
    close.lastIndex = cursor;
    open.lastIndex = cursor;
    const c = close.exec(text);
    if (!c) return text.slice(tagEnd + 1); // unbalanced — take the rest, fail loud not silent
    const o = open.exec(text);
    if (o && o.index < c.index) { depth++; cursor = o.index + o[0].length; continue; }
    depth--;
    if (depth === 0) return text.slice(tagEnd + 1, c.index);
    cursor = c.index + c[0].length;
  }
  return text.slice(tagEnd + 1);
}

/** Rendered-ish label: drop nested tags and JSX expressions, collapse space. */
export function labelOf(inner) {
  return inner
    .replace(/<[^>]*>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Analysis
// ---------------------------------------------------------------------------

/** Identifiers in this source bound to a string carrying the Priya number. */
export function collectPriyaIdents(text) {
  const idents = new Set();
  const re = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(["'`])([^"'`]*)\2/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (digitsOf(m[3]).includes(PRIYA_DIGITS)) idents.add(m[1]);
  }
  return idents;
}

/** @typedef {{file:string,line:number,rule:string,message:string,excerpt:string}} Finding */

/**
 * @param {string} raw
 * @param {{file?:string, priyaIdents?:Set<string>}} opts
 * @returns {Finding[]}
 */
export function analyzeSource(raw, { file = "<source>", priyaIdents = new Set() } = {}) {
  const text = stripCodeComments(raw);
  const lineAt = (idx) => text.slice(0, idx).split("\n").length;
  /** @type {Finding[]} */
  const findings = [];

  /** every href occurrence that resolves to Priya */
  const hrefHits = [];
  const identRe = /href\s*=\s*\{\s*([A-Za-z_$][\w$]*)\s*\}/g;
  let m;
  while ((m = identRe.exec(text)) !== null) {
    if (priyaIdents.has(m[1])) hrefHits.push({ index: m.index, via: m[1] });
  }
  const litRe = /href\s*=\s*(["'])([^"']*)\1/g;
  while ((m = litRe.exec(text)) !== null) {
    if (digitsOf(m[2]).includes(PRIYA_DIGITS)) hrefHits.push({ index: m.index, via: m[2] });
  }

  for (const hit of hrefHits) {
    const start = findTagStart(text, hit.index);
    if (start < 0) continue;
    const tagName = (text.slice(start).match(/^<\s*([A-Za-z][\w.]*)/) || [])[1];
    if (!tagName || !CTA_TAGS.has(tagName)) continue;
    const tagEnd = findTagEnd(text, start);
    if (tagEnd < 0) continue;

    const attrs = text.slice(start, tagEnd + 1);
    const label = labelOf(innerOf(text, tagName, tagEnd));
    const aria = (attrs.match(/aria-label\s*=\s*["']([^"']*)["']/) || [])[1] ?? "";
    const title = (attrs.match(/\btitle\s*=\s*["']([^"']*)["']/) || [])[1] ?? "";

    for (const [what, value] of [["label", label], ["aria-label", aria], ["title", title]]) {
      if (!value) continue;
      const claim = value.match(CLINICAL_CLAIM);
      if (!claim) continue;
      findings.push({
        file,
        line: lineAt(hit.index),
        rule: "bot-channel-claimed-as-clinical",
        message:
          `<${tagName}> ${what} "${value}" uses clinical language ("${claim[0]}") but its href reaches ` +
          `+91 92898 38797 — the Priya Chatbase AI assistant, not a physician (chrome.tsx:5-7). ` +
          `Disclose the bot ("Ask Priya, our AI assistant") or point the CTA at a real clinical channel.`,
        excerpt: raw.split(/\r?\n/)[lineAt(hit.index) - 1]?.trim().slice(0, 160) ?? "",
      });
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Walk
// ---------------------------------------------------------------------------

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name) || name.startsWith(".")) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (CODE_EXTENSIONS.has(extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

/**
 * Group files by site so a binding resolved in one site cannot speak for
 * another. `sites/<domain>/…` groups by domain; anything else groups by root.
 */
function siteKeyOf(absFile, absRoot) {
  const rel = relative(REPO_ROOT, absFile).split(sep);
  if (rel[0] === "sites" && rel.length > 1) return `sites/${rel[1]}`;
  return absRoot;
}

/** @param {string[]} roots */
export function scanRoots(roots) {
  /** @type {Map<string, string[]>} */
  const bySite = new Map();
  for (const root of roots) {
    const abs = resolve(REPO_ROOT, root);
    if (!existsSync(abs)) throw new Error(`root does not exist: ${root}`);
    for (const f of walk(abs)) {
      const k = siteKeyOf(f, abs);
      if (!bySite.has(k)) bySite.set(k, []);
      bySite.get(k).push(f);
    }
  }

  /** @type {Finding[]} */
  const findings = [];
  let filesScanned = 0;
  let ctaSurfaces = 0;
  for (const [, files] of bySite) {
    const sources = files.map((f) => ({ f, raw: readFileSync(f, "utf8") }));
    /** binding names are resolved across the whole site, then applied per file */
    const priyaIdents = new Set();
    for (const { raw } of sources) for (const id of collectPriyaIdents(stripCodeComments(raw))) priyaIdents.add(id);
    for (const { f, raw } of sources) {
      filesScanned++;
      if (priyaIdents.size && /href/.test(raw)) ctaSurfaces++;
      findings.push(...analyzeSource(raw, { file: relative(REPO_ROOT, f), priyaIdents }));
    }
  }
  return { findings, filesScanned, sites: bySite.size, ctaSurfaces };
}

// ---------------------------------------------------------------------------
// Control probe (§0.6)
// ---------------------------------------------------------------------------

const PROBE_VIOLATING = `
const WHATSAPP_URL = "https://wa.me/919289838797";
export function Cta() {
  return <a className="btn" href={WHATSAPP_URL} data-cta="whatsapp_click">Ask an Ayurvedic doctor</a>;
}
`;

const PROBE_LEGITIMATE = [
  // the honest CTA that replaced the false one (page.tsx:130)
  `const WHATSAPP_URL = "https://wa.me/919289838797";
   export function Cta() { return <a href={WHATSAPP_URL} data-cta="whatsapp_click">Ask Priya, our AI assistant</a>; }`,
  // clinical language on a REAL clinical channel — true, and must pass
  `const CLINIC_LINE = "tel:+914923224444";
   export function Cta() { return <a href={CLINIC_LINE}>Speak to a physician</a>; }`,
  // live copy, kairali.com:187 / kairalicenters.com:104
  `const WHATSAPP_URL = "https://wa.me/919289838797";
   export function Cta() { return <a href={WHATSAPP_URL}>Chat With Us on WhatsApp</a>; }`,
  `const WHATSAPP_URL = "https://wa.me/919289838797";
   export function Cta() { return <a href={WHATSAPP_URL}>Book on WhatsApp</a>; }`,
  // a comment naming the ban is not a CTA
  `// NEVER label this "ask a doctor" — Priya is an AI assistant, not a physician.
   const WHATSAPP_URL = "https://wa.me/919289838797";
   export function Cta() { return <a href={WHATSAPP_URL}>WhatsApp Us</a>; }`,
  // an arrow function in the attrs must not break tag parsing (the `>` in `=>`)
  `const WHATSAPP_URL = "https://wa.me/919289838797";
   export function Cta() { return <a href={WHATSAPP_URL} onClick={() => track("x")}>Message us</a>; }`,
];

export function runControlProbes() {
  const broken = [];
  const run = (src) => analyzeSource(src, { file: "<probe>", priyaIdents: collectPriyaIdents(stripCodeComments(src)) });

  if (run(PROBE_VIOLATING).length === 0) {
    broken.push('probe DID NOT FLAG a known violation ("Ask an Ayurvedic doctor" on the Priya href) — the gate is broken and would report clean.');
  }
  PROBE_LEGITIMATE.forEach((src, i) => {
    const hits = run(src);
    if (hits.length > 0) broken.push(`anti-probe #${i + 1} FIRED on legitimate source — the gate punishes honest CTAs: ${hits[0].message}`);
  });
  return { ok: broken.length === 0, broken, probes: 1, antiProbes: PROBE_LEGITIMATE.length };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const HELP = `cta-label-lint — a CTA must not claim a human clinical channel that reaches a bot.

  node scripts/cta-label-lint.mjs [--root <dir>]... [--json]

exit 0 clean · 2 violation or broken control probe (CI blocks) · 1 harness error`;

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) { console.log(HELP); return 0; }
  const json = argv.includes("--json");
  const roots = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === "--root") roots.push(argv[++i]);
  if (roots.length === 0) roots.push("sites");

  const probe = runControlProbes();
  if (!probe.ok) {
    console.error(`\ncta-label-lint: CONTROL PROBE FAILED — this gate did not run.\n`);
    for (const b of probe.broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const { findings, filesScanned, sites, ctaSurfaces } = scanRoots(roots);
  if (filesScanned === 0) {
    console.error(`cta-label-lint: 0 files scanned under ${roots.join(", ")} — the walk is broken, not the repo clean (§0.6).`);
    return 2;
  }

  if (json) {
    console.log(JSON.stringify({
      gate: "G6-PRE-CTA",
      status: findings.length === 0 ? "PASS" : "FAIL",
      roots, files_scanned: filesScanned, sites, cta_surfaces: ctaSurfaces,
      control_probe: { name: "violating + legitimate CTA sources", expected: true, observed: probe.ok, probes: probe.probes, anti_probes: probe.antiProbes },
      findings,
    }, null, 2));
    return findings.length === 0 ? 0 : 2;
  }

  console.log(`\ncta-label-lint — ${filesScanned} files across ${sites} site(s) under ${roots.join(", ")}`);
  console.log(`control probe: known violation flagged ✓ · ${probe.antiProbes}/${probe.antiProbes} legitimate CTAs stayed clean`);
  for (const f of findings) console.log(`\nERROR ${f.file}:${f.line} [${f.rule}] ${f.message}\n      > ${f.excerpt}`);
  console.log(findings.length === 0
    ? `\nPASS — 0 CTAs claim a clinician they cannot deliver.\n`
    : `\nFAIL — ${findings.length} violation${findings.length === 1 ? "" : "s"}. Fix the label or the destination; never the gate.\n`);
  return findings.length === 0 ? 0 : 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`cta-label-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
