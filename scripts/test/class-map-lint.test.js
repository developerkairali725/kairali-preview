// class-map-lint.test.js — tests for the policy-composition lint on
// gates/class-map.yaml (merge plan §2.2 / §7.1 decision 2; M0(a) disposition 3).
//
// House rule (gate-registry-lint.test.js, merge-continuity-lint.test.js):
// every detector is tested in BOTH directions — the clean input must PASS and
// the broken input must FAIL, for the same detector, in the same run. A lint
// that always says no gets deleted; one that always says yes is a comment.
//
// house style: plain ESM + node --test; fixtures in tmp dirs; nothing mocked
// over the network.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { parseRegistry } from "../gate-registry-lint.mjs";
import {
  CLASS_MAP, FAIL_CLOSED_LAW, PENDING_SIBLING_IDS, PROBE_MAP_FULL, PROBE_REGISTRY,
  REGISTRY, REPO_ROOT, REQUIRED_CHANGE_KINDS, REQUIRED_TRIGGERED,
  lint, matchesGlob, overlayMatches, parseClassMap, resolveChangeGates,
  resolveVector, runControlProbes, triggerMatches,
} from "../class-map-lint.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LINT_BIN = resolve(HERE, "..", "class-map-lint.mjs");

const probeReg = parseRegistry(PROBE_REGISTRY);
const probeExists = (p) => p.startsWith("probe/");

/** Parse + lint a class-map text against the probe registry in one step. */
const check = (text, reg = probeReg, exists = probeExists) => {
  const { doc, errors: parseErrors } = parseClassMap(text);
  const r = lint(doc, reg, { exists });
  return { errors: [...parseErrors, ...r.errors], pendingSibling: r.pendingSibling, doc };
};

// ── control probes ───────────────────────────────────────────────────────────

test("control probes pass (the gate is not broken)", () => {
  assert.deepEqual(runControlProbes(), []);
});

// ── green path ───────────────────────────────────────────────────────────────

test("known-good class-map passes; pending-sibling ids are tolerated AND reported", () => {
  const r = check(PROBE_MAP_FULL);
  assert.deepEqual(r.errors, []);
  // "baseline" is on the FIXED sibling list and absent from the probe registry:
  // tolerated (no error above) and reported (here) — never silently accepted.
  assert.deepEqual(r.pendingSibling, ["baseline"]);
  assert.ok(PENDING_SIBLING_IDS.has("baseline"));
  assert.equal(r.doc.properties.length, 2); // probe.example + probe-unknown.example
  assert.equal(r.doc.test_vectors.length, 24);
  assert.equal(r.doc.change_triggers.length, 1);
  assert.deepEqual(r.doc.change_kinds, ["route-rename", "route-delete", "content-only"]);
});

test("an id that is neither in the registry nor on the fixed sibling list FAILS", () => {
  const rogue = PROBE_MAP_FULL.replace("adds: [baseline]", "adds: [baseline, made-up-gate]");
  assert.ok(check(rogue).errors.some((e) => e.includes('unknown gate id "made-up-gate"')));
});

// ── NEVER-WEAKENS (rule g) — the check this file exists for ─────────────────

test("an overlay `removes:` key is a hard NEVER-WEAKENS error; the clean map is not", () => {
  assert.deepEqual(check(PROBE_MAP_FULL).errors, []); // clean direction
  const removes = PROBE_MAP_FULL.replace("    adds: [baseline]", "    adds: [baseline]\n    removes: [probe-a]");
  const errors = check(removes).errors;
  assert.ok(errors.some((e) => e.includes("NEVER-WEAKENS") && e.includes('"removes"')), errors.join("\n"));
});

test("every forbidden removal channel is caught (n_a, waives, disables, ...)", () => {
  for (const key of ["n_a", "waives", "exempts", "softens", "downgrades", "disables", "skips"]) {
    const bad = PROBE_MAP_FULL.replace("    adds: [baseline]", `    adds: [baseline]\n    ${key}: [probe-a]`);
    assert.ok(check(bad).errors.some((e) => e.includes("NEVER-WEAKENS") && e.includes(`"${key}"`)), `key ${key} not caught`);
  }
});

