#!/usr/bin/env node
/**
 * change-gates-resolve.mjs — the CI-facing per-change gate resolver.
 * Created 2026-07-19 19:24:35 IST (M2 mechanisms, feature/os-v2-m2-mechanisms).
 *
 * WHY THIS EXISTS. External review pass 3 (gpt-5.6-sol, docs/reports/
 * 2026-07-19-os-v2-evidence/audit-gpt-sol-pass3-raw.md) held B5 open
 * operationally: "No supplied resolver or workflow step applies the actual PR
 * diff to those triggers … Implement the actual diff resolver that consumes
 * `change_triggers`, emits the resolved gate set". This script is that
 * resolver — the enforcement start of D-20260719-09 (right-tool-right-time:
 * the system must ENFORCE that the declared capability actually fired).
 *
 * WHAT IT DOES. Takes a REAL git diff (`--name-status -M` vs a base, both
 * rename sides counted — front-gate.mjs pattern), determines the affected
 * site(s) from the changed paths (sites/<domain>/**, launches/<domain>/**),
 * loads each property's vector from gates/class-map.yaml, and resolves the
 * PER-CHANGE gate set via the reference resolver EXPORTED BY
 * scripts/class-map-lint.mjs (resolveChangeGates — parsing and composition are
 * REUSED, never duplicated):
 *
 *   per-change set = (change_relevant ∪ adds of every change_trigger whose
 *                     when_changed globs/kinds match the diff)
 *                    ∩ the property's composed WHICH-set (registry floor for
 *                      its site_class + overlay adds)
 *
 * FAIL-CLOSED LAW (gates/class-map.yaml `fail_closed:`, lint-pinned):
 *   · a site path that resolves to NO class-map property → FULL registry
 *     battery for that domain (an unmapped site never buys a subset);
 *   · a property carrying `unknown` in any dimension → full composed battery
 *     PLUS every situation add that could match (no subset benefit);
 *   · no trigger matched and the change is not declared content-only → the
 *     FULL composed battery (unknown classification never buys a subset).
 * Every fail-closed outcome is printed WITH ITS REASON — fail-closed is a
 * clean resolution (exit 0), not an error.
 *
 * CHANGE KINDS. route-rename / route-delete are DERIVED from the diff itself
 * (a rename/deletion under sites/<domain>/(src/)app/ is a diff of absences the
 * globs cannot see — the diff status is the proof). `content-only` is NEVER
 * derived AND never taken on faith: it is a caller assertion (`--kind
 * content-only`) that the resolver PROVES FROM THE DIFF before honoring
 * (external review, M2 PR blocker: an unverified assertion could suppress the
 * unmatched-change fail-closed path — the exact subset escape hatch the
 * resolver exists to prevent).
 *
 * CONTENT-ONLY PROOF SET (path-proof law). The assertion is honored ONLY when
 * EVERY changed path (both rename sides) matches the content-dir globs below,
 * derived from the real repo tree (verified 2026-07-19) — each glob with its
 * reason:
 *   · content/**            — the Lane-B paste-file home (CLAUDE.md Lane B:
 *                             "commit paste file to /content/"); holds prose
 *                             payloads only (today: content/ledger.yaml).
 *   · docs/**               — reports/SOPs/plans/checklists: prose records,
 *     EXCEPT docs/process/os-2026/**  — that subtree carries MACHINE-CONSUMED
 *                             OS law (merge-continuity.yaml, strict-residues.
 *                             yaml, the package workflow files the class-map
 *                             test_vectors point at). Editing law is never a
 *                             content change.
 *   · launches/** / *.md    — (spaced here only because a literal star-slash
 *                             would close this comment; the exact glob lives
 *                             in CONTENT_ONLY_PROOF_GLOBS) launch-evidence
 *                             write-ups (BRIEF/STRATEGY/
 *                             checklists/design-review notes). The *.md
 *                             restriction keeps binaries (screens/*.png,
 *                             baselines, zips, sha256 manifests) OUT, and
 *     EXCEPT launches/** / approvals.yaml (spaced, same reason) — the SIGNED
 *                             gate ledger; named
 *                             explicitly even though *.md can never match it,
 *                             so the intent survives any future glob edit.
 *   · wiki/**               — knowledge pages, prose by doctrine (pages link
 *                             to sources, never carry config).
 * DELIBERATELY ABSENT: content-mined/** (immutable raw-sources layer — never
 * edited; a diff there is a doctrine violation and must fail closed), and
 * everything executable/config (sites/**, packages/**, scripts/**, gates/**,
 * .github/** …) — code is never content. The proof set is DISJOINT from every
 * change_trigger glob (triggers watch the sites/ and packages/ subtrees), so
 * a proven diff cannot dodge a trigger either.
 *
 * If ANY changed path falls outside the proof set, the assertion is IGNORED —
 * printed loud ("content-only asserted but not path-proven — fail-closed
 * applies") — and resolution proceeds WITHOUT the kind, so the unmatched-
 * change fail-closed law runs at full strength. Only a path-PROVEN assertion
 * may claim the plain change_relevant floor. Rule g: this only strengthens —
 * no proven diff loses its floor, no unproven diff keeps it.
 *
 * OUTPUT. A deterministic resolution block — per site: vector, matched
 * triggers (each with its matching files/kinds), resolved gate ids, fail-closed
 * reason if any — printed to stdout AND written to `--out <file>` for the CI
 * artifact / job summary. Same diff + same class-map ⇒ byte-identical body
 * (the `generated:` meta line is the only run-varying line).
 *
 * ENFORCEMENT MODE AT M2 — the honest statement:
 *   INFORMATIONAL. In CI this resolution is POSTED AS EVIDENCE (the
 *   D-20260719-09 right-tool-right-time trail): it proves which gates the
 *   diff obligates, it does not yet execute or block on them. It becomes
 *   BLOCKING when the job-spec envelope consumes it at the M4 pilot
 *   (plan §10; ACTIVATION SEMANTICS, CLAUDE.md OS v2 §10 — binding on agent
 *   conduct now, machine gate on landing, never citable as a PASSED gate
 *   meanwhile). Rule g: nothing here weakens a gate — this only makes the
 *   per-change obligation set visible and auditable.
 *
 * Exit codes: 0 = clean resolution (incl. fail-closed and "no site gates in
 * scope") · 1 = harness/parse error (unresolvable base, unparseable class-map/
 * registry, unknown declared kind, resolver-internal inconsistency) — a broken
 * resolver must NEVER silently pass; it fails loud.
 *
 * Usage:
 *   node scripts/change-gates-resolve.mjs [--base <sha>] [--out <file>]
 *        [--root <git-dir>] [--class-map <path>] [--registry <path>]
 *        [--kind <change-kind>]...
 *   BASE=<sha> node scripts/change-gates-resolve.mjs   (env fallback, CI style)
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseRegistry } from "./gate-registry-lint.mjs";
import {
  CLASS_MAP, PROPERTY_DIMS, REGISTRY, REPO_ROOT,
  matchesGlob, parseClassMap, resolveChangeGates,
} from "./class-map-lint.mjs";

/* ───────────────────────── diff parsing (pure) ───────────────────────── */

