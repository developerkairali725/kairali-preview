#!/usr/bin/env node
/**
 * AHV English candidate importer — WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001.
 *
 * Reads the READ-ONLY approved design package
 *   .../WOPS-AHV-CLAUDE-CONTINUATION-002/code-handoff/final-english-portable-candidate
 * and materialises it into this Next.js app as real, direct-path routes.
 *
 * It NEVER writes to the package. It writes two trees:
 *
 *   1. english-candidate/            (text records, committed, auditable)
 *        routes.json                 byte-exact copy of the package route table
 *        route-manifest.json         252 routes -> views + dataset + metadata
 *        view-manifest.json          136 views  -> sha256 / variant / deps
 *        asset-manifest.json         every served file, with source+served sha256
 *        language-lock-audit.json    KTAHV clinical-lock terms carried BY THE
 *                                    APPROVED SOURCE — reported, never rewritten
 *
 *   2. public/ahv/                   (the served payload)
 *        views/<id>.json             the 136 approved views, split into the exact
 *                                    template / logic / props the runtime needs
 *        support.js, image-slot.js, runtime/*.js, fonts/**, images/**, assets/**
 *
 * The approved .dc.html archive is NOT duplicated into the repo: the read-only
 * package is its authoritative, SHA-sealed home, and every payload records that
 * file's sha256 so any copy can be re-verified.
 *
 * Two deterministic transforms are applied to served bytes, and only these:
 *   a) URL prefixing — "assets/x" -> "/ahv/assets/x". Required because the
 *      package was authored to be served from its own directory while the app
 *      serves every route from "/".
 *   b) Robots neutralisation — the approved views carry "index, follow"; this
 *      is a STAGING build, so the served copy says "noindex, nofollow".
 *      Disabled with AHV_KEEP_ROBOTS=1. (The authoritative staging control is
 *      the X-Robots-Tag header + robots.txt, which client JS cannot override.)
 * Source bytes are untouched and both hashes are recorded per file.
 *
 * Usage:  node tools/import-english-candidate.mjs [--no-binaries]
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
// Read-only import of the fleet's own language gate, so the audit below and CI
// can never drift apart. Nothing in packages/ is written by this tool.
import { CLINICAL_LOCK_BANNED } from "../../../packages/compliance/src/rules.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "..");

const PKG =
  process.env.AHV_CANDIDATE_DIR ??
  "/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-CLAUDE-CONTINUATION-002/code-handoff/final-english-portable-candidate";

/**
 * Repo-local OVERLAY (2026-09-22): the Claude Design families finished after the
 * package was sealed live here — new view pairs, their datasets, and a
 * routes.json whose rows point at them. The overlay LAYERS over the package:
 * a file present in both is read from the overlay; everything else from the
 * package. The package itself is never written (Q-AHV-PACKAGE-EXTENSION).
 */
const OVERLAY =
  process.env.AHV_CANDIDATE_OVERLAY ?? path.join(SITE, "english-candidate", "package-overlay");
const src = (relPath) => {
  const o = path.join(OVERLAY, relPath);
  return fs.existsSync(o) ? o : path.join(PKG, relPath);
};

const OUT_TEXT = path.join(SITE, "english-candidate");
const OUT_PUBLIC = path.join(SITE, "public", "ahv");
const PUBLIC_PREFIX = "/ahv/";
const KEEP_ROBOTS = process.env.AHV_KEEP_ROBOTS === "1";
/** Sidecar name without the leading dot: Next.js 400s on dotfiles in public/. */
const SIDECAR_NAME = "ahv-image-slots.state.json";
const skipBinaries = process.argv.includes("--no-binaries");

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const rel = (p) => path.relative(SITE, p);
const writeFile = (p, data) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data);
};

/* ------------------------------------------------------------------ *
 * 1. Deterministic transforms
 * ------------------------------------------------------------------ */

/** Package-relative directories that become /ahv/<dir>/ when served. */
export const ROOTS = ["assets", "images", "fonts", "runtime"];

