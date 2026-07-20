// change-gates-resolve.test.js — tests for the CI-facing per-change gate
// resolver (scripts/change-gates-resolve.mjs; external pass 3 "implement the
// actual diff resolver", D-20260719-09 enforcement start).
//
// House rule (class-map-lint.test.js, front-gate.test.js): every behaviour is
// tested in BOTH directions — the surface diff must PULL its gates and the
// clean/no-op diff must NOT; fail-closed must fire and must not overfire.
// Pure resolution is tested against the REAL gates/class-map.yaml +
// gates/registry.yaml (they are the law being resolved); the CLI is tested
// end-to-end against REAL git fixture repos (git init in a tmp dir, real
// commits, real `--name-status -M` rename detection).
//
// house style: plain ESM + node --test; fixtures in tmp dirs; nothing mocked
// over the network.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import { parseRegistry } from "../gate-registry-lint.mjs";
import { CLASS_MAP, REGISTRY, REPO_ROOT, parseClassMap } from "../class-map-lint.mjs";
import {
  allPaths, deriveKinds, formatResolution, parseNameStatus, proveContentOnly,
  resolveDiff, siteOf, triggerMatchDetail,
} from "../change-gates-resolve.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const BIN = resolve(HERE, "..", "change-gates-resolve.mjs");

// The REAL law — the resolver's whole job is to apply these two files.
const reg = parseRegistry(readFileSync(resolve(REPO_ROOT, REGISTRY), "utf8"));
const { doc, errors: mapErrors } = parseClassMap(readFileSync(resolve(REPO_ROOT, CLASS_MAP), "utf8"));

test("preflight: the real class-map and registry parse (the law is readable)", () => {
  assert.deepEqual(reg.errors, []);
  assert.deepEqual(mapErrors, []);
  assert.ok(doc.change_triggers.length >= 8);
});

/** One M-status entry per path. */
const modified = (...paths) => paths.map((p) => ({ status: "M", paths: [p] }));
const resolveM = (paths, kinds = []) =>
  resolveDiff({ entries: modified(...paths), declaredKinds: kinds }, doc, reg);

// ── diff parsing: both rename sides ─────────────────────────────────────────

test("parseNameStatus keeps BOTH sides of a rename; allPaths surfaces both", () => {
  const entries = parseNameStatus(
    "M\tsites/kairali.com/app/page.tsx\nR100\tsites/kairali.com/vercel.json\tsites/kairali.com/vercel.json.bak\n");
  assert.equal(entries.length, 2);
  assert.deepEqual(entries[1].paths,
    ["sites/kairali.com/vercel.json", "sites/kairali.com/vercel.json.bak"]);
  assert.deepEqual(allPaths(entries), [
    "sites/kairali.com/app/page.tsx",
    "sites/kairali.com/vercel.json",
    "sites/kairali.com/vercel.json.bak",
  ]);
});

test("siteOf: sites/ and launches/ paths map to a domain; shared paths do not", () => {
  assert.equal(siteOf("sites/kairali.com/app/page.tsx"), "kairali.com");
  assert.equal(siteOf("launches/villaraag.com/approvals.yaml"), "villaraag.com");
  assert.equal(siteOf("packages/forms/input.tsx"), null);
  assert.equal(siteOf("docs/reports/x.md"), null);
  // a FILE directly under sites/ or launches/ names no domain (found live:
  // launches/README-gsc-snapshot-2026-07-19.md is a ledger doc, not a site)
  assert.equal(siteOf("launches/README-gsc-snapshot-2026-07-19.md"), null);
  assert.equal(siteOf("sites/README.md"), null);
});

test("a launches/ ledger doc (direct file) is a docs-grade path, not a phantom site", () => {
  const r = resolveM(["launches/README-gsc-snapshot-2026-07-19.md"]);
  assert.deepEqual(r.errors, []);
  assert.equal(r.noSiteGates, true); // no phantom "README-…" site, clean no-op
});

test("a direct file under sites/ fails closed — sites/ touched, no site resolves", () => {
  const r = resolveM(["sites/README.md"]);
  assert.equal(r.noSiteGates, false);
  const [res] = r.resolutions;
  assert.equal(res.failClosed, "unclassified-site");
  assert.match(res.failClosedWhy, /sites\/README\.md/);
  assert.equal(res.gates.length, reg.gates.length); // full registry, no floor
});