test("softening language in an adapt reason is a NEVER-WEAKENS error; sharpening language is not", () => {
  const sharp = 'probe-a: "judged with the probe lens sharpened, bar unchanged, in enough words"';
  assert.deepEqual(check(PROBE_MAP_FULL).errors, []); // the sharp reason passes
  for (const soft of [
    'probe-a: "this gate is not required for b2c surfaces"',
    'probe-a: "skip the full run here because the surface is small"',
    'probe-a: "waived for this class by convention since forever"',
    'probe-a: "optional on these pages given their traffic levels"',
  ]) {
    const bad = PROBE_MAP_FULL.replace(sharp, soft);
    assert.ok(check(bad).errors.some((e) => e.includes("NEVER-WEAKENS")), `not caught: ${soft}`);
  }
});

test("an unknown-but-not-forbidden overlay key is still a schema error", () => {
  const odd = PROBE_MAP_FULL.replace("    adds: [baseline]", "    adds: [baseline]\n    notes: something");
  assert.ok(check(odd).errors.some((e) => e.includes('unknown key "notes"')));
});

// ── ambiguous resolution ─────────────────────────────────────────────────────

test("two overlays adapting the same gate for the same vector is AMBIGUOUS; disjoint adapts are not", () => {
  // insert the second overlay row at the END of the overlays section (the
  // change_kinds line is the first thing after it)
  const ambiguous = PROBE_MAP_FULL.replace("change_kinds:", `  - id: probe-lens-2
    when:
      site_class: organic
    adapts:
      probe-a: "a second adapting row for the same gate, in enough words here"
change_kinds:`);
  const errors = check(ambiguous).errors;
  assert.ok(errors.some((e) => e.includes("AMBIGUOUS") && e.includes('"probe-a"')), errors.join("\n"));
  // disjoint direction: adapting a DIFFERENT gate from the second row is clean
  const disjoint = ambiguous.replace(
    'probe-a: "a second adapting row for the same gate, in enough words here"',
    'probe-b: "a second row adapting a different gate, in enough words here"');
  assert.deepEqual(check(disjoint).errors, []);
});

test("adapting a gate outside the composed set (n_a for the class, not added) fails", () => {
  // probe-b is n_a for landing; an overlay adapting it on a landing-only vector
  const bad = PROBE_MAP_FULL.replace("change_kinds:", `  - id: probe-landing-lens
    when:
      site_class: landing
    adapts:
      probe-b: "cannot sharpen a gate that does not bind here, enough words"
change_kinds:`);
  assert.ok(check(bad).errors.some((e) => e.includes("not in the composed set")));
});

// ── scope_map completeness (M0(a) disposition 3) ─────────────────────────────

test("an uncovered registry gate fails; full disjoint coverage passes", () => {
  assert.deepEqual(check(PROBE_MAP_FULL).errors, []); // covered direction
  const uncovered = PROBE_MAP_FULL.replace("  project_only:\n    - probe-b\n", "  project_only:\n");
  assert.ok(check(uncovered).errors.some((e) => e.includes('"probe-b"') && e.includes("NOT covered")));
});

test("a gate in BOTH scope lists fails (exactly-once law)", () => {
  const doubled = PROBE_MAP_FULL.replace("  project_only:\n    - probe-b\n", "  project_only:\n    - probe-b\n    - probe-a\n");
  assert.ok(check(doubled).errors.some((e) => e.includes("BOTH change_relevant and project_only")));
});

test("a duplicate id inside one scope list fails", () => {
  const dup = PROBE_MAP_FULL.replace("    - probe-b\n", "    - probe-b\n    - probe-b\n");
  assert.ok(check(dup).errors.some((e) => e.includes("duplicate id") && e.includes('"probe-b"')));
});

