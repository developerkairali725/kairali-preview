#!/usr/bin/env node
/**
 * shopify-catalog-lint — the always-recheck mechanism for store content the
 * repo cannot hook (CLAUDE.md Shopify Track Doctrine rules (l) + (p);
 * SHOPIFY_TRACK_CONTEXT §7; M2_SHOPIFY_SETUP_PROMPT Phase 5; owner ruled BUILD
 * 18 Jul 2026 — D-O1, weekend sprint lane O1).
 *
 * WHY THIS EXISTS
 * ---------------
 * Product descriptions live in Shopify and get edited by humans, so no
 * pre-push hook can gate them. This script is the recheck: it reads the
 * catalog (offline export or read-only Admin API), runs the compliance engine
 * plus catalog-integrity checks, and emits a timestamped findings report —
 * machine-readable AND human-readable. FINDINGS ONLY. It never fixes anything.
 *
 * THE LAW THIS FILE OBEYS (CLAUDE.md doctrine j–s)
 *   · (k) the agent is READ-ONLY in any Shopify admin. Structurally enforced:
 *     the ONE network call site in this file (`shopifyGet`) hard-codes GET and
 *     the test suite asserts no other fetch/method exists in this source.
 *   · (l)/(p) findings route to the engineer — NEVER auto-fix. This file has
 *     no write path to any store, by construction.
 *   · Tokens come from env only (Shadab supplies via Sunaj's secure channel;
 *     M2 Phase 2 keeps them in ~/work/.env.shopify, never in git). No token
 *     is ever hardcoded, defaulted, or printed.
 *
 * TWO MODES
 *   FILE mode  node scripts/shopify-catalog-lint.mjs --file <export.csv|.json>
 *              [--store in|com] [--currency INR]
 *              Lints a Shopify product CSV export, or a JSON payload
 *              (Admin-API product shape: bare array, {products:[…]}, or
 *              {products, custom_collections, smart_collections, pages}).
 *   API mode   node scripts/shopify-catalog-lint.mjs [--store in|com]
 *              Read-only Admin API pulls (products, collections, pages, shop
 *              currency) for every configured store. A store whose token env
 *              var is absent is a LOUD SKIP, never a silent pass: the skip is
 *              printed per store, and if NOTHING could be linted the run exits
 *              3 (a code automation can never mistake for "clean").
 *
 * ENV CONVENTIONS (defined here — no rollout doc names them; the referenced
 * docs/process/shopify-agentic-rollout-instructions-v2.md does not exist in
 * the repo as of 18 Jul 2026, so these follow SHOPIFY_TRACK_CONTEXT U1's
 * two-store resolution, Ambuj 17 Jul 2026):
 *   SHOPIFY_IN_STORE_DOMAIN    default kairali-products.myshopify.com  (.in)
 *   SHOPIFY_IN_ADMIN_TOKEN     Admin API READ token — no default, ever
 *   SHOPIFY_IN_EXPECTED_CURRENCY   optional; arms the currency check
 *   SHOPIFY_COM_STORE_DOMAIN   default ayurvedakairali.myshopify.com   (.com)
 *   SHOPIFY_COM_ADMIN_TOKEN    Admin API READ token — no default, ever
 *   SHOPIFY_COM_EXPECTED_CURRENCY  optional; arms the currency check
 *   SHOPIFY_API_VERSION        default 2025-07
 * Expected currencies are NOT hardcoded (HARD GATE 6: never invent facts) —
 * declare them via env/--currency or the check reports itself NOT COVERED.
 *
 * THE CHECKS (derived from CLAUDE.md (l)/(p)/(k) + HARD GATE 6, M2 Phase 5,
 * SHOPIFY_TRACK_CONTEXT §4 + §7, gates/registry.yaml catalog-compliance-audit
 * + price-inventory-integrity, .claude/agents/catalog-compliance.md)
 *   ERROR (must fix — the catalog is wrong or legally exposed as it stands):
 *     missing-sku · duplicate-sku · missing-handle · invalid-handle ·
 *     duplicate-handle · empty-description · missing-image · missing-price ·
 *     price-not-numeric · zero-price · negative-price · compare-at-not-higher
 *     (a compare-at ≤ price is a fake-sale inversion) · banned-claim (DMR
 *     schedule disease × claim verb, negation-aware) · banned-claim-phrase
 *     (hype/absolute claims + packages/compliance cure patterns, negation-
 *     aware) · urgency-claim ("results in N days" is a claim — banned unless
 *     substantiated, SHOPIFY_TRACK_CONTEXT §4) · currency-mixed ·
 *     currency-mismatch · every ERROR from packages/compliance lintText
 *     (banned filler, locked facts, locked counts, brand voice).
 *   WARN (should fix — routed, prioritized):
 *     thin-description · missing-image-alt · missing-product-type ·
 *     missing-vendor · missing-tags · missing-seo-title ·
 *     missing-seo-description · hsn-missing (.in only) · urgency-review
 *     (scarcity lines whose literal truth only a human can verify) ·
 *     empty-page-body.
 *   INFO: negation-suppressed claim matches — nothing disappears silently
 *     (content-lint §2.7 r22 doctrine).
 *
 * ONE LAW, ONE IMPLEMENTATION (content-lint.mjs precedent)
 *   · Register/filler/locked-facts come from packages/compliance `lintText()`
 *     — called, not copied. Its `cure-claims` hits are EXCLUDED and re-run
 *     through the negation engine instead: the flat /\bcures?\b/ pattern flags
 *     "is not a cure for cancer", and a lint that reddens honest drafting
 *     trains reviewers to click past it (the §3.3 failure, documented).
 *   · The claims engine (findClaims + negation + interrogatives) is imported
 *     from scripts/content-lint.mjs. The DMR disease×verb core is the shared
 *     floor of BOTH market lenses (.in DMR/ASCI and US FDA/FTC "no disease
 *     claims"); market-specific nuance beyond it stays with the
 *     catalog-compliance agent (.claude/agents/catalog-compliance.md).
 *
 * WHAT IT DOES NOT DO (honest absences, printed as NOT COVERED per run)
 *   · CSV exports carry no collections/pages/currency/metafields — those
 *     checks arm only when the source can express them (API mode, or JSON
 *     with the fields present).
 *   · Admin REST product payloads carry no SEO title/description — that check
 *     arms in CSV/JSON sources that carry the fields.
 *   · It cannot verify that an urgency line is TRUE — it routes the line to a
 *     human (urgency-review).
 *   · It is NOT wired into CI or the Monday ritual — that wiring is a
 *     separate, ratified change (O6 precedent, PR #122).
 *
 * SELF-TEST: control probes (a known-clean catalog and known-bad catalogs)
 * run through the REAL engine before any result is reported. If a probe
 * fails, the run reports SCANNER BROKEN and exits 2 — it never reports clean
 * (content-lint §2.7 r23 doctrine: a silently broken lint is worse than none).
 *
 * OUTPUT: <out-dir>/<YYYY-MM-DD>-<HHMMSS>-IST-catalog-lint-<mode>[-<store>].md
 * and …findings.json (default out-dir docs/reports/shopify-catalog-lint/),
 * plus a week-over-week counts delta against the previous findings.json.
 *
 * EXIT CODES (the code reflects findings severity — automation-safe)
 *   0 = linted, clean (info only)      2 = ERROR findings, or broken probe
 *   3 = NOTHING LINTED (all sources skipped — never mistakable for a pass)
 *   4 = WARN findings only             1 = harness error (bad file, bad args)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

import { lintText } from "../packages/compliance/src/lint.js";
import { CURE_CLAIM_PATTERNS } from "../packages/compliance/src/rules.js";
import {
  findClaims, CLAIM_VERBS, DMR_SCHEDULE_DISEASES, BANNED_CLAIM_PHRASES,
  isNegated, isInterrogative,
} from "./content-lint.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const DEFAULT_OUT_DIR = "docs/reports/shopify-catalog-lint";
export const DEFAULT_API_VERSION = "2025-07";

/**
 * Store registry — env var NAMES live here; token VALUES never do.
 * Default domains are the U1 facts (Ambuj's email, 17 Jul 2026, recorded in
 * SHOPIFY_TRACK_CONTEXT §3) — read from the doc, not invented. Live admin
 * overrides docs (rule j): an env override always wins.
 */
