#!/usr/bin/env node
/**
 * standards-acceptance.mjs — M0(c): acceptance tests for the seven shared standards.
 *
 * The package's 24 workflows inherit seven `00_SHARED_STANDARDS/*` files that do
 * not exist in the package (plan §1). They arrive from the owner's GPT lane
 * (D-20260719-11, prompt at docs/process/os-2026/merge/gpt-missing-standards-prompt.md)
 * or, failing that, M1 authors them by mapping (plan §3.6). EITHER WAY, an
 * authored standard is adopted only when THIS harness passes it — the
 * "ingest screen + v1-supremacy reconcile" of D-20260719-11, mechanized:
 *
 *   1. the standard file exists at docs/process/os-2026/standards/<name>.md
 *      (missing = PENDING_AUTHOR, reported every run; FAILS under --strict —
 *      the M1 deploy mode);
 *   2. it declares an "## Obligations carried" section listing, by source_id,
 *      every merge-continuity.yaml row whose new_home maps into it — a dropped
 *      obligation is the miss this file exists to prevent, an id it doesn't
 *      own is a claim-jump, an id that isn't in the continuity file is an
 *      invention: all three fail;
 *   3. for EVERY carried obligation the standard's text contains the
 *      obligation's binding source text VERBATIM (whitespace-normalized
 *      substring — v1 is supreme, so the standard quotes the law it carries,
 *      never paraphrases it), OR an explicit escape line
 *      `SUPERSEDES <id> — <owner ruling ref>` citing a DECISIONS.md /
 *      D-YYYYMMDD-NN ruling (supersession is an OWNER act, never an author's);
 *   4. self-modification screen: any instruction telling an agent to update/
 *      extend/add learnings to standards or workflows autonomously is the
 *      exact injection class neutralized in plan §9 (AI-agent rule 9) — its
 *      reappearance in an authored standard fails hard.
 *
 * NOTE: this harness is the STRUCTURAL screen. The SECURITY injection screen
 * for externally-generated files (doctrine rule r) still runs separately via
 * security-auditor before any GPT-returned zip is committed.
 *
 *   node scripts/standards-acceptance.mjs            # report; FAIL only on authored-but-wrong
 *   node scripts/standards-acceptance.mjs --strict   # M1 mode: PENDING also fails
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CONTINUITY, REPO_ROOT, normalize, parseContinuity, relHome,
} from "./merge-continuity-lint.mjs";

export const STANDARDS_DIR = "docs/process/os-2026/standards";
export const EXPECTED_STANDARD_COUNT = 7;
const ID_TOKEN_RE = /\b(?:CM|GR|PKG|STD|REJ|DEF)-\d{3}\b/g;
const SUPERSEDES_RE = /SUPERSEDES\s+((?:CM|GR|PKG|STD|REJ|DEF)-\d{3})\s*[—-]\s*(.+)/g;
const RULING_RE = /D-\d{8}-\d{2}|DECISIONS\.md/;

/** Injection class of plan §9 (AI-agent rule 9): agent self-modification of standards. */
export const SELF_MOD_PATTERNS = [
  /\b(add|append|record)\b.{0,50}\blearnings?\b.{0,50}\b(standard|workflow)/i,
  /\bagent\b.{0,60}\b(update|extend|modify|edit|self-modify)s?\b.{0,40}\b(this|the|these)\s+(standard|file|workflow)/i,
  /\b(update|extend|modify)\b.{0,40}\bstandards?\b.{0,40}\b(automatically|autonomously|without\s+approval)/i,
];

/** Negation markers: a sentence PROHIBITING self-modification is doctrine, not injection. */
const NEGATION_RE = /\b(no|not|never|prohibit(?:ed|s)?|forbidden|superseded|must\s+not|may\s+not|cannot|only\s+propose)\b/i;

/**
 * Self-mod findings with negation awareness: a pattern hit is a violation only
 * when its containing sentence carries no negation (the standards legitimately
 * SAY "no agent may self-modify this standard" — that is the rule, not the attack).
 */
export function selfModFindings(text) {
  const findings = [];
  for (const p of SELF_MOD_PATTERNS) {
    const m = p.exec(text);
    if (!m) continue;
    const start = Math.max(text.lastIndexOf(".", m.index) + 1, text.lastIndexOf("\n", m.index) + 1, 0);
    const end0 = text.indexOf(".", m.index + m[0].length);
    const end1 = text.indexOf("\n", m.index + m[0].length);
    const end = Math.min(...[end0, end1, text.length].filter((x) => x >= 0));
    const sentence = text.slice(start, end + 1).trim();
    if (!NEGATION_RE.test(sentence)) findings.push({ pattern: String(p), sentence });
  }
  return findings;
}

