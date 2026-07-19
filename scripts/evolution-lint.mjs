#!/usr/bin/env node
/**
 * evolution-lint.mjs — validator for the evolution/ self-evolution registers
 * (merge plan §3.1 R1, M2 mechanism; clears strict residue PKG-059) + the
 * SE-6 CONTINUITY GUARD (plan §5).
 *
 * WHAT IT CHECKS.
 *   1. evolution/radar.yaml parses (narrow grammar — an unparseable line is a
 *      finding, never a skip; class-map-lint.mjs stance, no yaml dependency);
 *      every row carries {step, domain, current_tool, ring, last_reviewed,
 *      review_by, candidates}; ring/domain are enum-valid; dates are real
 *      YYYY-MM-DD; review_by is after last_reviewed and within the HONEST
 *      per-domain staleness span (plan §3.1: ai-model ≤ 8 weeks, framework
 *      ~quarter, doctrine ≤ 12 months); every seeded OS step is present
 *      (REQUIRED_STEPS — a register that quietly drops a row is a silence,
 *      and absences are invisible).
 *   2. A radar row PAST its review_by is a LOUD "STALE" finding, NOT a
 *      failure — the Monday sweep + monthly deep pass chase stale rows; CI
 *      turning red over calendar drift would train people to bump dates,
 *      which is the one thing worse than staleness.
 *   3. evolution/channels.yaml: status header present (pending-owner-
 *      ratification until the OWNER ratifies BY HIS WORD — `ratified` demands
 *      a ratified_ref pointing at his logged ruling); every row
 *      {id, name, url, tier, cadence, notes}; tier/cadence enum-valid; every
 *      plan-named channel present with its PINNED tier + cadence
 *      (REQUIRED_CHANNELS — promoting a forum to tier1 or demoting a daily
 *      feed is a register-weakening, not an edit); every untrusted-forum row
 *      carries the SE-3 corroboration law in its notes.
 *   4. evolution/anti-patterns.yaml: every row {signature, reason,
 *      rejected_date, review_by, reopen_conditions}; dates valid and ordered;
 *      reopen_conditions substantive (a rejection with a shrug for a reopen
 *      clause is "can never be reconsidered" wearing honesty's clothes);
 *      every plan-§8 seed signature present (SEED_SIGNATURES — append-only).
 *   5. evolution/scout-schema.json (SE-1/SE-2): valid JSON; additionalProperties
 *      false at EVERY object level; the findings item is EXACTLY
 *      {channel, url, claim, evidence_tier, proposed_ring_change, notes} — no
 *      instruction-bearing fields can be smuggled in; evidence_tier enum is
 *      exactly measured/vendor/anecdote; ring enum mirrors the radar's; the
 *      header $comment carries the Unicode-normalization + injection-screen
 *      ingest law (rule r).
 *   6. SE-6 CONTINUITY GUARD (`--base <sha>`): FAILS any PR that touches
 *      evolution/** AND any of: the CLAUDE.md HARD GATES section (content
 *      diff, not just the file), gates/registry.yaml (row semantics),
 *      docs/design/BEAUTY_DOCTRINE.md, docs/marketing/go-science/**,
 *      scripts/front-gate.mjs. Evolution changes land as doctrine PRs on the
 *      owner path, NEVER bundled with gate edits — the agent never modifies
 *      its own evaluation criteria in the same breath as its evolution layer.
 *      Read-only git only (diff/show); this lint changes nothing.
 *
 * CONTROL PROBES (house rule): known-good and known-bad fixtures run through
 * the REAL parser + REAL lint before the real files; a probe failure means the
 * gate checked nothing and the run fails.
 *
 * Exit codes: 0 = clean (stale rows may still print) · 2 = violations OR
 * broken probe (CI blocks) · 1 = harness error.
 *
 * Usage: node scripts/evolution-lint.mjs [--base <sha>] [--radar <path>]
 *        [--channels <path>] [--anti-patterns <path>] [--scout-schema <path>]
 * Tested both directions in scripts/test/evolution-lint.test.js. Rule g:
 * this lint is a gate; weakening it needs the owner's DECISIONS.md ruling.
 */

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const RADAR = "evolution/radar.yaml";
export const CHANNELS = "evolution/channels.yaml";
export const ANTI_PATTERNS = "evolution/anti-patterns.yaml";
export const SCOUT_SCHEMA = "evolution/scout-schema.json";