/** Rewrite document-relative package URLs to absolute /ahv/ URLs. */
export function rewriteUrls(text) {
  const roots = ROOTS.join("|");
  return text
    .replace(/(["'`(=])\.\/(support\.js|image-slot\.js)/g, `$1${PUBLIC_PREFIX}$2`)
    .replace(
      new RegExp(`(["'\`(])(?:\\./)?((?:${roots})/)`, "g"),
      (_m, q, dir) => `${q}${PUBLIC_PREFIX}${dir}`,
    );
}

/**
 * Staging safety: the served copy never claims index,follow.
 *
 * Two shapes are covered because the approved design writes its head from two
 * places: the view helmet's own <meta name="robots">, and the family
 * renderers' applyHead(), which reads a `robots` string out of the dataset.
 * Missing the second is why the first build shipped pages whose only robots
 * meta said "index, follow" — the runtime had overwritten the staging one.
 */
export function neutraliseRobots(text) {
  if (KEEP_ROBOTS) return text;
  return text.replace(
    /(<meta[^>]*\bname="robots"[^>]*\bcontent=")([^"]*)(")/gi,
    (_m, a, _c, b) => `${a}noindex, nofollow${b}`,
  );
}

/** Same lock, applied to the `robots` values carried inside a dataset file. */
export function neutraliseDatasetRobots(text) {
  if (KEEP_ROBOTS) return text;
  return text.replace(
    /(["']?robots["']?\s*:\s*")([^"]*)(")/g,
    (m, a, value, b) => (/noindex/i.test(value) ? m : `${a}noindex, nofollow${b}`),
  );
}

/** Component names a template pulls in with <dc-import name="X">. */
export function dcImports(text) {
  return [...text.matchAll(/<dc-import\b[^>]*\bname="([^"]+)"/gi)].map((m) => m[1]);
}

/**
 * The runtime resolves a sibling component as `./<encodeURIComponent(name)>.dc.html`
 * relative to the document, and consults window.__resources for that exact key
 * first. Direct-path routes are not served from the package directory, so every
 * component needs an entry in that map — without it the chrome header and
 * footer 404 and the runtime renders them as empty placeholders.
 */
export const componentKey = (name) => `./${encodeURIComponent(name)}.dc.html`;
export const componentUrl = (name) =>
  `${PUBLIC_PREFIX}components/${encodeURIComponent(name)}.dc.html`;

const decodeEntities = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

/**
 * Two approved views (the Article Reader pair) ship a `data-props` block that
 * is not valid JSON: one comma is missing between two adjacent strings in the
 * `route` option list. The runtime parses that attribute to build the prop
 * defaults, so the whole block is dropped — which is why every route in the
 * eleven-route reader family fell back to the family's default record and
 * rendered "Ayurvedic Products".
 *
 * This inserts the missing separator and NOTHING else, then re-validates. If
 * it still does not parse, the raw text is returned untouched and the view is
 * recorded as unrepaired rather than silently patched. `data-props` is the
 * editor's prop metadata — the source labels this very block "Prototype route
 * binding (not part of the public design)" — so no approved design copy,
 * markup or asset is affected. Every repair is recorded in view-manifest.json
 * and listed in BUILD-STATUS.md as a source exception.
 */
export function repairProps(props) {
  if (!props.trim()) return { props, repaired: 0, valid: true };
  const ok = (t) => {
    try {
      JSON.parse(t);
      return true;
    } catch {
      return false;
    }
  };
  if (ok(props)) return { props, repaired: 0, valid: true };
  let repaired = 0;
  const fixed = props.replace(/"(\s*)"/g, (_m, gap) => {
    repaired += 1;
    return `",${gap}"`;
  });
  if (ok(fixed)) return { props: fixed, repaired, valid: true };
  return { props, repaired: 0, valid: false };
}

export const viewId = (file) =>
  file
    .replace(/\.dc\.html$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* ------------------------------------------------------------------ *
 * 2. View parsing
 * ------------------------------------------------------------------ */

/**
 * Split an approved .dc.html view into the parts the page serves.
 *   template — exact inner HTML of <x-dc> (keeps <helmet>), URL-rewritten,
 *              with the dependency <script src> tags removed (the page boots
 *              them itself, in order, before the runtime)
 *   logic    — exact text of the <script data-dc-script> logic block
 *   props    — the data-props attribute, HTML-entity-decoded to plain JSON
 *   scripts  — ordered dependency script URLs, already /ahv/-prefixed
 *   head     — head facts lifted from the helmet
 */
export function parseView(src) {
  const open = /<x-dc(?:\s[^>]*)?>/.exec(src);
  if (!open) throw new Error("no <x-dc> element");
  const close = src.lastIndexOf("</x-dc>");
  if (close < 0) throw new Error("unterminated <x-dc>");

  const scriptRe = /<script\b[^>]*\bdata-dc-script\b[^>]*>([\s\S]*?)<\/script\s*>/i;
  const sm = scriptRe.exec(src);
  // The logic block carries asset paths of its own (gallery arrays, hero
  // images), so it needs the same document-relative -> /ahv/ rewrite the
  // template gets. Missing this is why the first boot 404'd on /assets/img/*.
  const logic = sm ? rewriteUrls(sm[1]) : "";
  const propsM = sm ? /\bdata-props="([^"]*)"/.exec(sm[0]) : null;
  const rawProps = propsM ? rewriteUrls(decodeEntities(propsM[1])) : "";
  const propsFix = repairProps(rawProps);
  const props = propsFix.props;

  let template = src.slice(open.index + open[0].length, close);
  const scripts = [];
  for (const m of template.matchAll(/<script\b[^>]*\ssrc="([^"]+)"[^>]*>/gi)) {
    const s = m[1].replace(/^\.\//, "");
    if (!scripts.includes(s)) scripts.push(s);
  }
  template = template.replace(
    /<script\b[^>]*\ssrc="[^"]+"[^>]*>\s*<\/script\s*>/gi,
    "",
  );
  template = neutraliseRobots(rewriteUrls(template));

  const pick = (re) => {
    const m = re.exec(src);
    return m ? decodeEntities(m[1]) : null;
  };
  return {
    template,
    logic,
    props,
    propsRepaired: propsFix.repaired,
    propsValid: propsFix.valid,
    // A template may load a library from an absolute URL (the How To Reach
    // maps pull d3 + topojson from unpkg); only package-relative paths are
    // served from /ahv/. Prefixing an absolute URL produced /ahv/https://…
    scripts: scripts.map((s) => (/^https?:\/\//i.test(s) ? s : PUBLIC_PREFIX + s)),
    head: {
      title: pick(/<title>([\s\S]*?)<\/title>/i),
      description: pick(/<meta[^>]*\bname="description"[^>]*\bcontent="([^"]*)"/i),
      canonical: pick(/<link[^>]*\brel="canonical"[^>]*\bhref="([^"]*)"/i),
      htmlLang: pick(/<html[^>]*\blang="([^"]*)"/i) ?? "en-US",
      ogTitle: pick(/<meta[^>]*\bproperty="og:title"[^>]*\bcontent="([^"]*)"/i),
      ogDescription: pick(/<meta[^>]*\bproperty="og:description"[^>]*\bcontent="([^"]*)"/i),
      ogImage: pick(/<meta[^>]*\bproperty="og:image"[^>]*\bcontent="([^"]*)"/i),
      ogType: pick(/<meta[^>]*\bproperty="og:type"[^>]*\bcontent="([^"]*)"/i),
    },
  };
}

