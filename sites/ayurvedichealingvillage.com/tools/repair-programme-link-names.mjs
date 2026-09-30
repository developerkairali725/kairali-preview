#!/usr/bin/env node
/**
 * AHV — links to programme pages carry the programme's CURRENT name (owner,
 * 23 Sep 2026: "if there are package names mentioned in the knowledge centre
 * make sure they are the latest names").
 *
 * The owner's programme register (public/ahv/assets/all-programs-data.js)
 * names every programme; the captured pages link to those routes under the
 * old WordPress titles ("Treatment for Hypertension", "Beauty Therapy", "Post
 * Pregnancy Health Program"). Every anchor in every dataset whose href is a
 * programme route and whose text is an OLD title is relabelled with the
 * register's name. Generic labels ("Read More", "Read more →", "Book now") and
 * anchors that already carry the name are untouched; prose that mentions a
 * programme without linking it is not rewritten (that is copy, not a label).
 *
 * Idempotent.   node tools/repair-programme-link-names.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(SITE, "public/ahv/assets");
const DRY = process.argv.includes("--dry");
const w = {};
vm.runInNewContext(fs.readFileSync(path.join(ASSETS, "all-programs-data.js"), "utf8"), { window: w });
const byRoute = new Map(Object.values(w)[0].programmes.map((p) => [p.route, p.name]));
const GENERIC = /^(read more|read more →|know more|learn more|book now|enquire|view|details|→|»)$/i;
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

let total = 0;
for (const f of fs.readdirSync(ASSETS).filter((x) => /-data\.js$/.test(x) && x !== "all-programs-data.js")) {
  const file = path.join(ASSETS, f);
  let s = fs.readFileSync(file, "utf8"), n = 0;
  // the inline-tree anchor shape every reader/collection dataset uses
  s = s.replace(/("tag":"a","attrs":\{"href":"(?:https?:\/\/(?:www\.)?ayurvedichealingvillage\.com)?(\/[^"]+)"[^}]*\},"c":\[\{"k":"t","v":")([^"]+)("\}\])/g, (m, pre, href, text, post) => {
    const name = byRoute.get(href);
    if (!name || GENERIC.test(text.trim()) || norm(text) === norm(name)) return m;
    n++;
    return pre + name.replace(/"/g, '\\"') + post;
  });
  if (n) { total += n; if (!DRY) fs.writeFileSync(file, s); console.log(`${DRY ? "[dry] " : "fixed  "}${f}: ${n} programme link label(s) → current name`); }
}
console.log(`programme link names: ${total} label(s) ${DRY ? "would be " : ""}updated`);
