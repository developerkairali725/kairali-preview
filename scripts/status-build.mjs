#!/usr/bin/env node
// status-build.mjs — compile STATUS.yaml (source of truth) + the repo's own
// machine ledgers into the schema-2 dashboard snapshot that sites/kairali.ai
// renders. Dependency-free on purpose: the dashboard page must import plain
// JSON and carry no runtime YAML parser.
//
// Run after every edit to STATUS.yaml (CLAUDE.md session-end rule):
//   node scripts/status-build.mjs
//
// SCHEMA 2 (fixed contract, feature/fleet-pulse-v2):
//   { schema: 2, generated, generated_utc, os: {...}, sites: [...] }
// Every field is MACHINE-DERIVED from a named repo source; a fact that cannot
// be derived renders as its honest absence (null / [] / 0-entries-in-ledger),
// never a guess (HARD GATE 6).
//
// SOURCES (all read-only):
//   STATUS.yaml                                   -> base site rows
//   gates/class-map.yaml properties               -> per-site vector
//   launches/<domain>/approvals.yaml              -> front_gates (parseApprovals
//                                                    reused from front-gate.mjs)
//   launches/<domain>/{go-science,beauty,design-review[,/post-build]}/*.md,
//   launches/<domain>/*audit*.md + audits/ files whose site token matches the
//                                  domain (full / stem / alias — see
//                                  auditFileMatchesDomain),
//   launches/<domain>/sitewide-checklist.md       -> evidence counts
//   docs/process/os-2026/merge/strict-residues.yaml, DIRECTIVES.md,
//   QUESTIONS.md, decisions/index.json            -> os counters
//
// The YAML parsers are intentionally minimal — they handle exactly the shapes
// these files use (flat maps + lists of flat objects), not arbitrary YAML.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseApprovals, VALID_STATUS } from './front-gate.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const SRC = resolve(ROOT, 'STATUS.yaml');
const OUT = resolve(ROOT, 'sites/kairali.ai/app/status-data.json');

export const STAGES = [
  'ideation', 'research', 'build', 'gates', 'preview',
  'human_audit', 'ok_to_publish', 'live', 'monitoring',
];

// ── phase derivation (stage stays the PRIMARY fact; phase is derived DISPLAY
//    info mapping the STATUS.yaml stage enum onto the OS v2 lifecycle 0-8) ──
// ideation       -> 0 (Classify & charter)
// research       -> 1 (Baseline & discovery; research honestly spans phases
//                     1-2 (discovery -> diagnose) — we render the LOWER bound,
//                     never claiming more progress than the stage can derive)
// build          -> 4 (Build, controlled)
// gates          -> 5 (Pre-launch QA battery)
// preview        -> 5 (Pre-launch QA: preview is the battery's viewing state)
// human_audit    -> 5 (Pre-launch QA: the human leg of the same phase)
// ok_to_publish  -> 6 (Launch command centre — awaiting the human flip)
// live           -> 7 (Stabilize & verify)
// monitoring     -> 8 (Monitor & improve)
// anything else  -> null (unknown is rendered as unknown)
const STAGE_TO_PHASE = {
  ideation: 0, research: 1, build: 4, gates: 5, preview: 5,
  human_audit: 5, ok_to_publish: 6, live: 7, monitoring: 8,
};
export function stageToPhase(stage) {
  return Object.hasOwn(STAGE_TO_PHASE, stage) ? STAGE_TO_PHASE[stage] : null;
}

// ── milestone board (HAND-MAINTAINED per build — the one editorial constant;
//    updated this build to: M0 done · M1 merged · M2 merged a220f82 ·
//    M3 next · M4 pilot pending) ──────────────────────────────────────────────
export const MILESTONES = {
  milestone: 'M0 done · M1 merged · M2 MERGED (a220f82) · M3 next · M4 pilot pending',
  milestones: [
    { id: 'M0', label: 'Continuity proof (dry-run + merge-continuity + acceptance harness)', state: 'done' },
    { id: 'M1', label: 'Doctrine merge (CLAUDE.md v2 + class-map + registry + strict flips)', state: 'done' },
    { id: 'M2', label: 'Mechanisms (evidence-manifest, decisions store, job-spec generator)', state: 'done' },
    { id: 'M3', label: 'Tools + data (DataForSEO, seo-baseline)', state: 'next' },
    { id: 'M4', label: 'Pilot — theblushlounge.com', state: 'pending' },
  ],
};

