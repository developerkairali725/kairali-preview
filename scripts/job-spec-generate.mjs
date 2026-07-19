#!/usr/bin/env node
/**
 * job-spec-generate.mjs — the M2 job-spec generator (agent operating contract).
 *
 * WHY THIS EXISTS. CLAUDE.md §OS v2 DOCTRINE 4 (plan §2.7): every task runs
 * under a job-spec envelope GENERATED from its issue row — scope, input
 * artifacts + freshness, authorized tools, prohibited actions GENERATED from
 * HARD GATES + registry so it can NEVER be narrower than doctrine,
 * retry/timeout/COST BUDGET, output schema, gate + approver, definition of
 * done. M0(a) disposition 4 DELETED the hand-written job spec: the issue row
 * (docs/process/os-2026/issue-register-format.md) is the one authoring
 * surface; this script is the second view. D-20260719-09 (right-tool-right-
 * time): the envelope is where each step's declared tool is recorded so
 * enforcement can check the declared capability actually fired.
 *
 * REFUSALS (fail-closed, tested in both directions):
 *   · CLAUDE.md HARD GATES section unparseable → refuse (prohibitions cannot
 *     be generated, so nothing is generated);
 *   · cost_budget missing/empty → refuse (a spec without a budget is refused —
 *     cost budgets are a first-class gate, no default);
 *   · builder_session == verifier_session (or either missing) → refuse
 *     (EX-3 verifier separation: the session that BUILT never signs its own
 *     gate pass);
 *   · any requested action NOT in the gates/risk-tiers.yaml actions:
 *     vocabulary → refuse (DEFAULT-DENY: unknown action is forever-human
 *     until the owner tiers it — 'release to live' and every other unlisted
 *     phrasing land in the deny bucket by construction; vetRequestedActions);
 *   · any T1 forever-human action in the agent-authorized surface → refuse
 *     (declared T1 vocabulary kinds by tier, PLUS the match_tokens keyword
 *     net as a second line of defense; the FOREVER_HUMAN_FLOOR below is
 *     machine-pinned: editing risk-tiers.yaml to map a T1 action lower is
 *     itself a refusal);
 *   · run:human registry gates can never appear as agent-authorized tools —
 *     they are listed under human_gates (the agent prepares; humans execute).
 *
 * USAGE
 *   node scripts/job-spec-generate.mjs --issue <file>#<id> \
 *        [--builder <session>] [--verifier <session>] [--out <file>] [--now "<IST>"]
 *   node scripts/job-spec-generate.mjs --fixture [--out <file>]
 *   node scripts/job-spec-generate.mjs --check <envelope.yaml>
 *
 * Deterministic: same inputs + same --now ⇒ same bytes (sorted lists, fixed
 * key order). --check is CANONICAL REGENERATION, not inspection: the envelope
 * is rebuilt from its issue row + CURRENT doctrine and every generated field
 * is deep-compared — any drift (a removed gate, an edited approver, a widened
 * tool list) fails, an absent issue_row_hash fails, an unresolvable issue ref
 * fails. The superset property is re-proven the same way, so a doctrine gate
 * added later makes stale envelopes fail loudly, never silently. A hand-
 * edited envelope can therefore never "still pass" --check: passing --check
 * IS the statement that this envelope is byte-equivalent to what its row +
 * today's doctrine generate.
 *
 * House stance: no yaml dependency — narrow grammars, an unparseable line is
 * an error, never a skip (front-gate.mjs / class-map-lint.mjs style).
 * Tested in scripts/test/job-spec-generate.test.js.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

import { parseRegistry } from "./gate-registry-lint.mjs";
import { parseClassMap, resolveVector, resolveChangeGates, PROPERTY_DIMS } from "./class-map-lint.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const CLAUDE_MD = "CLAUDE.md";
export const REGISTRY_PATH = "gates/registry.yaml";
export const CLASS_MAP_PATH = "gates/class-map.yaml";
export const RISK_TIERS_PATH = "gates/risk-tiers.yaml";
export const RADAR_PATH = "evolution/radar.yaml";

/* ── FOREVER-HUMAN FLOOR (machine-pinned; may only grow — rule g) ──────────
 * Every id here MUST exist in gates/risk-tiers.yaml with tier
 * T1-forever-human. Moving one lower (or deleting it) is a refusal: the
 * risk-tier file cannot weaken a gate by edit. */
export const FOREVER_HUMAN_FLOOR = [
  "production-write",
  "content-unpublish-or-delete",
  "dns-robots-htaccess-permalinks",
  "staging-db-into-production",
  "branch-protection-bypass",
  "disavow-submission",
  "consent-analytics-payment-logic",
  "shopify-app-install-or-checkout",
  "payments-money-movement",
  "competitor-outreach-public-comms",
  "secret-exposure",
  "tool-install-from-research",
  "gate-pass-self-approval",
  "clinical-content-ship-without-signoff",
];
export const T1_TIER = "T1-forever-human";

/* ───────────────────────── tiny shared helpers ───────────────────────── */

const unquote = (v) => {
  const t = String(v).trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1);
  return t;
};

