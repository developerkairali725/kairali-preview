// AHV-I04.M072.links (Train G integration, 15 Oct 2026). On /yoga-retreats-for-everyone/ the first "Explore related
// resources" link was labelled "Yoga programmes" (the hub's name) but led, through the 301 /yoga-retreats/, to the single
// personalised programme /yoga-therapy-individual/ — in every locale, while the localized pages already link the yoga
// programmes hub /xx/yoga-meditation-programs/ (train-g/proof/AHV-I04.M072.links.json and proof/REVIEW.json). The link
// keeps its destination (now its final URL, no redirect hop) and is labelled with the destination's own approved catalogue
// name, which has an accepted translation in all 12 locales; no second hub link is added.
// Source checks only: no build, browser, network or form submission.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { unitId } from "../tools/l10n/lib.mjs";
import { LOCALES } from "../tools/l10n/locales.mjs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
const ROUTE = "/yoga-retreats-for-everyone/";
const DEST = "/yoga-therapy-individual/";
const HUB = "/yoga-meditation-programs/";
const LABEL = "Vaiyaktika Yoga Sādhanā — Personalized Yoga";
const LOCS = Object.keys(LOCALES).filter((l) => l !== "en");

function sevenInfoRoute(path) {
  const ctx = vm.createContext({ window: {} });
  vm.runInContext(read("public/ahv/assets/seven-informational-data.js"), ctx);
  return JSON.parse(JSON.stringify(ctx.window.AHV_SEVEN_INFO.routes.find((r) => r.path === path)));
}
const anchors = (blocks) => {
  const out = [];
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== "object") return;
    if (n.k === "e" && n.tag === "a") out.push([n.attrs.href, (n.c || []).map((c) => c.v).join("")]);
    for (const v of Object.values(n)) if (v && typeof v === "object") walk(v);
  };
  walk(blocks);
  return out;
};

// The accepted catalogue the l10n build reads (tools/l10n/build.mjs catalog()), as in train-g-rework-20261015.test.mjs.
const SRC = new Map(json("l10n/source/units.json").units.map((u) => [u.id, u]));
function catalog(loc) {
  const cat = new Map();
  const pre = new URL(`../l10n/prefill/${loc}.json`, import.meta.url);
  if (fs.existsSync(pre)) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(pre, "utf8")))) cat.set(id, v.text);
  const dir = new URL(`../l10n/output/${loc}/`, import.meta.url);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    for (const u of JSON.parse(fs.readFileSync(new URL(f, dir), "utf8")).units) {
      const src = SRC.get(u.id);
      if (src && src.sourceHash === u.sourceHash && u.status === "translated" && typeof u.text === "string") cat.set(u.id, u.text);
    }
  }
  const ovr = new URL(`../l10n/overrides/${loc}.json`, import.meta.url);
  if (fs.existsSync(ovr)) for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(ovr, "utf8")))) if (SRC.get(id)?.sourceHash === v.sourceHash) cat.set(id, v.text);
  for (const f of ["catalogue-locales.json", "information-locales.json", "release-visible-locales.json"]) {
    for (const u of json(`english-candidate/${f}`).units) if (u.translations[loc]) cat.set(unitId(u.source), u.translations[loc]);
  }
  return cat;
}

test("AHV-I04.M072.links: the personalised-yoga link carries the destination's own name, not the hub's", () => {
  const R = sevenInfoRoute(ROUTE);
  const cr = R.components.filter((c) => c.component === "contextual-resources");
  assert.equal(cr.length, 1);
  assert.deepEqual(anchors(cr[0].blocks), [[DEST, LABEL], ["/yoga-classes-practical/", "Practical yoga classes"], ["/yoga-classes-theory/", "Yoga theory"]]);
  assert.equal(cr[0].blocks[1].items[0].text, LABEL, "the item text matches the link text");
  // the label is the destination's approved catalogue name (search index and the hubs' cards) and its page title
  assert.equal(json("public/ahv/search-index.json").programmes.find((p) => p.route === DEST).name, LABEL);
  assert.equal(json("english-candidate/route-manifest.json").routes.find((r) => r.path === DEST).metadata.title, `${LABEL} | Kairali`);
  // the old target was the 301 to the same page: the destination is unchanged, now without the hop
  assert.equal(json("english-candidate/redirect-map.json").redirects["/yoga-retreats/"].to, DEST);
  assert.equal(json("english-candidate/redirect-map.json").redirects[DEST], undefined, "final URL");
  // nothing on the page still calls a non-hub destination "Yoga programmes", and no duplicate hub link was added
  const all = anchors(R.components);
  assert.ok(!all.some(([href, text]) => text === "Yoga programmes" && href !== HUB));
  assert.equal(all.filter(([href]) => href === HUB).length, 0, "the English data adds no hub link");
  assert.equal(all.filter(([href]) => href === DEST || href === "/yoga-retreats/").length, 1);
});

test("AHV-I04.M072.links: the label has an accepted translation and the destination a route in all 12 locales", () => {
  const routes = json("l10n/routes.json").routes;
  assert.equal(Object.keys(routes[DEST]).length, 13);
  assert.equal(Object.keys(routes[ROUTE]).length, 13);
  for (const loc of LOCS) {
    const t = catalog(loc).get(unitId(LABEL));
    assert.equal(typeof t, "string", `${loc}: accepted translation`);
    assert.ok(t.trim(), `${loc}: non-empty`);
    assert.notEqual(t, catalog(loc).get(unitId("Yoga programmes")), `${loc}: not the hub label`);
    assert.ok(routes[DEST][loc], `${loc}: localized destination`);
  }
});

test("AHV-I04.M072.links: the English server snapshot shows the same label and destination", () => {
  const snap = read("english-candidate/prerender/yoga-retreats-for-everyone.html");
  const i = snap.indexOf(">Explore related resources</h2>");
  assert.ok(i > 0);
  const list = snap.slice(i, snap.indexOf("</ul>", i));
  const links = [...list.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(links, [[DEST, LABEL], ["/yoga-classes-practical/", "Practical yoga classes"], ["/yoga-classes-theory/", "Yoga theory"]]);
  assert.doesNotMatch(snap, />Yoga programmes</);
});
