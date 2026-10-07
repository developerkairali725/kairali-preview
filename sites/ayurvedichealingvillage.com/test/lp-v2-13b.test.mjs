import { test } from "node:test";
import assert from "node:assert/strict";
import {
  langCookie, langUrl, reconcileCurrency, isCurrency, wrapIndex, localeChip, CURRENCY_PREF, CURRENCY_EVENT,
} from "../campaign-v2/sections/interactive/ui-helpers.ts";
import { priceAmount } from "../campaign-v2/sections/price-line.ts";

test("language cookie string", () => {
  assert.equal(langCookie("de"), "lp-lang=de; Path=/lp-v2; Max-Age=31536000; SameSite=Lax");
  assert.equal(langCookie("zh-Hans"), "lp-lang=zh-Hans; Path=/lp-v2; Max-Age=31536000; SameSite=Lax");
});

test("?lang URL keeps the other query params and the hash", () => {
  assert.equal(
    langUrl("https://x.test/lp-v2/panchakarma/a?gclid=abc&utm_source=g#enquire", "de"),
    "https://x.test/lp-v2/panchakarma/a?gclid=abc&utm_source=g&lang=de#enquire",
  );
  assert.equal(langUrl("https://x.test/lp-v2/p/a?lang=fr&v=1", "en"), "https://x.test/lp-v2/p/a?lang=en&v=1");
  assert.equal(langUrl("https://x.test/lp-v2/p/a", "ar"), "https://x.test/lp-v2/p/a?lang=ar");
  assert.equal(langUrl("not a url", "de"), "not a url");
});

test("currency pref reconciliation: a valid stored choice wins, anything else keeps geo", () => {
  assert.equal(CURRENCY_PREF, "lp-currency");
  assert.equal(CURRENCY_EVENT, "lp-currency");
  assert.equal(reconcileCurrency("EUR", "INR"), "EUR");
  assert.equal(reconcileCurrency("GBP", "USD"), "GBP");
  assert.equal(reconcileCurrency(null, "INR"), "INR");
  assert.equal(reconcileCurrency("eur", "INR"), "INR", "exact code only");
  assert.equal(reconcileCurrency("JPY", "AED"), "AED");
  assert.equal(reconcileCurrency(undefined, "USD"), "USD");
  assert.equal(isCurrency("AED"), true);
  assert.equal(isCurrency(5), false);
});

test("gallery index wraps both ways", () => {
  assert.equal(wrapIndex(0, 9), 0);
  assert.equal(wrapIndex(-1, 9), 8);
  assert.equal(wrapIndex(9, 9), 0);
  assert.equal(wrapIndex(10, 9), 1);
  assert.equal(wrapIndex(-10, 9), 8);
  assert.equal(wrapIndex(3, 0), 0);
  assert.equal(wrapIndex(NaN, 4), 0);
});

test("locale chip code", () => {
  assert.equal(localeChip("en"), "EN");
  assert.equal(localeChip("zh-Hans"), "ZH");
});

test("price amount follows the currency, falls back to USD, pending shows the id", () => {
  const fees = {
    source: "t", validTo: "2027-03-31", nights: 14,
    rows: [{ name: "Deluxe villa", note: "", single: { INR: 400000, USD: 5000 }, twinEach: { INR: 300000, USD: 4000 } }],
  };
  assert.match(priceAmount(fees, "INR", "en"), /3,00,000/);
  assert.match(priceAmount(fees, "USD", "en"), /USD\s?4,000/);
  assert.match(priceAmount(fees, "EUR", "en"), /USD\s?4,000/, "no EUR tariff → USD figure, never converted");
  assert.equal(priceAmount({ __pending: true, id: "C2", note: "x" }, "EUR", "en"), "[C2]");
  assert.equal(priceAmount({ ...fees, rows: [] }, "INR", "en"), "[no tariff]");
});
