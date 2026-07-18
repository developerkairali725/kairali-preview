// bulkayurvedaproducts.com integrity guards — pins the owned-claims rules this
// golden page shipped under (D-BULK-B2B lane, 18 Jul 2026):
//   · the four engagement models LEAD with the owner's canonical published
//     wording (pass-2 Perplexity finding — labels must never drift again);
//   · counters render the published figures WITH their provenance line;
//   · cert strip = cited-owned claims only (WHO-GMP / ISO / FSSAI), qualified;
//   · "95% Testified" is RETIRED — must never appear;
//   · no cart/checkout surface, ever; interim WhatsApp number stays locked.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..");

function sources(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", "test", "public"].includes(name) || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) sources(p, out);
    else if ([".ts", ".tsx", ".css", ".json"].includes(extname(p))) out.push(p);
  }
  return out;
}

const files = sources(site).map((p) => [p.slice(site.length + 1), readFileSync(p, "utf8")]);
const page = readFileSync(join(site, "app/page.tsx"), "utf8");
// Phase-1 full-site refactor: the canonical model wording + counters moved to
// the ONE source module (_components/facts.ts) that page.tsx imports — the
// guard now checks the single source AND that the homepage actually renders
// from it (drift in either place still fails; the invariant is unchanged).
const facts = readFileSync(join(site, "app/_components/facts.ts"), "utf8");
const homeSurface = page + facts;

test("the homepage imports the models/counters from the single facts source", () => {
  assert.match(page, /from "\.\/_components\/facts"/, "page.tsx must render MODELS/COUNTERS from _components/facts.ts — a second copy is drift");
});

test("the four engagement models lead with the canonical published wording", () => {
  for (const wording of [
    "Our products · our packing",
    "Our products · your packing",
    "Your products · your brand · your packing",
    "Your concept · our R&D · your brand",
  ]) {
    assert.ok(homeSurface.includes(wording), `canonical model wording missing: "${wording}"`);
  }
});

test("published counters render with their provenance line", () => {
  for (const n of ["10000+", "1200+", "900+", "111+"]) {
    assert.ok(homeSurface.includes(n), `published counter missing: ${n}`);
  }
  assert.match(homeSurface, /Figures as published by KAPPL/, "the provenance line travels with the counters");
});

test("cert strip carries ONLY the cited-owned claims, qualified", () => {
  assert.match(page, /WHO-GMP.*ISO.*FSSAI/s, "the cited-owned strip renders");
  assert.match(page, /as published by KAPPL/, "the as-published qualifier travels with the strip");
  for (const [name, src] of files) {
    assert.ok(!/\bGLP\b/.test(src), `${name} expands the cert strip with GLP`);
    assert.ok(!/FDA/.test(src), `${name} expands the cert strip with FDA`);
  }
});

test('"95% Testified" is retired — never carried onto this surface', () => {
  for (const [name, src] of files) {
    assert.ok(!/95%\s*Testified/i.test(src), `${name} carries the retired efficacy line`);
  }
});

test("no cart/checkout surface ever (project intake is the only conversion)", () => {
  for (const [name, src] of files) {
    // concrete cart artifacts only — prose saying "no cart" is the register, not a violation
    assert.ok(!/(href|action)\s*=\s*["'][^"']*(\/cart|checkout)/i.test(src), `${name} links a cart/checkout surface: the Factory rule is quote-only`);
    assert.ok(!/add[ -_]?to[ -_]?cart/i.test(src), `${name} carries an add-to-cart control`);
  }
});

test("WhatsApp CTAs use the locked interim number only", () => {
  const chrome = readFileSync(join(site, "app/_components/chrome.tsx"), "utf8");
  const all = [...(page.match(/wa\.me\/(\d+)/g) ?? []), ...(chrome.match(/wa\.me\/(\d+)/g) ?? [])];
  assert.ok(all.length > 0, "a WhatsApp CTA exists");
  for (const link of all) assert.equal(link, "wa.me/919289838797", "interim Priya number (13-Jul ruling) until the B2B desk number lands");
});

test("the numbered step strip renders ONE number per step (owner defect 18 Jul: '1 2 3 appeared twice')", () => {
  const css = readFileSync(join(site, "app/globals.css"), "utf8");
  const stepsRule = css.match(/\.steps\s*\{[^}]*\}/);
  assert.ok(stepsRule, ".steps rule exists");
  assert.match(stepsRule[0], /list-style:\s*none/, ".steps suppresses the OL's default markers — otherwise the browser's 1. 2. 3. renders beside the design counters");
  assert.match(stepsRule[0], /counter-reset:\s*step/, "the design counter remains the one visible numbering");
});
