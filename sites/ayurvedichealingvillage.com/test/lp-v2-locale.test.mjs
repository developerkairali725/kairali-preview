import { test } from "node:test";
import assert from "node:assert/strict";
import { SUPPORTED_LOCALES, pickLocale, isRtl } from "../campaign-v2/kit/locale.ts";
import { currencyForCountry, formatMoney } from "../campaign-v2/kit/currency.ts";

test("13 locales, matching the live hreflang set", () => {
  assert.deepEqual([...SUPPORTED_LOCALES], ["en","hi","ar","de","fr","es","it","pt","nl","ru","zh-Hans","ja","ko"]);
});

test("pickLocale honours q-values and only returns available locales", () => {
  assert.equal(pickLocale("de-DE,de;q=0.9,en;q=0.8", ["en", "de"]), "de");
  assert.equal(pickLocale("de-DE,de;q=0.9,en;q=0.8", ["en"]), "en");
  assert.equal(pickLocale("fr;q=0.2,ar;q=0.9", ["en", "fr", "ar"]), "ar");
  assert.equal(pickLocale("zh-CN,zh;q=0.9", ["en", "zh-Hans"]), "zh-Hans");
  assert.equal(pickLocale(null, ["en", "de"]), "en");
  assert.equal(pickLocale("xx", ["de"]), "de"); // en unavailable → first available
});

test("isRtl only for Arabic", () => {
  assert.equal(isRtl("ar"), true);
  assert.equal(isRtl("en"), false);
});

test("currencyForCountry maps markets", () => {
  assert.equal(currencyForCountry("IN"), "INR");
  for (const cc of ["AE","SA","QA","KW","OM","BH"]) assert.equal(currencyForCountry(cc), "AED");
  for (const cc of ["DE","FR","IT","ES","NL","IE","AT","BE","PT","FI"]) assert.equal(currencyForCountry(cc), "EUR");
  assert.equal(currencyForCountry("GB"), "GBP");
  assert.equal(currencyForCountry("US"), "USD");
  assert.equal(currencyForCountry(null), "USD");
});

test("pickLocale hardening: q<=0, malformed q, zh variants, wildcard, empty", () => {
  assert.equal(pickLocale("de;q=0,fr;q=0.1", ["de", "en", "fr"]), "fr");
  assert.equal(pickLocale("de;q=abc,fr;q=0.5", ["de", "fr", "en"]), "de");
  assert.equal(pickLocale("fr;q =0.2,de;q= 0.9", ["en", "fr", "de"]), "de");
  assert.equal(pickLocale("zh-TW", ["en", "zh-Hans"]), "zh-Hans");
  assert.equal(pickLocale("zh-Hant", ["en", "zh-Hans"]), "zh-Hans");
  assert.equal(pickLocale("zhx", ["en", "zh-Hans"]), "en");
  assert.equal(pickLocale("*", ["en", "de"]), "en");
  assert.equal(pickLocale("de", []), "en");
});

test("currencyForCountry: Bulgaria is in the eurozone", () => {
  assert.equal(currencyForCountry("BG"), "EUR");
});

test("formatMoney grouping depends on currency, not only UI language", () => {
  assert.ok(!formatMoney(1234567, "USD", "en").includes("12,34,567"));
  assert.ok(formatMoney(1234567, "INR", "en").includes("12,34,567"));
  assert.ok(!formatMoney(1234567, "GBP", "en").includes("12,34,567"));
  assert.ok(!formatMoney(1234567, "USD", "en").startsWith("$"));
});

test("formatMoney uses the visitor locale and no decimals", () => {
  assert.equal(formatMoney(310000, "INR", "en"), "₹3,10,000");
  assert.equal(formatMoney(4424, "USD", "en"), "USD\u00a04,424");
});
