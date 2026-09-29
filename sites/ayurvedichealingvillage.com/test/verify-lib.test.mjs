// Unit tests for the VERIFY-lane helpers (tools/lib/verify-common.mjs, tools/lib/language-lock.mjs).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { priceTokens, elementAt, findElement, enclosing, stripNonContent, identityFromHtml, wrongPageSigns, htmlText, stagingFetch } from "../tools/lib/verify-common.mjs";
import { scanLockedWords, allowlistForReport, wordsFor } from "../tools/lib/language-lock.mjs";
import { classifyHref } from "../tools/lib/link-class.mjs";

test("priceTokens reads Western, Indian and symbol-after groupings and ignores currency labels", () => {
  const t = priceTokens("₹ INR $ USD € EUR · From ₹3,18,920 · €1.234 · $232* · 16.264 € · ₹42,964");
  assert.deepEqual(t.map((x) => [x.cur, x.value]), [["INR", 318920], ["EUR", 1234], ["USD", 232], ["EUR", 16264], ["INR", 42964]]);
});

test("elementAt/findElement balance nested tags; enclosing finds the wrapping section", () => {
  const html = '<main><section class="a"><section class="b"><p>x</p></section><p>y ₹1</p></section><section class="c">z</section></main>';
  const a = findElement(html, /class="a"/, "section");
  assert.equal(a.html, '<section class="a"><section class="b"><p>x</p></section><p>y ₹1</p></section>');
  assert.equal(elementAt(html, html.indexOf('<section class="c"')), '<section class="c">z</section>');
  assert.match(enclosing(html, html.indexOf("y ₹1"), "section").html, /^<section class="a">/);
});

test("stripNonContent removes the RSC <script> copy so tariffs are not double counted", () => {
  const html = '<body><p>₹16,264</p><script>self.__next_f.push(["\\u003cp\\u003e₹16,264"])</script></body>';
  assert.equal(priceTokens(htmlText(stripNonContent(html))).length, 1);
});

test("identity helpers flag 404 and sign-in walls", () => {
  const id = identityFromHtml('<html lang="de"><head><title>404: This page could not be found.</title></head><body><h1>404</h1></body></html>');
  assert.ok(wrongPageSigns(id, 404).some((s) => /404|not-found/.test(s)));
  const wall = identityFromHtml("<html><head><title>Login – Vercel</title></head><body></body></html>");
  assert.ok(wrongPageSigns(wall, 200).some((s) => /auth-wall/.test(s)));
  const ok = identityFromHtml('<html lang="en-US"><head><title>Contact Us | Kairali</title></head><body><div id="ahv-design-root" data-ahv-route="/contact-us/"></div><h1>Speak with our care team</h1></body></html>');
  assert.deepEqual(wrongPageSigns(ok, 200), []);
  assert.equal(ok.ahvRoute, "/contact-us/");
});

test("language lock: blocking hits, explicit allowlist, quotes, German -kur compounds, Unicode boundaries", () => {
  const r = scanLockedWords("Is Kairali a hospital or a spa? “A lovely resort, felt like a holiday.” We won the World Luxury Spa Awards. Entgiftungskur. Spanish curé Kurs", "de");
  assert.deepEqual(r.hits.map((h) => h.match), ["spa", "Entgiftungskur"]);
  assert.ok(r.allowlisted.some((a) => a.kind === "quote" && a.word === "resort"));
  assert.ok(r.allowlisted.some((a) => a.kind === "award-title"));
  assert.equal(scanLockedWords("“a lovely resort”", "en", { quotes: false }).hits.length, 1);
  assert.equal(scanLockedWords("séjour de luxe", "fr").hits.length, 1, "longer phrase kept once");
  assert.ok(wordsFor("fr").includes("spa") && wordsFor("fr").includes("vacances"));
  assert.ok(allowlistForReport().length > 10);
});

test("classifyHref separates internal pages, bookings subdomain, XML sitemap, assets, actions and external", () => {
  const base = "https://ahv-final-staging.vercel.app/de/";
  const c = (h) => classifyHref(h, base, "https://ahv-final-staging.vercel.app").kind;
  assert.equal(c("/de/unsere-villen/"), "internal-page");
  assert.equal(c("https://bookings.ayurvedichealingvillage.com/"), "bookings");
  assert.equal(c("/sitemap.xml"), "sitemap-xml");
  assert.equal(c("/documents/x.pdf"), "asset");
  assert.equal(c("https://wa.me/919289838797"), "action");
  assert.equal(c("tel:+919555156156"), "action");
  assert.equal(c("#top"), "same-page");
  assert.equal(c("https://ayurvedichealingvillage.com/de/kontakt/"), "internal-page");
  assert.equal(c("https://www.youtube.com/x"), "external");
});

test("stagingFetch: no token over http, same-origin redirects followed by hand, off-origin redirects not followed", async () => {
  const seen = [];
  const srv = http.createServer((req, res) => {
    seen.push({ url: req.url, token: req.headers["x-vercel-trusted-oidc-idp-token"] || null });
    if (req.url === "/old/") { res.writeHead(301, { location: "/new/" }); return res.end(); }
    if (req.url === "/away/") { res.writeHead(302, { location: "https://example.invalid/elsewhere" }); return res.end(); }
    res.writeHead(200, { "content-type": "text/html" }); res.end('<html lang="en"><title>New</title><h1>New</h1></html>');
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  process.env.VERCEL_OIDC_TOKEN = "unit-test-placeholder";
  try {
    const a = await stagingFetch(base + "/old/", base);
    assert.equal(a.status, 200); assert.equal(a.finalUrl, base + "/new/");
    assert.deepEqual(a.hops.map((h) => h.status), [301, 200]);
    const b = await stagingFetch(base + "/away/", base);
    assert.equal(b.offOrigin, true); assert.equal(b.finalUrl, "https://example.invalid/elsewhere");
    assert.ok(seen.length === 3 && seen.every((s) => s.token === null), "token must never be sent over http");
    assert.ok(a.hops.concat(b.hops).every((h) => !h.tokenSent));
  } finally { delete process.env.VERCEL_OIDC_TOKEN; srv.close(); }
});
