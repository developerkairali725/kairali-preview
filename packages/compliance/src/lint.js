/**
 * Kairali compliance lint — machine gate for the language locks in CLAUDE.md.
 *
 * Scope model:
 *   - Each site declares its entity in sites/<domain>/site.config.json.
 *   - Clinical lock fires only for entity "ktahv" (never cross-applied — CLAUDE.md).
 *   - Banned filler, cure claims, locked facts, heading rules fire for ALL entities.
 *   - MDX frontmatter `entity:` overrides the site entity per page (kairali.com
 *     KTAHV sections) — convention pending confirmation, see QUESTIONS.md.
 *
 * Suppression: a line containing `compliance-allow: <word>` (in a comment)
 * suppresses that word on that line only. Every suppression is reported as info
 * so nothing disappears silently.
 *
 * Vendored (imported) payload: a site may declare
 *   "compliance": { "vendored": ["public/ahv"] }
 * in site.config.json for trees that are IMPORTED APPROVED SOURCE rather than
 * hand-written — bytes a build tool copies in wholesale and overwrites on every
 * run, so an edit there cannot survive and is not the author's to make. Those
 * files are still scanned and every finding is still reported, at `warning`
 * instead of `error`, exactly as CODE_EXTENSIONS already are. Nothing is hidden
 * and no rule is removed: the gate simply stops blocking a push on bytes the
 * repository does not author. Hand-written files in the same site keep full
 * error severity. Owner ruling D-20260915-07.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import {
  CLINICAL_LOCK_BANNED,
  CLINICAL_LOCK_ENTITIES,
  BANNED_FILLER,
  CURE_CLAIM_PATTERNS,
  LOCKED_COUNT_PATTERNS,
  LOCKED_FACTS,
  CONTENT_EXTENSIONS,
  CODE_EXTENSIONS,
  IGNORED_DIRS,
} from "./rules.js";

const wordRe = (word) =>
  new RegExp(`(?<![\\p{L}\\p{N}-])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}-])`, "giu");

const EMOJI_RE = /\p{Extended_Pictographic}/u;

/** @typedef {{file:string,line:number,severity:"error"|"warning"|"info",rule:string,message:string,excerpt:string}} Finding */

function lineSuppresses(line, word) {
  const m = line.match(/compliance-allow:\s*([\p{L}\p{N} ,-]+)/iu);
  if (!m) return false;
  return m[1]
    .split(",")
    .map((w) => w.trim().replace(/^-+|-+$/g, "").trim().toLowerCase())
    .includes(word.toLowerCase());
}

