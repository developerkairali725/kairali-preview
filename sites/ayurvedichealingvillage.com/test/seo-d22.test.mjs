// SEO-D22 (29 Sep 2026) — structural SEO rules from the D-01..D-22 execution lane. Each test pins a rule that was
// broken in the source and is now fixed, so a later import, generator run or copy plan cannot silently reintroduce it.
// None of these relaxes or replaces an existing test or gate.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { serverCanonical, SITE_ORIGIN } from "../app/(english)/_families/canonical-policy.mjs";
import { foreignPages, viewRoutes } from "../tools/repair-foreign-jsonld-20260929.mjs";

const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const MANIFEST = readJson("english-candidate/route-manifest.json").routes;
const REDIRECTED = new Set(Object.keys(readJson("english-candidate/redirect-map.json").redirects));
const SERVED = MANIFEST.filter((r) => !REDIRECTED.has(r.path));
const view = (id) => readJson(`public/ahv/views/${id}.json`);
const LD = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
const ORG_NAME = "Kairali — The Ayurvedic Healing Village"; // schema.ts ORG_NAME
const sameName = (a) => (a || "").replace(/\s+[–—-]\s+/g, " — ") === ORG_NAME; // en/em dash typography only

function loadDataset(rel) {
  const w = {};
  new Function("window", fs.readFileSync(`public/ahv/${rel}`, "utf8"))(w);
  return w[Object.keys(w)[0]];
}
function recordFor(data, p) {
  const seen = new Set(); let hit = null;
  (function walk(o) {
    if (!o || typeof o !== "object" || seen.has(o) || hit) return; seen.add(o);
    if ((o.path === p || o.route === p) && (o.metadata || o.canonical)) { hit = o; return; }
    for (const v of Object.values(o)) walk(v);
  })(data);
  return hit;
}

test("D-10: every served English route with a manifest canonical emits exactly that canonical server-side", () => {
  const src = fs.readFileSync("app/(english)/_families/metadata.ts", "utf8");
  assert.match(src, /import \{ serverCanonical \} from "\.\/canonical-policy\.mjs"/);
  assert.match(src, /const canonical = serverCanonical\(route\);\s*\n\s*if \(canonical\) meta\.alternates = \{ canonical \};/);
  let n = 0;
  for (const r of SERVED) {
    const c = r.metadata.canonical;
    if (!c) { assert.equal(serverCanonical(r), null, `${r.path}: no canonical may be invented`); continue; }
    assert.ok(c.startsWith(SITE_ORIGIN + "/"), `${r.path}: canonical off the locked origin: ${c}`);
    assert.equal(serverCanonical(r), c, r.path);
    n++;
  }
  assert.ok(n > 200, `expected the served set, checked ${n}`);
  assert.equal(serverCanonical({ metadata: { canonical: "https://example.com/x/" } }), null);
});

test("D-10: the raw-HTML canonical can never disagree with the one the design writes after hydration", () => {
  const bad = []; let literals = 0, records = 0;
  const cache = new Map();
  for (const r of SERVED) {
    const want = r.metadata.canonical;
    if (!want) continue;
    if (!r.dataset) for (const v of [r.desktopView, r.mobileView]) {
      if (!v || !fs.existsSync(`public/ahv/views/${v}.json`)) continue;
      for (const [, href] of view(v).template.matchAll(/<link rel="canonical" href="([^"]*)"/g)) {
        literals++;
        if (href !== want) bad.push(`${r.path} view ${v}: ${href} != ${want}`);
      }
    }
    if (r.dataset) {
      if (!cache.has(r.dataset)) cache.set(r.dataset, loadDataset(r.dataset));
      const rec = recordFor(cache.get(r.dataset), r.path);
      const have = rec && ((rec.metadata && rec.metadata.canonical) || rec.canonical);
      if (have) { records++; if (have !== want) bad.push(`${r.path} dataset ${r.dataset}: ${have} != ${want}`); }
    }
  }
  assert.ok(literals > 100 && records > 100, `too few canonicals compared (views ${literals}, records ${records})`);
  assert.deepEqual(bad, []);
});

test("D-11: no served view ships a design JSON-LD graph describing another page; every block parses", () => {
  const bad = [];
  for (const [v, { routes, canonicals }] of viewRoutes()) {
    if (!fs.existsSync(`public/ahv/views/${v}.json`)) continue;
    for (const [, json] of view(v).template.matchAll(LD)) {
      try { JSON.parse(json); } catch (e) { bad.push(`${v}: unparsable JSON-LD (${e.message})`); continue; }
      const foreign = foreignPages(json, canonicals);
      if (foreign.length) bad.push(`${v} (${routes.join(", ")}) describes ${foreign.join(", ")}`);
    }
  }
  assert.deepEqual(bad, []);
});

