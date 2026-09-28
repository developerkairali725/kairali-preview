// EF-04a guard (owner, 26 Sep 2026): the homepage views carry their OWN header/drawer markup, apart from
// the shared chrome component that every other design page imports, and the native pages take theirs
// from the /about-us/ snapshot. The owner saw the long "Yoga–Dhyāna Abhyāsa — …" label on the homepage
// header while the shared header already said "Yoga & Training". This test makes every copy agree —
// labels AND destinations — so a drift fails CI instead of reaching a visitor.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&rarr;|→/g, "").replace(/\s+/g, " ").trim();
const rel = (h) => h.replace(/^https?:\/\/(www\.)?ayurvedichealingvillage\.com/, "");
const links = (html) => [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => [rel(m[1]), strip(m[2]).replace(/^\d{2}\s*/, "")]);
function headerNav(html) {
  const i = html.indexOf("<header");
  const h = html.slice(i, html.indexOf("</header>", i));
  const n = h.match(/<nav[^>]*>([\s\S]*?)<\/nav>/);
  return n ? links(n[1]) : null;
}
function drawerNav(html) {
  // the phone menu: the <nav> that lists Home first
  for (const m of html.matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)) {
    const l = links(m[1]);
    if (l.length >= 6 && l[0][0] === "/") return l;
  }
  return null;
}
const component = fs.readFileSync("public/ahv/components/AHV Chrome Header.dc.html", "utf8");
const view = (v) => JSON.parse(fs.readFileSync(`public/ahv/views/${v}.json`, "utf8")).template;

test("homepage desktop header = shared chrome header (labels + destinations)", () => {
  const shared = headerNav(component);
  assert.ok(shared && shared.length === 5, "shared header has five primary links");
  assert.deepEqual(headerNav(view("home-hi-fi-v4")), shared);
  assert.ok(shared.some(([p, l]) => p === "/yoga-meditation-training/" && l === "Yoga & Training"), "short Yoga & Training label (EF-04a)");
});

test("homepage phone menu = shared chrome phone menu", () => {
  // search is a link on the homepage menu and a dialog button in the shared drawer — same function,
  // different element; the guard compares the page destinations
  const noSearch = (l) => l && l.filter(([p]) => p !== "/search/");
  const shared = noSearch(drawerNav(component));
  assert.ok(shared, "shared drawer menu found");
  assert.deepEqual(noSearch(drawerNav(view("home-mobile"))), shared);
});

test("native-page chrome snapshot = shared chrome header", () => {
  const snap = fs.readFileSync("english-candidate/prerender/about-us.html", "utf8");
  assert.deepEqual(headerNav(snap), headerNav(component));
});

test("homepage footers = shared chrome footer labels for every shared destination", () => {
  // the shared footer may label one destination twice (desktop vs phone) — any of its labels is in sync
  const shared = new Map();
  for (const [p, l] of links(fs.readFileSync("public/ahv/components/AHV Chrome Footer.dc.html", "utf8"))) {
    if (!l) continue;
    if (!shared.has(p)) shared.set(p, new Set());
    shared.get(p).add(l);
  }
  assert.ok(shared.has("/yoga-meditation-training/"), "shared footer links the yoga training page");
  for (const v of ["home-hi-fi-v4", "home-mobile"]) {
    const t = view(v);
    const a = t.lastIndexOf("<footer");
    assert.ok(a > -1, `${v} has a footer`);
    for (const [p, l] of links(t.slice(a, t.indexOf("</footer>", a)))) {
      if (l && shared.has(p)) assert.ok(shared.get(p).has(l), `${v} footer ${p}: "${l}" vs shared ${[...shared.get(p)].join(" / ")}`);
    }
  }
});

test("no header or menu anywhere re-expands the Yoga label with Sanskrit", () => {
  for (const [name, html] of [["component", component], ["home-hi-fi-v4", view("home-hi-fi-v4")], ["home-mobile", view("home-mobile")]]) {
    for (const l of [...(headerNav(html) || []), ...(drawerNav(html) || [])]) assert.ok(!/Dhyāna|Abhyāsa/.test(l[1]), `${name}: ${l[1]}`);
  }
});

// Locales (28 Sep 2026): the same guard over each locale's generated payloads (tools/l10n/build.mjs output,
// git-ignored — the test runs wherever they have been built). The homepage phone menu and the shared chrome are
// separate translation units, so a translator could render the same English label twice, differently
// (DE had "Yoga & Ausbildung" in the menu and "Yoga & Training" in the header).
const LOCALES = JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"));
for (const [loc, info] of Object.entries(LOCALES)) {
  if (loc === "en" || !fs.existsSync(`public/ahv/l10n/${info.prefix}/components/AHV Chrome Header.dc.html`)) continue;
  test(`${loc}: homepage header and phone menu = the locale's shared chrome (labels + destinations)`, () => {
    const base = `public/ahv/l10n/${info.prefix}`;
    const comp = fs.readFileSync(`${base}/components/AHV Chrome Header.dc.html`, "utf8");
    const lview = (v) => JSON.parse(fs.readFileSync(`${base}/views/${v}.json`, "utf8")).template;
    const sharedHeader = headerNav(comp);
    assert.ok(sharedHeader && sharedHeader.length === 5, `${loc}: shared header has five primary links`);
    assert.deepEqual(headerNav(lview("home-hi-fi-v4")), sharedHeader, `${loc} desktop header`);
    // the phone menu = the <nav> that lists this locale's Home first (drawerNav() looks for English "/")
    const home = `/${info.prefix}/`;
    const menu = (html) => { for (const m of html.matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)) { const l = links(m[1]); if (l.length >= 6 && l[0][0] === home) return l; } return null; };
    const noSearch = (l) => l.filter(([p]) => !/\/search\/$/.test(p) && p !== (JSON.parse(fs.readFileSync("l10n/routes.json", "utf8")).routes["/search/"] || {})[loc]);
    const shared = menu(comp), homepage = menu(lview("home-mobile"));
    assert.ok(shared && shared.length >= 6, `${loc}: shared phone menu found`);
    assert.ok(homepage && homepage.length >= 6, `${loc}: homepage phone menu found`);
    assert.deepEqual(noSearch(homepage), noSearch(shared), `${loc} phone menu`);
  });
}
