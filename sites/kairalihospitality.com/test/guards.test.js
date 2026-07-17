// kairalihospitality.com integrity gate — pins the page to its rulings so
// later edits cannot drift: the Healing Village card stays in the clinical
// register (KTAHV lock scoped to its data-register="clinical" blocks), the
// TBC JV spelling never ships, no invented counts/prices/tariffs, computed
// rolling years only, redirects cover every mined legacy page single-hop,
// locked contacts only.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
// The lock lexicon comes from the law itself, never a local copy.
import { CLINICAL_LOCK_BANNED, BANNED_FILLER } from "../../../packages/compliance/src/rules.js";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..");
// Guards judge the SHIPPED COPY, not our own annotations: strip comments.
const strip = (s) =>
  s.replace(/^\s*\/\/[^\n]*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
const page = strip(readFileSync(join(site, "app/page.tsx"), "utf8"));
const layout = strip(readFileSync(join(site, "app/layout.tsx"), "utf8"));
const llms = strip(readFileSync(join(site, "app/llms.txt/route.ts"), "utf8"));
// config is judged comment-stripped too (its comments cite the rejected
// kairalifranchise.com hop by name — documentation, not a destination).
const config = strip(readFileSync(join(site, "next.config.ts"), "utf8"));
const everything = page + layout + llms;

const wordRe = (word) =>
  new RegExp(`(?<![\\p{L}\\p{N}-])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}-])`, "giu");

/** Extract every JSX block marked data-register="clinical" (door + card). */
function clinicalBlocks(src) {
  const blocks = [];
  const marker = /data-register="clinical"/g;
  let m;
  while ((m = marker.exec(src))) {
    const before = src.slice(0, m.index);
    const open = before.match(/<([a-z]+)[^<]*$/i);
    assert.ok(open, "clinical marker must sit inside an element's opening tag");
    const tag = open[1];
    const close = src.indexOf(`</${tag}>`, m.index);
    assert.ok(close > -1, `clinical <${tag}> block never closes`);
    blocks.push(src.slice(open.index, close));
  }
  return blocks;
}

test("Healing Village blocks exist and hold the clinical register (KTAHV lock)", () => {
  const blocks = clinicalBlocks(page);
  assert.ok(blocks.length >= 2, "expected the clinical door AND the Healing Village card");
  for (const block of blocks) {
    for (const word of CLINICAL_LOCK_BANNED.en) {
      assert.doesNotMatch(
        block,
        wordRe(word),
        `clinical-lock word "${word}" inside a Healing Village block`,
      );
    }
  }
  // the card speaks hospital language, not hospitality
  const card = blocks.find((b) => b.includes("healing-village"));
  assert.ok(card, "the Healing Village panel carries id=healing-village");
  assert.match(card, /treatment/i);
  assert.match(card, /physician|hospital/i);
});

test("the TBC JV spelling never ships; the verified name does", () => {
  assert.doesNotMatch(everything, /swatak/i, "'Swatak' is the unconfirmed dictation — never print");
  assert.doesNotMatch(everything, /katrina/i, "'Katrina' is the unconfirmed dictation — never print");
  assert.match(page, /Kateřina/, "the two-source-verified name is the one that ships");
  assert.match(page, /Bohemian-Moravian Highlands/);
  assert.match(page, /VYSOČINA/, "the place strip carries the verified region");
});

test("no invented counts, prices, or tariffs (rule 6)", () => {
  assert.doesNotMatch(everything, /₹|€\s?\d|lakh|crore|per night|tariff|price list|room rate/i);
  assert.doesNotMatch(
    everything,
    /\d+\s*\+?\s*(rooms|acres|hectares|outlets|centres|centers|clients|projects|resorts|hotels)\b/i,
    "no counted nouns — nothing on this page carries a number Abilash has not ruled",
  );
});

test("1908 is family-lineage only; rolling numbers are computed, never typed", () => {
  const groupClaim = /(Group|Kairali Ayurvedic Group)[^.]{0,40}[Ss]ince 1908/;
  assert.doesNotMatch(page, groupClaim, "1908 must never attach to the Group");
  assert.match(page, /family\s+(that has practised|practising)\s+Ayurveda/i);
  assert.match(page, /new Date\(\)\.getFullYear\(\) - 1908/, "lineage years must be computed");
  assert.match(page, /new Date\(\)\.getFullYear\(\) - 1989/, "group years must be computed");
  assert.doesNotMatch(everything, /\b1[0-9]{2}\s*\+?\s*years/i, "no typed rolling year counts");
  assert.doesNotMatch(everything, /\b(over|more than|nearly)\s+\d+\s+decades/i, "no frozen decade claims (legacy defect)");
});

test("no banned filler anywhere on the page (Brand Manual ch.11)", () => {
  for (const word of BANNED_FILLER) {
    assert.doesNotMatch(everything, wordRe(word), `banned filler "${word}"`);
  }
});

test("redirect map covers every mined legacy page, single-hop", () => {
  const mined = readdirSync(join(site, "../../content-mined/kairalihospitality.com"))
    .filter((f) => f.endsWith(".html"))
    .map((f) => "/" + f.replace(/\.html$/, ".aspx"));
  for (const p of mined) {
    assert.ok(config.includes(`"${p}"`), `legacy URL ${p} has no redirect fate`);
  }
  // single-hop: destinations are final pages, never other .aspx redirects
  assert.doesNotMatch(config, /:\s*"\/[^"]*\.aspx"/, "an .aspx destination would chain redirects");
  // the franchise fate is the CANONICAL franchise domain (Decision #4),
  // not kairalifranchise.com (which is itself only a 301 — two hops)
  assert.ok(config.includes('"/ayurvedic-franchise.aspx": "https://ayurvedafranchise.com/"'));
  assert.ok(!config.includes("kairalifranchise.com"), "kairalifranchise.com is a hop, not a home");
});

test("locked contacts only: info@kairali.com + the interim 38797 WhatsApp", () => {
  assert.match(page, /info@kairali\.com/);
  assert.doesNotMatch(everything, /38777/, "…38777 is the WRONG number, fix on sight");
  assert.match(page, /919289838797/);
  assert.doesNotMatch(everything, /9555156156/, "legacy group line is unruled — not carried (rule 6)");
  const mailboxes = new Set((everything.match(/[\w.+-]+@kairali\.com/gi) ?? []).map((e) => e.toLowerCase()));
  assert.deepEqual([...mailboxes], ["info@kairali.com"], "info@ is the only public mailbox");
});

test("property links are the locked destinations", () => {
  assert.match(page, /https:\/\/villaraag\.com/);
  assert.match(page, /https:\/\/www\.ayurvedichealingvillage\.com/);
  assert.match(page, /https:\/\/www\.katerinaresort\.cz\/en/);
});
