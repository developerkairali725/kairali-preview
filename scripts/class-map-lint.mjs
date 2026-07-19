#!/usr/bin/env node
/**
 * class-map-lint.mjs — the composition proof for gates/class-map.yaml.
 *
 * WHY THIS EXISTS. Merge plan §2.2 (amended per external review §12) makes gate
 * applicability POLICY COMPOSITION across declared dimensions instead of
 * class-only, and the review's condition was explicit: "the lint verifies every
 * dimension combination used by a real Kairali property resolves to an
 * unambiguous gate set, and the 24 package workflows are test vectors. The
 * selector never SILENTLY drives anything." The dimension list is the plan's
 * list COMPLETE — business model, asset situation, entity register,
 * locale/market (locale_market), platform — a plan-named dimension may not be
 * silently dropped. M0(a) disposition 3 adds the
 * scope dimension (project | change): the full battery binds per project
 * engagement + scheduled sweeps; changes ride the declared diff-relevant
 * subset. Gates are not weakened; their BINDING SCOPE is declared, linted,
 * and owner-visible. This lint makes all of that machine-checked:
 *
 *   1. the class-map parses (narrow grammar — an unparseable line is a
 *      finding, never a skip; front-gate.mjs stance, no yaml dependency);
 *   2. every dimension value used (properties, overlays, test vectors) is
 *      declared in `dimensions:`; site_class MIRRORS the registry's classes
 *      line exactly (extend together, never drift);
 *   3. every gate id referenced (adds/adapts/scope_map) exists in
 *      gates/registry.yaml — EXCEPT the FIXED pending-sibling list (see
 *      PENDING_SIBLING_IDS): those are tolerated AND reported as
 *      PENDING-SIBLING until the sibling task's registry rows land;
 *   4. every property and every test vector resolves to ONE unambiguous gate
 *      set: registry applicability for its site_class (required/adapted bind,
 *      n_a does not) + overlay adds/adapts; two overlay rows adapting the same
 *      gate for the same vector = AMBIGUOUS = error; adapting a gate that is
 *      not in the composed set = error;
 *   5. NEVER-WEAKENS (rule g): the overlay schema has NO removal channel, and
 *      any smuggled one — a forbidden key (removes/n_a/waives/...) or
 *      softening language in an adapt reason — is a HARD error, with a control
 *      probe proving the check fires;
 *   6. all 24 package-workflow test vectors resolve and their files exist;
 *   7. scope_map covers every registry gate id EXACTLY once
 *      (change_relevant ∪ project_only = all ids, disjoint);
 *   8. change_triggers (external review pass 2, finding B5 — the diff-sensitive
 *      resolver): every row has a non-empty when_changed (path globs and/or
 *      kind:<declared change_kind>) and non-empty adds of known gate ids; every
 *      diff-reachable gate on the B5 list (REQUIRED_TRIGGERED) that exists in
 *      the registry is carried by at least one row — deleting a trigger cannot
 *      silently strand a gate; resolveChangeGates() is the reference resolver:
 *      per-change set = change_relevant ∪ matched trigger adds, intersected
 *      with the property's composed WHICH-set (registry floor + overlays);
 *   9. FAIL-CLOSED LAW pinned: the fail_closed block must exist with exactly
 *      unmatched_change: full-battery and unknown_dimension:
 *      full-battery-plus-situation-adds — an unclassifiable change runs the
 *      FULL battery, and a property carrying `unknown` in any dimension gets
 *      NO subset benefit (unknown matches overlays as a wildcard);
 *  10. `unknown` honesty (external review pass 2, guessed-defaults finding):
 *      unknown is a legal declared value for business_model / locale_market,
 *      but every unknown MUST carry an owner-question pointer comment on the
 *      same line (a Q- id or "owner ratification pending"); test vectors may
 *      never carry unknown.
 *
 * CONTROL PROBES (house rule, merge-continuity-lint.mjs style): known-good and
 * known-bad documents run through the REAL parser + REAL lint before the real
 * file; a probe failure means the gate checked nothing and the run fails.
 *
 * Exit codes: 0 = clean · 2 = violations OR broken probe (CI blocks) · 1 = harness error.
 *
 * Usage: node scripts/class-map-lint.mjs [--class-map <path>] [--registry <path>]
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseRegistry, REGISTRY } from "./gate-registry-lint.mjs";
export { REGISTRY };

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const CLASS_MAP = "gates/class-map.yaml";

/** FIXED list (task contract with the sibling registry task — ids are frozen).
 * Referenced ids on this list that are not YET in gates/registry.yaml are
 * tolerated and reported as PENDING-SIBLING, never hard-failed. Any other
 * unknown id is an error. */
export const PENDING_SIBLING_IDS = new Set([
  "axe-core-a11y", "zap-baseline", "redirect-map-tests", "rollback-verification",
  "scaled-content", "baseline", "launch-certificate",
]);

export const PROPERTY_DIMS = ["site_class", "business_model", "asset_situation", "entity_register", "locale_market", "platform"];
export const REQUIRED_DIMS = [...PROPERTY_DIMS, "scope"];
export const SCOPE_VALUES = ["project", "change"];

/** External review pass 2, finding B5: these registry gates guard surfaces a
 * CHANGE can directly alter (URLs, forms, canonicals, schema, tracking,
 * locales, security, keywords). Each one that exists in the registry MUST be
 * carried by at least one change_trigger row — otherwise a diff can alter the
 * surface while its gate sleeps in project_only. Removing an id from this list
 * is a gate-weakening (rule g) and needs the owner's DECISIONS.md ruling. */
