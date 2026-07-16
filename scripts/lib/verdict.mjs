/**
 * verdict.mjs — §0.2 THE VERDICT CONTRACT, expressed as code instead of prose.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * MASTER_PIPELINE §0.2 states the finding that motivates the whole build:
 *
 *   "the draft bound every verdict to the SHA-256 of the artifact it judged —
 *    but a hash is computable by anyone holding the artifact. Nothing bound a
 *    verdict to an EXECUTION. Forging a clean matrix walk required writing one
 *    JSON file. The mechanism assigned to catch 'declared binding in a .md file'
 *    was defeated by exactly that failure."
 *
 * So a verdict is evidence only if ALL of these hold, and this module is the one
 * place that decides it:
 *
 *   1. every §0.2 field is present and well-typed        -> validateVerdict()
 *   2. exit_code agrees with status                      -> validateVerdict()
 *   3. the control probe fired and observed == expected  -> validateVerdict() (§0.6)
 *   4. the artifact on disk still hashes to what was judged -> checkBinding()
 *   5. the verdict file was COMMITTED, BY A CI JOB, not hand-authored -> gitProvenance()
 *
 * Rule 5 is the one that makes the other four mean anything. A verdict JSON
 * asserting a gate ran is — in the pipeline's own words — "the same object in a
 * different costume" as a .md file asserting a rule binds. Only provenance
 * separates them, and provenance cannot be written into the file by the writer.
 *
 * THIS MODULE IS BOTH SIDES OF THE CONTRACT:
 *   - emitVerdict()   is for ENFORCING COMMANDS (keyword-validate.mjs, sitemap-gate.mjs,
 *                     a11y-gate.mjs, …). A gate calls it at the end of its own run so the
 *                     verdict is emitted BY the execution it describes. Nothing else may
 *                     write a verdict.
 *   - validateVerdict/checkBinding/gitProvenance are for matrix-walk.mjs, which trusts
 *     none of it and re-derives everything from disk and from git.
 *
 * HOUSE STYLE: plain ESM + JSDoc. No TypeScript. No dependencies.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, resolve } from "node:path";

/* ------------------------------------------------------------------ hashing */

/** @param {string|Buffer} data @returns {string} lowercase hex sha256 */
export function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

/** @param {string} absPath @returns {string|null} null when the file is absent */
export function sha256File(absPath) {
  if (!existsSync(absPath)) return null;
  return sha256(readFileSync(absPath));
}

const HEX64 = /^[0-9a-f]{64}$/;

/* ------------------------------------------------- slice hashing (§0.3) */

/**
 * Parse a TSV into header + row objects. Blank lines ignored; `__line` carries
 * the 1-indexed source line so an error can point at it.
 * @param {string} text
 * @returns {{header: string[], rows: Record<string,string>[]}}
 */
export function parseTsv(text) {
  const lines = text.split(/\r?\n/);
  /** @type {Record<string,string>[]} */
  const rows = [];
  let header = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;
    const cells = line.split("\t").map((c) => c.trim());
    if (header === null) { header = cells; continue; }
    /** @type {Record<string,string>} */
    const row = {};
    header.forEach((h, j) => { row[h] = cells[j] ?? ""; });
    Object.defineProperty(row, "__line", { value: i + 1, enumerable: false });
    rows.push(row);
  }
  return { header: header ?? [], rows };
}

// Field/record separators for canonical row serialisation. A TSV cell is split on
// \t and trimmed, so neither of these bytes can survive inside one — which means
// no cell content can forge a row-hash collision by embedding the separator.
const US = String.fromCharCode(31); // unit separator
const RS = String.fromCharCode(30); // record separator

/**
 * ★ SLICE HASHING (§0.3). "Hash binding is per-SLICE, not per-file. An artifact
 * is hashed by row-set … Appending rows voids ONLY the rows appended and the
 * gates that consumed them."
 *
 * Without this, §0.3's two rules were unsatisfiable at the same time: S5 required
 * the keyword map to be revised when it was wrong, and S9 voided every downstream
 * gate the moment it was — so the honest response to finding a late mistake was
 * "don't touch the artifact", which is how S5 mistakes get built instead of fixed.
 *
 * The row hash covers EVERY column (not just the key), so editing any cell of a
 * row voids that row. The manifest is computed over the SORTED id→hash pairs, so
 * re-ordering rows is not a change — only content is.
 *
 * @param {string} text TSV source
 * @param {string[]} keyCols columns that jointly identify a row
 * @returns {{rows: {id:string, sha256:string}[], manifest_sha256: string}}
 */
