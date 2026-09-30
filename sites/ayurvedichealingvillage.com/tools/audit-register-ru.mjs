#!/usr/bin/env node
/**
 * AHV — the KTAHV clinical register, in Russian.
 *
 * THE LESSON THIS TOOL EXISTS FOR. /treatment-in-kerala-russian.html scored zero
 * banned words for as long as it has been live — not because the copy was clean
 * but because nothing could read it. The page is served as mojibake: 277,280
 * bytes, 14,640 corrupted character pairs, zero Cyrillic letters. A register
 * check that cannot decode its input is not a passing check, it is an absent
 * one. So this tool recovers the text FIRST (tools/lib/mojibake.mjs, every run
 * proven to round-trip) and refuses to report a clean result on input it could
 * not read.
 *
 * WHAT IT ENFORCES. The list drafted in docs/ktahv-inputs/ktahv-register-ru.md
 * against the GST clinical lock. Four stems FAIL; three RAISE a finding for a
 * human, because they are sense-dependent in Russian exactly as the DE/FR
 * guidance in CLAUDE.md already allows — `отдых` is also clinical rest,
 * `путешествие` is also literal travel, `гост` is also the state standard ГОСТ.
 * Failing those automatically would make the tool wrong more often than the copy.
 *
 * STATUS: the list is drafted and awaiting Abilash's sign-off (owner ruling
 * 2026-09-20 "Add RU to the lock"). Until he signs, this reports and exits 0 on
 * findings unless --strict is passed, so it cannot block a build on an unapproved
 * rule. That is the activation-semantics rule in CLAUDE.md §10: the obligation
 * binds conduct now, the machine gate arms when the rule is signed.
 *
 *   node tools/audit-register-ru.mjs <file...> [--strict] [--json]
 */
import { readFileSync, existsSync } from "node:fs";
import { recover } from "./lib/mojibake.mjs";

const argv = process.argv.slice(2);
const STRICT = argv.includes("--strict");
const JSON_OUT = argv.includes("--json");
const files = argv.filter((a) => !a.startsWith("--"));

/**
 * severity "fail": no legitimate clinical sense in Russian.
 * severity "flag": a real sense exists; a human rules on it.
 */
const RULES = [
  { en: "luxury",  severity: "fail", stem: /роскош|люкс/gi,
    clinical: "drop it; the register has no luxury framing" },
  { en: "resort",  severity: "fail", stem: /курорт/gi,
    clinical: "больница / центр (hospital / centre)" },
  { en: "spa",     severity: "fail", stem: /спа(?=[\s.,;:!?)«»"'–—-]|$)/gi,
    clinical: "процедура (procedure)",
    // "спа" opens спасибо, спасение, спальня — the lookahead above is what keeps
    // those out, and the test suite pins it.
  },
  { en: "cure",    severity: "fail", stem: /исцел|излеч|вылеч/gi,
    clinical: "лечение (treatment) — describe the programme, never the outcome" },

  { en: "holiday", severity: "flag", stem: /отпуск|каникул|отдых/gi,
    clinical: "отдых is also clinical rest — banned only in the vacation sense" },
  { en: "journey", severity: "flag", stem: /путешеств/gi,
    clinical: "banned as brand metaphor; literal travel on a how-to-reach page is fine" },
  { en: "guests",  severity: "flag", stem: /гост/gi,
    clinical: "пациент (patient). Also matches ГОСТ and гостиница" },
];

const CYRILLIC = /[Ѐ-ӿ]/g;

function scan(file) {
  const raw = readFileSync(file, "utf8");
  const r = recover(raw);
  const text = r.text
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ");

  const cyrillic = (text.match(CYRILLIC) || []).length;
  const findings = [];
  for (const rule of RULES) {
    rule.stem.lastIndex = 0;
    const hits = text.match(rule.stem) || [];
    if (hits.length) {
      findings.push({
        en: rule.en,
        severity: rule.severity,
        count: hits.length,
        forms: [...new Set(hits.map((h) => h.toLowerCase()))].slice(0, 6),
        clinical: rule.clinical,
      });
    }
  }
  return { file, recoveredRuns: r.converted, mojibakeRuns: r.runs, cyrillic, findings };
}

const reports = files.filter(existsSync).map(scan);

if (JSON_OUT) {
  console.log(JSON.stringify({ generated: new Date().toISOString(), strict: STRICT, reports }, null, 2));
} else {
  for (const rep of reports) {
    console.log(`\n${rep.file}`);
    console.log(`  suspect runs seen: ${rep.mojibakeRuns}   mojibake runs decoded: ${rep.recoveredRuns}   Cyrillic letters read: ${rep.cyrillic}`);
    if (!rep.cyrillic) {
      // Two very different silences, and conflating them is how the original
      // defect hid: a file with nothing Russian in it is out of scope, but a
      // file that HAD mojibake and still yields no Cyrillic was not read.
      if (rep.recoveredRuns) {
        console.log("  NOT READ — mojibake present and no Russian recovered. This is not a clean result.");
      } else {
        console.log("  no Russian in this file — out of scope for the RU register");
      }
      continue;
    }
    if (!rep.findings.length) {
      console.log("  register: clean");
      continue;
    }
    for (const f of rep.findings) {
      const tag = f.severity === "fail" ? "FAIL" : "FLAG";
      console.log(`  ${tag}  ${String(f.count).padStart(3)}x  ${f.en.padEnd(8)} ${f.forms.join(", ")}`);
      console.log(`            -> ${f.clinical}`);
    }
  }
}

// Only a file where mojibake was actually DECODED and still reads as nothing
// counts as unread. `mojibakeRuns` is the count of suspect runs, and an English
// page with real em dashes has those - it is not evidence of damage.
const unread = reports.filter((r) => !r.cyrillic && r.recoveredRuns).length;
const outOfScope = reports.filter((r) => !r.cyrillic && !r.recoveredRuns).length;
const fails = reports.reduce((n, r) => n + r.findings.filter((f) => f.severity === "fail").length, 0);
const flags = reports.reduce((n, r) => n + r.findings.filter((f) => f.severity === "flag").length, 0);
if (!JSON_OUT) {
  console.log(`\n${reports.length} file(s): ${fails} failing term(s), ${flags} flagged for a human, ${unread} unreadable, ${outOfScope} not Russian.`);
  if (!STRICT) console.log("(advisory — the RU list is awaiting sign-off; --strict makes it blocking)");
}
process.exit(STRICT && (fails || unread) ? 1 : 0);