export const REQUIRED_TRIGGERED = [
  "redirect-map-tests", "meta-canonical-crawl-files", "internal-link-crawl",
  "forms-crm-parity", "consent-mode", "schema-jsonld",
  "ga4-stream", "gtm-conversion-events", "hreflang-reciprocal",
  "zap-baseline", "keyword-map",
];

/** The FAIL-CLOSED LAW, pinned: gates/class-map.yaml must declare exactly this
 * block. Any drift (missing key, different value, extra key) is a finding —
 * there is no vocabulary for weakening it in place. */
export const FAIL_CLOSED_LAW = {
  unmatched_change: "full-battery",
  unknown_dimension: "full-battery-plus-situation-adds",
};

/** Minimum change-kind vocabulary: route renames/deletions are diffs of
 * absences (no surviving path to glob-match), and content-only is the one
 * assertion that may claim the plain change_relevant floor. */
export const REQUIRED_CHANGE_KINDS = ["route-rename", "route-delete", "content-only"];

/** An `unknown` dimension value must point at its owner question. */
export const UNKNOWN_POINTER_RE = /\bQ-[A-Z0-9][A-Z0-9-]*\b|owner ratification pending/i;

/** The only legal overlay keys. Everything else is flagged; the forbidden set
 * gets the rule-g wording because it is an attempted removal channel. */
export const OVERLAY_KEYS = new Set(["id", "when", "adds", "adapts"]);
export const FORBIDDEN_OVERLAY_KEYS = new Set([
  "removes", "remove", "n_a", "na", "waives", "waive", "exempts", "exempt",
  "softens", "soften", "downgrades", "downgrade", "disables", "disable", "skips", "skip",
]);
/** Softening language screen for adapt reasons — an adapt may only sharpen. */
export const SOFTENING_RE =
  /\b(skip(s|ped)?|waive[sd]?|exempt(s|ed)?|remove[sd]?|drop(s|ped)?|disable[sd]?|optional|not required|no longer (binds|required|runs)|n\/a)\b/i;

/* ────────────────────────── narrow-YAML parser ────────────────────────── */

const unquote = (v) => {
  const t = String(v).trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))
    return t.slice(1, -1).replace(/\\"/g, '"');
  return t;
};
const inlineList = (body) => body.split(",").map((x) => unquote(x)).filter((x) => x !== "");

/**
 * Parse the class-map's deliberately narrow grammar. Returns { doc, errors }.
 * Anything outside the grammar is an error, never silently skipped.
 */
