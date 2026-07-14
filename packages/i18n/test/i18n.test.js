import test from "node:test";
import assert from "node:assert/strict";
import {
  isRtl,
  declaredLocales,
  localePath,
  hreflangLanguages,
  dictionaryGaps,
  createTranslator,
} from "../src/index.js";

const site = { domain: "example.com", locales: ["en", "de", "fr"] };

test("declaredLocales requires EN", () => {
  assert.deepEqual(declaredLocales(site), ["en", "de", "fr"]);
  assert.throws(() => declaredLocales({ domain: "x.com", locales: ["de"] }), /must declare "en"/);
});

test("localePath: EN bare, others prefixed", () => {
  assert.equal(localePath("/", "en"), "/");
  assert.equal(localePath("/", "de"), "/de/");
  assert.equal(localePath("/consultation", "fr"), "/fr/consultation");
  assert.throws(() => localePath("consultation", "en"), /must start with/);
});

test("hreflang map is complete + reciprocal + has x-default", () => {
  const languages = hreflangLanguages(site, "/");
  assert.deepEqual(languages, {
    en: "https://example.com/",
    de: "https://example.com/de/",
    fr: "https://example.com/fr/",
    "x-default": "https://example.com/",
  });
  // reciprocity by construction: the same map is emitted on every locale's page
  const onDePage = hreflangLanguages(site, "/");
  assert.deepEqual(onDePage, languages);
});

test("dictionaryGaps finds missing locales, keys, and undeclared dictionaries", () => {
  const gaps = dictionaryGaps(
    { en: { a: "A", b: "B" }, de: { a: "A-de" }, ru: { a: "x", b: "y" } },
    site,
  );
  assert.ok(gaps.some((g) => g.includes(`locale "de" is missing key "b"`)));
  assert.ok(gaps.some((g) => g.includes(`declared locale "fr" has no dictionary`)));
  assert.ok(gaps.some((g) => g.includes(`"ru" exists but the site does not declare`)));
});

test("createTranslator throws on incomplete dictionaries (locale gate)", () => {
  assert.throws(
    () => createTranslator({ en: { a: "A" } }, site),
    /locale gate failed/,
  );
  const t = createTranslator(
    { en: { a: "A" }, de: { a: "A-de" }, fr: { a: "A-fr" } },
    site,
  );
  assert.equal(t("de", "a"), "A-de");
  assert.throws(() => t("ru", "a"), /not declared/);
});

test("empty-string values count as gaps (no blank transcreation)", () => {
  const gaps = dictionaryGaps({ en: { a: "A" }, de: { a: "" }, fr: { a: "x" } }, site);
  assert.ok(gaps.some((g) => g.includes(`locale "de" is missing key "a"`)));
});

test("isRtl", () => {
  assert.equal(isRtl("ar"), true);
  assert.equal(isRtl("en"), false);
});