export function sliceArtifact(text, keyCols) {
  const { header, rows } = parseTsv(text);
  for (const k of keyCols) {
    if (!header.includes(k)) {
      throw new Error(`sliceArtifact: key column "${k}" is not in the header [${header.join(", ")}]`);
    }
  }
  /** @type {{id:string, sha256:string}[]} */
  const out = [];
  const seen = new Map();
  for (const r of rows) {
    const id = keyCols.map((k) => r[k]).join(US);
    if (seen.has(id)) {
      throw new Error(`sliceArtifact: duplicate row id "${id.split(US).join("/")}" at lines ${seen.get(id)} and ${r.__line}`);
    }
    seen.set(id, r.__line);
    out.push({ id, sha256: sha256(header.map((h) => r[h]).join(US)) });
  }
  out.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { rows: out, manifest_sha256: sha256(out.map((r) => `${r.id}${RS}${r.sha256}`).join("\n")) };
}

/* --------------------------------------------------- the §0.2 field contract */

/**
 * Every field §0.2 lists, verbatim. Absence of ANY of them is a rejection —
 * "REJECTS a verdict that: lacks any field".
 */
export const REQUIRED_FIELDS = Object.freeze([
  "gate", "status", "artifact_path", "artifact_sha256", "rubric_sha256",
  "command", "argv", "exit_code", "started_at", "finished_at",
  "runner", "ci_run_url", "control_probe",
]);

export const RUNNERS = Object.freeze(["github-actions", "local", "human"]);

const ISO_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/**
 * Validate a verdict against §0.2. Returns the list of contract violations —
 * EMPTY means the envelope is well-formed. It does NOT mean the gate is proven:
 * binding (checkBinding) and provenance (gitProvenance) are separate, and both
 * are required. Nothing a verdict says about itself can establish either.
 *
 * @param {any} v
 * @param {{kind?: string}} [opts] gate kind — HUMAN gates have no command/CI run
 * @returns {string[]} problems
 */
