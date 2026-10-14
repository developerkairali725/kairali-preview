// Exact 24 reviewed legal-link clauses: real form SSR, contract preservation and authored/generated CSS.
// This source test does not claim browser geometry or consent interaction acceptance.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { htmlToDOM, Element, Text } from "html-react-parser";
import ts from "typescript";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { formSchemaFor, resolveSchema } from "../campaign-v2/forms/schema.ts";
import { uiFor } from "../campaign-v2/production/ui.ts";
import { productionCss } from "../scripts/build-production-css.mjs";

const require = createRequire(import.meta.url);
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FORM = path.join(SITE, "campaign-v2/sections/interactive/EnquiryForm.tsx");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const delta = JSON.parse(read("test/fixtures/form-legal-links-delta.json"));
const source = fs.readFileSync(FORM, "utf8");
function reverse(text, from, to) {
  assert.equal(text.split(from).length - 1, 1, "only the exact approved delta occurs once");
  return text.replace(from, to);
}
const baseline = reverse(source, delta.newFormBlock, delta.oldFormBlock);
function loadForm(formSource) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const mod = { exports: {} }; cache.set(filename, mod);
    const text = filename === FORM ? formSource : fs.readFileSync(filename, "utf8");
    const js = ts.transpileModule(text, { fileName: filename, compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const req = (name) => {
      if (!name.startsWith(".")) return require(name);
      const base = path.resolve(path.dirname(filename), name);
      const hit = [base, base + ".tsx", base + ".ts"].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
      assert.ok(hit, `resolve ${name} from ${filename}`); return load(hit);
    };
    vm.runInNewContext(js, { module: mod, exports: mod.exports, require: req }, { filename });
    return mod.exports;
  }
  return load(FORM).default;
}
const Form = loadForm(source), Before = loadForm(baseline);
const all = (nodes, pred) => nodes.flatMap((n) => n instanceof Element ? [...(pred(n) ? [n] : []), ...all(n.children, pred)] : []);
const text = (n) => n instanceof Text ? n.data : n instanceof Element ? n.children.map(text).join("") : "";
const cls = (n, s) => (n.attribs.class || "").split(/\s+/).includes(s);
function props(c, production = true) {
  const locale = c.locales[0], base = formSchemaFor(c.form);
  return { schema: resolveSchema(production && c.cta?.primary ? { ...base, submitLabel: c.cta.primary } : base,
    { campaign: c, locale, now: new Date("2026-10-14T00:00:00Z") }),
    campaign: { tracking: c.tracking }, variant: c.defaultVariant, locale, privacyHref: "/existing-preview-privacy/",
    adapterId: c.form?.adapterId, prefillEnabled: c.consultBar !== false,
    ...(production ? { production: c.productionForm, ui: uiFor(locale).form } : {}) };
}
const render = (C, p) => renderToStaticMarkup(React.createElement(C, p));
const stripRow = (html) => html.replace(/<div class="lp-enq__legal-links">([\s\S]*?)<\/div>/,
  (_, links) => links.replace('<span aria-hidden="true">·</span>', ""));

test("all 24 production forms render the same two legal links in one row outside consent and before submit", () => {
  assert.equal(PRODUCTION_SLUGS.length, 24);
  for (const slug of PRODUCTION_SLUGS) {
    const c = productionCampaign(slug), p = props(c), html = render(Form, p), nodes = htmlToDOM(html);
    const rows = all(nodes, (n) => cls(n, "lp-enq__legal-links")); assert.equal(rows.length, 1, slug);
    const links = all(rows, (n) => n.name === "a"); assert.equal(links.length, 2, slug);
    assert.deepEqual(links.map((n) => [n.attribs.href, text(n), n.attribs.target, n.attribs.rel]), [
      ["/new-privacy-policy/", p.schema.privacyLabel, "_blank", "noopener"],
      ["/terms-and-conditions/", p.ui.terms, "_blank", "noopener"],
    ], slug);
    assert.equal(all(rows, (n) => n.name === "span" && n.attribs["aria-hidden"] === "true" && text(n) === "·").length, 1);
    for (let n = rows[0].parent; n; n = n.parent) assert.notEqual(n.name, "label", slug);
    assert.equal(all(nodes, (n) => n.name === "input" && n.attribs.name === "consent" && "required" in n.attribs).length, 1);
    assert.ok(html.indexOf('class="lp-enq__legal-links"') < html.indexOf('type="submit"'), slug);
    assert.equal(stripRow(html), render(Before, p), `${slug}: all other rendered fields, wording, hidden inputs and actions preserved`);
  }
});

test("non-production EN/DE/RU rendering retains its original privacy link and exact form markup", () => {
  const seen = new Set();
  for (const slug of PRODUCTION_SLUGS) {
    const c = productionCampaign(slug); if (seen.has(c.locales[0])) continue; seen.add(c.locales[0]);
    const p = props(c, false), html = render(Form, p);
    assert.equal(html, render(Before, p)); assert.doesNotMatch(html, /lp-enq__legal-links|terms-and-conditions/);
    assert.match(html, /href="\/existing-preview-privacy\/"/);
  }
  assert.deepEqual([...seen].sort(), ["de", "en", "ru"]);
});

test("only approved form/CSS deltas change; generated CSS equals its authored sources", () => {
  const digest = (s) => crypto.createHash("sha256").update(s).digest("hex");
  assert.equal(digest(baseline), delta.baselineHashes["campaign-v2/sections/interactive/EnquiryForm.tsx"]);
  for (const file of ["campaign-v2/sections/sections.css", "campaign-v2/production/document.css"]) {
    const css = read(file);
    assert.equal(digest(reverse(css, delta.cssAddition, "")), delta.baselineHashes[file]);
    assert.match(css, /\.lp-enq__legal-links\{display:flex;flex-wrap:wrap;align-items:center;column-gap:8px;margin-inline-start:36px\}/);
    assert.match(css, /\.lp-enq__legal-links \.lp-enq__privacy\{margin-inline-start:0;min-width:48px\}/);
    assert.match(css, /\.lp-enq__privacy\{[^}]*min-height:48px/);
    assert.match(css, /\.lp-enq__check\{min-height:48px;padding-block:10px\}/);
  }
  assert.equal(read("campaign-v2/production/document.css"), productionCss());
});
