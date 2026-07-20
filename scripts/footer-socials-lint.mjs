#!/usr/bin/env node
/**
 * footer-socials-lint.mjs — fleet-wide footer social-links gate (D-20260718-04).
 *
 * WHY THIS EXISTS. Abilash's 18 Jul 2026 directive (D-20260718-04): every
 * fleet footer carries the group social set. PR #127 honestly stopped short
 * because no verified handle set existed in the repo; the owner's
 * D-SOCIALS-INTERIM ruling (18 Jul, weekend unblock walk) supplied it — the
 * director@ SIGNATURE set + Pinterest from live, each URL verified before
 * shipping. This lint makes the parity mechanical: a fleet site whose footer
 * does not render the shared @kairali/social nav fails CI on the PR that
 * ships it, and a handle hardcoded outside the ONE config file fails too —
 * the Astha/Anupam true-up must stay a one-file change.
 *
 * WHAT IT CHECKS, per non-exempt sites/<dir> (site.config.json present):
 *   1. some app/ source renders <SocialLinks …/> — the ONE shared component
 *      imported from "@kairali/social", never a local copy (Factory rule:
 *      packages/* only);
 *   2. FOOTER PLACEMENT: the file that renders it also contains <footer —
 *      the directive is footer parity, not a link dropped anywhere;
 *   3. ONE SOURCE OF TRUTH: no site source hardcodes any canonical profile
 *      URL (the URLs are read from packages/social/src/config.ts at lint
 *      time, so the two can never drift apart);
 *   4. package.json declares "@kairali/social" and next.config.ts transpiles
 *      it (the package ships TSX source, like consent/analytics).
 *
 * EXEMPTIONS: reused VERBATIM from scripts/factory-matrix-lint.mjs EXEMPT —
 * one exemption ledger, not two drifting ones (abhilashkr + kairali.ai per
 * D-RULE-MATRIX-EXEMPT; the two zero-page scaffolds until their first page).
 * Every exemption prints LOUDLY every run.
 *
 * /lp/ landing pages are OUT of scope by law — stripped-footer LPs carry no
 * social links by design (attention ratio; gates/registry.yaml:
 * footer-socials-present → landing: n_a, same ruling as social-press-links).
 *
 * CONTROL PROBE (§0.6): known-good and known-bad site sources run through
 * the REAL checker first; a probe miss means the gate checks nothing and the
 * run fails.
 *
 * Exit codes: 0 = clean · 2 = violations OR broken probe (CI blocks) · 1 = harness error.
 *
 * Usage: node scripts/footer-socials-lint.mjs [--sites <path>]
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { EXEMPT } from "./factory-matrix-lint.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const PKG = "@kairali/social";
export const CONFIG_PATH = join(REPO_ROOT, "packages", "social", "src", "config.ts");

/**
 * The canonical profile URLs, read from the ONE config file — the lint's
 * hardcode scan can never drift from what the fleet actually renders.
 * @param {string} [configSrc] — override for tests/probes.
 */
export function canonicalHrefs(configSrc) {
  const src = configSrc ?? readFileSync(CONFIG_PATH, "utf8");
  const hrefs = [...src.matchAll(/href:\s*"(https:\/\/[^"]+)"/g)].map((m) => m[1]);
  if (hrefs.length === 0) {
    throw new Error(`no hrefs parsed from ${relative(REPO_ROOT, CONFIG_PATH)} — config format drifted?`);
  }
  return hrefs;
}

/**
 * Pure checker over a site's collected sources. Returns violations (empty = clean).
 * @param {{ path: string, src: string }[]} files — the site's app/ TSX sources
 * @param {string} site — label for messages
 * @param {string[]} hrefs — canonical profile URLs (from canonicalHrefs())
 */
export function checkSiteSources(files, site, hrefs) {
  const v = [];
  const rendering = files.filter((f) => f.src.includes("<SocialLinks"));
  if (rendering.length === 0) {
    v.push(`${site}: no app source renders <SocialLinks/> — footer social links are mandatory fleet-wide (D-20260718-04) and always the ONE shared component, never a local copy`);
  }
  for (const f of rendering) {
    if (!f.src.includes(`from "${PKG}"`)) {
      v.push(`${site}: ${f.path} renders <SocialLinks/> without importing it from "${PKG}" — never a local copy (Factory rule: packages/* only)`);
    }
    if (!f.src.includes("<footer")) {
      v.push(`${site}: ${f.path} renders <SocialLinks/> outside any <footer> — the directive is FOOTER parity (D-20260718-04)`);
    }
  }
  for (const f of files) {
    for (const href of hrefs) {
      if (f.src.includes(href)) {
        v.push(`${site}: ${f.path} hardcodes ${href} — handles live in packages/social/src/config.ts ONLY (one-file true-up, D-SOCIALS-INTERIM)`);
      }
    }
  }
  return v;
}

/** Discover fleet sites: sites/<dir> with a site.config.json. */
export function fleetSites(sitesDir) {
  return readdirSync(sitesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(sitesDir, d.name, "site.config.json")))
    .map((d) => d.name)
    .sort();
}

/** Collect .tsx/.ts sources under a site's app/ dir (recursive). */
export function collectAppSources(siteDir) {
  const out = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(tsx|ts)$/.test(e.name)) out.push({ path: relative(siteDir, p), src: readFileSync(p, "utf8") });
    }
  };
  const appDir = join(siteDir, "app");
  if (existsSync(appDir) && statSync(appDir).isDirectory()) walk(appDir);
  return out;
}

