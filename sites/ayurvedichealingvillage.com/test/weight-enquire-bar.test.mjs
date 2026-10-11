// Weight programme page (ADD04 inline enquiry): the shared bottom bar (#ahv-cta-bar, OWNER-REG-02) keeps its
// labels and styling, and its "Enquire" goes to the page's own inline enquiry (#programme-enquiry) in every
// locale. Call, Free Consult and every other page keep the homepage destinations. Runs the served script
// (public/design/family-header.js) against a minimal DOM, and checks every locale's served Weight body carries
// the target.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import zlib from "node:zlib";

const SCRIPT = fs.readFileSync("public/design/family-header.js", "utf8");
const WEIGHT = "/weight-loss-programme/";

function el(id, attrs = {}, cls = "") {
  const a = { ...attrs };
  return {
    id, className: cls, children: [],
    getAttribute: (k) => (k in a ? a[k] : null),
    setAttribute: (k, v) => { a[k] = String(v); },
    hasAttribute: (k) => k in a,
    querySelector(sel) {
      const m = sel.match(/^a\.([\w-]+)$/);
      return (m && this.children.find((c) => c.className.split(" ").includes(m[1]))) || null;
    },
  };
}
function bar(enquire = "/contact-us/") {
  const b = el("ahv-cta-bar");
  b.children.push(el("", { href: "tel:+91 9555 156 156" }, "ahv-cta-call"), el("", { href: enquire }, "ahv-cta-enquire"), el("", { href: "/online-consultation/" }, "ahv-cta-consult"));
  return b;
}
// one page load: route on the design root, optional inline enquiry, the bar built now or by a later pass
function load({ route, form = true, cta = bar(), later = false }) {
  const nodes = new Map([["ahv-design-root", el("ahv-design-root", { "data-ahv-route": route })]]);
  if (form) nodes.set("programme-enquiry", el("programme-enquiry"));
  if (!later) nodes.set("ahv-cta-bar", cta);
  const observers = [];
  const listeners = {};
  const document = {
    readyState: "interactive", body: {}, documentElement: {},
    getElementById: (id) => nodes.get(id) || null,
    querySelector: () => null, querySelectorAll: () => [],
    addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); },
  };
  class MutationObserver { constructor(f) { this.f = f; this.on = false; observers.push(this); } observe() { this.on = true; } disconnect() { this.on = false; } }
  const window = { addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); }, MutationObserver, setTimeout: () => 0 };
  window.window = window;
  vm.runInNewContext(SCRIPT, { window, document, MutationObserver, setTimeout: () => 0, getComputedStyle: () => ({}), location: { pathname: route } });
  return {
    cta,
    mutate() { nodes.set("ahv-cta-bar", cta); for (const o of observers) if (o.on) o.f([]); },
    observing: () => observers.some((o) => o.on),
  };
}
const hrefs = (b) => b.children.map((c) => c.getAttribute("href"));

test("Weight page: the bar's Enquire goes to the inline enquiry; Call and Free Consult unchanged", () => {
  const page = load({ route: WEIGHT });
  assert.deepEqual(hrefs(page.cta), ["tel:+91 9555 156 156", "#programme-enquiry", "/online-consultation/"]);
  assert.equal(page.observing(), false, "no observer left running once the bar is set");
});

test("Weight page in a locale (localized contact path on the bar) and a bar built by a later pass", () => {
  const de = load({ route: WEIGHT, cta: bar("/de/kontakt/") });
  assert.equal(hrefs(de.cta)[1], "#programme-enquiry");
  const late = load({ route: WEIGHT, later: true });
  assert.equal(hrefs(late.cta)[1], "/contact-us/", "untouched before the bar exists");
  late.mutate();
  assert.equal(hrefs(late.cta)[1], "#programme-enquiry");
});

test("every other page keeps the homepage destinations, even with a #programme-enquiry element", () => {
  for (const route of ["/", "/contact-us/", "/enquiry-form/", "/digestive-wellness-gut-health-yoga-therapy/", "/panchakarma-therapy/", "/lp/weight-loss/"]) {
    const page = load({ route });
    page.mutate();
    assert.deepEqual(hrefs(page.cta), ["tel:+91 9555 156 156", "/contact-us/", "/online-consultation/"], route);
    assert.equal(page.observing(), false, `${route}: no observer`);
  }
  // Weight without its inline enquiry rendered: the bar is not pointed at a missing target
  const noForm = load({ route: WEIGHT, form: false });
  noForm.mutate();
  assert.equal(hrefs(noForm.cta)[1], "/contact-us/");
});

test("all 13 Weight locale paths serve a body with the inline enquiry and in-page Enquire Now links", () => {
  const paths = JSON.parse(fs.readFileSync("l10n/routes.json", "utf8")).routes[WEIGHT];
  const locales = Object.keys(JSON.parse(fs.readFileSync("l10n/locales.json", "utf8")));
  assert.equal(locales.length, 13);
  for (const loc of locales) {
    const key = loc === "zh" ? "zh-Hans" : loc;
    assert.ok(paths[key] || paths[loc], `${loc}: Weight route has a locale path`);
    const body = loc === "en"
      ? fs.readFileSync("english-candidate/prerender/weight-loss-programme.html", "utf8")
      : zlib.gunzipSync(fs.readFileSync(`l10n/prerender/${key}/weight-loss-programme.html.gz`)).toString("utf8");
    assert.match(body, /id="programme-enquiry"/, `${loc}: inline enquiry present`);
    assert.match(body, /href="#programme-enquiry"/, `${loc}: in-page Enquire Now goes to it`);
  }
});
