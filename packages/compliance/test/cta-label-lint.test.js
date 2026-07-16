// Tests for scripts/cta-label-lint.mjs — a CTA may not claim a channel it does
// not reach. See banned-string-lint.test.js for why these live in packages/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import {
  analyzeSource,
  collectPriyaIdents,
  scanRoots,
  runControlProbes,
  findTagEnd,
  labelOf,
  PRIYA_DIGITS,
} from "../../../scripts/cta-label-lint.mjs";

const FIXTURES = resolve(dirname(fileURLToPath(import.meta.url)), "../../../scripts/fixtures/lint");

/** analyze a self-contained source the way the CLI does */
const run = (src) => analyzeSource(src, { file: "<test>", priyaIdents: collectPriyaIdents(src) });

const PRIYA = 'const WHATSAPP_URL = "https://wa.me/919289838797";';

test("control probe: a known violation flags and known-good CTAs stay clean", () => {
  const probe = runControlProbes();
  assert.equal(probe.ok, true, probe.broken.join("\n"));
});

test("the exact CTA we shipped fails: doctor language on the Priya bot's href", () => {
  const f = run(`${PRIYA}\n<a href={WHATSAPP_URL}>Ask a doctor on WhatsApp</a>`);
  assert.equal(f.length, 1);
  assert.equal(f[0].rule, "bot-channel-claimed-as-clinical");
  assert.match(f[0].message, /Priya Chatbase AI assistant/);
});

test("the honest replacement passes — the bot is disclosed as a bot", () => {
  assert.deepEqual(run(`${PRIYA}\n<a href={WHATSAPP_URL}>Ask Priya, our AI assistant</a>`), []);
});

test("★ the same words on a REAL clinical channel PASS — the claim is words RELATIVE to destination", () => {
  // This is the whole reason this gate is href-aware and not a string ban.
  assert.deepEqual(run(`const CLINIC = "tel:+914923224444";\n<a href={CLINIC}>Speak to a physician</a>`), []);
  const bad = run(`${PRIYA}\n<a href={WHATSAPP_URL}>Speak to a physician</a>`);
  assert.equal(bad.length, 1, "the identical label on the bot's href must FAIL");
});

test("a bot claim hidden in aria-label is caught (screen-reader users are patients too)", () => {
  const f = run(`${PRIYA}\n<a href={WHATSAPP_URL} aria-label="Ask a doctor on WhatsApp"><Icon /></a>`);
  assert.equal(f.length, 1);
  assert.match(f[0].message, /aria-label/);
});

test("a claim in title= is caught, and a literal href needs no binding", () => {
  const f = run(`<Link href="https://wa.me/919289838797" title="Speak to a clinician">Chat</Link>`);
  assert.equal(f.length, 1);
  assert.match(f[0].message, /title/);
});

test("an arrow function in the attrs does not break tag parsing (the `>` in `=>`)", () => {
  const f = run(`${PRIYA}\n<a href={WHATSAPP_URL} onClick={() => track("x")}>Talk to our doctors</a>`);
  assert.equal(f.length, 1, "a naive /<a[^>]*>/ truncates at the arrow and misses this");
  assert.match(f[0].message, /doctors/);
});

test("findTagEnd skips the `>` inside a JSX expression", () => {
  const src = `<a href={x} onClick={() => y}>z</a>`;
  assert.equal(src[findTagEnd(src, 0)], ">");
  assert.equal(findTagEnd(src, 0), src.indexOf(">z"));
});

test("labelOf strips nested elements and expressions down to what the user reads", () => {
  assert.equal(labelOf(`\n  <WhatsAppIcon />\n  Chat With Us on WhatsApp\n`), "Chat With Us on WhatsApp");
  assert.equal(labelOf(`{icon}Ask a doctor`), "Ask a doctor");
});

test('"consultation" is deliberately allowed on the bot href — a human fulfils a booking', () => {
  assert.deepEqual(run(`${PRIYA}\n<a href={WHATSAPP_URL}>Request a consultation</a>`), []);
  assert.deepEqual(run(`${PRIYA}\n<a href={WHATSAPP_URL}>Book on WhatsApp</a>`), []);
  assert.deepEqual(run(`${PRIYA}\n<a href={WHATSAPP_URL}>Chat With Us on WhatsApp</a>`), []);
});

test("a comment naming the ban is not a CTA", () => {
  const src = `// NEVER label this "ask a doctor" — Priya is an AI assistant.\n${PRIYA}\n<a href={WHATSAPP_URL}>WhatsApp Us</a>`;
  assert.deepEqual(run(src), []);
});

test("a non-CTA element referencing the href is not treated as a CTA label", () => {
  assert.deepEqual(run(`${PRIYA}\n<div href={WHATSAPP_URL}>Our doctors are available</div>`), []);
});

test("collectPriyaIdents resolves the binding, any formatting of the number", () => {
  assert.ok(collectPriyaIdents(PRIYA).has("WHATSAPP_URL"));
  assert.ok(collectPriyaIdents('const W = "https://wa.me/91 92898 38797";').has("W"));
  assert.equal(collectPriyaIdents('const W = "tel:+914923224444";').size, 0);
  assert.equal(PRIYA_DIGITS, "919289838797");
});

// --- the committed regression corpus ----------------------------------------

test("the cta-violating fixture FAILS on all four shapes", () => {
  const { findings, filesScanned } = scanRoots([`${FIXTURES}/cta-violating`]);
  assert.ok(filesScanned > 0, "walk found no files — a zero is not believed (§0.6)");
  assert.equal(findings.length, 4);
});

test("the cta-legitimate fixture PASSES — honest CTAs from the live repo", () => {
  const { findings, filesScanned } = scanRoots([`${FIXTURES}/cta-legitimate`]);
  assert.ok(filesScanned > 0);
  assert.deepEqual(findings, []);
});

test("the live sites pass today — this gate is a regression guard, and it is green", () => {
  const { findings, filesScanned } = scanRoots([resolve(FIXTURES, "../../../sites")]);
  assert.ok(filesScanned > 0);
  assert.deepEqual(findings, [], "a CTA on a live site claims a clinician it cannot deliver");
});
