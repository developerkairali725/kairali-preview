// All AHV duration-based offers — owner rulings 28 Sep 2026 (deliverable OWNER-DECISIONS-LATEST.md):
//   "staggered discounts apply to ALL offers": 3–13 nights 10% · 14–20 nights 15% · 21+ nights 20%;
//   "short-stay rule": 1–2 nights at standard rates; "non-stacking": one offer per booking, the best eligible saving,
//   never added together; "calculation basis": treatment-package price before tax, separately charged extras
//   excluded, inclusions never reclassified; itemised quote before payment. Defence eligibility per the approved
//   defence terms. Each offer keeps its own eligibility; no expiry, stacking permission or new benefit invented.
// Pages: /offers/ hub (desktop view; the mobile view carries no term lists), /offers/olympics-and-paralympics-offer/,
// /offers/senior-citizen-offer/ (+ its retired /offers/new/ record), /offers/defence-paramilitary-personnel-get-upto-30-off/.
// The Olympics band strings (already correct and translated) are the canonical band wording.
// Exact-count assertions, all-or-nothing write, each file keeps its own serialisation, idempotent.
//   node tools/repair-offer-terms-all-20260928.mjs [--check]
import fs from "node:fs";
const CHECK = process.argv.includes("--check");
const B1 = "10% Discount for ayurvedic treatment package between 3 to 13 Nights";
const B2 = "15% Discount for ayurvedic treatment package between 14 to 20 Nights; and";
const B3 = "20% Discount for ayurvedic treatment package for 21 Nights or above.";
const OLD = [["10% Discount for ayurvedic treatment package between 3 to 14 Nights", B1], ["15% Discount for ayurvedic treatment package between 14 to 21 Nights", B2], ["20% Discount for ayurvedic treatment package above 21 Nights.", B3]];
const T_SHORT = "Stays of 1–2 nights are charged at standard rates; offer savings start at 3 nights.";
const T_BASIS = "The discount applies to the treatment-package price before tax. Separately charged extras are not discounted, and anything included in your package stays included.";
const T_ONE = "One offer applies per booking: if more than one offer fits your stay, we apply the one that gives you the best saving, and discounts are not added together.";
const T_QUOTE = "Before you pay, your written quote shows the eligible package amount, your saving, any extras, taxes and the final total.";
const T_CHANGE = "Availability and the change and cancellation terms are stated in your quote before you pay. Once confirmed, the agreed offer is honoured for that booking.";
const T_BANDS = "10% for 3–13 nights, 15% for 14–20 nights and 20% for 21 nights or more.";
const ELIG = "For serving and retired members of India’s Armed Forces, Central Armed Police Forces (CAPFs) and Assam Rifles, and their spouses, parents and children.";
const CHANGE_OLD = "Bookings made under the Military Citizen Discount Scheme are changeable and cancellable.";
const CLUB_OLD = "This Offer can’t be clubbed with other offers.";
const log = [], pending = []; let bad = 0;
const fail = (m) => { bad++; console.error("FAIL " + m); };
const swap = (s, from, to, want, label) => { const n = s.split(from).length - 1; if (n !== want) { fail(`${label}: expected ${want}× "${from.slice(0, 60)}", found ${n}`); return s; } log.push(`${label} (${n}×)`); return s.split(from).join(to); };
const ser = (obj, raw) => (raw.startsWith("{\n") ? JSON.stringify(obj, null, 1) : JSON.stringify(obj)) + (raw.endsWith("\n") ? "\n" : "");

// 1. /offers/ hub, desktop view (template, one-line JSON)
{ const file = "public/ahv/views/ahv-template-offers-deals-and-gift-vouchers-desktop.json"; const raw = fs.readFileSync(file, "utf8"); const v = JSON.parse(raw);
  let t = v.template;
  if (!t.includes(T_ONE)) {
    for (const [a, b] of OLD) t = swap(t, `<span>${a}</span>`, `<span>${b}</span>`, 1, "hub defence card band");
    t = swap(t, "This offer is applicable to citizens serving in the Army, Navy, and Air Force.", ELIG, 1, "hub defence card eligibility");
    t = swap(t, `<span>${CHANGE_OLD}</span>`, `<span>${T_CHANGE}</span>`, 1, "hub defence card change terms");
    // every hub term list that carries bands also gets the short-stay rule after B3
    const liB3 = t.match(new RegExp(`(<li[^>]*><span[^>]*>◆</span><span>)${B3.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(</span></li>)`, "g")) || [];
    if (liB3.length !== 2) fail(`hub: expected 2 band lists, found ${liB3.length}`);
    else { t = t.replace(new RegExp(`(<li[^>]*><span[^>]*>◆</span><span>)(${B3.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(</span></li>)`, "g"), (m, a, _b3, c) => `${m}\n ${a}${T_SHORT}${c}`); log.push("hub: short-stay rule after each band list (2×)"); }
    t = swap(t, `Rates and inclusions are subject to change. ${CLUB_OLD} No fixed end date.`, `Rates and inclusions are subject to change. ${T_ONE} No fixed end date.`, 2, "hub cards non-stacking");
    v.template = t; pending.push([file, ser(v, raw)]);
  } else log.push("hub: already applied"); }

