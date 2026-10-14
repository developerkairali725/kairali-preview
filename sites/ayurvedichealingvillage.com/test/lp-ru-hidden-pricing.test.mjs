// AHV-WB.532.price (staff row User Review 9 Oct!535; CROSSWALK ADD08): the Russian campaign route
// /lp/treatment-in-kerala-russian/ keeps the owner's no-price campaign presentation (PRICING_HIDDEN, 7 Oct 2026) and
// does not adopt the conflicting "show a starting price" suggestion. The shared hidden-pricing test
// (lp-v2-production-content.test.mjs) scans every route with kit/lint/pricing.ts PRICE, whose currency words are
// English; this adds the route-specific proof for Russian price forms. Nothing here edits copy: a failing assertion
// is a content finding for the copy owner, never a reason to add a price.
import { test } from "node:test";
import assert from "node:assert/strict";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { PRICING_HIDDEN } from "../campaign-v2/production/bindings.ts";
import { PACKAGE_FACTS } from "../campaign-v2/production/package-facts.ts";
import { PRICE, RATE_LINK } from "../campaign-v2/kit/lint/pricing.ts";
import { pageLinks } from "../campaign-v2/kit/lint/page-text.ts";

const ROUTE = "/lp/treatment-in-kerala-russian/";
const c = productionCampaign("lp-treatment-kerala-ru");

// A Russian money amount: a number next to a currency sign or word, a currency sign before a number, a number per
// night/day/person, or a starting-price form ("от 1 500", "начиная с 900") followed by a currency.
const CUR = "(?:₽|руб|р\\.|₹|рупи|\\$|долл|€|евро|£|фунт|aed|дирхам|usd|eur|inr)";
const RU_PRICE = new RegExp(
  `\\d[\\d\\s.,]*\\s?${CUR}|(?:₽|₹|\\$|€|£)\\s?\\d|\\d[\\d\\s.,]*\\s*(?:\\/|за|в)\\s*(?:ночь|сутки|день|человека|чел\\.)|(?:от|начиная с)\\s+\\d[\\d\\s.,]*\\s?${CUR}`,
  "iu",
);

function strings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) strings(v, out);
  else if (value && typeof value === "object") for (const v of Object.values(value)) strings(v, out);
  return out;
}

test("AHV-WB.532.price: the Russian campaign route is bound to the owner's hidden-pricing policy with no offer band", () => {
  assert.equal(c.route, ROUTE);
  assert.deepEqual(c.pricing, PRICING_HIDDEN);
  assert.equal(c.pricing.display, "hidden");
  assert.equal(c.offer, null);
});

test("AHV-WB.532.price: no numeric or starting price in any Russian route string, package fact or link", () => {
  const all = [...strings(c), ...(PACKAGE_FACTS[ROUTE]?.paragraphs ?? [])];
  assert.ok(all.length > 50, "the route's copy was scanned");
  assert.deepEqual(all.filter((s) => RU_PRICE.test(s) || PRICE.test(s)), []);
  assert.deepEqual(pageLinks(c).filter((l) => RATE_LINK.test(l.href) || RATE_LINK.test(l.text)), []);
});

test("AHV-WB.532.price: the scanner itself recognises Russian starting-price forms", () => {
  for (const s of ["от 1 500 €", "от 90 000 руб.", "120 $ за ночь", "₽ 4500", "3 000 рублей", "200 евро в сутки"]) assert.match(s, RU_PRICE, s);
  for (const s of ["14 ночей", "7 ночей", "Первичная консультация врача бесплатна.", "от первой консультации до пребывания"]) assert.doesNotMatch(s, RU_PRICE, s);
});