export const STORES = {
  in: {
    key: "in",
    label: "kairaliproducts.in (India)",
    domainEnv: "SHOPIFY_IN_STORE_DOMAIN",
    tokenEnv: "SHOPIFY_IN_ADMIN_TOKEN",
    currencyEnv: "SHOPIFY_IN_EXPECTED_CURRENCY",
    defaultDomain: "kairali-products.myshopify.com",
    lens: "DMR Act + ASCI; HSN/GST fields expected",
  },
  com: {
    key: "com",
    label: "kairaliproducts.com (international)",
    domainEnv: "SHOPIFY_COM_STORE_DOMAIN",
    tokenEnv: "SHOPIFY_COM_ADMIN_TOKEN",
    currencyEnv: "SHOPIFY_COM_EXPECTED_CURRENCY",
    defaultDomain: "ayurvedakairali.myshopify.com",
    lens: "FDA/FTC structure-function + EU health-claims",
  },
};

/** @typedef {"error"|"warn"|"info"} Severity */
/** @typedef {{severity:Severity, rule:string, store:string|null, kind:string,
 *             handle:string, where:string, message:string, excerpt:string}} Finding */

// ─────────────────────────────────────────────────────────────────────────────
// PARSING — CSV (RFC 4180: quotes, embedded commas/newlines) and JSON, both
// normalized to one canonical product model so the engine is mode-blind.
// ─────────────────────────────────────────────────────────────────────────────

/** @param {string} text @returns {string[][]} */
export function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; continue; }
        inQ = false; continue;
      }
      field += c; continue;
    }
    if (c === '"') { inQ = true; continue; }
    if (c === ",") { row.push(field); field = ""; continue; }
    if (c === "\r") continue;
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; continue; }
    field += c;
  }
  if (field !== "" || row.length > 0) { row.push(field); rows.push(row); }
  // Drop fully-empty trailing rows (a final newline is not a record).
  return rows.filter((r) => r.some((v) => v !== ""));
}

/** Column aliases for fields Shopify names inconsistently across export eras. */
const HS_COLUMNS = ["Variant Harmonized System Code", "Variant HS Code", "HS Code"];
const CURRENCY_COLUMNS = ["Currency", "Variant Price Currency", "Price Currency"];

/**
 * Group Shopify product-CSV rows (one row per variant/image) into products.
 * @param {string[][]} raw parsed CSV rows including header
 * @returns {{products:object[], capabilities:object, errors:string[]}}
 */
