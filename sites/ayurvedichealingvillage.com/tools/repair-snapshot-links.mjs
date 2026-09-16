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

/**
 * A source link that kept the production origin. boot.ts rewrites these to a path at
 * runtime (localizeLink), so a visitor never noticed -- but the server response shipped
 * them absolute, which sends a crawler straight off the staging deployment to the live
 * WordPress site. Measured before this pass: 230 absolute hrefs across 8 snapshots, 226
 * of them on /sitemap alone, which is why a non-JS crawl reached only 180 of 252 pages.
 * bookings.* is a genuinely different host and is deliberately NOT matched.
 */
const ABSOLUTE_SELF = /(?:href|src)="https?:\/\/(?:www\.)?ayurvedichealingvillage\.com(\/[^"]*)?"/g;

/**
 * One source link was built by concatenating a base onto a tel: URI, producing
 * href="https://ayurvedichealingvillage.comtel:+91-9555-156-156" -- a link that goes
 * nowhere. Two snapshots carry it. The phone number is the design's own; only the
 * broken prefix is removed.
 */
const MALFORMED_SCHEME = /(?:href|src)="https?:\/\/(?:www\.)?ayurvedichealingvillage\.com((?:tel|mailto):[^"]*)"/g;

/**
 * Source links that kept an http:// origin. Every host below was checked to serve
 * https with a 200 on 2026-09-16 before being listed, so the upgrade cannot invent a
 * destination. An http link is not a 404, but it costs a redirect hop and is the kind
 * of insecure outbound reference an audit flags. Only these verified hosts are touched;
 * an unlisted http host is left exactly as the design wrote it.
 */
const HTTPS_VERIFIED = [
  "www.whyayurveda.org", "whyayurveda.org", "www.lakshyayoga.com",
  "www.healing.recipes", "ayurvedsutra.com", "www.ktahv.com", "ayurvedafranchise.com",
];
const INSECURE = new RegExp(
  '(href|src)="http://(' + HTTPS_VERIFIED.map((h) => h.replace(/\./g, "\\.")).join("|") + ')(/[^"]*)?"',
  "g",
);

/** Locked fact (CLAUDE.md LOCKED FACTS): the public contact address. */
const PUBLIC_EMAIL = "info@kairali.com";
const CF_EMAIL = /href="\/cdn-cgi\/l\/email-protection[^"]*"/g;

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
let changedFiles = 0;
let changedLinks = 0;
let emailLinks = 0;
let absoluteLinks = 0;
let malformedLinks = 0;
let insecureLinks = 0;
const perAlias = {};

for (const file of files) {
  const full = path.join(DIR, file);
  const before = fs.readFileSync(full, "utf8");
  // Order matters: repair the malformed scheme first, then collapse absolute self-links
  // to paths, then map legacy spellings -- so an absolute URL to a renamed page gets both.
  let after = before.replace(MALFORMED_SCHEME, (_w, uri) => {
    malformedLinks++;
    return `href="${uri}"`;
  });
  after = after.replace(ABSOLUTE_SELF, (whole, p) => {
    absoluteLinks++;
    const attr = whole.startsWith("src") ? "src" : "href";
    return `${attr}="${p || "/"}"`;
  });
  after = after.replace(INSECURE, (_w, attr, host, rest) => {
    insecureLinks++;
    return `${attr}="https://${host}${rest || "/"}"`;
  });
  after = after.replace(CF_EMAIL, () => {
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
console.log(`absolute -> relative : ${absoluteLinks}`);
console.log(`malformed URLs fixed: ${malformedLinks}`);
console.log(`http -> https       : ${insecureLinks}`);
console.log(`legacy hrefs fixed  : ${changedLinks}`);
console.log(`cf email links fixed: ${emailLinks} -> mailto:${PUBLIC_EMAIL}`);
for (const [from, n] of Object.entries(perAlias).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}x  ${from}  ->  ${rewriteHref(from)}`);
}