export function validateVerdict(v, opts = {}) {
  /** @type {string[]} */
  const p = [];
  if (v === null || typeof v !== "object" || Array.isArray(v)) return ["not a JSON object"];

  const human = opts.kind === "HUMAN";

  for (const f of REQUIRED_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(v, f)) p.push(`missing required field "${f}" (§0.2)`);
  }

  if (typeof v.gate !== "string" || !v.gate.trim()) p.push(`"gate" must be a non-empty string`);
  if (v.status !== "PASS" && v.status !== "FAIL") p.push(`"status" must be "PASS" or "FAIL" (got ${JSON.stringify(v.status)})`);

  // artifact binding: whole-file hash, a row slice (§0.3), or both — but never neither.
  const hasFileHash = typeof v.artifact_sha256 === "string" && HEX64.test(v.artifact_sha256);
  const hasSlice = v.slice && typeof v.slice === "object" && Array.isArray(v.slice.rows) && HEX64.test(String(v.slice.manifest_sha256 ?? ""));
  if (!hasFileHash && !hasSlice) {
    p.push(`"artifact_sha256" must be a 64-hex sha256, or a §0.3 "slice" {rows:[{id,sha256}], manifest_sha256} must be present — a verdict bound to nothing judged nothing`);
  }
  if (hasSlice) {
    for (const r of v.slice.rows) {
      if (typeof r?.id !== "string" || !HEX64.test(String(r?.sha256 ?? ""))) {
        p.push(`"slice.rows" entries must be {id: string, sha256: 64-hex}`);
        break;
      }
    }
  }
  if (typeof v.artifact_path !== "string" || !v.artifact_path.trim()) p.push(`"artifact_path" must be a non-empty repo-relative path`);
  if (isAbsolute(String(v.artifact_path ?? ""))) p.push(`"artifact_path" must be repo-relative, not absolute (it must mean the same thing on another machine)`);

  // §0.5 THE RUBRIC CONTRACT: docs/process/rubrics/ does not exist, so
  // rubric_sha256 is a RESERVED field. The KEY is mandatory (its absence means
  // the emitter is not on the current contract); null is the honest value until
  // build #5 scaffolds the rubric layer. A non-null value must be a real hash.
  if (!(v.rubric_sha256 === null || (typeof v.rubric_sha256 === "string" && HEX64.test(v.rubric_sha256)))) {
    p.push(`"rubric_sha256" must be a 64-hex sha256, or null while §0.5's rubric layer is unbuilt — got ${JSON.stringify(v.rubric_sha256)}`);
  }

  if (human) {
    if (v.command !== null && typeof v.command !== "string") p.push(`"command" must be a string or null on a HUMAN gate`);
  } else if (typeof v.command !== "string" || !v.command.trim()) {
    p.push(`"command" must name the enforcing command — a verdict with no command was emitted by no execution`);
  }
  if (!Array.isArray(v.argv) || v.argv.some((a) => typeof a !== "string")) p.push(`"argv" must be an array of strings`);

  if (!Number.isInteger(v.exit_code)) p.push(`"exit_code" must be an integer`);
  // §0.2: "has exit_code != 0 with status: PASS" -> REJECT.
  if (v.status === "PASS" && Number.isInteger(v.exit_code) && v.exit_code !== 0) {
    p.push(`status PASS with exit_code ${v.exit_code} — the command failed and the verdict claims it passed (§0.2)`);
  }
  if (v.status === "FAIL" && v.exit_code === 0) {
    p.push(`status FAIL with exit_code 0 — a failing gate that exits 0 does not block CI (house rule: gates exit 2)`);
  }

  for (const t of ["started_at", "finished_at"]) {
    if (typeof v[t] !== "string" || !ISO_OFFSET.test(v[t])) p.push(`"${t}" must be ISO-8601 with a UTC offset (e.g. 2026-07-16T19:30:47+05:30)`);
  }
  if (ISO_OFFSET.test(String(v.started_at)) && ISO_OFFSET.test(String(v.finished_at))) {
    if (Date.parse(v.finished_at) < Date.parse(v.started_at)) p.push(`"finished_at" is before "started_at"`);
  }

  if (!RUNNERS.includes(v.runner)) p.push(`"runner" must be one of ${RUNNERS.join("|")} (got ${JSON.stringify(v.runner)})`);
  if (v.runner === "human" && !human) p.push(`runner "human" on a machine gate — a person cannot stand in for ${v.gate}'s enforcing command`);
  if (human && v.runner !== "human") p.push(`a HUMAN gate's verdict must declare runner "human"`);
  if (human && (typeof v.human?.name !== "string" || !v.human.name.trim())) {
    p.push(`a HUMAN gate's verdict must name the person in "human": {name, role} — "a named person, not delegable" (§0.1)`);
  }
  if (v.runner === "github-actions" && (typeof v.ci_run_url !== "string" || !/^https:\/\/\S+$/.test(v.ci_run_url))) {
    p.push(`"ci_run_url" must be the https URL of the run that emitted this verdict`);
  }

  // §0.6 THE ZERO-CHALLENGE PRINCIPLE. "A zero is not believed until a known-present
  // control probe returns non-zero in the same run… No control probe => the gate did
  // not run." Our own banned-word scan reported 0 hits because ugrep silently ignored
  // `[[:<:]]`; the control word 'ayurveda' also returned 0, which is what exposed it.
  const cp = v.control_probe;
  if (cp === null || typeof cp !== "object" || Array.isArray(cp)) {
    p.push(`"control_probe" must be {name, expected, observed} — no control probe means the gate did not run (§0.6)`);
  } else {
    if (typeof cp.name !== "string" || !cp.name.trim()) p.push(`"control_probe.name" must name the known-present probe`);
    if (!("expected" in cp) || !("observed" in cp)) p.push(`"control_probe" needs both "expected" and "observed"`);
    // §0.2: REJECT a verdict "whose control_probe.observed != expected".
    else if (JSON.stringify(cp.observed) !== JSON.stringify(cp.expected)) {
      p.push(`control probe "${cp.name}" expected ${JSON.stringify(cp.expected)} but observed ${JSON.stringify(cp.observed)} — the gate's own detector is broken, so its result is not evidence (§0.6)`);
    }
  }
  return p;
}

/* -------------------------------------------------------- artifact binding */

/** @typedef {{state:"MATCH"|"MISMATCH"|"ARTIFACT_MISSING"|"UNCHECKABLE", detail:string, changedRows?:string[], missingRows?:string[]}} Binding */

