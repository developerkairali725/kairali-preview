// kairaliorganic.com integrity gate — pins the golden page to its rulings so
// later edits cannot drift: the vetoed absolute hero line never returns, no
// certification is ever implied, the KAIR brand boundary holds (D3), Kairtis
// stays unlisted until ruled, the KTAHV awards never decorate this shell,
// retired heritage constructions never ship, locked contacts only, no prices
// and no cart (Track-B informational shell).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
// The banned lexicon comes from the law itself, never a local copy.
import { BANNED_FILLER } from "../../../packages/compliance/src/rules.js";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..");
// Guards judge the SHIPPED COPY, not our own annotations: strip comments.
const strip = (s) =>
  s.replace(/^\s*\/\/[^\n]*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
const page = strip(readFileSync(join(site, "app/page.tsx"), "utf8"));
const layout = strip(readFileSync(join(site, "app/layout.tsx"), "utf8"));
const llms = strip(readFileSync(join(site, "app/llms.txt/route.ts"), "utf8"));
const everything = page + layout + llms;

const wordRe = (word) =>
  new RegExp(`(?<![\\p{L}\\p{N}-])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}-])`, "giu");

test("the vetoed absolute hero line never returns; the mined line ships", () => {
  // Pass-2 Perplexity's sole blocking finding — fixed at build, guarded here.
  assert.doesNotMatch(everything, /isn[’']?t\s+from\s+the\s+earth/i, "the vetoed draft absolute must never ship");
  assert.match(page, /Made from natural\s+ingredients/i, "the mined replacement line is the one that ships");
});

test("chemical-free is claimed per D3 ONLY — never as a certification", () => {
  assert.match(page, /100% chemical-free/i, "the owner-ruled claim ships (D3 + live-site basis)");
  assert.doesNotMatch(everything, /certified\s+organic/i, "no organic-certification claim exists in the estate");
  assert.doesNotMatch(everything, /\b(NPOP|USDA|Ecocert|COSMOS)\b/i, "no certification scheme may be named");
  // The ASCI pairing: the claim never ships without the no-certification
  // transparency statement beside it.
  assert.match(page, /no organic certification/i, "the explicit no-certification statement is the claim's required pairing");
});

test("the KAIR brand boundary holds (D3): one labelled crossing, no KAIR products", () => {
  assert.match(page, /kairbykairali\.com/, "the sister-range block links the KAIR home");
  // KAIR's own products must never be listed on the Organics shell.
  for (const kairProduct of ["shower gel", "shampoos? and conditioner", "neem soap", "sandal soap", "herbal beauty soap", "hand sanitizer"]) {
    assert.doesNotMatch(page, new RegExp(kairProduct, "i"), `KAIR product "${kairProduct}" on the Organics shell`);
  }
  // The boundary must be stated, not implied (the naming trap, mining doc §6).
  assert.match(page, /not part of the\s+chemical-free nine/i, "the brand-definition boundary line ships");
});

test("exactly the ruled nine — Kairtis stays unlisted until the owner rules it in", () => {
  assert.doesNotMatch(everything, /kairtis/i, "Kairtis is UNRULED (BRIEF open-Q1) — never listed");
  for (const name of ["Kaircin", "Kairoil", "Kairbal", "Kairpack", "Kairwash", "Kairheal", "Kairkare", "Kairkare Plus", "Kairbossom"]) {
    assert.match(page, wordRe(name), `the nine must all appear: ${name}`);
  }
});

test("KTAHV hospitality awards never decorate this product shell (register law)", () => {
  assert.doesNotMatch(
    everything,
    /(World Luxury Spa|Best Destination Spa|World Travel Award|National Geographic|Spa Asia|PATWA)/i,
    "hospitality-property awards re-blur the entities (BRIEF open-Q2, held claim)",
  );
});

test("heritage uses ONLY the approved lineage constructions", () => {
  const groupClaim = /(Group|Kairali Ayurvedic Group)[^.]{0,40}[Ss]ince 1908/;
  assert.doesNotMatch(page, groupClaim, "1908 must never attach to the Group");
  assert.doesNotMatch(everything, /inception in 1908/i, "the legacy construction is retired");
  assert.doesNotMatch(everything, /100[\s-]?year/i, "the '100-year' construction is retired");
  assert.match(page, /family practising\s+Ayurveda since 1908/i, "the approved family-lineage construction ships");
  assert.match(page, /founded (?:in )?1989/i, "the Group's founding year is 1989 (D-1908)");
});

test("no cart, no checkout, no prices — Track-B informational shell", () => {
  // Bans commerce UI/actions. Bare "checkout" is deliberately NOT banned:
  // the shell's own copy states "not its checkout" (the Track-B law, said
  // aloud) — what must never exist is a checkout ACTION.
  assert.doesNotMatch(everything, /add to cart|proceed to checkout|checkout now|buy now|₹|\bRs\.?\s?\d|\$\s?\d|price list|\bMRP\b/i);
  assert.match(page, /No cart here/i, "the shell says what it is");
  assert.match(page, /kairaliproducts\.in/, "the .in store hand-off ships");
  assert.match(page, /kairaliproducts\.com/, "the .com store hand-off ships");
});

test("no invented marketplace URLs — marketplaces are named, not linked (rule 6)", () => {
  assert.match(page, /BigBasket, Flipkart and Amazon/i, "the mined availability claim ships as text");
  assert.doesNotMatch(everything, /href="[^"]*(bigbasket|flipkart|amazon)/i, "no marketplace URL exists in mined materials — links wait for owner-supplied storefronts");
});

test("locked contacts only: info@kairali.com + the interim 38797 WhatsApp", () => {
  assert.match(page, /info@kairali\.com/);
  assert.doesNotMatch(everything, /38777/, "…38777 is the WRONG number, fix on sight");
  assert.match(page, /919289838797/);
  assert.doesNotMatch(everything, /9555156156|support@kairaliproducts/i, "the legacy contact identity is superseded (locked fact)");
  const mailboxes = new Set((everything.match(/[\w.+-]+@kairali\.com/gi) ?? []).map((e) => e.toLowerCase()));
  assert.deepEqual([...mailboxes], ["info@kairali.com"], "info@ is the only public mailbox");
});

test("no banned filler anywhere on the page (Brand Manual ch.11)", () => {
  for (const word of BANNED_FILLER) {
    assert.doesNotMatch(everything, wordRe(word), `banned filler "${word}"`);
  }
});

test("no efficacy/disease claims beyond the mined category descriptors", () => {
  assert.doesNotMatch(
    everything,
    /\b(cures?|heals?\b|treats?\b|clinically proven|anti-pigmentation|premature ejaculation|antifungal|antibacterial)\b/i,
    "descriptors stay at the mined category level (D&MR/ASCI, mining doc §4)",
  );
});