// ── composition mechanics ────────────────────────────────────────────────────

test("overlayMatches: scalar equality and any-of lists; resolveVector floors on the registry", () => {
  const vec = { site_class: "organic", business_model: "b2c", asset_situation: "existing", entity_register: "group-corporate", platform: "factory-next" };
  assert.equal(overlayMatches({ when: { asset_situation: ["existing", "migration"] } }, vec), true);
  assert.equal(overlayMatches({ when: { asset_situation: "migration" } }, vec), false);
  assert.equal(overlayMatches({ when: { business_model: "b2c", platform: "wordpress" } }, vec), false); // ALL entries must match

  const { doc } = parseClassMap(PROBE_MAP_FULL);
  const r = resolveVector(vec, "t", probeReg, doc.overlays);
  assert.deepEqual(r.errors, []);
  assert.ok(r.gates.has("probe-a") && r.gates.has("probe-b")); // registry floor
  assert.ok(r.gates.has("baseline"));                          // overlay add (existing asset)
  assert.equal(r.adapted.get("probe-a").overlay, "probe-lens");
  // n_a floors out: a landing vector does not carry probe-b
  const landing = { ...vec, site_class: "landing", asset_situation: "new", business_model: "b2b" };
  const rl = resolveVector(landing, "t2", probeReg, doc.overlays);
  assert.ok(!rl.gates.has("probe-b"));
});

test("selector never selects on scope; a scope-keyed overlay fails", () => {
  const bad = PROBE_MAP_FULL.replace("      business_model: b2c", "      scope: change");
  assert.ok(check(bad).errors.some((e) => e.includes("may not select on scope")));
});

test("site_class must mirror the registry classes line in both directions", () => {
  const missing = PROBE_MAP_FULL.replace("  site_class: [commerce, organic, landing]", "  site_class: [commerce, organic]");
  assert.ok(check(missing).errors.some((e) => e.includes('missing registry class "landing"')));
  const extra = PROBE_MAP_FULL.replace("  site_class: [commerce, organic, landing]", "  site_class: [commerce, organic, landing, external]");
  assert.ok(check(extra).errors.some((e) => e.includes('declares "external"')));
});

test("locale/market is a required dimension (plan §2.2): declared passes, dropped fails", () => {
  assert.deepEqual(check(PROBE_MAP_FULL).errors, []); // declared direction
  // dropping the dimension declaration fails loudly (the plan-named list is complete)
  const noDim = PROBE_MAP_FULL.replace("  locale_market: [en-in, en-global, en-us, en-eu, en-de-fr]\n", "");
  assert.ok(check(noDim).errors.some((e) => e.includes('"locale_market" missing or empty')));
  // a property without its locale_market value fails like any other dimension
  const noProp = PROBE_MAP_FULL.replace("    locale_market: en-global\n    platform: factory-next\noverlays:", "    platform: factory-next\noverlays:");
  assert.ok(check(noProp).errors.some((e) => e.includes('missing dimension "locale_market"')));
});

test("a property with a missing or undeclared dimension value fails; vectors must be exactly 24", () => {
  const missingDim = PROBE_MAP_FULL.replace("    platform: factory-next\noverlays:", "overlays:");
  assert.ok(check(missingDim).errors.some((e) => e.includes('missing dimension "platform"')));
  const undeclared = PROBE_MAP_FULL.replace("    business_model: b2c\n    asset_situation: existing", "    business_model: b2x\n    asset_situation: existing");
  assert.ok(check(undeclared).errors.some((e) => e.includes('business_model "b2x"')));
  const only23 = PROBE_MAP_FULL.replace(/  - id: probe-wf-24\n(    .+\n)+/, "");
  assert.ok(check(only23).errors.some((e) => e.includes("expected the 24 package workflows, found 23")));
});