test("deriveKinds: route deletions/renames under app dirs are derived; content-only NEVER is", () => {
  const del = [{ status: "D", paths: ["sites/kairali.com/app/old/page.tsx"] }];
  const ren = [{ status: "R100", paths: ["sites/x.com/src/app/a/page.tsx", "sites/x.com/src/app/b/page.tsx"] }];
  const comp = [{ status: "D", paths: ["sites/kairali.com/components/nav.tsx"] }];
  assert.deepEqual(deriveKinds(del), ["route-delete"]);
  assert.deepEqual(deriveKinds(ren), ["route-rename"]);
  assert.deepEqual(deriveKinds(comp), []); // a component delete is not a route event
  assert.ok(!deriveKinds(del).includes("content-only"));
});

// ── trigger pulls: each B5 surface pulls its gates (and only when touched) ──

test("URL-surface diff (middleware) pulls the redirect/canonical set", () => {
  const r = resolveM(["sites/kairali.com/middleware.ts"]);
  assert.deepEqual(r.errors, []);
  const [res] = r.resolutions;
  assert.equal(res.site, "kairali.com");
  assert.equal(res.failClosed, null);
  const ids = res.triggers.map((t) => t.id);
  assert.ok(ids.includes("url-redirect-surfaces"), ids.join(","));
  assert.ok(ids.includes("security-surfaces")); // middleware is also security surface
  for (const g of ["redirect-map-tests", "meta-canonical-crawl-files", "internal-link-crawl", "zap-baseline"])
    assert.ok(res.gates.includes(g), `missing ${g}`);
  // evidence trail: the trigger names the matching file
  const url = res.triggers.find((t) => t.id === "url-redirect-surfaces");
  assert.deepEqual(url.files, ["sites/kairali.com/middleware.ts"]);
  // and the change subset stays a SUBSET: project-engagement gates not pulled
  assert.ok(!res.gates.includes("launch-evidence-gate"));
});

test("forms diff (enquiry API route) pulls the forms gates", () => {
  const r = resolveM(["sites/kairali.com/app/api/enquiry/route.ts"]);
  const [res] = r.resolutions;
  assert.equal(res.failClosed, null);
  assert.ok(res.triggers.some((t) => t.id === "forms-surfaces"));
  assert.ok(res.gates.includes("forms-crm-parity"));
  assert.ok(res.gates.includes("consent-mode"));
});

test("clean direction: a plain page edit does NOT pull forms/redirect gates", () => {
  const r = resolveM(["sites/kairali.com/app/about/page.tsx"]);
  const [res] = r.resolutions;
  assert.equal(res.failClosed, null); // keyword/meta triggers classify it
  assert.ok(!res.gates.includes("forms-crm-parity"));
  assert.ok(!res.gates.includes("redirect-map-tests"));
  assert.ok(res.gates.includes("keyword-map")); // every page edit re-verifies the keyword map
  assert.ok(res.gates.includes("meta-canonical-crawl-files"));
});

test("docs/scripts-only diff resolves to no site gates in scope", () => {
  const r = resolveM(["docs/reports/2026-07-19-x.md", "scripts/doctor.mjs"]);
  assert.deepEqual(r.errors, []);
  assert.equal(r.noSiteGates, true);
  assert.deepEqual(r.resolutions, []);
  assert.match(formatResolution(r, { base: "b", head: "h", entryCount: 2, pathCount: 2 }),
    /no site gates in scope/);
});

test("fleet-shared surface (packages/forms, no site path) is REPORTED, never a silent no-op", () => {
  const r = resolveM(["packages/forms/input.tsx"]);
  assert.equal(r.noSiteGates, false);
  const [res] = r.resolutions;
  assert.match(res.site, /fleet-shared/);
  assert.ok(res.triggers.some((t) => t.id === "forms-surfaces"));
  assert.ok(res.gates.includes("forms-crm-parity"));
});

// ── fail-closed law: fires when it must, not when it must not ───────────────

test("unknown-dimension property fails closed to the full battery + situation adds", () => {
  // synthetic clone: the REAL map has zero unknowns since D-20260719-33
  // (kairali.ai ruled internal/en-in) — the fail-closed law stays tested on a
  // doc whose kairali.ai row has one dimension knocked back to unknown
  const unknownDoc = {
    ...doc,
    properties: doc.properties.map((p) =>
      p.domain === "kairali.ai" ? { ...p, locale_market: "unknown" } : p),
  };
  const r = resolveDiff({ entries: modified("sites/kairali.ai/app/page.tsx"), declaredKinds: [] }, unknownDoc, reg);
  const [res] = r.resolutions;
  assert.equal(res.failClosed, "unknown_dimension");
  assert.match(res.failClosedWhy, /unknown/);
  // FULL battery: project-engagement gates present, not just the change floor
  assert.ok(res.gates.includes("launch-evidence-gate"));
  assert.ok(res.gates.includes("baseline")); // situation add (existing asset)
  // no subset benefit even though the SAME page-edit on kairali.com resolves a subset
  const known = resolveM(["sites/kairali.com/app/page.tsx"]).resolutions[0];
  assert.ok(res.gates.length > known.gates.length);
});

