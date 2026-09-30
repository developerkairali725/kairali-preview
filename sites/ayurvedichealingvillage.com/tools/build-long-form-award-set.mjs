#!/usr/bin/env node
// Chapter 06 of the long-form advertising route renders 27 awards as 7 image cards plus a 20-row
// hairline <dl>. Owner ruling 2026-09-21, handover item 2: refresh the set from the rebuild and
// reorder it — NABH first, then current-year, then the historic list — and KEEP the certificates
// whose printed validity has lapsed, with the exposure recorded rather than silent.
//
// Two canonical datasets, no scraping and nothing invented:
//   public/ahv/assets/accreditations-data.js  — 7 certificate documents, each with printedEvidence
//   public/ahv/assets/awards-and-accolades-data.js — 22 award cards, verbatim from family-04
//
// Years come out of the caption text; a card with no year printed in its own caption gets
// year: null and keeps source order at the tail. Guessing a year on an award is inventing a fact.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '..');
const repo = resolve(site, '../..');

const DROP = resolve(repo, 'launches/ayurvedichealingvillage.com/design-intake/LONG-FORM-ADVERTISING');
const OUT_JSON = resolve(site, 'english-candidate/long-form-award-set.json');
const OUT_NOTE = resolve(DROP, 'notes/chapter-06-award-set.md');

// KTAHV clinical lock. Award names are proper nouns and cannot be renamed; counted, never edited.
const BANNED = ['spa', 'resort', 'holiday', 'luxury', 'cure', 'journey', 'guests'];

const load = (file, key) => {
  const w = {};
  new Function('window', readFileSync(resolve(site, file), 'utf8'))(w);
  if (!w[key]) throw new Error(`${key} not found in ${file}`);
  return w[key];
};

function ist(d = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(d).reduce((a, x) => ((a[x.type] = x.value), a), {});
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} IST`;
}

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

// ---- certificates, in the owner's credibility order -------------------------------------------
// Rank is editorial ORDER, taken from his instruction; every date below is printed on the document
// and read out of the dataset, never computed from reputation.
const CERT_ORDER = [
  'NABH accreditation certificate — 2024–2027',
  'Clinical establishment provisional registration',
  'Lotus Travel Quality Partner — 2026',
  'Ayur Diamond certificate — 2023',
  'ISO 9001:2015 certificate — 2022',
  'Form 1C certificate',
  'Historical letter',
];

const accred = load('public/ahv/assets/accreditations-data.js', 'AHV_ACCREDITATIONS');
const docs = accred.gallery.documents;

const unknown = docs.map((d) => d.label).filter((l) => !CERT_ORDER.includes(l));
if (unknown.length) {
  console.error(`FAIL — certificate label(s) not in the ruled order, so the order is stale:`);
  for (const l of unknown) console.error(`  ${l}`);
  process.exit(1);
}

// The printed end date, normalised to ISO. The documents print it three different ways -
// "2027-04-24", "02-05-2028" (DD-MM-YYYY) and "16February2025" - and comparing those as STRINGS
// reads "02-05-2028" as earlier than today and calls a registration valid until 2028 expired.
// It did, on the first run of this tool. Every format is parsed; an unparseable one FAILS the run
// rather than being quietly sorted as text.
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'];

const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

function toISO(raw, where) {
  const s = String(raw).trim();
  let m;
  if ((m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s))) return s;
  if ((m = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(s))) return iso(m[3], m[2], m[1]);   // DD-MM-YYYY
  if ((m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s))) return iso(m[3], m[2], m[1]); // DD.MM.YYYY
  if ((m = /^(\d{1,2})\s*([A-Za-z]+)\s*(\d{4})$/.exec(s))) {                        // 16February2025
    const i = MONTHS.indexOf(m[2].toLowerCase());
    if (i >= 0) return iso(m[3], i + 1, m[1]);
  }
  console.error(`FAIL - unparseable printed date "${s}" on ${where}. Add the format or fix the data; do not compare it as text.`);
  process.exit(1);
}

// The printed end date, whichever field carries it. Absent = not stated on the document.
const printedEnd = (ev = {}, where = '?') => {
  if (ev.printedValidThrough) return toISO(ev.printedValidThrough, where);
  const m = /(\d+)\s*years?\s*from\s*([\d.]+)/i.exec(ev.printedPeriod ?? '');
  if (m) {
    const start = toISO(m[2], where);
    const [y, mo, d] = start.split('-').map(Number);
    return iso(y + Number(m[1]), mo, d);
  }
  return null;
};

const certificates = CERT_ORDER.map((label, i) => {
  const d = docs.find((x) => x.label === label);
  const end = printedEnd(d.printedEvidence, label);
  return {
    rank: i + 1,
    label,
    src: d.src,
    class: /accreditation|registration/i.test(label) ? 'accreditation'
      : /certificate|Lotus|Diamond/i.test(label) ? 'certificate' : 'correspondence',
    printedEvidence: d.printedEvidence,
    printedValidThrough: end,
    lapsedToday: end ? end < today : null,
    retainedByOwnerRuling: end ? end < today : false,
  };
});

const lapsed = certificates.filter((c) => c.lapsedToday);

// ---- awards, most recent first, undated keeping source order ----------------------------------
const awards = load('public/ahv/assets/awards-and-accolades-data.js', 'AHV_AWARDS').cards
  .map((c, i) => {
    const years = [...new Set(c.caption.match(/\b(?:19|20)\d{2}\b/g) ?? [])].map(Number);
    return {
      sourceIndex: i + 1,
      year: years.length ? Math.max(...years) : null,
      caption: c.caption,
      image: c.image,
      alt: c.alt,
      bannedWords: BANNED.filter((b) => new RegExp(`\\b${b}`, 'i').test(c.caption)),
    };
  })
  .sort((a, b) => (b.year ?? -1) - (a.year ?? -1) || a.sourceIndex - b.sourceIndex)
  .map((a, i) => ({ rank: i + 1, ...a }));

const undated = awards.filter((a) => a.year === null);
const withBanned = awards.filter((a) => a.bannedWords.length);

writeFileSync(OUT_JSON, `${JSON.stringify({
  why: "Chapter 06 of the long-form advertising route. Owner ruling 2026-09-21: refresh from the rebuild, reorder NABH-first, KEEP the lapsed certificates and record them.",
  sources: [
    'public/ahv/assets/accreditations-data.js (window.AHV_ACCREDITATIONS.gallery.documents)',
    'public/ahv/assets/awards-and-accolades-data.js (window.AHV_AWARDS.cards)',
  ],
  generated: ist(),
  evaluatedAgainstDate: today,
  counts: {
    certificates: certificates.length,
    awards: awards.length,
    total: certificates.length + awards.length,
    lapsedCertificatesRetained: lapsed.length,
    awardsWithNoPrintedYear: undated.length,
    awardCaptionsCarryingLockedWords: withBanned.length,
  },
  certificates,
  awards,
}, null, 2)}\n`);

const certRows = certificates
  .map((c) => `| ${c.rank} | ${c.label} | ${c.class} | ${c.printedValidThrough ?? 'not stated'} | ${c.lapsedToday === null ? '—' : c.lapsedToday ? '**lapsed, retained**' : 'current'} |`)
  .join('\n');
const awardRows = awards
  .map((a) => `| ${a.rank} | ${a.year ?? '—'} | ${a.caption.slice(0, 96)}${a.caption.length > 96 ? '…' : ''} | ${a.bannedWords.join(', ') || '—'} |`)
  .join('\n');

writeFileSync(OUT_NOTE, `# Chapter 06 — the award set, ordered