// ── control probes: the REAL checker on known-good / known-bad sources ──────
export const PROBE_HREFS = ["https://example.com/kairali-probe"];
export const PROBE_GOOD = [
  {
    path: "app/page.tsx",
    src: `import { SocialLinks } from "@kairali/social";
export default function P() {
  return (<footer className="site-footer"><SocialLinks /></footer>);
}`,
  },
];
export const PROBE_MISSING = [
  { path: "app/page.tsx", src: `export default function P() { return (<footer />); }` },
];
export const PROBE_LOCAL_COPY = [
  {
    path: "app/page.tsx",
    src: `import { SocialLinks } from "./social-links";
export default function P() {
  return (<footer className="site-footer"><SocialLinks /></footer>);
}`,
  },
];
export const PROBE_OUTSIDE_FOOTER = [
  {
    path: "app/page.tsx",
    src: `import { SocialLinks } from "@kairali/social";
export default function P() { return (<main><SocialLinks /></main>); }`,
  },
];
export const PROBE_HARDCODED = [
  {
    path: "app/page.tsx",
    src: `import { SocialLinks } from "@kairali/social";
export default function P() {
  return (<footer><SocialLinks /><a href="https://example.com/kairali-probe">x</a></footer>);
}`,
  },
];

export function runControlProbes() {
  const fails = [];
  if (checkSiteSources(PROBE_GOOD, "probe-good", PROBE_HREFS).length !== 0) {
    fails.push("probe: known-GOOD site produced violations — checker is broken");
  }
  if (checkSiteSources(PROBE_MISSING, "probe-missing", PROBE_HREFS).length === 0) {
    fails.push("probe: known-BAD site (no SocialLinks) passed — checker checks nothing");
  }
  if (!checkSiteSources(PROBE_LOCAL_COPY, "probe-local", PROBE_HREFS).some((m) => m.includes("never a local copy"))) {
    fails.push("probe: known-BAD site (local-copy import) passed the shared-package check");
  }
  if (!checkSiteSources(PROBE_OUTSIDE_FOOTER, "probe-footer", PROBE_HREFS).some((m) => m.includes("outside any <footer>"))) {
    fails.push("probe: known-BAD site (render outside footer) passed the placement check");
  }
  if (!checkSiteSources(PROBE_HARDCODED, "probe-hardcode", PROBE_HREFS).some((m) => m.includes("hardcodes"))) {
    fails.push("probe: known-BAD site (hardcoded handle) passed the one-source check");
  }
  return fails;
}

export function main(argv = []) {
  const sitesFlag = argv.indexOf("--sites");
  const sitesDir = sitesFlag !== -1 ? resolve(argv[sitesFlag + 1]) : join(REPO_ROOT, "sites");

  const probeFails = runControlProbes();
  if (probeFails.length > 0) {
    for (const f of probeFails) console.log(`PROBE-FAIL  ${f}`);
    console.log("\nFAIL — the control probe is broken; a gate that cannot see its own fixtures guards nothing.\n");
    return 2;
  }

  const hrefs = canonicalHrefs();
  const sites = fleetSites(sitesDir);
  const violations = [];
  console.log(`\nfooter-socials-lint — ${sites.length} fleet sites (D-20260718-04: footer social parity; ${hrefs.length} canonical profiles)`);

  for (const name of sites) {
    const key = `sites/${name}`;
    if (EXEMPT.has(key)) {
      console.log(`  EXEMPT ${key} — ${EXEMPT.get(key)}`);
      continue;
    }
    // NON-KAIRALI SITES (D-20260720-39 scope ruling): a site whose
    // site.config.json declares entity "personal" is not a Kairali group
    // property (e.g. the external-client pilot theblushlounge.com) —
    // carrying the GROUP's social profiles there would be a false claim
    // (HARD GATE 6 class), so D-04's fleet parity does not bind. Scoping,
    // not weakening (rule g): no Kairali site gains an exit. Loud print,
    // ratification flagged: Q-SOCIALS-EXTERNAL-EXEMPT (QUESTIONS.md).
    const cfgPath = join(sitesDir, name, "site.config.json");
    const entity = JSON.parse(readFileSync(cfgPath, "utf8")).entity;
    if (entity === "personal") {
      console.log(
        `  EXEMPT ${key} — entity "personal": not a Kairali property; the group social set does not bind (D-20260720-39 scope ruling, Q-SOCIALS-EXTERNAL-EXEMPT)`,
      );
      continue;
    }
    const siteDir = join(sitesDir, name);
    const files = collectAppSources(siteDir);
    if (files.length === 0) {
      violations.push(`${key}: no app/ sources and not in the EXEMPT ledger — a page-bearing site without an app dir (or an exemption) cannot carry the mandatory footer socials`);
      continue;
    }
    violations.push(...checkSiteSources(files, key, hrefs));

    const pkgPath = join(siteDir, "package.json");
    if (existsSync(pkgPath) && !readFileSync(pkgPath, "utf8").includes(`"${PKG}"`)) {
      violations.push(`${key}: package.json does not declare "${PKG}"`);
    }
    const nextCfg = join(siteDir, "next.config.ts");
    if (existsSync(nextCfg) && !readFileSync(nextCfg, "utf8").includes(`"${PKG}"`)) {
      violations.push(`${key}: next.config.ts does not transpile "${PKG}" (it ships TSX source, like consent/analytics)`);
    }
  }

  if (violations.length === 0) {
    console.log(`\nPASS — every non-exempt fleet site's footer renders the shared social set, handles single-sourced.\n`);
    return 0;
  }
  for (const v of violations) console.log(`\nMISSING  ${v}`);
  console.log(`\nFAIL — ${violations.length} finding${violations.length === 1 ? "" : "s"}. Footer social parity is mandatory on every Factory site (D-20260718-04). Fix the site, never the gate (CLAUDE.md rule g).\n`);
  return 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`footer-socials-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
