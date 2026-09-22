#!/usr/bin/env node
/**
 * AHV — every package page carries its Sanskrit name under the H1 (owner,
 * 23 Sep 2026: "check if all package pages have their sanskrit names").
 *
 * Measured: 26 of 31 package views print a `<div>` after the <h1> with the
 * programme's Sanskrit name ("Kushṭham Shamana Chikitsa"); five do not. The
 * name comes ONLY from the owner's programme register
 * (public/ahv/assets/all-programs-data.js, field `sanskrit`) — nothing is
 * transliterated here. A programme whose register entry has no Sanskrit name
 * is reported and left as it is (HARD GATE 6: never invent).
 *
 * Idempotent: a view that already has the line is left alone.
 *   node tools/repair-sanskrit-names.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");
const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"));

const w = {};
vm.runInNewContext(fs.readFileSync(path.join(SITE, "public/ahv/assets/all-programs-data.js"), "utf8"), { window: w });
const register = new Map(Object.values(w)[0].programmes.map((p) => [p.route, p]));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
let fixed = 0, missing = [];
for (const r of manifest.routes) {
  if (!r.desktopView || r.dataset || !/^ahv-page-/.test(r.desktopView)) continue;
  for (const side of ["desktop", "mobile"]) {
    const id = r.desktopView.replace(/-desktop$/, "-" + side);
    const file = path.join(VIEWS, id + ".json");
    if (!fs.existsSync(file)) continue;
    const view = JSON.parse(fs.readFileSync(file, "utf8"));
    let T = view.template;
    if (!/id="package"|Package Price/.test(T)) continue;               // not a package page
    const h1 = T.match(/<h1[^>]*>[^<]*<\/h1>/);
    if (!h1) continue;
    const after = T.slice(h1.index + h1[0].length, h1.index + h1[0].length + 400);
    if (/^\s*<div[^>]*>[^<]{3,80}<\/div>/.test(after)) continue;      // already has the line
    const reg = register.get(r.path);
    if (!reg || !reg.sanskrit) { if (side === "desktop") missing.push(`${r.path} (${reg ? reg.name : "not in register"})`); continue; }
    // the line as the 26 views print it, in each side's own size
    const line = side === "desktop"
      ? `\n      <div style="font-family:'Marcellus',serif;font-size:22px;color:#75695A;margin:12px 0 0">${esc(reg.sanskrit)}</div>`
      : `\n    <div style="font-family:'Marcellus',serif;font-size:20px;color:#75695A;margin:10px 0 0">${esc(reg.sanskrit)}</div>`;
    T = T.slice(0, h1.index + h1[0].length) + line + T.slice(h1.index + h1[0].length);
    view.template = T;
    if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
    fixed += 1;
    console.log(`${DRY ? "[dry] " : "fixed  "}${id}: ${reg.sanskrit}`);
  }
}
console.log(`sanskrit names: ${fixed} view(s) ${DRY ? "would be " : ""}fixed`);
if (missing.length) console.log("NO SANSKRIT NAME IN THE OWNER'S REGISTER (left as is, ask the owner):\n  " + missing.join("\n  "));
