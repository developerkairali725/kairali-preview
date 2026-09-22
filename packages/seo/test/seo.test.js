import test from "node:test";
import assert from "node:assert/strict";
import {
  LIMITS,
  buildMetadata,
  buildRobots,
  buildSitemap,
  buildLlmsTxt,
  siteUrl,
} from "../src/index.js";

const mono = { domain: "arogyakendra.com", locales: ["en"] };
const multi = { domain: "example.com", locales: ["en", "de", "fr"] };

test("buildMetadata: canonical, OG, robots for a single-locale page", () => {
  const m = buildMetadata(mono, {
    title: "Arogya Kendra — Ayurvedic Care by the Kairali Group",
    description: "Gateway to the Kairali Ayurvedic Group.",
    ogImage: "/og.jpg",
    ogImageAlt: "A factual social preview",
  });
  assert.equal(m.alternates.canonical, "https://arogyakendra.com/");
  assert.equal(m.alternates.languages, undefined, "single-locale sites emit no hreflang");
  assert.equal(m.robots.index, true);
  assert.equal(m.openGraph.url, "https://arogyakendra.com/");
  assert.equal(m.openGraph.images[0].alt, "A factual social preview");
  assert.equal(m.twitter.card, "summary_large_image");
  assert.deepEqual(m.twitter.images, m.openGraph.images);
});

test("buildMetadata never fabricates a social image", () => {
  const m = buildMetadata(mono, { title: "Arogya Kendra", description: "Gateway." });
  assert.equal(m.openGraph.images, undefined);
  assert.equal(m.twitter.images, undefined);
  assert.equal(m.twitter.card, "summary");
});

test("buildMetadata THROWS on over-limit title/description and missing description (A6 gate)", () => {
  assert.throws(
    () => buildMetadata(mono, { title: "x".repeat(LIMITS.title + 1), description: "d" }),
    /title is 61 chars/,
  );
  assert.throws(
    () =>
      buildMetadata(mono, { title: "t", description: "x".repeat(LIMITS.description + 1) }),
    /description is 156 chars/,
  );
  assert.throws(() => buildMetadata(mono, { title: "t" }), /has no description/);
});

test("buildMetadata: multi-locale page emits complete reciprocal hreflang + x-default", () => {
  const m = buildMetadata(multi, {
    title: "T",
    description: "D",
    path: "/consultation",
    locale: "fr",
  });
  assert.equal(m.alternates.canonical, "https://example.com/fr/consultation");
  assert.deepEqual(m.alternates.languages, {
    en: "https://example.com/consultation",
    de: "https://example.com/de/consultation",
    fr: "https://example.com/fr/consultation",
    "x-default": "https://example.com/consultation",
  });
  assert.throws(
    () => buildMetadata(multi, { title: "T", description: "D", locale: "ru" }),
    /not declared/,
  );
});

test("/lp/* is noindex by default, indexable only by explicit override", () => {
  const lp = buildMetadata(mono, { title: "T", description: "D", path: "/lp/panchakarma" });
  assert.equal(lp.robots.index, false);
  const forced = buildMetadata(mono, {
    title: "T",
    description: "D",
    path: "/lp/panchakarma",
    index: true,
  });
  assert.equal(forced.robots.index, true);
});

test("buildRobots: allow-all + sitemap URL", () => {
  const r = buildRobots(mono);
  assert.deepEqual(r.rules, [{ userAgent: "*", allow: "/" }]);
  assert.equal(r.sitemap, "https://arogyakendra.com/sitemap.xml");
});

test("buildSitemap: one entry per locale, /lp excluded, alternates on multi-locale", () => {
  const s = buildSitemap(multi, [
    { path: "/", priority: 1 },
    { path: "/lp/campaign" },
  ]);
  assert.equal(s.length, 3, "3 locales × 1 page; /lp excluded");
  assert.ok(s.every((e) => e.alternates.languages["x-default"]));
  const monoMap = buildSitemap(mono, [{ path: "/" }]);
  assert.equal(monoMap.length, 1);
  assert.equal(monoMap[0].alternates, undefined);
});

test("buildLlmsTxt: llmstxt.org shape; throws without name/summary", () => {
  const txt = buildLlmsTxt(mono, {
    name: "Arogya Kendra",
    summary: "Gateway to the Kairali Ayurvedic Group.",
    facts: ["Contact: info@kairali.com"],
    sections: [
      {
        title: "Sites",
        links: [{ title: "KTAHV", url: "https://www.ayurvedichealingvillage.com", note: "hospital" }],
      },
    ],
  });
  assert.ok(txt.startsWith("# Arogya Kendra\n\n> "));
  assert.ok(txt.includes("- Contact: info@kairali.com"));
  assert.ok(txt.includes("## Sites"));
  assert.ok(txt.includes("[KTAHV](https://www.ayurvedichealingvillage.com): hospital"));
  assert.throws(() => buildLlmsTxt(mono, { name: "X" }), /needs name \+ summary/);
});

test("siteUrl", () => {
  assert.equal(siteUrl(mono), "https://arogyakendra.com");
});

test("buildSitemap: images pass through as absolute URLs; absent when a page lists none; >1000 throws", () => {
  const s = buildSitemap(mono, [
    { path: "/photo-gallery/", images: ["/ahv/assets/img/gallery-2026/photo/a.webp", "https://cdn.example/b.webp"] },
    { path: "/about/" },
  ]);
  assert.deepEqual(s[0].images, [
    "https://arogyakendra.com/ahv/assets/img/gallery-2026/photo/a.webp",
    "https://cdn.example/b.webp",
  ]);
  assert.equal("images" in s[1], false);
  assert.throws(
    () => buildSitemap(mono, [{ path: "/x/", images: Array.from({ length: 1001 }, (_, i) => `/i${i}.webp`) }]),
    /max 1,000/,
  );
});
