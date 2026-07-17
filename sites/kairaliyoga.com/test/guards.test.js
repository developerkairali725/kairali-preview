// kairaliyoga.com integrity gate — pins the page to its rulings so later
// edits cannot drift: no prices, no invented dates, no cure claims, no
// group-1908 conflation, computed rolling years, redirects cover every
// mined legacy page, locked contacts, and testimonials that are verbatim
// excerpts of the legacy site's testimonials page (≤3).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..");
// Guards judge the SHIPPED COPY, not our own annotations: strip comments.
const page = readFileSync(join(site, "app/page.tsx"), "utf8")
  .replace(/^\s*\/\/[^\n]*$/gm, "") // full-line comments only — never URLs' "//"
  .replace(/\/\*[\s\S]*?\*\//g, "");
const config = readFileSync(join(site, "next.config.ts"), "utf8");
const testimonials = JSON.parse(
  readFileSync(join(site, "content/testimonials.json"), "utf8"),
);
const legacyTestimonialsHtml = readFileSync(
  join(site, "../../content-mined/kairaliyoga.com/testimonials.html"),
  "utf8",
);

/** Collapse an HTML fragment to comparable plain text. */
function normalize(text) {
  return text
    .replace(/<[^>]+>/g, " ") // tags → spaces
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/\s+/g, " ")
    .trim();
}

test("no prices anywhere: rates live only in approved surfaces", () => {
  assert.doesNotMatch(page, /₹|€/u, "currency symbols are price leakage");
  assert.doesNotMatch(page, /\$\s*\d/, "dollar amounts are price leakage");
  assert.doesNotMatch(page, /\b(INR|USD|EURO?)\b/, "currency codes are price leakage");
  assert.doesNotMatch(page, /\bper[- ]night\b[^.]{0,30}\d/i, "no per-night figures");
  assert.doesNotMatch(page, /\b(tariff|rate)s?\b[^.]{0,20}\d/i, "no tariff numbers");
});

