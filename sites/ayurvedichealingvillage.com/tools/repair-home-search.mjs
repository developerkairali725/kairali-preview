#!/usr/bin/env node
/**
 * AHV homepage — wire the two search surfaces the owner ruled on (22–23 Sep 2026).
 *
 *   D-20260922-32 (Option A)  The homepage's own chrome shipped `<a href="#search"
 *     onClick="{{ openSearch }}">` twice at desktop (measured: click does nothing —
 *     the view's own overlay never mounts) and NO search control at all in the
 *     mobile header. Every trigger becomes the SAME control the shared header has:
 *     `button[aria-controls="ahv-search-dialog"]`, which public/design/search.js
 *     takes over on every page. The mobile header gets a 44×44 search button next
 *     to the EN badge. Styling is the anchor's own inline style.
 *
 *   D-20260922-33  "I am looking for" + "Preferred dates" were two inert text
 *     rows ("Wellness · Treatment · Yoga & Meditation ▾" / "Select dates ▾"). They
 *     become a real GET form to the programme finder —
 *     /ayurvedic-treatments/?q=<text>&from=YYYY-MM-DD&to=YYYY-MM-DD — which
 *     pre-filters on load and prints the dates in its results header (the
 *     finder logic, tools/build-finder-views.mjs). Works without JavaScript.
 *     The bar keeps its design: same box, same labels, same Enquire / Book Your
 *     Stay links; the two rows become an 18px text input and two date inputs,
 *     plus one submit button "Find a programme".
 *
 * Deterministic, idempotent (marked data-ahv-home-finder / data-ahv-home-search),
 * fails loudly when an anchor is not found exactly once. No copy is invented:
 * the labels are the design's own; the placeholder lists three vocabulary terms.
 *
 *   node tools/repair-home-search.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(SITE, "public/ahv/views");
const DRY = process.argv.includes("--dry");
const FINDER = "/ayurvedic-treatments/";
const PLACEHOLDER = "back pain, Panchakarma, psoriasis…";

function once(text, re, repl, label) {
  const m = text.match(new RegExp(re.source, "g" + re.flags.replace("g", "")));
  const n = m ? m.length : 0;
  if (n !== 1) throw new Error(`${label}: expected exactly one match, found ${n}`);
  return text.replace(re, repl);
}
// `color:inherit` only when the anchor set no colour of its own: the hero
// header's SEARCH is white on the film and must stay white (owner, 23 Sep 2026:
// "search icon text is brown … make it white").
const SEARCH_BTN = (style, inner, label) => `<button type="button" aria-label="${label}" aria-haspopup="dialog" aria-controls="ahv-search-dialog" aria-expanded="false" data-ahv-home-search="1" style="${style};background:none;border:0;padding:0;cursor:pointer;font:inherit${/(^|;)\s*color:/.test(style) ? "" : ";color:inherit"}">${inner}</button>`;
const inputStyle = (size) => `width:100%;min-width:0;box-sizing:border-box;min-height:44px;border:0;border-bottom:1.5px solid #D8D1C0;background:transparent;outline:none;font-family:'Mulish',sans-serif;font-size:${size};color:#2A2118;padding:4px 0`;
const dateStyle = `flex:1;min-width:0;box-sizing:border-box;min-height:44px;border:0;border-bottom:1.5px solid #D8D1C0;background:transparent;outline:none;font-family:'Mulish',sans-serif;font-size:16px;color:#2A2118;padding:4px 0`;

function repair(id) {
  const file = path.join(VIEWS, id + ".json");
  const view = JSON.parse(fs.readFileSync(file, "utf8"));
  let T = view.template;
  // Post-passes (23 Sep 2026), idempotent on an already-wired view: the white
  // SEARCH keeps its colour, and the bar's Enquire link stays on this origin
  // (an absolute production URL left the preview for the live site).
  let P = T;
  P = P.replace(/(<button[^>]*data-ahv-home-search="1"[^>]*style="color:#fff;[^"]*?);color:inherit"/g, '$1"');
  P = P.replace(/(<form[^>]*data-ahv-home-finder="1"[\s\S]*?<\/form>)/, (m) => m.replace(/href="https:\/\/ayurvedichealingvillage\.com\//g, 'href="/'));
  if (P !== T) { T = P; view.template = T; if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n"); console.log(`post   ${id}: white SEARCH / same-origin links`); }
  if (T.includes('data-ahv-home-finder="1"')) { console.log(`as-is  ${id}`); return; }
  const desktop = id === "home-hi-fi-v4";

  // 1. every dead #search anchor → the shared header's search control (same aria-controls, same style)
  const anchors = T.match(/<a href="#search" onClick="\{\{ openSearch \}\}"[^>]*>/g) || [];
  if (desktop && anchors.length !== 2) throw new Error(`${id}: expected two #search anchors, found ${anchors.length}`);
  T = T.replace(/<a href="#search" onClick="\{\{ openSearch \}\}"([^>]*)>([\s\S]*?)<\/a>/g, (m, attrs, inner) => {
    const style = (attrs.match(/style="([^"]*)"/) || [, ""])[1];
    const label = (attrs.match(/aria-label="([^"]*)"/) || [, "Search"])[1];
    return SEARCH_BTN(style, inner, label);
  });

  // 2. mobile header: a search button before the EN badge (the desktop header already has one)
  if (!desktop) {
    T = once(T, /(<header style="position:sticky;top:0;z-index:50;[^"]*">[\s\S]*?<div style="display:flex;align-items:center;gap:10px">\n\s*)(<span style="border:1px solid #C9BFA8;border-radius:4px;padding:0 11px;min-height:44px[^>]*>EN<\/span>)/,
      (m, pre, en) => pre.replace('<div style="display:flex;align-items:center;gap:10px">', '<div style="display:flex;align-items:center;gap:6px">') + SEARCH_BTN("display:flex;align-items:center;justify-content:center;width:44px;height:44px;color:#2A2118", '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="#2A2118" stroke-width="1.6"></circle><path d="M10.8 10.8l3.4 3.4" stroke="#C1882C" stroke-width="1.6" stroke-linecap="round"></path></svg>', "Search") + "\n    " + en,
      `${id}: mobile header EN badge`);
  }

  // 3. the "I am looking for" bar → GET form to the finder
  if (desktop) {
    T = once(T, /<div style="(background:rgba\(255,255,255,\.97\);border-radius:\{\{ barR \}\};[^"]*)">(\s*<div style="flex:1\.2;min-width:220px">)/,
      (m, style, rest) => `<form action="${FINDER}" method="get" role="search" aria-label="Find a programme" data-ahv-home-finder="1" style="${style}">${rest}`, `${id}: bar open`);
    T = once(T, /<div style="display:flex;align-items:center;justify-content:space-between;font-size:16\.5px;color:#2A2118">Wellness · Treatment · Yoga &amp; Meditation <span style="color:#75695A">▾<\/span><\/div>/,
      `<input type="search" name="q" autocomplete="off" enterkeyhint="search" aria-label="I am looking for" placeholder="${PLACEHOLDER}" style="${inputStyle("18px")}">`, `${id}: looking-for row`);
    T = once(T, /<div style="display:flex;align-items:center;justify-content:space-between;font-size:16\.5px;color:#75695A">Select dates <span>▾<\/span><\/div>/,
      `<div style="display:flex;align-items:center;gap:8px"><input type="date" name="from" aria-label="From date" style="${dateStyle}"><span aria-hidden="true" style="color:#75695A">–</span><input type="date" name="to" aria-label="To date" style="${dateStyle}"></div>`, `${id}: dates row`);
    T = once(T, /(<div style="display:flex;gap:14px;align-items:center">\s*)(<a href="https:\/\/ayurvedichealingvillage\.com\/enquiry-form\/"[^>]*>Enquire<\/a>)/,
      (m, pre, enq) => pre + `<button type="submit" style="background:#006038;color:#F7F4EA;border:0;border-radius:{{ btnR }};padding:0 26px;min-height:52px;font-family:'Mulish',sans-serif;font-weight:700;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;white-space:nowrap">Find a programme</button>\n      ` + enq, `${id}: submit before Enquire`);
    // close the form where the bar's div closed: the bar is the section's only child → the section's closing pair
    T = once(T, /(<a href="https:\/\/bookings\.ayurvedichealingvillage\.com\/" style="background:#5A4420;color:#F7F4EA;border-radius:\{\{ btnR \}\};padding:16px 34px;[^>]*>Book Your Stay<\/a>\s*<\/div>\s*)<\/div>(\s*<\/section>)/,
      (m, pre, post) => pre + "</form>" + post, `${id}: bar close`);
  } else {
    T = once(T, /<div style="(background:#fff;border-radius:4px;box-shadow:0 5px 17px rgba\(60,45,20,\.05\);padding:18px 20px;display:flex;flex-direction:column;gap:12px)">(\s*<div><div style="font-weight:700;font-size:12px;letter-spacing:2px;color:#75695A;text-transform:uppercase">I am looking for<\/div>)/,
      (m, style, rest) => `<form action="${FINDER}" method="get" role="search" aria-label="Find a programme" data-ahv-home-finder="1" style="${style}">${rest}`, `${id}: bar open`);
    T = once(T, /<div style="display:flex;justify-content:space-between;font-size:16px;border-bottom:1\.5px solid #D8D1C0;padding:6px 0 8px">Wellness · Treatment · Yoga <span style="color:#75695A">▾<\/span><\/div>/,
      `<input type="search" name="q" autocomplete="off" enterkeyhint="search" aria-label="I am looking for" placeholder="${PLACEHOLDER}" style="${inputStyle("18px")}">`, `${id}: looking-for row`);
    T = once(T, /<div style="display:flex;justify-content:space-between;font-size:16px;color:#75695A;border-bottom:1\.5px solid #D8D1C0;padding:6px 0 8px">Select dates <span>▾<\/span><\/div>/,
      `<div style="display:flex;align-items:center;gap:8px"><input type="date" name="from" aria-label="From date" style="${dateStyle}"><span aria-hidden="true" style="color:#75695A">–</span><input type="date" name="to" aria-label="To date" style="${dateStyle}"></div>`, `${id}: dates row`);
    T = once(T, /(<div style="display:flex;gap:10px"><a href="https:\/\/bookings\.ayurvedichealingvillage\.com\/" style="flex:1;background:#5A4420;[^>]*>Book Your Stay<\/a><a href="https:\/\/ayurvedichealingvillage\.com\/enquiry-form\/"[^>]*>Enquire<\/a><\/div>\s*)<\/div>(\s*<\/section>)/,
      (m, row, post) => `<button type="submit" style="background:#006038;color:#F7F4EA;border:0;border-radius:4px;padding:0 20px;min-height:52px;font-family:'Mulish',sans-serif;font-weight:700;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;width:100%">Find a programme</button>\n    ` + row + "</form>" + post, `${id}: submit + bar close`);
  }

  // postconditions
  if (T.includes('href="#search"')) throw new Error(`${id}: a dead #search anchor survived`);
  const btns = (T.match(/data-ahv-home-search="1"/g) || []).length;
  if (btns < 1) throw new Error(`${id}: no search trigger emitted`);
  if ((T.match(/<form action="\/ayurvedic-treatments\/" method="get"/g) || []).length !== 1) throw new Error(`${id}: expected one finder form`);
  if ((T.match(/<form\b/g) || []).length !== (T.match(/<\/form>/g) || []).length) throw new Error(`${id}: form open/close mismatch`); // the desktop view also carries its own (never-mounting) /search overlay form
  for (const need of ['name="q"', 'name="from"', 'name="to"', "Find a programme"]) if (!T.includes(need)) throw new Error(`${id}: missing ${need}`);
  view.template = T;
  if (!DRY) fs.writeFileSync(file, JSON.stringify(view, null, 1) + "\n");
  console.log(`${DRY ? "[dry] " : "fixed  "}${id}: ${btns} search trigger(s), finder form → ${FINDER}?q=&from=&to=`);
}

for (const id of ["home-hi-fi-v4", "home-mobile"]) repair(id);
