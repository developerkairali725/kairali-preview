/**
 * Repairs the two classes of broken link inside the prerendered snapshots.
 *
 * WHY THIS EXISTS. boot.ts already corrects these hrefs at runtime, so a
 * visitor with JavaScript never saw the problem. The snapshots changed that:
 * the server response now carries the design's markup, so whatever href is in
 * the snapshot is what a crawler follows and what a no-JS first paint offers.
 * An authenticated crawl of the deployed staging build found 16 internal links
 * resolving to 404 for exactly this reason.
 *
 * ONE SOURCE OF TRUTH. The map is english-candidate/link-aliases.json, the
 * same file boot.ts inlines, so the runtime pass and this pass can never drift.
 *
 * SCOPE. Rewrites the href attribute only. No content, text, image or layout
 * byte is touched, and no URL on the commented legacy -> /lp/ Ads cutover map
 * in next.config.ts is in the alias list: those stay Vikash's decision.
 *
 * THE SECOND CLASS: Cloudflare email obfuscation, inherited from the legacy
 * WordPress site. Twenty <a href="/cdn-cgi/l/email-protection#<hex>"> links
 * survived into the snapshots. They 404 here because this deployment is not
 * behind Cloudflare. boot.ts repairs them for a visitor; the snapshot is what
 * a crawler gets, so it is repaired here too. Owner ruling D-20260915-04
 * normalises every one of these to the locked public address rather than
 * restoring the two typo domains and the link-exchange mailbox the hex
 * decodes to, so the address is written directly and nothing that bounces
 * ships. No address is invented: info@kairali.com is the locked public fact.
 *
 * Usage: node tools/repair-snapshot-links.mjs [--dir english-candidate/prerender]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => {
  const i = process.argv.indexOf("--" + n);
  return i > -1 ? process.argv[i + 1] : d;
};
const DIR = path.resolve(SITE, arg("dir", "english-candidate/prerender"));
const ALIASES = JSON.parse(
  fs.readFileSync(path.join(SITE, "english-candidate/link-aliases.json"), "utf8"),
);

/** Matches the alias key with or without its trailing slash, absolute or not. */
function rewriteHref(raw) {
  let pathname = raw;
  let prefix = "";
  const abs = raw.match(/^(https?:\/\/(?:www\.)?ayurvedichealingvillage\.com)(\/.*)?$/i);
  if (abs) {
    prefix = "";
    pathname = abs[2] || "/";
  } else if (!raw.startsWith("/")) {
    return null;
  }
  const [bare, rest] = [pathname.replace(/[?#].*$/, ""), (pathname.match(/[?#].*$/) || [""])[0]];
  const key = bare.replace(/[/]$/, "");
  const hit = ALIASES[key];
  if (!hit) return null;
  return prefix + hit + rest;
}

/** Locked fact (CLAUDE.md LOCKED FACTS): the public contact address. */
const PUBLIC_EMAIL = "info@kairali.com";
const CF_EMAIL = /href="\/cdn-cgi\/l\/email-protection[^"]*"/g;

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
let changedFiles = 0;
let changedLinks = 0;
let emailLinks = 0;
const perAlias = {};

for (const file of files) {
  const full = path.join(DIR, file);
  const before = fs.readFileSync(full, "utf8");
  let after = before.replace(CF_EMAIL, () => {
    emailLinks++;
    return `href="mailto:${PUBLIC_EMAIL}"`;
  });
  after = after.replace(/href="([^"]*)"/g, (whole, raw) => {
    const next = rewriteHref(raw);
    if (next === null || next === raw) return whole;
    changedLinks++;
    perAlias[raw] = (perAlias[raw] || 0) + 1;
    return `href="${next}"`;
  });
  if (after !== before) {
    fs.writeFileSync(full, after);
    changedFiles++;
  }
}

console.log(`snapshots scanned   : ${files.length}`);
console.log(`snapshots changed   : ${changedFiles}`);
console.log(`legacy hrefs fixed  : ${changedLinks}`);
console.log(`cf email links fixed: ${emailLinks} -> mailto:${PUBLIC_EMAIL}`);
for (const [from, n] of Object.entries(perAlias).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}x  ${from}  ->  ${rewriteHref(from)}`);
}