/**
 * Re-derive the artifact hash from disk and compare it to what the verdict says
 * it judged. §S9(d)2: "Hash mismatch => the artifact changed after it passed =>
 * that gate is VOID."
 *
 * For slice-bound verdicts (§0.3) only the judged rows are compared: appending a
 * row does NOT void an old verdict. NOTE that this leaves appended rows UNJUDGED
 * — which is a hole unless someone checks coverage. matrix-walk.mjs does exactly
 * that (see sliceCoverage there); slice hashing without a coverage check would
 * let a new row skip the gate entirely, which is worse than the problem it fixes.
 *
 * @param {any} v a verdict that already passed validateVerdict()
 * @param {string} repoRoot
 * @param {string[]} [sliceKeys] key columns for slice-bound artifacts
 * @returns {Binding}
 */
export function checkBinding(v, repoRoot, sliceKeys = []) {
  const abs = resolve(repoRoot, v.artifact_path);
  if (!existsSync(abs)) {
    return { state: "ARTIFACT_MISSING", detail: `the judged artifact ${v.artifact_path} is not on disk — absence of artifact = FAIL (§S9(d)4)` };
  }
  if (v.slice) {
    if (!sliceKeys.length) return { state: "UNCHECKABLE", detail: `slice-bound verdict but no slice key columns are known for ${v.artifact_path}` };
    let current;
    try {
      current = sliceArtifact(readFileSync(abs, "utf8"), sliceKeys);
    } catch (e) {
      return { state: "UNCHECKABLE", detail: `cannot slice ${v.artifact_path}: ${e.message}` };
    }
    const now = new Map(current.rows.map((r) => [r.id, r.sha256]));
    const changedRows = [];
    const missingRows = [];
    for (const judged of v.slice.rows) {
      if (!now.has(judged.id)) missingRows.push(judged.id);
      else if (now.get(judged.id) !== judged.sha256) changedRows.push(judged.id);
    }
    if (changedRows.length || missingRows.length) {
      const bits = [];
      if (changedRows.length) bits.push(`${changedRows.length} judged row(s) changed`);
      if (missingRows.length) bits.push(`${missingRows.length} judged row(s) deleted`);
      return {
        state: "MISMATCH",
        detail: `${bits.join(", ")} since the verdict — those rows are VOID (§0.3)`,
        changedRows, missingRows,
      };
    }
    return { state: "MATCH", detail: `all ${v.slice.rows.length} judged row(s) unchanged`, changedRows, missingRows };
  }
  const actual = sha256File(abs);
  if (actual !== v.artifact_sha256) {
    return {
      state: "MISMATCH",
      detail: `${v.artifact_path} now hashes ${actual.slice(0, 12)}… but the verdict judged ${String(v.artifact_sha256).slice(0, 12)}… — the artifact changed after it passed`,
    };
  }
  return { state: "MATCH", detail: `${v.artifact_path} still hashes ${actual.slice(0, 12)}…` };
}

/* ------------------------------------------------------------- provenance */

/**
 * Authors we accept as "a CI job". §0.2 rejects a verdict "whose git-blame author
 * is a human or agent edit rather than a CI job" — this list is what that means
 * operationally. It is deliberately short: widening it widens the forgery surface.
 */
export const CI_AUTHOR_PATTERNS = Object.freeze([/^github-actions(\[bot\])?$/i]);
export const CI_EMAIL_PATTERNS = Object.freeze([
  /^\d+\+github-actions\[bot\]@users\.noreply\.github\.com$/i,
  /^github-actions\[bot\]@users\.noreply\.github\.com$/i,
  /^actions@github\.com$/i,
]);

/** @typedef {{available:boolean, committed:boolean, dirty:boolean, author:string, email:string, isCi:boolean, commit:string, signature:string, reason?:string}} Provenance */

function git(args, cwd) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  return { ok: r.status === 0 && !r.error, out: (r.stdout ?? "").trim(), err: (r.stderr ?? "").trim() };
}