// ── waiting_on: the FIXED name list (CLAUDE.md two-Deepus law respected:
//    "Dr. Deepu John" is matched first and his matches are removed from the
//    text before "Deepu" (the web developer) is scanned — never conflated) ──
export const WAITING_NAMES = [
  'Abilash', 'owner', 'Sunaj', 'Vikash', 'Satyam', 'Deepu', 'Dr. Deepu John',
  'Astha', 'Anupam', 'Ambuj', 'Shadab', 'Gaurav', 'Abhishek', 'Eeshal',
];
const DR_DEEPU_RE = /\bdr\.?\s+deepu\s+john\b/gi;
export function waitingOn(blocker) {
  if (!blocker || typeof blocker !== 'string') return [];
  const out = [];
  const withoutDrDeepu = blocker.replace(DR_DEEPU_RE, ' ');
  for (const name of WAITING_NAMES) {
    if (name === 'Dr. Deepu John') {
      DR_DEEPU_RE.lastIndex = 0;
      if (DR_DEEPU_RE.test(blocker)) out.push(name);
    } else {
      const haystack = name === 'Deepu' ? withoutDrDeepu : blocker;
      if (new RegExp(`\\b${name}\\b`, 'i').test(haystack)) out.push(name);
    }
  }
  return out;
}

