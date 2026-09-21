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
 * PLUS one lint-SPECIFIC ledger (CHAT_EXEMPT below): sites that ARE in the CI
 * matrices (so they cannot ride the matrix EXEMPT list) but are exempt from
 * THE BUBBLE ITSELF by owner ruling. Same loud pattern as abhilashkr's matrix
 * exemption: a Map entry with the ruling as its paper trail, printed every
 * run — never a silent skip.
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
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { EXEMPT } from "./factory-matrix-lint.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const PKG = "@kairali/chat";

/**
 * Lint-specific exemptions — sites in the CI matrices whose BUBBLE absence is
 * an owner ruling, not a drift. Every entry needs Abilash's ruling as its
 * reason (same law as factory-matrix-lint EXEMPT: an exemption without a
 * paper trail is drift wearing a badge). Printed LOUDLY every run.
 */
export const CHAT_EXEMPT = new Map([
  ["sites/theblushlounge.com", "personal-brand exemption — D-BL-BUBBLE-EXEMPT (Abilash, 18 Jul 2026): Sneha's OWN WhatsApp (+91 88269 21110, D-BL-WHATSAPP) IS the chat surface; a Kairali/Chatbase bubble is off-brand and off-register in both directions on her personal site. Loud registry exemption, not a silent skip."],
]);

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

/**
 * Every ROOT layout of a site.
 *
 * app/layout.tsx is the single-root case. Next.js also allows one root layout
 * PER ROUTE GROUP — app/(english)/layout.tsx, app/(lp)/layout.tsx — which is
 * the only way to serve two independent documents from one app. This lint
 * previously looked for app/layout.tsx alone, so a site that had split into
 * route-group roots read as "no root layout at all" and its actual layouts
 * were never inspected. That is a detection bug, not a policy: the gate was
 * reporting the wrong reason and, worse, could not have seen a bubble that WAS
 * there. Fixed 2026-09-21 on the AHV English lane.
 */
export function rootLayouts(siteDir) {
  const appDir = join(siteDir, "app");
  if (!existsSync(appDir)) return [];
  const single = join(appDir, "layout.tsx");
  if (existsSync(single)) return [single];
  return readdirSync(appDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\(.+\)$/.test(d.name))
    .map((d) => join(appDir, d.name, "layout.tsx"))
    .filter((f) => existsSync(f))
    .sort();
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

  // exemptions rot too (factory-matrix-lint law): a CHAT_EXEMPT entry naming a
  // site that no longer exists is stale and must be deleted, loudly.
  for (const [key, reason] of CHAT_EXEMPT) {
    if (!sites.includes(key.replace(/^sites\//, ""))) {
      violations.push(`stale CHAT_EXEMPT entry: ${key} ("${reason.slice(0, 60)}…") names no fleet site on disk — delete the exemption`);
    }
  }

  for (const name of sites) {
    const key = `sites/${name}`;
    if (EXEMPT.has(key)) {
      console.log(`  EXEMPT ${key} — ${EXEMPT.get(key)}`);
      continue;
    }
    if (CHAT_EXEMPT.has(key)) {
      console.log(`  EXEMPT ${key} — ${CHAT_EXEMPT.get(key)}`);
      continue;
    }
    const roots = rootLayouts(join(sitesDir, name));
    if (roots.length === 0) {
      violations.push(`${key}: no root layout (app/layout.tsx, nor any app/(group)/layout.tsx) and not in the EXEMPT ledger — a page-bearing site without a root layout (or an exemption) cannot carry the mandatory chat bubble`);
      continue;
    }
    // EVERY root is checked, not just the first. Next.js route-group roots are
    // independent documents: a visitor on a route served by one of them never
    // sees the other, so a bubble in only one root is a bubble missing from
    // every route the other root serves.
    for (const r of roots) {
      const label = roots.length === 1 ? key : `${key} [${relative(join(sitesDir, name), r)}]`;
      violations.push(...checkLayoutSource(readFileSync(r, "utf8"), label));
    }

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

// A path containing a space made this guard false forever: import.meta.url
// percent-encodes it as %20 and process.argv[1] does not, so main() never ran
// and the gate exited 0 having checked NOTHING — a silent pass, the worst kind
// of gate failure. Compare resolved paths instead of strings.
// (QUESTIONS.md Q-MAIN-GUARD-ENCODING / Q-AHV-PATH-SPACES: ~31 scripts share
// this bug; this is the one this session touched.)
if (process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`chat-bubble-lint: harness error — ${e.message}`);
    process.exit(1);
  }
}
