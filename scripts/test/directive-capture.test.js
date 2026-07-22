/**
 * directive-capture.test.js — the id-assignment law.
 *
 * Written after the THIRD id collision in the register (D-20260721-09, 21 Jul
 * 2026: PR #220 captured it at 11:11 IST and stayed open, so a 16:15 capture on
 * a fresh main was handed the same id). The two earlier ones — the 18-Jul
 * renumber recorded at DIRECTIVES.md:99 and the D-20260719-33 pair at :105 —
 * were the other cause: COUNT+1 arithmetic reissuing a live id across a gap.
 *
 * Both causes are pinned here. A directive that silently overwrites another
 * directive's id is a dropped directive wearing a valid-looking number, which is
 * the exact failure the capture mechanism exists to prevent (owner's 16-Jul rule).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { addDirective, nextId, parseDirectives, ackDirective, collidesOnOtherRefs, findDuplicateIds, GRANDFATHERED_DUPLICATE_IDS } from "../directive-capture.mjs";

const NOW = "2026-07-21 16:15:19 IST";
const row = (id, when = NOW, acked = false) =>
  `- [${acked ? "x" : " "}] ${id} · ${when} · chat (Abilash) — some directive text`;

test("nextId takes MAX+1, not COUNT+1 — a gap must never reissue a live id", () => {
  // The real shape of the two earlier collisions: -01 and -03 present, -02
  // absent (relanded elsewhere, or never captured). COUNT+1 would answer -03
  // and silently duplicate a live directive.
  const text = [row("D-20260721-01"), row("D-20260721-03")].join("\n") + "\n";
  assert.equal(nextId(text, NOW), "D-20260721-04");
});

test("nextId ignores other days when numbering today", () => {
  const text = [row("D-20260720-09"), row("D-20260720-10"), row("D-20260721-01")].join("\n") + "\n";
  assert.equal(nextId(text, NOW), "D-20260721-02");
});

test("nextId starts at 01 on a day with no directives", () => {
  assert.equal(nextId(`${row("D-20260720-04")}\n`, NOW), "D-20260721-01");
});

test("nextId pads to two digits and keeps ordering past 09", () => {
  const text = Array.from({ length: 9 }, (_, i) => row(`D-20260721-0${i + 1}`)).join("\n") + "\n";
  assert.equal(nextId(text, NOW), "D-20260721-10");
});

test("acked rows still consume their id — acking never frees a number", () => {
  const text = [row("D-20260721-01", NOW, true), row("D-20260721-02", NOW, true)].join("\n") + "\n";
  assert.equal(nextId(text, NOW), "D-20260721-03");
});

test("addDirective assigns the computed id and appends one line, append-only", () => {
  const before = `${row("D-20260721-01")}\n`;
  const { text, id } = addDirective(before, { directive: "do the thing", now: NOW });
  assert.equal(id, "D-20260721-02");
  assert.ok(text.startsWith(before), "existing rows must survive byte-identically");
  assert.equal(parseDirectives(text).length, 2);
});

test("a directive is ONE line — multi-line input is refused, not silently joined", () => {
  assert.throws(() => addDirective("", { directive: "first clause\nsecond clause", now: NOW }), /ONE line/);
});

test("ack flips exactly one checkbox and refuses a second flip", () => {
  const { text } = addDirective("", { directive: "do the thing", now: NOW });
  const first = ackDirective(text, "D-20260721-01", { note: "landed in PR #1", now: NOW });
  assert.equal(first.result, "acked");
  assert.match(first.text, /- \[x\] D-20260721-01/);
  assert.equal(ackDirective(first.text, "D-20260721-01", { now: NOW }).result, "already");
});

test("ack on an unknown id reports unknown rather than inventing a row", () => {
  const { text } = addDirective("", { directive: "do the thing", now: NOW });
  const res = ackDirective(text, "D-20260721-99", { now: NOW });
  assert.equal(res.result, "unknown");
  assert.equal(res.text, text, "an unknown ack must not mutate the register at all");
});

// --- collidesOnOtherRefs: the cause nextId structurally cannot see -----------

test("collidesOnOtherRefs reports TRUE when an origin branch already carries the id", () => {
  // Reproduces 21 Jul exactly: main's register ends at -08, so nextId hands out
  // -09, while PR #220's branch has carried -09 since 11:11 IST.
  const git = (args) => {
    if (args[0] === "for-each-ref") return "refs/remotes/origin/main\nrefs/remotes/origin/records/directives-0910\n";
    if (args[0] === "grep") return "refs/remotes/origin/records/directives-0910:DIRECTIVES.md\n";
    throw new Error(`unexpected git call: ${args.join(" ")}`);
  };
  assert.equal(collidesOnOtherRefs("D-20260721-09", { git }), true);
});

test("collidesOnOtherRefs reports FALSE when git grep finds nothing (it exits non-zero)", () => {
  const git = (args) => {
    if (args[0] === "for-each-ref") return "refs/remotes/origin/main\n";
    throw Object.assign(new Error("Command failed: git grep"), { status: 1 }); // grep's no-match exit
  };
  assert.equal(collidesOnOtherRefs("D-20260721-11", { git }), false);
});

test("collidesOnOtherRefs stays silent when git is unavailable — never a failed capture", () => {
  const git = () => { throw new Error("git: command not found"); };
  assert.equal(collidesOnOtherRefs("D-20260721-09", { git }), false);
});

test("collidesOnOtherRefs short-circuits with no remote refs (fresh clone, no origin)", () => {
  let grepped = false;
  const git = (args) => {
    if (args[0] === "for-each-ref") return "";
    grepped = true;
    return "";
  };
  assert.equal(collidesOnOtherRefs("D-20260721-09", { git }), false);
  assert.equal(grepped, false, "with zero refs there is nothing to grep — do not shell out again");
});

test("collidesOnOtherRefs passes the id as an argv element, never a shell string", () => {
  // The injection doctrine binds regardless of the id being machine-generated.
  let seen = null;
  const git = (args) => {
    if (args[0] === "for-each-ref") return "refs/remotes/origin/main\n";
    seen = args;
    return "";
  };
  collidesOnOtherRefs("D-20260721-09", { git });
  assert.ok(Array.isArray(seen), "git must be invoked with an argument array");
  assert.ok(seen.includes("D-20260721-09 ·"), "the search term travels as its own argv element");
  assert.ok(!seen.some((a) => /[;&|$`]/.test(a)), "no argv element may carry shell metacharacters");
});

// --- findDuplicateIds: the uniqueness law (records-hygiene consult, 21 Jul) --

test("findDuplicateIds flags an id held by two live rows, with both line numbers", () => {
  // The 21-Jul shape: GO-DOCTOR-FIX and AMBUJ ASSET ACCESS both carrying -09.
  const text = [row("D-20260721-09"), row("D-20260721-10"), row("D-20260721-09", NOW, true)].join("\n") + "\n";
  const dups = findDuplicateIds(text);
  assert.equal(dups.length, 1);
  assert.equal(dups[0].id, "D-20260721-09");
  assert.deepEqual(dups[0].rows, [1, 3]);
});

test("findDuplicateIds passes a clean register", () => {
  const text = [row("D-20260721-09"), row("D-20260721-10")].join("\n") + "\n";
  assert.deepEqual(findDuplicateIds(text), []);
});

test("grandfathered ids stay exempt — the law binds FORWARD, merged history is never failed", () => {
  // D-20260719-33 ×2 merged on both sides before the law existed (CARD-3
  // absorption). Retro-failing it would demand a renumber of merged rows,
  // which is the exact mutation the law forbids.
  const text = [row("D-20260719-33"), row("D-20260719-33", NOW, true)].join("\n") + "\n";
  assert.deepEqual(findDuplicateIds(text), []);
  assert.ok(GRANDFATHERED_DUPLICATE_IDS.has("D-20260719-33"));
});

test("a grandfathered id colliding a THIRD time still fails — the exemption is a ceiling, not a blanket", () => {
  const text = [row("D-20260719-33"), row("D-20260719-33"), row("D-20260719-33")].join("\n") + "\n";
  const dups = findDuplicateIds(text);
  assert.equal(dups.length, 1);
  assert.equal(dups[0].id, "D-20260719-33");
  assert.equal(dups[0].rows.length, 3);
});

test("alias text inside a row body is invisible to the parser — the vacated id never re-parses as a row", () => {
  // The renumber-with-alias mechanism depends on this: "(formerly D-20260721-09)"
  // in a row's text must not make the parser see -09 as a second live claim.
  const aliasRow = `- [x] D-20260721-12 · ${NOW} · chat (Abilash) — GO-DOCTOR-FIX (formerly D-20260721-09, see ID-COLLISION NOTE) — the doctor wave`;
  const text = [row("D-20260721-09"), aliasRow].join("\n") + "\n";
  assert.deepEqual(findDuplicateIds(text), []);
  const ids = parseDirectives(text).map((d) => d.id);
  assert.deepEqual(ids, ["D-20260721-09", "D-20260721-12"]);
});
