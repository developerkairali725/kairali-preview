#!/usr/bin/env node
/**
 * directive-capture.mjs — the DIRECTIVES.md inbox: no chat instruction can be
 * silently dropped.
 *
 * WHY THIS EXISTS. Abilash's 16-Jul finding: his ask to study Karpathy's memory
 * process was given in chat and silently dropped — nothing wrote it down, and
 * the model architecture guarantees it will not "remember" (docs/research/
 * agentic-memory-and-state-2026-07-16.md, finding 3: no continual learning;
 * adopted as MVP item 3). The standing rule since then: ANY directive given in
 * chat gets logged into the repo the same session, no exceptions — an unlogged
 * directive is a dropped directive. This script is that rule's mechanism:
 * append-only entries with source + timestamp (storage-time provenance), a
 * flip-only ack field, and the boot contract (scripts/boot-contract.mjs)
 * surfacing every unacknowledged entry at every session start until it is
 * explicitly closed.
 *
 * ENTRY FORMAT (one line each, append-only, IST to the second per CLAUDE.md):
 *   - [ ] D-20260717-01 · 2026-07-17 15:00:00 IST · chat (Abilash) — the directive text
 *   - [x] D-20260717-01 · … — the directive text · acked 2026-07-18 09:00:00 IST: done in PR #93
 *
 * Acknowledge means "landed in durable state" (a PR, a QUESTIONS/DECISIONS/
 * BACKLOG entry, a sent artifact) — not "I read it".
 *
 * Usage:
 *   node scripts/directive-capture.mjs add "<text>" [--source "chat (Abilash)"]
 *   node scripts/directive-capture.mjs list            # unacknowledged only
 *   node scripts/directive-capture.mjs list --all
 *   node scripts/directive-capture.mjs ack <id> [--note "<where it landed>"]
 *   node scripts/directive-capture.mjs check           # id-uniqueness lint (CI)
 *
 * Exit codes: 0 = ok · 1 = harness/usage error · 2 = ack of unknown/already-acked
 * id, or `check` found a non-grandfathered duplicate id.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { istNow } from "./launch-scaffold.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const INBOX = "DIRECTIVES.md";

export const HEADER = `# DIRECTIVES.md — same-session directive inbox

Every directive Abilash gives in chat is appended here THE SAME SESSION, with
source and timestamp — an unlogged directive is a dropped directive (his 16-Jul
ruling; mechanism per docs/research/agentic-memory-and-state-2026-07-16.md,
MVP item 3). Entries are append-only; the ONLY permitted edit to an existing
line is flipping \`[ ]\` to \`[x]\` via \`scripts/directive-capture.mjs ack\`
(flip-only fields — agents must never prose-edit a directive). The session
boot contract (scripts/boot-contract.mjs) surfaces every unacknowledged entry
at every session start until it is explicitly acked. Ack = the directive
LANDED in durable state (PR / QUESTIONS / DECISIONS / BACKLOG / sent artifact),
never merely "read it".

`;

const ENTRY_RE = /^- \[( |x)\] (D-\d{8}-\d{2}) · (.+?) · (.+?) — (.*)$/;

/**
 * @param {string} text full DIRECTIVES.md text
 * @returns {{id:string, acked:boolean, when:string, source:string, text:string, line:number}[]}
 */
export function parseDirectives(text) {
  const out = [];
  text.split(/\r?\n/).forEach((line, i) => {
    const m = line.match(ENTRY_RE);
    if (m) out.push({ acked: m[1] === "x", id: m[2], when: m[3], source: m[4], text: m[5], line: i + 1 });
  });
  return out;
}

/**
 * Next id for the day: D-YYYYMMDD-NN (append-only ⇒ ids never reused).
 *
 * MAX+1, never COUNT+1. Counting reissues a live id the moment the day's
 * sequence has a gap — and gaps are normal here: CARD-1 relanded stranded
 * 18-Jul rows, and any hand-edit or partial cherry-pick leaves one. Three
 * collisions are on record (the 18-Jul renumber, the D-20260719-33 pair, and
 * D-20260721-09 on 21 Jul); the first two were gap-driven.
 *
 * The remaining collision cause is NOT fixable here and is deliberately left to
 * the CLI's `collidesOnOtherRefs` check: this function only sees the working
 * tree, so a directive captured on a still-open PR branch is invisible to it.
 * Keeping this pure (no git) is what makes it testable offline.
 */
