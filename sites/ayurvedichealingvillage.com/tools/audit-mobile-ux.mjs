/**
 * AHV English candidate — deterministic mobile-first UI/UX defect sweep.
 *
 * One representative route per design family (68 families cover all 252
 * routes), at phone and desktop width. Reports only machine-checkable facts:
 * horizontal overflow, broken/zero-size images, page and console errors,
 * failed network responses, sub-minimum tap targets, sub-12px body text,
 * heading structure, and form labelling. Judgement calls are NOT made here.
 *
 * Screenshots are written outside the repo (binaries stay out of git); the
 * findings JSON is the committed evidence.
 *
 * Usage: node tools/audit-mobile-ux.mjs --base http://127.0.0.1:4321 \
 *          --out <findings.json> --shots <dir> [--only <family>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Playwright is a workspace-root dev dependency, not a dependency of this
// site package, and ESM resolution does not walk up the way require() does.
// Resolve it explicitly so the tool runs from the site directory unchanged.
const require_ = createRequire(import.meta.url);
const loadPlaywright = () => {
  try { return require_('playwright'); } catch { /* not a direct dependency here */ }
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let up = 0; up < 6; up++) {
    const nm = path.join(dir, 'node_modules');
    if (fs.existsSync(nm)) {
      const direct = path.join(nm, 'playwright', 'index.js');
      if (fs.existsSync(direct)) return require_(direct);
      const store = path.join(nm, '.pnpm');
      if (fs.existsSync(store)) {
        const hit = fs.readdirSync(store).find((d) => d.startsWith('playwright@'));
        if (hit) {
          const p2 = path.join(store, hit, 'node_modules', 'playwright', 'index.js');
          if (fs.existsSync(p2)) return require_(p2);
        }
      }
    }
    dir = path.dirname(dir);
  }
  throw new Error('playwright not resolvable from ' + import.meta.url);
};
const { chromium } = loadPlaywright();

const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i > -1 ? process.argv[i + 1] : d;
};
const BASE = arg('base', 'http://127.0.0.1:4321');
const OUT = arg('out', 'audit-findings.json');
const SHOTS = arg('shots', '/tmp/ahv-shots');
const ONLY = arg('only', null);

const WIDTHS = [
  { name: 'phone', width: 390, height: 844, mobile: true },
  { name: 'desktop', width: 1280, height: 900, mobile: false },
];

const manifest = JSON.parse(
  fs.readFileSync(new URL('../english-candidate/route-manifest.json', import.meta.url))
).routes;

// One representative route per (mobileView, desktopView) family, plus the
// family's full route list so a finding can be scaled to everything it hits.
const families = new Map();
for (const r of manifest) {
  const key = `${r.mobileView}|${r.desktopView}`;
  if (!families.has(key)) {
    families.set(key, { key, mobileView: r.mobileView, desktopView: r.desktopView, rep: r.path, routes: [] });
  }
  families.get(key).routes.push(r.path);
}

