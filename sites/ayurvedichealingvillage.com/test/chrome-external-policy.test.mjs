import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync("public/design/chrome.js", "utf8");
const start = source.indexOf("  var externalOriginals = new WeakMap();");
const end = source.indexOf("  function externalLinks()", start);
assert.ok(start >= 0 && end > start);
const context = { URL, WeakMap, Set, Array, window: { location: { href: "https://ayurvedichealingvillage.com/", origin: "https://ayurvedichealingvillage.com" } } };
vm.createContext(context);
vm.runInContext(source.slice(start, end) + "\nthis.externalLink = externalLink;", context);

function anchor(href, target = null, rel = null) {
  const attrs = new Map([["href", href]]);
  if (target !== null) attrs.set("target", target);
  if (rel !== null) attrs.set("rel", rel);
  let writes = 0;
  return {
    get writes() { return writes; },
    getAttribute: (key) => attrs.has(key) ? attrs.get(key) : null,
    setAttribute(key, value) { writes++; attrs.set(key, value); },
    removeAttribute(key) { writes++; attrs.delete(key); },
    get target() { return attrs.get("target") || ""; },
    set target(value) { writes++; attrs.set("target", value); },
    get rel() { return attrs.get("rel") || ""; },
    set rel(value) { writes++; attrs.set("rel", value); },
  };
}

test("external link policy skips unchanged passes and restores original attributes", () => {
  const a = anchor("https://example.org/guide", "_self", "sponsored");
  context.externalLink(a);
  assert.equal(a.target, "_blank");
  assert.match(a.rel, /noopener/);
  assert.match(a.rel, /noreferrer/);
  const firstWrites = a.writes;
  for (let i = 0; i < 20; i++) context.externalLink(a);
  assert.equal(a.writes, firstWrites);
  a.setAttribute("href", "/about-us/");
  context.externalLink(a);
  assert.equal(a.target, "_self");
  assert.equal(a.rel, "sponsored");
});

test("same href still repairs a changed external target and rel", () => {
  const a = anchor("https://example.org/guide");
  context.externalLink(a);
  a.target = "_self";
  a.rel = "";
  context.externalLink(a);
  assert.equal(a.target, "_blank");
  assert.match(a.rel, /noopener/);
  assert.match(a.rel, /noreferrer/);
});

test("internal and direct PDF links retain their existing behavior", () => {
  const internal = anchor("/contact-us/");
  const pdf = anchor("/wp-content/uploads/guide.pdf");
  context.externalLink(internal);
  assert.equal(internal.writes, 0);
  context.externalLink(pdf);
  assert.equal(pdf.target, "_blank");
});

test("relative links are rechecked when the document base path changes", () => {
  const a = anchor("wp-content/uploads/guide.pdf");
  context.externalLink(a);
  assert.equal(a.target, "_blank");
  context.window.location.href = "https://ayurvedichealingvillage.com/programmes/";
  try {
    context.externalLink(a);
    assert.equal(a.getAttribute("target"), null);
    assert.equal(a.getAttribute("rel"), null);
  } finally {
    context.window.location.href = "https://ayurvedichealingvillage.com/";
  }
});
