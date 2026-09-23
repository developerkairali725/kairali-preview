#!/usr/bin/env node
/**
 * AHV — links that point at the WRONG page (found by the 23–24 Sep 2026 content
 * review of every page; english-candidate/site-tree-overrides.json notes).
 * The WordPress source carried these mistakes; each target below is named by
 * the link's own text. Only the anchor whose text matches is changed (never a
 * global href replace), in the route's dataset record.
 *
 *   node tools/repair-wrong-links.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const FIXES = [
  // file, route, link text contains, wrong href, right href
  ["collection-family-data.js", "/village-facilities/", "Yoga & Meditation", "/yoga-retreats-for-everyone/", "/things-to-do-in-property/"],
  ["collection-family-data.js", "/village-facilities/", "Fine Dining", "/what-is-ayurvedic-food/", "/ayurvedic-resturant-and-cooking-at-healing-village/"],
  ["reader25a-family-data.js", "/internships-at-kairali/", "Apply Now", "/new-to-ayurveda/", "/apply-now/"],
  ["reader25a-family-data.js", "/internships-at-kairali/", "Careers", "/ayurveda-treatment/", "/careers/"],
  ["reader25b-family-data.js", "/new-to-ayurveda/", "Why pick an Ayurveda treatment", "/why-pick-a-yoga-or-yoga-retreat/", "/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/"],
  ["reader25b-family-data.js", "/new-to-ayurveda/", "Ayurveda Retreats for everyone", "/retreats-for-everyone/", "/ayurveda-retreats-for-everyone/"],
];
const textOf = (n) => (n == null ? "" : typeof n === "string" ? n : Array.isArray(n) ? n.map(textOf).join("") : (n.v || "") + textOf(n.c));
const low = (s) => String(s).toLowerCase();

let total = 0;
for (const file of [...new Set(FIXES.map((f) => f[0]))]) {
  const full = path.join(SITE, "public/ahv/assets", file);
  const src = fs.readFileSync(full, "utf8");
  const w = {}; vm.runInNewContext(src, { window: w });
  const D = Object.values(w)[0];
  let n = 0;
  for (const [, route, text, from, to] of FIXES.filter((f) => f[0] === file)) {
    const R = D.routes.find((r) => r.path === route);
    if (!R) throw new Error(`${route} not in ${file}`);
    const walk = (o, card) => {
      if (!o || typeof o !== "object") return;
      if (Array.isArray(o)) { o.forEach((x) => walk(x, card)); return; }
      const isCard = o.kind === "card";
      const here = isCard ? o : card;
      if (o.tag === "a" && o.attrs && o.attrs.href === from && low(textOf(o.c)).includes(low(text))) { o.attrs.href = to; n++; }
      if (o.linkHref === from && low((o.alt || "") + " " + (o.accessibleName || "") + " " + (here ? textOf(JSON.stringify(here)) : "")).includes(low(text))) { o.linkHref = to; n++; }
      for (const v of Object.values(o)) walk(v, here);
    };
    walk(R, null);
  }
  if (n) {
    total += n;
    const start = src.indexOf("{", src.indexOf("= {")), end = src.lastIndexOf("}") + 1;
    if (!DRY) fs.writeFileSync(full, src.slice(0, start) + JSON.stringify(D) + src.slice(end));
    console.log(`${DRY ? "[dry] " : "fixed  "}${file}: ${n} link(s)`);
  } else console.log(`as-is  ${file}`);
}
console.log(`wrong links: ${total} repointed`);
