import { test } from "node:test";
import assert from "node:assert/strict";
import { readPref, writePref, localeOverride, LANG_COOKIE } from "../campaign-v2/sections/interactive/prefs.ts";

test("prefs survive a throwing storage", () => {
  const bad = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.equal(readPref(bad, "lp-currency"), null);
  assert.doesNotThrow(() => writePref(bad, "lp-currency", "EUR"));
  assert.equal(readPref(undefined, "lp-currency"), null);
  assert.doesNotThrow(() => writePref(undefined, "lp-currency", "EUR"));
});

test("prefs round-trip", () => {
  const m = new Map(); const s = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  writePref(s, "lp-currency", "EUR"); assert.equal(readPref(s, "lp-currency"), "EUR");
});

test("locale override accepts only a locale the campaign offers", () => {
  assert.equal(LANG_COOKIE, "lp-lang");
  assert.equal(localeOverride("de", ["en", "de"]), "de");
  assert.equal(localeOverride(" ar ", ["en", "ar"]), "ar");
  assert.equal(localeOverride("fr", ["en", "de"]), null);
  assert.equal(localeOverride("DE", ["en", "de"]), null, "exact match only");
  assert.equal(localeOverride("zh-Hans", ["en", "zh-Hans"]), "zh-Hans");
  assert.equal(localeOverride(undefined, ["en"]), null);
  assert.equal(localeOverride(["de"], ["de"]), null);
  assert.equal(localeOverride("", ["en"]), null);
});
