import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function search(prefix = "") {
  const base = prefix ? `public/ahv/l10n/${prefix}/` : "public/";
  const context = {};
  vm.createContext(context);
  vm.runInContext(readFileSync(`${base}design/search.js`, "utf8"), context);
  const indexPath = prefix ? `${base}search-index.json` : "public/ahv/search-index.json";
  const index = JSON.parse(readFileSync(indexPath, "utf8"));
  return { api: context.AHVSearch, engine: context.AHVSearch.createEngine(index), index };
}

function firstRoute(result) {
  const group = result.order[0];
  return group && result[group][0]?.route;
}

test("programme names remain searchable in all 13 language indexes", () => {
  for (const prefix of ["", "hi", "de", "fr", "es", "it", "pt", "nl", "ru", "ar", "zh", "ja", "ko"]) {
    const { api, engine, index } = search(prefix);
    const title = index.programmes.find((p) => p.route === "/panchakarma-therapy/")?.name;
    assert.ok(title, `${prefix}: programme in index`);
    // Remove the embedded Latin transliteration so Chinese tests its native script.
    const query = prefix === "zh" ? title.replace(/[A-Za-z]+/g, "") : title;
    assert.ok(api.norm(query), `${prefix}: normalization preserves native letters`);
    assert.equal(firstRoute(engine.query(query, { scope: "site" })), "/panchakarma-therapy/", prefix);
  }
});

test("English and Latin accents still resolve the same programme", () => {
  const { api, engine } = search();
  assert.equal(api.norm("Pañchakarma thérapy"), "panchakarma therapy");
  assert.equal(firstRoute(engine.query("Pañchakarma", { scope: "site" })), "/panchakarma-therapy/");
});
