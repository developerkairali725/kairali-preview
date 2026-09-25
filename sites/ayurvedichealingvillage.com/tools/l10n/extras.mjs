/**
 * AHV localization — the sources outside the design payloads:
 *   · sitewide runtime scripts (public/design/*.js) — curated allowlist only;
 *   · public/design/section-nav.data.js — rail labels;
 *   · JSON data with a key whitelist (search index, site tree, native-page data);
 *   · server/boot UI strings (l10n/source/ui-strings.json);
 *   · native Next.js pages (JSX text + display props, parsed with @babel/parser).
 * Each exposes units in the same shape as lib.mjs so extract/build share one path.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { jsUnits, htmlUnits, norm, meaningful, isInternalDatum } from "./lib.mjs";
import { rel } from "./sources-lite.mjs";

export const RUNTIME_SCRIPTS = ["chrome.js", "consistency.js", "film-player.js", "newsletter.js", "search.js", "section-nav.js"];
const ALLOW = JSON.parse(fs.readFileSync(rel("l10n/source/runtime-allowlist.json"), "utf8"));

const markupish = (s) => /^[\s"'>=]|[<>]|="|\\"|&\w+=/.test(s) || !meaningful(s);
/** Runtime script units: allowlisted literals + text runs of HTML strings. */
export function runtimeScriptUnits(file, text) {
  const allow = new Set(ALLOW[path.basename(file)] || []);
  const keep = [];
  for (const u of jsUnits(text).units) {
    if (u.composite) {
      const inner = u.composite.filter((c) => (c.kind === "html-text" || c.kind.startsWith("attr:")) && !markupish(c.source));
      if (inner.length) keep.push({ ...u, composite: inner });
    } else if (allow.has(u.source)) keep.push(u);
  }
  return keep;
}

export const JSON_SOURCES = [
  { file: "public/ahv/search-index.json", keys: /^(label|desc|name|topic|q|a|oftenSearched|sanskrit|aliases)$|^ui\./ , skipKeys: /^(href|action|route|id|target|cats|basis|priceState|terms|kw|words|filler|validTo|validFrom|n|nights)$/ },
  { file: "english-candidate/site-tree.json", keys: /^title$/ },
  { file: "app/(english)/sightseeing/destinations.json", keys: /^(name|description|endpoint)$/ },
  { file: "app/(english)/video-gallery/films.json", keys: /^(title|category|description)$/ },
];

/** Units for string values of a JSON document whose key path matches. */
export function jsonUnits(doc, spec) {
  const out = [];
  const walk = (v, keyPath, set) => {
    if (typeof v === "string") {
      const last = keyPath[keyPath.length - 1] ?? "";
      const lastNamed = [...keyPath].reverse().find((k) => typeof k === "string") ?? "";
      const dotted = keyPath.filter((k) => typeof k === "string").join(".");
      if (spec.skipKeys && spec.skipKeys.test(lastNamed)) return;
      if (!(spec.keys.test(lastNamed) || spec.keys.test(dotted))) return;
      const s = norm(v);
      if (!meaningful(s) || /^(\/|https?:)/.test(s) || isInternalDatum(lastNamed, s)) return;
      out.push({ source: s, kind: "json:" + lastNamed, set: (t) => set(t) });
      void last;
      return;
    }
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, [...keyPath, i], (t) => { v[i] = t; }));
    else if (v && typeof v === "object") for (const k of Object.keys(v)) walk(v[k], [...keyPath, k], (t) => { v[k] = t; });
  };
  walk(doc, [], () => {});
  return out;
}

export function uiStrings() {
  return JSON.parse(fs.readFileSync(rel("l10n/source/ui-strings.json"), "utf8")).strings.map((s) => ({ source: norm(s), kind: "ui" }));
}

// ── native pages (TSX) ──
const babel = (() => {
  const req = createRequire(import.meta.url);
  try { return req("@babel/parser"); } catch { /* not hoisted */ }
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let up = 0; up < 6; up++) {
    const store = path.join(dir, "node_modules", ".pnpm");
    if (fs.existsSync(store)) {
      const hit = fs.readdirSync(store).filter((d) => /^@babel\+parser@7\./.test(d)).sort().pop();
      if (hit) return req(path.join(store, hit, "node_modules", "@babel", "parser"));
    }
    dir = path.dirname(dir);
  }
  throw new Error("@babel/parser not found");
})();
export const NATIVE_TSX = [
  "app/(english)/sightseeing/page.tsx",
  "app/(english)/video-gallery/page.tsx",
  "app/(english)/read-feedback/page.tsx",
  "app/(english)/read-feedback/ReviewsClient.tsx",
  "app/(english)/read-feedback/ReviewsShell.tsx",
  "app/(english)/givefeedback/page.tsx",
  "app/(english)/givefeedback/FeedbackComposer.tsx",
  "app/(english)/givefeedback/feedback-links.ts",
  "app/(english)/search/page.tsx",
];
const JSX_TEXT_ATTRS = /^(alt|aria-label|title|placeholder|label|aria-description)$/;
const DISPLAY_KEYS = /^(label|title|heading|text|body|description|desc|cta|question|answer|lede|intro|note|caption|name|hint|summary|kicker|eyebrow|button|action|message|empty|subtitle|help)$/;
/** Display strings in a TSX/TS module: JSX text, text-bearing JSX attributes, display-keyed literals. */
export function tsxUnits(code) {
  const ast = babel.parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
  const out = [];
  const walk = (node, parent, key) => {
    if (!node || typeof node.type !== "string") return;
    if (node.type === "JSXText") {
      const s = norm(node.value);
      if (meaningful(s)) out.push({ source: s, kind: "jsx-text", start: node.start, end: node.end });
    } else if (node.type === "JSXAttribute" && node.value && node.value.type === "StringLiteral" && JSX_TEXT_ATTRS.test(String(node.name.name))) {
      const s = norm(node.value.value);
      if (meaningful(s)) out.push({ source: s, kind: "jsx-attr", start: node.value.start, end: node.value.end });
    } else if ((node.type === "StringLiteral" || node.type === "TemplateLiteral" && node.expressions.length === 0) && parent) {
      const v = node.type === "StringLiteral" ? node.value : node.quasis[0].value.cooked;
      const s = norm(v);
      const k = parent.type === "ObjectProperty" && parent.value === node ? (parent.key.name || parent.key.value) : null;
      const inJsxExpr = parent.type === "JSXExpressionContainer" || parent.type === "ConditionalExpression" || parent.type === "LogicalExpression";
      if (meaningful(s) && (k && DISPLAY_KEYS.test(k) || inJsxExpr) && !/^(\/|https?:|#|mailto:|tel:)/.test(s) && !/^[a-z][\w-]*$/.test(s) && !isInternalDatum(k || "", s))
        out.push({ source: s, kind: "tsx-literal", start: node.start, end: node.end });
    }
    for (const k of Object.keys(node)) {
      if (k === "loc" || k === "start" || k === "end" || k === "extra" || k === "comments" || k === "leadingComments" || k === "trailingComments") continue;
      const v = node[k];
      if (Array.isArray(v)) v.forEach((c) => walk(c, node, k));
      else if (v && typeof v.type === "string") walk(v, node, k);
    }
  };
  walk(ast.program, null, null);
  return out;
}

void htmlUnits;
