#!/usr/bin/env node
/**
 * wp-snapshot.mjs — the automatic pre-publish backup for WordPress pages.
 *
 * WHY THIS EXISTS (Abilash directive, 18 Jul 2026 — Team Workbook "Rollback &
 * Backup"): humans make more mistakes than the machine in a complex chain, so
 * the undo path must be one paste, not archaeology. Before ANY WordPress
 * publish, the CURRENT live/staging page is saved as a timestamped HTML file —
 * by the machine, as part of the publish prompt itself, never from human
 * memory. If a publish goes wrong, the before-state exists, timestamped to the
 * second, and (once committed) also lives in git history — two independent
 * undo layers (this file + Gutenberg's own revisions).
 *
 * USAGE
 *   node scripts/wp-snapshot.mjs <url> [<url> ...]
 *
 * OUTPUT
 *   backups/<domain>/<page-slug>--YYYY-MM-DDTHH-MM-SS.html   (IST, second precision)
 *
 * BEHAVIOUR RULES
 *   - Exit code 1 if ANY fetch fails → a publish chained after this script
 *     REFUSES to continue without its backup. A missing backup must stop the
 *     line, not warn it (same law as the CI gates: rule (g), never weaken).
 *   - Read-only GET with a desktop UA. Never POSTs, never authenticates.
 *   - Timestamps are IST to the second (repo law: every log entry is
 *     `YYYY-MM-DD HH:MM:SS IST`; filenames use the same instant, `-` for `:`).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Backups anchor to the REPO, never to the caller's cwd — the 20 Jul
// silent-failure audit proved a foreign-cwd run would say "Safe to proceed"
// while landing the rollback layer outside the repo (same class as the
// evidence-manifest cwd no-op fixed in seo-baseline.mjs).
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 kairali-wp-snapshot";

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("usage: node scripts/wp-snapshot.mjs <url> [<url> ...]");
  process.exit(1);
}

/** IST wall-clock (UTC+5:30), second precision, filename-safe. */
function istStamp() {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 19).replace(/:/g, "-"); // 2026-07-18T15-04-05
}

let failed = 0;
for (const raw of urls) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    console.error(`✗ not a URL: ${raw}`);
    failed++;
    continue;
  }
  const slug =
    url.pathname.replace(/\/+$/, "").replace(/^\/+/, "").replace(/[^a-zA-Z0-9._-]+/g, "-") ||
    "home";
  const dir = join(REPO_ROOT, "backups", url.hostname.replace(/^www\./, ""));
  const file = join(dir, `${slug}--${istStamp()}.html`);
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.text();
    if (body.length < 500) throw new Error(`suspiciously small response (${body.length} bytes)`);
    mkdirSync(dir, { recursive: true });
    // Provenance header so a restored file is never mistaken for hand-written HTML.
    const header = `<!-- wp-snapshot: ${url.href} @ ${istStamp()} IST (${body.length} bytes) — pre-publish backup, do not edit -->\n`;
    writeFileSync(file, header + body);
    console.log(`✓ ${url.href} → ${file} (${body.length} bytes)`);
  } catch (err) {
    console.error(`✗ ${url.href}: ${err.message}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\nwp-snapshot: ${failed}/${urls.length} FAILED — DO NOT PUBLISH until every page has its backup.`);
  process.exit(1);
}
console.log(`\nwp-snapshot: all ${urls.length} page(s) backed up. Safe to proceed.`);