test("unparseable lines are errors, never skipped; a missing workflow file fails", () => {
  const garbage = PROBE_MAP_FULL.replace('updated: "2026-07-19 00:00:00 IST"', 'updated: "2026-07-19 00:00:00 IST"\nrogue top-level line');
  assert.ok(check(garbage).errors.some((e) => e.includes("unexpected top-level line")));
  const garbageInSection = PROBE_MAP_FULL + "        stray deep line\n";
  assert.ok(check(garbageInSection).errors.some((e) => e.includes("unparseable test_vectors line")));
  const noFile = check(PROBE_MAP_FULL, probeReg, () => false).errors;
  assert.ok(noFile.some((e) => e.includes("workflow file does not exist")));
});

// ── change triggers + fail-closed law (external review pass 2, B5) ───────────

test("glob matcher: * is one segment, ** spans depth including zero", () => {
  assert.equal(matchesGlob("sites/kairali.com/next.config.ts", "sites/*/next.config.*"), true);
  assert.equal(matchesGlob("sites/kairali.com/app/page.tsx", "sites/*/app/**/page.tsx"), true); // zero-depth **
  assert.equal(matchesGlob("sites/x/app/a/b/page.tsx", "sites/*/app/**/page.tsx"), true);
  assert.equal(matchesGlob("packages/forms/src/index.ts", "packages/forms/**"), true);
  assert.equal(matchesGlob("packages/forms", "packages/forms/**"), true); // the dir itself
  assert.equal(matchesGlob("packages/formsx/src/index.ts", "packages/forms/**"), false);
  assert.equal(matchesGlob("sites/a/src/middleware.ts", "sites/*/middleware.*"), false); // * never crosses /
  assert.equal(matchesGlob("content/foo.md", "sites/*/app/**"), false);
});

test("triggerMatches: path globs and kind: entries both fire; neither fires on a miss", () => {
  const trigger = { when_changed: ["sites/*/next.config.*", "kind:route-delete"], adds: ["redirect-map-tests"] };
  assert.equal(triggerMatches(trigger, { paths: ["sites/kairali.com/next.config.ts"], kinds: [] }), true);
  assert.equal(triggerMatches(trigger, { paths: [], kinds: ["route-delete"] }), true);
  assert.equal(triggerMatches(trigger, { paths: ["content/foo.md"], kinds: ["content-only"] }), false);
});

test("resolveChangeGates: matched trigger adds project gates; content-only takes the floor; unmatched FAILS CLOSED to the full battery", () => {
  const { doc } = parseClassMap(PROBE_MAP_FULL);
  const vec = { site_class: "organic", business_model: "b2c", asset_situation: "existing", entity_register: "group-corporate", locale_market: "en-global", platform: "factory-next" };

  // trigger match: change_relevant (probe-a) ∪ trigger adds (redirect-map-tests)
  const hit = resolveChangeGates(vec, { paths: ["sites/x/next.config.ts"], kinds: [] }, doc, probeReg);
  assert.equal(hit.failClosed, null);
  assert.deepEqual(hit.matched, ["probe-url-surface"]);
  assert.ok(hit.gates.has("probe-a") && hit.gates.has("redirect-map-tests"));
  assert.ok(!hit.gates.has("probe-b")); // project_only, no trigger pulls it

  // provably content-only, no trigger: the change_relevant floor only
  const content = resolveChangeGates(vec, { paths: ["content/foo.md"], kinds: ["content-only"] }, doc, probeReg);
  assert.equal(content.failClosed, null);
  assert.ok(content.gates.has("probe-a") && !content.gates.has("redirect-map-tests") && !content.gates.has("probe-b"));

  // unmatched and NOT provably content-only: FULL battery (fail closed)
  const mystery = resolveChangeGates(vec, { paths: ["some/unmapped/file.ts"], kinds: [] }, doc, probeReg);
  assert.equal(mystery.failClosed, "unmatched_change");
  assert.ok(mystery.gates.has("probe-a") && mystery.gates.has("probe-b") && mystery.gates.has("redirect-map-tests"));
  assert.ok(mystery.gates.has("baseline")); // overlay add for existing assets rides the full battery
});