test("unmatched, un-asserted change fails closed to the full composed battery", () => {
  const r = resolveM(["sites/kairali.com/components/nav.tsx"]);
  const [res] = r.resolutions;
  assert.equal(res.failClosed, "unmatched_change");
  assert.deepEqual(res.triggers, []);
  assert.ok(res.gates.includes("launch-evidence-gate")); // full battery, not the floor
});

// ── content-only path proof (M2 external review blocker: the assertion must
// never suppress fail-closed without proof) — both directions ────────────────

test("proveContentOnly: content dirs prove; law, ledgers, binaries and code do NOT", () => {
  // proven side — the four content-dir globs
  assert.deepEqual(proveContentOnly([
    "content/ledger.yaml",
    "docs/reports/2026-07-19-x.md",
    "launches/kairali.com/BRIEF.md",
    "wiki/log.md",
  ]), { proven: true, unproven: [] });
  // unproven side — every exclusion and every non-content surface
  for (const p of [
    "docs/process/os-2026/merge/strict-residues.yaml", // machine-consumed OS law
    "launches/kairali.com/approvals.yaml",             // signed gate ledger
    "launches/kairali.com/screens/home.png",           // binary, not *.md
    "content-mined/old-site/page.html",                // immutable raw layer
    "sites/kairali.com/components/nav.tsx",            // code is never content
    "scripts/change-gates-resolve.mjs",
    "gates/class-map.yaml",
  ]) {
    const v = proveContentOnly([p]);
    assert.equal(v.proven, false, `${p} must NOT prove content-only`);
    assert.deepEqual(v.unproven, [p]);
  }
});

test("path-PROVEN content-only rides the change_relevant floor (launches/ evidence doc)", () => {
  const path = "launches/kairali.com/BRIEF.md"; // resolves to site kairali.com, matches no trigger
  // direction 1: without the assertion the same diff fails closed
  const bare = resolveM([path]).resolutions[0];
  assert.equal(bare.failClosed, "unmatched_change");
  // direction 2: asserted AND proven → floor, no fail-closed
  const r = resolveM([path], ["content-only"]);
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.contentOnly, { asserted: true, proven: true, unproven: [] });
  assert.deepEqual(r.kinds, ["content-only"]);
  const [res] = r.resolutions;
  assert.equal(res.failClosed, null);
  assert.ok(res.gates.includes("build-clean"));
  assert.ok(!res.gates.includes("launch-evidence-gate")); // floor, not battery
});

test("SMUGGLED sites/ file: the content-only assertion is IGNORED and fail-closed runs", () => {
  // the exact escape hatch the external review named — this diff used to ride
  // the floor on the caller's word alone
  const r = resolveM(["sites/kairali.com/components/nav.tsx"], ["content-only"]);
  assert.deepEqual(r.errors, []);
  assert.equal(r.contentOnly.asserted, true);
  assert.equal(r.contentOnly.proven, false);
  assert.deepEqual(r.contentOnly.unproven, ["sites/kairali.com/components/nav.tsx"]);
  assert.deepEqual(r.kinds, []); // the stripped kind never enters resolution
  const [res] = r.resolutions;
  assert.equal(res.failClosed, "unmatched_change"); // full composed battery
  assert.ok(res.gates.includes("launch-evidence-gate"));
});

test("MIXED diff (proven doc + smuggled code) is unproven — one outside file kills the assertion", () => {
  const r = resolveM(
    ["launches/kairali.com/BRIEF.md", "sites/kairali.com/components/nav.tsx"],
    ["content-only"]);
  assert.equal(r.contentOnly.proven, false);
  assert.deepEqual(r.contentOnly.unproven, ["sites/kairali.com/components/nav.tsx"]);
  assert.equal(r.resolutions[0].failClosed, "unmatched_change");
});

