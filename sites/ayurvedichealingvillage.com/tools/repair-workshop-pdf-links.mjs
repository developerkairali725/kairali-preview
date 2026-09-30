#!/usr/bin/env node
/**
 * AHV — the workshop PDF download link comes out.
 *
 * OWNER RULING, 2026-09-21: drop the links. The file the link names was found
 * (kairaliyoga's copy) and read before wiring, and it is not publishable here:
 * it is a THIRD PARTY's document ("Organized by Oriental Spa Ayus (Via
 * Singapore Airlines)"), a dated one-off group itinerary with real flight
 * numbers whose "Mar 26 (Sat.)" last fell in 2022, it says "Kairali Resort" —
 * a KTAHV-locked word — and it names an individual in a public download.
 *
 * NOTHING IS LOST BY REMOVING IT. article-family-data.js already records
 * status 404 against the absolute URL: the download has been dead on the LIVE
 * site too, so no visitor has been able to open it for a long time. What is
 * removed is a promise the page could not keep.
 *
 * THE WHOLE LIST ITEM GOES, not just the anchor. The item exists only to offer
 * the download; leaving its text behind would advertise a PDF that is not there.
 *
 * WHAT IT DOES NOT TOUCH: the `workshopPdf` provenance block in
 * article-family-data.js (route, omittedAnchors, url, status 404, pointers).
 * That is the RECORD of what the live site carries and why this was removed;
 * deleting it would erase the reason.
 *
 * METHOD. The payload is `window.X = <json>;` and a parse/serialise round-trip
 * is byte-identical (asserted below), so the edit is exact JSON surgery rather
 * than string guessing — nothing else in a 246 KB payload can move.
 *
 *   node tools/repair-workshop-pdf-links.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const FILE = join(SITE, "public/ahv/assets/training7-family-data.js");
const NEEDLE = "ayurvedaworkshop-in-kairali";

const src = readFileSync(FILE, "utf8");
const m = /^((?:\s*\/\/[^\n]*\n)*)\s*window\.([A-Z_0-9]+)\s*=\s*([\s\S]*?);\s*$/.exec(src);
if (!m) { console.error("FAIL — payload is not the expected `window.X = {...};` shape"); process.exit(1); }
const [, header, global, jsonText] = m;

const obj = JSON.parse(jsonText);
if (JSON.stringify(obj) !== jsonText.trim()) {
  console.error("FAIL — parse/serialise is not byte-identical; refusing to rewrite the payload");
  process.exit(1);
}

const before = (src.match(new RegExp(NEEDLE, "g")) || []).length;
let removedItems = 0, removedLinks = 0, emptiedLists = 0;

/** Walk every array, dropping entries that exist to serve the PDF. */
function walk(node) {
  if (Array.isArray(node)) {
    for (let i = node.length - 1; i >= 0; i -= 1) {
      const e = node[i];
      if (e && typeof e === "object" && !Array.isArray(e)) {
        const isListItem = typeof e.text === "string" && JSON.stringify(e.tree ?? "").includes(NEEDLE);
        const isLinkIndex = typeof e.href === "string" && e.href.includes(NEEDLE);
        if (isListItem) { node.splice(i, 1); removedItems += 1; continue; }
        if (isLinkIndex) { node.splice(i, 1); removedLinks += 1; continue; }
      }
      walk(e);
    }
    return;
  }
  if (node && typeof node === "object") {
    for (const v of Object.values(node)) walk(v);
    // A list whose only reason to exist was that item should not ship empty.
    if (node.kind === "list" && Array.isArray(node.items) && node.items.length === 0) {
      node.__emptied = true; emptiedLists += 1;
    }
  }
}
walk(obj);

// Drop any list we just emptied.
function prune(node) {
  if (Array.isArray(node)) {
    for (let i = node.length - 1; i >= 0; i -= 1) {
      if (node[i] && node[i].__emptied) { node.splice(i, 1); continue; }
      prune(node[i]);
    }
    return;
  }
  if (node && typeof node === "object") for (const v of Object.values(node)) prune(v);
}
prune(obj);

const out = `${header}window.${global} = ${JSON.stringify(obj)};\n`;
const after = (out.match(new RegExp(NEEDLE, "g")) || []).length;

if (after !== 0) {
  console.error(`FAIL — ${after} reference(s) to the PDF survive in this payload; not writing.`);
  process.exit(1);
}
if (!DRY) writeFileSync(FILE, out);

console.log(`${DRY ? "[dry] " : ""}workshop PDF links removed from ${global}`);
console.log(`  references before      ${before}`);
console.log(`  list items removed     ${removedItems}`);
console.log(`  link-index rows removed ${removedLinks}`);
console.log(`  empty lists pruned     ${emptiedLists}`);
console.log(`  references after       ${after}`);
console.log(`\nKEPT: the workshopPdf provenance block in article-family-data.js — it records the`);
console.log(`  live 404 and the pointers, which is the reason this removal is defensible.`);
