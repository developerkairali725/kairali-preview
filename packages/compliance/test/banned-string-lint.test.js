// Tests for scripts/banned-string-lint.mjs — the string half of G6-PRE.
//
// WHY THE TESTS LIVE HERE AND NOT IN scripts/test/: CI discovers tests with
// `find packages sites -path '*/test/*.test.js'` (.github/workflows/factory-gate.yml).
// `scripts/` is OUTSIDE that path, so a test at scripts/test/ would be DEAD ON
// ARRIVAL — which has already happened twice in this repo (tests/ktahv-critical-
// flows.spec.ts, and sites/whatisayurveda.com/test/medical-review.test.js under
// the old glob). A test that does not run is not a gate; it is a comment. This
// is the compliance-gate family, it is an existing workspace package (so no
// pnpm-lock churn and no `--frozen-lockfile` break), and the find picks it up.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import {
  RULES,
  scanText,
  scanRoots,
  stripCodeComments,
  runControlProbes,
} from "../../../scripts/banned-string-lint.mjs";

const FIXTURES = resolve(dirname(fileURLToPath(import.meta.url)), "../../../scripts/fixtures/lint");
const ids = (findings) => findings.map((f) => f.rule);
const errors = (findings) => findings.filter((f) => f.severity === "error");

// --- the control probe itself (§0.6) ----------------------------------------

test("every rule matches its known-present probe — a rule that stops matching reports CLEAN", () => {
  const probe = runControlProbes();
  assert.equal(probe.ok, true, probe.broken.join("\n"));
  assert.equal(probe.probes, RULES.length);
});

test("a deliberately broken regex is caught by the control probe (§11.3 fixture 3)", () => {
  // "Fixture 3: a lint whose regex is deliberately broken — the control probe
  // must catch it." A gate that cannot detect its own breakage is not a gate.
  const broken = RULES.map((r) =>
    r.id !== "ask-a-doctor" ? r : { ...r, scan: () => [] } // silently matches nothing
  );
  const probe = runControlProbes(broken);
  assert.equal(probe.ok, false);
  assert.match(probe.broken.join(" "), /ask-a-doctor: PROBE DID NOT MATCH/);
});

// --- the real incidents ------------------------------------------------------

test('"Ask a doctor on WhatsApp" fails — the CTA reached the Priya AI bot (MR-3)', () => {
  const f = errors(scanText("<a>Ask a doctor on WhatsApp</a>", { kind: "code" }));
  assert.deepEqual(ids(f), ["ask-a-doctor"]);
});

test("the claim is caught even when JSX wraps it across two lines", () => {
  // page.tsx:96 wraps mid-claim. A line-based scanner misses this entirely.
  const src = `<p>\n  Every page on health topics is reviewed by a registered\n  Ayurvedic doctor before it is published.\n</p>`;
  const f = errors(scanText(src, { kind: "code" }));
  assert.ok(ids(f).includes("blanket-review-claim"), `expected blanket claim, got ${ids(f)}`);
});

test("the elliptical tile shape is caught — no copula, verb 'checked' (whatisayurveda tile 4)", () => {
  // The shipped trust-strip tile: quantifier + page-noun + bare participle,
  // no is/are anywhere, and a verb the original pattern did not know.
  const f = errors(scanText('<dd>Every health page checked by a BAMS doctor.</dd>', { kind: "code" }));
  assert.ok(ids(f).includes("blanket-review-claim"), `expected blanket claim, got ${ids(f)}`);
});

test("the truthed tile passes — the per-page rule is not a blanket claim", () => {
  const f = errors(scanText('<dd>Reviewed pages carry the doctor’s name and date.</dd>', { kind: "code" }));
  assert.ok(!ids(f).includes("blanket-review-claim"), `per-page rule flagged: ${ids(f)}`);
});

test("the known-bad WhatsApp number is caught in ANY formatting", () => {
  for (const bad of ["+91 92898 38777", "9289838777", "+91-92898-38777", "https://wa.me/919289838777", "(92898) 38777"]) {
    assert.deepEqual(ids(errors(scanText(bad, { kind: "plain" }))), ["wrong-whatsapp-38777"], `missed: ${bad}`);
  }
});

test("the correct locked number never fires", () => {
  assert.deepEqual(errors(scanText("WhatsApp +91 92898 38797", { kind: "plain" })), []);
});

test('a hardcoded `REVIEWED = "2026-07-14"` fails the build — failure #5 exactly', () => {
  const f = errors(scanText('const REVIEWED = "2026-07-14";', { kind: "code" }));
  assert.deepEqual(ids(f), ["hardcoded-review-date"]);
});