test("the resolution block prints the proof verdict loud, both directions", () => {
  const meta = { base: "b", head: "h", entryCount: 1, pathCount: 1 };
  const proven = formatResolution(
    resolveM(["launches/kairali.com/BRIEF.md"], ["content-only"]), meta);
  assert.match(proven, /content-only: asserted AND path-proven/);
  const ignored = formatResolution(
    resolveM(["sites/kairali.com/components/nav.tsx"], ["content-only"]), meta);
  assert.match(ignored, /content-only asserted but not path-proven — fail-closed applies/);
  assert.match(ignored, /unproven path\(s\) outside the content dirs: sites\/kairali\.com\/components\/nav\.tsx/);
  // and an un-asserted run says nothing about content-only proof
  const plain = formatResolution(resolveM(["sites/kairali.com/middleware.ts"]), meta);
  assert.ok(!plain.includes("path-proven —"));
});

test("a site path with NO class-map property fails closed to the FULL registry", () => {
  const r = resolveM(["sites/not-a-real-site.example/app/page.tsx"]);
  const [res] = r.resolutions;
  assert.equal(res.failClosed, "unclassified-site");
  assert.equal(res.vector, null);
  assert.equal(res.gates.length, reg.gates.length); // everything — no floor to claim
});

test("an undeclared --kind is a harness error (never a silent classification)", () => {
  const r = resolveM(["docs/x.md"], ["totally-made-up-kind"]);
  assert.ok(r.errors.some((e) => e.includes("totally-made-up-kind")));
});

// ── rename both-sides (pure) ────────────────────────────────────────────────

test("rename AWAY from a guarded path still fires its trigger (old side counts)", () => {
  const entries = parseNameStatus("R100\tsites/kairali.com/vercel.json\tsites/kairali.com/vercel.moved\n");
  const r = resolveDiff({ entries }, doc, reg);
  const [res] = r.resolutions;
  const url = res.triggers.find((t) => t.id === "url-redirect-surfaces");
  assert.ok(url, "url-redirect-surfaces did not fire on the renamed-away vercel.json");
  assert.ok(url.files.includes("sites/kairali.com/vercel.json"));
  assert.ok(res.gates.includes("redirect-map-tests"));
});

test("a route rename derives kind:route-rename and fires the URL trigger via the kind", () => {
  const entries = parseNameStatus("R100\tsites/kairali.com/app/old/page.tsx\tsites/kairali.com/app/new/page.tsx\n");
  const r = resolveDiff({ entries }, doc, reg);
  assert.deepEqual(r.kinds, ["route-rename"]);
  const [res] = r.resolutions;
  const url = res.triggers.find((t) => t.id === "url-redirect-surfaces");
  assert.ok(url && url.kinds.includes("route-rename"));
  assert.ok(res.gates.includes("redirect-map-tests"));
});

// ── determinism ─────────────────────────────────────────────────────────────

test("the resolution block is deterministic (same diff ⇒ byte-identical body)", () => {
  const meta = { base: "aaaa", head: "bbbb", entryCount: 2, pathCount: 2 };
  const paths = ["sites/kairali.com/middleware.ts", "packages/schema/emit.ts"];
  const a = formatResolution(resolveM(paths), meta);
  const b = formatResolution(resolveM([...paths].reverse()), meta);
  assert.equal(a, b);
  assert.match(a, /schema-structured-data/);
});

// ── CLI end-to-end against a REAL git fixture ───────────────────────────────

function gitFixture() {
  const dir = mkdtempSync(join(tmpdir(), "cgr-git-"));
  const git = (...args) => {
    const r = spawnSync("git", args, { cwd: dir, encoding: "utf8" });
    assert.equal(r.status, 0, `git ${args.join(" ")} failed: ${r.stderr}`);
    return r.stdout.trim();
  };
  git("init", "-q", "-b", "main");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "Test");
  mkdirSync(join(dir, "sites/kairali.com/app"), { recursive: true });
  mkdirSync(join(dir, "docs"), { recursive: true });
  writeFileSync(join(dir, "sites/kairali.com/vercel.json"),
    JSON.stringify({ redirects: [{ source: "/a", destination: "/b", permanent: true }] }, null, 2));
  writeFileSync(join(dir, "sites/kairali.com/app/page.tsx"), "export default function P(){return null}\n");
  writeFileSync(join(dir, "docs/readme.md"), "# docs\n");
  git("add", "-A");
  git("commit", "-q", "-m", "base");
  const baseSha = git("rev-parse", "HEAD");
  return { dir, git, baseSha };
}