/** Quote-aware inline-list splitter: [a, "b, c", d] → [a, "b, c", d]. */
export function splitInline(body) {
  const out = [];
  let cur = "", inQ = null;
  for (const ch of body) {
    if (inQ) { cur += ch; if (ch === inQ) inQ = null; continue; }
    if (ch === '"' || ch === "'") { inQ = ch; cur += ch; continue; }
    if (ch === ",") { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((x) => unquote(x)).filter((x) => x !== "");
}

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

/** "2026-07-19 19:50:00 IST" → "2026-07-19T14:20:00Z" (IST = UTC+05:30). */
export function istToUtc(ist) {
  const m = String(ist).match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}) IST$/);
  if (!m) return null;
  const utcMs = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]) - (5 * 60 + 30) * 60 * 1000;
  return new Date(utcMs).toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function nowIst() {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(new Date()).reduce((a, x) => ((a[x.type] = x.value), a), {});
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} IST`;
}

/* ────────────────── HARD GATES parser (fail-closed) ────────────────── */

/**
 * Parse CLAUDE.md's "## HARD GATES — NEVER VIOLATE" section. Fail-closed:
 * if the section, any of gates 1–15, or the no-self-approval line cannot be
 * found, errors are returned and the caller must refuse to generate.
 * @returns { gates: Map<number,string>, noSelfApproval: string|null, errors: string[] }
 */
export function parseHardGates(text) {
  const errors = [];
  const gates = new Map();
  let noSelfApproval = null;

  const lines = String(text).split(/\r?\n/);
  const start = lines.findIndex((l) => /^##\s+HARD GATES\b/.test(l));
  if (start === -1) {
    return { gates, noSelfApproval, errors: ["CLAUDE.md: '## HARD GATES' section heading not found — refusing to generate prohibitions from nothing"] };
  }
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) { end = i; break; }
  }
  for (let i = start + 1; i < end; i++) {
    const line = lines[i];
    let m;
    if ((m = line.match(/^(\d+)\.\s+\*\*(.+)$/))) {
      const n = Number(m[1]);
      if (gates.has(n)) errors.push(`CLAUDE.md HARD GATES: duplicate gate number ${n}`);
      gates.set(n, line.replace(/^\d+\.\s+/, "").trim());
      continue;
    }
    if (/^\*\*No self-approval of P0\/P1 evidence\*\*/.test(line)) {
      noSelfApproval = line.trim();
    }
  }
  const maxGate = Math.max(0, ...gates.keys());
  for (let n = 1; n <= Math.max(15, maxGate); n++) {
    if (!gates.has(n)) errors.push(`CLAUDE.md HARD GATES: gate ${n} not found — the section drifted; refusing (prohibitions can never be narrower than doctrine)`);
  }
  if (!noSelfApproval) errors.push("CLAUDE.md HARD GATES: the 'No self-approval of P0/P1 evidence' line not found — refusing");
  return { gates, noSelfApproval, errors };
}

/* ────────────────── risk-tiers parser + floor lint ────────────────── */

/** Narrow parser for gates/risk-tiers.yaml.
 * @returns { tiers: Record<string,string>, action_types: any[], actions: any[], errors: string[] } */
export function parseRiskTiers(text) {
  const errors = [];
  const tiers = {};
  const action_types = [];
  const actions = []; // the DEFAULT-DENY vocabulary: enumerated known action kinds
  let section = null;
  let item = null;
  String(text).split(/\r?\n/).forEach((raw, idx) => {
    const ln = idx + 1;
    const line = raw.replace(/\s+$/, "");
    if (line === "" || /^\s*#/.test(line)) return;
    let m;
    if (/^(version|updated):/.test(line)) { section = null; return; }
    if ((m = line.match(/^(tiers|action_types|actions):\s*$/))) { section = m[1]; item = null; return; }
    if (section === "tiers") {
      if ((m = line.match(/^  ([A-Za-z0-9-]+):\s*(.+)$/))) { tiers[m[1]] = unquote(m[2]); return; }
      errors.push(`risk-tiers line ${ln}: unparseable tiers line: ${line.trim()}`);
      return;
    }
    if (section === "action_types") {
      if ((m = line.match(/^  - id:\s*(.+)$/))) {
        item = { id: unquote(m[1]), line: ln, gate_refs: [], examples: [], controls: [], match_tokens: [] };
        action_types.push(item);
        return;
      }
      if (!item) { errors.push(`risk-tiers line ${ln}: field before first "- id:"`); return; }
      if ((m = line.match(/^    ([a-z_]+):\s*\[(.*)\]\s*(?:#.*)?$/))) { item[m[1]] = splitInline(m[2]); return; }
      if ((m = line.match(/^    ([a-z_]+):\s*(.+)$/))) { item[m[1]] = unquote(m[2]); return; }
      errors.push(`risk-tiers line ${ln}: unparseable action_types line: ${line.trim()}`);
      return;
    }
    if (section === "actions") {
      if ((m = line.match(/^  - kind:\s*(.+)$/))) {
        item = { kind: unquote(m[1]), line: ln };
        actions.push(item);
        return;
      }
      if (!item) { errors.push(`risk-tiers line ${ln}: field before first "- kind:"`); return; }
      if ((m = line.match(/^    ([a-z_]+):\s*(.+)$/))) { item[m[1]] = unquote(m[2]); return; }
      errors.push(`risk-tiers line ${ln}: unparseable actions line: ${line.trim()}`);
      return;
    }
    errors.push(`risk-tiers line ${ln}: unexpected top-level line: ${line.trim()}`);
  });
  if (action_types.length === 0) errors.push("risk-tiers: no action_types found — an empty tier map tiers nothing");
  return { tiers, action_types, actions, errors };
}

/** The never-weaken lint: every FOREVER_HUMAN_FLOOR id must be present and T1.
 * A row moving a floor action below T1 (or deleting it) is a refusal. */
export function lintRiskTiersFloor(parsed) {
  const errors = [];
  const byId = new Map(parsed.action_types.map((a) => [a.id, a]));
  for (const id of FOREVER_HUMAN_FLOOR) {
    const row = byId.get(id);
    if (!row) { errors.push(`risk-tiers: floor action "${id}" MISSING — the forever-human floor may only grow, never shrink (rule g)`); continue; }
    if (row.tier !== T1_TIER) errors.push(`risk-tiers: floor action "${id}" mapped to tier "${row.tier}" — a T1 forever-human action may NEVER map lower (rule g); refusing`);
  }
  for (const a of parsed.action_types) {
    if (!a.tier) errors.push(`risk-tiers: action "${a.id}" has no tier`);
    else if (parsed.tiers[a.tier] === undefined) errors.push(`risk-tiers: action "${a.id}" names undeclared tier "${a.tier}"`);
  }
  // The DEFAULT-DENY vocabulary must exist and be well-formed. An absent
  // vocabulary would deny EVERY requested action — fail-closed, but loud is
  // better than mysterious: doctrine loading refuses until the file is fixed.
  const vocab = parsed.actions ?? [];
  if (vocab.length === 0) {
    errors.push("risk-tiers: actions: vocabulary missing/empty — DEFAULT-DENY has no declared kinds, so every requested action would be refused as T1; declare the vocabulary (unknown action is forever-human until the owner tiers it)");
  }
  const seenKinds = new Set();
  const typeIds = new Set(parsed.action_types.map((a) => a.id));
  for (const a of vocab) {
    const k = String(a.kind).toLowerCase();
    if (seenKinds.has(k)) errors.push(`risk-tiers: vocabulary kind "${a.kind}" declared twice — one kind, one tier`);
    seenKinds.add(k);
    if (!a.tier) errors.push(`risk-tiers: vocabulary kind "${a.kind}" has no tier — an untiered kind is unknown, and unknown is T1; tier it or delete it`);
    else if (parsed.tiers[a.tier] === undefined) errors.push(`risk-tiers: vocabulary kind "${a.kind}" names undeclared tier "${a.tier}"`);
    if (a.tier === T1_TIER && !a.maps_to) errors.push(`risk-tiers: T1 vocabulary kind "${a.kind}" must cite its action_types row via maps_to — a T1 refusal is a tiering decision on the record`);
    if (a.maps_to && !typeIds.has(a.maps_to)) errors.push(`risk-tiers: vocabulary kind "${a.kind}" maps_to unknown action_types id "${a.maps_to}"`);
  }
  return errors;
}

/** Case-insensitive whole-token matcher for T1 match_tokens. */
const tokenRe = (token) =>
  new RegExp(`(^|[^a-z0-9])${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "i");