test("a literal review date bound to a review key in CODE fails", () => {
  const f = errors(scanText('const schema = { lastReviewed: "2026-07-14" };', { kind: "code" }));
  assert.deepEqual(ids(f), ["hardcoded-review-date"]);
});

// --- the discrimination: legitimate uses MUST pass ---------------------------

test("a non-review date constant is NOT a medical claim", () => {
  assert.deepEqual(errors(scanText('const LAUNCH_DATE = "2026-07-14";', { kind: "code" })), []);
});

test('per-page `reviewedOn` in CONTENT json is the LEGITIMATE datum, never a violation', () => {
  // This is the shape resolveReview() requires. Flagging it would forbid the fix.
  assert.deepEqual(errors(scanText('{ "reviewedOn": "2026-07-15", "reviewedBy": "deepu-john" }', { kind: "plain" })), []);
});

test("a code comment EXPLAINING the ban is not a violation (chrome.tsx:5-7)", () => {
  const src = [
    'export const WHATSAPP_URL = "https://wa.me/919289838797"; // Priya = AI ASSISTANT',
    '// (Abilash confirmed 15 Jul 2026). NEVER label this "ask a doctor" — on a YMYL',
    "// health site that is a false medical claim. The bad number is +91 92898 38777.",
    '/* The previous code hardcoded `REVIEWED = "2026-07-14"` and stamped EVERY page,',
    '   promising "every health page is physician-reviewed" — reviews that never happened. */',
  ].join("\n");
  assert.deepEqual(errors(scanText(src, { kind: "code" })), []);
});

test("our honest footer copy survives — a lint that punishes it gets ignored (§0.6)", () => {
  const honest = [
    "Always consult a doctor before starting any treatment.",
    "Ayurvedic therapies and herbs should be used under the guidance of a qualified physician.",
    "Health pages reviewed by one of our Ayurvedic physicians are marked with that doctor's name and the date they approved it.",
    "each page states honestly whether a physician has reviewed it yet.",
    "Not every page is reviewed by a physician, and we say so on the ones that are not.",
    "We do not claim every page is reviewed.",
    "Ask Priya, our AI assistant",
    "Medically reviewed by Dr. Deepu John (BAMS)",
  ];
  for (const line of honest) {
    assert.deepEqual(errors(scanText(line, { kind: "plain" })), [], `flagged honest copy: ${line}`);
  }
});

test("a URL inside a string is never mistaken for a `//` comment", () => {
  const stripped = stripCodeComments('const u = "https://wa.me/919289838777"; // note');
  assert.match(stripped, /wa\.me\/919289838777/);
  assert.ok(!stripped.includes("note"));
  assert.deepEqual(ids(errors(scanText('const u = "https://wa.me/919289838777";', { kind: "code" }))), ["wrong-whatsapp-38777"]);
});

test("a regex literal containing `//` does not swallow the rest of its line", () => {
  const src = 'const re = /^\\/\\//; const BAD = "+91 92898 38777";';
  assert.deepEqual(ids(errors(scanText(src, { kind: "code" }))), ["wrong-whatsapp-38777"]);
});

test("stripCodeComments preserves line numbers so file:line stays true", () => {
  const src = "// a\n/* b\n   c */\nconst BAD = \"+91 92898 38777\";";
  assert.equal(stripCodeComments(src).split("\n").length, src.split("\n").length);
  assert.deepEqual(errors(scanText(src, { kind: "code" })).map((f) => f.line), [4]);
});

test("banned-string-allow suppresses on that line only, and is REPORTED, never silent", () => {
  const src = 'const bad = "+91 92898 38777"; // banned-string-allow: wrong-whatsapp-38777\nconst other = "+91 92898 38777";';
  const f = scanText(src, { kind: "code" });
  assert.equal(f.length, 2);
  assert.equal(f[0].severity, "info");
  assert.match(f[0].message, /suppressed/);
  assert.equal(f[1].severity, "error");
  assert.equal(f[1].line, 2);
});

// --- manufacture-attached 1908 (C-LF-02/03 + C-SC-03, RPT-20260721-DEEPC) ----

test("the bulk-site trust strip fails — 1908 attached to manufacture in one clause", () => {
  const f = errors(scanText("<span>Trusted since 1908 — four generations of Ayurvedic manufacture</span>", { kind: "code" }));
  assert.ok(ids(f).includes("manufacture-attached-1908"), `expected manufacture-attached-1908, got ${ids(f)}`);
});