/** Runs in the page. Pure observation — never mutates layout. */
const COLLECT = () => {
  const vw = window.innerWidth;
  const out = { overflow: [], images: [], tapTargets: [], smallText: [], headings: [], forms: [] };

  const rect = (el) => el.getBoundingClientRect();
  const label = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '';
    return el.tagName.toLowerCase() + id + cls;
  };

  // Horizontal overflow: the page itself, then the elements responsible.
  out.docScrollWidth = document.documentElement.scrollWidth;
  out.viewportWidth = vw;
  if (document.documentElement.scrollWidth > vw + 1) {
    for (const el of document.querySelectorAll('body *')) {
      const r = rect(el);
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed') continue;
        out.overflow.push({ el: label(el), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
        if (out.overflow.length >= 12) break;
      }
    }
  }

  // Images: broken, zero-rendered, or unlabelled.
  for (const img of document.querySelectorAll('img')) {
    const r = rect(img);
    const src = (img.currentSrc || img.src || '').slice(-90);
    const broken = img.complete && img.naturalWidth === 0;
    const zero = r.width < 2 || r.height < 2;
    const noAlt = !img.hasAttribute('alt');
    if (broken || (zero && !zero0(img)) || noAlt) {
      out.images.push({ src, broken, zeroSize: zero, missingAlt: noAlt, w: Math.round(r.width), h: Math.round(r.height) });
    }
    if (out.images.length >= 40) break;
  }
  function zero0(img) { // a lazy image far below the fold may legitimately be unsized
    const r = rect(img);
    return r.top > window.innerHeight * 3;
  }

  // Tap targets below the 44x44 CSS-px accessibility minimum.
  const seen = new Set();
  for (const el of document.querySelectorAll('a[href],button,input,select,textarea,[role="button"],[onclick]')) {
    const r = rect(el);
    if (r.width === 0 || r.height === 0) continue;
    if (r.bottom < 0 || r.top > document.documentElement.scrollHeight) continue;
    if (r.width < 44 || r.height < 44) {
      const txt = (el.textContent || '').trim().slice(0, 40);
      const k = label(el) + '|' + txt + '|' + Math.round(r.width) + 'x' + Math.round(r.height);
      if (seen.has(k)) continue;
      seen.add(k);
      out.tapTargets.push({ el: label(el), text: txt, w: Math.round(r.width), h: Math.round(r.height), href: el.getAttribute?.('href') || undefined });
      if (out.tapTargets.length >= 30) break;
    }
  }

  // Body copy rendered below 12px.
  const tseen = new Set();
  for (const el of document.querySelectorAll('p,li,td,span,div,a,dd,dt')) {
    if (!el.firstChild || el.firstChild.nodeType !== 3) continue;
    const t = el.textContent.trim();
    if (t.length < 25) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs && fs < 12) {
      const k = Math.round(fs) + '|' + t.slice(0, 30);
      if (tseen.has(k)) continue;
      tseen.add(k);
      out.smallText.push({ px: +fs.toFixed(1), text: t.slice(0, 60) });
      if (out.smallText.length >= 15) break;
    }
  }

  // Heading outline.
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter((h) => h.offsetParent !== null || getComputedStyle(h).position === 'fixed')
    .map((h) => ({ lvl: +h.tagName[1], text: h.textContent.trim().slice(0, 70) }));
  out.headings = hs.slice(0, 40);
  out.h1Count = hs.filter((h) => h.lvl === 1).length;
  let prev = 0, skips = [];
  for (const h of hs) { if (prev && h.lvl > prev + 1) skips.push(`h${prev}->h${h.lvl}: ${h.text}`); prev = h.lvl; }
  out.headingSkips = skips.slice(0, 8);

  // Form controls without an accessible name.
  for (const f of document.querySelectorAll('input,select,textarea')) {
    const type = (f.getAttribute('type') || f.tagName).toLowerCase();
    if (['hidden', 'submit', 'button'].includes(type)) continue;
    const named = !!(f.labels?.length || f.getAttribute('aria-label') || f.getAttribute('aria-labelledby') || f.getAttribute('placeholder'));
    if (!named) out.forms.push({ el: label(f), type, name: f.getAttribute('name') || undefined });
    if (out.forms.length >= 12) break;
  }

  out.title = document.title;
  out.metaDesc = document.querySelector('meta[name="description"]')?.content?.slice(0, 160) || null;
  out.canonical = document.querySelector('link[rel="canonical"]')?.href || null;
  out.robots = document.querySelector('meta[name="robots"]')?.content || null;
  out.bodyChars = (document.body.innerText || '').trim().length;
  return out;
};

const run = async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const list = [...families.values()].filter((f) => !ONLY || f.key.includes(ONLY));
  const results = [];
  let n = 0;

  for (const fam of list) {
    n++;
    const entry = { family: fam.key, representative: fam.rep, routeCount: fam.routes.length, routes: fam.routes.slice(0, 8), widths: {} };
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width: w.width, height: w.height },
        hasTouch: w.mobile, isMobile: w.mobile, deviceScaleFactor: w.mobile ? 2 : 1,
      });
      const page = await ctx.newPage();
      const errors = [], bad = [];
      page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
      page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 160)); });
      page.on('response', (r) => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url().slice(-100)); });
      try {
        await page.goto(BASE + fam.rep, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForTimeout(2600);
        const data = await page.evaluate(COLLECT);
        // The screenshot is EVIDENCE, never a gate: fullPage on these very tall
        // pages exceeds the 30s default and would otherwise throw away the whole
        // width's findings through the catch below (it silently lost 67 of 68
        // desktop results on the first run). Captured separately, viewport-only,
        // and a failure is recorded rather than fatal.
        const shot = path.join(SHOTS, `${fam.mobileView.replace(/[^a-z0-9-]/gi, '_')}__${w.name}.png`);
        let shotErr = null;
        try {
          await page.screenshot({ path: shot, fullPage: false, timeout: 20000 });
        } catch (e) { shotErr = String(e).slice(0, 80); }
        entry.widths[w.name] = { ...data, errors: [...new Set(errors)].slice(0, 6), failedResponses: [...new Set(bad)].slice(0, 6), screenshot: shotErr ? null : shot, screenshotError: shotErr };
      } catch (e) {
        entry.widths[w.name] = { fatal: String(e).slice(0, 200) };
      }
      await ctx.close();
    }
    results.push(entry);
    fs.writeFileSync(OUT, JSON.stringify({ base: BASE, generated: new Date().toISOString(), familyCount: list.length, done: n, results }, null, 1));
    const p = entry.widths.phone || {};
    console.log(`[${n}/${list.length}] ${fam.rep}  (${fam.routes.length} routes)  overflow=${(p.overflow || []).length} imgs=${(p.images || []).length} tap=${(p.tapTargets || []).length} err=${(p.errors || []).length} 4xx=${(p.failedResponses || []).length}`);
  }
  await browser.close();
  console.log('WROTE ' + OUT);
};
run();