/**
 * Parse `git diff --name-status -M` output into entries. Rename/copy lines
 * (`R100\told\tnew`) carry BOTH sides in `paths` — a rename away from a
 * guarded path still fires the guard (front-gate.mjs stance).
 * @returns {Array<{status:string, paths:string[]}>}
 */
export function parseNameStatus(text) {
  if (!text.trim()) return [];
  return text.trim().split("\n").map((line) => {
    const [status, ...rest] = line.split("\t");
    return { status, paths: rest.filter(Boolean) };
  });
}

/** Every changed path, both rename sides, deduped + sorted. */
export const allPaths = (entries) =>
  [...new Set(entries.flatMap((e) => e.paths))].sort();

/** sites/<domain>/** or launches/<domain>/** → domain, else null. A domain is
 * a DIRECTORY: a file sitting directly under sites/ or launches/ (e.g. a
 * launches/README-*.md ledger doc) names no site. Direct files under sites/
 * are handled fail-closed in resolveDiff (STRANDED_SITES_RE). */
export function siteOf(path) {
  const m = path.match(/^(?:sites|launches)\/([^/]+)\/.+$/);
  return m ? m[1] : null;
}

/** A path under sites/ that names NO domain directory — "sites/ touched
 * somehow" without a resolvable site. Fail-closed territory. */
export const STRANDED_SITES_RE = /^sites\/[^/]*$/;

