#!/usr/bin/env node
// lp-contrast — worst-case contrast of every text node painted over a photo on /lp-v2/<slug>/{a,b,c,d}.
//
//   node tools/lp-contrast.mjs --base http://localhost:3400 [--slug panchakarma] [--variants A,B,C,D]
//        [--widths 320,360,390,768,1024,1440,1920] [--white] [--json out.json]
//
// For each variant × width it finds every element with its own text whose box overlaps a photo (<img>, not an
// SVG/logo) that the browser actually paints beneath it (elementsFromPoint). For each one it hides the glyphs
// only (color: transparent — backgrounds, scrims and panels stay), screenshots the text box, and takes the
// lightest 5% of background pixels (darkest 5% for dark text). Contrast = text colour (alpha composited) on that
// pixel. Targets: 4.5:1, or 3:1 for large text (>= 24px, or >= 18.66px bold). text-shadow never counts.
//
// It also fails any overlay text that has no `.lp-scrim` / `.lp-panel` ancestor: the backing must be declared,
// not left to the photo (authoring guide §6, "Text over photos").
//
// --white replaces every photo with a pure white image, which is the case the scrim must survive: the next
// campaign's photo can be anything. Exit code 1 when any row fails. Never submits a form (/api/lead is stubbed).
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");

const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : dflt;
};
const BASE = arg("base", "http://localhost:3400").replace(/\/$/, "");
const SLUG = arg("slug", "panchakarma");
const VARIANTS = arg("variants", "A,B,C,D").split(",");
const WIDTHS = arg("widths", "320,360,390,768,1024,1440,1920").split(",").map(Number);
const WHITE = process.argv.includes("--white");
const JSON_OUT = arg("json", "");

const PHOTO_URL = /\.(jpe?g|png|webp|avif)(\?|$|&)/i;
const isPhotoRequest = (url) => {
  const u = decodeURIComponent(url);
  if (/logo|award|Travelers-Choice|\.svg/i.test(u)) return false;
  return (u.includes("/_next/image") && PHOTO_URL.test(u)) || (/\/lp-v2\/img\//.test(u) && PHOTO_URL.test(u));
};

function lum([r, g, b]) {
  const c = [r, g, b].map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const over = (fg, a, bg) => fg.map((v, i) => v * a + bg[i] * (1 - a));

async function measure(page, png, fg) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += info.channels) px.push([data[i], data[i + 1], data[i + 2]]);
  px.sort((p, q) => lum(p) - lum(q));
  const median = px[Math.floor(px.length / 2)];
  const light = lum(fg.rgb) > lum(median);
  // Worst case: for light text the lightest 5% of the background, for dark text the darkest 5%.
  const worst = light ? px[Math.min(px.length - 1, Math.floor(px.length * 0.95))] : px[Math.floor(px.length * 0.05)];
  return { ratio: ratio(over(fg.rgb, fg.a, worst), worst), worst };
}

const FIND = () => {
  const photos = [...document.querySelectorAll("img")].filter((im) => {
    const src = im.currentSrc || im.src || "";
    const r = im.getBoundingClientRect();
    return !/\.svg/i.test(src) && r.width >= 80 && r.height >= 60 && !im.closest(".lp-proof, .lp-header__home, dialog");
  }).map((im) => {
    const r = im.getBoundingClientRect();
    return { el: im, x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
  });
  const out = [];
  let n = 0;
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest(".lp-bar, dialog, [data-consent-banner], .lp-ask__fab, script, style, noscript")) continue;
    if (![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility !== "visible" || cs.display === "none") continue;
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = range.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const box = { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
    const hit = photos.some((p) => box.x < p.x + p.w && box.x + box.w > p.x && box.y < p.y + p.h && box.y + box.h > p.y);
    if (!hit) continue;
    el.setAttribute("data-lpc", String(n++));
    out.push(el.getAttribute("data-lpc"));
  }
  return out;
};

const INSPECT = (id) => {
  const el = document.querySelector(`[data-lpc="${id}"]`);
  el.scrollIntoView({ block: "center", inline: "nearest" });
  const range = document.createRange();
  range.selectNodeContents(el);
  const r = range.getBoundingClientRect();
  // Confirm the photo is painted beneath the text (not just overlapping in layout).
  const pts = [[0.5, 0.5], [0.15, 0.3], [0.85, 0.3], [0.15, 0.7], [0.85, 0.7]];
  let under = false;
  for (const [fx, fy] of pts) {
    const x = r.left + r.width * fx, y = r.top + r.height * fy;
    if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
    const stack = document.elementsFromPoint(x, y);
    const i = stack.findIndex((s) => s === el || el.contains(s));
    const j = stack.findIndex((s) => s.tagName === "IMG" && !/\.svg/i.test(s.currentSrc || s.src) && !s.closest(".lp-proof, .lp-header__home"));
    if (i > -1 && j > i) { under = true; break; }
  }
  const cs = getComputedStyle(el);
  const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10) || 400;
  const owner = el.closest('[class*="lp-"]');
  const cls = (owner?.className && typeof owner.className === "string" ? owner.className.split(/\s+/).find((c) => c.startsWith("lp-")) : el.tagName.toLowerCase()) || el.tagName.toLowerCase();
  return {
    under,
    label: `${cls} "${el.textContent.trim().replace(/\s+/g, " ").slice(0, 28)}"`,
    color: cs.color,
    large: size >= 24 || (size >= 18.66 && weight >= 700),
    backed: !!el.closest(".lp-scrim, .lp-panel"),
    clip: { x: Math.max(0, r.left), y: Math.max(0, r.top), width: Math.min(r.width, innerWidth - Math.max(0, r.left)), height: Math.min(r.height, innerHeight - Math.max(0, r.top)) },
  };
};

