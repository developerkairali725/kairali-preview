/**
 * audit-verdict.mjs — verdict emission for the two cross-model auditors
 * (scripts/audit-gpt.mjs · scripts/audit-perplexity.mjs). Tranche 1 of the
 * verdict emitters behind the pre-launch-matrix-walk gate.
 *
 * WHY THIS LIVES INSIDE THE AUDITORS AND NOWHERE ELSE. §0.2: "A verdict is
 * valid only if it was emitted by the enforcing command itself." The enforcing
 * command for every G*-PROC gate IS audit-gpt.mjs and for every G*-FACT gate IS
 * audit-perplexity.mjs (matrix-walk REGISTRY, transcribed from the §2 stage
 * tables). So the ONLY sanctioned path to a PROC/FACT verdict is: the auditor
 * completes a real API run, derives PASS/FAIL from the model's schema-strict
 * verdict enum, and calls emitVerdict() before exiting. A separate script that
 * "records" an audit that happened some other time would be a transcription,
 * not an execution — the .md-file forgery in a different costume.
 *
 * WHAT THIS REFUSES, in code:
 *   - emitting for a gate the calling auditor does not enforce (AUDIT_GATES is
 *     a closed map; G3-FACT via audit-gpt throws);
 *   - emitting without exactly ONE on-disk artifact file to bind ("a verdict
 *     bound to nothing judged nothing" — inline-text artifacts and multi-file
 *     bundles have no single hashable identity; pass the one file the gate
 *     judges);
 *   - emitting when the model returned anything but the strict PASS|FAIL enum.
 *
 * Provenance is not this module's to grant: a local audit run emits
 * runner:"local", which the walk correctly refuses as ship evidence. CI wiring
 * (and the verdict-commit step it needs) is a separate ratifiable change per
 * the O6 precedent — deliberately NOT taken here.
 */

import { existsSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { emitVerdict } from "./verdict.mjs";

/**
 * Which gates each auditor's execution may speak for — the matrix-walk REGISTRY
 * rows whose enforcing command is that auditor, and no others. G0-FACT is
 * advisory in the walk; it is still only emittable by the command that runs it.
 */
export const AUDIT_GATES = Object.freeze({
  "audit-gpt": Object.freeze(["G2-PROC", "G3-PROC", "G4-PROC", "G5-PROC", "G6-PROC", "G9-PROC"]),
  "audit-perplexity": Object.freeze(["G0-FACT", "G3-FACT", "G5-FACT", "G6-FACT", "G9-FACT"]),
});

/**
 * Read the emit request from parseReviewArgs() output (`--emit-gate`,
 * `--emit-site`). Returns null when no emission was requested; throws on a
 * half-specified or out-of-lane request. Called BEFORE the API call on
 * purpose: a run that would be unable to emit must fail before burning tokens.
 *
 * @param {Record<string, any>} args parseReviewArgs() output
 * @param {"audit-gpt"|"audit-perplexity"} auditor
 * @returns {{gate: string, site: string}|null}
 */
export function parseEmitRequest(args, auditor) {
  const gate = args["emit-gate"];
  const site = args["emit-site"];
  if (!gate && !site) return null;
  if (!gate || !site) throw new Error(`--emit-gate and --emit-site must be given together (got gate=${JSON.stringify(gate ?? null)}, site=${JSON.stringify(site ?? null)})`);
  const allowed = AUDIT_GATES[auditor];
  if (!allowed) throw new Error(`unknown auditor "${auditor}"`);
  if (!allowed.includes(gate)) {
    throw new Error(
      `${auditor} is not the enforcing command for "${gate}" — it may emit only for [${allowed.join(", ")}]. ` +
      `A verdict recorded by a command that did not enforce the gate is a transcription, not an execution (§0.2)`,
    );
  }
  return { gate, site };
}

/**
 * Emit the §0.2 verdict for a completed audit run. Call ONLY after the model's
 * response parsed against the strict schema.
 *
 * @param {{
 *   auditor: "audit-gpt"|"audit-perplexity",
 *   gate: string, site: string, repoRoot: string,
 *   artifacts: string[],           the --artifact values the run judged
 *   verdict: string,               the model's verdict field
 *   startedAt: string,             istIso() captured at run start
 *   argv: string[],                the real process argv tail
 *   model: string,
 * }} o
 * @returns {{verdict: any, path: string}}
 */
export function emitAuditVerdict(o) {
  const allowed = AUDIT_GATES[o.auditor];
  if (!allowed?.includes(o.gate)) throw new Error(`${o.auditor} may not emit for "${o.gate}"`);

  if (o.verdict !== "PASS" && o.verdict !== "FAIL") {
    throw new Error(`auditor verdict must be the strict enum PASS|FAIL, got ${JSON.stringify(o.verdict)} — nothing else is emittable`);
  }

  // exactly one on-disk artifact — the file the gate judged
  const onDisk = (o.artifacts ?? []).filter((a) => existsSync(resolve(o.repoRoot, a)));
  if ((o.artifacts ?? []).length !== 1 || onDisk.length !== 1) {
    throw new Error(
      `emitting a verdict requires exactly ONE --artifact that is an on-disk file (got ${o.artifacts?.length ?? 0}, ` +
      `of which ${onDisk.length} exist) — a verdict bound to nothing judged nothing (§0.2); ` +
      `bind the single artifact file the gate judges`,
    );
  }
  const abs = resolve(o.repoRoot, o.artifacts[0]);
  const bytes = statSync(abs).size;
  if (bytes === 0) throw new Error(`artifact ${o.artifacts[0]} is empty (0 bytes) — a verdict bound to nothing judged nothing`);
  const artifactPath = isAbsolute(o.artifacts[0]) ? relative(o.repoRoot, abs) : o.artifacts[0];

  const command = `node scripts/${o.auditor}.mjs`;
  return emitVerdict({
    gate: o.gate,
    status: o.verdict,
    artifactPath,
    repoRoot: o.repoRoot,
    command,
    argv: o.argv ?? [],
    exitCode: o.verdict === "PASS" ? 0 : 2,
    startedAt: o.startedAt,
    // §0.6: the probe names what was actually checked in THIS run — the
    // artifact had bytes to judge and the schema-strict enum came back. A
    // stronger in-band probe (a seeded known-false claim the fact-auditor must
    // flag) is a tranche-2 STRENGTHENING, tracked, not faked here.
    controlProbe: { name: "artifact-nonempty+strict-verdict-enum", expected: true, observed: bytes > 0 && (o.verdict === "PASS" || o.verdict === "FAIL") },
    extra: { site: o.site, model: o.model ?? null, registry_gate: "cross-model-audit", registry_severity: "high" },
    outPath: join("audits", o.site, `${o.gate}-verdict.json`),
  });
}