const APP_ROUTE_RE = /^sites\/[^/]+\/(?:src\/)?app\//;

/* ─────────────── content-only path proof (header: PROOF SET) ─────────────── */

/** The content-dir globs that PROVE a `content-only` assertion. Derivation and
 * per-glob reasons live in the file header (CONTENT-ONLY PROOF SET) — keep the
 * two in sync; the tests pin both directions. */
export const CONTENT_ONLY_PROOF_GLOBS = [
  { glob: "content/**", why: "Lane-B paste-file home — prose payloads only" },
  { glob: "docs/**", why: "reports/SOPs/plans — prose records (see exclusion)" },
  { glob: "launches/**/*.md", why: "launch-evidence write-ups; *.md keeps binaries/ledgers out" },
  { glob: "wiki/**", why: "knowledge pages — prose by doctrine" },
];

/** Exclusions WIN over the globs above — law and ledgers are never content. */
export const CONTENT_ONLY_PROOF_EXCLUDES = [
  { glob: "docs/process/os-2026/**", why: "machine-consumed OS law (merge-continuity/strict-residues/workflows)" },
  { glob: "launches/**/approvals.yaml", why: "the signed gate ledger — explicit even though *.md cannot match it" },
];

/**
 * Path-prove a content-only assertion against EVERY changed path (both rename
 * sides). Pure. proven === true only when every path is covered by a proof
 * glob and hit by no exclusion; `unproven` lists every path outside the proof
 * set (the evidence for the loud ignore line).
 * @returns {{proven: boolean, unproven: string[]}}
 */
export function proveContentOnly(paths) {
  const covered = (p) =>
    !CONTENT_ONLY_PROOF_EXCLUDES.some((x) => matchesGlob(p, x.glob)) &&
    CONTENT_ONLY_PROOF_GLOBS.some((g) => matchesGlob(p, g.glob));
  const unproven = paths.filter((p) => !covered(p));
  return { proven: unproven.length === 0, unproven };
}

/**
 * Derive change kinds the globs cannot see, FROM the diff itself:
 *   D under a site app dir  → route-delete (a diff of absences)
 *   R under a site app dir  → route-rename (either side)
 * `content-only` is never derived — caller assertion only.
 */
export function deriveKinds(entries) {
  const kinds = new Set();
  for (const e of entries) {
    if (!e.paths.some((p) => APP_ROUTE_RE.test(p))) continue;
    if (e.status.startsWith("D")) kinds.add("route-delete");
    if (e.status.startsWith("R")) kinds.add("route-rename");
  }
  return [...kinds].sort();
}

/* ─────────────────────── resolution logic (pure) ─────────────────────── */

/** Which files/kinds of a change made a trigger fire (for the evidence trail). */
export function triggerMatchDetail(trigger, change) {
  const files = new Set();
  const kinds = new Set();
  for (const w of trigger.when_changed) {
    if (w.startsWith("kind:")) {
      const k = w.slice(5);
      if ((change.kinds ?? []).includes(k)) kinds.add(k);
    } else {
      for (const p of change.paths ?? []) if (matchesGlob(p, w)) files.add(p);
    }
  }
  return { files: [...files].sort(), kinds: [...kinds].sort() };
}

/**
 * Resolve one parsed diff against the class-map + registry. Pure — no git, no
 * filesystem — so both directions are testable.
 *
 * @param {{entries:Array<{status:string,paths:string[]}>, declaredKinds?:string[]}} input
 * @param doc parsed class-map (parseClassMap(...).doc)
 * @param reg parsed registry (parseRegistry(...))
 * @returns {{
 *   kinds: string[],           // derived ∪ HONORED declared, sorted (an
 *                              // unproven content-only never enters)
 *   contentOnly: {             // the path-proof verdict on the assertion
 *     asserted: boolean, proven: boolean|null, unproven: string[],
 *   },
 *   resolutions: Array<{
 *     site: string,
 *     vector: Record<string,string>|null,
 *     failClosed: string|null, failClosedWhy: string|null,
 *     triggers: Array<{id:string, files:string[], kinds:string[]}>,
 *     gates: string[],
 *   }>,
 *   noSiteGates: boolean,      // docs/scripts-only diff — nothing in scope
 *   errors: string[],          // harness-grade: non-empty ⇒ exit 1
 * }}
 */