/**
 * Who last committed this file, and was it a CI job?
 *
 * §0.2 says "git-blame author". We use `git log -1 -- <file>`: for a
 * whole-file evidence artifact the last commit to touch it IS the blame author of
 * every line that matters, and it is one process instead of one per line.
 *
 * A verdict with uncommitted or dirty working-tree state is NOT evidence
 * (§S9(d)1: the exit artifact "exists, is committed"). If git itself is
 * unavailable we return available:false and the caller must FAIL — we fail
 * CLOSED, because "we could not check" has to cost the same as "it failed", or
 * disabling git becomes the way to pass the walk.
 *
 * ⚠️ LIMIT, STATED RATHER THAN HIDDEN: git author identity is a claim, not an
 * authentication. Anyone who can push can set user.name. The real defence is that
 * CI pushes are made by a token nobody holds; requiring signed commits (`%G?` ==
 * "G") would close the gap properly. We RECORD the signature status below and
 * report it; requiring it is a policy call for Abilash, not a default we take.
 *
 * @param {string} absPath @param {string} repoRoot @returns {Provenance}
 */
export function gitProvenance(absPath, repoRoot) {
  /** @type {Provenance} */
  const base = { available: false, committed: false, dirty: false, author: "", email: "", isCi: false, commit: "", signature: "?" };
  const probe = git(["rev-parse", "--is-inside-work-tree"], repoRoot);
  if (!probe.ok || probe.out !== "true") return { ...base, reason: "git is unavailable or this is not a work tree — provenance cannot be established, so the verdict is not evidence" };

  const status = git(["status", "--porcelain", "--", absPath], repoRoot);
  if (!status.ok) return { ...base, available: true, reason: `git status failed: ${status.err}` };
  const dirty = status.out !== "";

  const log = git(["log", "-1", "--format=%H%x1f%an%x1f%ae%x1f%G?", "--", absPath], repoRoot);
  if (!log.ok || log.out === "") {
    return { ...base, available: true, dirty, reason: "the verdict file has never been committed — an uncommitted verdict is not evidence (§S9(d)1)" };
  }
  const [commit, author, email, signature] = log.out.split(US);
  const isCi = CI_AUTHOR_PATTERNS.some((re) => re.test(author)) || CI_EMAIL_PATTERNS.some((re) => re.test(email));
  return { available: true, committed: true, dirty, author, email, isCi, commit, signature };
}

/**
 * Turn provenance + runner into contract problems.
 * @param {any} v @param {Provenance} prov @param {{kind?:string}} [opts]
 * @returns {string[]}
 */
export function checkProvenance(v, prov, opts = {}) {
  /** @type {string[]} */
  const p = [];
  if (!prov.available) return [prov.reason ?? "provenance unavailable"];
  if (!prov.committed) return [prov.reason ?? "the verdict file is not committed"];
  if (prov.dirty) p.push(`the verdict file has uncommitted local modifications — what is on disk is not what was committed`);

  if (opts.kind === "HUMAN") {
    // A human sign-off has no CI job by definition. What we CAN require is that a
    // person committed it, that it names them, and that it binds the artifact hash.
    // This is an EXTENSION of §0.2, which is written for machines; recorded here
    // rather than silently assumed. See the ⚠️ LIMIT note on gitProvenance().
    if (prov.isCi) p.push(`a HUMAN gate's verdict was committed by a CI job (${prov.author}) — a machine cannot sign for a person`);
    return p;
  }

  // The rule that makes the contract real (§0.2, §S9(d)2).
  if (v.runner === "local") {
    p.push(`runner "local": a local run has no CI provenance, so it is iteration evidence, not ship evidence (§0.2)`);
  }
  if (!prov.isCi) {
    p.push(`the verdict was last committed by "${prov.author} <${prov.email}>" — a human or agent edit, not a CI job. A hand-authored verdict is a .md file in a different costume (§0.2)`);
  }
  return p;
}

/* --------------------------------------------------------------- emitting */

/** IST, to the second, as the repo's log format demands: `YYYY-MM-DD HH:MM:SS IST`. */
export function istStamp(d = new Date()) {
  const s = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(d);
  return `${s.replace(", ", " ")} IST`;
}

/** ISO-8601 with the +05:30 offset, as §0.2's example uses. */
export function istIso(d = new Date()) {
  const t = new Date(d.getTime() + 5.5 * 3600 * 1000);
  return t.toISOString().replace(/\.\d+Z$/, "+05:30");
}

/** Runner + CI run URL from the environment. Never guesses: local is local. */
export function detectRunner() {
  if (process.env.GITHUB_ACTIONS === "true") {
    const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
    return {
      runner: "github-actions",
      ci_run_url: GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID
        ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
        : null,
    };
  }
  return { runner: "local", ci_run_url: null };
}