test("resolveChangeGates: an unknown dimension gets NO subset benefit — full battery plus wildcard-matched situation adds", () => {
  const { doc } = parseClassMap(PROBE_MAP_FULL);
  const vec = { site_class: "organic", business_model: "unknown", asset_situation: "new", entity_register: "internal", locale_market: "en-in", platform: "factory-next" };
  // even a change that WOULD match only one trigger, on a provably content-only
  // diff, still gets the full battery: unknown buys nothing
  const r = resolveChangeGates(vec, { paths: ["content/foo.md"], kinds: ["content-only"] }, doc, probeReg);
  assert.equal(r.failClosed, "unknown_dimension");
  assert.ok(r.gates.has("probe-a") && r.gates.has("probe-b") && r.gates.has("redirect-map-tests"));
  // asset_situation is known (new) so probe-legacy's [existing, migration] does
  // NOT wildcard-match — but an unknown asset_situation would pull it in
  assert.ok(!r.gates.has("baseline"));
  const vec2 = { ...vec, asset_situation: "unknown" };
  const r2 = resolveChangeGates(vec2, { paths: [], kinds: [] }, doc, probeReg);
  assert.ok(r2.gates.has("baseline"), "unknown must match situation overlays as a wildcard");
});

test("a stranded diff-reachable gate (B5 list, in registry, no trigger) fails; the covered map passes", () => {
  assert.deepEqual(check(PROBE_MAP_FULL).errors, []); // covered direction
  const noTrigger = PROBE_MAP_FULL.replace(
    "  - id: probe-url-surface\n    when_changed: [sites/*/next.config.*, kind:route-delete]\n    adds: [redirect-map-tests]\n", "");
  const errors = check(noTrigger).errors;
  assert.ok(errors.some((e) => e.includes('"redirect-map-tests"') && e.includes("not carried by ANY trigger row")), errors.join("\n"));
  assert.ok(REQUIRED_TRIGGERED.includes("redirect-map-tests"));
});

test("trigger schema: empty when_changed, empty adds, unknown gate id, undeclared kind, forbidden key — all fail", () => {
  const row = "  - id: probe-url-surface\n    when_changed: [sites/*/next.config.*, kind:route-delete]\n    adds: [redirect-map-tests]\n";
  const swap = (repl) => check(PROBE_MAP_FULL.replace(row, repl)).errors;

  assert.ok(swap("  - id: probe-url-surface\n    when_changed: []\n    adds: [redirect-map-tests]\n")
    .some((e) => e.includes("empty when_changed")));
  assert.ok(swap("  - id: probe-url-surface\n    when_changed: [sites/*/next.config.*]\n    adds: []\n")
    .some((e) => e.includes("empty adds")));
  assert.ok(swap("  - id: probe-url-surface\n    when_changed: [sites/*/next.config.*]\n    adds: [redirect-map-tests, made-up-gate]\n")
    .some((e) => e.includes('unknown gate id "made-up-gate"')));
  assert.ok(swap("  - id: probe-url-surface\n    when_changed: [kind:undeclared-kind]\n    adds: [redirect-map-tests]\n")
    .some((e) => e.includes('kind "undeclared-kind" is not declared')));
  assert.ok(swap(row + "    removes: [probe-a]\n")
    .some((e) => e.includes("NEVER-WEAKENS") && e.includes('"removes"')));
  // duplicate trigger id
  assert.ok(check(PROBE_MAP_FULL.replace(row, row + row)).errors.some((e) => e.includes("duplicate trigger id")));
});