test("no invented dates: the admissions device stays honest (no month-day patterns)", () => {
  const monthDay =
    /\b(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(t|tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\.?\s+\d{1,2}\b/;
  const dayMonth =
    /\b\d{1,2}(st|nd|rd|th)?\s+(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(t|tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\b/i;
  assert.doesNotMatch(page, monthDay, "no batch dates exist — none may be invented");
  assert.doesNotMatch(page, dayMonth, "no batch dates exist — none may be invented");
  assert.match(page, /Enquire for upcoming dates/i, "the honest admissions strip must exist");
});

test("no cure/treat claims (compliance floor: yoga cures nothing)", () => {
  assert.doesNotMatch(page, /\bcures?\b/i);
  assert.doesNotMatch(page, /\btreats?\s+(disease|ailment|condition|illness)/i);
  assert.doesNotMatch(page, /guarantee[ds]?\s+(results?|recovery|relief|healing)/i);
  assert.doesNotMatch(page, /\bmiracle\b/i);
});

test("1908 appears ONLY as family-lineage phrasing, and rolling numbers are computed", () => {
  const groupClaim = /(Group|Kairali Ayurvedic Group)[^.]{0,40}[Ss]ince 1908/;
  assert.doesNotMatch(page, groupClaim, "1908 must never attach to the Group");
  assert.match(page, /family\s+(that has practised|practising)\s+Ayurveda/i);
  assert.match(page, /new Date\(\)\.getFullYear\(\) - 1908/, "lineage years must be computed");
  assert.match(page, /new Date\(\)\.getFullYear\(\) - 1989/, "group years must be computed");
  assert.doesNotMatch(page, /\b1[0-9]{2}\s*\+?\s*years/i, "no typed rolling year counts");
});

test("redirect map covers every mined legacy page, single-hop", () => {
  const mined = readdirSync(join(site, "../../content-mined/kairaliyoga.com"))
    .filter((f) => f.endsWith(".html"))
    .map((f) =>
      f === "home.html" ? "/default.aspx" : "/" + f.replace(/\.html$/, ".aspx"),
    );
  assert.equal(mined.length, 9, "the mine banked 9 legacy pages");
  for (const p of mined) {
    assert.ok(config.includes(`"${p}"`), `legacy URL ${p} has no redirect fate`);
  }
  // single-hop: destinations are final pages/anchors, never other redirects
  assert.doesNotMatch(config, /destination:\s*"\/[a-z-]+\.aspx"/);
});

test("locked contact facts only: info@kairali.com + the interim 38797 WhatsApp", () => {
  assert.match(page, /info@kairali\.com/);
  assert.doesNotMatch(page, /38777/, "…38777 is the WRONG number, fix on sight");
  assert.match(page, /919289838797/);
  // audit finding #2 regression: the legacy site's mailto dropped "fo"
  assert.doesNotMatch(page, /mailto:in@kairali\.com/);
});

test("testimonials: at most 3, each a verbatim excerpt of the legacy testimonials page, rendered from the JSON", () => {
  const list = testimonials.testimonials;
  assert.ok(Array.isArray(list) && list.length >= 1, "testimonials exist");
  assert.ok(list.length <= 3, `at most 3 testimonials (found ${list.length})`);
  const legacyText = normalize(legacyTestimonialsHtml);
  for (const t of list) {
    assert.ok(
      legacyText.includes(normalize(t.quote)),
      `quote not verbatim-present in the mined legacy page: "${t.quote.slice(0, 60)}…"`,
    );
    assert.ok(
      legacyText.includes(normalize(t.name)),
      `attribution name not present in the mined legacy page: "${t.name}"`,
    );
    assert.ok(
      legacyText.includes(normalize(t.position)),
      `attribution position not present in the mined legacy page: "${t.position}"`,
    );
  }
  // the page must render the JSON, not a parallel hardcoded list
  assert.match(page, /content\/testimonials\.json/, "page imports the testimonials JSON");
  assert.match(page, /testimonialsData\.testimonials\.map/, "page renders the JSON list");
});

test("programme names and durations match the rates reckoner exactly", () => {
  // Q-YOGA-IAST interim (it.2): Kurale misanchors combining macrons
  // (font-level, CDN-proven — design review it.1 finding 1), so the Kurale
  // DISPLAY strings are ASCII-romanized while the reckoner-EXACT IAST moved
  // to the Lato/Asap support faces (`iast` fields, door hints). The exact
  // IAST spellings must ALWAYS remain on the page:
  assert.match(page, /Dhyāna-Yoga Shibiram/);
  assert.match(page, /Agni Dīpanam Yoga Chikitsa/);
  assert.match(page, /Prāna Sāmya Yoga Chikitsa/);
  // …and each must be bound to the support-face `iast` field, never lost
  // to a Kurale-rendered surface:
  assert.match(page, /iast:\s*"Dhyāna-Yoga Shibiram"/);
  assert.match(page, /iast:\s*"Agni Dīpanam Yoga Chikitsa"/);
  assert.match(page, /iast:\s*"Prāna Sāmya Yoga Chikitsa"/);
  // the romanized display twins exist for the Kurale h3 (never macronned —
  // a bar over a consonant must not ship):
  assert.match(page, /display:\s*"Dhyana-Yoga Shibiram"/);
  assert.match(page, /display:\s*"Agni Dipanam Yoga Chikitsa"/);
  assert.match(page, /display:\s*"Prana Samya Yoga Chikitsa"/);
  // minimum durations as printed (07/14/07 nights)
  assert.match(page, /07 nights minimum/);
  assert.match(page, /14 nights minimum/);
  // the legacy fiction is not revived: no claim that a Yoga Teacher Training
  // programme EXISTS here (the honest "if you are researching YTT" referral
  // sentence is allowed — it claims nothing).
  assert.doesNotMatch(
    page,
    /teacher training (course|program|certification)|offer\w*[^.]{0,40}teacher training|(RYS|RYT|Yoga Alliance)/i,
    "no YTT exists in the reckoner — do not invent one",
  );
});