Generated by \`tools/build-long-form-award-set.mjs\` at ${ist()}. Do not hand-edit; re-run it.

**Handover item 2**, owner ruling 2026-09-21: *"update them accordingly and reorder"*. Order is his
— NABH leads, then the clinical-establishment registration, then the certificates, then the awards
most-recent-first. ${certificates.length} certificates + ${awards.length} awards = **${certificates.length + awards.length} entries**, against the 27 the chapter
carries today. The image-card / \`<dl>\` split and the layout are the designer's and are untouched.

## Certificates, in the ruled order

| # | document | class | printed valid through | today (${today}) |
|---|---|---|---|---|
${certRows}

**${lapsed.length} lapsed certificates are RETAINED by the owner's explicit ruling** (2026-09-21), not by
oversight. They are on the live site today and the retention is logged in
\`notes/register-violations.md\` with both dates, so the exposure is on the record. The renewal
documents, if they exist, would close it; nobody has produced them to this repo.

The last two rows are the dataset's own classification, not mine: the "Historical letter" is
recorded there as *"not an accreditation certificate"* and the Form 1C as mostly unreadable at the
resolution held. They sort last for that reason and may be better dropped from an advertising page
than shown small.

## Awards, most recent printed year first

${undated.length} of ${awards.length} captions print no year at all. Those sort last in their source order and carry
\`year: null\` — reading a year off an award that does not state one would be inventing a fact.

| # | year | caption | locked words |
|---|---|---|---|
${awardRows}

## The register, counted — not fixed

${withBanned.length} award captions carry KTAHV-locked words. Every one is inside the **proper name of the award
itself** (e.g. the World Luxury Spa Awards), which cannot be renamed without misnaming the award.
This is the parked EN register debt, counted here so the size is known before the page ships, and
left alone: HARD GATE 6 and the owner's standing decision to park the EN register cleanup.
`);

console.log(`certificates            ${certificates.length}`);
console.log(`  lapsed, retained      ${lapsed.length}  (${lapsed.map((c) => `${c.label.split(' —')[0]} ${c.printedValidThrough}`).join('; ')})`);
console.log(`awards                  ${awards.length}`);
console.log(`  no printed year       ${undated.length}`);
console.log(`  locked words in name  ${withBanned.length}`);
console.log(`total entries           ${certificates.length + awards.length}  (chapter carries 27 today)`);
console.log(`wrote ${OUT_JSON.replace(`${repo}/`, '')}`);
console.log(`wrote ${OUT_NOTE.replace(`${repo}/`, '')}`);
