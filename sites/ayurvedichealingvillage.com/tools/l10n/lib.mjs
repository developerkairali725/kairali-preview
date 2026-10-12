/**
 * AHV localization — source-aware unit extraction and byte-preserving apply.
 *
 * WHY THIS SHAPE. The approved design renders in the browser from view payloads
 * (public/ahv/views/*.json: an HTML template with {{ expr }} bindings plus a JS
 * logic class), dataset scripts (public/ahv/assets/*-data.js) and two chrome
 * components. Translating the rendered DOM afterwards would leave the server
 * HTML, the metadata and every interactive state in English. So the unit of
 * translation is the SOURCE: template text runs, translatable attributes, JSON-LD
 * values and user-visible JS string literals — each located by parsing, each
 * identified by the SHA-256 of its normalised English text. A locale build parses
 * the same source again and swaps each located span for the catalogue entry of
 * that hash; every byte outside a unit is copied unchanged. The runtime then
 * renders localized content natively (client), and the prerender of that
 * localized runtime is what the server ships (SSR matches hydration).
 *
 * Identity by content hash means one English string has ONE translation
 * wherever it occurs: the visible FAQ answer and its FAQPage JSON-LD, a title
 * and its breadcrumb label, a dataset value and the logic that compares it.
 *
 * Nothing here executes source code. JS is parsed with acorn only.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// acorn is already in the workspace store (a transitive dependency); it is not
// hoisted into this package, so resolve it the way tools/prerender-english.mjs
// resolves playwright — no new dependency is installed.
const acorn = (() => {
  const req = createRequire(import.meta.url);
  try { return req("acorn"); } catch { /* not hoisted */ }
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let up = 0; up < 6; up++) {
    const store = path.join(dir, "node_modules", ".pnpm");
    if (fs.existsSync(store)) {
      const hit = fs.readdirSync(store).filter((d) => /^acorn@8\./.test(d)).sort().pop();
      if (hit) return req(path.join(store, hit, "node_modules", "acorn"));
    }
    dir = path.dirname(dir);
  }
  throw new Error("acorn not found in the workspace store");
})();

export const sha256 = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
export const unitId = (source) => "t_" + sha256(source).slice(0, 20);

// ───────────────────────── HTML entities ─────────────────────────
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", ndash: "\u2013", mdash: "\u2014",
  rsquo: "\u2019", lsquo: "\u2018", rdquo: "\u201d", ldquo: "\u201c", hellip: "\u2026", middot: "\u00b7", copy: "\u00a9",
  reg: "\u00ae", trade: "\u2122", times: "\u00d7", rarr: "\u2192", larr: "\u2190", bull: "\u2022", deg: "\u00b0",
  eacute: "\u00e9", rupee: "\u20b9", euro: "\u20ac", laquo: "\u00ab", raquo: "\u00bb", shy: "\u00ad", zwj: "\u200d", zwnj: "\u200c" };