/* ------------------------------------------------------------------ *
 * 3. Dataset evaluation — per-route metadata, nothing invented
 * ------------------------------------------------------------------ */

function evalDatasets(files) {
  const globals = {};
  for (const file of files) {
    const win = {};
    const sandbox = {
      window: win,
      globalThis: win,
      document: { createElement: () => ({ setAttribute() {}, style: {} }) },
      navigator: { userAgent: "node" },
      location: { search: "", pathname: "/", href: "/" },
      console: { log() {}, warn() {}, error() {} },
    };
    try {
      vm.runInNewContext(fs.readFileSync(src(file), "utf8"), sandbox, {
        timeout: 15000,
      });
    } catch (err) {
      console.warn(`  ! dataset ${file} did not evaluate: ${err.message}`);
      continue;
    }
    for (const [k, v] of Object.entries(win))
      if (v && typeof v === "object") globals[k] = v;
  }
  return globals;
}

/**
 * Deep-search the evaluated datasets for the record that owns `routePath`.
 * A record owns a route when it carries that exact `path` AND a `metadata`
 * object. Nothing is guessed: a route with no matching record falls back to
 * its own view's helmet.
 */
function findRouteRecord(globals, routePath, preferredDataset) {
  // The route's OWN dataset is searched first: two datasets can both carry a
  // record whose path is this route (a sibling that links to it), and the
  // first one met in file order is not necessarily the owner.
  if (preferredDataset && globals[preferredDataset]) {
    const own = findRouteRecord({ [preferredDataset]: globals[preferredDataset] }, routePath);
    if (own) return own;
  }
  let found = null;
  const seen = new Set();
  const walk = (node, depth) => {
    if (found || !node || typeof node !== "object" || depth > 8 || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      for (const v of node) walk(v, depth + 1);
      return;
    }
    if (node.path === routePath && node.metadata && typeof node.metadata === "object") {
      found = node;
      return;
    }
    for (const v of Object.values(node)) walk(v, depth + 1);
  };
  walk(globals, 0);
  return found;
}