export function resolveDiff({ entries, declaredKinds = [] }, doc, reg) {
  const errors = [];
  for (const k of declaredKinds) {
    if (!(doc.change_kinds ?? []).includes(k))
      errors.push(`declared kind "${k}" is not in gates/class-map.yaml change_kinds [${(doc.change_kinds ?? []).join(", ")}] — an undeclared vocabulary cannot classify a change`);
  }
  const paths = allPaths(entries);

  // PATH-PROOF the content-only assertion (header: CONTENT-ONLY PROOF SET).
  // An assertion is NOT evidence: unless every changed path lies inside the
  // proof set, the kind is STRIPPED before resolution — it never reaches
  // resolveChangeGates, so it cannot suppress the unmatched_change fail-closed
  // path. The verdict rides the result for the loud output line.
  const contentOnly = { asserted: declaredKinds.includes("content-only"), proven: null, unproven: [] };
  let honoredKinds = declaredKinds;
  if (contentOnly.asserted) {
    const proof = proveContentOnly(paths);
    contentOnly.proven = proof.proven;
    contentOnly.unproven = proof.unproven;
    if (!proof.proven) honoredKinds = declaredKinds.filter((k) => k !== "content-only");
  }
  const kinds = [...new Set([...deriveKinds(entries), ...honoredKinds])].sort();

  const siteDomains = new Set();
  const sitePaths = new Map(); // domain → its own paths
  const sharedPaths = [];      // non-site paths (packages/**, docs/**, …)
  for (const p of paths) {
    const d = siteOf(p);
    if (d) {
      siteDomains.add(d);
      if (!sitePaths.has(d)) sitePaths.set(d, []);
      sitePaths.get(d).push(p);
    } else {
      sharedPaths.push(p);
    }
  }

  const allRegistryIds = [...new Set(reg.gates.map((g) => g.id))].sort();
  const byDomain = new Map(doc.properties.map((p) => [p.domain, p]));
  const resolutions = [];

  // FAIL-CLOSED: sites/ touched "somehow" — a path under sites/ that names no
  // domain directory. No site to resolve, no subset to claim: full registry.
  const stranded = paths.filter((p) => STRANDED_SITES_RE.test(p));
  if (stranded.length > 0) {
    resolutions.push({
      site: "(unresolvable sites/ path)",
      vector: null,
      failClosed: "unclassified-site",
      failClosedWhy: `path(s) under sites/ name no <domain> directory [${stranded.join(", ")}] — sites/ was touched but no site resolves: FULL registry battery (${allRegistryIds.length} gates), fail-closed by construction.`,
      triggers: [],
      gates: allRegistryIds,
    });
  }

  for (const domain of [...siteDomains].sort()) {
    const property = byDomain.get(domain);
    // Shared paths ride along per-site: a packages/forms change obligates the
    // forms gates for every site this diff touches.
    const change = { paths: [...sitePaths.get(domain), ...sharedPaths].sort(), kinds };

    if (!property) {
      // FAIL-CLOSED: sites/ touched but no class-map property matches — an
      // unmapped site can claim no class floor, so it gets EVERYTHING.
      resolutions.push({
        site: domain,
        vector: null,
        failClosed: "unclassified-site",
        failClosedWhy: `sites/launches path(s) touched for "${domain}" but gates/class-map.yaml declares no such property — no vector, no class floor, no subset: FULL registry battery (${allRegistryIds.length} gates). Add the property row (with its full vector) to ${CLASS_MAP}.`,
        triggers: [],
        gates: allRegistryIds,
      });
      continue;
    }

    const r = resolveChangeGates(property, change, doc, reg);
    errors.push(...r.errors);
    const matchedIds = new Set(r.matched);
    const triggers = doc.change_triggers
      .filter((t) => matchedIds.has(t.id))
      .map((t) => ({ id: t.id, ...triggerMatchDetail(t, change) }));
    const failClosedWhy =
      r.failClosed === "unknown_dimension"
        ? `property carries \`unknown\` in [${PROPERTY_DIMS.filter((d) => property[d] === "unknown").join(", ")}] — NO subset benefit: full composed battery PLUS every situation add that could match under any resolution (fail_closed.unknown_dimension, lint-pinned).`
        : r.failClosed === "unmatched_change"
          ? "no change_trigger matched and the change is not declared content-only — unknown classification never buys a subset: FULL composed battery for this property (fail_closed.unmatched_change, lint-pinned)."
          : null;
    resolutions.push({
      site: domain,
      vector: Object.fromEntries(PROPERTY_DIMS.map((d) => [d, property[d]])),
      failClosed: r.failClosed,
      failClosedWhy,
      triggers,
      gates: [...r.gates].sort(),
    });
  }

  // No site touched: is anything trigger-relevant still in the diff (shared
  // surfaces like packages/forms/**)? Then the obligation is FLEET-SHARED —
  // report it rather than silently no-opping a forms/schema/analytics change.
  let noSiteGates = false;
  if (siteDomains.size === 0) {
    const change = { paths: sharedPaths, kinds };
    const fired = doc.change_triggers
      .filter((t) => {
        const d = triggerMatchDetail(t, change);
        return d.files.length > 0 || d.kinds.length > 0;
      })
      .map((t) => ({ id: t.id, ...triggerMatchDetail(t, change) }));
    if (fired.length === 0) {
      noSiteGates = stranded.length === 0; // docs/scripts-only — clean no-op (unless sites/ was strandedly touched)
    } else {
      const gates = new Set(doc.scope_map.change_relevant);
      for (const t of doc.change_triggers) if (fired.some((f) => f.id === t.id))
        for (const id of t.adds) gates.add(id);
      resolutions.push({
        site: "(fleet-shared surface — no single site in the diff)",
        vector: null,
        failClosed: null,
        failClosedWhy: null,
        triggers: fired,
        gates: [...gates].sort(),
      });
    }
  }

  return { kinds, contentOnly, resolutions, noSiteGates, errors };
}