export const RINGS = ["adopt", "trial", "assess", "hold"];
export const EVIDENCE_TIERS = ["measured", "vendor", "anecdote"];
export const TIERS = ["tier1-vendor", "tier2-research", "untrusted-forum"];
export const CADENCES = ["daily", "weekly", "monthly"];
export const STATUS_VALUES = ["pending-owner-ratification", "ratified"];

/** Honest per-domain staleness spans in days (plan §3.1: AI-model rows 4–8
 * weeks, framework rows ~quarter, doctrine rows 6–12 months). review_by may
 * sit CLOSER than the cap, never beyond it. */
export const DOMAIN_LIMITS = { "ai-model": 56, "framework": 100, "doctrine": 366 };

/** One row per OS step (plan §3.1): the 18 gap-list stages + the two OS-layer
 * AI-model rows. step → required domain. Dropping a row is a silence; the
 * register may grow, never quietly shrink (rule g). */
export const REQUIRED_STEPS = {
  "Commercial truth": "framework",
  "Google organic": "framework",
  "Analytics and tags": "framework",
  "Technical crawling": "framework",
  "Automated SEO data": "framework",
  "SEO/competitor suite": "framework",
  "Market/channel intelligence": "framework",
  "Performance field": "framework",
  "Performance diagnosis": "framework",
  "Behaviour/UX": "framework",
  "Usability research": "framework",
  "Accessibility": "framework",
  "Visual/functional QA": "framework",
  "Security": "framework",
  "Commerce feeds": "framework",
  "Local": "framework",
  "Paid competitor creative": "framework",
  "Evidence/versioning": "framework",
  "Agent runtime (OS layer)": "ai-model",
  "External audit models (OS layer)": "ai-model",
};

/** Plan-named channels with PINNED tier + cadence (plan §3.1 names them; §12
 * amendment makes the critical ones DAILY detection feeds). Presence and pin
 * are both enforced: demoting a daily vendor feed, or promoting a forum out of
 * the untrusted tier, is a register-weakening — owner ruling required. */
export const REQUIRED_CHANNELS = {
  "anthropic-claude-code": { tier: "tier1-vendor", cadence: "daily" },
  "nextjs-releases": { tier: "tier1-vendor", cadence: "daily" },
  "vercel-changelog": { tier: "tier1-vendor", cadence: "daily" },
  "dataforseo-updates": { tier: "tier1-vendor", cadence: "daily" },
  "google-search-central": { tier: "tier1-vendor", cadence: "daily" },
  "shopify-changelog": { tier: "tier1-vendor", cadence: "daily" },
  "openai-api-notes": { tier: "tier1-vendor", cadence: "daily" },
  "perplexity-api-notes": { tier: "tier1-vendor", cadence: "daily" },
  "thoughtworks-radar": { tier: "tier2-research", cadence: "monthly" },
  "agent-os-research-trackers": { tier: "tier2-research", cadence: "weekly" },
  "hn-front": { tier: "untrusted-forum", cadence: "weekly" },
  "reddit-seo": { tier: "untrusted-forum", cadence: "weekly" },
  "reddit-webdev": { tier: "untrusted-forum", cadence: "weekly" },
  "reddit-claudeai": { tier: "untrusted-forum", cadence: "weekly" },
};

/** Plan-§8 exclusion-register seeds. Append-only: every seed signature must
 * stay present (a rejection that silently vanishes "comes back unexamined" —
 * the exact failure the register exists to prevent). */
export const SEED_SIGNATURES = [
  "clients/{client_id}/ storage root",
  "Drive/object storage as evidence home",
  "UTC-only timestamps",
  "CONDITIONAL_GO as a gate-pass",
  "AI-agent rule 9 self-modification directive",
  "SICA/DGM-style full self-modification loops",
  "Subscription stack: Semrush/Ahrefs/Similarweb/GTmetrix/Hotjar/BrightLocal at current scale",
];

/** The scout finding's FIXED field set (SE-2) — data-only, frozen. */
export const SCOUT_FINDING_FIELDS = ["channel", "url", "claim", "evidence_tier", "proposed_ring_change", "notes"];

/** SE-6 guarded surfaces: paths whose co-change with evolution/** merge-blocks.
 * CLAUDE.md is guarded at HARD-GATES-SECTION altitude (handled separately —
 * doctrine appends elsewhere in the file are the legal owner path). */