/* ------------------------------------------------------------------ *
 * 4. Language-lock audit (report, never rewrite)
 * ------------------------------------------------------------------ */

/**
 * The banned-word list is NOT re-typed here: it is imported from the fleet's
 * own gate (packages/compliance), so this audit and CI can never disagree.
 */
const BANNED = CLINICAL_LOCK_BANNED.en;

/**
 * Reduce an approved template to the words a visitor actually reads: drop
 * <style>/<script> blocks, drop every tag (and therefore every attribute,
 * class name and inline CSS), keep alt/title text, collapse whitespace.
 * Without this, "white-space" counts as "spa" and an Escape-key handler counts
 * as "escape" — noise that would bury the real findings.
 */
export function visibleText(html) {
  return html
    .replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/\balt="([^"]*)"/gi, " $1 ")
    .replace(/\btitle="([^"]*)"/gi, " $1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{\{[^}]*\}\}/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ");
}

function auditLanguageLock(text) {
  const hits = {};
  for (const word of BANNED) {
    const n = (text.match(new RegExp(`\\b${word}\\b`, "gi")) ?? []).length;
    if (n) hits[word] = n;
  }
  return hits;
}

/* ------------------------------------------------------------------ *
 * 5. Payload collection
 * ------------------------------------------------------------------ */

const TEXT_EXT = new Set([".js", ".css", ".json", ".svg", ".txt", ".html"]);

/**
 * Everything the package can serve, copied wholesale.
 *
 * This deliberately does NOT try to infer which files are referenced, because
 * on this design that inference cannot be made sound. The approved views build
 * image URLs by CONCATENATION — `const W = 'assets/img/'; ... W + 'badge.png'`
 * — so a scan of string literals sees a bare directory and a bare filename and
 * can never join them. Other references carry percent-escapes or parentheses in
 * the filename. A first pass that filtered by reference shipped 462/504 states
 * and 404'd nine real files on 42 of them.
 *
 * Copying the four payload roots entire makes a missing asset structurally
 * impossible instead of merely unlikely. It costs about 40 MB over the filtered
 * set on a payload that is already an owner decision (see BUILD-STATUS.md), and
 * every file copied is recorded with both hashes in asset-manifest.json.
 */
/**
 * Provenance/evidence files that live inside the asset roots but are never
 * fetched by a page. The owner's instruction keeps originals, archives and
 * evidence out of public/ and out of the deployment, so these are the one
 * deliberate exclusion from the wholesale copy. Licences ARE copied.
 */
const PAYLOAD_EXCLUDE = new Set(["assets/img/SOURCES.txt", "assets/icons-inclusion-256/README.md"]);

function collectPackageRefs() {
  // Both trees are walked; a relative path is listed once, and src() resolves
  // it overlay-first when the file is read.
  const out = new Set();
  const walk = (base, relDir) => {
    const abs = path.join(base, relDir);
    if (!fs.existsSync(abs)) return;
    for (const name of fs.readdirSync(abs)) {
      if (name.startsWith(".")) continue;
      const rel = `${relDir}/${name}`;
      if (PAYLOAD_EXCLUDE.has(rel)) continue;
      const st = fs.statSync(path.join(base, rel));
      if (st.isDirectory()) walk(base, rel);
      else if (st.isFile()) out.add(rel);
    }
  };
  for (const root of ROOTS) {
    walk(PKG, root);
    walk(OVERLAY, root);
  }
  return [...out].sort();
}

