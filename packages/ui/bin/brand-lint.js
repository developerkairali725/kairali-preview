#!/usr/bin/env node
/**
 * Usage:
 *   kairali-brand-lint                    # lint every site under sites/
 *   kairali-brand-lint sites/<domain>     # lint one site
 *   kairali-brand-lint <dir> --brand=raag # explicit brand override
 *
 * Exit code 1 on any error-severity finding (merge-blocking per Ship Gate A4).
 * Static layer only — computed 44px/focus checks live in tests/factory/.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { lintBrandDir, formatBrandFindings } from "../src/brand-lint.js";

const args = process.argv.slice(2);
const brandArg = args.find((a) => a.startsWith("--brand="))?.split("=")[1];
const paths = args.filter((a) => !a.startsWith("--"));

let targets = paths.map((p) => resolve(p));
if (targets.length === 0) {
  const sitesRoot = resolve("sites");
  if (!existsSync(sitesRoot)) {
    console.error("No sites/ directory found and no path given.");
    process.exit(2);
  }
  targets = readdirSync(sitesRoot)
    .map((n) => join(sitesRoot, n))
    .filter((p) => statSync(p).isDirectory());
  if (targets.length === 0) {
    console.log("brand-lint: no sites yet — nothing to lint. PASS");
    process.exit(0);
  }
}

let all = [];
for (const t of targets) {
  all = all.concat(lintBrandDir(t, brandArg ? { brand: brandArg } : {}));
}

const errors = all.filter((f) => f.severity === "error").length;
const warnings = all.filter((f) => f.severity === "warning").length;

if (all.length) console.log(formatBrandFindings(all));
console.log(`\nbrand-lint: ${errors} error(s), ${warnings} warning(s) across ${targets.length} target(s) — ${errors ? "FAIL" : "PASS"}`);
process.exit(errors ? 1 : 0);