test("FAIL-CLOSED LAW is pinned: missing block, weakened value, and extra clause all fail; the exact law passes", () => {
  assert.deepEqual(check(PROBE_MAP_FULL).errors, []); // exact-law direction
  const gone = PROBE_MAP_FULL.replace("fail_closed:\n  unmatched_change: full-battery\n  unknown_dimension: full-battery-plus-situation-adds\n", "");
  assert.ok(check(gone).errors.filter((e) => e.includes("FAIL-CLOSED LAW")).length === 2);
  const weakened = PROBE_MAP_FULL.replace("  unmatched_change: full-battery", "  unmatched_change: change-relevant-only");
  assert.ok(check(weakened).errors.some((e) => e.includes("FAIL-CLOSED LAW") && e.includes("full-battery")));
  const extra = PROBE_MAP_FULL.replace("  unmatched_change: full-battery", "  unmatched_change: full-battery\n  small_change: change-relevant-only");
  assert.ok(check(extra).errors.some((e) => e.includes('unknown key "small_change"')));
  assert.deepEqual(Object.keys(FAIL_CLOSED_LAW).sort(), ["unknown_dimension", "unmatched_change"]);
});

test("change_kinds: dropping a required kind fails; the declared trio passes", () => {
  assert.deepEqual(check(PROBE_MAP_FULL).errors, []); // declared direction
  const dropped = PROBE_MAP_FULL.replace("change_kinds: [route-rename, route-delete, content-only]", "change_kinds: [route-rename, route-delete]");
  assert.ok(check(dropped).errors.some((e) => e.includes('"content-only"') && e.includes("not declared")));
  const gone = PROBE_MAP_FULL.replace("change_kinds: [route-rename, route-delete, content-only]\n", "");
  assert.ok(check(gone).errors.some((e) => e.includes("change_kinds: missing or empty")));
  assert.deepEqual(REQUIRED_CHANGE_KINDS, ["route-rename", "route-delete", "content-only"]);
});

test("unknown honesty: pointer comment required on properties; unknown banned from test vectors", () => {
  assert.deepEqual(check(PROBE_MAP_FULL).errors, []); // pointed-unknown direction
  const bare = PROBE_MAP_FULL.replace(
    "    business_model: unknown          # owner ratification pending — probe fixture",
    "    business_model: unknown");
  assert.ok(check(bare).errors.some((e) => e.includes("owner-question pointer")));
  // a Q- id also satisfies the pointer requirement
  const qid = PROBE_MAP_FULL.replace(
    "    business_model: unknown          # owner ratification pending — probe fixture",
    "    business_model: unknown          # Q-CLASSMAP-PROBE-1");
  assert.deepEqual(check(qid).errors, []);
  // vectors: swap one declared value for unknown → fixture ban fires
  const vecUnknown = PROBE_MAP_FULL.replace("    business_model: shopify\n", "    business_model: unknown\n");
  assert.ok(check(vecUnknown).errors.some((e) => e.includes("never for fixtures")));
});

// ── CLI on tmp-dir fixtures (the harness end-to-end, exit codes included) ────

