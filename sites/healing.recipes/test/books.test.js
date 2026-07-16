// healing.recipes data-integrity gate. Pins the site to the VERIFIED book
// record (docs/site-briefs/healing-recipes-books.md) so a later edit cannot
// drift a locked fact silently — the same "computed, not typed" spirit as
// reviewCoverage(): the copy physically cannot overstate the record.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..");
const data = JSON.parse(readFileSync(join(site, "content/books.json"), "utf8"));
const redirects = JSON.parse(
  readFileSync(join(site, "content/redirects.json"), "utf8"),
).redirects;

// The four ISBNs are locked facts — two-source verified in the brief.
const VERIFIED_ISBNS = new Set([
  "9788174360960", // Ayurvedic Herbal Massage (2000)
  "9788194206842", // The Ayurvedic Cookbook, 2nd ed. (2019)
  "9789392130755", // The Ayurvedic Wellness Cookbook (2022)
  "9789349474826", // Harmony (2026)
]);

// Buy links may point only at retailers the brief verified to resolve.
const VERIFIED_RETAIL_HOSTS = new Set([
  "rolibooks.com",
  "www.amazon.in",
  "www.amazon.com",
  "www.kairaliproducts.com",
  "www.simonandschuster.com",
  "www.accartbooks.com",
  "www.sapnaonline.com",
  "www.target.com",
  "bookshop.org",
]);

test("exactly the four verified books, ISBNs match the brief", () => {
  assert.equal(data.books.length, 4);
  const isbns = data.books.map((b) => b.isbn13);
  assert.deepEqual(new Set(isbns), VERIFIED_ISBNS);
  assert.equal(new Set(data.books.map((b) => b.slug)).size, 4);
});

test("no price appears anywhere in the book record (staleness guard)", () => {
  const raw = readFileSync(join(site, "content/books.json"), "utf8");
  assert.doesNotMatch(raw, /"price"|₹|\$\d/i);
});

test("the award sits ONLY on the book that won it", () => {
  for (const b of data.books) {
    if (b.slug === "the-ayurvedic-wellness-cookbook") {
      assert.match(b.award, /Gourmand World Cookbook Award 2023/);
    } else {
      assert.equal(b.award, undefined, `${b.slug} must not claim the award`);
    }
  }
});

test("every buy link is https and points at a brief-verified retailer", () => {
  for (const b of data.books) {
    assert.ok(b.buy.length >= 2, `${b.slug} needs at least two buy links`);
    for (const o of b.buy) {
      const u = new URL(o.url);
      assert.equal(u.protocol, "https:");
      assert.ok(
        VERIFIED_RETAIL_HOSTS.has(u.hostname),
        `${u.hostname} is not a verified retailer`,
      );
    }
  }
});

test("every cover file exists with real dimensions", () => {
  for (const b of data.books) {
    assert.ok(
      existsSync(join(site, "public", b.cover.replace(/^\//, ""))),
      `missing cover ${b.cover}`,
    );
    assert.ok(b.coverWidth > 300 && b.coverHeight > 300);
    assert.ok(b.coverAlt.includes(b.title), `alt must name the book`);
  }
});

test("the author is never styled 'Dr.' (roster law: no published credential)", () => {
  const raw = readFileSync(join(site, "content/books.json"), "utf8");
  assert.doesNotMatch(raw, /Dr\.?\s+Gita/i);
  // Endorsement quotes may cite other people's real credentials; only the
  // author herself is guarded here.
  assert.equal(data.author.name, "Gita Ramesh");
});

test("protection map covers every legacy URL, single-hop", () => {
  const inventory = readFileSync(
    join(site, "../../content-mined/healing.recipes/url-inventory.csv"),
    "utf8",
  );
  const legacyPaths = [...inventory.matchAll(/healing\.recipes(\/[a-z0-9-]+\.aspx)/gi)]
    .map((m) => m[1].toLowerCase());
  const sources = new Set(redirects.map((r) => r.source));
  for (const p of new Set(legacyPaths)) {
    assert.ok(sources.has(p), `legacy URL ${p} has no redirect fate`);
  }
  // single-hop: no destination is itself a redirect source
  for (const r of redirects) {
    assert.ok(!sources.has(r.destination), `${r.source} chains via ${r.destination}`);
  }
});

test("launch band stays a placeholder — no invented event specifics", () => {
  const home = readFileSync(join(site, "app/page.tsx"), "utf8");
  assert.match(home, /will be announced/);
  // No day-precision date or venue may appear until Abilash supplies details
  // (ruling 16 Jul 2026): "July 2026" is the only permitted specificity.
  const launchBand = home.slice(home.indexOf("band-launch"));
  assert.doesNotMatch(launchBand, /\b\d{1,2}\s+July|July\s+\d{1,2}\b/);
});
