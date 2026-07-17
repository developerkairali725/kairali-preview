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
 *
 * Exit codes: 0 = ok · 1 = harness/usage error · 2 = ack of unknown/already-acked id.
 */

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

/** Next id for the day: D-YYYYMMDD-NN (append-only ⇒ ids never reused). */
export function nextId(text, now = istNow()) {
  const day = now.slice(0, 10).replaceAll("-", "");
  const taken = parseDirectives(text).filter((d) => d.id.startsWith(`D-${day}-`)).length;
  return `D-${day}-${String(taken + 1).padStart(2, "0")}`;
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
    return 0;
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
  console.error("usage: directive-capture.mjs <add|list|ack> …  (see file header)");
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