test("D-11: every #website / #organization node in the views is the governed entity (one name, never typed Resort)", () => {
  const bad = []; let seen = 0;
  for (const f of fs.readdirSync("public/ahv/views").filter((x) => x.endsWith(".json"))) {
    for (const [, json] of view(f.replace(/\.json$/, "")).template.matchAll(LD)) {
      let g; try { g = JSON.parse(json); } catch { continue; }
      for (const n of Array.isArray(g) ? g : g["@graph"] || [g]) {
        if (!n || typeof n !== "object") continue;
        const types = [].concat(n["@type"] || []);
        if (types.includes("Resort")) bad.push(`${f}: node typed Resort (${n["@id"]})`);
        if (typeof n["@id"] === "string" && /\/#(website|organization)$/.test(n["@id"])) {
          seen++;
          if (!sameName(n.name)) bad.push(`${f}: ${n["@id"]} named ${JSON.stringify(n.name)}`);
        }
      }
    }
  }
  assert.ok(seen > 100, `expected the design graphs, saw ${seen} entity nodes`);
  assert.deepEqual(bad, []);
});

test("D-18: every served route has a real share card (JPEG on disk, under the 300 KB WhatsApp budget)", () => {
  const og = readJson("english-candidate/og-images.json");
  const bad = [];
  for (const r of SERVED) {
    const p = og[r.path];
    if (!p) { bad.push(`${r.path}: no og card`); continue; }
    const f = `public${p}`;
    if (!fs.existsSync(f)) { bad.push(`${r.path}: ${p} missing`); continue; }
    const b = fs.readFileSync(f);
    if (b[0] !== 0xff || b[1] !== 0xd8) bad.push(`${r.path}: ${p} is not a JPEG`);
    if (b.length > 300 * 1024) bad.push(`${r.path}: ${p} is ${Math.round(b.length / 1024)} KB`);
  }
  assert.deepEqual(bad, []);
});

test("D-04: Lighthouse measures the home page, an organic content template and a landing page", () => {
  const urls = readJson("lighthouse-urls.json");
  const served = new Set(SERVED.map((r) => r.path));
  assert.ok(urls.includes("/"), "home template");
  const organic = urls.filter((u) => u !== "/" && !u.startsWith("/lp/"));
  assert.ok(organic.length >= 1, "at least one organic content template");
  for (const u of organic) assert.ok(served.has(u), `${u} is not a served English route`);
  assert.ok(urls.some((u) => u.startsWith("/lp/")), "at least one landing page");
});

test("D-13: the path of every recorded legacy query-string variant resolves (page, redirect or paid rule)", () => {
  const legacy = readJson("l10n/legacy-map.json").entries;
  const rt = readJson("l10n/routes.json");
  const answers = new Set(Object.keys(rt.redirects).map((s) => s.toLowerCase()));
  for (const m of Object.values(rt.routes)) for (const p of Object.values(m)) answers.add(p.toLowerCase());
  for (const r of readJson("english-candidate/ad-sitelink-redirects.json")) answers.add(r.source.replace(/\/?$/, "/").toLowerCase());
  const bad = [];
  for (const e of legacy) for (const v of [e.canonical, ...(e.variants || [])]) {
    if (!v.includes("?")) continue;
    const p = new URL(v, SITE_ORIGIN).pathname.replace(/\/?$/, "/").toLowerCase();
    if (!answers.has(p)) bad.push(`${v} -> ${p}`);
  }
  assert.deepEqual(bad, []);
});

test("D-15: no two served, sitemap-eligible English routes share a title", () => {
  const by = new Map();
  for (const r of SERVED) {
    if (r.sitemapExclude) continue;
    const t = (r.metadata.title || "").trim();
    by.set(t, [...(by.get(t) || []), r.path]);
  }
  assert.deepEqual([...by].filter(([, p]) => p.length > 1), []);
});

test("D-20: structured data is '<'-escaped in the design view and the sightseeing collection is the page entity", () => {
  const dv = fs.readFileSync("app/(english)/_families/design-view.tsx", "utf8");
  assert.match(dv, /__html: jsonForScript\(routeSchema\(route, locale\)\)/);
  assert.doesNotMatch(dv, /__html: JSON\.stringify\(routeSchema\(/);
  const ss = fs.readFileSync("app/(english)/sightseeing/view.tsx", "utf8");
  assert.match(ss, /'@type':'CollectionPage','@id':pageUrl,/);
});