test("the hero-overline compression fails — manufacturer · Since 1908, founded 1989", () => {
  const f = errors(scanText('<p className="overline">WHO-GMP manufacturer · Since 1908, founded 1989</p>', { kind: "code" }));
  assert.ok(ids(f).includes("manufacture-attached-1908"), `expected manufacture-attached-1908, got ${ids(f)}`);
});

test('the dangling "Since 1908, founded 1989" compression fails even without a manufacture noun nearby', () => {
  const f = errors(scanText("WHO-GMP manufacture at Pollachi. Since 1908, founded 1989.", { kind: "plain" }));
  assert.ok(ids(f).includes("manufacture-attached-1908"), `expected manufacture-attached-1908, got ${ids(f)}`);
});

test('"four generations of Ayurvedic manufacture" fails on its own — generations belong to the practice', () => {
  const f = errors(scanText("Backed by four generations of Ayurvedic manufacture.", { kind: "plain" }));
  assert.ok(ids(f).includes("manufacture-attached-1908"), `expected manufacture-attached-1908, got ${ids(f)}`);
});

test("the ruled 1948 split passes — the canonical corrections must never fail", () => {
  const canonical = [
    "A family practising Ayurveda since 1908 — manufacturing since 1948.",
    "A family practising Ayurveda since 1908 · manufacturing since 1948",
    "founded 1989; a family practising Ayurveda since 1908",
    "Four generations practising Ayurveda since 1908; Ayurvedic manufacturing since 1948.",
    "WHO-GMP manufacturer · founded 1989 · a family practising Ayurveda since 1908",
    "WHO-GMP manufacture at Pollachi. Founded 1989; a family practising Ayurveda since 1908.",
  ];
  for (const line of canonical) {
    const f = errors(scanText(line, { kind: "plain" })).filter((x) => x.rule === "manufacture-attached-1908");
    assert.deepEqual(f, [], `flagged the ruled correction: ${line}`);
  }
});

test("a clause boundary stops the 1908→manufacture window — semicolon-separated facts stay legal", () => {
  const f = errors(scanText("A family practising Ayurveda since 1908; WHO-GMP manufacture at Pollachi.", { kind: "plain" }))
    .filter((x) => x.rule === "manufacture-attached-1908");
  assert.deepEqual(f, [], "the semicolon separates the claims — no attachment");
});

// --- the committed regression corpus ----------------------------------------

test("the violating fixture FAILS, and every rule is exercised by it", () => {
  const { findings, filesScanned } = scanRoots([`${FIXTURES}/violating`]);
  const found = new Set(ids(errors(findings)));
  assert.ok(filesScanned > 0, "walk found no files — a zero is not believed (§0.6)");
  for (const rule of RULES) {
    assert.ok(found.has(rule.id), `rule "${rule.id}" is not exercised by the violating corpus`);
  }
});

test("the legitimate fixture PASSES — zero findings on real, honest repo copy", () => {
  const { findings, filesScanned } = scanRoots([`${FIXTURES}/legitimate`]);
  assert.ok(filesScanned > 0);
  assert.deepEqual(errors(findings), [], "the negation corpus must never fail");
});

// --- the rule that survives only as prose is the rule that dies --------------

test("chrome.tsx still documents that Priya is an AI assistant, not a physician", () => {
  // If this comment is ever deleted, the ban's WHY is gone — the lint stays, but
  // the next engineer loses the reason. Bind them together.
  const chrome = readFileSync(resolve(FIXTURES, "../../../sites/whatisayurveda.com/app/_components/chrome.tsx"), "utf8");
  assert.match(chrome, /NOT a physician/i);
  assert.match(chrome, /ask a doctor/i);
});

// Owner-approved CV deletion channel: scoped exceptions must not turn into a fleet allowlist.
test("AHV CV privacy notices permit career email while general contact copy still fails", () => {
  const violation = (text, file) => scanText(text, {file, kind: "code"}).some(f => f.rule === "wrong-contact-email");
  const base = "sites/ayurvedichealingvillage.com/";
  assert.equal(violation("career@kairali.com", base + "english-candidate/prerender/privacy-policy.html"), false);
  assert.equal(violation("career@kairali.com", base + "english-candidate/prerender/contact.html"), true);
  const article = base + "public/ahv/assets/article-family-data.js";
  assert.equal(violation("Request deletion at career@kairali.com; the target is 30 days, with any documented exception explained.", article), false);
  assert.equal(violation("Contact career@kairali.com", article), true);
  assert.equal(violation("career@kairali.com", "sites/example.com/privacy-policy.html"), true);
});
