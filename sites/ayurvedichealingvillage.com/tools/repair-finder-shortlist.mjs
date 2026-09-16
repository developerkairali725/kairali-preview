/**
 * AHV programme finder — make the shortlist survive navigation.
 *
 * WHY. The approved /all-programs/ finder keeps its shortlist in component
 * state only: leave the page and it is gone, so "does the shortlist even go
 * through all these pages" (owner, D-20260916-10) was answered "no". This
 * patches both finder views' logic to read the shortlist from localStorage on
 * mount and write it on every change. Functional storage the visitor asked
 * for by pressing "Add to shortlist" - not tracking, and it never leaves the
 * browser. Idempotent: a view already carrying the key is left alone. The
 * patch fails loudly if the approved logic no longer contains the exact
 * anchors, rather than guessing.
 *
 * Usage: node tools/repair-finder-shortlist.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = ["ahv-page-all-programs-desktop", "ahv-page-all-programs-mobile"];
const DRY = process.argv.includes("--dry");
const KEY = "ahv-shortlist";

const STATE_OLD = "saved: []";
const STATE_NEW =
  "saved: (function () { try { var s = JSON.parse(localStorage.getItem('" + KEY + "') || '[]'); return Array.isArray(s) ? s.filter(function (r) { return typeof r === 'string'; }).slice(0, 3) : []; } catch (e) { return []; } })()";
const TOGGLE_OLD =
  "const toggle = (r) => () => this.setState(s => ({ saved: s.saved.includes(r) ? s.saved.filter(x => x !== r) : (s.saved.length >= 3 ? s.saved : [...s.saved, r]) }));";
const TOGGLE_NEW =
  "const toggle = (r) => () => this.setState(s => { const next = s.saved.includes(r) ? s.saved.filter(x => x !== r) : (s.saved.length >= 3 ? s.saved : [...s.saved, r]); try { localStorage.setItem('" + KEY + "', JSON.stringify(next)); } catch (e) {} return { saved: next }; });";

for (const id of VIEWS) {
  const file = path.join(SITE, "public/ahv/views", id + ".json");
  const raw = fs.readFileSync(file, "utf8");
  const view = JSON.parse(raw);
  const logic = view.logic || "";
  if (logic.includes(KEY)) { console.log(`${id}: already persistent`); continue; }
  const stateCount = logic.split(STATE_OLD).length - 1;
  if (stateCount !== 1) throw new Error(`${id}: expected exactly one '${STATE_OLD}', found ${stateCount}`);
  if (!logic.includes(TOGGLE_OLD)) throw new Error(`${id}: toggle anchor not found; the approved logic changed`);
  view.logic = logic.replace(STATE_OLD, STATE_NEW).replace(TOGGLE_OLD, TOGGLE_NEW);
  const indent = /^\{\n(\s+)"/.exec(raw);
  const out = JSON.stringify(view, null, indent ? indent[1].length : 0) + (raw.endsWith("\n") ? "\n" : "");
  if (!DRY) fs.writeFileSync(file, out);
  console.log(`${DRY ? "[dry] " : ""}${id}: shortlist now persists in localStorage['${KEY}']`);
}