/**
 * ★ THE ONLY SANCTIONED WAY TO WRITE A VERDICT. An enforcing command calls this
 * at the end of its own run, so the verdict is emitted BY the execution it
 * describes — which is the entire point of §0.2. Nothing else may write one.
 *
 * @param {{
 *   gate: string, status: "PASS"|"FAIL", artifactPath: string, repoRoot: string,
 *   command: string, argv?: string[], exitCode: number,
 *   startedAt: string, controlProbe: {name:string, expected:any, observed:any},
 *   slice?: {rows:{id:string,sha256:string}[], manifest_sha256:string},
 *   rubricSha256?: string|null, human?: {name:string, role:string},
 *   extra?: Record<string, any>, outPath?: string,
 * }} o
 * @returns {{verdict: any, path: string}}
 */
export function emitVerdict(o) {
  const { runner, ci_run_url } = o.human ? { runner: "human", ci_run_url: null } : detectRunner();
  const abs = resolve(o.repoRoot, o.artifactPath);
  const verdict = {
    gate: o.gate,
    status: o.status,
    artifact_path: o.artifactPath,
    artifact_sha256: o.slice ? null : sha256File(abs),
    rubric_sha256: o.rubricSha256 ?? null, // §0.5: reserved until the rubric layer is built
    command: o.command,
    argv: o.argv ?? [],
    exit_code: o.exitCode,
    started_at: o.startedAt,
    finished_at: istIso(),
    runner,
    ci_run_url,
    control_probe: o.controlProbe,
    ...(o.slice ? { slice: o.slice } : {}),
    ...(o.human ? { human: o.human } : {}),
    ...(o.extra ?? {}),
  };
  const path = o.outPath ? resolve(o.repoRoot, o.outPath) : resolve(o.repoRoot, "audits", `${o.gate}-verdict.json`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(verdict, null, 2) + "\n");
  return { verdict, path };
}

/* --------------------------------------------------------------- loading */

/**
 * Load every verdict-shaped JSON under a directory.
 *
 * Verdicts are keyed by the `gate` FIELD INSIDE the file, never by filename.
 * The pipeline is inconsistent here — §S9(c) says `audits/<domain>/G*-verdict.json`
 * while S0's evidence line says `audits/<domain>/G0-verdict.json` for a gate whose
 * ID is `G0-PRE`. The field is the contract; the filename is a convention. Binding
 * on the field means a misnamed file cannot silently satisfy the wrong gate.
 *
 * A JSON file that LOOKS like a verdict (has `gate` or `status`) but is malformed
 * is returned in `malformed`, never skipped — silently ignoring a broken verdict
 * is how a gate goes missing without anyone noticing.
 *
 * @param {string} dir absolute
 * @returns {{byGate: Map<string, any[]>, malformed: {file:string, reason:string}[], files:string[]}}
 */
export function loadVerdicts(dir) {
  /** @type {Map<string, any[]>} */
  const byGate = new Map();
  /** @type {{file:string, reason:string}[]} */
  const malformed = [];
  /** @type {string[]} */
  const files = [];
  if (!existsSync(dir)) return { byGate, malformed, files };

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const file = join(dir, entry.name);
    files.push(file);
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(file, "utf8"));
    } catch (e) {
      malformed.push({ file, reason: `unparseable JSON: ${e.message}` });
      continue;
    }
    const candidates = Array.isArray(parsed) ? parsed : [parsed];
    for (const c of candidates) {
      const looksLikeVerdict = c && typeof c === "object" && ("gate" in c || "status" in c);
      if (!looksLikeVerdict) continue;
      if (typeof c.gate !== "string" || !c.gate.trim()) {
        malformed.push({ file, reason: `verdict-shaped JSON with no "gate" field — it cannot be bound to any gate` });
        continue;
      }
      const list = byGate.get(c.gate) ?? [];
      list.push({ ...c, __file: file });
      byGate.set(c.gate, list);
    }
  }
  return { byGate, malformed, files };
}

/** Latest verdict for a gate, by finished_at (falling back to started_at). */
export function latest(verdicts) {
  const t = (v) => Date.parse(v?.finished_at ?? v?.started_at ?? 0) || 0;
  return [...verdicts].sort((a, b) => t(b) - t(a))[0];
}