test("CLI: green fixture exits 0 with banner; never-weakens fixture exits 2", () => {
  const dir = mkdtempSync(join(tmpdir(), "class-map-lint-"));
  try {
    // fixture workflow paths must exist relative to REPO_ROOT — package.json does
    const fixtureMap = PROBE_MAP_FULL.replaceAll(/workflow: probe\/workflow-\d+\.md/g, "workflow: package.json");
    const regPath = join(dir, "registry.yaml");
    const mapPath = join(dir, "class-map.yaml");
    writeFileSync(regPath, PROBE_REGISTRY);
    writeFileSync(mapPath, fixtureMap);

    const good = spawnSync(process.execPath, [LINT_BIN, "--class-map", mapPath, "--registry", regPath], { encoding: "utf8" });
    assert.equal(good.status, 0, good.stdout + good.stderr);
    assert.ok(good.stdout.includes("PASS"), good.stdout);
    assert.ok(good.stdout.includes("PENDING-SIBLING (1): baseline"), good.stdout);

    writeFileSync(mapPath, fixtureMap.replace("    adds: [baseline]", "    adds: [baseline]\n    removes: [probe-a]"));
    const bad = spawnSync(process.execPath, [LINT_BIN, "--class-map", mapPath, "--registry", regPath], { encoding: "utf8" });
    assert.equal(bad.status, 2, bad.stdout + bad.stderr);
    assert.ok(bad.stdout.includes("NEVER-WEAKENS"), bad.stdout);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ── the REAL files (the gate on our own map) ─────────────────────────────────

test("gates/class-map.yaml passes against the real gates/registry.yaml", () => {
  const reg = parseRegistry(readFileSync(resolve(REPO_ROOT, REGISTRY), "utf8"));
  assert.deepEqual(reg.errors, []);
  const { doc, errors: parseErrors } = parseClassMap(readFileSync(resolve(REPO_ROOT, CLASS_MAP), "utf8"));
  assert.deepEqual(parseErrors, []);
  const r = lint(doc, reg, { exists: (p) => existsSync(join(REPO_ROOT, p)) });
  assert.deepEqual(r.errors, []);
  assert.equal(doc.test_vectors.length, 24);
  assert.ok(doc.properties.length >= 25, `every STATUS.yaml fleet domain declared (got ${doc.properties.length})`);
  // scope partition covers the registry exactly (redundant with lint, kept explicit)
  const scoped = new Set([...doc.scope_map.change_relevant, ...doc.scope_map.project_only]);
  for (const g of reg.gates) assert.ok(scoped.has(g.id), `gate ${g.id} unscoped`);

  // B5 remedy present in the real map: triggers, pinned law, honest unknowns
  assert.ok(doc.change_triggers.length >= 8, `change_triggers rows (got ${doc.change_triggers.length})`);
  assert.deepEqual(doc.fail_closed, FAIL_CLOSED_LAW);
  const triggered = new Set(doc.change_triggers.flatMap((t) => t.adds));
  const registryIds = new Set(reg.gates.map((g) => g.id));
  for (const id of REQUIRED_TRIGGERED) {
    assert.ok(registryIds.has(id), `B5 gate ${id} missing from the real registry`);
    assert.ok(triggered.has(id), `B5 gate ${id} not carried by any real trigger`);
  }
  // the owner-ruled values stand (D-20260719-33 b1-b4, PR #175 absorbed per
  // CARD-3): zero unknown dimensions remain in the real map
  const prop = (d) => doc.properties.find((p) => p.domain === d);
  assert.equal(prop("kairali.ai").business_model, "internal");
  assert.equal(prop("kairali.ai").locale_market, "en-in");
  assert.equal(prop("kairaliproduct.com").locale_market, "en-global");
  assert.equal(prop("kairaliequipment.com").locale_market, "en-global");
  for (const p of doc.properties)
    for (const v of Object.values(p)) assert.notEqual(v, "unknown");

  // reference resolver against the REAL map: a forms change on a real property
  // pulls forms-crm-parity + consent-mode in; an unmapped diff fails closed
  const blush = prop("theblushlounge.com");
  const formsChange = resolveChangeGates(blush, { paths: ["sites/theblushlounge.com/app/contact/page.tsx"], kinds: [] }, doc, reg);
  assert.equal(formsChange.failClosed, null);
  assert.ok(formsChange.gates.has("forms-crm-parity") && formsChange.gates.has("consent-mode"));
  const mystery = resolveChangeGates(blush, { paths: ["scripts/new-mystery-surface.mjs"], kinds: [] }, doc, reg);
  assert.equal(mystery.failClosed, "unmatched_change");
  // fail-closed law on unknown dims stays tested via a SYNTHETIC clone — the
  // real map has zero unknowns since D-20260719-33 and must stay that way
  const unknownProp = { ...prop("kairali.ai"), locale_market: "unknown" };
  assert.equal(resolveChangeGates(unknownProp, { paths: ["content/x.md"], kinds: ["content-only"] }, doc, reg).failClosed, "unknown_dimension");
});