export function parseClassMap(text) {
  const errors = [];
  const doc = {
    version: null, updated: null, dimensions: {}, properties: [], overlays: [],
    scope_map: { change_relevant: [], project_only: [] }, test_vectors: [],
    change_kinds: [], fail_closed: {}, change_triggers: [],
  };
  let section = null;   // dimensions | properties | overlays | scope_map | test_vectors | change_triggers | fail_closed
  let item = null;      // current list item (property / overlay / vector / trigger)
  let sub = null;       // "when" | "adapts" | scope_map list name

  text.split(/\r?\n/).forEach((raw, idx) => {
    const ln = idx + 1;
    const line = raw.replace(/\s+$/, "");
    if (line === "" || /^\s*#/.test(line)) return;

    let m;
    if ((m = line.match(/^version:\s*(\S+)\s*$/))) { doc.version = Number(m[1]); section = null; return; }
    if ((m = line.match(/^updated:\s*(.+)$/))) { doc.updated = unquote(m[1]); section = null; return; }
    if ((m = line.match(/^change_kinds:\s*\[(.*)\]\s*(?:#.*)?$/))) { doc.change_kinds = inlineList(m[1]); section = null; return; }
    if ((m = line.match(/^(dimensions|properties|overlays|scope_map|test_vectors|change_triggers|fail_closed):\s*$/))) {
      section = m[1]; item = null; sub = null; return;
    }

    if (section === "dimensions") {
      if ((m = line.match(/^  ([a-z_]+):\s*\[(.*)\]\s*(?:#.*)?$/))) { doc.dimensions[m[1]] = inlineList(m[2]); return; }
      errors.push(`line ${ln}: unparseable dimensions line (expected \`  name: [a, b]\`): ${line.trim()}`);
      return;
    }

    if (section === "properties" || section === "test_vectors") {
      const opener = section === "properties" ? "domain" : "id";
      const list = doc[section];
      if ((m = line.match(new RegExp(`^  - ${opener}:\\s*(.+)$`)))) {
        item = { [opener]: unquote(m[1]), line: ln };
        list.push(item);
        return;
      }
      if (item && (m = line.match(/^    ([a-z_]+):\s*([^#]+?)\s*(?:#\s*(.*))?$/))) {
        item[m[1]] = unquote(m[2]);
        if (m[3] !== undefined) (item.__comments ??= {})[m[1]] = m[3];
        return;
      }
      errors.push(`line ${ln}: unparseable ${section} line: ${line.trim()}`);
      return;
    }

    if (section === "fail_closed") {
      if ((m = line.match(/^  ([a-z_]+):\s*([a-z-]+)\s*(?:#.*)?$/))) { doc.fail_closed[m[1]] = m[2]; return; }
      errors.push(`line ${ln}: unparseable fail_closed line (expected \`  key: value\`): ${line.trim()}`);
      return;
    }

    if (section === "change_triggers") {
      if ((m = line.match(/^  - id:\s*(.+)$/))) {
        item = { id: unquote(m[1]), line: ln, when_changed: [], adds: [], extraKeys: [] };
        doc.change_triggers.push(item);
        return;
      }
      if (!item) { errors.push(`line ${ln}: change_triggers field before first "- id:"`); return; }
      if ((m = line.match(/^    when_changed:\s*\[(.*)\]\s*(?:#.*)?$/))) { item.when_changed = inlineList(m[1]); return; }
      if ((m = line.match(/^    adds:\s*\[(.*)\]\s*(?:#.*)?$/))) { item.adds = inlineList(m[1]); return; }
      if ((m = line.match(/^    ([a-z_]+):\s*(.*)$/))) { item.extraKeys.push({ key: m[1], line: ln }); return; }
      errors.push(`line ${ln}: unparseable change_triggers line: ${line.trim()}`);
      return;
    }

    if (section === "overlays") {
      if ((m = line.match(/^  - id:\s*(.+)$/))) {
        item = { id: unquote(m[1]), line: ln, when: {}, adds: [], adapts: {}, extraKeys: [] };
        doc.overlays.push(item);
        sub = null;
        return;
      }
      if (!item) { errors.push(`line ${ln}: overlay field before first "- id:"`); return; }
      if (/^    when:\s*$/.test(line)) { sub = "when"; return; }
      if (/^    adapts:\s*$/.test(line)) { sub = "adapts"; return; }
      if ((m = line.match(/^    adds:\s*\[(.*)\]\s*$/))) { item.adds = inlineList(m[1]); sub = null; return; }
      if (sub === "when" && (m = line.match(/^      ([a-z_]+):\s*(.+)$/))) {
        const v = m[2].trim();
        item.when[m[1]] = v.startsWith("[") && v.endsWith("]") ? inlineList(v.slice(1, -1)) : unquote(v);
        return;
      }
      if (sub === "adapts" && (m = line.match(/^      ([a-z0-9-]+):\s*(.+)$/))) {
        item.adapts[m[1]] = unquote(m[2]);
        return;
      }
      if ((m = line.match(/^    ([a-z_]+):\s*(.*)$/))) {
        // unknown overlay key — recorded for the lint, which decides how loud to be
        item.extraKeys.push({ key: m[1], line: ln });
        sub = null;
        return;
      }
      errors.push(`line ${ln}: unparseable overlays line: ${line.trim()}`);
      return;
    }

    if (section === "scope_map") {
      if ((m = line.match(/^  (change_relevant|project_only):\s*$/))) { sub = m[1]; return; }
      if (sub && (m = line.match(/^    - ([a-z0-9-]+)\s*(?:#.*)?$/))) { doc.scope_map[sub].push(m[1]); return; }
      errors.push(`line ${ln}: unparseable scope_map line: ${line.trim()}`);
      return;
    }

    errors.push(`line ${ln}: unexpected top-level line: ${line.trim()}`);
  });

  return { doc, errors };
}

/* ───────────────────────────── composition ────────────────────────────── */

/** Does an overlay row match a vector? Every `when` entry must match
 * (scalar equality or any-of list membership). */
export function overlayMatches(overlay, vector) {
  return Object.entries(overlay.when).every(([dim, val]) =>
    Array.isArray(val) ? val.includes(vector[dim]) : val === vector[dim]);
}

/**
 * Resolve one vector against the registry + overlays.
 * Registry applicability for the vector's site_class is the FLOOR
 * (required/adapted bind; n_a does not); overlays may only add/adapt.
 * @returns { gates: Set<string>, adapted: Map<gate, {overlay, reason}>, errors: string[] }
 */
export function resolveVector(vector, label, reg, overlays) {
  const errors = [];
  const gates = new Set();
  for (const g of reg.gates) {
    const entry = g.applicability?.[vector.site_class];
    if (!entry) { errors.push(`${label}: registry gate "${g.id}" has no entry for class "${vector.site_class}" (registry lint should have caught this)`); continue; }
    if (entry.kind !== "n_a") gates.add(g.id);
  }
  const matching = overlays.filter((o) => overlayMatches(o, vector));
  for (const o of matching) for (const id of o.adds) gates.add(id);
  const adapted = new Map();
  for (const o of matching) {
    for (const [gid, reason] of Object.entries(o.adapts)) {
      if (adapted.has(gid)) {
        errors.push(`${label}: AMBIGUOUS resolution — gate "${gid}" adapted by BOTH overlay "${adapted.get(gid).overlay}" and overlay "${o.id}" for the same vector; one gate, one adapting row`);
        continue;
      }
      if (!gates.has(gid)) {
        errors.push(`${label}: overlay "${o.id}" adapts gate "${gid}" which is not in the composed set for this vector (registry ${vector.site_class} floor + adds) — an adapt must sharpen a binding gate, not conjure or excuse one`);
        continue;
      }
      adapted.set(gid, { overlay: o.id, reason });
    }
  }
  return { gates, adapted, errors };
}

/* ─────────────── change triggers (B5: the diff-sensitive half) ────────────── */

/** Glob → anchored RegExp. `*` = one path segment, `**` = any depth including
 * zero segments (`a/**` also matches `a` itself; `a/**\/b` also matches `a/b`). */
export function globToRegExp(glob) {
  let g = String(glob).replace(/[.+^${}()|\\[\]?]/g, "\\$&");
  g = g
    .replace(/\/\*\*$/, "@@TRAIL@@")   // .../**  -> the dir itself or anything under it
    .replace(/\*\*\//g, "@@LEAD@@")    // **/     -> zero or more whole segments
    .replace(/\*\*/g, "@@ANY@@")        // bare ** -> anything
    .replace(/\*/g, "[^/]*")             // *       -> one path segment
    .replace(/@@TRAIL@@/g, "(?:/.*)?")
    .replace(/@@LEAD@@/g, "(?:[^/]+/)*")
    .replace(/@@ANY@@/g, ".*");
  return new RegExp(`^${g}$`);
}

export const matchesGlob = (path, glob) => globToRegExp(glob).test(path);

/** Does a trigger row fire for a change? change = { paths: [...], kinds: [...] }.
 * A `kind:<name>` entry matches a declared change kind; anything else is a
 * path glob matched against every changed path. ANY hit fires the row. */
export function triggerMatches(trigger, change) {
  const paths = change?.paths ?? [];
  const kinds = change?.kinds ?? [];
  return trigger.when_changed.some((w) =>
    w.startsWith("kind:") ? kinds.includes(w.slice(5)) : paths.some((p) => matchesGlob(p, w)));
}

/**
 * The reference per-change resolver (external review pass 2, B5 remedy).
 * WHICH gates apply to the property = registry floor + overlay adds (the
 * composed set); WHEN they bind for THIS change:
 *   · any dimension `unknown`   → FAIL-CLOSED: full composed set PLUS every
 *     overlay add that could match under any resolution of the unknown
 *     (unknown matches as a wildcard) — no subset benefit, ever;
 *   · no trigger matches, change NOT declared content-only → FAIL-CLOSED:
 *     the full composed set (unknown classification never buys a subset);
 *   · no trigger matches, declared content-only → change_relevant ∩ composed;
 *   · triggers match → (change_relevant ∪ matched adds) ∩ composed.
 * The ∩ composed is the WHICH axis staying supreme: a trigger never
 * resurrects a gate the registry marks n_a for the property's class.
 * @param change { paths: string[], kinds: string[] }
 */
export function resolveChangeGates(vector, change, doc, reg) {
  const base = resolveVector(vector, "change-resolve", reg, doc.overlays);
  const composed = base.gates;
  if (PROPERTY_DIMS.some((d) => vector[d] === "unknown")) {
    const gates = new Set(composed);
    for (const o of doc.overlays) {
      const couldMatch = Object.entries(o.when).every(([dim, val]) =>
        vector[dim] === "unknown" ||
        (Array.isArray(val) ? val.includes(vector[dim]) : val === vector[dim]));
      if (couldMatch) for (const id of o.adds) gates.add(id);
    }
    return { gates, failClosed: "unknown_dimension", matched: [], errors: base.errors };
  }
  const matched = doc.change_triggers.filter((t) => triggerMatches(t, change));
  if (matched.length === 0 && !(change?.kinds ?? []).includes("content-only")) {
    return { gates: new Set(composed), failClosed: "unmatched_change", matched: [], errors: base.errors };
  }
  const gates = new Set(doc.scope_map.change_relevant.filter((id) => composed.has(id)));
  for (const t of matched) for (const id of t.adds) if (composed.has(id)) gates.add(id);
  return { gates, failClosed: null, matched: matched.map((t) => t.id), errors: base.errors };
}

/* ─────────────────────────────── the lint ─────────────────────────────── */

/**
 * @param doc parsed class-map
 * @param reg parsed registry ({classes, gates})
 * @param opts { exists: (repoRelPath)=>boolean }
 * @returns { errors: string[], pendingSibling: string[], resolved: number }
 */
export function lint(doc, reg, opts) {
  const errors = [];
  const pendingSibling = new Set();
  const registryIds = new Set(reg.gates.map((g) => g.id));
  const knownId = (id) => registryIds.has(id) || PENDING_SIBLING_IDS.has(id);
  const notePending = (id) => { if (!registryIds.has(id) && PENDING_SIBLING_IDS.has(id)) pendingSibling.add(id); };

  if (doc.version !== 1) errors.push(`version must be 1 (got ${doc.version})`);
  if (!doc.updated) errors.push("updated stamp missing");

  // 2. dimensions declared; site_class mirrors the registry classes line
  for (const d of REQUIRED_DIMS) {
    if (!doc.dimensions[d] || doc.dimensions[d].length === 0) errors.push(`dimensions: "${d}" missing or empty`);
  }
  const siteClasses = doc.dimensions.site_class ?? [];
  for (const c of reg.classes) if (!siteClasses.includes(c))
    errors.push(`dimensions.site_class is missing registry class "${c}" — site_class MIRRORS gates/registry.yaml classes; extend both together`);
  for (const c of siteClasses) if (!reg.classes.includes(c))
    errors.push(`dimensions.site_class declares "${c}" which gates/registry.yaml does not — the registry classes stay supreme`);
  const scope = doc.dimensions.scope ?? [];
  if (scope.length && (scope.length !== SCOPE_VALUES.length || SCOPE_VALUES.some((v) => !scope.includes(v))))
    errors.push(`dimensions.scope must be exactly [${SCOPE_VALUES.join(", ")}] (M0(a) disposition 3)`);

  const declared = (dim, val) => (doc.dimensions[dim] ?? []).includes(val);

  // properties: full vector, declared values, unique domains
  const seenDomains = new Set();
  for (const p of doc.properties) {
    const at = `property "${p.domain}" (line ${p.line})`;
    if (seenDomains.has(p.domain)) errors.push(`${at}: duplicate domain`);
    seenDomains.add(p.domain);
    for (const d of PROPERTY_DIMS) {
      if (!p[d]) { errors.push(`${at}: missing dimension "${d}" — every fleet property declares its FULL vector`); continue; }
      if (!declared(d, p[d])) errors.push(`${at}: ${d} "${p[d]}" is not a declared value of that dimension`);
    }
    if (p.scope) errors.push(`${at}: scope is not a property dimension — it binds per work item via scope_map`);
  }
  if (doc.properties.length === 0) errors.push("no properties — a class-map that maps no fleet property drives nothing");

  // overlays: schema (NEVER-WEAKENS), declared dims/values, known gate ids
  const seenOverlayIds = new Set();
  for (const o of doc.overlays) {
    const at = `overlay "${o.id}" (line ${o.line})`;
    if (seenOverlayIds.has(o.id)) errors.push(`${at}: duplicate overlay id`);
    seenOverlayIds.add(o.id);
    for (const { key, line } of o.extraKeys) {
      if (FORBIDDEN_OVERLAY_KEYS.has(key)) {
        errors.push(`${at}: NEVER-WEAKENS VIOLATION — key "${key}" (line ${line}) is a removal/softening channel; an overlay may only ADD or ADAPT a gate, never remove, n_a, or soften one (CLAUDE.md rule g). Removing or softening a registry row requires Abilash's ruling logged in DECISIONS.md, in the registry itself.`);
      } else {
        errors.push(`${at}: unknown key "${key}" (line ${line}) — the overlay schema is {id, when, adds, adapts} and nothing else`);
      }
    }
    if (Object.keys(o.when).length === 0) errors.push(`${at}: empty "when" — an overlay that matches everything is registry business, not an overlay`);
    for (const [dim, val] of Object.entries(o.when)) {
      if (dim === "scope") { errors.push(`${at}: "when" may not select on scope — binding scope lives ONLY in scope_map (owner-visible, exactly-once)`); continue; }
      if (!doc.dimensions[dim]) { errors.push(`${at}: when-dimension "${dim}" is not declared`); continue; }
      for (const v of Array.isArray(val) ? val : [val]) {
        if (!declared(dim, v)) errors.push(`${at}: when ${dim}="${v}" is not a declared value of that dimension`);
      }
    }
    if (o.adds.length === 0 && Object.keys(o.adapts).length === 0)
      errors.push(`${at}: neither adds nor adapts — an overlay must do something`);
    for (const id of o.adds) {
      if (!knownId(id)) errors.push(`${at}: adds unknown gate id "${id}" — not in ${REGISTRY} and not on the fixed pending-sibling list`);
      notePending(id);
    }
    for (const [gid, reason] of Object.entries(o.adapts)) {
      if (!knownId(gid)) errors.push(`${at}: adapts unknown gate id "${gid}" — not in ${REGISTRY} and not on the fixed pending-sibling list`);
      notePending(gid);
      if (!reason || reason.trim().length < 15)
        errors.push(`${at}: adapt reason for "${gid}" is empty/trivial — an unexplained adapt is a dodge, not a decision`);
      if (reason && SOFTENING_RE.test(reason))
        errors.push(`${at}: NEVER-WEAKENS VIOLATION — adapt reason for "${gid}" contains softening language (${reason.match(SOFTENING_RE)[0]}); an adapt may only sharpen the lens, never lower the bar (CLAUDE.md rule g)`);
    }
  }

  // 4. every property resolves unambiguously
  let resolved = 0;
  for (const p of doc.properties) {
    if (PROPERTY_DIMS.some((d) => !p[d] || !declared(d, p[d]))) continue; // schema errors already reported
    const r = resolveVector(p, `property "${p.domain}"`, reg, doc.overlays);
    errors.push(...r.errors);
    if (r.errors.length === 0) resolved++;
  }

  // 6. the 24 test vectors resolve; files exist; values declared; unique ids
  const seenVectorIds = new Set();
  for (const v of doc.test_vectors) {
    const at = `test_vector "${v.id}" (line ${v.line})`;
    if (seenVectorIds.has(v.id)) errors.push(`${at}: duplicate id`);
    seenVectorIds.add(v.id);
    if (!v.workflow) errors.push(`${at}: missing workflow path`);
    else if (!opts.exists(v.workflow)) errors.push(`${at}: workflow file does not exist: ${v.workflow}`);
    let bad = false;
    for (const d of PROPERTY_DIMS) {
      if (!v[d]) { errors.push(`${at}: missing dimension "${d}"`); bad = true; continue; }
      if (!declared(d, v[d])) { errors.push(`${at}: ${d} "${v[d]}" is not a declared value`); bad = true; }
    }
    if (!bad) {
      const r = resolveVector(v, at, reg, doc.overlays);
      errors.push(...r.errors);
      if (r.errors.length === 0) resolved++;
    }
  }
  if (doc.test_vectors.length !== 24)
    errors.push(`test_vectors: expected the 24 package workflows, found ${doc.test_vectors.length} — every 05_WORKFLOWS file is a vector, no more, no fewer`);

  // 8. change_kinds: the minimum vocabulary must be declared
  if (!doc.change_kinds || doc.change_kinds.length === 0) {
    errors.push("change_kinds: missing or empty — route renames/deletions and content-only diffs need a declared vocabulary, or every such change fails closed with no way to say why");
  } else {
    for (const k of REQUIRED_CHANGE_KINDS) if (!doc.change_kinds.includes(k))
      errors.push(`change_kinds: required kind "${k}" is not declared — the B5 remedy names it; kinds may be added, never dropped (rule g)`);
  }

  // 9. FAIL-CLOSED LAW pinned exactly
  for (const [key, val] of Object.entries(FAIL_CLOSED_LAW)) {
    if (doc.fail_closed[key] !== val)
      errors.push(`fail_closed: FAIL-CLOSED LAW VIOLATION — the block must declare exactly \`${key}: ${val}\` (got ${doc.fail_closed[key] === undefined ? "nothing" : `"${doc.fail_closed[key]}"`}); an unclassifiable change runs the FULL battery and unknown dimensions get NO subset benefit — there is no weaker legal value (rule g)`);
  }
  for (const key of Object.keys(doc.fail_closed)) {
    if (!(key in FAIL_CLOSED_LAW))
      errors.push(`fail_closed: unknown key "${key}" — the law has exactly two clauses (${Object.keys(FAIL_CLOSED_LAW).join(", ")}); extra clauses are edits to the law, and the law is lint-pinned`);
  }

  // 10. change_triggers: schema + known ids + B5 minimum coverage
  const seenTriggerIds = new Set();
  const triggeredIds = new Set();
  for (const t of doc.change_triggers) {
    const at = `change_trigger "${t.id}" (line ${t.line})`;
    if (seenTriggerIds.has(t.id)) errors.push(`${at}: duplicate trigger id`);
    seenTriggerIds.add(t.id);
    for (const { key, line } of t.extraKeys) {
      if (FORBIDDEN_OVERLAY_KEYS.has(key)) {
        errors.push(`${at}: NEVER-WEAKENS VIOLATION — key "${key}" (line ${line}) is a removal/softening channel; a trigger may only ADD gates to a change's battery (CLAUDE.md rule g)`);
      } else {
        errors.push(`${at}: unknown key "${key}" (line ${line}) — the trigger schema is {id, when_changed, adds} and nothing else`);
      }
    }
    if (t.when_changed.length === 0)
      errors.push(`${at}: empty when_changed — a trigger that can never fire is a decoration, not a resolver`);
    for (const w of t.when_changed) {
      if (!w.trim()) { errors.push(`${at}: empty when_changed entry`); continue; }
      if (w.startsWith("kind:")) {
        const kind = w.slice(5);
        if (!(doc.change_kinds ?? []).includes(kind))
          errors.push(`${at}: when_changed kind "${kind}" is not declared in change_kinds`);
      }
    }
    if (t.adds.length === 0)
      errors.push(`${at}: empty adds — a trigger must pull at least one gate into the change battery`);
    for (const id of t.adds) {
      if (!knownId(id)) errors.push(`${at}: adds unknown gate id "${id}" — not in ${REGISTRY} and not on the fixed pending-sibling list`);
      notePending(id);
      triggeredIds.add(id);
    }
  }
  for (const id of REQUIRED_TRIGGERED) {
    if (registryIds.has(id) && !triggeredIds.has(id))
      errors.push(`change_triggers: diff-reachable gate "${id}" (B5 list) is not carried by ANY trigger row — a change can directly alter its surface yet omit the gate; add a trigger row (triggers are added, never removed — rule g)`);
  }

  // 11. `unknown` honesty: legal only with an owner-question pointer; never in fixtures
  for (const p of doc.properties) {
    for (const d of PROPERTY_DIMS) {
      if (p[d] !== "unknown") continue;
      const comment = p.__comments?.[d] ?? "";
      if (!UNKNOWN_POINTER_RE.test(comment))
        errors.push(`property "${p.domain}": ${d} is "unknown" without an owner-question pointer comment on the same line (need a Q- id or "owner ratification pending") — unknown is declared honesty awaiting the owner, never a shrug`);
    }
  }
  for (const v of doc.test_vectors) {
    for (const d of PROPERTY_DIMS) {
      if (v[d] === "unknown")
        errors.push(`test_vector "${v.id}": ${d} is "unknown" — test vectors are canonical workflow shapes; unknown is for real properties awaiting the owner, never for fixtures`);
    }
  }

  // 7. scope_map: every registry gate id exactly once, lists disjoint
  const cr = doc.scope_map.change_relevant;
  const po = doc.scope_map.project_only;
  for (const [name, list] of [["change_relevant", cr], ["project_only", po]]) {
    const seen = new Set();
    for (const id of list) {
      if (seen.has(id)) errors.push(`scope_map.${name}: duplicate id "${id}"`);
      seen.add(id);
      if (!knownId(id)) errors.push(`scope_map.${name}: unknown gate id "${id}" — not in ${REGISTRY} and not on the fixed pending-sibling list`);
      notePending(id);
    }
  }
  const crSet = new Set(cr);
  for (const id of po) if (crSet.has(id))
    errors.push(`scope_map: gate "${id}" appears in BOTH change_relevant and project_only — a gate's binding scope is declared exactly once`);
  const scoped = new Set([...cr, ...po]);
  for (const id of registryIds) if (!scoped.has(id))
    errors.push(`scope_map: registry gate "${id}" is NOT covered — every gate's binding scope is a declared decision, never a silence (add it to change_relevant or project_only)`);

  return { errors, pendingSibling: [...pendingSibling].sort(), resolved };
}

/* ─────────────────────────── control probes ───────────────────────────── */

export const PROBE_REGISTRY = `classes: [commerce, organic, landing]
gates:
  - id: probe-a
    name: "Probe A"
    what_it_verifies: "probe check a"
    severity: blocker
    run: automated
    status: built
    script_or_agent_ref: "package.json (probe)"
    source: "probe"
    applicability:
      commerce: required
      organic: required
      landing: required
  - id: probe-b
    name: "Probe B"
    what_it_verifies: "probe check b"
    severity: high
    run: agent
    status: built
    script_or_agent_ref: "package.json (probe)"
    source: "probe"
    applicability:
      commerce: required
      organic: required
      landing: { n_a: "no landing surface in the probe fixture" }
  - id: redirect-map-tests
    name: "Probe redirect map"
    what_it_verifies: "probe URL/redirect surface"
    severity: blocker
    run: automated
    status: built
    script_or_agent_ref: "package.json (probe)"
    source: "probe"
    applicability:
      commerce: required
      organic: required
      landing: required
`;

export const PROBE_MAP = `version: 1
updated: "2026-07-19 00:00:00 IST"
dimensions:
  site_class: [commerce, organic, landing]
  business_model: [b2c, b2b, d2c, shopify, unknown]
  asset_situation: [new, existing, migration]
  entity_register: [ktahv-clinical, villa-raag-hospitality, kappl-product, kappl-b2b, group-corporate, personal, internal, education]
  locale_market: [en-in, en-global, en-us, en-eu, en-de-fr]
  platform: [factory-next, wordpress, shopify]
  scope: [project, change]
properties:
  - domain: probe-unknown.example
    site_class: organic
    business_model: unknown          # owner ratification pending — probe fixture
    asset_situation: new
    entity_register: internal
    locale_market: en-in
    platform: factory-next
  - domain: probe.example
    site_class: organic
    business_model: b2c
    asset_situation: existing
    entity_register: group-corporate
    locale_market: en-global
    platform: factory-next
overlays:
  - id: probe-legacy
    when:
      asset_situation: [existing, migration]
    adds: [baseline]
  - id: probe-lens
    when:
      business_model: b2c
    adapts:
      probe-a: "judged with the probe lens sharpened, bar unchanged, in enough words"
change_kinds: [route-rename, route-delete, content-only]
fail_closed:
  unmatched_change: full-battery
  unknown_dimension: full-battery-plus-situation-adds
change_triggers:
  - id: probe-url-surface
    when_changed: [sites/*/next.config.*, kind:route-delete]
    adds: [redirect-map-tests]
scope_map:
  change_relevant:
    - probe-a
  project_only:
    - probe-b
    - redirect-map-tests
test_vectors:
`;

// 24 probe vectors, all resolvable, workflow paths satisfied by the injected oracle
const PROBE_VECTORS = Array.from({ length: 24 }, (_, i) => `  - id: probe-wf-${String(i + 1).padStart(2, "0")}
    workflow: probe/workflow-${i + 1}.md
    site_class: ${["commerce", "organic", "landing"][i % 3]}
    business_model: ${["b2c", "b2b", "d2c", "shopify"][i % 4]}
    asset_situation: ${["new", "existing", "migration"][i % 3]}
    entity_register: group-corporate
    locale_market: ${["en-in", "en-global", "en-us", "en-eu", "en-de-fr"][i % 5]}
    platform: factory-next
`).join("");
export const PROBE_MAP_FULL = PROBE_MAP + PROBE_VECTORS;

export function runControlProbes() {
  const broken = [];
  const reg = parseRegistry(PROBE_REGISTRY);
  const opts = { exists: (p) => p.startsWith("probe/") };
  const run = (text) => {
    const { doc, errors: parseErrors } = parseClassMap(text);
    const r = lint(doc, reg, opts);
    return { errors: [...parseErrors, ...r.errors], pendingSibling: r.pendingSibling };
  };

  // 1. known-good map passes, and the pending-sibling TOLERATE path works
  //    ("baseline" is added by an overlay but absent from the probe registry).
  const good = run(PROBE_MAP_FULL);
  if (good.errors.length)
    broken.push(`CONTROL PROBE FAILURE: known-good class-map did not pass (${good.errors[0]})`);
  if (!good.pendingSibling.includes("baseline"))
    broken.push("CONTROL PROBE FAILURE: pending-sibling id was not reported as PENDING-SIBLING");

  // 2. NEVER-WEAKENS fires: a removal key and softening adapt language are both caught
  const removes = PROBE_MAP_FULL.replace("    adds: [baseline]", "    adds: [baseline]\n    removes: [probe-a]");
  if (!run(removes).errors.some((e) => e.includes("NEVER-WEAKENS")))
    broken.push("CONTROL PROBE FAILURE: an overlay `removes:` key was NOT caught — the never-weakens check is dead");
  const softened = PROBE_MAP_FULL.replace(
    'probe-a: "judged with the probe lens sharpened, bar unchanged, in enough words"',
    'probe-a: "this gate is not required for b2c surfaces"');
  if (!run(softened).errors.some((e) => e.includes("NEVER-WEAKENS")))
    broken.push("CONTROL PROBE FAILURE: softening adapt language was NOT caught");

  // 3. ambiguity fires: two overlays adapting the same gate for the same vector
  const ambiguous = PROBE_MAP_FULL.replace("change_kinds:", `  - id: probe-lens-2
    when:
      site_class: organic
    adapts:
      probe-a: "a second adapting row for the same gate, in enough words here"
change_kinds:`);
  if (!run(ambiguous).errors.some((e) => e.includes("AMBIGUOUS")))
    broken.push("CONTROL PROBE FAILURE: an ambiguous double-adapt was NOT caught");

  // 4. scope-map coverage fires: an uncovered registry gate is an error
  const uncovered = PROBE_MAP_FULL.replace("  project_only:\n    - probe-b\n", "  project_only:\n");
  if (!run(uncovered).errors.some((e) => e.includes("NOT covered")))
    broken.push("CONTROL PROBE FAILURE: an uncovered registry gate was NOT caught");

  // 5. B5 trigger coverage fires: a diff-reachable registry gate with no
  //    carrying trigger row is an error (delete the only trigger → caught)
  const noTrigger = PROBE_MAP_FULL.replace(
    "  - id: probe-url-surface\n    when_changed: [sites/*/next.config.*, kind:route-delete]\n    adds: [redirect-map-tests]\n", "");
  if (!run(noTrigger).errors.some((e) => e.includes("not carried by ANY trigger row")))
    broken.push("CONTROL PROBE FAILURE: a stranded diff-reachable gate (no trigger row) was NOT caught — the B5 coverage check is dead");

  // 6. FAIL-CLOSED LAW pin fires: a weakened clause value is an error
  const weakenedLaw = PROBE_MAP_FULL.replace("  unmatched_change: full-battery", "  unmatched_change: change-relevant-only");
  if (!run(weakenedLaw).errors.some((e) => e.includes("FAIL-CLOSED LAW")))
    broken.push("CONTROL PROBE FAILURE: a weakened fail_closed clause was NOT caught — the fail-closed pin is dead");

  // 7. unknown-honesty fires: an `unknown` without its owner-question pointer
  const bareUnknown = PROBE_MAP_FULL.replace(
    "    business_model: unknown          # owner ratification pending — probe fixture",
    "    business_model: unknown");
  if (!run(bareUnknown).errors.some((e) => e.includes("owner-question pointer")))
    broken.push("CONTROL PROBE FAILURE: an unknown dimension without a pointer comment was NOT caught");

  return broken;
}

/* ────────────────────────────────── main ──────────────────────────────── */

function main(argv) {
  const arg = (flag, dflt) => { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : dflt; };
  const mapPath = resolve(REPO_ROOT, arg("--class-map", CLASS_MAP));
  const regPath = resolve(REPO_ROOT, arg("--registry", REGISTRY));

  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\nclass-map-lint: CONTROL PROBE FAILED — this gate did not run.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const reg = parseRegistry(readFileSync(regPath, "utf8"));
  if (reg.errors.length > 0) {
    for (const e of reg.errors) console.error(`  ✗ registry: ${e}`);
    console.error(`\nFAIL — the registry itself is unparseable; fix ${REGISTRY} first (gate-registry-lint).`);
    return 2;
  }
  const { doc, errors: parseErrors } = parseClassMap(readFileSync(mapPath, "utf8"));
  const exists = (p) => existsSync(join(REPO_ROOT, p));
  const { errors, pendingSibling, resolved } = lint(doc, reg, { exists });
  const all = [...parseErrors.map((e) => `parse: ${e}`), ...errors];

  console.log(`\nclass-map-lint — ${doc.properties.length} properties · ${doc.overlays.length} overlays · ${doc.test_vectors.length} test vectors · registry ${reg.gates.length} gates × ${reg.classes.length} classes`);
  console.log(`  scope_map: ${doc.scope_map.change_relevant.length} change_relevant · ${doc.scope_map.project_only.length} project_only (floor partition)`);
  const unknownCount = doc.properties.reduce((n, p) => n + PROPERTY_DIMS.filter((d) => p[d] === "unknown").length, 0);
  console.log(`  change_triggers: ${doc.change_triggers.length} rows (additive, diff-keyed) · fail_closed: ${Object.entries(doc.fail_closed).map(([k, v]) => `${k}=${v}`).join(" · ") || "MISSING"} · unknown dims: ${unknownCount} (each owner-flagged, full battery)`);
  if (pendingSibling.length)
    console.log(`  ⏳ PENDING-SIBLING (${pendingSibling.length}): ${pendingSibling.join(", ")} — referenced ids on the fixed new-row list, not yet in ${REGISTRY}; tolerated until the sibling registry rows land`);

  if (all.length === 0) {
    console.log(`\nPASS — every vector (${resolved} resolved: properties + workflows) composes to ONE unambiguous gate set; no overlay removes or softens anything; scope_map covers every registry gate exactly once; every diff-reachable B5 gate is carried by a change_trigger; the fail-closed law is pinned; every unknown carries its owner question.\n`);
    return 0;
  }
  for (const v of all) console.log(`\nVIOLATION  ${v}`);
  console.log(`\nFAIL — ${all.length} violation${all.length === 1 ? "" : "s"}. The class-map is an OVERLAY: it may add or sharpen, never remove or soften (rule g); every combination a real property uses must resolve unambiguously. Fix the map, never the gate.\n`);
  return 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`class-map-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