/* ------------------------------------------------------------------ *
 * 6. Main
 * ------------------------------------------------------------------ */

function main() {
  if (!fs.existsSync(PKG)) {
    console.error(`Design package not found:\n  ${PKG}`);
    process.exit(2);
  }
  console.log(`source package : ${PKG}`);
  console.log(`overlay        : ${fs.existsSync(OVERLAY) ? rel(OVERLAY) : "(none)"}`);
  console.log(`text records   : ${rel(OUT_TEXT)}`);
  console.log(`served payload : ${rel(OUT_PUBLIC)}`);

  const routesRaw = fs.readFileSync(src("routes.json"));
  const routes = JSON.parse(routesRaw.toString("utf8")).routes;

  const viewFiles = [];
  for (const r of routes)
    for (const v of r.views ?? []) if (!viewFiles.includes(v)) viewFiles.push(v);
  viewFiles.sort();

  /* ---- views -> payloads ---- */
  fs.rmSync(path.join(OUT_PUBLIC, "views"), { recursive: true, force: true });
  const viewManifest = {};
  const parsedByFile = new Map();
  const idsSeen = new Map();
  for (const file of viewFiles) {
    const buf = fs.readFileSync(src(file));
    const parsed = parseView(buf.toString("utf8"));
    const id = viewId(file);
    if (idsSeen.has(id)) throw new Error(`view id collision: ${id} (${file} vs ${idsSeen.get(id)})`);
    idsSeen.set(id, file);
    parsedByFile.set(file, { id, parsed });

    const payload = {
      id,
      file,
      sourceSha256: sha256(buf),
      variant: /Mobile\.dc\.html$/i.test(file) ? "mobile" : "desktop",
      template: parsed.template,
      logic: parsed.logic,
      props: parsed.props,
      scripts: parsed.scripts,
    };
    const out = Buffer.from(JSON.stringify(payload), "utf8");
    writeFile(path.join(OUT_PUBLIC, "views", `${id}.json`), out);

    viewManifest[file] = {
      id,
      payload: `${PUBLIC_PREFIX}views/${id}.json`,
      sourceSha256: payload.sourceSha256,
      sourceBytes: buf.length,
      payloadBytes: out.length,
      variant: payload.variant,
      scripts: parsed.scripts,
      hasLogic: parsed.logic.trim().length > 0,
      hasRouteProp: /"route"\s*:/.test(parsed.props),
      propsRepaired: parsed.propsRepaired,
      propsValid: parsed.propsValid,
      title: parsed.head.title,
    };
  }
  const repairedViews = Object.entries(viewManifest).filter(([, v]) => v.propsRepaired > 0);
  const brokenProps = Object.entries(viewManifest).filter(([, v]) => !v.propsValid);
  console.log(`views          : ${viewFiles.length} payloads written`);
  if (repairedViews.length)
    console.log(
      `  data-props repaired (missing JSON separator, recorded as a source exception): ${repairedViews.map(([k]) => k).join(", ")}`,
    );
  if (brokenProps.length)
    console.warn(`  ! data-props still unparseable: ${brokenProps.map(([k]) => k).join(", ")}`);

  /* ---- shared chrome components (<dc-import>) ---- */
  // Transitive: a component may import another. The approved package has two
  // (Chrome Header, Chrome Footer) but the walk is general so a third cannot
  // be missed silently.
  fs.rmSync(path.join(OUT_PUBLIC, "components"), { recursive: true, force: true });
  const componentMap = {};
  const queue = [];
  for (const file of viewFiles)
    for (const name of dcImports(fs.readFileSync(src(file), "utf8")))
      if (!queue.includes(name)) queue.push(name);
  const componentManifest = {};
  for (let i = 0; i < queue.length; i += 1) {
    const name = queue[i];
    const srcPath = src(`${name}.dc.html`);
    if (!fs.existsSync(srcPath)) {
      console.warn(`  ! <dc-import name="${name}"> has no ${name}.dc.html in the package`);
      continue;
    }
    const buf = fs.readFileSync(srcPath);
    const text = buf.toString("utf8");
    for (const nested of dcImports(text)) if (!queue.includes(nested)) queue.push(nested);
    // Served raw: the runtime fetches the file and regex-extracts <x-dc> from
    // the text, so the whole file gets the same URL rewrite the views get.
    const out = Buffer.from(neutraliseRobots(rewriteUrls(text)), "utf8");
    writeFile(path.join(OUT_PUBLIC, "components", `${name}.dc.html`), out);
    componentMap[componentKey(name)] = componentUrl(name);
    componentManifest[name] = {
      url: componentUrl(name),
      resourceKey: componentKey(name),
      sourceSha256: sha256(buf),
      servedSha256: sha256(out),
      sourceBytes: buf.length,
    };
  }
  console.log(`components     : ${Object.keys(componentMap).length} (${queue.join(", ") || "none"})`);

  /* ---- routes -> manifest ---- */
  const allData = [...new Set([
    ...fs.readdirSync(path.join(PKG, "assets")),
    ...(fs.existsSync(path.join(OVERLAY, "assets")) ? fs.readdirSync(path.join(OVERLAY, "assets")) : []),
  ])]
    .filter((f) => /-data\.js$/.test(f))
    .map((f) => "assets/" + f)
    .sort();
  const globals = evalDatasets(allData);

  const routeManifest = [];
  const languageAudit = [];
  let fromDataset = 0;
  const datasetRoutesMissingProp = [];
  for (const r of routes) {
    const views = r.views ?? [];
    const mobileFile = views.find((v) => /Mobile\.dc\.html$/i.test(v)) ?? null;
    const desktopFile = views.find((v) => v !== mobileFile) ?? views[0] ?? null;
    const desktop = desktopFile ? parsedByFile.get(desktopFile) : null;
    const mobile = mobileFile ? parsedByFile.get(mobileFile) : null;

    const dsRecord = findRouteRecord(globals, r.path, r.dataset);
    const dsMeta = dsRecord?.metadata ?? null;
    if (dsMeta) fromDataset += 1;
    if (r.dataset && desktop && !/"route"\s*:/.test(desktop.parsed.props))
      datasetRoutesMissingProp.push(r.path);

    const helmet = desktop?.parsed.head ?? {};
    routeManifest.push({
      path: r.path,
      segments: r.path.replace(/^\/|\/$/g, "").split("/").filter(Boolean),
      desktopView: desktop?.id ?? null,
      mobileView: mobile?.id ?? null,
      dataset: r.dataset ?? null,
      metadataSource: dsMeta ? "dataset" : "view-helmet",
      metadata: {
        title: dsMeta?.title ?? helmet.title ?? null,
        description: dsMeta?.description ?? helmet.description ?? null,
        canonical: dsMeta?.canonical ?? helmet.canonical ?? null,
        ogTitle: dsMeta?.og?.title ?? helmet.ogTitle ?? null,
        ogDescription: dsMeta?.og?.description ?? helmet.ogDescription ?? null,
        ogImage: dsMeta?.og?.image?.sourceUrl ?? helmet.ogImage ?? null,
        ogType: dsMeta?.og?.type ?? helmet.ogType ?? null,
      },
    });

    // What the visitor reads on this route: the view's own copy plus, for a
    // dataset-bound route, the record the family renderer resolves for it.
    const surface = [
      visibleText(desktop?.parsed.template ?? ""),
      visibleText(mobile?.parsed.template ?? ""),
      dsRecord ? JSON.stringify(dsRecord) : "",
      routeManifest.at(-1).metadata.title ?? "",
      routeManifest.at(-1).metadata.description ?? "",
    ].join("\n");
    const hits = auditLanguageLock(surface);
    if (Object.keys(hits).length)
      languageAudit.push({
        path: r.path,
        surface: dsRecord ? "view + dataset record" : "view",
        hits,
      });
  }
  console.log(
    `routes         : ${routeManifest.length} (metadata from dataset ${fromDataset}, from helmet ${routeManifest.length - fromDataset})`,
  );
  if (datasetRoutesMissingProp.length)
    console.warn(
      `  ! dataset-bound routes whose view has no "route" prop: ${datasetRoutesMissingProp.length}`,
      datasetRoutesMissingProp.slice(0, 10),
    );

  /* ---- static payload ---- */
  const refs = collectPackageRefs();
  const assetManifest = [];
  let copied = 0, bytes = 0, rewritten = 0;
  const emit = (srcRelPath, buf, outBuf) => {
    assetManifest.push({
      path: PUBLIC_PREFIX + srcRelPath,
      source: srcRelPath,
      bytes: outBuf.length,
      sourceSha256: sha256(buf),
      servedSha256: sha256(outBuf),
      transform: outBuf.equals(buf) ? "byte-exact" : "url-prefix",
      binary: !TEXT_EXT.has(path.extname(srcRelPath).toLowerCase()),
    });
  };
  for (const r of refs) {
    const buf = fs.readFileSync(src(r));
    const ext = path.extname(r).toLowerCase();
    const isText = TEXT_EXT.has(ext);
    const isFontCss = r.startsWith("fonts/") && ext === ".css"; // sibling-relative already
    let outBuf = buf;
    if (isText && !isFontCss) {
      const before = buf.toString("utf8");
      let after = rewriteUrls(before);
      // Datasets carry the per-route head contract the family renderers apply
      // at runtime, robots included.
      if (/-data\.js$/.test(r)) after = neutraliseDatasetRobots(after);
      if (after !== before) rewritten += 1;
      outBuf = Buffer.from(after, "utf8");
    }
    if (!skipBinaries || isText) {
      writeFile(path.join(OUT_PUBLIC, r), outBuf);
      copied += 1;
      bytes += outBuf.length;
    }
    emit(r, buf, outBuf);
  }
  for (const entry of ["support.js", "image-slot.js"]) {
    const buf = fs.readFileSync(src(entry));
    let t = rewriteUrls(buf.toString("utf8"));
    if (entry === "image-slot.js") {
      // The editor sidecar is a document sibling in the package; here every
      // route is served from "/", so point it at the payload directory. The
      // leading dot also goes: Next.js answers 400 for dotfiles under public/.
      // The slot is read-only in this export (the package's own portable guard).
      t = t.replace(
        /const STATE_FILE = '\.image-slots\.state\.json';/,
        `const STATE_FILE = '${PUBLIC_PREFIX}${SIDECAR_NAME}';`,
      );
    }
    const outBuf = Buffer.from(t, "utf8");
    writeFile(path.join(OUT_PUBLIC, entry), outBuf);
    copied += 1;
    bytes += outBuf.length;
    emit(entry, buf, outBuf);
  }
  const sidecarSrc = src(".image-slots.state.json");
  writeFile(
    path.join(OUT_PUBLIC, SIDECAR_NAME),
    fs.existsSync(sidecarSrc) ? fs.readFileSync(sidecarSrc) : Buffer.from("{}"),
  );

  /* ---- accepted preview layer (part of the verified package) ---- */
  // preview/english-responsive-override.css + portable-preview.js ARE the
  // approved narrow-viewport correction: the shared footer newsletter row at
  // <=360px, and a Home-Mobile-only header fix behind the marker attribute.
  // They are carried over byte-for-byte (URL rewrite only) and applied by the
  // same marker contract — this build invents no layout fix of its own.
  for (const f of ["english-responsive-override.css", "portable-preview.js"]) {
    const previewSrc = src(path.join("preview", f));
    if (!fs.existsSync(previewSrc)) {
      console.warn(`  ! accepted preview layer missing from package: preview/${f}`);
      continue;
    }
    const buf = fs.readFileSync(previewSrc);
    const outBuf = Buffer.from(rewriteUrls(buf.toString("utf8")), "utf8");
    writeFile(path.join(OUT_PUBLIC, "preview", f), outBuf);
    copied += 1;
    bytes += outBuf.length;
    emit(`preview/${f}`, buf, outBuf);
  }

  /* ---- prune: the payload is exactly what this run wrote ---- */
  // Without this, a file the package no longer ships — or one this tool has
  // since decided not to serve — survives from an earlier run and is quietly
  // deployed. That is how assets/img/SOURCES.txt (provenance, explicitly kept
  // out of public/) stayed in the payload after being excluded.
  const expected = new Set([
    ...assetManifest.map((a) => a.source),
    SIDECAR_NAME,
    ...Object.keys(componentManifest).map((n) => `components/${n}.dc.html`),
    ...Object.values(viewManifest).map((v) => `views/${v.id}.json`),
  ]);
  let pruned = 0;
  const prune = (relDir) => {
    const abs = relDir ? path.join(OUT_PUBLIC, relDir) : OUT_PUBLIC;
    if (!fs.existsSync(abs)) return;
    for (const name of fs.readdirSync(abs)) {
      const rel = relDir ? `${relDir}/${name}` : name;
      const full = path.join(OUT_PUBLIC, rel);
      if (fs.statSync(full).isDirectory()) {
        prune(rel);
        if (!fs.readdirSync(full).length) fs.rmdirSync(full);
      } else if (!expected.has(rel)) {
        fs.unlinkSync(full);
        pruned += 1;
      }
    }
  };
  if (!skipBinaries) prune("");
  if (pruned) console.log(`pruned         : ${pruned} stale file(s) from a previous run`);

  /* ---- records ---- */
  const stamp = new Date().toISOString();
  const head = {
    taskId: "WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001",
    source: path.basename(PKG),
    generated: stamp,
  };
  writeFile(path.join(OUT_TEXT, "routes.json"), routesRaw);
  writeFile(
    path.join(OUT_TEXT, "view-manifest.json"),
    JSON.stringify({ ...head, views: viewManifest }, null, 1) + "\n",
  );
  writeFile(
    path.join(OUT_TEXT, "component-map.json"),
    JSON.stringify(
      {
        ...head,
        note:
          "window.__resources entries the page installs before support.js loads, so the runtime resolves each <dc-import> sibling from /ahv/components/ instead of the document root.",
        resources: componentMap,
        components: componentManifest,
      },
      null,
      1,
    ) + "\n",
  );
  writeFile(
    path.join(OUT_TEXT, "route-manifest.json"),
    JSON.stringify(
      {
        ...head,
        activeEnglishRoutes: routeManifest.length,
        distinctViews: viewFiles.length,
        deferred: ["/ru/", "/treatment-in-kerala-russian.html"],
        routes: routeManifest,
      },
      null,
      1,
    ) + "\n",
  );
  const binaryBytes = assetManifest.filter((a) => a.binary).reduce((n, a) => n + a.bytes, 0);
  writeFile(
    path.join(OUT_TEXT, "asset-manifest.json"),
    JSON.stringify(
      {
        ...head,
        publicPrefix: PUBLIC_PREFIX,
        totals: {
          files: assetManifest.length,
          bytes,
          binaryFiles: assetManifest.filter((a) => a.binary).length,
          binaryBytes,
        },
        note:
          "public/ahv/ is regenerated from the read-only design package by tools/import-english-candidate.mjs. This manifest is the in-repo record of what is served and of its provenance hashes.",
        files: assetManifest,
      },
      null,
      1,
    ) + "\n",
  );
  const totals = {};
  for (const row of languageAudit)
    for (const [w, n] of Object.entries(row.hits)) totals[w] = (totals[w] ?? 0) + n;
  writeFile(
    path.join(OUT_TEXT, "language-lock-audit.json"),
    JSON.stringify(
      {
        ...head,
        rule: 'CLAUDE.md "KTAHV LANGUAGE LOCK" — banned words on KTAHV pages',
        bannedWords: BANNED,
        method:
          "Word-boundary scan of the served desktop+mobile templates and the resolved per-route title/description. Reported only: the approved design is never rewritten by this tool (owner instruction, 15 Sep 2026).",
        routesWithHits: languageAudit.length,
        routesTotal: routeManifest.length,
        totalsByWord: totals,
        routes: languageAudit,
      },
      null,
      1,
    ) + "\n",
  );

  console.log(
    `payload files  : ${copied} (${(bytes / 1048576).toFixed(1)} MB; binaries ${(binaryBytes / 1048576).toFixed(1)} MB; url-rewritten ${rewritten})`,
  );
  console.log(
    `language lock  : ${languageAudit.length}/${routeManifest.length} routes carry banned words — see english-candidate/language-lock-audit.json`,
  );
  console.log("done.");
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  main();
}
