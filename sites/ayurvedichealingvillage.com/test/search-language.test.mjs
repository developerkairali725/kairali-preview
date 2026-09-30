import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { localizeFallbackChrome, mapSearchHref, resolveSearchLocale, searchLanguageHref } from "../app/(english)/search/search-language.ts";

const locales = JSON.parse(readFileSync("l10n/locales.json", "utf8"));
const routes = JSON.parse(readFileSync("l10n/routes.json", "utf8")).routes;

test("search language accepts only registered scalar locale codes", () => {
  for (const code of Object.keys(locales)) assert.equal(resolveSearchLocale(code, locales), code);
  for (const invalid of ["../hi", "../../etc/passwd", "zh", "en-US", "xx", "__proto__", ["hi", "de"], null, undefined]) {
    assert.equal(resolveSearchLocale(invalid, locales), "en", String(invalid));
  }
});

test("mapped result links retain query and hash; absent locale routes stay on their reviewed path", () => {
  const local = (path) => routes[path]?.de ?? null;
  assert.equal(mapSearchHref("/faqs-downloads/?q=Schlaf%20gut#q-48", local), `${routes["/faqs-downloads/"].de}?q=Schlaf%20gut#q-48`);
  assert.equal(mapSearchHref("/contact-us/", local), "/de/kontakt/");
  assert.equal(mapSearchHref("/not-a-reviewed-route/?q=x#part", local), "/not-a-reviewed-route/?q=x#part");
  assert.equal(mapSearchHref("//other.example/path", local), "//other.example/path");
  assert.equal(searchLanguageHref("de", "Schlaf gut"), "/search/?lang=de&q=Schlaf%20gut");
});

function client(language, paths = {}) {
  const context = { __AHV_LOCALE: language, AHV_LOCAL_PATHS: paths };
  vm.createContext(context);
  vm.runInContext(readFileSync("public/design/search.js", "utf8"), context);
  return context.AHVSearch;
}

test("overlay result paths and View all carry the current language", () => {
  const de = client("de", Object.fromEntries(Object.entries(routes).map(([path, row]) => [path, row.de]).filter(([, path]) => path)));
  assert.equal(de.localHref("/faqs-downloads/?q=Schlaf%20gut#q-48"), `${routes["/faqs-downloads/"].de}?q=Schlaf%20gut#q-48`);
  assert.equal(de.searchPageHref("पंचकर्म"), "/search/?q=%E0%A4%AA%E0%A4%82%E0%A4%9A%E0%A4%95%E0%A4%B0%E0%A5%8D%E0%A4%AE&lang=de");
  assert.equal(client("en").searchPageHref("panchakarma"), "/search/?q=panchakarma");
  assert.equal(client("../../etc/passwd").currentLocale(), "en");
});


test("English snapshot fallback uses reviewed Hindi labels and route destinations", async () => {
  const catalog = JSON.parse(readFileSync("l10n/generated/hi.catalog.json", "utf8"));
  const { createHash } = await import("node:crypto");
  const translate = (text) => catalog["t_" + createHash("sha256").update(text).digest("hex").slice(0, 20)] ?? text;
  const html = '<header><a href="/">Home</a><a href="/our-villas/">Villas</a><a href="/yoga-meditation-training/">Yoga &amp; Training</a><a href="https://bookings.ayurvedichealingvillage.com/">Book Now</a><button class="ahv-lang-btn" aria-label="Choose language — Current language: English"><svg></svg><span>EN</span></button></header>';
  const output = localizeFallbackChrome(html, "hi", locales.hi.name, (path) => routes[path]?.hi ?? null, translate);
  assert.match(output, /href="\/hi\/"[^>]*>मुखपृष्ठ<\/a>/);
  assert.match(output, /href="\/hi\/our-villas\/"[^>]*>विला<\/a>/);
  assert.match(output, /योग और ध्यान प्रशिक्षण/);
  assert.match(output, /<span>HI<\/span>/);
  assert.match(output, /aria-label="भाषा चुनें — वर्तमान भाषा: हिन्दी"/);
  assert.match(output, /href="https:\/\/bookings\.ayurvedichealingvillage\.com\/"/);
});


test("snapshot fallback preserves HTML-encoded query parameters once", () => {
  const output = localizeFallbackChrome('<a href="/contact-us/?a=1&amp;b=2#help">Contact</a>', "de", "Deutsch", path => routes[path]?.de ?? null, text => text);
  assert.equal(output, '<a href="/de/kontakt/?a=1&amp;b=2#help">Contact</a>');
});