/** Scan an agent-authorized surface (strings) for T1 matches — the SECOND
 * net. The boundary is vetRequestedActions below; this keyword tripwire
 * stays behind it (defense in depth, never the sole control).
 * @returns array of { entry, action } hits */
export function scanT1(surface, riskTiers) {
  const hits = [];
  const t1 = riskTiers.action_types.filter((a) => a.tier === T1_TIER);
  for (const entry of surface) {
    for (const a of t1) {
      if ((a.match_tokens ?? []).some((t) => tokenRe(t).test(entry))) hits.push({ entry, action: a.id });
    }
  }
  return hits;
}

/** DEFAULT-DENY vocabulary vet — the T1 BOUNDARY (external-review adoption,
 * 19 Jul 2026). Every requested action kind must exactly match (case-
 * insensitive) a declared kind in gates/risk-tiers.yaml actions:. Anything
 * not in the vocabulary is treated as T1 and refused — "unknown action is
 * forever-human until the owner tiers it". A declared T1 kind is refused by
 * tier. 'release to live', 'go-live', an unnamed state-changing tool: all
 * land in the deny bucket by construction, no keyword required.
 * @param kinds array of requested action kind strings (bare, no prefix)
 * @returns array of refusal strings (empty = all kinds declared and sub-T1) */
export function vetRequestedActions(kinds, riskTiers) {
  const errors = [];
  const vocab = new Map((riskTiers.actions ?? []).map((a) => [String(a.kind).trim().toLowerCase(), a]));
  for (const kind of kinds) {
    const row = vocab.get(String(kind).trim().toLowerCase());
    if (!row) {
      errors.push(`requested action "${kind}" is NOT in the declared action vocabulary (${RISK_TIERS_PATH} actions:) — DEFAULT-DENY: unknown action is forever-human until the owner tiers it; treated as ${T1_TIER}; REFUSED`);
    } else if (row.tier === T1_TIER) {
      errors.push(`requested action "${kind}" is declared ${T1_TIER} in the action vocabulary (maps_to: ${row.maps_to ?? "?"}) — a spec authorizing a T1 action is REFUSED by construction`);
    }
  }
  return errors;
}

/* ────────────────── issues.yaml parser (narrow) ────────────────── */

/** Parse launches/<domain>/issues.yaml per docs/process/os-2026/issue-register-format.md.
 * @returns { domain, issues: any[], errors: string[] } — each issue carries
 * __raw (its verbatim lines, for hashing) and nested maps/lists one level deep. */