/* ─────────────────── deterministic resolution block ───────────────────── */

/**
 * Render the resolution block. Deterministic for a given (diff, class-map,
 * registry): every list is sorted or in class-map order. `meta.generated` is
 * the ONLY run-varying line and is clearly marked as such.
 */
export function formatResolution(result, meta) {
  const L = [];
  L.push("═══ change-gates-resolve — per-change gate resolution ═══");
  L.push(`mode: INFORMATIONAL (M2) — posted as CI evidence, the D-20260719-09 "declared capability actually fired" trail;`);
  L.push(`      becomes BLOCKING when the job-spec envelope consumes this resolution at the M4 pilot. Broken resolver ⇒ exit 1, never a silent pass.`);
  L.push(`law:  gates/class-map.yaml — per-change set = (change_relevant ∪ matched trigger adds) ∩ composed WHICH-set; fail-closed law lint-pinned.`);
  L.push(`base: ${meta.base} → head: ${meta.head} · ${meta.entryCount} diff entr${meta.entryCount === 1 ? "y" : "ies"} · ${meta.pathCount} path(s) incl. both rename sides`);
  L.push(`kinds: ${result.kinds.length ? result.kinds.join(", ") : "(none)"} (route-rename/route-delete derived from the diff; content-only honored ONLY when path-proven)`);
  if (result.contentOnly?.asserted) {
    if (result.contentOnly.proven) {
      L.push("content-only: asserted AND path-proven — every changed path lies inside the declared content dirs (header: CONTENT-ONLY PROOF SET); the change_relevant floor may bind.");
    } else {
      L.push("content-only: ✗ content-only asserted but not path-proven — fail-closed applies. The assertion is IGNORED (stripped before resolution; it cannot suppress the unmatched_change law).");
      L.push(`  unproven path(s) outside the content dirs: ${result.contentOnly.unproven.join(", ")}`);
    }
  }
  if (meta.generated) L.push(`generated: ${meta.generated} (meta only — the block below is deterministic per diff)`);
  L.push("");

  if (result.noSiteGates) {
    L.push("RESOLUTION: no site gates in scope — the diff touches no sites/<domain>/**, launches/<domain>/**, or trigger-matched shared surface (docs/scripts-only change). Clean no-op.");
    return L.join("\n") + "\n";
  }

  for (const r of result.resolutions) {
    L.push(`── RESOLUTION site=${r.site}`);
    if (r.vector)
      L.push(`   vector: ${PROPERTY_DIMS.map((d) => `${d}=${r.vector[d]}`).join(" · ")}`);
    else
      L.push("   vector: (none — see fail-closed)");
    if (r.failClosed) {
      L.push(`   FAIL-CLOSED [${r.failClosed}]: ${r.failClosedWhy}`);
    } else {
      L.push("   fail-closed: none — triggers (or a proven content-only floor) classified the change");
    }
    if (r.triggers.length === 0) {
      L.push("   matched triggers: (none)");
    } else {
      L.push(`   matched triggers (${r.triggers.length}):`);
      for (const t of r.triggers) {
        const parts = [
          ...t.files.map((f) => `file ${f}`),
          ...t.kinds.map((k) => `kind:${k}`),
        ];
        L.push(`     · ${t.id} ← ${parts.join(" · ")}`);
      }
    }
    L.push(`   resolved gates (${r.gates.length}): ${r.gates.join(", ")}`);
    L.push("");
  }
  return L.join("\n") + "\n";
}

