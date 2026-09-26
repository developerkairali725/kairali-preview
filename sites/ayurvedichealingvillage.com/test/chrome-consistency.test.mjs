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

test("no header or menu anywhere re-expands the Yoga label with Sanskrit", () => {
  for (const [name, html] of [["component", component], ["home-hi-fi-v4", view("home-hi-fi-v4")], ["home-mobile", view("home-mobile")]]) {
    for (const l of [...(headerNav(html) || []), ...(drawerNav(html) || [])]) assert.ok(!/Dhyāna|Abhyāsa/.test(l[1]), `${name}: ${l[1]}`);
  }
});