export function parseIssuesFile(text) {
  const errors = [];
  let domain = null;
  const issues = [];
  let inIssues = false;
  let item = null;
  let sub = null; // current sub-block key
  String(text).split(/\r?\n/).forEach((raw, idx) => {
    const ln = idx + 1;
    const line = raw.replace(/\s+$/, "");
    if (line === "" || /^\s*#/.test(line)) return;
    let m;
    if ((m = line.match(/^version:\s*(\S+)\s*$/))) { inIssues = false; return; }
    if ((m = line.match(/^domain:\s*(.+)$/))) { domain = unquote(m[1]); inIssues = false; return; }
    if (/^issues:\s*$/.test(line)) { inIssues = true; item = null; return; }
    if (!inIssues) { errors.push(`issues line ${ln}: unexpected top-level line: ${line.trim()}`); return; }
    if ((m = line.match(/^  - id:\s*(.+)$/))) {
      item = { id: unquote(m[1]), line: ln, __raw: [line] };
      issues.push(item);
      sub = null;
      return;
    }
    if (!item) { errors.push(`issues line ${ln}: field before first "- id:"`); return; }
    item.__raw.push(line);
    if ((m = line.match(/^    ([a-z_]+):\s*\[(.*)\]\s*(?:#.*)?$/))) { item[m[1]] = splitInline(m[2]); sub = null; return; }
    if ((m = line.match(/^    ([a-z_]+):\s*$/))) { sub = m[1]; item[sub] = item[sub] ?? null; return; }
    if ((m = line.match(/^    ([a-z_]+):\s*(.+)$/))) { item[m[1]] = unquote(m[2]); sub = null; return; }
    if (sub && (m = line.match(/^      - (.+)$/))) {
      if (!Array.isArray(item[sub])) item[sub] = item[sub] === null ? [] : item[sub];
      if (Array.isArray(item[sub])) item[sub].push(unquote(m[1]));
      else errors.push(`issues line ${ln}: sub-block "${sub}" mixes list and map entries`);
      return;
    }
    if (sub && (m = line.match(/^      ([a-z_]+):\s*(.+)$/))) {
      if (item[sub] === null) item[sub] = {};
      if (Array.isArray(item[sub])) { errors.push(`issues line ${ln}: sub-block "${sub}" mixes map and list entries`); return; }
      item[sub][m[1]] = unquote(m[2]);
      return;
    }
    errors.push(`issues line ${ln}: unparseable issue line: ${line.trim()}`);
  });
  if (issues.length === 0) errors.push("issues: no rows found");
  return { domain, issues, errors };
}

/* ────────────────── the fixture (CH-1-shaped, M0(a) §1) ────────────────── */

export const FIXTURE_ISSUE_ID = "ISS-ayurvedichealingvillage-com-9001";
export const FIXTURE_ISSUE_REF = `fixture:ch-1#${FIXTURE_ISSUE_ID}`;
export const FIXTURE_ISSUE = `version: 1
domain: ayurvedichealingvillage.com
issues:
  - id: ${FIXTURE_ISSUE_ID}
    state: APPROVED
    severity: P2
    site: ayurvedichealingvillage.com
    class: organic
    entity: ktahv-clinical
    locales: [en, de, fr]
    scope: change
    title: "FIXTURE — hero swap + H1/meta retitle on /consultation (impressions -32% QoQ)"
    causal_hypothesis: "Title CTR decay + dated hero imagery; primary keyword unchanged"
    opportunity_economics:
      value: "+38k impressions/quarter recovered to baseline"
      label: ESTIMATED
    evidence_refs:
      - "launches/ayurvedichealingvillage.com/evidence/2026-07-19-consultation-gsc/ sha256:6b1fdeadbeef"
    spec_intent: "Replace hero image; sharpen H1 + meta within the approved keyword map; EN/DE/FR"
    spec_change_paths:
      - "sites/ayurvedichealingvillage.com/app/consultation/page.tsx"
    spec_change_kinds: [content-only]
    spec_requested_tools: []
    spec_output_schema: "PR diff + evidence bundle + manifest (launches/<domain>/evidence/<run-id>/)"
    definition_of_done: "All three locales shipped or flagged; Dr. Deepu John sign-off (HG-7); gate subset green; post-publish QA fetch diff clean"
    retry_max_attempts: 2
    timeout_minutes: 45
    cost_budget:
      tokens_max: 400000
      usd_max: 6
    builder_session: "session-fixture-builder"
    verifier_session: "session-fixture-verifier"
    gate_subset_ref: "recorded in the generated envelope (gate_resolution)"
    approvals_ref: "launches/ayurvedichealingvillage.com/approvals.yaml"
    monitoring_ref: "launches/ayurvedichealingvillage.com/monitoring.yaml#${FIXTURE_ISSUE_ID}"
    closure_grep: "grep -ri 'dated-hero pattern + old title strings' sites/ayurvedichealingvillage.com -- ALL pages, ALL page types, ALL three locales; paste full output"
`;

/* ────────────────── doctrine loading ────────────────── */

/** Load every doctrine input the generator needs; texts injectable for tests. */
export function loadDoctrine(opts = {}) {
  const root = opts.repoRoot ?? REPO_ROOT;
  const read = (p) => readFileSync(resolve(root, p), "utf8");
  const errors = [];

  const hard = parseHardGates(opts.claudeMdText ?? read(CLAUDE_MD));
  errors.push(...hard.errors);

  const reg = parseRegistry(opts.registryText ?? read(REGISTRY_PATH));
  errors.push(...reg.errors.map((e) => `registry: ${e}`));

  const cm = parseClassMap(opts.classMapText ?? read(CLASS_MAP_PATH));
  errors.push(...cm.errors.map((e) => `class-map: ${e}`));

  const rt = parseRiskTiers(opts.riskTiersText ?? read(RISK_TIERS_PATH));
  errors.push(...rt.errors);
  errors.push(...lintRiskTiersFloor(rt));

  let radar = null;
  const radarText = opts.radarText ?? (existsSync(resolve(root, RADAR_PATH)) ? read(RADAR_PATH) : null);
  if (radarText !== null) {
    radar = { rows: [] };
    let row = null;
    for (const line of radarText.split(/\r?\n/)) {
      let m;
      if ((m = line.match(/^\s*- step:\s*(.+)$/))) { row = { step: unquote(m[1]) }; radar.rows.push(row); }
      else if (row && (m = line.match(/^\s*current_tool:\s*(.+)$/))) row.current_tool = unquote(m[1]);
    }
  }
  return { hard, reg, classMap: cm.doc, riskTiers: rt, radar, errors };
}

/* ────────────────── prohibition generation ────────────────── */

/** The prohibited-actions list, generated from doctrine — NEVER hand-authored.
 * Order is canonical (HG numeric → HG-NSA → REG sorted → T1 sorted). */
export function generateProhibitions(doctrine) {
  const out = [];
  const nums = [...doctrine.hard.gates.keys()].sort((a, b) => a - b);
  for (const n of nums) out.push(`HG-${n} · ${doctrine.hard.gates.get(n)}`);
  if (doctrine.hard.noSelfApproval) out.push(`HG-NSA · ${doctrine.hard.noSelfApproval}`);
  const blockers = doctrine.reg.gates.filter((g) => g.severity === "blocker").map((g) => g.id).sort();
  for (const id of blockers) out.push(`REG:${id} · never merge or ship with blocker gate "${id}" failing, skipped, or weakened (rule g: a failing gate is fixed at the cause or escalated, never around)`);
  const t1 = doctrine.riskTiers.action_types.filter((a) => a.tier === T1_TIER).map((a) => a.id).sort();
  for (const id of t1) {
    const row = doctrine.riskTiers.action_types.find((a) => a.id === id);
    out.push(`T1:${id} · forever-human (${(row.gate_refs ?? []).join(", ")}) — the agent never performs this action; it prepares, flags, and stops`);
  }
  return out;
}

export const prohibitionId = (entry) => String(entry).split(" · ")[0].trim();

/* ────────────────── envelope generation ────────────────── */

/**
 * Generate the envelope object from an issue row + doctrine.
 * @returns { envelope, errors } — errors non-empty ⇒ REFUSED, no envelope.
 */
export function generateEnvelope({ issue, issueRef, doctrine, builder, verifier, now }) {
  const errors = [];
  const need = (f) => {
    if (issue[f] === undefined || issue[f] === null || issue[f] === "") errors.push(`issue ${issue.id ?? "?"}: required field "${f}" missing — refusing`);
  };
  ["id", "state", "severity", "site", "class", "scope", "title", "definition_of_done", "spec_intent", "spec_output_schema", "approvals_ref", "gate_subset_ref"].forEach(need);

  // COST BUDGET: required, no default. A spec without a budget is refused.
  const budget = issue.cost_budget;
  const budgetNum = (v) => v !== undefined && Number.isFinite(Number(v)) && Number(v) > 0;
  if (!budget || typeof budget !== "object" || (!budgetNum(budget.tokens_max) && !budgetNum(budget.usd_max))) {
    errors.push(`issue ${issue.id ?? "?"}: cost_budget missing or empty (needs tokens_max and/or usd_max > 0) — a spec without a budget is REFUSED (cost budgets are a first-class gate; no default exists)`);
  }

  // EX-3: builder/verifier separation.
  const builderSession = builder ?? issue.builder_session ?? null;
  const verifierSession = verifier ?? issue.verifier_session ?? null;
  if (!builderSession || !verifierSession) {
    errors.push(`issue ${issue.id ?? "?"}: builder_session and verifier_session are both required (EX-3 verifier separation) — refusing`);
  } else if (builderSession === verifierSession) {
    errors.push(`issue ${issue.id ?? "?"}: builder_session == verifier_session ("${builderSession}") — the session that BUILT never signs its own gate pass (EX-3); refusing`);
  }

  // Resolve the property vector + gate set via the class-map resolver exports.
  const prop = doctrine.classMap.properties.find((p) => p.domain === issue.site);
  let gateIds = new Set();
  let resolutionNote = "";
  if (!prop) {
    errors.push(`issue ${issue.id ?? "?"}: site "${issue.site}" has no properties: row in ${CLASS_MAP_PATH} — the vector cannot resolve; add the property first`);
  } else {
    if (issue.class && prop.site_class !== issue.class) {
      errors.push(`issue ${issue.id}: class "${issue.class}" contradicts class-map site_class "${prop.site_class}" for ${issue.site}`);
    }
    const vector = Object.fromEntries(PROPERTY_DIMS.map((d) => [d, prop[d]]));
    if (issue.scope === "change") {
      const change = { paths: issue.spec_change_paths ?? [], kinds: issue.spec_change_kinds ?? [] };
      const r = resolveChangeGates(vector, change, doctrine.classMap, doctrine.reg);
      errors.push(...r.errors);
      gateIds = r.gates;
      resolutionNote = r.failClosed
        ? `scope=change · FAIL-CLOSED (${r.failClosed}): full battery — unknown classification never buys a subset`
        : `scope=change · triggers:[${r.matched.join(", ") || "none (content-only floor)"}]`;
    } else {
      const r = resolveVector(vector, issue.id ?? "issue", doctrine.reg, doctrine.classMap.overlays);
      errors.push(...r.errors);
      gateIds = r.gates;
      resolutionNote = "scope=project · full composed battery (registry floor + overlay adds)";
    }
  }

  // Split agent-runnable gates from human gates; attach tool refs + radar.
  const regById = new Map(doctrine.reg.gates.map((g) => [g.id, g]));
  const radarByStep = new Map((doctrine.radar?.rows ?? []).map((r) => [r.step, r.current_tool]));
  const authorized_tools = [];
  const human_gates = [];
  for (const id of [...gateIds].sort()) {
    const g = regById.get(id);
    const ref = g?.script_or_agent_ref ?? "PENDING-SIBLING (registry row lands with its milestone)";
    const radarTool = radarByStep.get(id);
    const radarSuffix = radarTool ? ` · radar:${radarTool}` : "";
    if (g?.run === "human") human_gates.push(`gate:${id} · ${ref} · run:human — the agent prepares; a named human executes`);
    else authorized_tools.push(`gate:${id} · ${ref}${radarSuffix}`);
  }
  // DEFAULT-DENY BOUNDARY: every requested action must match a declared kind
  // in the risk-tiers actions: vocabulary. Unknown ⇒ treated as T1 ⇒ refused
  // ("unknown action is forever-human until the owner tiers it"); declared T1
  // ⇒ refused by tier. Known sub-T1 kinds are annotated with their tier so
  // the envelope records the tiering decision it rode on.
  const requestedKinds = issue.spec_requested_tools ?? [];
  errors.push(...vetRequestedActions(requestedKinds, doctrine.riskTiers).map((e) => `issue ${issue.id ?? "?"}: ${e}`));
  const vocabByKind = new Map((doctrine.riskTiers.actions ?? []).map((a) => [String(a.kind).trim().toLowerCase(), a]));
  for (const t of requestedKinds) {
    const row = vocabByKind.get(String(t).trim().toLowerCase());
    if (row && row.tier !== T1_TIER) authorized_tools.push(`requested:${t} · tier:${row.tier}`);
  }

  // SECOND NET (defense in depth, never the boundary): T1 keyword scan on the
  // raw requested surface — vocabulary membership does not exempt an entry
  // from the match_tokens tripwire. Registry gate ids are verification steps;
  // run:human rows are already excluded from the agent lane.
  const requestedSurface = requestedKinds.map((t) => `requested:${t}`);
  for (const hit of scanT1(requestedSurface, doctrine.riskTiers)) {
    errors.push(`issue ${issue.id ?? "?"}: authorized surface entry "${hit.entry}" matches T1 forever-human action "${hit.action}" (${RISK_TIERS_PATH}) — a spec authorizing a T1 action is REFUSED`);
  }

  const radarBinding = doctrine.radar
    ? `evolution/radar.yaml loaded (${doctrine.radar.rows.length} rows) — per-step current_tool attached where a row names the gate id`
    : "DORMANT (strict-residues.yaml: evolution/radar.yaml, M2 sibling) — per-step current_tool wiring activates the moment the radar lands (CLAUDE.md §OS v2 DOCTRINE 10 activation semantics); the M4 pilot verifies the declared capability fired. Until then this envelope's authorized_tools carry the registry refs alone.";

  if (errors.length > 0) return { envelope: null, errors };

  const generatedAt = now ?? nowIst();
  const envelope = {
    version: 1,
    issue: issueRef,
    issue_row_hash: `sha256:${sha256((issue.__raw ?? []).join("\n"))}`,
    generated_at: generatedAt,
    generated_at_utc: istToUtc(generatedAt) ?? "INVALID-IST-TIMESTAMP",
    generator: "scripts/job-spec-generate.mjs",
    scope: issue.scope,
    site: issue.site,
    site_class: issue.class,
    entity: issue.entity ?? "unknown",
    locales: issue.locales ?? [],
    severity: issue.severity,
    intent: issue.spec_intent,
    input_artifacts: (issue.evidence_refs ?? []).map((e) => `${e} · freshness:cited-in-issue-row`),
    authorized_tools,
    human_gates,
    gate_resolution: resolutionNote,
    radar_binding: radarBinding,
    prohibited_actions: generateProhibitions(doctrine),
    retry_max_attempts: issue.retry_max_attempts ?? "1",
    timeout_minutes: issue.timeout_minutes ?? "60",
    cost_budget: issue.cost_budget,
    output_schema: issue.spec_output_schema,
    gate: issue.gate_subset_ref,
    approver: `${issue.approvals_ref} · tier per ${RISK_TIERS_PATH} (release approval; P0/P1 evidence never self-approved)`,
    definition_of_done: issue.definition_of_done,
    builder_session: builderSession,
    verifier_session: verifierSession,
    monitoring_ref: issue.monitoring_ref ?? "",
    closure_grep: issue.closure_grep ?? "",
  };
  return { envelope, errors: [] };
}

/* ────────────────── envelope serialize / parse ────────────────── */

const ENV_KEY_ORDER = [
  "version", "issue", "issue_row_hash", "generated_at", "generated_at_utc", "generator",
  "scope", "site", "site_class", "entity", "locales", "severity", "intent",
  "input_artifacts", "authorized_tools", "human_gates", "gate_resolution", "radar_binding",
  "prohibited_actions", "retry_max_attempts", "timeout_minutes", "cost_budget",
  "output_schema", "gate", "approver", "definition_of_done",
  "builder_session", "verifier_session", "monitoring_ref", "closure_grep",
];

const q = (s) => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

/** Inverse of q(): strip surrounding double quotes and unescape \" and \\. */
const unq = (v) => {
  const t = String(v).trim();
  if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1).replace(/\\(["\\])/g, "$1");
  return unquote(t);
};

export function serializeEnvelope(env) {
  const lines = ["# GENERATED by scripts/job-spec-generate.mjs — do not hand-edit; regenerate from the issue row.", "job_spec:"];
  for (const k of ENV_KEY_ORDER) {
    const v = env[k];
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      lines.push(`  ${k}:${v.length === 0 ? " []" : ""}`);
      for (const item of v) lines.push(`    - ${q(item)}`);
    } else if (v !== null && typeof v === "object") {
      lines.push(`  ${k}:`);
      for (const [sk, sv] of Object.entries(v)) lines.push(`    ${sk}: ${sv}`);
    } else if (k === "version" || k === "retry_max_attempts" || k === "timeout_minutes") {
      lines.push(`  ${k}: ${v}`);
    } else {
      lines.push(`  ${k}: ${q(v)}`);
    }
  }
  return lines.join("\n") + "\n";
}

export function parseEnvelope(text) {
  const errors = [];
  const env = {};
  let key = null;   // open block key
  let kind = null;  // "list" | "map" | null
  let sawRoot = false;
  String(text).split(/\r?\n/).forEach((raw, idx) => {
    const ln = idx + 1;
    const line = raw.replace(/\s+$/, "");
    if (line === "" || /^\s*#/.test(line)) return;
    let m;
    if (/^job_spec:\s*$/.test(line)) { sawRoot = true; return; }
    if (!sawRoot) { errors.push(`envelope line ${ln}: content before job_spec: root`); return; }
    if ((m = line.match(/^  ([a-z_]+):\s*\[\]\s*$/))) { env[m[1]] = []; key = null; return; }
    if ((m = line.match(/^  ([a-z_]+):\s*$/))) { key = m[1]; kind = null; return; }
    if ((m = line.match(/^  ([a-z_]+):\s*(.+)$/))) { env[m[1]] = unq(m[2]); key = null; return; }
    if (key && (m = line.match(/^    - (.+)$/))) {
      if (kind === "map") { errors.push(`envelope line ${ln}: block "${key}" mixes list and map`); return; }
      kind = "list"; (env[key] ??= []).push(unq(m[1])); return;
    }
    if (key && (m = line.match(/^    ([a-z_]+):\s*(.+)$/))) {
      if (kind === "list") { errors.push(`envelope line ${ln}: block "${key}" mixes map and list`); return; }
      kind = "map"; (env[key] ??= {})[m[1]] = unq(m[2]); return;
    }
    errors.push(`envelope line ${ln}: unparseable line: ${line.trim()}`);
  });
  if (!sawRoot) errors.push("envelope: no job_spec: root found");
  return { env, errors };
}

/* ────────────────── validation (--check) ────────────────── */

/** Truncated JSON view of a value for drift messages. */
const short = (v) => {
  const s = v === undefined ? "(absent)" : JSON.stringify(v);
  return s.length > 140 ? s.slice(0, 140) + "…" : s;
};

/** Serialize a single envelope field to its canonical fragment (normalizes
 * parsed-string vs generated-number differences via the one serializer). */
const fieldFragment = (k, v) => serializeEnvelope(v === undefined ? {} : { [k]: v });

/**
 * Validate an envelope against its issue row + CURRENT doctrine.
 *
 * --check IS CANONICAL REGENERATION, not inspection: when the issue row is
 * available, the envelope is REBUILT from that row + current doctrine
 * (builder/verifier/generated_at taken from the envelope — the only
 * legitimate non-row inputs) and EVERY generated field is deep-compared:
 * tools, gates, prohibitions, site/entity/locales, approver, DoD, closure
 * grep, all of it. Any drift fails. An absent issue_row_hash fails. The
 * standalone detectors below (budget, EX-3, superset, vocabulary, T1 net,
 * smuggling) still run as defense in depth — a specific edit gets a specific
 * refusal message alongside the drift finding.
 */
export function validateEnvelope(env, { issue, doctrine }) {
  const errors = [];

  // Budget: required, positive.
  const b = env.cost_budget;
  const pos = (v) => v !== undefined && Number.isFinite(Number(v)) && Number(v) > 0;
  if (!b || typeof b !== "object" || (!pos(b.tokens_max) && !pos(b.usd_max))) {
    errors.push("envelope: cost_budget missing or empty — a spec without a budget is REFUSED (no default)");
  }

  // EX-3.
  if (!env.builder_session || !env.verifier_session) {
    errors.push("envelope: builder_session and verifier_session both required (EX-3)");
  } else if (env.builder_session === env.verifier_session) {
    errors.push(`envelope: builder_session == verifier_session ("${env.builder_session}") — EX-3 verifier separation; REFUSED`);
  }

  // Superset property (can NEVER be narrower).
  const required = generateProhibitions(doctrine).map(prohibitionId);
  const have = new Set((env.prohibited_actions ?? []).map(prohibitionId));
  for (const id of required) {
    if (!have.has(id)) errors.push(`envelope: prohibited_actions is NARROWER than doctrine — missing "${id}"; the envelope can never be narrower than HARD GATES + registry blockers + T1 (regenerate it)`);
  }

  // DEFAULT-DENY vocabulary vet on the requested surface (the boundary),
  // then the T1 keyword scan (the second net), then human-gate smuggling.
  const authorized = env.authorized_tools ?? [];
  const requested = authorized.filter((e) => String(e).startsWith("requested:"));
  const requestedKinds = requested.map((e) => String(e).slice("requested:".length).split(" · ")[0].trim());
  errors.push(...vetRequestedActions(requestedKinds, doctrine.riskTiers).map((e) => `envelope: ${e}`));
  for (const hit of scanT1(requested, doctrine.riskTiers)) {
    errors.push(`envelope: authorized entry "${hit.entry}" matches T1 forever-human action "${hit.action}" — REFUSED`);
  }
  const regById = new Map(doctrine.reg.gates.map((g) => [g.id, g]));
  for (const e of authorized) {
    const m = String(e).match(/^gate:([a-z0-9-]+)/);
    if (m && regById.get(m[1])?.run === "human") {
      errors.push(`envelope: run:human gate "${m[1]}" smuggled into authorized_tools — human gates belong under human_gates; the agent prepares, humans execute; REFUSED`);
    }
  }

  // Issue-row binding: the hash is REQUIRED — deleting it is not passing.
  if (!env.issue_row_hash) {
    errors.push("envelope: issue_row_hash ABSENT — an envelope not bound to its issue row proves nothing (deleting the hash is not passing the check); regenerate; REFUSED");
  }
  if (issue) {
    if (env.scope !== issue.scope) errors.push(`envelope: scope "${env.scope}" != issue scope "${issue.scope}"`);
    if (issue.id && String(env.issue ?? "").split("#").pop() !== issue.id) {
      errors.push(`envelope: issue ref "${env.issue}" does not end in issue id "${issue.id}"`);
    }
    const rowHash = `sha256:${sha256((issue.__raw ?? []).join("\n"))}`;
    if (env.issue_row_hash && env.issue_row_hash !== rowHash) {
      errors.push(`envelope: issue_row_hash ${env.issue_row_hash} != current row hash ${rowHash} — the row changed after generation; regenerate (corrections = a new envelope, never a stale one)`);
    }

    // CANONICAL REGENERATION: rebuild the envelope from the row + CURRENT
    // doctrine and deep-compare every generated field. A hand-edited
    // envelope — a removed gate, a widened tool list, a rewritten approver,
    // a trimmed closure grep — cannot survive this: --check passes only when
    // the envelope is byte-equivalent to what its row generates today.
    const regen = generateEnvelope({
      issue, issueRef: env.issue, doctrine,
      builder: env.builder_session, verifier: env.verifier_session,
      now: env.generated_at,
    });
    if (regen.errors.length > 0) {
      for (const e of regen.errors) {
        errors.push(`envelope: canonical regeneration from the issue row REFUSED (${e}) — an envelope cannot stand on a row that would be refused today`);
      }
    } else {
      const known = new Set(ENV_KEY_ORDER);
      for (const k of Object.keys(env)) {
        if (!known.has(k)) errors.push(`envelope: unknown field "${k}" — not a generated field; hand additions are drift; REFUSED`);
      }
      for (const k of ENV_KEY_ORDER) {
        if (fieldFragment(k, env[k]) !== fieldFragment(k, regen.envelope[k])) {
          errors.push(`envelope: field "${k}" DRIFTED from canonical regeneration — envelope has ${short(env[k])}, but the issue row + current doctrine generate ${short(regen.envelope[k])}; a hand-edited envelope no longer represents its row (regenerate)`);
        }
      }
    }
  }
  return errors;
}

/* ────────────────── CLI ────────────────── */

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--fixture") args.fixture = true;
    else if (a.startsWith("--")) { args[a.slice(2)] = argv[i + 1]; i++; }
    else args._.push(a);
  }
  return args;
}

function loadIssue(ref, root) {
  if (String(ref).startsWith("fixture:")) {
    const parsed = parseIssuesFile(FIXTURE_ISSUE);
    return { issue: parsed.issues.find((i) => i.id === FIXTURE_ISSUE_ID), errors: parsed.errors, ref: FIXTURE_ISSUE_REF };
  }
  const [file, id] = String(ref).split("#");
  if (!file || !id) return { issue: null, errors: [`--issue must be <file>#<id>, got: ${ref}`], ref };
  const abs = resolve(root, file);
  if (!existsSync(abs)) return { issue: null, errors: [`issue file not found: ${file}`], ref };
  const parsed = parseIssuesFile(readFileSync(abs, "utf8"));
  const issue = parsed.issues.find((i) => i.id === id);
  return { issue, errors: issue ? parsed.errors : [...parsed.errors, `issue "${id}" not found in ${file}`], ref };
}

function main(argv) {
  const args = parseArgs(argv);
  const fail = (msgs) => {
    for (const e of msgs) console.error(`REFUSED · ${e}`);
    process.exit(1);
  };

  const doctrine = loadDoctrine({});
  if (doctrine.errors.length > 0) fail(doctrine.errors);

  if (args.check) {
    const abs = resolve(REPO_ROOT, args.check);
    if (!existsSync(abs)) fail([`envelope not found: ${args.check}`]);
    const { env, errors: parseErrs } = parseEnvelope(readFileSync(abs, "utf8"));
    if (parseErrs.length > 0) fail(parseErrs);
    const ref = args.issue ?? env.issue ?? "";
    const { issue, errors: issueErrs } = loadIssue(ref, REPO_ROOT);
    if (!issue) fail(issueErrs);
    const errors = validateEnvelope(env, { issue, doctrine });
    if (errors.length > 0) fail(errors);
    console.log(`OK · envelope ${args.check} CANONICALLY REGENERATES from ${ref} + current doctrine — every generated field matches (drift, superset, budget, EX-3, vocabulary default-deny, T1 net, floor all hold)`);
    return;
  }

  const ref = args.fixture ? FIXTURE_ISSUE_REF : args.issue;
  if (!ref) fail(["nothing to do: pass --issue <file>#<id>, --fixture, or --check <envelope>"]);
  const { issue, errors: issueErrs } = loadIssue(ref, REPO_ROOT);
  if (!issue) fail(issueErrs);

  const { envelope, errors } = generateEnvelope({
    issue, issueRef: ref, doctrine,
    builder: args.builder, verifier: args.verifier, now: args.now,
  });
  if (errors.length > 0) fail(errors);

  const text = serializeEnvelope(envelope);
  const post = validateEnvelope(parseEnvelope(text).env, { issue, doctrine });
  if (post.length > 0) fail(post.map((e) => `self-check: ${e}`));

  if (args.out) {
    writeFileSync(resolve(REPO_ROOT, args.out), text);
    console.log(`WROTE ${args.out} (envelope for ${issue.id}; ${envelope.authorized_tools.length} authorized tools, ${envelope.human_gates.length} human gates, ${envelope.prohibited_actions.length} prohibitions)`);
  } else {
    process.stdout.write(text);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