/* ──────────────────────────────── CLI ─────────────────────────────────── */

/** git name-status -M over merge-base(base, HEAD)..HEAD (front-gate pattern:
 * an unresolvable base is FATAL — the resolver refuses to guess). */
export function gitDiffEntries(root, base) {
  const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  let mergeBase;
  const candidates = [base, "origin/main", "main"].filter((b) => b && !/^0{7,}$/.test(b));
  for (const c of candidates) {
    try { mergeBase = git(["merge-base", c, "HEAD"]); break; } catch { /* try the next */ }
  }
  if (!mergeBase) {
    throw new Error(`cannot resolve a base commit to diff against (tried: ${candidates.join(", ") || "nothing"}). In CI pass --base <sha> (or env BASE); the resolver refuses to guess, because guessing means resolving the wrong diff.`);
  }
  const out = git(["diff", "--name-status", "-M", mergeBase, "HEAD"]);
  return { mergeBase, head: git(["rev-parse", "HEAD"]), entries: parseNameStatus(out) };
}

function main(argv) {
  const arg = (flag, dflt) => { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : dflt; };
  const args = (flag) => argv.flatMap((a, i) => (a === flag && argv[i + 1] ? [argv[i + 1]] : []));

  const root = resolve(arg("--root", REPO_ROOT));
  const base = arg("--base", process.env.BASE ?? "");
  const outPath = arg("--out", "");
  const declaredKinds = args("--kind");
  const mapPath = resolve(REPO_ROOT, arg("--class-map", CLASS_MAP));
  const regPath = resolve(REPO_ROOT, arg("--registry", REGISTRY));

  // Parse the law. A resolver reading a broken class-map/registry must fail
  // loud (exit 1) — resolving against garbage would be a silent pass.
  const reg = parseRegistry(readFileSync(regPath, "utf8"));
  if (reg.errors.length > 0) {
    for (const e of reg.errors) console.error(`  ✗ registry: ${e}`);
    throw new Error(`gates registry unparseable (${reg.errors.length} error(s)) — fix ${REGISTRY} (gate-registry-lint) before resolving.`);
  }
  const { doc, errors: parseErrors } = parseClassMap(readFileSync(mapPath, "utf8"));
  if (parseErrors.length > 0) {
    for (const e of parseErrors) console.error(`  ✗ class-map: ${e}`);
    throw new Error(`class-map unparseable (${parseErrors.length} error(s)) — fix ${CLASS_MAP} (class-map-lint) before resolving.`);
  }

  const { mergeBase, head, entries } = gitDiffEntries(root, base);
  const result = resolveDiff({ entries, declaredKinds }, doc, reg);
  if (result.errors.length > 0) {
    for (const e of result.errors) console.error(`  ✗ ${e}`);
    throw new Error(`resolution produced ${result.errors.length} internal error(s) — a resolver that cannot classify its own law must not pass.`);
  }

  const block = formatResolution(result, {
    base: mergeBase.slice(0, 12),
    head: head.slice(0, 12),
    entryCount: entries.length,
    pathCount: allPaths(entries).length,
    generated: new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour12: false })
      .replace(/(\d{2})\/(\d{2})\/(\d{4}), /, "$3-$2-$1 ") + " IST",
  });

  process.stdout.write(block);
  if (outPath) {
    writeFileSync(resolve(outPath), block);
    console.log(`resolution written: ${resolve(outPath)}`);
  }
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`change-gates-resolve: harness error — ${e.message}`);
    process.exit(1); // fail LOUD: a broken resolver never silently passes
  }
}