/** Scan one file's text. entity decides whether the clinical lock applies. */
export function lintText(text, { file = "<text>", entity = "group", asCode = false, vendored = false } = {}) {
  /** @type {Finding[]} */
  const findings = [];
  // Vendored imported source is reported, never merge-blocking — see the scope
  // model in this file's header.
  const sev = asCode || vendored ? "warning" : "error";
  const lines = text.split(/\r?\n/);

  // Per-page entity override via MDX frontmatter
  let effectiveEntity = entity;
  if (lines[0] === "---") {
    const end = lines.indexOf("---", 1);
    if (end > 0) {
      const fm = lines.slice(1, end).join("\n");
      const m = fm.match(/^entity:\s*["']?([a-z-]+)["']?\s*$/m);
      if (m) effectiveEntity = m[1];
    }
  }

  const clinical = CLINICAL_LOCK_ENTITIES.has(effectiveEntity);

  const push = (i, severity, rule, message) =>
    findings.push({ file, line: i + 1, severity, rule, message, excerpt: lines[i].trim().slice(0, 160) });

  const checkWordList = (list, rule, label) => {
    for (const word of list) {
      const re = wordRe(word);
      lines.forEach((line, i) => {
        if (!re.test(line)) return;
        re.lastIndex = 0;
        if (lineSuppresses(line, word)) {
          push(i, "info", rule, `"${word}" allowed by compliance-allow on this line`);
        } else {
          push(i, sev, rule, `${label}: "${word}"`);
        }
      });
    }
  };

  if (clinical) {
    checkWordList(CLINICAL_LOCK_BANNED.en, "clinical-lock", "KTAHV clinical lock (EN)");
    checkWordList(CLINICAL_LOCK_BANNED.de, "clinical-lock-de", "KTAHV clinical lock (DE seed)");
    checkWordList(CLINICAL_LOCK_BANNED.fr, "clinical-lock-fr", "KTAHV clinical lock (FR seed)");
  }

  // Abilash's ruling 13 Jul 2026: banned filler applies to ALL sites,
  // personal included — fix the copy, never exempt the site.
  checkWordList(BANNED_FILLER, "banned-filler", "Banned filler (all entities)");

  // Pattern-list families share one engine. Scans the WHOLE text (not per
  // line) so a claim wrapped across a JSX/prose line break — "nine\ncountries"
  // — is still caught; the finding and any suppression key to the line the
  // match starts on.
  const checkPatternList = (patterns, rule, { severity, suppressed, message }) => {
    for (const { re, note } of patterns) {
      const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
      let m;
      while ((m = r.exec(text)) !== null) {
        if (m[0].length === 0) { r.lastIndex++; continue; }
        const i = text.slice(0, m.index).split("\n").length - 1;
        if (lineSuppresses(lines[i], rule)) {
          push(i, "info", rule, suppressed(note));
        } else {
          push(i, severity, rule, message(note));
        }
      }
    }
  };

  // On KTAHV "cure" is already flagged by the clinical lock; still flag the claim.
  checkPatternList(CURE_CLAIM_PATTERNS, "cure-claims", {
    severity: sev,
    suppressed: (note) => `suppressed ${note}`,
    message: (note) => `No cure promises anywhere: ${note}`,
  });

  // Locked counts — ERROR even in code (a count literal in TSX is the bug).
  // The message deliberately carries NO figures: the canonical numbers live in
  // @kairali/facts (computed) and a number typed here would rot the same way.
  checkPatternList(LOCKED_COUNT_PATTERNS, "locked-counts", {
    severity: "error",
    suppressed: (note) => `suppressed: ${note}`,
    message: (note) =>
      `${note} — network counts are canonical (KAC site ruling 17 Jul 2026, PROJECT_CONTEXT §12) and render from @kairali/facts constants; never type one`,
  });

  // Locked facts — any formatting of the known-bad number
  lines.forEach((line, i) => {
    const digits = line.replace(/[^\d]/g, "");
    if (digits.includes(LOCKED_FACTS.knownBadNumberDigits)) {
      push(i, "error", "locked-facts", `Known-bad WhatsApp number (…38777) — correct is ${LOCKED_FACTS.ktahvWhatsApp}`);
    }
    const emails = line.match(/[\w.+-]+@kairali\.com/gi) || [];
    const permitted = new Set(
      [LOCKED_FACTS.contactEmail, ...(LOCKED_FACTS.permittedDepartmentEmails || [])].map((x) => x.toLowerCase())
    );
    for (const e of emails) {
      if (!permitted.has(e.toLowerCase())) {
        // Reported but not merge-blocking in vendored imported source, which
        // this repository cannot edit (the importer overwrites it). Still a
        // hard error in every hand-written file, code included. The known-bad
        // WhatsApp number above is deliberately NOT downgraded: a wrong phone
        // number blocks a push wherever it appears.
        push(i, vendored ? "warning" : "error", "locked-facts", `Public contact email must be ${LOCKED_FACTS.contactEmail}, found "${e}"`);
      }
    }
  });

  // Heading rules (markdown/MDX only): no emoji, no exclamation in headings
  if (!asCode) {
    lines.forEach((line, i) => {
      if (!/^#{1,6}\s/.test(line)) return;
      if (line.includes("!")) push(i, "error", "brand-voice", "No exclamation marks in headings");
      if (EMOJI_RE.test(line)) push(i, "error", "brand-voice", "No emoji (Brand Manual ch.11)");
    });
  }

  return findings;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name) || name.startsWith(".")) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * True when `file` is `root` itself or lies beneath it. Separator-agnostic:
 * path.join yields backslashes on Windows, so a literal "/" prefix test never
 * matched there and every vendored file was reported at error severity.
 */
export function isUnderRoot(file, root) {
  const f = file.replace(/\\/g, "/");
  const r = root.replace(/\\/g, "/");
  return f === r || f.startsWith(r + "/");
}

/** Vendored trees declared by the site, as paths relative to the site dir. */
function siteVendored(siteDir) {
  const cfg = join(siteDir, "site.config.json");
  if (!existsSync(cfg)) return [];
  try {
    const parsed = JSON.parse(readFileSync(cfg, "utf8"));
    const list = parsed?.compliance?.vendored;
    return Array.isArray(list) ? list.filter((v) => typeof v === "string" && v.length) : [];
  } catch {
    return [];
  }
}

function siteEntity(siteDir) {
  const cfg = join(siteDir, "site.config.json");
  if (existsSync(cfg)) {
    try {
      const parsed = JSON.parse(readFileSync(cfg, "utf8"));
      if (parsed.entity) return parsed.entity;
    } catch {
      /* fall through to missing-config finding */
    }
  }
  return null;
}

/**
 * Lint a site directory (or any directory with an explicit entity).
 * @returns {Finding[]}
 */
export function lintDir(dir, { entity } = {}) {
  /** @type {Finding[]} */
  const findings = [];
  let eff = entity ?? siteEntity(dir);
  if (!eff) {
    findings.push({
      file: join(dir, "site.config.json"),
      line: 1,
      severity: "error",
      rule: "config",
      message: `Missing or invalid site.config.json with "entity" — required so the right language locks apply (defaulting to strictest: ktahv)`,
      excerpt: "",
    });
    eff = "ktahv"; // fail safe: strictest lock until configured
  }
  const vendoredRoots = siteVendored(dir).map((rel) => join(dir, rel));
  const isVendored = (file) => vendoredRoots.some((root) => isUnderRoot(file, root));
  for (const file of walk(dir)) {
    const ext = extname(file).toLowerCase();
    const asCode = CODE_EXTENSIONS.has(ext);
    if (!CONTENT_EXTENSIONS.has(ext) && !asCode) continue;
    if (basename(file) === "site.config.json") continue;
    findings.push(
      ...lintText(readFileSync(file, "utf8"), { file, entity: eff, asCode, vendored: isVendored(file) })
    );
  }
  return findings;
}

export function formatFindings(findings) {
  const order = { error: 0, warning: 1, info: 2 };
  const sorted = [...findings].sort(
    (a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line
  );
  return sorted
    .map((f) => `${f.severity.toUpperCase().padEnd(7)} ${f.file}:${f.line} [${f.rule}] ${f.message}\n        > ${f.excerpt}`)
    .join("\n");
}
