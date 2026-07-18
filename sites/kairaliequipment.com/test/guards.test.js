// kairaliequipment.com integrity gate — pins the golden page (and every later
// page: the scan is recursive over app/) to its owner rulings so edits cannot
// drift back:
//   · the owner-banned EQUIPMENT-IDENTITY EQUIVALENCE never returns
//     (pass4-fixed-rulings §6: "No equipment-identity equivalence is asserted
//     anywhere" — battery pass-1 caught it REASSERTED in the Manufacturing
//     band; beauty B10/B9 blocking finding, 2026-07-18);
//   · the approved affiliation wording is what ships in its place;
//   · heritage law (FLAG-3 / D-LIN-1989-WORDING): 1908 is family lineage ONLY,
//     never a company founding; the group founding is 1989;
//   · WhatsApp count law (pass4-fixed-rulings §1): EXACTLY TWICE — hero + sticky
//     mobile bar; header/footer none;
//   · HARD GATE 6: the unverified legacy phone number is never printed; no
//     real-looking price ever ships while D-EQ-CATALOG placeholders stand;
//   · locked contact fact: info@kairali.com.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..");

/** Every shipped source file under app/ — recursive, so new pages are covered
 *  by construction, not by remembering to add them here. */
function sources(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...sources(p));
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}

// Guards judge the SHIPPED COPY, not our own annotations: strip comments.
const strip = (s) =>
  s
    .replace(/^\s*\/\/[^\n]*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

const files = sources(join(site, "app"));
const byFile = new Map(files.map((f) => [f, strip(readFileSync(f, "utf8"))]));
const everything = [...byFile.values()].join("\n");
const page = byFile.get(join(site, "app", "page.tsx"));
const chrome = byFile.get(join(site, "app", "_components", "chrome.tsx"));

test("the owner-banned equipment-identity equivalence never returns (pass4 §6)", () => {
  // The exact battery-caught sentence, plus every construction of the same
  // claim, in any tense/order — each checked per file so a hit names its file.
  const banned = [
    [/equipment we (ship|sell|make)[^.]{0,60}is the equipment/i, "the shipped-is-used identity sentence"],
    [/(physicians|therapists)[^.]{0,60}(work|treat)s? on every day/i, "the 'work on every day' clause"],
    [/treats? on what we (sell|ship|make)/i, "'we treat on what we sell'"],
    [/we (sell|ship|make) what we treat/i, "'we sell what we treat on'"],
    [/(spec|equipment)[^.]{0,50}our own (therapists|physicians)[^.]{0,30}treat/i, "'the spec our own therapists treat on'"],
    [/from the people who use it/i, "the softened use-equivalence section head"],
    [/manufacture what (we|our own)[^.]{0,30}treat/i, "'we manufacture what we treat on'"],
    [/authentic ayurveda treatment/i, "the pass-3-removed phrase"],
  ];
  for (const [file, text] of byFile) {
    for (const [re, label] of banned) {
      assert.doesNotMatch(text, re, `${label} in ${file}`);
    }
  }
});

test("the approved affiliation wording ships in place of the equivalence", () => {
  // pass4-fixed-rulings §6: the documented group-affiliation claim.
  assert.match(page, /family group behind the NABH-accredited/i, "hero affiliation claim");
  assert.match(page, /The same family group runs the NABH-accredited/i, "manufacturing-band affiliation claim");
});

test("heritage law: 1908 is family lineage only; the group founding is 1989 (FLAG-3)", () => {
  assert.doesNotMatch(everything, /est\.?\s*1908/i, "'est. 1908' is banned");
  assert.doesNotMatch(everything, /established[^.]{0,20}1908/i, "'established … 1908' is banned");
  assert.doesNotMatch(everything, /company since 1908/i, "corporate 'since 1908' is banned");
  assert.match(everything, /family practising Ayurveda since 1908/i, "the canonical lineage line ships");
  assert.match(everything, /[Ff]ounded in 1989/, "the canonical group founding ships");
});

test("WhatsApp count law: exactly twice — hero + sticky mobile bar (pass4 §1)", () => {
  const count = (everything.match(/data-cta="whatsapp-click"/g) || []).length;
  assert.equal(count, 2, `WhatsApp CTA must appear EXACTLY twice, found ${count}`);
  assert.match(page, /data-cta="whatsapp-click"/, "entry 1 lives in the hero");
  assert.match(chrome, /data-cta="whatsapp-click"/, "entry 2 lives in the sticky bar");
  // The header component must not carry one (footer shares chrome.tsx: the
  // single chrome occurrence is the StickyBar's).
  const headerBlock = chrome.slice(chrome.indexOf("function SiteHeader"), chrome.indexOf("function WhatsAppGlyph"));
  assert.doesNotMatch(headerBlock, /whatsapp/i, "the header carries NO WhatsApp entry");
  // No page may smuggle a third entry under a different event name or a raw
  // wa.me link: WHATSAPP_URL/wa.me may appear ONLY in chrome.tsx (definition +
  // sticky bar) and page.tsx (hero pill).
  const allowed = new Set([join(site, "app", "page.tsx"), join(site, "app", "_components", "chrome.tsx")]);
  for (const [file, text] of byFile) {
    if (allowed.has(file)) continue;
    assert.doesNotMatch(text, /WHATSAPP_URL|wa\.me/i, `WhatsApp reference outside the fixed count in ${file}`);
  }
});

test("HARD GATE 6: no unverified phone number, no real-looking price", () => {
  assert.doesNotMatch(everything, /9555156156/, "the legacy number is not in LOCKED FACTS and never prints");
  assert.doesNotMatch(everything, /tel:/i, "no tel: link may exist until a verified equipment number lands");
  assert.doesNotMatch(everything, /₹\s?[0-9]/, "no real rupee amount while D-EQ-CATALOG placeholders stand");
  assert.doesNotMatch(everything, /\$\s?[0-9][0-9,.]*(?![\d.]*\})/, "no real dollar amount while placeholders stand");
});

test("locked contact fact: info@kairali.com is the public contact", () => {
  assert.match(chrome, /info@kairali\.com/, "the locked public email ships in chrome");
});
