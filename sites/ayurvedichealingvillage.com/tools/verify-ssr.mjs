/**
 * Proves the server-rendered body actually reaches a crawler.
 *
 * This is the acceptance test for owner ruling D-20260915-03. It does NOT run a
 * browser: it fetches each route exactly as a non-JavaScript crawler would, then
 * strips scripts, styles and tags and counts the visible words that survive.
 * That is the only number that matters, because it is what Bing and most
 * AI/answer-engine crawlers actually see.
 *
 * Usage:
 *   node tools/verify-ssr.mjs --base http://127.0.0.1:4321 [--limit 20] [--min 600]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const arg = (n, d) => {
  const i = process.argv.indexOf("--" + n);
  return i > -1 ? process.argv[i + 1] : d;
};
const BASE = arg("base", "http://127.0.0.1:4321");
const LIMIT = Number(arg("limit", "0")) || 0;
const MIN = Number(arg("min", "600"));

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routes = JSON.parse(
  fs.readFileSync(path.join(SITE, "english-candidate/route-manifest.json"), "utf8"),
).routes;

/** What a crawler with no JavaScript is left holding. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const run = async () => {
  let list = LIMIT ? routes.slice(0, LIMIT) : routes;
  const rows = [];
  let below = 0;
  let failed = 0;

  for (const route of list) {
    try {
      const res = await fetch(BASE + route.path, { redirect: "follow" });
      const html = await res.text();
      const text = visibleText(html);
      const hasH1 = /<h1[\s>]/i.test(html);
      const row = { path: route.path, status: res.status, chars: text.length, hasH1 };
      if (res.status !== 200) failed++;
      else if (text.length < MIN) {
        below++;
        row.below = true;
      }
      rows.push(row);
    } catch (e) {
      failed++;
      rows.push({ path: route.path, error: String(e).slice(0, 100) });
    }
  }

  const ok = rows.filter((r) => r.chars !== undefined);
  const chars = ok.map((r) => r.chars).sort((a, b) => a - b);
  const median = chars.length ? chars[Math.floor(chars.length / 2)] : 0;
  const min = chars.length ? chars[0] : 0;
  const max = chars.length ? chars[chars.length - 1] : 0;
  const noH1 = ok.filter((r) => !r.hasH1).length;

  console.log(`routes checked      : ${rows.length}`);
  console.log(`non-200 / errored   : ${failed}`);
  console.log(`visible text (chars): min ${min} · median ${median} · max ${max}`);
  console.log(`below ${MIN} chars     : ${below}`);
  console.log(`no <h1> in raw HTML : ${noH1}`);

  const worst = rows
    .filter((r) => r.below || r.error || (r.status && r.status !== 200))
    .slice(0, 15);
  if (worst.length) {
    console.log("\nneeds attention:");
    for (const r of worst) {
      console.log(`  ${r.path} -> ${r.error || `${r.status}, ${r.chars} chars`}`);
    }
  }

  fs.writeFileSync(
    path.join(SITE, "english-candidate/ssr-verification.json"),
    JSON.stringify(
      { generated: new Date().toISOString(), base: BASE, min: MIN, summary: { checked: rows.length, failed, below, median, min, max, noH1 }, routes: rows },
      null,
      1,
    ),
  );
  if (failed || below) process.exitCode = 1;
};

run();