export function productsFromCsv(raw) {
  const errors = [];
  if (raw.length === 0) return { products: [], capabilities: {}, errors: ["CSV is empty"] };
  const header = raw[0];
  const idx = new Map(header.map((h, i) => [h, i]));
  if (!idx.has("Handle")) return { products: [], capabilities: {}, errors: ['CSV has no "Handle" column — not a Shopify product export'] };
  const col = (row, name) => (idx.has(name) ? (row[idx.get(name)] ?? "").trim() : undefined);
  const first = (row, names) => {
    for (const n of names) if (idx.has(n)) return col(row, n);
    return undefined;
  };
  const capabilities = {
    seo: idx.has("SEO Title") || idx.has("SEO Description"),
    hs: HS_COLUMNS.some((c) => idx.has(c)),
    currency: CURRENCY_COLUMNS.some((c) => idx.has(c)),
    surfaces: false, // a product CSV never carries collections/pages
  };

  /** @type {Map<string, object>} */
  const byHandle = new Map();
  const order = [];
  for (const row of raw.slice(1)) {
    const handle = col(row, "Handle") ?? "";
    let p = byHandle.get(handle);
    if (!p) {
      p = {
        handle, title: "", bodyHtml: "", vendor: "", productType: "", tags: [],
        status: "", published: undefined, variants: [], images: [],
        seoTitle: undefined, seoDescription: undefined, duplicateHandleBlocks: 0,
      };
      byHandle.set(handle, p);
      order.push(p);
    }
    const title = col(row, "Title");
    if (title) {
      // A second titled block for a handle that already has a title is a
      // duplicate-handle record, not a continuation row.
      if (p.title) p.duplicateHandleBlocks += 1;
      else {
        p.title = title;
        p.bodyHtml = col(row, "Body (HTML)") ?? "";
        p.vendor = col(row, "Vendor") ?? "";
        p.productType = col(row, "Type") ?? col(row, "Product Category") ?? "";
        p.tags = (col(row, "Tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean);
        p.status = col(row, "Status") ?? "";
        const pub = col(row, "Published");
        p.published = pub === undefined ? undefined : /^true$/i.test(pub);
        if (capabilities.seo) {
          p.seoTitle = col(row, "SEO Title") ?? "";
          p.seoDescription = col(row, "SEO Description") ?? "";
        }
      }
    }
    // Variant row: any of SKU / price / option value present.
    const sku = col(row, "Variant SKU") ?? "";
    const price = col(row, "Variant Price") ?? "";
    const opt = col(row, "Option1 Value") ?? "";
    if (sku !== "" || price !== "" || opt !== "") {
      p.variants.push({
        sku,
        price,
        compareAtPrice: col(row, "Variant Compare At Price") ?? "",
        hsCode: capabilities.hs ? (first(row, HS_COLUMNS) ?? "") : undefined,
        currency: capabilities.currency ? (first(row, CURRENCY_COLUMNS) ?? "") : undefined,
      });
    }
    const img = col(row, "Image Src") ?? "";
    if (img !== "") p.images.push({ src: img, alt: col(row, "Image Alt Text") ?? "" });
  }
  return { products: order, capabilities, errors };
}

/**
 * Normalize Admin-API-shaped JSON. Accepts a bare product array, {products},
 * or {products, custom_collections, smart_collections, pages}.
 * @returns {{products:object[], surfaces:object[], capabilities:object, errors:string[]}}
 */
export function productsFromJson(data) {
  const errors = [];
  const root = Array.isArray(data) ? { products: data } : (data ?? {});
  const list = Array.isArray(root.products) ? root.products : [];
  if (!Array.isArray(root.products) && !Array.isArray(data)) {
    errors.push('JSON has no "products" array (expected Admin API shape: [{…}] or {products:[…]})');
  }
  let sawSeo = false, sawHs = false, sawCurrency = false;
  const products = list.map((p) => {
    if (p.seo_title !== undefined || p.seo_description !== undefined ||
        p.metafields_global_title_tag !== undefined || p.metafields_global_description_tag !== undefined) sawSeo = true;
    const variants = (p.variants ?? []).map((v) => {
      if (v.harmonized_system_code !== undefined || v.hs_code !== undefined) sawHs = true;
      if (v.currency !== undefined || p.currency !== undefined) sawCurrency = true;
      return {
        sku: String(v.sku ?? "").trim(),
        price: String(v.price ?? "").trim(),
        compareAtPrice: String(v.compare_at_price ?? "").trim(),
        hsCode: v.harmonized_system_code !== undefined || v.hs_code !== undefined
          ? String(v.harmonized_system_code ?? v.hs_code ?? "").trim() : undefined,
        currency: v.currency !== undefined || p.currency !== undefined
          ? String(v.currency ?? p.currency ?? "").trim() : undefined,
      };
    });
    return {
      handle: String(p.handle ?? "").trim(),
      title: String(p.title ?? "").trim(),
      bodyHtml: String(p.body_html ?? "").trim(),
      vendor: String(p.vendor ?? "").trim(),
      productType: String(p.product_type ?? "").trim(),
      tags: Array.isArray(p.tags) ? p.tags : String(p.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      status: String(p.status ?? "").trim(),
      published: p.published_at !== undefined ? p.published_at !== null : undefined,
      variants,
      images: (p.images ?? []).map((im) => ({ src: String(im.src ?? ""), alt: String(im.alt ?? "").trim() })),
      seoTitle: p.seo_title ?? p.metafields_global_title_tag,
      seoDescription: p.seo_description ?? p.metafields_global_description_tag,
      duplicateHandleBlocks: 0,
    };
  });
  /** Collections + pages become text "surfaces" linted with the same engine. */
  const surfaces = [];
  for (const [key, kind] of [["custom_collections", "collection"], ["smart_collections", "collection"], ["pages", "page"]]) {
    for (const s of root[key] ?? []) {
      surfaces.push({
        kind,
        handle: String(s.handle ?? "").trim(),
        title: String(s.title ?? "").trim(),
        bodyHtml: String(s.body_html ?? "").trim(),
      });
    }
  }
  const hasSurfaceKeys = ["custom_collections", "smart_collections", "pages"].some((k) => Array.isArray(root[k]));
  return {
    products, surfaces,
    capabilities: { seo: sawSeo, hs: sawHs, currency: sawCurrency, surfaces: hasSurfaceKeys },
    errors,
  };
}

/** Strip HTML to prose so the claims engine sees sentences, not tags. */
export function stripHtml(html) {
  return String(html ?? "")
    .replace(/<\s*(?:br|\/p|\/div|\/li|\/h[1-6]|\/tr)\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// THE CHECKS
// ─────────────────────────────────────────────────────────────────────────────

export const HANDLE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Urgency/social-proof (SHOPIFY_TRACK_CONTEXT §4: every scarcity or proof line
 * must be literally true; "results in N days" lines are CLAIMS — banned unless
 * clinically substantiated and market-legal).
 */
export const URGENCY_CLAIM_PATTERNS = [
  { re: /\bresults?\s+(?:in|within)\s+(?:just\s+)?\d+\s+(?:hours?|days?|weeks?)\b/giu, note: "outcome-in-N-time claim" },
  { re: /\bvisible\s+(?:results?|difference)\s+(?:in|within)\s+\d+\s+(?:hours?|days?|weeks?)\b/giu, note: "outcome-in-N-time claim" },
];
export const URGENCY_REVIEW_PATTERNS = [
  { re: /\bonly\s+\d+\s+left\b/giu, note: "scarcity count" },
  { re: /\blimited\s+(?:time|stock|period|offer)\b/giu, note: "limited-time/stock line" },
  { re: /\bselling\s+fast\b/giu, note: "velocity claim" },
  { re: /\bhurry\b/giu, note: "urgency prompt" },
  { re: /\boffer\s+ends\b/giu, note: "deadline line" },
  { re: /\blast\s+chance\b/giu, note: "deadline line" },
  { re: /\bwhile\s+stocks?\s+last(?:s)?\b/giu, note: "scarcity line" },
  { re: /\b\d+\s*(?:,\d{3})*\+?\s+(?:happy\s+)?customers\b/giu, note: "social-proof count" },
];

const isNumeric = (s) => /^-?\d+(?:\.\d+)?$/.test(s);

/**
 * Negation-aware pattern scan (the r22 engine applied to a pattern list).
 * Returns live matches and suppressed (negated/interrogative) matches —
 * suppressed ones are reported as INFO, never dropped silently.
 */
export function scanPatterns(text, patterns) {
  const live = [], suppressed = [];
  for (const { re, note } of patterns) {
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
    let m;
    while ((m = r.exec(text)) !== null) {
      if (m[0].length === 0) { r.lastIndex++; continue; }
      const entry = { match: m[0], note, index: m.index };
      if (isNegated(text, m.index) || isInterrogative(text, m.index)) suppressed.push(entry);
      else live.push(entry);
    }
  }
  return { live, suppressed };
}

/** Excerpt around a character index, single line, bounded. */
function excerptAt(text, index, span = 90) {
  const start = Math.max(0, index - 30);
  return text.slice(start, Math.min(text.length, index + span)).replace(/\s+/g, " ").trim().slice(0, 140);
}

/**
 * Claims + register lint for one prose field. One law, one implementation:
 * packages/compliance lintText (minus its non-negation-aware cure-claims,
 * re-run here through the negation engine) + content-lint's claims engine.
 * @returns {Finding[]} without store/kind/handle (caller stamps those)
 */
export function lintProse(text, where) {
  /** @type {Finding[]} */
  const findings = [];
  if (!text) return findings;
  const push = (severity, rule, message, excerpt) =>
    findings.push({ severity, rule, store: null, kind: "", handle: "", where, message, excerpt });

  // DMR schedule disease × claim verb — negation- and direction-aware.
  for (const c of findClaims(text, CLAIM_VERBS, DMR_SCHEDULE_DISEASES)) {
    if (c.negated) {
      push("info", "banned-claim", `negation-suppressed disease claim ("${c.match}" near "${c.noun}") — verify the sentence really denies it`, excerptAt(text, c.index));
    } else {
      push("error", "banned-claim", `disease claim: "${c.match}" governing "${c.noun}" — DMR Act schedule / FDA-FTC no-disease-claims floor (SHOPIFY_TRACK_CONTEXT §4)`, excerptAt(text, c.index));
    }
  }
  // Hype/absolute phrases (content-lint r21) + compliance cure patterns,
  // both through the same negation engine.
  const phrases = scanPatterns(text, [...BANNED_CLAIM_PHRASES, ...CURE_CLAIM_PATTERNS]);
  for (const p of phrases.live) {
    push("error", "banned-claim-phrase", `${p.note}: "${p.match}"`, excerptAt(text, p.index));
  }
  for (const p of phrases.suppressed) {
    push("info", "banned-claim-phrase", `negation/question-suppressed ${p.note}: "${p.match}"`, excerptAt(text, p.index));
  }
  // Urgency: claims are errors; literal-truth lines route to a human.
  const urgent = scanPatterns(text, URGENCY_CLAIM_PATTERNS);
  for (const p of urgent.live) {
    push("error", "urgency-claim", `${p.note}: "${p.match}" — banned unless clinically substantiated AND market-legal (SHOPIFY_TRACK_CONTEXT §4)`, excerptAt(text, p.index));
  }
  const review = scanPatterns(text, URGENCY_REVIEW_PATTERNS);
  for (const p of review.live) {
    push("warn", "urgency-review", `${p.note}: "${p.match}" — must be LITERALLY TRUE; verify or remove (engineer lane)`, excerptAt(text, p.index));
  }
  // Register + filler + locked facts/counts — packages/compliance, called not
  // copied. cure-claims excluded above (negation-aware replacement).
  for (const f of lintText(text, { entity: "kappl", file: where, asCode: false })) {
    if (f.rule === "cure-claims") continue;
    const severity = f.severity === "warning" ? "warn" : f.severity;
    push(severity, f.rule, f.message, f.excerpt);
  }
  return findings;
}

/**
 * The catalog lint proper — pure, mode-blind, injectable for tests/probes.
 * @param {object[]} products canonical products
 * @param {object} opts
 * @param {string|null} [opts.store]  "in" | "com" | null
 * @param {string|null} [opts.expectedCurrency]
 * @param {object} [opts.capabilities] what the SOURCE can express
 * @param {object[]} [opts.surfaces] collections/pages
 * @returns {{findings:Finding[], coverage:string[], stats:object}}
 */
export function lintCatalog(products, { store = null, expectedCurrency = null, capabilities = {}, surfaces = [] } = {}) {
  /** @type {Finding[]} */
  const findings = [];
  const coverage = [];
  const stamp = (f, kind, handle) => ({ ...f, store, kind, handle });
  const push = (severity, rule, kind, handle, where, message, excerpt = "") =>
    findings.push({ severity, rule, store, kind, handle, where, message, excerpt });

  const skuOwners = new Map();   // sku -> [handle/where]
  const handleSeen = new Map();  // handle -> count
  const currencies = new Map();  // currency -> count

  for (const p of products) {
    const h = p.handle || "<no handle>";
    // Handle integrity
    if (!p.handle) push("error", "missing-handle", "product", h, "handle", "product has no URL handle");
    else if (!HANDLE_RE.test(p.handle)) push("error", "invalid-handle", "product", h, "handle", `broken URL handle "${p.handle}" — must be lowercase a-z, 0-9 and single hyphens (no leading/trailing hyphen)`);
    handleSeen.set(p.handle, (handleSeen.get(p.handle) ?? 0) + 1 + (p.duplicateHandleBlocks ?? 0));

    // Description
    const body = stripHtml(p.bodyHtml);
    if (body.length === 0) push("error", "empty-description", "product", h, "body_html", "empty product description — the PDP ships with no copy");
    else if (body.length < 40) push("warn", "thin-description", "product", h, "body_html", `description is ${body.length} chars — too thin to sell or rank`, body);

    // Images
    if (p.images.length === 0) push("error", "missing-image", "product", h, "images", "product has no images");
    const noAlt = p.images.filter((im) => !im.alt).length;
    if (noAlt > 0) push("warn", "missing-image-alt", "product", h, "images", `${noAlt} of ${p.images.length} image(s) missing alt text (A10/accessibility + SEO)`);

    // Classification
    if (!p.productType) push("warn", "missing-product-type", "product", h, "product_type", "no product type/category set");
    if (!p.vendor) push("warn", "missing-vendor", "product", h, "vendor", "no vendor set");
    if (p.tags.length === 0) push("warn", "missing-tags", "product", h, "tags", "no tags — collections and filtering lose this product");

    // SEO (only when the source can express it)
    if (capabilities.seo) {
      if (!String(p.seoTitle ?? "").trim()) push("warn", "missing-seo-title", "product", h, "seo_title", "no SEO title");
      if (!String(p.seoDescription ?? "").trim()) push("warn", "missing-seo-description", "product", h, "seo_description", "no SEO description");
    }

    // Variants: SKU + price integrity (HARD GATE 6: truthful price, real SKUs)
    if (p.variants.length === 0) push("error", "missing-price", "product", h, "variants", "product has no variants — no price exists");
    p.variants.forEach((v, i) => {
      const at = `variants[${i}]`;
      if (!v.sku) push("error", "missing-sku", "product", h, `${at}.sku`, "variant has no SKU");
      else {
        if (!skuOwners.has(v.sku)) skuOwners.set(v.sku, []);
        skuOwners.get(v.sku).push(`${h} ${at}`);
      }
      if (v.price === "" || v.price === undefined) push("error", "missing-price", "product", h, `${at}.price`, "variant has no price");
      else if (!isNumeric(v.price)) push("error", "price-not-numeric", "product", h, `${at}.price`, `price "${v.price}" is not a number`);
      else {
        const price = Number(v.price);
        if (price === 0) push("error", "zero-price", "product", h, `${at}.price`, "price is 0 — a zero price sells the product for nothing");
        if (price < 0) push("error", "negative-price", "product", h, `${at}.price`, `price is ${price} — negative price anomaly`);
        if (v.compareAtPrice !== "" && v.compareAtPrice !== undefined) {
          if (!isNumeric(v.compareAtPrice)) push("error", "price-not-numeric", "product", h, `${at}.compare_at_price`, `compare-at price "${v.compareAtPrice}" is not a number`);
          else if (Number(v.compareAtPrice) <= price) push("error", "compare-at-not-higher", "product", h, `${at}.compare_at_price`, `compare-at ${v.compareAtPrice} ≤ price ${v.price} — fake-sale inversion (Shopify hides the discount; the data is wrong either way)`);
        }
      }
      if (capabilities.hs && store === "in" && !v.hsCode) {
        push("warn", "hsn-missing", "product", h, `${at}.harmonized_system_code`, "no HSN code on a .in variant — GST compliance field (SHOPIFY_TRACK_CONTEXT §7)");
      }
      if (v.currency) currencies.set(v.currency, (currencies.get(v.currency) ?? 0) + 1);
    });

    // Prose checks on every authored text surface of the product
    for (const [where, text] of [
      ["title", p.title],
      ["body_html", body],
      ["tags", p.tags.join(", ")],
      ["seo_title", capabilities.seo ? String(p.seoTitle ?? "") : ""],
      ["seo_description", capabilities.seo ? String(p.seoDescription ?? "") : ""],
    ]) {
      for (const f of lintProse(text, where)) findings.push(stamp(f, "product", h));
    }
  }

  // Cross-catalog: duplicate SKUs and handles
  for (const [sku, owners] of skuOwners) {
    if (owners.length > 1) push("error", "duplicate-sku", "product", owners.map((o) => o.split(" ")[0]).join(", "), "sku", `SKU "${sku}" appears ${owners.length}× (${owners.join(" · ")})`);
  }
  for (const [handle, n] of handleSeen) {
    if (handle && n > 1) push("error", "duplicate-handle", "product", handle, "handle", `handle "${handle}" appears ${n}× — URL collision`);
  }

  // Currency consistency
  if (currencies.size > 1) {
    push("error", "currency-mixed", "catalog", "<catalog>", "currency", `catalog carries ${currencies.size} currencies (${[...currencies.keys()].join(", ")}) — one store, one currency`);
  }
  if (expectedCurrency) {
    for (const c of currencies.keys()) {
      if (c !== expectedCurrency) push("error", "currency-mismatch", "catalog", "<catalog>", "currency", `currency "${c}" ≠ declared expected "${expectedCurrency}"`);
    }
    if (currencies.size === 0 && !capabilities.shopCurrencyChecked) {
      coverage.push(`currency: expected "${expectedCurrency}" declared but the source carries no currency data — run API mode (shop.json) to verify`);
    }
  } else if (capabilities.currency || capabilities.shopCurrencyChecked) {
    coverage.push("currency: no expected currency declared (env *_EXPECTED_CURRENCY or --currency) — consistency checked, correctness not");
  } else {
    coverage.push("currency: source carries no currency data and none declared — NOT COVERED");
  }

  // Surfaces (collections/pages) — same prose engine, same law
  for (const s of surfaces) {
    const h = s.handle || "<no handle>";
    if (s.handle && !HANDLE_RE.test(s.handle)) push("error", "invalid-handle", s.kind, h, "handle", `broken URL handle "${s.handle}"`);
    const body = stripHtml(s.bodyHtml);
    if (s.kind === "page" && body.length === 0) push("warn", "empty-page-body", s.kind, h, "body_html", "page has no body content");
    for (const [where, text] of [["title", s.title], ["body_html", body]]) {
      for (const f of lintProse(text, where)) findings.push(stamp(f, s.kind, h));
    }
  }

  // Honest absences
  if (!capabilities.seo) coverage.push("seo title/description: not present in this source (Admin REST omits them; CSV/JSON with the fields arms the check) — NOT COVERED");
  if (!capabilities.hs) coverage.push("HSN/GST fields: not present in this source — NOT COVERED (include the HS-code column or lint via Admin API/metafields)");
  else if (store !== "in") coverage.push("HSN/GST: source carries HS codes but store is not .in — check not applied");
  if (!capabilities.surfaces) coverage.push("collections/pages: not present in this source (product CSV carries products only) — NOT COVERED");
  coverage.push("urgency/social-proof literal truth: machine cannot verify truth — lines routed to the engineer as urgency-review");

  const stats = {
    products: products.length,
    variants: products.reduce((n, p) => n + p.variants.length, 0),
    images: products.reduce((n, p) => n + p.images.length, 0),
    surfaces: surfaces.length,
  };
  return { findings, coverage, stats };
}

/** Severity → exit code (documented in the header; automation-safe). */
export function exitCodeFor(findings, lintedAnything) {
  if (!lintedAnything) return 3;
  if (findings.some((f) => f.severity === "error")) return 2;
  if (findings.some((f) => f.severity === "warn")) return 4;
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTROL PROBES — the REAL engine over a known-clean and known-bad catalog.
// If these fail the scanner is broken and must never report "clean".
// ─────────────────────────────────────────────────────────────────────────────

export const PROBE_CLEAN_PRODUCT = {
  handle: "probe-hair-oil",
  title: "Kairali Hair Care Oil 200 ml",
  bodyHtml: "<p>A classical Ayurvedic hair oil prepared under WHO-GMP conditions. " +
    "It is not a cure for cancer or any disease; use it alongside the advice of your treating medical team. " +
    "Apply gently to the scalp before bathing.</p>",
  vendor: "Kairali", productType: "Hair Oil", tags: ["hair oil", "ayurveda"],
  status: "active", published: true,
  variants: [{ sku: "KHC-200", price: "495.00", compareAtPrice: "650.00", hsCode: "330590", currency: "INR" }],
  images: [{ src: "https://cdn.example/khc.jpg", alt: "Kairali Hair Care Oil bottle" }],
  seoTitle: "Kairali Hair Care Oil 200 ml", seoDescription: "Classical Ayurvedic hair oil, WHO-GMP.",
  duplicateHandleBlocks: 0,
};

export const PROBE_BAD_PRODUCT = {
  handle: "Bad_Handle!",
  title: "Miracle oil that cures cancer",
  bodyHtml: "",
  vendor: "", productType: "", tags: [],
  status: "active", published: true,
  variants: [
    { sku: "", price: "0", compareAtPrice: "", hsCode: "", currency: "INR" },
    { sku: "DUP-1", price: "-5", compareAtPrice: "4", hsCode: "", currency: "USD" },
    { sku: "DUP-1", price: "abc", compareAtPrice: "", hsCode: "", currency: "INR" },
    { sku: "KHX-9", price: "500", compareAtPrice: "400", hsCode: "", currency: "INR" },
  ],
  images: [{ src: "https://cdn.example/x.jpg", alt: "" }],
  seoTitle: "", seoDescription: "",
  duplicateHandleBlocks: 0,
};

const PROBE_OPTS = { store: "in", expectedCurrency: "INR", capabilities: { seo: true, hs: true, currency: true, surfaces: true } };

export function runControlProbes() {
  const broken = [];
  const clean = lintCatalog([PROBE_CLEAN_PRODUCT], PROBE_OPTS);
  const cleanBad = clean.findings.filter((f) => f.severity !== "info");
  if (cleanBad.length > 0) {
    broken.push(`clean probe flagged (over-matching, the §3.4 class): ${cleanBad[0].rule} — ${cleanBad[0].message}`);
  }
  if (!clean.findings.some((f) => f.severity === "info" && f.rule === "banned-claim")) {
    broken.push("clean probe: the negated cure sentence produced no INFO record — suppression went silent (§2.7 r22: nothing disappears silently)");
  }
  const bad = lintCatalog([PROBE_BAD_PRODUCT], PROBE_OPTS);
  const rules = new Set(bad.findings.filter((f) => f.severity === "error").map((f) => f.rule));
  for (const expected of ["missing-sku", "duplicate-sku", "zero-price", "negative-price", "price-not-numeric",
    "compare-at-not-higher", "empty-description", "invalid-handle", "banned-claim", "banned-claim-phrase", "currency-mixed"]) {
    if (!rules.has(expected)) broken.push(`bad probe: expected ERROR "${expected}" was NOT flagged — the matcher is broken and its zeros are not believable`);
  }
  return broken;
}

// ─────────────────────────────────────────────────────────────────────────────
// READ-ONLY ADMIN API (the ONE network call site — GET, hard-coded)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The only fetch in this file. Method is a constant, not a parameter —
 * CLAUDE.md rule (k): the agent is READ-ONLY in any Shopify admin.
 * The test suite asserts this is the sole call site and the sole method.
 */
async function shopifyGet(url, token) {
  const res = await fetch(url, {
    method: "GET",
    headers: { "X-Shopify-Access-Token": token, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`GET ${url.replace(/page_info=[^&]+/, "page_info=…")} → HTTP ${res.status}`);
  return { body: await res.json(), link: res.headers.get("link") ?? "" };
}

function nextPageInfo(linkHeader) {
  const m = /<[^>]*[?&]page_info=([^&>]+)[^>]*>;\s*rel="next"/.exec(linkHeader);
  return m ? m[1] : null;
}

async function fetchAllPaged(domain, token, ver, resource, key) {
  const out = [];
  let pageInfo = null;
  do {
    const qs = pageInfo ? `limit=250&page_info=${pageInfo}` : "limit=250";
    const { body, link } = await shopifyGet(`https://${domain}/admin/api/${ver}/${resource}.json?${qs}`, token);
    out.push(...(body[key] ?? []));
    pageInfo = nextPageInfo(link);
  } while (pageInfo);
  return out;
}

async function fetchStore(storeCfg, env) {
  const domain = env[storeCfg.domainEnv] || storeCfg.defaultDomain;
  const token = env[storeCfg.tokenEnv];
  const ver = env.SHOPIFY_API_VERSION || DEFAULT_API_VERSION;
  if (!token) return { skipped: true, domain, reason: `${storeCfg.tokenEnv} not set` };
  const [products, customCollections, smartCollections, pages, shop] = await Promise.all([
    fetchAllPaged(domain, token, ver, "products", "products"),
    fetchAllPaged(domain, token, ver, "custom_collections", "custom_collections"),
    fetchAllPaged(domain, token, ver, "smart_collections", "smart_collections"),
    fetchAllPaged(domain, token, ver, "pages", "pages"),
    shopifyGet(`https://${domain}/admin/api/${ver}/shop.json`, token).then((r) => r.body.shop ?? {}),
  ]);
  return {
    skipped: false, domain,
    payload: { products, custom_collections: customCollections, smart_collections: smartCollections, pages },
    shopCurrency: shop.currency ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT — timestamped, findings-only, machine- AND human-readable.
// ─────────────────────────────────────────────────────────────────────────────

/** IST wall-clock parts (CLAUDE.md: every log artifact timestamped to the second, IST). */
export function istNow(d = new Date()) {
  const t = new Date(d.getTime() + (5 * 60 + 30) * 60 * 1000);
  const p = (n) => String(n).padStart(2, "0");
  const date = `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())}`;
  const time = `${p(t.getUTCHours())}:${p(t.getUTCMinutes())}:${p(t.getUTCSeconds())}`;
  return { date, time, stamp: `${date} ${time} IST`, compact: `${date}-${time.replaceAll(":", "")}-IST` };
}

export function countBySeverity(findings) {
  const c = { error: 0, warn: 0, info: 0 };
  for (const f of findings) c[f.severity] = (c[f.severity] ?? 0) + 1;
  return c;
}

function countByRule(findings) {
  const m = new Map();
  for (const f of findings) {
    if (!m.has(f.rule)) m.set(f.rule, { rule: f.rule, severity: f.severity, n: 0 });
    m.get(f.rule).n += 1;
  }
  return [...m.values()].sort((a, b) => b.n - a.n);
}

/** Previous findings.json in outDir (for the week-over-week delta), if any. */
export function previousReport(outDir) {
  if (!existsSync(outDir)) return null;
  const prior = readdirSync(outDir).filter((f) => f.endsWith(".findings.json")).sort();
  if (prior.length === 0) return null;
  const file = prior[prior.length - 1];
  try {
    return { file, data: JSON.parse(readFileSync(join(outDir, file), "utf8")) };
  } catch {
    return { file, data: null };
  }
}

export function renderMarkdown(result) {
  const { meta, counts, byRule, findings, coverage, delta, verdict } = result;
  const lines = [];
  lines.push(`# Shopify catalog lint — ${meta.stamp}`);
  lines.push("");
  lines.push(`- mode: **${meta.mode}**${meta.store ? ` · store: **${meta.store}**` : ""}`);
  lines.push(`- source: ${meta.sources.join(" · ")}`);
  lines.push(`- linted: ${meta.stats.products} products · ${meta.stats.variants} variants · ${meta.stats.images} images · ${meta.stats.surfaces} collections/pages`);
  lines.push(`- verdict: **${verdict}** — error ${counts.error} · warn ${counts.warn} · info ${counts.info}`);
  lines.push(`- READ-ONLY run: file reads and HTTP GETs only. Findings route to the engineer (CLAUDE.md rule l) — NEVER auto-fix.`);
  lines.push("");
  if (delta) {
    lines.push(`## Week-over-week (vs ${delta.file})`);
    lines.push(delta.line);
    lines.push("");
  }
  lines.push(`## Findings by rule`);
  if (byRule.length === 0) lines.push("(none)");
  else {
    lines.push("| rule | severity | count |");
    lines.push("|---|---|---|");
    for (const r of byRule) lines.push(`| ${r.rule} | ${r.severity} | ${r.n} |`);
  }
  lines.push("");
  lines.push(`## Findings`);
  if (findings.length === 0) lines.push("(none)");
  else {
    lines.push("| severity | rule | store | kind | handle | where | message |");
    lines.push("|---|---|---|---|---|---|---|");
    for (const f of findings) {
      const msg = `${f.message}${f.excerpt ? ` — \`${f.excerpt.replaceAll("|", "\\|").slice(0, 100)}\`` : ""}`;
      lines.push(`| ${f.severity} | ${f.rule} | ${f.store ?? "—"} | ${f.kind} | ${f.handle} | ${f.where} | ${msg.replaceAll("|", "\\|")} |`);
    }
  }
  lines.push("");
  lines.push(`## Not covered in this run (honest absences — a clean verdict does NOT include these)`);
  for (const c of coverage) lines.push(`- ${c}`);
  if (meta.skips.length > 0) {
    lines.push("");
    lines.push(`## Skipped sources`);
    for (const s of meta.skips) lines.push(`- ${s}`);
  }
  lines.push("");
  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { file: null, store: null, currency: null, outDir: DEFAULT_OUT_DIR, report: true, json: false, quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--file") args.file = argv[++i];
    else if (a === "--store") args.store = argv[++i];
    else if (a === "--currency") args.currency = argv[++i];
    else if (a === "--out-dir") args.outDir = argv[++i];
    else if (a === "--no-report") args.report = false;
    else if (a === "--json") args.json = true;
    else if (a === "--quiet") args.quiet = true;
    else throw new Error(`unknown argument "${a}" (usage: --file <csv|json> | API mode; --store in|com --currency XXX --out-dir <dir> --no-report --json --quiet)`);
  }
  if (args.store && !STORES[args.store]) throw new Error(`--store must be "in" or "com", got "${args.store}"`);
  return args;
}

async function main(argv) {
  const args = parseArgs(argv);
  const log = (...xs) => { if (!args.quiet) console.log(...xs); };

  // Prove the scanner can see before believing anything it says.
  const broken = runControlProbes();
  if (broken.length > 0) {
    console.error("\nshopify-catalog-lint: SCANNER BROKEN — control probes failed; NO result is reported.");
    for (const b of broken) console.error(`  ✗ ${b}`);
    return 2;
  }

  const allFindings = [];
  const coverage = new Set();
  const stats = { products: 0, variants: 0, images: 0, surfaces: 0 };
  const sources = [];
  const skips = [];
  let lintedAnything = false;
  let mode;

  if (args.file) {
    mode = "FILE";
    const path = resolve(args.file);
    if (!existsSync(path)) throw new Error(`--file ${args.file}: no such file`);
    const raw = readFileSync(path, "utf8");
    const ext = extname(path).toLowerCase();
    let parsed;
    if (ext === ".csv") parsed = { ...productsFromCsv(parseCsv(raw)), surfaces: [] };
    else if (ext === ".json") parsed = productsFromJson(JSON.parse(raw));
    else throw new Error(`--file must be .csv or .json, got "${ext}"`);
    if (parsed.errors.length > 0) throw new Error(parsed.errors.join("; "));
    const expectedCurrency = args.currency ?? (args.store ? process.env[STORES[args.store].currencyEnv] ?? null : null);
    const res = lintCatalog(parsed.products, {
      store: args.store, expectedCurrency,
      capabilities: parsed.capabilities, surfaces: parsed.surfaces ?? [],
    });
    allFindings.push(...res.findings);
    res.coverage.forEach((c) => coverage.add(c));
    for (const k of Object.keys(stats)) stats[k] += res.stats[k];
    sources.push(`${basename(path)} (offline export)`);
    lintedAnything = true;
    if (!args.store) coverage.add("store lens: no --store given — .in-specific checks (HSN/GST) not applied");
  } else {
    mode = "API";
    const wanted = args.store ? [STORES[args.store]] : Object.values(STORES);
    for (const cfg of wanted) {
      log(`\nAPI mode — ${cfg.label} (${cfg.lens})`);
      let fetched;
      try {
        fetched = await fetchStore(cfg, process.env);
      } catch (e) {
        throw new Error(`store ${cfg.key}: ${e.message}`);
      }
      if (fetched.skipped) {
        const line = `SKIPPED store "${cfg.key}" (${fetched.domain}): ${fetched.reason} — set it in the env (tokens arrive via Sunaj's secure channel; ~/work/.env.shopify per M2 Phase 2). Nothing was linted for this store.`;
        log(`  ⚠ ${line}`);
        skips.push(line);
        continue;
      }
      const parsed = productsFromJson(fetched.payload);
      const expectedCurrency = args.currency ?? process.env[cfg.currencyEnv] ?? null;
      const capabilities = { ...parsed.capabilities, shopCurrencyChecked: fetched.shopCurrency !== null };
      const res = lintCatalog(parsed.products, { store: cfg.key, expectedCurrency, capabilities, surfaces: parsed.surfaces });
      if (expectedCurrency && fetched.shopCurrency && fetched.shopCurrency !== expectedCurrency) {
        res.findings.push({
          severity: "error", rule: "currency-mismatch", store: cfg.key, kind: "shop", handle: "<shop>",
          where: "shop.currency", message: `store currency "${fetched.shopCurrency}" ≠ declared expected "${expectedCurrency}"`, excerpt: "",
        });
      }
      allFindings.push(...res.findings);
      res.coverage.forEach((c) => coverage.add(`[${cfg.key}] ${c}`));
      for (const k of Object.keys(stats)) stats[k] += res.stats[k];
      sources.push(`${fetched.domain} (Admin API, read-only)`);
      lintedAnything = true;
    }
  }

  const now = istNow();
  const counts = countBySeverity(allFindings);
  const code = exitCodeFor(allFindings, lintedAnything);
  const verdict = code === 3 ? "SKIP — NOTHING LINTED" : code === 2 ? "ERROR" : code === 4 ? "WARN" : "CLEAN";

  const outDir = resolve(REPO_ROOT, args.outDir);
  const prev = args.report ? previousReport(outDir) : null;
  let delta = null;
  if (prev?.data?.counts) {
    const p = prev.data.counts;
    delta = {
      file: prev.file,
      line: `error ${p.error} → ${counts.error} · warn ${p.warn} → ${counts.warn} (${counts.error < p.error ? "improving" : counts.error > p.error ? "REGRESSING" : "flat"} on errors)`,
    };
  }

  const result = {
    meta: {
      tool: "shopify-catalog-lint", mode, store: args.store, stamp: now.stamp,
      sources, skips, stats,
      doctrine: "READ-ONLY (CLAUDE.md rule k); findings route to the engineer (rule l); never auto-fix",
    },
    verdict, exitCode: code, counts, byRule: countByRule(allFindings),
    findings: allFindings, coverage: [...coverage], delta,
  };

  if (args.report && lintedAnything) {
    mkdirSync(outDir, { recursive: true });
    const base = `${now.compact}-catalog-lint-${mode.toLowerCase()}${args.store ? `-${args.store}` : ""}`;
    // Second-precision stamps can collide (two runs in one second); a report
    // must never overwrite an earlier report — findings are evidence.
    let stem = base;
    for (let n = 2; existsSync(join(outDir, `${stem}.md`)) || existsSync(join(outDir, `${stem}.findings.json`)); n++) {
      stem = `${base}-run${n}`;
    }
    const mdPath = join(outDir, `${stem}.md`);
    const jsonPath = join(outDir, `${stem}.findings.json`);
    writeFileSync(mdPath, renderMarkdown(result));
    writeFileSync(jsonPath, JSON.stringify(result, null, 2) + "\n");
    log(`\nreport: ${mdPath}`);
    log(`machine: ${jsonPath}`);
  }
  if (args.json) console.log(JSON.stringify(result, null, 2));

  log(`\nshopify-catalog-lint — ${mode} mode · ${stats.products} products · ${stats.variants} variants · ${stats.surfaces} surfaces`);
  for (const r of result.byRule) log(`  ${String(r.n).padStart(4)}  ${r.severity.padEnd(5)}  ${r.rule}`);
  if (skips.length > 0) log(`\n  ${skips.length} source(s) SKIPPED — see above. A skip is not a pass.`);
  log(`\nverdict: ${verdict} (exit ${code}) — error ${counts.error} · warn ${counts.warn} · info ${counts.info}`);
  if (code === 3) log(`NOTHING WAS LINTED. Exit 3 exists so automation can never read this as clean.`);
  return code;
}

// NOTE: comparing import.meta.url to process.argv[1] as raw STRINGS silently
// broke on any checkout path containing a space — import.meta.url percent-encodes
// it, argv[1] does not — so main() never ran and the script exited 0 having
// checked NOTHING. Normalising argv[1] through URL() fixes it with no new import.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((e) => {
      console.error(`shopify-catalog-lint: harness error — ${e.message}`);
      process.exit(1);
    });
}