// 2. data files — list items as tree nodes
const esc = (s) => JSON.stringify(s).slice(1, -1);
// 2a. Olympics (campaign-family-data.js): li tree nodes separated by "\n\n\n\n" text nodes
{ const file = "public/ahv/assets/campaign-family-data.js"; let s = fs.readFileSync(file, "utf8"); const s0 = s;
  const li = (x) => `{"k":"e","tag":"li","c":[{"k":"t","v":"${esc(x)}"}]}`; const gap = `{"k":"t","v":"\\n\\n\\n\\n"}`;
  if (!s.includes(esc(T_BASIS))) {
    s = swap(s, li(B3), [li(B3), li(T_SHORT), li(T_BASIS)].join("," + gap + ","), 1, "olympics: short-stay + basis after the bands");
    s = swap(s, li(CLUB_OLD), [li(T_ONE), li(T_QUOTE)].join("," + gap + ","), 1, "olympics: non-stacking + quote");
    // 2b. senior offer terms arrays (live page + retired /offers/new/ record)
    const TERMS_OLD = `"Complimentary initial health consultation included","Up to 20% off on select wellness programs"]`;
    s = swap(s, TERMS_OLD, `"Complimentary initial health consultation included","Up to 20% off on select wellness programs","${esc(T_BANDS)}","${esc(T_SHORT)}","${esc(T_BASIS)}","${esc(T_ONE)}"]`, 2, "senior: bands + rules in the offer terms");
  } else log.push("campaign-family-data: already applied");
  if (s !== s0) pending.push([file, s]); }
// 2c. defence campaign route (campaign-nine-data.js): {"ptr","tree","text","images","children"} items
{ const file = "public/ahv/assets/campaign-nine-data.js"; let s = fs.readFileSync(file, "utf8"); const s0 = s;
  const item = (ptr, x) => `{"ptr":"${ptr}","tree":[{"k":"t","v":"${esc(x)}"}],"text":"${esc(x)}","images":[],"children":[]}`;
  if (!s.includes(esc(T_BASIS))) {
    s = swap(s, `"v":"${CHANGE_OLD}"}],"text":"${CHANGE_OLD}"`, `"v":"${T_CHANGE}"}],"text":"${T_CHANGE}"`, 1, "defence campaign: change terms");
    for (const [a, b] of OLD) s = swap(s, `"v":"${a}"}],"text":"${a}"`, `"v":"${b}"}],"text":"${b}"`, 1, "defence campaign: band");
    const armyRe = /"v":"This offer is applicable to citizens serving in the Army, Navy, and Air Force\.[ \u00a0]?"\}\],"text":"This offer is applicable to citizens serving in the Army, Navy, and Air Force\.[ \u00a0]?"/g;
    const na = (s.match(armyRe) || []).length; if (na !== 1) fail(`defence campaign eligibility: found ${na}`); else { s = s.replace(armyRe, () => `"v":"${esc(ELIG)}"}],"text":"${esc(ELIG)}"`); log.push("defence campaign: eligibility"); }
    const clubRe = new RegExp(`\\{"ptr":"(/sections/7/c/\\d+)","tree":\\[\\{"k":"t","v":"${CLUB_OLD}"\\}\\],"text":"${CLUB_OLD}","images":\\[\\],"children":\\[\\]\\}`, "g");
    const nc = (s.match(clubRe) || []).length; if (nc !== 1) fail(`defence campaign non-stacking: found ${nc}`);
    else { s = s.replace(clubRe, (m, ptr) => [item(ptr, T_ONE), item("/owner-rulings/20260928/short-stay", T_SHORT), item("/owner-rulings/20260928/basis", T_BASIS), item("/owner-rulings/20260928/quote", T_QUOTE)].join(",")); log.push("defence campaign: non-stacking + short-stay + basis + quote"); }
  } else log.push("campaign-nine-data: already applied");
  if (s !== s0) pending.push([file, s]); }

if (bad) { console.error(`${bad} failure(s) — nothing written`); process.exit(1); }
for (const [f, s] of pending) if (f.endsWith(".js")) { const body = s.slice(s.indexOf("{"), s.lastIndexOf("}") + 1); try { JSON.parse(body); } catch (e) { console.error(`FAIL ${f} no longer parses: ${e.message}`); process.exit(1); } }
if (!CHECK) for (const [f, s] of pending) fs.writeFileSync(f, s);
console.log((CHECK ? "[check] " : "") + log.join("\n"));
