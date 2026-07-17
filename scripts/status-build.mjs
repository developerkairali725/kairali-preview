#!/usr/bin/env node
// status-build.mjs — compile STATUS.yaml (source of truth) into the dashboard
// snapshot that sites/kairali.ai renders. Dependency-free on purpose: the
// dashboard page must import plain JSON and carry no runtime YAML parser.
//
// Run after every edit to STATUS.yaml (CLAUDE.md session-end rule):
//   node scripts/status-build.mjs
//
// The parser is intentionally minimal — it handles exactly the STATUS.yaml
// shape (top-level map + two lists of flat objects), not arbitrary YAML.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const SRC = resolve(ROOT, 'STATUS.yaml');
const OUT = resolve(ROOT, 'sites/kairali.ai/app/status-data.json');

const STAGES = [
  'ideation', 'research', 'build', 'gates', 'preview',
  'human_audit', 'ok_to_publish', 'live', 'monitoring',
];

function parseScalar(raw) {
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

function parse(text) {
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

const data = parse(readFileSync(SRC, 'utf8'));

// Validate stage values so a typo in STATUS.yaml fails loudly, not silently.
const bad = (data.sites || []).filter((s) => !STAGES.includes(s.stage));
if (bad.length) {
  console.error('status-build: invalid stage(s):', bad.map((s) => `${s.name}=${s.stage}`).join(', '));
  console.error('valid stages:', STAGES.join(' | '));
  process.exit(1);
}

// Stage tallies for the site view header.
const stageCounts = {};
for (const st of STAGES) stageCounts[st] = 0;
for (const s of data.sites || []) stageCounts[s.stage]++;

const snapshot = {
  meta: data.meta || {},
  generatedFrom: (data.meta && data.meta.updated) || null,
  stageOrder: STAGES,
  stageCounts,
  workstreams: data.workstreams || [],
  sites: data.sites || [],
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n');
console.log(
  `status-build: ${snapshot.workstreams.length} workstreams, ${snapshot.sites.length} sites -> ${OUT.replace(ROOT + '/', '')}`
);