// ── STATUS.yaml parser (unchanged contract from v1: top-level map + lists of
//    flat objects; a typo'd shape fails loudly downstream, never silently) ──
export function parseScalar(raw) {
  const s = raw.trim();
  if (s === '' || s === 'null' || s === '~') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

export function parseStatusYaml(text) {
  const root = {};
  let section = null;
  let sectionType = null; // 'map' | 'list'
  let curObj = null;
  const kv = /^([A-Za-z0-9_]+):\s*(.*)$/;

  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (t === '' || t.startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;

    if (indent === 0) {
      const m = t.match(kv);
      if (!m) continue;
      if (m[2] === '') { section = m[1]; sectionType = null; curObj = null; root[section] = null; }
      else { root[m[1]] = parseScalar(m[2]); section = null; }
      continue;
    }
    if (!section) continue;

    if (t.startsWith('- ')) {
      if (sectionType !== 'list') { root[section] = []; sectionType = 'list'; }
      curObj = {};
      root[section].push(curObj);
      const m = t.slice(2).trim().match(kv);
      if (m) curObj[m[1]] = parseScalar(m[2]);
      continue;
    }

    const m = t.match(kv);
    if (!m) continue;
    if (sectionType === 'list' && curObj) {
      curObj[m[1]] = parseScalar(m[2]);
    } else {
      if (sectionType !== 'map') { root[section] = {}; sectionType = 'map'; }
      root[section][m[1]] = parseScalar(m[2]);
    }
  }
  return root;
}

// ── domain derivation from a STATUS.yaml compound site name ──────────────────
// "kairaliorganic.com / kairorganics.com / kairproducts.com" -> kairaliorganic.com
// "ayurvedichealingvillage.com (KTAHV)"                      -> ayurvedichealingvillage.com
export function siteDomain(name) {
  return String(name).split(' / ')[0].trim().split(/\s+/)[0];
}

// ── gates/class-map.yaml properties parser -> vector per domain ──────────────
// Reads ONLY the top-level `properties:` block (list of flat `- domain:` rows);
// trailing `# …` comments on value lines are stripped. The output vector keeps
// exactly the contract's five keys (locale_market/scope stay internal to the
// class-map — the contract does not carry them).
const VECTOR_KEYS = ['site_class', 'business_model', 'asset_situation', 'entity_register', 'platform'];
export function parseClassMapProperties(text) {
  const props = new Map();
  let inProps = false;
  let cur = null;
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (t === '' || t.startsWith('#')) continue;
    if (/^[A-Za-z_]+:/.test(line)) { // a new top-level key
      inProps = /^properties:\s*(#.*)?$/.test(line);
      cur = null;
      continue;
    }
    if (!inProps) continue;
    let m;
    if ((m = t.match(/^-\s+domain:\s*(\S+)/))) {
      cur = { domain: m[1] };
      props.set(m[1], cur);
      continue;
    }
    if (cur && (m = t.match(/^([a-z_]+):\s*(.*)$/))) {
      cur[m[1]] = m[2].replace(/\s+#.*$/, '').trim();
    }
  }
  return props;
}

export function vectorFor(props, domain) {
  const row = props.get(domain);
  if (!row) return null;
  const v = {};
  for (const k of VECTOR_KEYS) v[k] = row[k] ?? null;
  return v;
}

// ── front gates from launches/<domain>/approvals.yaml ────────────────────────
// No ledger file -> [] (the gate is UNARMED for pre-2D sites — front-gate.mjs
// prints that loudly; here the empty list is the same honest absence).
// A row whose status is outside the ledger's strict enum renders "none".
export function frontGatesFromLedger(text) {
  if (text === null || text === undefined) return [];
  const { rows } = parseApprovals(text);
  return rows.map((r) => ({
    gate: r.gate,
    status: VALID_STATUS.includes(r.status) ? r.status : 'none',
  }));
}

// ── evidence counts (plain file counts — the dashboard shows how much
//    evidence EXISTS, it never judges it) ────────────────────────────────────
// audits/ filenames name their site three ways in practice:
//   full domain          kairali.com-2026-07-16.md
//   hyphenated domain    kairali-guru-2026-07-16.md, kairaliproducts-in-2026-07-16.md
//   bare stem (no TLD)   kairalicenters-2026-07-16.md, villaraag-2026-07-16.md
// The old `f.startsWith(domain)` saw only the first form and rendered real
// committed audits as "audits 0" — a wrong value on the board (HARD GATE 6).
// The site token is everything before the first YYYY-MM-DD segment (the whole
// basename when undated); it matches a domain when, dot/hyphen-normalized, it
// EQUALS the full domain, the domain's stem (first label, i.e. name minus TLD),
// or a declared alias. Token EQUALITY, never prefix: stem "kairali" must not
// swallow kairali-guru-*.md — the undercount fix may not become an overcount.
export const AUDIT_DOMAIN_ALIASES = {
  // audits/arogyashala.co.in-* predates STATUS.yaml settling on arogyashala.in
  'arogyashala.in': ['arogyashala.co.in'],
};
const normDomainToken = (s) => s.toLowerCase().replace(/[.\-]+/g, '-');
export function auditFileMatchesDomain(filename, domain) {
  const base = filename.replace(/\.md$/i, '');
  const dated = base.match(/^(.*?)-\d{4}-\d{2}-\d{2}(?:-|$)/);
  const token = normDomainToken(dated ? dated[1] : base);
  if (!token) return false;
  const candidates = [
    domain,
    domain.split('.')[0],
    ...(AUDIT_DOMAIN_ALIASES[domain] ?? []),
  ];
  return candidates.some((c) => normDomainToken(c) === token);
}

function countMd(dir, match = null) {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    if (match && !match(f)) continue;
    if (statSync(join(dir, f)).isFile()) n++;
  }
  return n;
}

export function evidenceFor(root, domain) {
  const launch = join(root, 'launches', domain);
  return {
    go_science: countMd(join(launch, 'go-science')),
    beauty: countMd(join(launch, 'beauty')),
    // design-review/*.md is counted NON-recursively, so post-build/ is
    // excluded by construction and counted separately below.
    design_review_pre: countMd(join(launch, 'design-review')),
    design_review_post: countMd(join(launch, 'design-review', 'post-build')),
    audits:
      countMd(launch, (f) => f.includes('audit')) +
      countMd(join(root, 'audits'), (f) => auditFileMatchesDomain(f, domain)),
    checklists: existsSync(join(launch, 'sitewide-checklist.md')),
  };
}

// ── os counters (each one names its source + its honest approximation) ──────
export function countStrictResidues(text) {
  // path entries in docs/process/os-2026/merge/strict-residues.yaml
  return (text.match(/^\s*- path:\s*\S/gm) || []).length;
}
export function countUnackedDirectives(text) {
  // unticked "- [ ]" checkboxes in DIRECTIVES.md (the capture script's format)
  return (text.match(/^\s*- \[ \]/gm) || []).length;
}
export function countOpenQuestions(text) {
  // HONEST APPROXIMATION: every "## " header in QUESTIONS.md counts as one
  // open question. The file is append-only and resolved questions keep their
  // headers with a resolution note, so this is an upper bound on truly-open
  // items — a header count, loudly named as such, not a state machine.
  return (text.match(/^## /gm) || []).length;
}
export function countDecisions(json) {
  // entries in decisions/index.json (the M2 decisions store —
  // docs/process/os-2026/merge/strict-residues.yaml row CM-073/CM-076).
  // Until M2 lands the file does not exist: 0 entries in the machine ledger
  // is the machine truth (DECISIONS.md prose is NOT counted — no ledger,
  // no number; HARD GATE 6).
  if (json === null || json === undefined) return 0;
  let parsed;
  try { parsed = JSON.parse(json); } catch { return 0; }
  if (Array.isArray(parsed)) return parsed.length;
  if (parsed && Array.isArray(parsed.decisions)) return parsed.decisions.length;
  if (parsed && typeof parsed === 'object') return Object.keys(parsed).length;
  return 0;
}

// ── timestamps (IST = UTC+05:30, no DST; second precision per CLAUDE.md) ────
export function timestamps(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const ist = new Date(now.getTime() + 330 * 60000);
  const generated =
    `${ist.getUTCFullYear()}-${pad(ist.getUTCMonth() + 1)}-${pad(ist.getUTCDate())} ` +
    `${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}:${pad(ist.getUTCSeconds())} IST`;
  const generated_utc = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
  return { generated, generated_utc };
}

// ── snapshot assembly (pure — every IO input arrives as an argument) ─────────
export function buildSnapshot({
  status, classMapText, ledgers, evidence,
  strictResiduesText = '', directivesText = '', questionsText = '',
  decisionsIndexJson = null, now = new Date(),
}) {
  const props = parseClassMapProperties(classMapText || '');
  const { generated, generated_utc } = timestamps(now);

  const sites = (status.sites || []).map((s) => {
    const domain = siteDomain(s.name);
    return {
      name: s.name,
      entity: s.entity ?? null,
      stage: s.stage,
      phase: stageToPhase(s.stage),
      owner: s.owner ?? null,
      blocker: s.blocker ?? null,
      updated: s.updated ?? null,
      preview_url: s.preview_url ?? null,
      live_url: s.live_url ?? null,
      vector: vectorFor(props, domain),
      front_gates: frontGatesFromLedger(ledgers?.[domain] ?? null),
      evidence: evidence[domain],
      waiting_on: waitingOn(s.blocker),
    };
  });

  return {
    schema: 2,
    generated,
    generated_utc,
    os: {
      milestone: MILESTONES.milestone,
      milestones: MILESTONES.milestones,
      strict_residues: countStrictResidues(strictResiduesText),
      unacked_directives: countUnackedDirectives(directivesText),
      open_questions: countOpenQuestions(questionsText),
      decisions: countDecisions(decisionsIndexJson),
      // tests: no per-run test-count ledger exists yet (nothing machine-readable
      // records pass/total). null = honest absence, never an invented number
      // (HARD GATE 6). Fill from a real ledger once one exists.
      tests: null,
    },
    sites,
  };
}

// ── validations carried over from v1 (a typo fails loudly, never silently) ──
export function validate(status) {
  const errors = [];
  const badStage = (status.sites || []).filter((s) => !STAGES.includes(s.stage));
  if (badStage.length) {
    errors.push(
      `invalid stage(s): ${badStage.map((s) => `${s.name}=${s.stage}`).join(', ')} — valid: ${STAGES.join(' | ')}`,
    );
  }
  // preview_url / live_url hold REAL, verified URLs or null, never guesses
  // (HARD GATE 6) — require https on non-null values.
  for (const s of status.sites || []) {
    for (const f of ['preview_url', 'live_url']) {
      if (s[f] === undefined) s[f] = null;
      if (s[f] !== null && !/^https:\/\/[^\s"']+$/.test(String(s[f]))) {
        errors.push(`invalid URL (must be https://… or null): ${s.name}.${f}=${s[f]}`);
      }
    }
  }
  return errors;
}

function readIf(p) {
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

function main() {
  const status = parseStatusYaml(readFileSync(SRC, 'utf8'));
  const errors = validate(status);
  if (errors.length) {
    for (const e of errors) console.error(`status-build: ${e}`);
    process.exit(1);
  }

  const ledgers = {};
  const evidence = {};
  for (const s of status.sites || []) {
    const domain = siteDomain(s.name);
    ledgers[domain] = readIf(join(ROOT, 'launches', domain, 'approvals.yaml'));
    evidence[domain] = evidenceFor(ROOT, domain);
  }

  const snapshot = buildSnapshot({
    status,
    classMapText: readIf(join(ROOT, 'gates/class-map.yaml')) || '',
    ledgers,
    evidence,
    strictResiduesText: readIf(join(ROOT, 'docs/process/os-2026/merge/strict-residues.yaml')) || '',
    directivesText: readIf(join(ROOT, 'DIRECTIVES.md')) || '',
    questionsText: readIf(join(ROOT, 'QUESTIONS.md')) || '',
    decisionsIndexJson: readIf(join(ROOT, 'decisions/index.json')),
  });

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n');
  const armed = snapshot.sites.filter((x) => x.front_gates.length > 0).length;
  console.log(
    `status-build: schema 2 · ${snapshot.sites.length} sites (${armed} front-gate armed) · ` +
    `os: ${snapshot.os.strict_residues} residues / ${snapshot.os.unacked_directives} unacked / ` +
    `${snapshot.os.open_questions} questions / ${snapshot.os.decisions} decisions -> ${OUT.replace(ROOT + '/', '')}`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