export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    const v = NAMED[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}
const encText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const encAttr = (s, q) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(q === "'" ? /'/g : /"/g, q === "'" ? "&#39;" : "&quot;");

export const norm = (s) => s.replace(/[\s\u00a0]+/g, (m) => (m.includes("\u00a0") && !/[\t\n\r ]/.test(m) ? "\u00a0" : " ")).trim();
/** Does this text carry anything a person reads (a letter in any script)? */
export const meaningful = (s) => /\p{L}/u.test(s.replace(/\[\[[A-Z]+_\d+\]\]/g, ""));

// ───────────────────────── HTML tokenizer ─────────────────────────
const RAW = new Set(["style", "script", "textarea", "title", "xmp"]);
const VOID = new Set(["br", "wbr", "img", "hr", "input", "meta", "link", "source", "area", "base", "col", "embed", "param", "track"]);
// Inline phrasing elements that may sit INSIDE one sentence. Everything else
// (blocks, custom runtime elements, form controls) ends a text run.
const INLINE = new Set(["a", "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "s",
  "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "br", "wbr", "font", "nobr"]);
export const TEXT_ATTRS = new Set(["alt", "title", "aria-label", "aria-description", "aria-roledescription", "placeholder",
  "data-label", "data-title", "data-search", "data-film-title", "label", "aria-valuetext"]);
const META_TEXT = new Set(["description", "og:title", "og:description", "twitter:title", "twitter:description",
  "og:image:alt", "twitter:image:alt"]);

/** Tokenise HTML-ish template source into positioned tokens. Never throws. */
export function tokenizeHtml(src) {
  const toks = [];
  let i = 0;
  const n = src.length;
  let textStart = 0;
  const flushText = (end) => { if (end > textStart) toks.push({ type: "text", start: textStart, end }); };
  while (i < n) {
    const c = src[i];
    if (c === "{" && src[i + 1] === "{") { // skip {{ }} in text so a '<' inside an expression is not a tag
      const e = src.indexOf("}}", i + 2);
      i = e < 0 ? n : e + 2;
      continue;
    }
    if (c !== "<") { i++; continue; }
    if (src.startsWith("<!--", i)) {
      flushText(i);
      const e = src.indexOf("-->", i + 4);
      const end = e < 0 ? n : e + 3;
      toks.push({ type: "comment", start: i, end });
      i = textStart = end;
      continue;
    }
    if (src[i + 1] === "!" || src[i + 1] === "?") { // <!DOCTYPE ...> / <?xml ...?>
      flushText(i);
      const e = src.indexOf(">", i);
      const end = e < 0 ? n : e + 1;
      toks.push({ type: "comment", start: i, end });
      i = textStart = end;
      continue;
    }
    const m = /^<(\/?)([a-zA-Z][\w:-]*)/.exec(src.slice(i, i + 64));
    if (!m) { i++; continue; }
    flushText(i);
    const closing = m[1] === "/";
    const name = m[2].toLowerCase();
    // scan attributes to '>' honouring quotes and {{ }}
    let j = i + m[0].length;
    const attrs = [];
    let selfClose = false;
    while (j < n && src[j] !== ">") {
      if (/\s/.test(src[j])) { j++; continue; }
      if (src[j] === "/" && src[j + 1] === ">") { selfClose = true; j++; continue; }
      const am = /^[^\s=>\/"']+/.exec(src.slice(j, j + 200));
      if (!am) { j++; continue; }
      const aName = am[0];
      const aStart = j;
      j += aName.length;
      while (j < n && /\s/.test(src[j])) j++;
      let value = null, vStart = -1, vEnd = -1, quote = "";
      if (src[j] === "=") {
        j++;
        while (j < n && /\s/.test(src[j])) j++;
        if (src[j] === '"' || src[j] === "'") {
          quote = src[j];
          vStart = j + 1;
          let k = vStart;
          while (k < n && src[k] !== quote) {
            if (src[k] === "{" && src[k + 1] === "{") { const e = src.indexOf("}}", k + 2); k = e < 0 ? n : e + 2; continue; }
            k++;
          }
          vEnd = k;
          j = k + 1;
        } else {
          vStart = j;
          while (j < n && !/[\s>]/.test(src[j])) j++;
          vEnd = j;
        }
        value = src.slice(vStart, vEnd);
      }
      attrs.push({ name: aName.toLowerCase(), rawName: aName, start: aStart, vStart, vEnd, value, quote });
    }
    const end = Math.min(n, j + 1);
    toks.push({ type: closing ? "close" : "open", name, start: i, end, attrs, selfClose });
    i = textStart = end;
    if (!closing && RAW.has(name)) {
      const re = new RegExp("</" + name + "\\s*>", "ig");
      re.lastIndex = i;
      const cm = re.exec(src);
      const rawEnd = cm ? cm.index : n;
      toks.push({ type: "raw", parent: name, start: i, end: rawEnd, attrs });
      i = textStart = rawEnd;
    }
  }
  flushText(n);
  return toks;
}

const attrOf = (tok, name) => (tok.attrs || []).find((a) => a.name === name);

// ───────────────────────── units: HTML ─────────────────────────
/**
 * Every translatable span in an HTML template.
 * Returns [{start,end,source,kind,replace(translated)->string}].
 * `jsExpr` controls whether {{ expr }} string literals are also extracted.
 */
export function htmlUnits(src, { jsExpr = true, inJs = null } = {}) {
  const toks = tokenizeHtml(src);
  const units = [];

  // 1) text runs with inline tokens
  let run = [];
  const endRun = () => {
    if (run.length) pushRun(run);
    run = [];
  };
  const pushRun = (r) => {
    // trim non-meaningful edges: whitespace text, and wrapper tags matched at both ends
    let a = 0, b = r.length - 1;
    const isBlankText = (t) => t.type === "text" && !src.slice(t.start, t.end).replace(/\{\{[\s\S]*?\}\}/g, "x").trim();
    for (;;) {
      while (a <= b && isBlankText(r[a])) a++;
      while (b >= a && isBlankText(r[b])) b--;
      if (a > b) return;
      // strip leading void / lone tags and trailing ones that have no partner inside the range
      const partner = (idx) => {
        const t = r[idx];
        if (t.type === "open" && !VOID.has(t.name) && !t.selfClose) {
          let depth = 0;
          for (let k = idx + 1; k <= b; k++) {
            if (r[k].type === "open" && r[k].name === t.name && !r[k].selfClose) depth++;
            if (r[k].type === "close" && r[k].name === t.name) { if (depth === 0) return k; depth--; }
          }
        }
        if (t.type === "close") {
          let depth = 0;
          for (let k = idx - 1; k >= a; k--) {
            if (r[k].type === "close" && r[k].name === t.name) depth++;
            if (r[k].type === "open" && r[k].name === t.name && !r[k].selfClose) { if (depth === 0) return k; depth--; }
          }
        }
        return -1;
      };
      let changed = false;
      if (r[a].type !== "text") {
        const p = partner(a);
        if (p === b) { a++; b--; changed = true; } // wrapper around everything
        else if (p < 0 || r[a].type === "close" || VOID.has(r[a].name)) { a++; changed = true; }
      }
      if (!changed && a <= b && r[b].type !== "text") {
        const p = partner(b);
        if (p < 0 || r[b].type === "open" || VOID.has(r[b].name)) { b--; changed = true; }
      }
      if (!changed) break;
    }
    const seg = r.slice(a, b + 1);
    // any tag left without a partner inside seg -> split the run there
    for (let k = 0; k < seg.length; k++) {
      const t = seg[k];
      if (t.type === "text" || VOID.has(t.name) || t.selfClose) continue;
      let ok = false, depth = 0;
      if (t.type === "open") {
        for (let q = k + 1; q < seg.length; q++) {
          if (seg[q].type === "open" && seg[q].name === t.name && !seg[q].selfClose) depth++;
          if (seg[q].type === "close" && seg[q].name === t.name) { if (depth === 0) { ok = true; break; } depth--; }
        }
      } else {
        for (let q = k - 1; q >= 0; q--) {
          if (seg[q].type === "close" && seg[q].name === t.name) depth++;
          if (seg[q].type === "open" && seg[q].name === t.name && !seg[q].selfClose) { if (depth === 0) { ok = true; break; } depth--; }
        }
      }
      if (!ok) { pushRun(seg.slice(0, k)); pushRun(seg.slice(k + 1)); return; }
    }
    makeTextUnit(seg);
  };
  const makeTextUnit = (seg) => {
    // leading/trailing whitespace of the first/last text token stays outside the unit
    const first = seg[0], last = seg[seg.length - 1];
    let start = first.start, end = last.end;
    if (first.type === "text") { const s = src.slice(first.start, first.end); start = first.start + (s.length - s.replace(/^[\s\u00a0]+/, "").length); }
    if (last.type === "text") { const s = src.slice(last.start, last.end); end = last.end - (s.length - s.replace(/[\s\u00a0]+$/, "").length); }
    if (end <= start) return;
    const tokens = {}; // token name -> original raw
    const openIdx = new Map();
    let counter = 0, varCounter = 0;
    let source = "";
    const exprs = [];
    for (const t of seg) {
      const ts = Math.max(t.start, start), te = Math.min(t.end, end);
      if (t.type === "text") {
        const raw = src.slice(ts, te);
        // split {{ }} out as VAR tokens
        let last = 0;
        for (const m of raw.matchAll(/\{\{[\s\S]*?\}\}/g)) {
          source += decodeEntities(raw.slice(last, m.index));
          const k = "VAR_" + ++varCounter;
          tokens[k] = m[0];
          exprs.push({ start: ts + m.index, text: m[0] });
          source += "[[" + k + "]]";
          last = m.index + m[0].length;
        }
        source += decodeEntities(raw.slice(last));
      } else if (t.type === "open") {
        const raw = src.slice(t.start, t.end);
        if (VOID.has(t.name) || t.selfClose) {
          const k = "TAG_" + ++counter;
          tokens[k] = raw;
          source += "[[" + k + "]]";
        } else {
          const id = ++counter;
          openIdx.set(t, id);
          tokens["OPEN_" + id] = raw;
          source += "[[OPEN_" + id + "]]";
        }
      } else if (t.type === "close") {
        // match to most recent unmatched open of same name
        let id = null;
        for (const [ot, oid] of [...openIdx.entries()].reverse()) {
          if (ot.name === t.name && !tokens["CLOSE_" + oid]) { id = oid; break; }
        }
        tokens["CLOSE_" + id] = src.slice(t.start, t.end);
        source += "[[CLOSE_" + id + "]]";
      }
    }
    const normalized = norm(source);
    if (!meaningful(normalized)) {
      // no prose in the run itself; expressions may still hold literals
      for (const e of exprs) if (jsExpr) units.push(...exprUnits(e.text, e.start));
      return;
    }
    units.push({
      start, end, source: normalized, kind: "html-text",
      render: (tr) => tr.replace(/\[\[([A-Z]+_\d+)\]\]|([^[]+|\[)/g, (m, tok, txt) => (tok ? tokens[tok] ?? m : encText(txt))),
    });
    // literals inside VAR expressions are separate units (their own spans lie inside this unit)
    for (const e of exprs) if (jsExpr) for (const u of exprUnits(e.text, e.start)) { u.nested = true; units.push(u); }
  };

  const inlineOpen = (t) => INLINE.has(t.name);
  for (const t of toks) {
    if (t.type === "text") { run.push(t); continue; }
    if ((t.type === "open" || t.type === "close") && inlineOpen(t)) { run.push(t); continue; }
    endRun();
  }
  endRun();

  // 2) attributes + JSON-LD + helmet metas
  for (let ti = 0; ti < toks.length; ti++) {
    const t = toks[ti];
    if (t.type === "open") {
      const metaName = t.name === "meta" ? (attrOf(t, "name") || attrOf(t, "property")) : null;
      for (const a of t.attrs) {
        if (a.value == null || a.vStart < 0) continue;
        const isMetaText = t.name === "meta" && a.name === "content" && metaName && META_TEXT.has((metaName.value || "").toLowerCase());
        if (!TEXT_ATTRS.has(a.name) && !isMetaText) {
          // expressions in other attributes can still carry display literals (e.g. aria-pressed no; style no)
          continue;
        }
        const v = a.value;
        const exprsInAttr = [...v.matchAll(/\{\{[\s\S]*?\}\}/g)];
        if (exprsInAttr.length && v.replace(/\{\{[\s\S]*?\}\}/g, "").trim() === "") {
          if (jsExpr) for (const m of exprsInAttr) units.push(...exprUnits(m[0], a.vStart + m.index));
          continue;
        }
        const tokens = {};
        let k = 0;
        const source = norm(decodeEntities(v.replace(/\{\{[\s\S]*?\}\}/g, (m) => { const key = "VAR_" + ++k; tokens[key] = m; return "[[" + key + "]]"; })));
        if (!meaningful(source)) continue;
        const q = a.quote || '"';
        units.push({ start: a.vStart, end: a.vEnd, source, kind: isMetaText ? "meta" : "attr:" + a.name,
          render: (tr) => tr.replace(/\[\[(VAR_\d+)\]\]|([^[]+|\[)/g, (m, tok, txt) => (tok ? tokens[tok] ?? m : encAttr(txt, q))) });
      }
    }
    if (t.type === "raw" && t.parent === "script") {
      const type = (attrOf({ attrs: t.attrs }, "type") || {}).value || "";
      if (/ld\+json/i.test(type)) units.push(...jsonLdUnits(src.slice(t.start, t.end), t.start));
      else if (/text\/x-dc/i.test(type)) units.push(...jsUnits(src.slice(t.start, t.end), { offset: t.start }).units);
    }
    if (t.type === "text" && jsExpr) {
      // expressions in pure-expression text were handled inside runs; nothing else
    }
  }
  // {{ }} inside non-text attributes: harvest display literals (e.g. aria-label is handled; value/title handled)
  if (jsExpr) {
    for (const t of toks) {
      if (t.type !== "open") continue;
      for (const a of t.attrs) {
        if (a.value == null || TEXT_ATTRS.has(a.name)) continue;
        if (/^(style|class|on\w+|href|src|ref|list|as|cond|key|name|value|id|for|type|role|srcset|data-dc-tpl|style-hover)$/i.test(a.name)) continue;
        for (const m of a.value.matchAll(/\{\{[\s\S]*?\}\}/g)) units.push(...exprUnits(m[0], a.vStart + m.index, { htmlAttr: true }));
      }
    }
  }
  return units;
}

// ───────────────────────── JSON-LD ─────────────────────────
const LD_KEYS = new Set(["name", "text", "description", "headline", "caption", "alternativeHeadline", "abstract", "disambiguatingDescription", "articleSection"]);
const LD_SKIP_TYPES_FOR_NAME = new Set(); // names of orgs/people are proper nouns; the translator keeps them (unchangedReason)
export function jsonLdUnits(json, offset) {
  const units = [];
  const re = /"((?:[^"\\]|\\.)*)"(\s*:)?/g;
  let m, pendingKey = null;
  while ((m = re.exec(json))) {
    if (m[2]) { pendingKey = JSON.parse('"' + m[1] + '"'); continue; }
    const key = pendingKey;
    pendingKey = null;
    // array elements after a key keep the key (e.g. "keywords": [..]) — only direct string values count
    const before = json.slice(Math.max(0, m.index - 3), m.index);
    if (!key || !LD_KEYS.has(key) || !/:\s*$/.test(json.slice(0, m.index))) continue;
    let value;
    try { value = JSON.parse('"' + m[1] + '"'); } catch { continue; }
    const source = norm(value);
    if (!meaningful(source) || /^https?:/.test(source) || /^[a-z0-9]+(-[a-z0-9]+)+$/.test(source)) continue;
    units.push({ start: offset + m.index, end: offset + m.index + m[1].length + 2, source, kind: "jsonld:" + key,
      render: (tr) => JSON.stringify(tr).replace(/</g, "\\u003c") });
    void before;
  }
  return units;
}

// ───────────────────────── units: JS ─────────────────────────
const SKIP_CALLEE = /(^|\.)(querySelector|querySelectorAll|getElementById|getElementsByClassName|getElementsByTagName|closest|matches|addEventListener|removeEventListener|getAttribute|hasAttribute|removeAttribute|createElement|createElementNS|add|remove|toggle|contains|replace|replaceAll|dispatchEvent|CustomEvent|matchMedia|fetch|import|require|postMessage|getItem|setItem|removeItem|pushState|replaceState|URL|URLSearchParams|RegExp|log|warn|error|info|debug|parse|setProperty|getPropertyValue|gtag|push|track|startsWith|endsWith|indexOf|lastIndexOf|split|join|includes|test|match|search|toLocaleString|toLocaleDateString|toLocaleTimeString|DateTimeFormat|NumberFormat|localeCompare|insertAdjacentHTML|scrollIntoView|define|get|has|delete|set|padStart|padEnd|trim|__dcUpdate|__dcSetProps|sendBeacon|open|execCommand|createTextNode|attachShadow|Date|Intl)$/;
const CSSISH = /(^|;)\s*-?[a-z][a-z-]*\s*:\s*[^;]+(;|$)/;
const CODE_WORD = /^[A-Za-z_$][\w$]*$/;
function looksDisplayText(s, ctx) {
  const t = s.trim();
  if (!meaningful(t)) return false;
  if (/^(https?:|mailto:|tel:|data:|javascript:|\/|#|\.\.?\/|www\.)/i.test(t)) return false;
  if (/^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i.test(t)) return false;
  if (/\.(js|css|json|png|jpe?g|webp|svg|mp4|pdf|html?|woff2?|ttf)(\?|#|$)/i.test(t) && !/\s/.test(t)) return false;
  if (CSSISH.test(t) && !/[.!?]\s|\s[a-z]+\s[a-z]+\s[a-z]+/.test(t.replace(/:[^;]+;?/g, ""))) return false;
  if (/^[#.[]?[a-z][\w-]*([.#[>: ,][\w\-=\]"'()*#.:> ,]*)?$/.test(t) && !/\s[a-z]+\s/.test(t) && /[#.[\]>]/.test(t)) return false; // selectors
  if (/^[A-Z0-9_]{2,6}$/.test(t)) return false; // codes: INR, USD, EURO, IST
  if (/^[a-z0-9]+([_-][a-z0-9]+)+$/.test(t)) return false; // kebab/snake ids
  if (CODE_WORD.test(t)) {
    if (/[a-z][A-Z]/.test(t)) return false; // camelCase
    if (/^[a-z]/.test(t)) return ctx === "concat" || ctx === "display"; // lowercase single word: only when concatenated into prose
  }
  if (/^[a-z]+(\s[a-z]+)*$/.test(t) && t.split(" ").length <= 3 && ctx === "enum") return false;
  return true;
}

/**
 * Dataset records carry build provenance next to page copy (source hashes,
 * adjudication notes, CSS, route rules). None of it renders; translating it
 * would waste work and risk code paths. Keys below were classified from the
 * 239-route English prerender (a key none of whose values ever render, and whose
 * name/values are provenance or styling) — see l10n/source/README.md.
 */
export const INTERNAL_KEYS = new Set(("reason sourceClass recordedOriginalSha256 sourceNodeSha256 importedSha256 gates target " +
  "sourceSha256 decision type locale robots provenance htmlLang modifiedTime accessibleNameNote sha256 headingNote ownerReason " +
  "ownerAction sourceTags layer breadcrumbRationale candidateBreadcrumbAcceptance scope sourceOriginalSha256 h1Note " +
  "renderedSequence evidence altNote margin sourcePlaceholder privateGates sourceStatus headingBinding equivalentTo limits " +
  "preparedInstructions headingPolicy maxWidth fontSize sourceWrapperClass cls releaseFlags corrections status inLanguage reuse " +
  "maxlength correction altResolution altDecision borderRadius acceptance accessibleNameProvenance matchedBy mappingEvidence " +
  "designRule routeRuleSha256 sourceManifestSha256 rationale enquiryHref visualObservation contextNote stylesheet loading " +
  "innerHTML taskId family evidenceSha256 gap releaseNotes method youtubeId textWrap articleTextSha256 class leHidden " +
  "lcWriteHidden roleNote padding sourceRecordSha256 accounting maxHeight renderedAs border recordedSha256 lang visualReview " +
  "sourcePacketSha256 imageProvenance capturedHTMLSha256 detail scrollMarginTop privateReleaseFlags expectedSha256 identity " +
  "preparedPacketSha256 fix structuralChanges storedValues rel sizes className rendered hiddenFieldNames viewer counters " +
  "fullView everyImageAddressable decoding textUnderlineOffset assets paddingLeft sourceSequence rule accept legacyHidden " +
  "rightsNote finding datePublished dateModified gridTemplateColumns copyChanges register slider gate sourceBindingSha256 " +
  "ruling outlineOffset fontFamily generated k fw preparedAltPrivate action basis oraclePlacement component by before " +
  "sourceTag control key id el width disposition cause retraction bodyPolicy inlineRepair interactionPolicy provenanceNote " +
  "renderRule sourceStatus privateNote internalNote auditNote wrapperClass sourceHref sourceUrl sourcePointer pointer " +
  "payloadSchema rootMargin").split(/\s+/)); // payloadSchema = submitted field keys (28 Sep 2026 locale audit), never rendered
const INTERNAL_PROSE = /\b(governed|verbatim|packet|pointer|oracle|adjudicat\w*|sha-?256|dataset|renderer|prerender|payload|readback|H1|h[1-6]|canonical|sourceAlt|source (node|record|subtree|tree|tag|hero|anchor|order|position|title|head|alt|image|page|file|route|grid|label|heading|trail)|owner[- ]rul\w*|retained privately|poured from)\b/;
const HASHLIKE = /^(?:[0-9a-f]{16,}|[A-Za-z0-9_-]{11}|\d{4}-\d\d-\d\d(?:T[\d:.]+(?:Z|[+-]\d\d:\d\d)?)?|T[\d:.]+Z?|-?[\d.]+(px|rem|em|%|vh|vw|s|ms|fr)?|[A-Z][A-Z0-9_]{3,}|en[_-]US)$/;
export function isInternalDatum(keyPath, value) {
  const segs = keyPath.split(".");
  const key = segs.pop() || "";
  // A provenance container hides its whole subtree (29 Sep 2026: ef12.structural20260929.removed[].why "S1 stand-in
  // photo" reached the translators because only the LAST key was tested).
  if (segs.some((s) => /^ef\d{2}$/.test(s))) return true;
  if (key === "note" && segs.at(-1) === "headingOutline") return true;
  if (INTERNAL_KEYS.has(key) || /Sha256$|Note$|Notes$|Rationale$|Provenance$|Evidence$|Policy$|Acceptance$|Instructions$|Private$|^ef\d{2}$|^externalImages$/.test(key)) return true; // efNN = owner-feedback provenance notes (26 Sep 2026), never rendered
  const t = value.trim();
  if (HASHLIKE.test(t) && !/\s/.test(t) && !/^[A-Z][a-z]+$/.test(t)) return true;
  if (/^(wp-|has-|is-|eb-|wpcf7)/.test(t)) return true;
  if (/^(noindex|index)\b.*(follow)/.test(t)) return true;
  if (INTERNAL_PROSE.test(t) && t.length > 40) return true;
  if (key === "value") return true; // form option VALUES are submitted data; only labels are localized
  if (/[\w-]+="[^"]*"/.test(t) && !/[.!?]\s/.test(t.replace(/[\w-]+="[^"]*"/g, ""))) return true; // markup fragment
  if (isNonEnglishSource(t)) return true;
  return false;
}

/** Existing non-English copy in the source (legacy RU article, DE/FR popup variants) is not English source. */
export function isNonEnglishSource(t) {
  if (/[\u0400-\u04ff]/.test(t)) return true;
  const en = /\b(the|and|of|to|your|you|for|with|is|are)\b/i.test(t);
  const deFr = /\b(und|der|die|das|Sie|wir|Ihre|pour|vous|votre|avec|les|des|sur|nous)\b/.test(t) || /\b(Bevor|Avant de|Jetzt|Réclamez|Erhalten|Obtenez)\b/.test(t);
  return deFr && !en;
  return false;
}

const IDENT = (n) => n && n.type === "Literal" && typeof n.value === "string" && /^[a-z][a-z0-9_-]*$/.test(n.value);
function literalContext(node, ancestors) {
  const parent = ancestors[ancestors.length - 2];
  const gp = ancestors[ancestors.length - 3];
  if (!parent) return "free";
  if (parent.type === "Property" && parent.key === node && !parent.computed) return "key";
  if (parent.type === "Property" && parent.key === node && parent.computed) return "key";
  if (parent.type === "MemberExpression" && parent.property === node) return "key";
  if (parent.type === "BinaryExpression" && /^(===|!==|==|!=|in|instanceof)$/.test(parent.operator)) return "compare";
  if (parent.type === "SwitchCase" && parent.test === node) return "compare";
  if (parent.type === "ImportDeclaration" || parent.type === "ExportNamedDeclaration" || parent.type === "ExportAllDeclaration") return "key";
  if (parent.type === "CallExpression" || parent.type === "NewExpression") {
    if (parent.callee === node) return "key";
    const callee = parent.callee;
    const name = callee.type === "Identifier" ? callee.name : callee.type === "MemberExpression" && !callee.computed ? (callee.object.name || "") + "." + callee.property.name : "";
    if (/(^|\.)(setAttribute)$/.test(name)) {
      const i = parent.arguments.indexOf(node);
      if (i === 0) return "key";
      const an = parent.arguments[0];
      if (an && an.type === "Literal" && TEXT_ATTRS.has(String(an.value).toLowerCase())) return "display";
      return "key";
    }
    if (SKIP_CALLEE.test(name)) return "key";
    return "arg";
  }
  if (parent.type === "BinaryExpression" && parent.operator === "+") return "concat";
  if (parent.type === "AssignmentExpression" && parent.right === node) {
    const l = parent.left;
    const prop = l.type === "MemberExpression" && !l.computed ? l.property.name : "";
    if (/^(textContent|innerText|innerHTML|title|placeholder|alt|ariaLabel|label|value|outerHTML|nodeValue|data)$/.test(prop)) return "display";
    if (/^(className|id|href|src|type|name|lang|dir|display|cssText|rel|target|htmlFor|role|hash|search|pathname)$/.test(prop)) return "key";
    return "free";
  }
  if (parent.type === "Property" && parent.value === node) {
    const k = parent.key.type === "Identifier" ? parent.key.name : String(parent.key.value);
    // a lone lowercase identifier as an object value is code (style values, state flags, price status `ps:'valid'`,
    // `consent:'pending'`) unless the key itself names visible text (28 Sep 2026 locale defect audit)
    if (IDENT(node) && !/^(v|t|text|label|title|heading|subheading|caption|desc|description|alt|placeholder|cta|button|hint|note|msg|message|tagline|badge|chip|unit|suffix|prefix|word|term|tabLabel|h[1-6]|lead|intro|body|summary|q|a|answer|question|name_display|display)$/i.test(k)) return "enum";
    if (/^(id|key|type|kind|slug|href|url|src|img|image|icon|cls|class|className|color|bg|fg|bd|variant|route|path|file|view|dataset|anchor|target|rel|lang|dir|code|currency|cur|sku|ref|pdf|download|video|poster|mp4|yt|youtube|embed|lat|lng|map|tel|phone|email|whatsapp|wa|mail|hash|sel|selector|event|name_id|at|family|layout|align|pos|position|side|w|h|ratio|fit|mode|state|status|tag_id|cat|category_key|group|filter|value|name|autocomplete|autoComplete|field|control|for|htmlFor|inputmode|inputMode|pattern|method|action|enctype|attr|attribute|prop|property|role|tag|element|as)$/i.test(k)) return "enum";
    return "display";
  }
  // code tokens that merely LOOK like words (28 Sep 2026 locale defect: `c.tag === 'th' ? 'th' : 'td'` rendered
  // createElement('.') in de; image-slot observedAttributes and form payloadSchema arrays were translated)
  if (parent.type === "ConditionalExpression") {
    if (IDENT(parent.consequent) && IDENT(parent.alternate)) return "key";
    return gp && gp.type === "BinaryExpression" && gp.operator === "+" ? "concat" : "display";
  }
  if (parent.type === "ArrayExpression") {
    // The tariff renderer indexes prices and callback names with these exact
    // currency keys. "Euro" is a key here, while a visible Euro label elsewhere
    // remains a translation unit.
    const currencyKeys = parent.elements.map(n => n?.type === 'Literal' ? n.value : null);
    if (currencyKeys.length === 3 && currencyKeys.every(v => typeof v === 'string') && currencyKeys.slice().sort().join('|') === 'Euro|INR|USD') return "key";
    // Finder status options are [submitted enum, visible label] tuples. The
    // first cell controls filtering and must remain byte-for-byte stable.
    if (parent.elements[0] === node && parent.elements.length === 2 && /(?:^|\.)statuses$/.test(propertyPath(ancestors))) return "key";
    return parent.elements.length && parent.elements.every(IDENT) ? "key" : "display";
  }
  if (parent.type === "ReturnStatement" || parent.type === "ArrowFunctionExpression") return "display";
  if (parent.type === "TemplateLiteral") return "concat";
  if (parent.type === "LogicalExpression") return IDENT(node) ? "key" : "display";
  return "free";
}

/** Nearest enclosing object-property keys (innermost last), e.g. "records.faqs.a". */
export function propertyPath(anc) {
  const keys = [];
  for (let i = anc.length - 2; i >= 0 && keys.length < 4; i--) {
    const a = anc[i];
    if (a.type === "Property") keys.unshift(a.key.type === "Identifier" ? a.key.name : String(a.key.value));
    else if (a.type === "AssignmentExpression" && a.left.type === "MemberExpression" && !a.left.computed) { keys.unshift(a.left.property.name); break; }
    else if (a.type === "VariableDeclarator" && a.id.type === "Identifier") { keys.unshift(a.id.name); break; }
    else if (/Function/.test(a.type)) break;
  }
  return keys.join(".");
}

/** Walk with ancestor stack (acorn-walk free, tiny). */
function walk(node, visit, ancestors = []) {
  if (!node || typeof node.type !== "string") return;
  ancestors.push(node);
  visit(node, ancestors);
  for (const k of Object.keys(node)) {
    if (k === "loc" || k === "range" || k === "start" || k === "end") continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") walk(c, visit, ancestors); }
    else if (v && typeof v.type === "string") walk(v, visit, ancestors);
  }
  ancestors.pop();
}

const jsEsc = (s, q) => s.replace(/\\/g, "\\\\").replace(q === "'" ? /'/g : q === "`" ? /`|\$\{/g : /"/g, (m) => "\\" + m)
  .replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
const jsEscHtmlSafe = (s, q) => jsEsc(s, q).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

/**
 * Units inside JS source. `htmlSafe` = the code sits inside HTML (a template
 * {{ }} expression), so translated literals must not introduce raw < > &.
 */
export function jsUnits(code, { offset = 0, htmlSafe = false, expression = false } = {}) {
  let ast;
  try {
    ast = expression
      ? acorn.parseExpressionAt(code, 0, { ecmaVersion: "latest" })
      : acorn.parse(code, { ecmaVersion: "latest", sourceType: "script", allowReturnOutsideFunction: true, allowHashBang: true });
  } catch (e) {
    return { units: [], error: e.message };
  }
  const units = [];
  const esc = htmlSafe ? jsEscHtmlSafe : jsEsc;
  walk(ast, (node, anc) => {
    if (node.type === "Literal" && typeof node.value === "string") {
      const ctx = literalContext(node, anc);
      if (ctx === "key" || ctx === "compare") return;
      const raw = code.slice(node.start, node.end);
      const q = raw[0];
      const value = node.value;
      // HTML inside a JS string: translate its text runs, keep its markup
      if (/<\/?[a-z][\w-]*(\s[^<>]*)?>/i.test(value) && ctx !== "enum") {
        const inner = htmlUnits(value, { jsExpr: false });
        if (inner.length) {
          units.push({ start: offset + node.start, end: offset + node.end, kind: "js-html", composite: inner, source: null,
            renderComposite: (translatedValue) => q + esc(translatedValue, q) + q, value });
          return;
        }
      }
      if (!looksDisplayText(value, ctx)) return;
      if (isInternalDatum(propertyPath(anc), value)) return;
      const lead = value.match(/^[\s\u00a0]*/)[0], trail = value.match(/[\s\u00a0]*$/)[0];
      const source = norm(value);
      units.push({ start: offset + node.start, end: offset + node.end, source, kind: "js:" + ctx, key: propertyPath(anc),
        render: (tr) => q + esc(lead + tr + trail, q) + q });
    } else if (node.type === "TemplateLiteral") {
      const parent = anc[anc.length - 2];
      if (parent && parent.type === "TaggedTemplateExpression") return;
      const tokens = {};
      let s = "";
      node.quasis.forEach((qq, i) => {
        s += qq.value.cooked ?? qq.value.raw;
        if (i < node.expressions.length) {
          const ex = node.expressions[i];
          const key = "VAR_" + (i + 1);
          tokens[key] = "${" + code.slice(ex.start, ex.end) + "}";
          s += "[[" + key + "]]";
        }
      });
      const ctx = literalContext(node, anc);
      if (ctx === "key" || ctx === "compare") return;
      if (/<\/?[a-z][\w-]*(\s[^<>]*)?>/i.test(s)) {
        // HTML template literal: translate text runs of the markup (expressions stay tokens)
        const inner = htmlUnits(s, { jsExpr: false });
        if (inner.length) {
          units.push({ start: offset + node.start, end: offset + node.end, kind: "js-html-template", composite: inner, source: null, value: s,
            renderComposite: (tv) => "`" + tv.replace(/\[\[(VAR_\d+)\]\]|([^[]+|\[)/g, (m, tok, txt) => (tok ? tokens[tok] ?? m : jsEsc(txt, "`"))) + "`" });
        }
        return;
      }
      const lead = s.match(/^[\s\u00a0]*/)[0], trail = s.match(/[\s\u00a0]*$/)[0];
      const source = norm(s);
      if (!looksDisplayText(source.replace(/\[\[VAR_\d+\]\]/g, "0"), ctx === "free" ? "display" : ctx)) return;
      if (!meaningful(source)) return;
      units.push({ start: offset + node.start, end: offset + node.end, source, kind: "js-template",
        render: (tr) => "`" + (lead + tr + trail).replace(/\[\[(VAR_\d+)\]\]|([^[]+|\[)/g, (m, tok, txt) => (tok ? tokens[tok] ?? m : jsEsc(txt, "`"))) + "`" });
    }
  });
  return { units };
}

function exprUnits(exprText, absStart, { htmlAttr = false } = {}) {
  const inner = exprText.slice(2, -2);
  const r = jsUnits(inner, { offset: absStart + 2, htmlSafe: true, expression: true });
  return r.units.map((u) => ({ ...u, kind: "expr:" + u.kind }));
}

// ───────────────────────── apply ─────────────────────────
/**
 * Replace unit spans with translations. `lookup(source)` returns the translated
 * text or undefined (untranslated → the span is kept and reported).
 * Composite units (HTML inside JS strings) are applied recursively.
 */
export function applyUnits(src, units, lookup, report) {
  // outermost first; nested units (inside an html-text unit) are applied through the parent's token map
  const top = units.filter((u) => !u.nested).sort((a, b) => a.start - b.start);
  const nested = units.filter((u) => u.nested);
  let out = "", pos = 0;
  for (const u of top) {
    if (u.start < pos) { report?.overlap?.push(u); continue; }
    out += src.slice(pos, u.start);
    let rep;
    if (u.composite) {
      const innerOut = applyUnits(u.value, u.composite, lookup, report);
      rep = innerOut === u.value ? src.slice(u.start, u.end) : u.renderComposite(innerOut);
    } else {
      const tr = lookup(u.source, u);
      if (tr == null) { report?.missing?.push(u.source); rep = src.slice(u.start, u.end); }
      else {
        rep = u.render(tr);
        // nested expression literals inside this unit: patch inside the rendered VAR tokens
        const inside = nested.filter((n) => n.start >= u.start && n.end <= u.end);
        for (const n of inside) {
          const ntr = lookup(n.source, n);
          if (ntr == null) { report?.missing?.push(n.source); continue; }
          const orig = src.slice(n.start, n.end);
          rep = rep.replace(orig, n.render(ntr));
        }
      }
    }
    report && (report.applied = (report.applied || 0) + 1);
    out += rep;
    pos = u.end;
  }
  out += src.slice(pos);
  return out;
}

/** All leaf sources (flattening composite units). */
export function leafSources(units) {
  const out = [];
  for (const u of units) {
    if (u.composite) out.push(...leafSources(u.composite).map((x) => ({ ...x, kind: u.kind + ">" + x.kind })));
    else out.push({ source: u.source, kind: u.kind });
  }
  return out;
}

/** Tokens a translation must preserve exactly once each. */
export const tokensOf = (s) => (s.match(/\[\[[A-Z]+_\d+\]\]/g) || []).sort();
