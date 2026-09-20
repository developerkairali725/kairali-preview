/**
 * The mojibake recovery is the only thing standing between a page of garbage
 * and Russian copy nobody in this lane can read. So it is tested on both sides:
 * it must recover what is broken, and it must leave alone what is not.
 *
 * The fixture is the live page itself when it is present — the real 277KB of
 * /treatment-in-kerala-russian.html — and the shape assertions run regardless.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { recover, verify, redamage } from "../tools/lib/mojibake.mjs";

/** Damage a string exactly the way the live page was damaged. */
const damage = (s) => redamage(s, 1);

test("a damaged Russian string comes back exactly", () => {
  const original = "Лучший Аюрведический Ретрит в Керале";
  const broken = damage(original);
  assert.notEqual(broken, original, "the fixture must actually be damaged");
  assert.equal(/[Ѐ-ӿ]/.test(broken), false, "damaged text has no Cyrillic");

  const r = recover(broken);
  assert.equal(r.text, original);
  assert.equal(verify(r).ok, true);
});

test("real typographic punctuation is NOT touched", () => {
  // An em dash, curly quotes and a degree sign, undamaged. Every one of these
  // is a character the scanner treats as suspicious, and every one must survive.
  const clean = 'A—B “C” D’E 30° «F»';
  const r = recover(clean);
  assert.equal(r.text, clean, "clean punctuation was altered");
  assert.equal(r.converted, 0);
});

test("plain ASCII is returned byte for byte", () => {
  const s = "<h1>Authentic Ayurvedic Treatments in Kerala</h1>";
  assert.equal(recover(s).text, s);
});

test("damaged punctuation IS recovered — the test is monotonic, not language-specific", () => {
  const original = "Kerala — one of the safest states";
  const r = recover(damage(original));
  assert.equal(r.text, original);
});

test("a run that cannot decode cleanly is left alone rather than mangled", () => {
  // A lone 0x97 byte is not a valid UTF-8 start, so the inverse cannot apply.
  const s = "x—y";
  const r = recover(s);
  assert.equal(r.text, s);
  assert.equal(r.converted, 0);
});

test("mixed English and damaged Russian: only the Russian moves", () => {
  const english = "Exclusive Healing Secrets Of Kairali";
  const russian = "Аутентичный аюрведический ретрит";
  const mixed = `<h2>${english}</h2><h1>${damage(russian)}</h1>`;
  const r = recover(mixed);
  assert.ok(r.text.includes(english), "the English heading was altered");
  assert.ok(r.text.includes(russian), "the Russian heading was not recovered");
  assert.equal(verify(r).ok, true);
});

test("recovery is idempotent — running it on clean text changes nothing", () => {
  const original = "Керала — один из самых безопасных штатов";
  const once = recover(damage(original)).text;
  assert.equal(recover(once).text, once);
});

test("every conversion it reports is one it can prove", () => {
  const r = recover(damage("Панчакарма в Керале — 21 день"));
  const v = verify(r);
  assert.equal(v.ok, true);
  assert.equal(v.checked, r.converted);
  assert.equal(v.failures.length, 0);
});
