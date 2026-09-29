// Snapshot first-paint styles (lane PERF2): the mobile view's helmet styles served with the snapshot.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { helmetStyles, importedComponents, viewFirstPaintStyles, snapshotStylesFor, firstScreenPoster, bodyFontFiles } from "../app/(english)/_families/snapshot-styles.mjs";

test("helmetStyles keeps local font stylesheets and <style> blocks only, in order", () => {
  const t = `<helmet>
<link href="/ahv/fonts/ahv-33eeac48ab44.css" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Mulish" rel="stylesheet">
<link rel="canonical" href="https://ayurvedichealingvillage.com/x/">
<style>
body{font-family:'Mulish',sans-serif;line-height:1.7}
</style>
<title>X</title><meta name="robots" content="noindex">
<script type="application/ld+json">{"a":1}</script>
<style>h1{margin:0}</style>
</helmet><div><style>.not-helmet{}</style></div>`;
  const out = helmetStyles(t);
  assert.deepEqual(out.fonts, ["/ahv/fonts/ahv-33eeac48ab44.css"]);
  assert.deepEqual(out.styles, ["body{font-family:'Mulish',sans-serif;line-height:1.7}", "h1{margin:0}"]);
  assert.deepEqual(helmetStyles("<div>no helmet</div>"), { fonts: [], styles: [] });
  // locale font copies are local too; anything else is not
  assert.deepEqual(helmetStyles('<helmet><link rel="stylesheet" href="/ahv/l10n/de/fonts/a.css"><link rel="stylesheet" href="/ahv/../x.css"></helmet>').fonts, ["/ahv/l10n/de/fonts/a.css"]);
});

test("viewFirstPaintStyles: view helmet first, then each imported component's, in import order", () => {
  const view = '<helmet><style>body{font-size:18px}</style></helmet><dc-import name="AHV Chrome Header" narrow="true"></dc-import><dc-import name="AHV Chrome Footer"></dc-import><dc-import name="AHV Chrome Header"></dc-import>';
  assert.deepEqual(importedComponents(view), ["AHV Chrome Header", "AHV Chrome Footer"]);
  const files = {
    "/c/h.dc.html": '<helmet><link href="/ahv/fonts/f.css" rel="stylesheet"><style>body{font-size:17px}</style></helmet>',
    "/c/f.dc.html": '<helmet><link href="/ahv/fonts/f.css" rel="stylesheet"></helmet>',
  };
  const resources = { "./AHV%20Chrome%20Header.dc.html": "/c/h.dc.html", "./AHV%20Chrome%20Footer.dc.html": "/c/f.dc.html" };
  const out = viewFirstPaintStyles(view, resources, (u) => files[u] || null);
  assert.deepEqual(out.fonts, ["/ahv/fonts/f.css"]);
  assert.deepEqual(out.styles, ["body{font-size:18px}", "body{font-size:17px}"]);
});

test("every served mobile view (EN + built locales) yields safe first-paint styles", () => {
  const cm = JSON.parse(fs.readFileSync("english-candidate/component-map.json", "utf8"));
  const L = JSON.parse(fs.readFileSync("l10n/locales.json", "utf8"));
  const bases = [["/ahv/views/", cm.resources]];
  for (const [loc, info] of Object.entries(L)) {
    if (loc === "en" || !fs.existsSync(`public/ahv/l10n/${info.prefix}/views`)) continue;
    bases.push([`/ahv/l10n/${info.prefix}/views/`, Object.fromEntries(Object.entries(cm.resources).map(([k, v]) => [k, v.replace(/^[/]ahv[/]/, `/ahv/l10n/${info.prefix}/`)]))]);
  }
  let views = 0, withStyles = 0;
  for (const [payloadBase, resources] of bases) {
    for (const f of fs.readdirSync("public" + payloadBase).filter((x) => x.endsWith("-mobile.json"))) {
      const out = snapshotStylesFor({ mobileView: f.replace(/[.]json$/, ""), payloadBase, resources });
      views++;
      if (!out) continue;
      withStyles++;
      for (const css of out.styles) {
        assert.ok(!/<[/]?\s*(style|script)/i.test(css), `${payloadBase}${f}: markup inside css`);
        assert.ok(!/[{][{]/.test(css), `${payloadBase}${f}: interpolation inside css`);
      }
      for (const href of out.fonts) assert.ok(fs.existsSync("public" + href), `${payloadBase}${f}: font css ${href} is served`);
    }
  }
  assert.ok(views > 80, `mobile views seen: ${views}`);
  assert.ok(withStyles / views > 0.9, `views with first-paint styles: ${withStyles}/${views}`);
});

test("firstScreenPoster: a first-screen <video poster> only, local paths only", () => {
  assert.equal(firstScreenPoster('<section><video preload="none" poster="/ahv/assets/img/wx-hero.webp"></video></section><img loading="lazy" src="/a.webp">'), "/ahv/assets/img/wx-hero.webp");
  assert.equal(firstScreenPoster('<img loading="lazy" src="/a.webp"><video poster="/b.webp"></video>'), null, "below a lazy image: not first-screen");
  assert.equal(firstScreenPoster('<video poster="https://x.example/p.webp"></video>'), null);
  assert.equal(firstScreenPoster('<video poster="//x.example/p.webp"></video>'), null);
  assert.equal(firstScreenPoster("<p>text</p>"), null);
  // the served EN home snapshot opens on the hero poster; a content page does not
  assert.equal(firstScreenPoster(fs.readFileSync("english-candidate/prerender/index.html", "utf8")), "/ahv/assets/img/wx-hero.webp");
  assert.equal(firstScreenPoster(fs.readFileSync("english-candidate/prerender/our-villas.html", "utf8")), null);
});

test("bodyFontFiles: the local face of the body family, upright 400 only", () => {
  const css = '@font-face{font-family:"Marcellus";font-style:normal;font-weight:400;src:url("m.ttf")}' +
    '@font-face{font-family:"Mulish";font-style:italic;font-weight:400;src:url("mi.ttf")}' +
    '@font-face{font-family:"Mulish";font-style:normal;font-weight:400;src:url("m4.ttf")}' +
    '@font-face{font-family:"Mulish";font-style:normal;font-weight:700;src:url("m7.ttf")}';
  const read = (u) => (u === "/ahv/fonts/a.css" ? css : null);
  assert.deepEqual(bodyFontFiles({ fonts: ["/ahv/fonts/a.css"], styles: ["body{margin:0;font-family:'Mulish',sans-serif}"] }, read), ["/ahv/fonts/m4.ttf"]);
  assert.deepEqual(bodyFontFiles({ fonts: ["/ahv/fonts/a.css"], styles: ["h1{font-family:Marcellus}"] }, read), [], "no body rule: nothing");
  assert.deepEqual(bodyFontFiles({ fonts: ["/ahv/fonts/a.css"], styles: ["body{font-family:Georgia,serif}"] }, read), [], "not a local face: nothing");
  // every served mobile view that carries styles resolves to exactly one served body face
  const cm = JSON.parse(fs.readFileSync("english-candidate/component-map.json", "utf8"));
  for (const v of ["ahv-page-our-villas-mobile", "home-mobile", "ahv-page-panchkarma-treatment-mobile"]) {
    const out = snapshotStylesFor({ mobileView: v, payloadBase: "/ahv/views/", resources: cm.resources });
    assert.equal(out.preloadFonts.length, 1, v);
    assert.ok(fs.existsSync("public" + out.preloadFonts[0]), v + " body face is served");
  }
});