function parseColor(s) {
  let m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3), a: p[3] ?? 1 };
  }
  m = s.match(/color\(srgb ([^)]+)\)/);
  if (m) {
    const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3).map((v) => v * 255), a: p[3] ?? 1 };
  }
  throw new Error(`colour ${s}`);
}

const white = await sharp({ create: { width: 1600, height: 1200, channels: 3, background: "#ffffff" } }).jpeg().toBuffer();
const browser = await chromium.launch();
const rows = [];
for (const v of VARIANTS) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.route("**/api/lead**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
    if (WHITE) await page.route("**/*", (r) => (isPhotoRequest(r.request().url()) ? r.fulfill({ status: 200, contentType: "image/jpeg", body: white }) : r.continue()));
    await page.goto(`${BASE}/lp-v2/${SLUG}/${v.toLowerCase()}/`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "[data-lpc-hide],[data-lpc-hide] *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}*{transition:none!important;animation:none!important;content-visibility:visible!important}" });
    // Load every lazy photo so the real-photo pass samples real pixels.
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((im) => { im.loading = "eager"; });
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      await Promise.all([...document.images].map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; }))));
      scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    const ids = await page.evaluate(FIND);
    for (const id of ids) {
      const info = await page.evaluate(INSPECT, id);
      if (!info.under || info.clip.width < 2 || info.clip.height < 2) continue;
      const fg = parseColor(info.color);
      await page.evaluate((i) => document.querySelector(`[data-lpc="${i}"]`).setAttribute("data-lpc-hide", ""), id);
      const png = await page.screenshot({ clip: info.clip });
      await page.evaluate((i) => document.querySelector(`[data-lpc="${i}"]`).removeAttribute("data-lpc-hide"), id);
      const { ratio: r } = await measure(page, png, fg);
      const need = info.large ? 3 : 4.5;
      rows.push({ variant: v, width: w, element: info.label, ratio: Math.round(r * 100) / 100, need, backed: info.backed, pass: r >= need && info.backed });
    }
    await ctx.close();
  }
}
await browser.close();

const pad = (s, n) => String(s).padEnd(n);
console.log(`\nlp-contrast ${SLUG}${WHITE ? " (white-photo test)" : ""}`);
console.log(`${pad("var", 4)}${pad("width", 7)}${pad("element", 58)}${pad("ratio", 8)}${pad("need", 6)}${pad("backed", 8)}`);
for (const r of rows) console.log(`${pad(r.variant, 4)}${pad(r.width, 7)}${pad(r.element, 58)}${pad(r.ratio.toFixed(2), 8)}${pad(r.need, 6)}${pad(r.backed ? "yes" : "NO", 8)}${r.pass ? "" : "✖"}`);
const bad = rows.filter((r) => !r.pass);
console.log(`\n${rows.length} text-over-photo nodes, ${bad.length} failing`);
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(rows, null, 2));
process.exit(bad.length ? 1 : 0);
