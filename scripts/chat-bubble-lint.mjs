#!/usr/bin/env node
/**
 * chat-bubble-lint.mjs — fleet-wide chat-bubble presence gate (D-20260718-05).
 *
 * WHY THIS EXISTS. Abilash's 18 Jul 2026 directive (D-20260718-05): the chat
 * bubble is MANDATORY on every Factory site. Before this gate, four sites
 * carried the loader and four preview-stage sites silently did not — an
 * absence nobody decided (the same invisible-miss class the gate registry
 * exists to kill). This lint makes the absence mechanical: a fleet site whose
 * root layout does not render the shared @kairali/chat loader fails CI on the
 * PR that ships it.
 *
 * WHAT IT CHECKS, per non-exempt sites/<dir> (site.config.json present):
 *   1. app/layout.tsx exists (page-less scaffolds are EXEMPT, loudly);
 *   2. the layout imports { ChatbaseLoader } from "@kairali/chat" — the ONE
 *      shared component, never a local copy (Factory rule: packages/* only);
 *   3. the layout renders <ChatbaseLoader …/>;
 *   4. CONSENT ORDER: <ConsentScripts/> (default-DENIED Consent Mode v2)
 *      appears BEFORE <ChatbaseLoader/> in the layout source — the
 *      denied-before-loaders order verified in the pilot's security audit
 *      (launches/arogyashala.in/pagewise-checklist.md) is never regressed;
 *   5. package.json declares "@kairali/chat" and next.config.ts transpiles it
 *      (the package ships TSX source, like consent/analytics).
 *
 * EXEMPTIONS: reused VERBATIM from scripts/factory-matrix-lint.mjs EXEMPT —
 * one exemption ledger, not two drifting ones (abhilashkr + kairali.ai per
 * D-RULE-MATRIX-EXEMPT; the two zero-page scaffolds until their first page).
 * Every exemption prints LOUDLY every run.
 *
 * /lp/ landing pages are OUT of scope by law — single-CTA rule, no chat
 * widget competes with the one conversion goal (gates/registry.yaml:
 * chat-bubble-present → landing: n_a; same ruling as chatbase-entity-bot).
 *
 * CONTROL PROBE (§0.6): known-good and known-bad layout sources run through
 * the REAL checker first; a probe miss means the gate checks nothing and the
 * run fails.
 *
 * Exit codes: 0 = clean · 2 = violations OR broken probe (CI blocks) · 1 = harness error.
 *
 * Usage: node scripts/chat-bubble-lint.mjs [--sites <path>]
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { EXEMPT } from "./factory-matrix-lint.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const PKG = "@kairali/chat";

/**
 * Pure layout-source checker. Returns violations (empty = clean).
 * @param {string} src — app/layout.tsx source text
 * @param {string} site — label for messages
 */
export function checkLayoutSource(src, site) {
  const v = [];
  if (!src.includes(`from "${PKG}"`)) {
    v.push(`${site}: layout does not import from "${PKG}" — the chat bubble is mandatory fleet-wide (D-20260718-05) and always the ONE shared component, never a local copy`);
  }
  const loaderAt = src.indexOf("<ChatbaseLoader");
  if (loaderAt === -1) {
    v.push(`${site}: layout never renders <ChatbaseLoader/> — chat bubble missing (D-20260718-05)`);
  }
  const consentAt = src.indexOf("<ConsentScripts");
  if (consentAt === -1) {
    v.push(`${site}: layout never renders <ConsentScripts/> — consent defaults (denied) must exist before any loader`);
  } else if (loaderAt !== -1 && consentAt > loaderAt) {
    v.push(`${site}: <ChatbaseLoader/> appears BEFORE <ConsentScripts/> — denied-before-loaders order regressed (pilot security-audit contract)`);
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

// ── control probes: the REAL checker on known-good / known-bad sources ──────
export const PROBE_GOOD = `import { ConsentScripts, ConsentBanner } from "@kairali/consent";
import { ChatbaseLoader } from "@kairali/chat";
export default function L({ children }) {
  return (<html><head><ConsentScripts /></head>
    <body>{children}<ChatbaseLoader /><ConsentBanner privacyHref="/privacy" /></body></html>);
}`;
export const PROBE_MISSING = PROBE_GOOD.replace(/<ChatbaseLoader \/>/, "").replace(/import \{ ChatbaseLoader \}.*\n/, "");
export const PROBE_BAD_ORDER = `import { ConsentScripts } from "@kairali/consent";
import { ChatbaseLoader } from "@kairali/chat";
export default function L({ children }) {
  return (<html><head><ChatbaseLoader /></head><body>{children}<ConsentScripts /></body></html>);
}`;

export function runControlProbes() {
  const fails = [];
  if (checkLayoutSource(PROBE_GOOD, "probe-good").length !== 0) {
    fails.push("probe: known-GOOD layout produced violations — checker is broken");
  }
  if (checkLayoutSource(PROBE_MISSING, "probe-missing").length === 0) {
    fails.push("probe: known-BAD layout (loader missing) passed — checker checks nothing");
  }
  if (!checkLayoutSource(PROBE_BAD_ORDER, "probe-order").some((m) => m.includes("denied-before-loaders"))) {
    fails.push("probe: known-BAD layout (loader before consent) passed the order check — checker checks nothing");
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

  const sites = fleetSites(sitesDir);
  const violations = [];
  console.log(`\nchat-bubble-lint — ${sites.length} fleet sites (D-20260718-05: chat bubble mandatory)`);

  for (const name of sites) {
    const key = `sites/${name}`;
    if (EXEMPT.has(key)) {
      console.log(`  EXEMPT ${key} — ${EXEMPT.get(key)}`);
      continue;
    }
    const layoutPath = join(sitesDir, name, "app", "layout.tsx");
    if (!existsSync(layoutPath)) {
      violations.push(`${key}: no app/layout.tsx and not in the EXEMPT ledger — a page-bearing site without a root layout (or an exemption) cannot carry the mandatory chat bubble`);
      continue;
    }
    violations.push(...checkLayoutSource(readFileSync(layoutPath, "utf8"), key));

    const pkgPath = join(sitesDir, name, "package.json");
    if (existsSync(pkgPath) && !readFileSync(pkgPath, "utf8").includes(`"${PKG}"`)) {
      violations.push(`${key}: package.json does not declare "${PKG}"`);
    }
    const nextCfg = join(sitesDir, name, "next.config.ts");
    if (existsSync(nextCfg) && !readFileSync(nextCfg, "utf8").includes(`"${PKG}"`)) {
      violations.push(`${key}: next.config.ts does not transpile "${PKG}" (it ships TSX source, like consent/analytics)`);
    }
  }

  if (violations.length === 0) {
    console.log(`\nPASS — every non-exempt fleet site renders the shared chat bubble, consent-defaults-first.\n`);
    return 0;
  }
  for (const v of violations) console.log(`\nMISSING  ${v}`);
  console.log(`\nFAIL — ${violations.length} finding${violations.length === 1 ? "" : "s"}. The chat bubble is mandatory on every Factory site (D-20260718-05). Fix the site, never the gate (CLAUDE.md rule g).\n`);
  return 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`chat-bubble-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