export const GUARDED_PATHS = [
  { path: "gates/registry.yaml", why: "gate-registry row semantics" },
  { path: "docs/design/BEAUTY_DOCTRINE.md", why: "beauty rubric" },
  { prefix: "docs/marketing/go-science/", why: "GO-science rubric" },
  { path: "scripts/front-gate.mjs", why: "front-gate enforcement" },
];

export const SE3_CORROBORATION_RE = /corroborat/i;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/* ────────────────────────── narrow-YAML parser ────────────────────────── */

const unquote = (v) => {
  const t = String(v).trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))
    return t.slice(1, -1).replace(/\\"/g, '"');
  return t;
};

/**
 * Parse the registers' deliberately narrow grammar: top-level scalars, one or
 * more named list sections of `  - key: value` items with scalar fields and
 * string sublists. Anything outside the grammar is an error, never a skip.
 * Returns { top, lists, errors }.
 */
export function parseRegister(text) {
  const errors = [];
  const top = {};
  const lists = {};
  let section = null; // current list name
  let item = null;    // current list item
  let sub = null;     // open sublist field name

  text.split(/\r?\n/).forEach((raw, idx) => {
    const ln = idx + 1;
    const line = raw.replace(/\s+$/, "");
    if (line === "" || /^\s*#/.test(line)) return;

    let m;
    if ((m = line.match(/^([a-z_]+):\s*(.*)$/))) {
      if (m[2] === "") { section = m[1]; lists[section] = []; item = null; sub = null; }
      else { top[m[1]] = unquote(m[2]); section = null; item = null; sub = null; }
      return;
    }
    if (section && (m = line.match(/^  - ([a-z_]+):\s*(.+)$/))) {
      item = { __line: ln, [m[1]]: unquote(m[2]) };
      lists[section].push(item);
      sub = null;
      return;
    }
    if (item && (m = line.match(/^    ([a-z_]+):\s*\[\s*\]\s*$/))) { item[m[1]] = []; sub = null; return; }
    if (item && (m = line.match(/^    ([a-z_]+):\s*$/))) { item[m[1]] = []; sub = m[1]; return; }
    if (item && sub && (m = line.match(/^      - (.+)$/))) { item[sub].push(unquote(m[1])); return; }
    if (item && (m = line.match(/^    ([a-z_]+):\s*(.+)$/))) { item[m[1]] = unquote(m[2]); sub = null; return; }

    errors.push(`line ${ln}: unparseable line (narrow register grammar): ${line.trim()}`);
  });

  return { top, lists, errors };
}

/* ─────────────────────────────── helpers ──────────────────────────────── */

const parseDate = (s) => (DATE_RE.test(String(s)) ? new Date(`${s}T00:00:00Z`) : null);
const daysBetween = (a, b) => Math.round((b.getTime() - a.getTime()) / 86400000);

function checkDate(errors, at, field, value) {
  if (value === undefined) { errors.push(`${at}: missing ${field}`); return null; }
  const d = parseDate(value);
  if (!d || Number.isNaN(d.getTime())) { errors.push(`${at}: ${field} "${value}" is not a valid YYYY-MM-DD date`); return null; }
  return d;
}

/* ─────────────────────────────── radar ────────────────────────────────── */

/** @returns { errors, warnings } — warnings = LOUD stale rows, never failures. */
export function lintRadar(text, { today = new Date() } = {}) {
  const errors = [];
  const warnings = [];
  const { top, lists, errors: parseErrors } = parseRegister(text);
  errors.push(...parseErrors.map((e) => `parse: ${e}`));
  if (top.version !== "1") errors.push(`radar: version must be 1 (got ${top.version})`);
  if (!top.generated) errors.push("radar: generated stamp missing");
  const rows = lists.rows ?? [];
  if (rows.length === 0) errors.push("radar: no rows — a radar that watches nothing evolves nothing");

  const seen = new Set();
  for (const r of rows) {
    const at = `radar row "${r.step ?? `line ${r.__line}`}"`;
    for (const f of ["step", "domain", "current_tool", "ring", "last_reviewed", "review_by"]) {
      if (r[f] === undefined || r[f] === "") errors.push(`${at}: missing ${f}`);
    }
    if (!Array.isArray(r.candidates)) errors.push(`${at}: candidates must be a list (use [] when empty — an absent field and an empty list are different statements)`);
    if (r.step) {
      if (seen.has(r.step)) errors.push(`${at}: duplicate step`);
      seen.add(r.step);
    }
    if (r.ring !== undefined && !RINGS.includes(r.ring))
      errors.push(`${at}: ring "${r.ring}" is not one of ${RINGS.join("/")}`);
    if (r.domain !== undefined && !(r.domain in DOMAIN_LIMITS))
      errors.push(`${at}: domain "${r.domain}" is not one of ${Object.keys(DOMAIN_LIMITS).join("/")}`);
    const lr = checkDate(errors, at, "last_reviewed", r.last_reviewed);
    const rb = checkDate(errors, at, "review_by", r.review_by);
    if (lr && rb) {
      if (rb <= lr) errors.push(`${at}: review_by (${r.review_by}) must be after last_reviewed (${r.last_reviewed})`);
      else if (r.domain in DOMAIN_LIMITS) {
        const span = daysBetween(lr, rb);
        const limit = DOMAIN_LIMITS[r.domain];
        if (span > limit)
          errors.push(`${at}: review_by is ${span} days after last_reviewed — the honest ${r.domain} staleness cap is ${limit} days (plan §3.1); closer is legal, farther is not`);
      }
      if (rb < today) warnings.push(`STALE radar row "${r.step}": review_by ${r.review_by} has passed — Monday sweep / monthly deep pass must chase it (loud finding, not a failure)`);
    }
  }
  for (const [step, domain] of Object.entries(REQUIRED_STEPS)) {
    const row = rows.find((r) => r.step === step);
    if (!row) { errors.push(`radar: seeded OS step "${step}" has NO row — the register may grow, never quietly shrink (rule g)`); continue; }
    if (row.domain !== domain) errors.push(`radar row "${step}": domain must be "${domain}" (pinned per-domain staleness class), got "${row.domain}"`);
  }
  return { errors, warnings };
}

/* ────────────────────────────── channels ──────────────────────────────── */

export function lintChannels(text) {
  const errors = [];
  const { top, lists, errors: parseErrors } = parseRegister(text);
  errors.push(...parseErrors.map((e) => `parse: ${e}`));
  if (top.version !== "1") errors.push(`channels: version must be 1 (got ${top.version})`);
  if (!top.status) errors.push("channels: status header MISSING — the register is owner-ratified or it is pending; silence is neither");
  else if (!STATUS_VALUES.includes(top.status))
    errors.push(`channels: status "${top.status}" is not one of ${STATUS_VALUES.join("/")}`);
  if (top.status === "ratified" && !top.ratified_ref)
    errors.push("channels: status ratified without ratified_ref — ratification happens by the owner's WORD, logged (DIRECTIVES/DECISIONS id), never silently");

  const rows = lists.channels ?? [];
  if (rows.length === 0) errors.push("channels: no channels — a monitoring register that monitors nothing");
  const seen = new Set();
  for (const c of rows) {
    const at = `channel "${c.id ?? `line ${c.__line}`}"`;
    for (const f of ["id", "name", "url", "tier", "cadence", "notes"]) {
      if (c[f] === undefined || c[f] === "") errors.push(`${at}: missing ${f}`);
    }
    if (c.id) {
      if (seen.has(c.id)) errors.push(`${at}: duplicate id`);
      seen.add(c.id);
    }
    if (c.tier !== undefined && !TIERS.includes(c.tier))
      errors.push(`${at}: tier "${c.tier}" is not one of ${TIERS.join("/")}`);
    if (c.cadence !== undefined && !CADENCES.includes(c.cadence))
      errors.push(`${at}: cadence "${c.cadence}" is not one of ${CADENCES.join("/")}`);
    if (c.url !== undefined && !/^https:\/\//.test(c.url))
      errors.push(`${at}: url must be https:// (got "${c.url}")`);
    if (c.tier === "untrusted-forum" && c.notes !== undefined && !SE3_CORROBORATION_RE.test(c.notes))
      errors.push(`${at}: untrusted-forum row's notes do not carry the SE-3 corroboration law — every forum channel states, on the row itself, that claims need independent tier-1 corroboration (consensus never counts)`);
  }
  for (const [id, pin] of Object.entries(REQUIRED_CHANNELS)) {
    const row = rows.find((c) => c.id === id);
    if (!row) { errors.push(`channels: plan-named channel "${id}" is MISSING — removing a monitored channel is a register-weakening (owner ruling required)`); continue; }
    if (row.tier !== pin.tier)
      errors.push(`channel "${id}": tier is PINNED to ${pin.tier} (got "${row.tier}") — moving a channel across trust tiers is an SE-3 decision for the owner, not an edit`);
    if (row.cadence !== pin.cadence)
      errors.push(`channel "${id}": cadence is PINNED to ${pin.cadence} (got "${row.cadence}") — the §12 amendment made critical channels DAILY detection feeds; slowing one is a weakening`);
  }
  return { errors, warnings: [] };
}

/* ──────────────────────────── anti-patterns ───────────────────────────── */

export function lintAntiPatterns(text, { today = new Date() } = {}) {
  const errors = [];
  const warnings = [];
  const { top, lists, errors: parseErrors } = parseRegister(text);
  errors.push(...parseErrors.map((e) => `parse: ${e}`));
  if (top.version !== "1") errors.push(`anti-patterns: version must be 1 (got ${top.version})`);
  const rows = lists.patterns ?? [];
  if (rows.length === 0) errors.push("anti-patterns: no rows — the exclusion register must at least carry the plan-§8 seeds");
  const seen = new Set();
  for (const p of rows) {
    const at = `anti-pattern "${p.signature ?? `line ${p.__line}`}"`;
    for (const f of ["signature", "reason", "rejected_date", "review_by", "reopen_conditions"]) {
      if (p[f] === undefined || p[f] === "") errors.push(`${at}: missing ${f}`);
    }
    if (p.signature) {
      if (seen.has(p.signature)) errors.push(`${at}: duplicate signature`);
      seen.add(p.signature);
    }
    const rd = checkDate(errors, at, "rejected_date", p.rejected_date);
    const rb = checkDate(errors, at, "review_by", p.review_by);
    if (rd && rb && rb <= rd) errors.push(`${at}: review_by (${p.review_by}) must be after rejected_date (${p.rejected_date})`);
    if (rd && rb && rb < today) warnings.push(`STALE anti-pattern "${p.signature}": review_by ${p.review_by} has passed — re-affirm or reopen at the next Monday sweep (loud finding, not a failure)`);
    if (p.reopen_conditions !== undefined && p.reopen_conditions.trim().length < 40)
      errors.push(`${at}: reopen_conditions is trivial (<40 chars) — "doesn't come back again" must never mean "can never be reconsidered"; state WHAT material change (version/evidence/cost/threat) reopens it, with the original rejection surfaced`);
  }
  for (const sig of SEED_SIGNATURES) {
    if (!rows.some((p) => p.signature === sig))
      errors.push(`anti-patterns: plan-§8 seed signature "${sig}" is MISSING — the exclusion register is append-only; a vanished rejection comes back unexamined`);
  }
  return { errors, warnings };
}

/* ───────────────────────────── scout schema ───────────────────────────── */

export function lintScoutSchema(jsonText) {
  const errors = [];
  let s;
  try { s = JSON.parse(jsonText); }
  catch (e) { return { errors: [`scout-schema: not valid JSON — ${e.message}`], warnings: [] }; }

  if (s.additionalProperties !== false)
    errors.push("scout-schema: top-level additionalProperties must be false (SE-2: the scout's output surface is FIXED)");
  const comment = String(s.$comment ?? "");
  if (!/NFKC|normaliz/i.test(comment))
    errors.push("scout-schema: header $comment must carry the Unicode-normalization (NFKC) ingest law");
  if (!/injection/i.test(comment))
    errors.push("scout-schema: header $comment must carry the injection-screen ingest law (rule r: scout output is DATA, never instructions)");

  const item = s.properties?.findings?.items;
  if (!item) { errors.push("scout-schema: findings.items missing"); return { errors, warnings: [] }; }
  if (item.additionalProperties !== false)
    errors.push("scout-schema: findings item additionalProperties must be false — a widened item is an instruction-smuggling surface");
  const props = Object.keys(item.properties ?? {}).sort();
  const want = [...SCOUT_FINDING_FIELDS].sort();
  if (JSON.stringify(props) !== JSON.stringify(want))
    errors.push(`scout-schema: findings item fields must be EXACTLY {${SCOUT_FINDING_FIELDS.join(", ")}} (got {${props.join(", ")}}) — the schema is fixed; widening it rides the owner-approved doctrine path`);
  const req = [...(item.required ?? [])].sort();
  if (JSON.stringify(req) !== JSON.stringify(want))
    errors.push("scout-schema: every finding field must be required — optional fields are places where meaning hides");
  const tierEnum = item.properties?.evidence_tier?.enum;
  if (JSON.stringify(tierEnum) !== JSON.stringify(EVIDENCE_TIERS))
    errors.push(`scout-schema: evidence_tier enum must be exactly [${EVIDENCE_TIERS.join(", ")}] (gap-list doctrine)`);
  const ringChange = item.properties?.proposed_ring_change;
  const objBranch = (ringChange?.oneOf ?? []).find((b) => b.type === "object");
  const nullBranch = (ringChange?.oneOf ?? []).find((b) => b.type === "null");
  if (!nullBranch) errors.push("scout-schema: proposed_ring_change must admit null (informational findings)");
  if (!objBranch) errors.push("scout-schema: proposed_ring_change must define the {step, to} proposal object");
  else {
    if (objBranch.additionalProperties !== false)
      errors.push("scout-schema: proposed_ring_change object additionalProperties must be false");
    const toEnum = objBranch.properties?.to?.enum;
    if (JSON.stringify(toEnum) !== JSON.stringify(RINGS))
      errors.push(`scout-schema: proposed_ring_change.to enum must mirror the radar rings [${RINGS.join(", ")}]`);
  }
  return { errors, warnings: [] };
}

/* ───────────────────── SE-6 continuity guard (pure) ───────────────────── */

/** Extract the CLAUDE.md HARD GATES section (from the `## HARD GATES` heading
 * to the next `## ` heading). Empty string if the heading is absent. */
export function extractHardGatesSection(text) {
  const lines = String(text).split(/\r?\n/);
  const start = lines.findIndex((l) => l.startsWith("## HARD GATES"));
  if (start < 0) return "";
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start, end).join("\n");
}

/**
 * The SE-6 rule, pure and testable: evolution/** changes may never ride a PR
 * that also edits a guarded gate surface.
 * @param changed string[] of repo-relative changed paths
 * @param hardGatesChanged boolean — did the CLAUDE.md HARD GATES section's
 *        CONTENT change between base and head (file-touch alone is not enough)
 */
export function seContinuityGuard(changed, hardGatesChanged) {
  const errors = [];
  const touchesEvolution = changed.some((p) => p.startsWith("evolution/"));
  if (!touchesEvolution) return errors;
  const hits = [];
  for (const g of GUARDED_PATHS) {
    for (const p of changed) {
      if ((g.path && p === g.path) || (g.prefix && p.startsWith(g.prefix))) { hits.push(`${p} (${g.why})`); break; }
    }
  }
  if (hardGatesChanged) hits.push("CLAUDE.md (HARD GATES section content changed)");
  for (const h of hits) {
    errors.push(`SE-6 CONTINUITY VIOLATION: this PR touches evolution/** AND ${h} — evolution changes land as doctrine PRs on the owner path, NEVER bundled with gate edits (plan §5 SE-6; the agent never modifies its own evaluation criteria). Split the PR.`);
  }
  return errors;
}

/** Gather the SE-6 inputs from git (READ-ONLY: diff + show; changes nothing). */
export function gitContinuityInputs(base, { cwd = REPO_ROOT } = {}) {
  const run = (args) => execFileSync("git", args, { cwd, encoding: "utf8" });
  const changed = run(["diff", "--name-only", `${base}...HEAD`]).split("\n").map((s) => s.trim()).filter(Boolean);
  let hardGatesChanged = false;
  if (changed.includes("CLAUDE.md")) {
    let baseSection = null;
    try { baseSection = extractHardGatesSection(run(["show", `${base}:CLAUDE.md`])); }
    catch { hardGatesChanged = true; } // no CLAUDE.md at base = everything about it changed
    if (baseSection !== null) {
      const headSection = extractHardGatesSection(readFileSync(resolve(cwd, "CLAUDE.md"), "utf8"));
      hardGatesChanged = baseSection !== headSection;
    }
  }
  return { changed, hardGatesChanged };
}

/* ─────────────────────────── control probes ───────────────────────────── */

const isoPlus = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

export function probeRadar({ ring = "assess", breakStep = null, reviewOffset = 40, domainOverride = null } = {}) {
  const rows = Object.entries(REQUIRED_STEPS)
    .filter(([step]) => step !== breakStep)
    .map(([step, domain]) => `  - step: "${step}"
    domain: ${domainOverride ?? domain}
    current_tool: "probe incumbent"
    ring: ${ring}
    last_reviewed: "${isoPlus(0)}"
    review_by: "${isoPlus(reviewOffset)}"
    candidates: []
`).join("");
  return `version: 1\ngenerated: "2026-07-19 00:00:00 IST"\nrows:\n${rows}`;
}

export function probeChannels({ dropId = null, tierOverride = null, notesOverride = null, status = "pending-owner-ratification" } = {}) {
  const rows = Object.entries(REQUIRED_CHANNELS)
    .filter(([id]) => id !== dropId)
    .map(([id, pin]) => {
      const tier = tierOverride && id === tierOverride.id ? tierOverride.tier : pin.tier;
      const baseNotes = pin.tier === "untrusted-forum"
        ? "UNTRUSTED (SE-3): independent tier-1 corroboration required; consensus never counts"
        : "probe channel";
      const notes = notesOverride && id === notesOverride.id ? notesOverride.notes : baseNotes;
      return `  - id: ${id}
    name: "probe ${id}"
    url: "https://example.com/${id}"
    tier: ${tier}
    cadence: ${pin.cadence}
    notes: "${notes}"
`;
    }).join("");
  return `version: 1\nstatus: ${status}\ngenerated: "2026-07-19 00:00:00 IST"\nchannels:\n${rows}`;
}

export function probeAntiPatterns({ dropSig = null, reopenOverride = null } = {}) {
  const rows = SEED_SIGNATURES.filter((s) => s !== dropSig).map((sig) => `  - signature: "${sig}"
    reason: "probe reason for the rejection row"
    rejected_date: "${isoPlus(-1)}"
    review_by: "${isoPlus(180)}"
    reopen_conditions: "${reopenOverride ?? "materially changed version/evidence/cost/threat profile reopens with the original rejection surfaced and answered"}"
`).join("");
  return `version: 1\ngenerated: "2026-07-19 00:00:00 IST"\npatterns:\n${rows}`;
}

export function runControlProbes() {
  const broken = [];
  const expectClean = (label, r) => {
    if (r.errors.length) broken.push(`CONTROL PROBE FAILURE: known-good ${label} did not pass (${r.errors[0]})`);
  };
  const expectError = (label, r, needle) => {
    if (!r.errors.some((e) => e.includes(needle))) broken.push(`CONTROL PROBE FAILURE: known-bad ${label} was NOT caught (wanted "${needle}") — the detector is dead`);
  };

  // radar: good passes; bad ring / missing step / dishonest span all fail
  expectClean("radar", lintRadar(probeRadar()));
  expectError("radar bad ring", lintRadar(probeRadar({ ring: "shipped" })), "is not one of adopt/trial/assess/hold");
  expectError("radar dropped step", lintRadar(probeRadar({ breakStep: "Security" })), "has NO row");
  expectError("radar dishonest ai-model span", lintRadar(probeRadar({ reviewOffset: 200 })), "staleness cap");
  // stale = warning, never error (both directions)
  const stale = lintRadar(probeRadar({ reviewOffset: 40 }).replace(new RegExp(`review_by: "${isoPlus(40)}"`, "g"), 'review_by: "2020-01-02"').replace(new RegExp(`last_reviewed: "${isoPlus(0)}"`, "g"), 'last_reviewed: "2020-01-01"'));
  if (stale.errors.length) broken.push(`CONTROL PROBE FAILURE: a stale radar row raised an ERROR (${stale.errors[0]}) — staleness is a loud finding, not a failure`);
  if (!stale.warnings.some((w) => w.includes("STALE"))) broken.push("CONTROL PROBE FAILURE: a stale radar row raised NO warning — the Monday sweep has nothing to chase");

  // channels: good passes; missing status / demoted tier / silent forum all fail
  expectClean("channels", lintChannels(probeChannels()));
  expectError("channels missing status", lintChannels(probeChannels().replace(/^status: .*\n/m, "")), "status header MISSING");
  expectError("channels ratified without ref", lintChannels(probeChannels({ status: "ratified" })), "without ratified_ref");
  expectError("channels forum promoted to tier1", lintChannels(probeChannels({ tierOverride: { id: "reddit-claudeai", tier: "tier1-vendor" } })), "PINNED");
  expectError("channels forum without SE-3 note", lintChannels(probeChannels({ notesOverride: { id: "hn-front", notes: "fun links" } })), "SE-3 corroboration");
  expectError("channels dropped feed", lintChannels(probeChannels({ dropId: "google-search-central" })), "MISSING");

  // anti-patterns: good passes; dropped seed / trivial reopen fail
  expectClean("anti-patterns", lintAntiPatterns(probeAntiPatterns()));
  expectError("anti-patterns dropped seed", lintAntiPatterns(probeAntiPatterns({ dropSig: "UTC-only timestamps" })), "append-only");
  expectError("anti-patterns trivial reopen", lintAntiPatterns(probeAntiPatterns({ reopenOverride: "never" })), "reopen_conditions is trivial");

  // scout schema: the REAL file's shape passes; widened variants fail
  let real;
  try { real = readFileSync(resolve(REPO_ROOT, SCOUT_SCHEMA), "utf8"); } catch { real = null; }
  if (real) {
    expectClean("scout schema", lintScoutSchema(real));
    expectError("scout schema widened root", lintScoutSchema(real.replace('"additionalProperties": false,', '"additionalProperties": true,')), "additionalProperties must be false");
    const widenedItem = JSON.parse(real);
    widenedItem.properties.findings.items.properties.instructions = { type: "string" };
    widenedItem.properties.findings.items.required.push("instructions");
    expectError("scout schema smuggled field", lintScoutSchema(JSON.stringify(widenedItem)), "EXACTLY");
  } else {
    broken.push(`CONTROL PROBE FAILURE: ${SCOUT_SCHEMA} unreadable — the scout-schema probes cannot run`);
  }

  // SE-6: bundled fails, either half alone passes
  if (seContinuityGuard(["evolution/radar.yaml", "scripts/front-gate.mjs"], false).length === 0)
    broken.push("CONTROL PROBE FAILURE: evolution + front-gate bundle was NOT caught — the SE-6 guard is dead");
  if (seContinuityGuard(["evolution/radar.yaml", "CLAUDE.md"], true).length === 0)
    broken.push("CONTROL PROBE FAILURE: evolution + HARD-GATES-section change was NOT caught");
  if (seContinuityGuard(["evolution/radar.yaml", "CLAUDE.md"], false).length !== 0)
    broken.push("CONTROL PROBE FAILURE: a CLAUDE.md touch WITHOUT a HARD GATES section change was flagged — the guard binds at section altitude, not file altitude");
  if (seContinuityGuard(["evolution/radar.yaml", "docs/reports/x.md"], false).length !== 0)
    broken.push("CONTROL PROBE FAILURE: a clean evolution-only PR was flagged");
  if (seContinuityGuard(["scripts/front-gate.mjs"], false).length !== 0)
    broken.push("CONTROL PROBE FAILURE: a gate-only PR (no evolution files) was flagged");

  return broken;
}

/* ────────────────────────────────── main ──────────────────────────────── */

function main(argv) {
  const arg = (flag) => { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : null; };

  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\nevolution-lint: CONTROL PROBE FAILED — this gate did not run.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const read = (p) => readFileSync(resolve(REPO_ROOT, p), "utf8");
  const results = [
    ["radar", lintRadar(read(arg("--radar") ?? RADAR))],
    ["channels", lintChannels(read(arg("--channels") ?? CHANNELS))],
    ["anti-patterns", lintAntiPatterns(read(arg("--anti-patterns") ?? ANTI_PATTERNS))],
    ["scout-schema", lintScoutSchema(read(arg("--scout-schema") ?? SCOUT_SCHEMA))],
  ];

  const base = arg("--base");
  if (base) {
    const { changed, hardGatesChanged } = gitContinuityInputs(base);
    results.push(["se6-continuity", { errors: seContinuityGuard(changed, hardGatesChanged), warnings: [] }, changed.length]);
    console.log(`\nevolution-lint --base ${base}: ${changed.length} changed path(s) examined for the SE-6 continuity guard`);
  }

  const errors = results.flatMap(([name, r]) => r.errors.map((e) => `${name}: ${e}`));
  const warnings = results.flatMap(([, r]) => r.warnings);

  console.log(`\nevolution-lint — ${RADAR} · ${CHANNELS} · ${ANTI_PATTERNS} · ${SCOUT_SCHEMA}${base ? " · SE-6 guard" : ""}`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);

  if (errors.length === 0) {
    console.log(`\nPASS — registers parse, enums and dates honest, plan-named rows all present, scout schema fixed and data-only${base ? ", no evolution/gate bundling" : ""}.${warnings.length ? ` ${warnings.length} STALE finding(s) above await the Monday sweep.` : ""}\n`);
    return 0;
  }
  for (const e of errors) console.log(`\nVIOLATION  ${e}`);
  console.log(`\nFAIL — ${errors.length} violation${errors.length === 1 ? "" : "s"}. The evolution layer proposes and the owner disposes: registers stay honest, the scout stays data-only, and evolution PRs never ride with gate edits (rule g).\n`);
  return 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`evolution-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
