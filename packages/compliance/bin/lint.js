#!/usr/bin/env node
/**
 * Usage:
 *   kairali-compliance-lint                      # lint every site under sites/
 *   kairali-compliance-lint sites/<domain>       # lint one site (entity from site.config.json)
 *   kairali-compliance-lint <dir> --entity=kappl # lint any dir with an explicit entity
 *
 * Exit code 1 on any error-severity finding (merge-blocking per Launch Checklist A3).
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { lintDir, formatFindings } from "../src/lint.js";

const args = process.argv.slice(2);
const entityArg = args.find((a) => a.startsWith("--entity="))?.split("=")[1];
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
    console.log("compliance: no sites yet — nothing to lint. PASS");
    process.exit(0);
  }
}

let all = [];
for (const t of targets) {
  all = all.concat(lintDir(t, entityArg ? { entity: entityArg } : {}));
}

const errors = all.filter((f) => f.severity === "error").length;
const warnings = all.filter((f) => f.severity === "warning").length;

if (all.length) console.log(formatFindings(all));
console.log(`\ncompliance: ${errors} error(s), ${warnings} warning(s) across ${targets.length} target(s) — ${errors ? "FAIL" : "PASS"}`);
process.exit(errors ? 1 : 0);
