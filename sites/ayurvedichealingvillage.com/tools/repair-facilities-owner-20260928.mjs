// Owner-confirmed facilities, 28 Sep 2026 (deliverable OWNER-DECISIONS-LATEST.md: "Owner-confirmed facilities —
// astrology and palmistry", "Owner-confirmed property facilities — latest authority", "Owner-confirmed recreation
// details — court clarification resolved", "Owner wording standard").
//   · NO conference hall — the /village-facilities/ tile and the past-retreat facility item go; nothing invented instead.
//   · Astrology AND palmistry confirmed, on request with one day's notice — the owner's exact customer sentence is used;
//     the "Charm Science Experts" tile says what it is. No price, schedule or health benefit added.
//   · Confirmed recreation: swimming pool, gym, indoor games (pool table, chess, board games), outdoor games,
//     amphitheatre, library, children's plunge pool, curio shop, badminton court AND tennis court. No hours, fees,
//     supervision, depth or booking conditions stated (none supplied).
// Exact-count assertions; all-or-nothing write; idempotent.
//   node tools/repair-facilities-owner-20260928.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const ASTRO = "Astrology and palmistry sessions are available on request. Please let our team know at least one day in advance so we can arrange your session.";
const item = (ptr, t) => `{"ptr":"${ptr}","tree":[{"k":"t","v":"${t}"}],"text":"${t}","images":[]}`;
const pending = [], log = []; let bad = 0;
const once = (s, from, to, label) => { if (s.includes(to)) return s; const n = s.split(from).length - 1; if (n === 1) { log.push(label); return s.replace(from, () => to); } bad++; console.error(`FAIL ${label}: expected 1× "${from.slice(0, 70)}", found ${n}`); return s; };

let c = fs.readFileSync("public/ahv/assets/collection-family-data.js", "utf8"); const c0 = c;
// facilities list (/village-facilities/)
c = once(c, item("/sections/3/c/3/c/42/c/15", "Indoor games"), item("/sections/3/c/3/c/42/c/15", "Indoor games: pool table, chess and board games"), "list: indoor games named");
c = once(c, item("/sections/3/c/3/c/42/c/17", "Tennis Court"), [item("/sections/3/c/3/c/42/c/17", "Tennis Court"), item("/owner-facts/20260928/badminton", "Badminton Court"), item("/owner-facts/20260928/outdoor-games", "Outdoor games"), item("/owner-facts/20260928/plunge-pool", "Children’s plunge pool"), item("/owner-facts/20260928/amphitheatre", "Amphitheatre")].join(","), "list: badminton, outdoor games, children's plunge pool, amphitheatre added");
c = once(c, item("/sections/3/c/3/c/42/c/33", "Antique Shop"), item("/sections/3/c/3/c/42/c/33", "Curio Shop"), "list: Antique Shop → Curio Shop (owner: curio shop)");
// the approved astrology/palmistry sentence directly after the list
const listEnd = `${item("/sections/3/c/3/c/42/c/33", "Curio Shop")}],"sourceClass":"wp-block-list has-small-font-size"}`;
if (!c.includes(ASTRO)) c = once(c, listEnd, `${listEnd},{"kind":"para","ptr":"/owner-facts/20260928/astrology-palmistry","tree":[{"k":"t","v":"${ASTRO}"}],"text":"${ASTRO}"}`, "para: approved astrology/palmistry sentence");
// the tile
c = once(c, `"alt":"Charm Science Experts"`, `"alt":"Astrology & Palmistry"`, "tile alt: Astrology & Palmistry");
c = once(c, `"tree":[{"k":"t","v":"Charm Science Experts"},{"k":"e","tag":"br"}],"text":"Charm Science Experts"`, `"tree":[{"k":"t","v":"Astrology & Palmistry"}],"text":"Astrology & Palmistry"`, "tile caption: Astrology & Palmistry");
// the conference-hall tile
{ const a = c.indexOf(`,{"kind":"card","ptr":"/sections/3/c/3/c/52/c/13"`), b = c.indexOf(`,{"kind":"card","ptr":"/sections/3/c/3/c/52/c/15"`);
  if (a > -1 && b > a && c.slice(a, b).includes(`"v":"Conference Hall"`)) { c = c.slice(0, a) + c.slice(b); log.push("tile removed: Conference Hall"); }
  else if (a > -1) { bad++; console.error("FAIL conference tile shape changed"); } }
if (c !== c0) pending.push(["public/ahv/assets/collection-family-data.js", c]);

// /katha-wellness-retreat-2019/ facility list
let h = fs.readFileSync("public/ahv/assets/hist9-family-data.js", "utf8"); const h0 = h;
{ const i = h.indexOf(`"text":"Conference Hall"`);
  if (i > -1) { const a = h.lastIndexOf(`,{"ptr":"/sections/3/c/3/c/40/c/9"`, i), e = h.indexOf(`"images":[]}`, i) + 12;
    if (a > -1 && i - a < 120 && e > i) { h = h.slice(0, a) + h.slice(e); log.push("katha-2019 list item removed: Conference Hall"); } else { bad++; console.error("FAIL hist9 item shape changed"); } } }
if (h !== h0) pending.push(["public/ahv/assets/hist9-family-data.js", h]);

if (bad) { console.error(`${bad} failure(s) — nothing written`); process.exit(1); }
for (const [f, s] of pending) { const body = s.slice(s.indexOf("{"), s.lastIndexOf("}") + 1); try { JSON.parse(body); } catch (e) { console.error(`FAIL ${f} no longer parses: ${e.message}`); process.exit(1); } }
if (!CHECK) for (const [f, s] of pending) fs.writeFileSync(f, s);
console.log((CHECK ? "[check] " : "") + (log.join("\n") || "already applied"));
