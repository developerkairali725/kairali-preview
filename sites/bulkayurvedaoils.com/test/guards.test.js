// bulkayurvedaoils.com integrity guards — pins the owned-claims rules this
// golden page shipped under (D-BULK-B2B lane, 18 Jul 2026):
//   · cert strip = the CITED-OWNED claims only (WHO-GMP / ISO / FSSAI) with the
//     "(as published" qualifier — never expanded to FDA/GLP/CE scopes this desk
//     cannot evidence, never numbered;
//   · "95% Testified" is RETIRED (niche brief §7 ask #5) — must never appear;
//   · no cart/checkout surface, ever (Factory rule; the conversion is the RFQ);
//   · the interim WhatsApp number stays the locked +91 92898 38797 until the
//     B2B desk number lands (flagged swap, niche brief §7 ask #3).
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

test("cert strip carries ONLY the cited-owned claims, qualified", () => {
  assert.match(page, /WHO-GMP · ISO · FSSAI/, "the cited-owned strip renders");
  assert.match(page, /\(as published/, "the as-published qualifier travels with the strip");
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

test("no cart/checkout surface ever (RFQ is the only conversion)", () => {
  for (const [name, src] of files) {
    // concrete cart artifacts only — prose saying "no cart" is the register, not a violation
    assert.ok(!/(href|action)\s*=\s*["'][^"']*(\/cart|checkout)/i.test(src), `${name} links a cart/checkout surface: the Factory rule is quote-only`);
    assert.ok(!/add[ -_]?to[ -_]?cart/i.test(src), `${name} carries an add-to-cart control`);
  }
});

test("WhatsApp CTAs use the locked interim number only", () => {
  const wa = page.match(/wa\.me\/(\d+)/g) ?? [];
  const chrome = readFileSync(join(site, "app/_components/chrome.tsx"), "utf8");
  const all = [...wa, ...(chrome.match(/wa\.me\/(\d+)/g) ?? [])];
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
