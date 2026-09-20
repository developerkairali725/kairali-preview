/**
 * AHV — one tap from the contact card to turn-by-turn directions.
 *
 * THE RULING (Abilash, 2026-09-20): on maps, "whatever is easier for clients
 * to use and no consent is what we decided." Deepu's review asks for live
 * `<iframe>` maps on the contact and attractions pages; an embedded Google Map
 * sets third-party cookies the moment it loads, which is the one thing that
 * would force a consent gate in front of the map. So the embed is the option
 * the ruling excludes, not the one it asks for.
 *
 * WHAT IS ALREADY RIGHT, measured rather than assumed. /how-to-reach/ ships
 * the full set: a static map, "Get directions" and "Open directions in Google
 * Maps" (both `maps/dir/?api=1&destination=10.727275,76.710507`), "View larger
 * map" and "360 View". No iframe, no cookie, no consent prompt.
 *
 * WHAT IS MISSING. The enquiry family's visit card - /contact-us/,
 * /online-consultation/ and their siblings - carries the same static map but
 * only a PLACE link. A visitor who wants to drive there lands on a pin and has
 * to press Directions themselves, then type where they are. That is the half
 * of the ruling the current build does not meet.
 *
 * SO: one anchor, the same destination coordinates /how-to-reach/ already uses,
 * so the two pages cannot disagree about where the hospital is.
 *
 * SCOPE, deliberately narrow. Only the two enquiry views are opened. The same
 * map image also appears in home-hi-fi-v4.json and home-mobile.json - the
 * owner's benchmark homepage - and this tool refuses to open any file it was
 * not told to, so a src-matching edit can never reach it.
 *
 * Idempotent. Re-run after any design import.
 *   node tools/repair-contact-directions.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");

/** The only files this tool may open. */
const VIEWS = ["ahv-page-enquiry-desktop.json", "ahv-page-enquiry-mobile.json"];
/** Byte-for-byte the destination /how-to-reach/ ships (travel-family-data.js). */
const DIRECTIONS = "https://www.google.com/maps/dir/?api=1&destination=10.727275,76.710507";
const LABEL = "Get directions";
/** The end of the existing map anchor, which is where the new link goes. */
const ANCHOR_END = "Map data &copy; OpenStreetMap contributors</span></a>";

const LINK =
  ANCHOR_END +
  `<a href=\\"${DIRECTIONS}\\" rel=\\"noopener noreferrer\\" ` +
  `style=\\"display:inline-flex;align-items:center;min-height:44px;margin-top:6px;` +
  `font-size:15px;font-weight:600;text-decoration:none\\">${LABEL} &rarr;</a>`;

let added = 0;
const touched = [];
for (const v of VIEWS) {
  const p = join(SITE, "public/ahv/views", v);
  if (!existsSync(p)) { console.log(`  skipped, not present: ${v}`); continue; }
  const before = readFileSync(p, "utf8");
  if (before.includes(DIRECTIONS)) { console.log(`  already applied: ${v}`); continue; }
  const n = before.split(ANCHOR_END).length - 1;
  if (!n) { console.log(`  map anchor not found, left alone: ${v}`); continue; }
  const after = before.split(ANCHOR_END).join(LINK);
  JSON.parse(after); // refuse to write a view that is no longer valid JSON
  added += n;
  touched.push(`${v} (${n})`);
  if (!DRY) writeFileSync(p, after);
}

console.log(`${DRY ? "[dry] " : ""}contact directions: ${added} link(s) added across ${touched.length} view(s)`);
for (const t of touched) console.log(`  · ${t}`);
if (!touched.length) console.log("  (nothing to do)");