/** Map each standard file (from STD rows) to the obligation rows homed in it. */
export function standardsFromContinuity(doc) {
  const stdRows = doc.rows.filter((r) => r.source_id?.startsWith("STD-"));
  return stdRows.map((std) => {
    const file = relHome(std.new_home);
    const carried = doc.rows.filter(
      (r) => r !== std && file &&
        (relHome(r.new_home) === file || (r.also_carried_by ?? []).includes(file)),
    );
    return { std, file, carried };
  });
}

/**
 * Acceptance check for ONE authored standard text.
 * @returns {errors: string[]} empty = accepted
 */
export function checkStandard(text, stdEntry) {
  const errors = [];
  const { std, carried } = stdEntry;
  // blockquote markers stripped before matching: carrying law in a `> …`
  // blockquote is the expected authoring style, not a carriage failure
  const norm = normalize(text.replace(/^\s*>\s?/gm, ""));

  // 4. self-modification screen first — an injection finding trumps structure
  for (const f of selfModFindings(text))
    errors.push(`${std.source_id}: INJECTION-CLASS self-modification language (plan §9 rule-9 pattern): "${f.sentence.slice(0, 120)}"`);

  // 2. declared obligations
  const m = text.match(/^##\s*Obligations carried\s*$([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/m);
  if (!m) { errors.push(`${std.source_id}: missing "## Obligations carried" section`); return { errors }; }
  const declared = new Set(m[1].match(ID_TOKEN_RE) ?? []);
  const expected = new Set(carried.map((r) => r.source_id));
  for (const id of expected) if (!declared.has(id))
    errors.push(`${std.source_id}: obligation ${id} maps into this standard but is NOT declared — silently dropped`);
  for (const id of declared) {
    if (id === std.source_id) continue;
    if (!expected.has(id))
      errors.push(`${std.source_id}: declares ${id} which is not homed here (invented or claim-jumped obligation)`);
  }

  // 3. verbatim carriage or owner-ruled supersession
  const supersedes = new Map();
  for (const sm of text.matchAll(SUPERSEDES_RE)) supersedes.set(sm[1], sm[2]);
  for (const r of carried) {
    if (supersedes.has(r.source_id)) {
      if (!RULING_RE.test(supersedes.get(r.source_id)))
        errors.push(`${std.source_id}: SUPERSEDES ${r.source_id} cites no owner ruling (D-YYYYMMDD-NN or DECISIONS.md ref required)`);
      continue;
    }
    if (r.old_text != null && !norm.includes(normalize(r.old_text)))
      errors.push(`${std.source_id}: binding text of ${r.source_id} not carried verbatim (v1 supreme — quote it or SUPERSEDES with an owner ruling)`);
  }
  return { errors };
}

/* ────────────────────────────── main ─────────────────────────────────── */

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const strict = process.argv.includes("--strict");
  const contPath = resolve(REPO_ROOT, CONTINUITY);
  if (!existsSync(contPath)) { console.error(`✗ ${CONTINUITY} not found — run M0(b) first`); process.exit(1); }
  const { doc, errors: parseErrors } = parseContinuity(readFileSync(contPath, "utf8"));
  if (parseErrors.length) { for (const e of parseErrors) console.error("✗ parse: " + e); process.exit(1); }

  const entries = standardsFromContinuity(doc);
  const findings = [];
  let pendingCount = 0;

  if (entries.length !== EXPECTED_STANDARD_COUNT)
    findings.push(`expected ${EXPECTED_STANDARD_COUNT} STD rows in continuity, found ${entries.length}`);

  for (const entry of entries) {
    if (!entry.file) { findings.push(`${entry.std.source_id}: new_home names no file path`); continue; }
    const abs = resolve(REPO_ROOT, entry.file);
    if (!existsSync(abs)) {
      pendingCount++;
      console.log(`  ⏳ ${entry.std.source_id} PENDING_AUTHOR: ${entry.file} (${entry.carried.length} obligation(s) waiting)`);
      if (strict) findings.push(`${entry.std.source_id}: STRICT: standard not authored: ${entry.file}`);
      continue;
    }
    const { errors } = checkStandard(readFileSync(abs, "utf8"), entry);
    if (errors.length) findings.push(...errors);
    else console.log(`  ✓ ${entry.std.source_id} ACCEPTED: ${entry.file} (${entry.carried.length} obligation(s) carried)`);
  }

  console.log(`standards-acceptance: ${entries.length} standard(s) · ${pendingCount} pending · mode ${strict ? "STRICT (M1)" : "report"}`);
  if (findings.length) {
    for (const f of findings) console.error("  ✗ " + f);
    console.error(`✗ standards-acceptance: ${findings.length} finding(s)`);
    process.exit(1);
  }
  console.log("✓ standards-acceptance PASS");
}