const runCli = (dir, baseSha, extra = []) =>
  spawnSync(process.execPath, [BIN, "--root", dir, "--base", baseSha, ...extra], { encoding: "utf8" });

test("e2e: URL-surface commit resolves via the real git diff; --out written; exit 0", () => {
  const { dir, git, baseSha } = gitFixture();
  try {
    writeFileSync(join(dir, "sites/kairali.com/middleware.ts"), "export function middleware(){}\n");
    git("add", "-A");
    git("commit", "-q", "-m", "add middleware");
    const out = join(dir, "resolution.txt");
    const r = runCli(dir, baseSha, ["--out", out]);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /url-redirect-surfaces/);
    assert.match(r.stdout, /site=kairali\.com/);
    assert.match(r.stdout, /INFORMATIONAL/);
    const written = readFileSync(out, "utf8");
    assert.match(written, /url-redirect-surfaces ← file sites\/kairali\.com\/middleware\.ts/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("e2e: a real `git mv` rename is seen on BOTH sides (-M) and fires the trigger", () => {
  const { dir, git, baseSha } = gitFixture();
  try {
    git("mv", "sites/kairali.com/vercel.json", "sites/kairali.com/vercel.json.bak");
    git("commit", "-q", "-m", "rename vercel.json away");
    const r = runCli(dir, baseSha);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    // old side (sites/*/vercel.json) fired even though the surviving path cannot match
    assert.match(r.stdout, /url-redirect-surfaces ← file sites\/kairali\.com\/vercel\.json/);
    assert.match(r.stdout, /redirect-map-tests/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("e2e: --kind content-only on a code diff is IGNORED loud; on a proven doc diff it rides the floor", () => {
  const { dir, git, baseSha } = gitFixture();
  try {
    // smuggled direction: a sites/ code file with the assertion
    writeFileSync(join(dir, "sites/kairali.com/app/nav.tsx"), "export const Nav = () => null;\n");
    git("add", "-A");
    git("commit", "-q", "-m", "component edit smuggled as content-only");
    const smuggled = runCli(dir, baseSha, ["--kind", "content-only"]);
    assert.equal(smuggled.status, 0, smuggled.stderr + smuggled.stdout);
    assert.match(smuggled.stdout, /content-only asserted but not path-proven — fail-closed applies/);
    assert.match(smuggled.stdout, /FAIL-CLOSED \[unmatched_change\]/);
    // proven direction: a launches/ evidence doc with the same assertion
    mkdirSync(join(dir, "launches/kairali.com"), { recursive: true });
    writeFileSync(join(dir, "launches/kairali.com/BRIEF.md"), "# brief\n");
    git("add", "-A");
    git("commit", "-q", "-m", "brief doc");
    const proven = runCli(dir, git("rev-parse", "HEAD~1"), ["--kind", "content-only"]);
    assert.equal(proven.status, 0, proven.stderr + proven.stdout);
    assert.match(proven.stdout, /content-only: asserted AND path-proven/);
    assert.match(proven.stdout, /fail-closed: none/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("e2e: docs-only commit is a clean no-op (exit 0, no site gates in scope)", () => {
  const { dir, git, baseSha } = gitFixture();
  try {
    writeFileSync(join(dir, "docs/readme.md"), "# docs, edited\n");
    git("add", "-A");
    git("commit", "-q", "-m", "docs edit");
    const r = runCli(dir, baseSha);
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /no site gates in scope/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("e2e: an unparseable class-map is exit 1 — a broken resolver never silently passes", () => {
  const { dir, git, baseSha } = gitFixture();
  try {
    writeFileSync(join(dir, "sites/kairali.com/middleware.ts"), "export function middleware(){}\n");
    git("add", "-A");
    git("commit", "-q", "-m", "add middleware");
    const garbage = join(dir, "garbage.yaml");
    writeFileSync(garbage, "this is: [not, a, class, map\n  ::::\n");
    const r = runCli(dir, baseSha, ["--class-map", garbage]);
    assert.equal(r.status, 1, `expected exit 1, got ${r.status}: ${r.stdout}`);
    assert.match(r.stderr, /harness error/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("e2e: an unresolvable base is exit 1 (the resolver refuses to guess)", () => {
  const dir = mkdtempSync(join(tmpdir(), "cgr-nogit-"));
  try {
    spawnSync("git", ["init", "-q", "-b", "main"], { cwd: dir });
    // no commits at all — no merge-base can exist
    const r = runCli(dir, "deadbeef");
    assert.equal(r.status, 1);
    assert.match(r.stderr, /cannot resolve a base commit/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