export function nextId(text, now = istNow()) {
  const day = now.slice(0, 10).replaceAll("-", "");
  const highest = parseDirectives(text)
    .filter((d) => d.id.startsWith(`D-${day}-`))
    .reduce((max, d) => Math.max(max, Number.parseInt(d.id.slice(-2), 10) || 0), 0);
  return `D-${day}-${String(highest + 1).padStart(2, "0")}`;
}

/**
 * Does `id` already exist on any OTHER git ref (an open PR branch, typically)?
 *
 * The 21-Jul case: PR #220 captured D-20260721-09 at 11:11 IST and sat open;
 * main's register still ended at -08, so a 16:15 capture was handed -09 too.
 * Both were legitimate — the register, not either session, was wrong.
 *
 * Impure by necessity (shells out to git), so it lives OUTSIDE nextId and is
 * advisory: it WARNS, never blocks. A capture that fails because git is slow or
 * a ref is unreachable would be a dropped directive, and a dropped directive is
 * the exact failure the whole mechanism exists to prevent (owner's 16-Jul rule).
 */
export function collidesOnOtherRefs(id, { git } = {}) {
  // execFile with an argv array, never a shell string: `id` is machine-made
  // (D-YYYYMMDD-NN) but the injection doctrine binds regardless of provenance.
  const run = git ?? ((args) => execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  try {
    const refs = run(["for-each-ref", "--format=%(refname)", "refs/remotes/origin/"]).split("\n").filter(Boolean);
    if (refs.length === 0) return false;
    // git grep exits 1 on "no match" — that throws, and the catch reads it as no collision.
    const hits = run(["grep", "-l", "-F", `${id} ·`, ...refs, "--", INBOX]);
    return hits.trim().length > 0;
  } catch {
    return false; // no match, or git unavailable ⇒ silence, never a failed capture
  }
}

/** @returns {{text:string, id:string}} new file text + the id assigned */
export function addDirective(text, { directive, source = "chat (Abilash)", now = istNow() }) {
  if (!directive?.trim()) throw new Error("empty directive text");
  if (/\r?\n/.test(directive)) throw new Error("a directive is ONE line — split multi-part instructions into separate entries");
  const id = nextId(text, now);
  const entry = `- [ ] ${id} · ${now} · ${source} — ${directive.trim()}`;
  const body = text.endsWith("\n") || text === "" ? text : text + "\n";
  return { text: body + entry + "\n", id };
}

/**
 * The register's uniqueness law (records-hygiene consult, 2026-07-21,
 * docs/research/records-hygiene-consult-2026-07-21.md, all-three-agree):
 * every LIVE row carries a unique primary id, because ENTRY_RE-parsing
 * consumers (this script, boot-contract, status-build) key on it — a prose
 * ID-COLLISION NOTE is an HTML comment no parser can see. When a collision is
 * found before both claims merge, the UNMERGED row renumbers and carries an
 * alias naming the escaped id in its row text (CVE-REJECT-shaped: the old id
 * still greps to the row); a MERGED row is never renumbered.
 *
 * Grandfathered: collisions that had already merged on BOTH sides before this
 * law existed. Retro-renumbering merged history would orphan its cross-refs —
 * the same reason the law renumbers only unmerged rows going forward. The
 * exemption is a ROW-COUNT CEILING per id, not a blanket pass: a grandfathered
 * pair gaining a THIRD row is a new collision and fails like any other.
 */
export const GRANDFATHERED_DUPLICATE_IDS = new Map([
  // D-20260719-33 ×2 — the CARD-3 absorption (owner APPROVE, 20 Jul) landed
  // PR #175's rows verbatim next to main's; both sides were merged history by
  // the time the collision was seen. ID-COLLISION NOTE at DIRECTIVES.md:105.
  ["D-20260719-33", 2],
]);

/**
 * @param {string} text full DIRECTIVES.md text
 * @returns {{id:string, rows:number[]}[]} ids held by more rows than allowed
 */
export function findDuplicateIds(text) {
  const byId = new Map();
  for (const d of parseDirectives(text)) {
    if (!byId.has(d.id)) byId.set(d.id, []);
    byId.get(d.id).push(d.line);
  }
  return [...byId.entries()]
    .filter(([id, rows]) => rows.length > (GRANDFATHERED_DUPLICATE_IDS.get(id) ?? 1))
    .map(([id, rows]) => ({ id, rows }));
}

/** Flip one entry's checkbox — the only permitted mutation. */
export function ackDirective(text, id, { note = "", now = istNow() } = {}) {
  const lines = text.split(/\r?\n/);
  let hit = null;
  const out = lines.map((line) => {
    const m = line.match(ENTRY_RE);
    if (!m || m[2] !== id) return line;
    if (m[1] === "x") { hit = "already"; return line; }
    hit = "acked";
    return line.replace("- [ ] ", "- [x] ") + ` · acked ${now}${note ? `: ${note}` : ""}`;
  });
  return { text: out.join("\n"), result: hit ?? "unknown" };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function flag(argv, name, fallback) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : fallback;
}

function main(argv) {
  const cmd = argv[0];
  const path = join(REPO_ROOT, INBOX);
  const current = existsSync(path) ? readFileSync(path, "utf8") : HEADER;

  if (cmd === "add") {
    const directive = argv[1];
    const { text, id } = addDirective(current, { directive, source: flag(argv, "--source", "chat (Abilash)") });
    writeFileSync(path, text);
    console.log(`captured ${id} — commit ${INBOX} this session (an uncommitted directive is still a dropped directive on the next crash).`);
    // ADVISORY, never blocking: the capture already succeeded above. A directive
    // that failed to record because git was slow is the failure this mechanism exists
    // to prevent — so a collision is something the human is TOLD about, not stopped by.
    if (collidesOnOtherRefs(id)) {
      console.warn(
        `\n⚠ ID COLLISION: ${id} already exists on an origin branch — almost certainly an open PR that captured it first.\n` +
        `  Your capture stands, but YOUR row is the unmerged one — renumber IT to clear every id visible on origin refs\n` +
        `  BEFORE committing, and note the vacated id as an alias in the row text if anything already cites it.\n` +
        `  A MERGED row is never renumbered. Extend the ID-COLLISION NOTE with the resolution.\n` +
        `  (Ruling: records-hygiene consult 2026-07-21, docs/research/records-hygiene-consult-2026-07-21.md.)`
      );
    }
    return 0;
  }
  if (cmd === "check") {
    const dups = findDuplicateIds(current);
    if (dups.length === 0) {
      console.log(`directive-capture check: OK — ${parseDirectives(current).length} row(s), every live id unique (${GRANDFATHERED_DUPLICATE_IDS.size} grandfathered collision(s) documented in-file).`);
      return 0;
    }
    for (const { id, rows } of dups) {
      console.error(`VIOLATION  ${id} is held by ${rows.length} rows (lines ${rows.join(", ")}) — a duplicate live id is a dropped directive wearing a valid-looking number. Renumber the UNMERGED claim with an alias note; never renumber a merged row (records-hygiene consult 2026-07-21).`);
    }
    return 2;
  }
  if (cmd === "list") {
    const all = argv.includes("--all");
    const entries = parseDirectives(current).filter((d) => all || !d.acked);
    if (entries.length === 0) { console.log(all ? "no directives recorded." : "no unacknowledged directives."); return 0; }
    for (const d of entries) console.log(`${d.acked ? "[x]" : "[ ]"} ${d.id} · ${d.when} · ${d.source} — ${d.text}`);
    if (!all) console.log(`\n${entries.length} unacknowledged — each surfaces in state/boot.json at every session start until acked.`);
    return 0;
  }
  if (cmd === "ack") {
    const id = argv[1];
    if (!id) { console.error("usage: directive-capture.mjs ack <id> [--note '<where it landed>']"); return 1; }
    const { text, result } = ackDirective(current, id, { note: flag(argv, "--note", "") });
    if (result === "unknown") { console.error(`no directive ${id} in ${INBOX}`); return 2; }
    if (result === "already") { console.error(`${id} is already acknowledged — nothing changed (append-only law)`); return 2; }
    writeFileSync(path, text);
    console.log(`acked ${id}.`);
    return 0;
  }
  console.error("usage: directive-capture.mjs <add|list|ack|check> …  (see file header)");
  return 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(`directive-capture: harness error — ${e.message}`);
    process.exit(1);
  }
}
