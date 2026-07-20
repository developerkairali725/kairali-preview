#!/usr/bin/env node
/**
 * seo-baseline.mjs — R6 baseline register: the Phase-1 "this is where we were"
 * record for rebuild-class sites (plan §3.4 · §3.5 gap-closer 1 · M3(a);
 * clears strict residue rows PKG-002/PKG-068 in
 * docs/process/os-2026/merge/strict-residues.yaml).
 *
 * WHY THIS EXISTS. A rebuild without a frozen baseline cannot prove anything
 * about itself later — "did the migration hold rankings?" becomes an argument
 * instead of a diff. This script produces launches/<domain>/baseline/: an
 * immutable, hash-manifested raw layer plus a VENDOR-NEUTRAL register that
 * downstream phases (PROTECTION MAP verdicts, T+7/30/60/90 post-flip
 * comparisons, the owner's monitoring tool) consume by pointer.
 *
 * NARROW REST, NOT THE MCP (§3.5 bake-off-before-consolidation doctrine,
 * external review §12): exactly THREE DataForSEO endpoints —
 *   dataforseo_labs/google/ranked_keywords/live   (keywords + position + ETV)
 *   dataforseo_labs/google/domain_rank_overview/live (domain organic snapshot)
 *   backlinks/summary/live                        (link-graph summary)
 * — plus the FREE appendix/user_data account check. The many-tool MCP
 * (zubair-trabzada toolkit) was studied as prior art only, never executed.
 * Consolidation on this vendor becomes doctrine ONLY after the bake-off
 * reads well to the owner — this script's job is to make that call honest.
 *
 * THE LAWS THIS SCRIPT HONORS:
 *   · HARD GATE 6 — never invent. Every number carries one of the canonical
 *     evidence-epistemology labels (package 04 standard, adopted plan §2.7):
 *     GSC UI exports = OBSERVED_FIRST_PARTY · every DataForSEO Labs /
 *     backlinks figure = THIRD_PARTY_ESTIMATE (rendered "ESTIMATE" in all
 *     human-readable output, §3.4's binding word) · derived joins/ratios =
 *     CALCULATED (with method) · proposed thresholds = RECOMMENDATION ·
 *     missing sources (GA4 12m, crawl fields, CWV — their access/tooling
 *     lands later in M3) = UNKNOWN + an explicit gap row, never a guess.
 *   · EVIDENCE LAW v2 — raw pulls land in a DATED dir under
 *     launches/<domain>/baseline/raw/ that is never overwritten (same-day
 *     re-runs auto-suffix -r2, -r3 …); each raw dir is manifested via
 *     scripts/evidence-manifest.mjs (append-only, EV-4 CI-verified); the
 *     register cites raws by path + sha256 (pointer rule, never copies).
 *   · COST BUDGET FIRST-CLASS (§2.7) — every billable call's cost (from the
 *     API response) is accumulated; the run REFUSES to start a call once
 *     --max-cost (default $2.00/run) is spent. verify-account is free and
 *     is the mandatory first call of any billable session.
 *   · HARD GATE 14 — credentials come from ~/.secrets/dataforseo.env or the
 *     environment, are never logged, and appear in no artifact.
 *   · VENDOR NEUTRALITY — the register schema (seo-baseline-register/1)
 *     names no vendor in its field names; sources[] declares vendor +
 *     endpoint + hash per source, so swapping vendors changes sources[]
 *     and nothing downstream. Documented fallback: the GSC-only register
 *     (register builds fine with zero DataForSEO dirs — vendor fields go
 *     UNKNOWN with a gap row).
 *
 * WHAT THE BAKE-OFF MEASURES (mode: bakeoff): vendor claims vs GSC ground
 * truth — keyword overlap (both directions, and weighted by GSC clicks),
 * position agreement on the intersection (median |Δ|, share within ±3/±5),
 * vendor ETV vs actual GSC monthly clicks (16m avg AND last-90d avg).
 * Structural disagreement sources are DECLARED, not hidden: GSC positions
 * are 16-month all-geo averages, vendor ranks are current single-geo
 * snapshots; the GSC UI export caps tables at 1,000 rows. Thresholds the
 * report proposes are labelled RECOMMENDATION — adopting them is the
 * owner's call (§3.5), never this script's.
 *
 * KNOWN LIMITS OF THIS M3(a) SLICE (honest, on the record): GSC source is
 * the committed UI exports (16m, 1,000-row cap) until the API/BigQuery lane
 * lands; GA4 12m needs Monday's Admin grants; crawl fields + CWV + the
 * date-stamped MONITOR/REJECT/IMPLEMENT PDF + the front-gate strategy-row
 * CI block are M3 remainder — the registry row stays status: partial and
 * says so.
 *
 * Usage:
 *   node scripts/seo-baseline.mjs verify-account
 *   node scripts/seo-baseline.mjs pull --domain <d> [--target <host>]
 *        [--location <code=2356>] [--language <code=en>] [--limit <n=1000>]
 *        [--max-cost <usd=2>] [--session <id>]
 *   node scripts/seo-baseline.mjs register --domain <d> [--gsc-dir <dir>]
 *        [--dfs-dir <dir>]
 *   node scripts/seo-baseline.mjs bakeoff --domain <d> [--register <file>]
 *   node scripts/seo-baseline.mjs all --domain <d> [pull+register+bakeoff opts]
 *
 * House rules honored: dependency-free (node stdlib only), exit 1 on any
 * failure/refusal with a loud reason, importable without side effects
 * (main-guard), injectable HTTP layer so tests never touch the network.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// ───────────────────────── constants ─────────────────────────

export const API_BASE = "https://api.dataforseo.com";
export const SECRETS_FILE = path.join(os.homedir(), ".secrets", "dataforseo.env");
export const REGISTER_SCHEMA = "seo-baseline-register/1";
export const DEFAULT_LOCATION = 2356; // India — the fleet's dominant GSC geo
export const DEFAULT_LANGUAGE = "en";
export const DEFAULT_LIMIT = 1000;
export const DEFAULT_MAX_COST_USD = 2.0;

// The canonical evidence-epistemology labels this artifact uses (package 04
// standard "Evidence classes", adopted plan §2.7 — subset relevant here).
export const LABELS = Object.freeze({
  OBSERVED: "OBSERVED_FIRST_PARTY",
  ESTIMATE: "THIRD_PARTY_ESTIMATE", // rendered "ESTIMATE" in human output (§3.4)
  CALCULATED: "CALCULATED",
  RECOMMENDATION: "RECOMMENDATION",
  UNKNOWN: "UNKNOWN",
});

export const ENDPOINTS = Object.freeze({
  userData: "/v3/appendix/user_data",
  rankedKeywords: "/v3/dataforseo_labs/google/ranked_keywords/live",
  domainOverview: "/v3/dataforseo_labs/google/domain_rank_overview/live",
  backlinksSummary: "/v3/backlinks/summary/live",
});

// ───────────────────────── time helpers ─────────────────────────

export function istTimestamp(d = new Date()) {
  // YYYY-MM-DD HH:MM:SS IST — canonical to the second (CLAUDE.md log law)
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(d).reduce((a, x) => ((a[x.type] = x.value), a), {});
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} IST`;
}

export function istDate(d = new Date()) {
  return istTimestamp(d).slice(0, 10);
}

// ───────────────────────── credentials ─────────────────────────

/** Loads DATAFORSEO_LOGIN/PASSWORD from env, falling back to SECRETS_FILE.
 *  Values are NEVER logged (HARD GATE 14). */
export function loadCredentials({ env = process.env, secretsFile = SECRETS_FILE } = {}) {
  let login = env.DATAFORSEO_LOGIN, password = env.DATAFORSEO_PASSWORD;
  if ((!login || !password) && fs.existsSync(secretsFile)) {
    for (const line of fs.readFileSync(secretsFile, "utf8").split("\n")) {
      const m = line.match(/^\s*(?:export\s+)?([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (!m) continue;
      if (m[1] === "DATAFORSEO_LOGIN" && !login) login = m[2];
      if (m[1] === "DATAFORSEO_PASSWORD" && !password) password = m[2];
    }
  }
  if (!login || !password) {
    throw new Error(
      `DataForSEO credentials not found (env DATAFORSEO_LOGIN/PASSWORD or ${secretsFile}) — refusing to guess (HARD GATE 6/14)`,
    );
  }
  return { login, password };
}

// ───────────────────────── HTTP layer (injectable) ─────────────────────────

/** POST (or GET when body is null) a DataForSEO endpoint. Returns parsed JSON.
 *  Throws on non-20000 API status. Never logs auth material. */
export async function dfsRequest(endpoint, body, creds, fetchImpl = fetch) {
  const auth = "Basic " + Buffer.from(`${creds.login}:${creds.password}`).toString("base64");
  const res = await fetchImpl(API_BASE + endpoint, {
    method: body == null ? "GET" : "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: body == null ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DataForSEO HTTP ${res.status} on ${endpoint}`);
  const json = await res.json();
  if (json.status_code !== 20000) {
    throw new Error(`DataForSEO API error ${json.status_code} ${json.status_message} on ${endpoint}`);
  }
  const task = json.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    throw new Error(
      `DataForSEO task error ${task?.status_code} ${task?.status_message} on ${endpoint}`,
    );
  }
  return json;
}

/** Cost meter — the §2.7 first-class cost budget. refuses BEFORE the call
 *  that would run while the cap is already spent. */
export function makeCostMeter(maxCostUsd) {
  let spent = 0;
  return {
    guard(endpoint) {
      if (spent >= maxCostUsd) {
        throw new Error(
          `COST BUDGET REFUSAL: $${spent.toFixed(4)} already spent ≥ cap $${maxCostUsd.toFixed(2)} — not calling ${endpoint}. Raise --max-cost deliberately if intended.`,
        );
      }
    },
    add(json) { spent += json.cost || 0; return spent; },
    get spent() { return spent; },
  };
}

// ───────────────────────── CSV (GSC UI export) ─────────────────────────

/** Minimal RFC-4180-ish parser: quoted fields, embedded commas/quotes/newlines. */
export function parseCsv(text) {
  const rows = []; let row = [], field = "", inQ = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQ) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); if (row.length > 1 || row[0] !== "") rows.push(row); }
  return rows;
}

export function num(v) {
  if (v == null) return null;
  const t = String(v).trim().replace(/%$/, "").replace(/,/g, "");
  if (t === "" || t === "-") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Reads a committed GSC UI export dir (Queries/Pages/Chart/Devices/Countries/
 *  Filters .csv). Missing files become nulls + a flag — never invented. */
export function readGscExport(dir) {
  const read = (name, mapRow) => {
    const f = path.join(dir, name);
    if (!fs.existsSync(f)) return null;
    const rows = parseCsv(fs.readFileSync(f, "utf8"));
    return rows.slice(1).map((r) => mapRow(r));
  };
  const perf = (r) => ({ key: r[0], clicks: num(r[1]), impressions: num(r[2]), ctr_pct: num(r[3]), position: num(r[4]) });
  const out = {
    dir,
    filters: read("Filters.csv", (r) => ({ filter: r[0], value: r[1] })),
    chart: read("Chart.csv", (r) => ({ date: r[0], clicks: num(r[1]), impressions: num(r[2]), ctr_pct: num(r[3]), position: num(r[4]) })),
    queries: read("Queries.csv", perf),
    pages: read("Pages.csv", perf),
    devices: read("Devices.csv", perf),
    countries: read("Countries.csv", perf),
    flags: [],
  };
  for (const k of ["chart", "queries", "pages"]) {
    if (!out[k]) out.flags.push(`gsc: ${k}.csv missing in ${dir} — fields left null, never invented (HARD GATE 6)`);
  }
  return out;
}

/** Totals from the daily Chart.csv series (complete regardless of the
 *  1,000-row table cap). Labels are PER FIELD: the raw sums are
 *  OBSERVED_FIRST_PARTY; every script-computed derivative (ctr, weighted
 *  position, monthly averages) is CALCULATED — one block-level label lied
 *  about half its fields (reviewer-confirmed HG6 finding). Null daily cells
 *  are summed as 0 but COUNTED and declared, never hidden. */
export function gscTotals(gsc) {
  if (!gsc.chart?.length) return null;
  let clicks = 0, impressions = 0, posW = 0, wSum = 0, nullCellDays = 0;
  for (const d of gsc.chart) {
    if (d.clicks == null || d.impressions == null) nullCellDays++;
    clicks += d.clicks ?? 0;
    impressions += d.impressions ?? 0;
    if (d.position != null && d.impressions) { posW += d.position * d.impressions; wSum += d.impressions; }
  }
  const days = gsc.chart.length;
  const last90 = gsc.chart.slice(-90);
  const clicks90 = last90.reduce((a, d) => a + (d.clicks ?? 0), 0);
  return {
    window_days: days,
    clicks, impressions,
    ctr_pct: impressions ? +(100 * clicks / impressions).toFixed(2) : null,
    avg_position_impr_weighted: wSum ? +(posW / wSum).toFixed(2) : null,
    monthly_avg_clicks_16m: +(clicks / (days / 30.44)).toFixed(1),
    monthly_avg_clicks_last90d: +(clicks90 / (Math.min(90, days) / 30.44)).toFixed(1),
    days_with_null_cells: nullCellDays,
    labels: {
      clicks: LABELS.OBSERVED,
      impressions: LABELS.OBSERVED,
      ctr_pct: LABELS.CALCULATED,
      avg_position_impr_weighted: LABELS.CALCULATED,
      monthly_avg_clicks_16m: LABELS.CALCULATED,
      monthly_avg_clicks_last90d: LABELS.CALCULATED,
    },
    position_method: `impressions-weighted mean of daily positions (${LABELS.CALCULATED})`,
  };
}

// ───────────────────── DataForSEO normalizers (vendor-neutral out) ─────────────

export function normalizeRankedKeywords(json) {
  const result = json.tasks[0].result?.[0];
  const items = result?.items ?? [];
  return {
    total_count: result?.total_count ?? null,
    returned: items.length,
    keywords: items.map((it) => ({
      keyword: it.keyword_data?.keyword ?? null,
      search_volume_monthly: it.keyword_data?.keyword_info?.search_volume ?? null,
      cpc_usd: it.keyword_data?.keyword_info?.cpc ?? null,
      rank_absolute: it.ranked_serp_element?.serp_item?.rank_absolute ?? null,
      url_path: it.ranked_serp_element?.serp_item?.relative_url ?? null,
      etv_monthly: it.ranked_serp_element?.serp_item?.etv ?? null,
      label: LABELS.ESTIMATE,
    })),
  };
}

export function normalizeDomainOverview(json) {
  const m = json.tasks[0].result?.[0]?.items?.[0]?.metrics?.organic;
  if (!m) return null;
  const allNull = m.pos_1 == null && m.pos_2_3 == null && m.pos_4_10 == null;
  return {
    keywords_count: m.count ?? null,
    etv_monthly: m.etv ?? null,
    // absent buckets stay null — a fabricated 0 would read as "measured: none"
    top10_count: allNull ? null : (m.pos_1 ?? 0) + (m.pos_2_3 ?? 0) + (m.pos_4_10 ?? 0),
    positions: { pos_1: m.pos_1 ?? null, pos_2_3: m.pos_2_3 ?? null, pos_4_10: m.pos_4_10 ?? null, pos_11_20: m.pos_11_20 ?? null },
    movement: { new: m.is_new ?? null, up: m.is_up ?? null, down: m.is_down ?? null, lost: m.is_lost ?? null },
    label: LABELS.ESTIMATE,
  };
}

export function normalizeBacklinks(json) {
  // Real API shape: the summary object sits directly on result[0] (verified
  // against live pulls 19 Jul); items[0] kept as a defensive fallback since
  // most other DataForSEO endpoints nest under items[].
  const r = json.tasks[0].result?.[0];
  const it = (r?.backlinks != null || r?.referring_domains != null) ? r : r?.items?.[0];
  if (!it) return null;
  return {
    backlinks: it.backlinks ?? null,
    referring_domains: it.referring_domains ?? null,
    referring_main_domains: it.referring_main_domains ?? null,
    domain_rank: it.rank ?? null,
    broken_backlinks: it.broken_backlinks ?? null,
    spam_score: it.backlinks_spam_score ?? null,
    label: LABELS.ESTIMATE,
  };
}

// ───────────────────────── joins ─────────────────────────

export function normKeyword(k) {
  return String(k ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

/** Normalize an absolute GSC page URL or a vendor relative_url to a path. */
export function normPath(u) {
  if (u == null) return null;
  let p = String(u).trim();
  p = p.replace(/^https?:\/\/[^/]+/i, "");
  if (p === "") p = "/";
  try { p = decodeURI(p); } catch { /* keep raw */ }
  p = p.replace(/\/+$/, "") || "/";
  return p.toLowerCase();
}

/** keyword-level join: GSC queries (OBSERVED) × vendor keywords (ESTIMATE). */
export function joinKeywords(gscQueries, vendorKeywords) {
  const vmap = new Map(vendorKeywords.map((k) => [normKeyword(k.keyword), k]));
  const joined = [];
  for (const q of gscQueries ?? []) {
    const v = vmap.get(normKeyword(q.key)) ?? null;
    joined.push({
      keyword: q.key,
      gsc: { clicks_16m: q.clicks, impressions_16m: q.impressions, avg_position: q.position, label: LABELS.OBSERVED },
      vendor: v
        ? { rank_absolute: v.rank_absolute, etv_monthly: v.etv_monthly, search_volume_monthly: v.search_volume_monthly, url_path: v.url_path, label: LABELS.ESTIMATE }
        : null,
    });
  }
  const gset = new Set((gscQueries ?? []).map((q) => normKeyword(q.key)));
  const vendorOnly = vendorKeywords.filter((k) => !gset.has(normKeyword(k.keyword)));
  return { joined, vendorOnly };
}

/** per-URL register rows: GSC pages (OBSERVED) + vendor per-path rollup
 *  (ESTIMATE) + explicit UNKNOWN columns for the M3-remainder sources. */
export function buildUrlRegister(gscPages, vendorKeywords) {
  const byPath = new Map();
  for (const k of vendorKeywords ?? []) {
    const p = normPath(k.url_path);
    if (p == null) continue;
    const e = byPath.get(p) ?? { ranked_keywords: 0, etv_monthly_sum: 0, etv_null_keywords: 0 };
    e.ranked_keywords++;
    // null ETV is unknown, not zero — sum only real values, count the gaps
    if (k.etv_monthly == null) e.etv_null_keywords++;
    else e.etv_monthly_sum += k.etv_monthly;
    byPath.set(p, e);
  }
  const rollupOut = (v) => v && {
    ranked_keywords: v.ranked_keywords,
    etv_monthly_sum: +v.etv_monthly_sum.toFixed(1),
    ...(v.etv_null_keywords ? { etv_null_keywords: v.etv_null_keywords } : {}),
    label: LABELS.ESTIMATE,
  };
  const seen = new Set();
  const rows = (gscPages ?? []).map((pg) => {
    const p = normPath(pg.key);
    seen.add(p);
    const v = byPath.get(p) ?? null;
    return {
      url: pg.key,
      path: p,
      gsc_16m: { clicks: pg.clicks, impressions: pg.impressions, ctr_pct: pg.ctr_pct, avg_position: pg.position, label: LABELS.OBSERVED },
      vendor_organic: rollupOut(v),
      ga4_12m: { value: null, label: LABELS.UNKNOWN, gap: "GA4 Admin grants land with the Monday access chase — never invented" },
      crawl: { value: null, label: LABELS.UNKNOWN, gap: "crawler lane is M3 remainder" },
      cwv: { value: null, label: LABELS.UNKNOWN, gap: "CWV lane is M3 remainder" },
      disposition: null, // Phase-2 PROTECTION MAP fills KEEP/MERGE/301
      decision_ref: null,
    };
  });
  for (const [p, v] of byPath) {
    if (seen.has(p)) continue;
    rows.push({
      url: null, path: p,
      gsc_16m: null,
      vendor_organic: rollupOut(v),
      ga4_12m: { value: null, label: LABELS.UNKNOWN, gap: "GA4 Admin grants land with the Monday access chase — never invented" },
      crawl: { value: null, label: LABELS.UNKNOWN, gap: "crawler lane is M3 remainder" },
      cwv: { value: null, label: LABELS.UNKNOWN, gap: "CWV lane is M3 remainder" },
      disposition: null, decision_ref: null,
      flags: ["vendor-only path (not in GSC top-1000 pages; cap or zero-click)"],
    });
  }
  return rows;
}

// ───────────────────────── bake-off ─────────────────────────

export function median(xs) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** The §3.5 bake-off: vendor estimates vs GSC ground truth. All derived
 *  figures are CALCULATED; proposed thresholds are RECOMMENDATION. */
export function computeBakeoff(register) {
  const joined = register.keywords?.joined ?? [];
  // no vendor pull at all → coverage is UNKNOWN, not a measured 0.0%
  const vendorAbsent = register.keywords?.vendor_returned == null;
  const gscKw = joined.filter((j) => j.gsc);
  const both = joined.filter((j) => j.gsc && j.vendor);
  const gscTop20ByClicks = [...gscKw]
    .filter((j) => (j.gsc.clicks_16m ?? 0) > 0)
    .sort((a, b) => b.gsc.clicks_16m - a.gsc.clicks_16m)
    .slice(0, 20);
  const top20Covered = gscTop20ByClicks.filter((j) => j.vendor).length;

  const deltas = both
    .filter((j) => j.vendor.rank_absolute != null && j.gsc.avg_position != null)
    .map((j) => j.vendor.rank_absolute - j.gsc.avg_position);
  const absDeltas = deltas.map(Math.abs);

  const clicksWeighted = { covered: 0, total: 0 };
  for (const j of gscKw) {
    const c = j.gsc.clicks_16m ?? 0;
    clicksWeighted.total += c;
    if (j.vendor) clicksWeighted.covered += c;
  }

  const t = register.totals;
  const vendorEtv = t?.vendor_domain_overview?.etv_monthly ?? null;
  const gscMonthly16m = t?.gsc_16m?.monthly_avg_clicks_16m ?? null;
  const gscMonthly90d = t?.gsc_16m?.monthly_avg_clicks_last90d ?? null;

  return {
    label: LABELS.CALCULATED,
    vendor_absent: vendorAbsent || undefined,
    counts: {
      gsc_queries: gscKw.length,
      vendor_keywords_returned: register.keywords?.vendor_returned ?? null,
      vendor_keywords_total_claimed: register.keywords?.vendor_total_count ?? null,
      intersection: vendorAbsent ? null : both.length,
    },
    overlap: vendorAbsent
      ? { share_of_gsc_queries_covered: null, share_of_gsc_clicks_covered: null, gsc_top20_by_clicks_covered: null, note: `no vendor pull in this register — coverage is ${LABELS.UNKNOWN}, not zero (GSC-only fallback path)` }
      : {
          share_of_gsc_queries_covered: gscKw.length ? +(both.length / gscKw.length).toFixed(3) : null,
          share_of_gsc_clicks_covered: clicksWeighted.total ? +(clicksWeighted.covered / clicksWeighted.total).toFixed(3) : null,
          gsc_top20_by_clicks_covered: `${top20Covered}/${gscTop20ByClicks.length}`,
        },
    position_agreement: {
      pairs: absDeltas.length,
      median_abs_delta: absDeltas.length ? +median(absDeltas).toFixed(2) : null,
      within_3: absDeltas.length ? +(absDeltas.filter((d) => d <= 3).length / absDeltas.length).toFixed(3) : null,
      within_5: absDeltas.length ? +(absDeltas.filter((d) => d <= 5).length / absDeltas.length).toFixed(3) : null,
      median_signed_delta: deltas.length ? +median(deltas).toFixed(2) : null,
      declared_disagreement_sources: [
        "GSC position = 16-month average across ALL geos/devices; vendor rank = current snapshot, one geo/language",
        "GSC UI export caps tables at 1,000 rows (API/BigQuery lane supersedes at M3 remainder)",
        "vendor keyword DB refresh cadence is the vendor's, not Google's",
      ],
    },
    traffic: {
      vendor_etv_monthly: vendorEtv,
      gsc_monthly_avg_clicks_16m: gscMonthly16m,
      gsc_monthly_avg_clicks_last90d: gscMonthly90d,
      etv_over_actual_16m: vendorEtv != null && gscMonthly16m ? +(vendorEtv / gscMonthly16m).toFixed(2) : null,
      etv_over_actual_90d: vendorEtv != null && gscMonthly90d ? +(vendorEtv / gscMonthly90d).toFixed(2) : null,
      note: "ETV is a vendor model of monthly organic clicks (ESTIMATE); GSC clicks are what actually happened (OBSERVED_FIRST_PARTY). The ratio IS the bake-off finding, whichever way it points.",
    },
    proposed_tolerances: {
      label: LABELS.RECOMMENDATION,
      note: "Proposed for the consolidation decision (§3.5) — adopting them is the owner's call; nothing here self-adopts.",
      rows: [
        { metric: "share_of_gsc_clicks_covered", tolerance: ">= 0.80", rationale: "the vendor must see the keywords that earn the actual clicks" },
        { metric: "gsc_top20_by_clicks_covered", tolerance: ">= 16/20", rationale: "money keywords, individually accountable" },
        { metric: "position median_abs_delta", tolerance: "<= 5", rationale: "16m-avg vs snapshot makes tighter tolerance dishonest" },
        { metric: "etv_over_actual (either window)", tolerance: "0.33x – 3x", rationale: "ETV is a model; order-of-magnitude agreement is the honest bar" },
      ],
    },
  };
}

export function renderBakeoffMd(domain, register, bakeoff, meta = {}) {
  const L = [];
  const t = register.totals ?? {};
  L.push(`# SEO baseline bake-off — ${domain}`);
  L.push("");
  L.push(`Generated: ${meta.generated ?? istTimestamp()} · register: ${meta.registerRef ?? "(uncommitted)"}`);
  const pm = register.vendor_pull_meta;
  const gscSrc = register.sources?.find((s) => s.kind === "gsc-ui-export");
  L.push(`Vendor target: ${pm ? `${pm.target} (location ${pm.location_code} / ${pm.language_code}, limit ${pm.limit})` : "— (GSC-only fallback register)"} · GSC ground truth: ${gscSrc ? path.dirname(gscSrc.path) : "— (no GSC export)"}`);
  L.push(`JOIN CAVEAT (declared, not hidden): the vendor measures the registered DOMAIN; a GSC URL-prefix property measures ONE host+protocol — where properties are fragmented (http/https, www/non-www), GSC ground truth undercounts the domain and inflates vendor/actual ratios.`);
  L.push(`Doctrine: plan §3.4/§3.5 bake-off-before-consolidation. GSC UI export = ground truth (OBSERVED_FIRST_PARTY); every vendor figure = ESTIMATE (THIRD_PARTY_ESTIMATE); derived = CALCULATED; thresholds = RECOMMENDATION (owner adopts, not this script).`);
  L.push("");
  L.push(`## Totals`);
  const g = t.gsc_16m ?? {};
  const v = t.vendor_domain_overview ?? {};
  const b = t.vendor_backlinks ?? {};
  L.push(`| metric | value | label |`);
  L.push(`|---|---|---|`);
  L.push(`| GSC clicks (16m, daily-series sum) | ${g.clicks ?? "—"} | OBSERVED_FIRST_PARTY |`);
  L.push(`| GSC impressions (16m) | ${g.impressions ?? "—"} | OBSERVED_FIRST_PARTY |`);
  L.push(`| GSC monthly avg clicks (16m / last-90d) | ${g.monthly_avg_clicks_16m ?? "—"} / ${g.monthly_avg_clicks_last90d ?? "—"} | CALCULATED |`);
  L.push(`| Vendor organic keywords (count) | ${v.keywords_count ?? "—"} | ESTIMATE |`);
  L.push(`| Vendor ETV (est. monthly clicks) | ${v.etv_monthly != null ? Math.round(v.etv_monthly) : "—"} | ESTIMATE |`);
  L.push(`| Vendor backlinks / referring domains | ${b.backlinks ?? "—"} / ${b.referring_domains ?? "—"} | ESTIMATE |`);
  L.push("");
  L.push(`## Overlap (vendor vs GSC ground truth)`);
  const o = bakeoff.overlap;
  if (bakeoff.vendor_absent) {
    L.push(`- **vendor data ABSENT in this register (${LABELS.UNKNOWN})** — ${o.note}`);
  } else {
    L.push(`- GSC queries covered by vendor: **${fmtPct(o.share_of_gsc_queries_covered)}** (${bakeoff.counts.intersection}/${bakeoff.counts.gsc_queries})`);
    L.push(`- GSC CLICKS covered by vendor (weighted): **${fmtPct(o.share_of_gsc_clicks_covered)}**`);
    L.push(`- GSC top-20-by-clicks covered: **${o.gsc_top20_by_clicks_covered ?? "—"}**`);
  }
  L.push("");
  L.push(`## Position agreement (intersection, n=${bakeoff.position_agreement.pairs})`);
  const p = bakeoff.position_agreement;
  L.push(`- median |Δposition|: **${p.median_abs_delta ?? "—"}** · within ±3: ${fmtPct(p.within_3)} · within ±5: ${fmtPct(p.within_5)} · median signed Δ (vendor−GSC): ${p.median_signed_delta ?? "—"}`);
  L.push(`- Declared structural disagreement sources (not model error): ${p.declared_disagreement_sources.map((s) => `\n  - ${s}`).join("")}`);
  L.push("");
  L.push(`## Traffic model vs reality`);
  const tr = bakeoff.traffic;
  L.push(`- Vendor ETV ${tr.vendor_etv_monthly != null ? Math.round(tr.vendor_etv_monthly) : "—"}/mo (ESTIMATE) vs GSC actual ${tr.gsc_monthly_avg_clicks_16m ?? "—"}/mo (16m avg) · ${tr.gsc_monthly_avg_clicks_last90d ?? "—"}/mo (last-90d avg) (OBSERVED→CALCULATED)`);
  L.push(`- ETV/actual ratio: 16m **${tr.etv_over_actual_16m ?? "—"}×** · 90d **${tr.etv_over_actual_90d ?? "—"}×**`);
  L.push(`- ${tr.note}`);
  L.push("");
  L.push(`## Proposed tolerated-disagreement thresholds (RECOMMENDATION — owner adopts)`);
  L.push(`| metric | proposed tolerance | rationale |`);
  L.push(`|---|---|---|`);
  for (const r of bakeoff.proposed_tolerances.rows) L.push(`| ${r.metric} | ${r.tolerance} | ${r.rationale} |`);
  L.push("");
  L.push(`_${bakeoff.proposed_tolerances.note}_`);
  L.push("");
  return L.join("\n");
}

function fmtPct(x) {
  return x == null ? "—" : `${(100 * x).toFixed(1)}%`;
}

// ───────────────────────── filesystem: immutable dated dirs ─────────────────────────

/** Next never-overwriting dated location: base, base-r2, base-r3 … (Evidence
 *  Law v2 — corrections are new runs, never edits). ext ("" for dirs) is part
 *  of the existence check so files and dirs both stay immutable. */
export function nextDatedPath(parent, stem, ext = "") {
  let p = path.join(parent, stem + ext);
  if (!fs.existsSync(p)) return p;
  for (let n = 2; n < 100; n++) {
    p = path.join(parent, `${stem}-r${n}${ext}`);
    if (!fs.existsSync(p)) return p;
  }
  throw new Error(`>99 same-day runs under ${parent}/${stem} — something is wrong`);
}

export function sha256File(f) {
  return crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
}

/** Parse `<prefix>YYYY-MM-DD(-rN)(ext)` → {date, run} or null if the name
 *  deviates from the canonical run grammar. */
export function parseRunName(name, prefix, ext = "") {
  if (!name.startsWith(prefix) || !name.endsWith(ext)) return null;
  const core = name.slice(prefix.length, ext ? -ext.length : undefined);
  const m = core.match(/^(\d{4}-\d{2}-\d{2})(?:-r(\d+))?$/);
  return m ? { date: m[1], run: Number(m[2] ?? 1) } : null;
}

/** Latest run matching a prefix, selected by (date, NUMERIC run) — never raw
 *  lexicographic sort (r10 > r9 > r2; a -r2 correction beats its base name).
 *  Entries with the documented quarantine suffix -FAILED are ignored. Any
 *  OTHER deviant sibling (e.g. a hand-named -www property dir) makes the
 *  choice ambiguous: this REFUSES rather than silently baselining the wrong
 *  source (HARD GATE 6 — the reviewer-confirmed KTAHV www/apex trap). */
export function selectLatestRun(parent, prefix, { ext = "", wantDir = true } = {}) {
  if (!fs.existsSync(parent)) return null;
  const entries = fs.readdirSync(parent).filter((n) => {
    const isDir = fs.statSync(path.join(parent, n)).isDirectory();
    return n.startsWith(prefix) && (wantDir ? isDir : !isDir);
  });
  const live = entries.filter((n) => {
    const core = ext && n.endsWith(ext) ? n.slice(0, -ext.length) : n;
    return !core.endsWith("-FAILED");
  });
  const deviant = live.filter((n) => parseRunName(n, prefix, ext) === null);
  if (deviant.length) {
    throw new Error(
      `ambiguous ${prefix}* source under ${parent}: [${live.sort().join(", ")}] — ` +
      `non-run-suffixed sibling(s) [${deviant.sort().join(", ")}] look like a DIFFERENT property/source, ` +
      `not a re-run. Pass the dir/file explicitly (--gsc-dir/--dfs-dir/--register); refusing to guess (HARD GATE 6).`,
    );
  }
  const parsed = live.map((n) => ({ n, k: parseRunName(n, prefix, ext) }));
  if (!parsed.length) return null;
  parsed.sort((a, b) => a.k.date.localeCompare(b.k.date) || a.k.run - b.k.run);
  return path.join(parent, parsed[parsed.length - 1].n);
}

/** Create the next dated dir, tolerant of a concurrent same-day creator:
 *  non-recursive mkdir is the atomic claim; EEXIST → pick the next -rN. */
export function claimDatedDir(parent, stem) {
  fs.mkdirSync(parent, { recursive: true });
  for (;;) {
    const candidate = nextDatedPath(parent, stem);
    try { fs.mkdirSync(candidate); return candidate; }
    catch (e) { if (e.code !== "EEXIST") throw e; }
  }
}

/** Write a file at the next dated name, atomically claimed via wx. */
export function claimDatedFile(parent, stem, ext, data) {
  fs.mkdirSync(parent, { recursive: true });
  for (;;) {
    const candidate = nextDatedPath(parent, stem, ext);
    try { fs.writeFileSync(candidate, data, { flag: "wx" }); return candidate; }
    catch (e) { if (e.code !== "EEXIST") throw e; }
  }
}

/** Manifest a bundle dir via the M2 mechanism (Evidence Law v2). The tool
 *  resolves bundle paths against ITS cwd (and silently no-ops outside the
 *  repo — live-debugged), so the spawn pins cwd to repoRoot and passes the
 *  repo-relative path; a missing manifest after a "successful" run is
 *  treated as the failure it is. */
export function writeBundleManifest(repoRoot, dir, session, env = process.env) {
  const sess = session || env.CLAUDE_SESSION_ID || `seo-baseline-${istDate()}`;
  const rel = path.relative(repoRoot, dir);
  const r = spawnSync("node", [path.join("scripts", "evidence-manifest.mjs"), "write", rel, "--session", sess, "--role", "builder"], { encoding: "utf8", cwd: repoRoot });
  if (r.status !== 0 || r.error) throw new Error(`evidence-manifest write failed on ${dir}:\n${r.stdout ?? ""}\n${r.stderr ?? ""}${r.error ? r.error.message : ""}`);
  if (!fs.existsSync(path.join(dir, "manifest.json"))) {
    throw new Error(`evidence-manifest write reported success but ${rel}/manifest.json does not exist — refusing to ship unmanifested evidence`);
  }
}

/** Verify a bundle dir's manifest before CONSUMING it (Evidence Law v2 —
 *  read-side integrity). Skipped when no manifest.json exists (e.g. the
 *  pre-M2 GSC UI export dirs, which carry old-style MANIFEST.sha256). */
export function verifyBundleIfManifested(repoRoot, dir) {
  if (!fs.existsSync(path.join(dir, "manifest.json"))) return false;
  const r = spawnSync("node", [path.join("scripts", "evidence-manifest.mjs"), "verify", path.relative(repoRoot, dir)], { encoding: "utf8", cwd: repoRoot });
  if (r.status !== 0 || r.error) throw new Error(`evidence bundle FAILS verification, refusing to consume it: ${dir}\n${r.stdout ?? ""}\n${r.stderr ?? ""}${r.error ? r.error.message : ""}`);
  return true;
}

/** A billable domain argument must look like a domain — catches the
 *  flag-ate-its-value CLI failure mode ("--domain --target x" → "true"). */
export function assertDomainish(value, flagName) {
  if (typeof value !== "string" || !/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(value)) {
    throw new Error(`${flagName} value ${JSON.stringify(value)} does not look like a domain — check the CLI flags (a flag that ate the next flag parses as "true")`);
  }
}

// ───────────────────────── commands ─────────────────────────

export async function cmdVerifyAccount({ fetchImpl = fetch, env = process.env } = {}) {
  const creds = loadCredentials({ env });
  const json = await dfsRequest(ENDPOINTS.userData, null, creds, fetchImpl);
  const money = json.tasks[0].result?.[0]?.money;
  if (typeof money?.balance !== "number") throw new Error("user_data returned no balance — account state unverifiable");
  return { ok: true, balance_usd: money.balance, total_funded_usd: money.total, cost_usd: json.cost || 0 };
}

export async function cmdPull(opts) {
  const {
    domain, target = opts.domain, location = DEFAULT_LOCATION, language = DEFAULT_LANGUAGE,
    limit = DEFAULT_LIMIT, maxCost = DEFAULT_MAX_COST_USD, session,
    repoRoot = process.cwd(), fetchImpl = fetch, env = process.env, manifest = true,
  } = opts;
  if (!domain) throw new Error("--domain is required");
  assertDomainish(domain, "--domain");
  assertDomainish(target, "--target");
  const creds = loadCredentials({ env });

  // mandatory free account check before anything billable
  const account = await cmdVerifyAccount({ fetchImpl, env });
  const meter = makeCostMeter(maxCost);
  const collected_at_utc = new Date().toISOString();

  const calls = [
    { name: "ranked-keywords", endpoint: ENDPOINTS.rankedKeywords, body: [{ target, location_code: location, language_code: language, limit, order_by: ["ranked_serp_element.serp_item.etv,desc"] }] },
    { name: "domain-rank-overview", endpoint: ENDPOINTS.domainOverview, body: [{ target, location_code: location, language_code: language }] },
    { name: "backlinks-summary", endpoint: ENDPOINTS.backlinksSummary, body: [{ target, include_subdomains: true }] },
  ];

  const outDir = claimDatedDir(path.join(repoRoot, "launches", domain, "baseline", "raw"), `dataforseo-${istDate()}`);
  const files = [];
  try {
    for (const c of calls) {
      meter.guard(c.endpoint);
      const json = await dfsRequest(c.endpoint, c.body, creds, fetchImpl);
      meter.add(json);
      const f = path.join(outDir, `${c.name}.json`);
      fs.writeFileSync(f, JSON.stringify(json, null, 2));
      files.push({ name: c.name, file: f, cost_usd: json.cost || 0 });
    }
    const pullMeta = {
      schema: "seo-baseline-pull/1",
      domain, target, location_code: location, language_code: language, limit,
      generated: istTimestamp(), collected_at_utc,
      account_balance_usd_before: account.balance_usd,
      calls: files.map((f) => ({ name: f.name, cost_usd: f.cost_usd })),
      total_cost_usd: +meter.spent.toFixed(6),
      vendor: "dataforseo", api: "narrow REST (3 endpoints — §3.5 bake-off doctrine, not the MCP)",
    };
    fs.writeFileSync(path.join(outDir, "pull-meta.json"), JSON.stringify(pullMeta, null, 2));
    if (manifest) writeBundleManifest(repoRoot, outDir, session, env);
  } catch (err) {
    // QUARANTINE, never orphan: a partial/unmanifested raw dir must not sit
    // where selectLatestRun/cmdRegister would consume it (Evidence Law v2;
    // reviewer-confirmed EV-4 blind spot). -FAILED dirs are ignored by
    // selection and stand as loud on-disk evidence of the aborted run.
    const quarantine = `${outDir}-FAILED`;
    try { fs.renameSync(outDir, quarantine); } catch { /* keep original path if rename impossible */ }
    err.message += ` [partial pull quarantined at ${fs.existsSync(quarantine) ? quarantine : outDir} — spent $${meter.spent.toFixed(4)}]`;
    throw err;
  }
  return { outDir, total_cost_usd: meter.spent, files: files.map((f) => f.file) };
}

export function cmdRegister(opts) {
  const { domain, gscDir, dfsDir, session, repoRoot = process.cwd(), env = process.env, manifest = true } = opts;
  if (!domain) throw new Error("--domain is required");
  assertDomainish(domain, "--domain");
  const base = path.join(repoRoot, "launches", domain, "baseline");
  // default selection is STRICT: -rN re-runs resolve numerically, any other
  // sibling (a different GSC property like -www) refuses and demands the flag
  const gDir = gscDir ?? selectLatestRun(path.join(base, "raw"), "gsc-ui-export-");
  const dDir = dfsDir ?? selectLatestRun(path.join(base, "raw"), "dataforseo-");

  const gaps = [];
  const sources = [];
  let gsc = null, ranked = null, overview = null, backlinks = null, pullMeta = null;

  if (gDir) {
    gsc = readGscExport(gDir);
    for (const f of fs.readdirSync(gDir).filter((x) => x.endsWith(".csv"))) {
      sources.push({ id: `gsc:${f}`, kind: "gsc-ui-export", vendor: "google-search-console", path: path.relative(repoRoot, path.join(gDir, f)), sha256: sha256File(path.join(gDir, f)), epistemology: LABELS.OBSERVED });
    }
  } else {
    gaps.push({ field: "gsc_16m", label: LABELS.UNKNOWN, reason: `no gsc-ui-export-* dir under ${path.relative(repoRoot, base)}/raw — register property + export ride QUESTIONS.md Q-GSC-COVERAGE` });
  }

  if (dDir) {
    // read-side integrity: refuse a raw bundle whose manifest no longer matches disk
    verifyBundleIfManifested(repoRoot, dDir);
    const readJson = (n) => {
      const f = path.join(dDir, `${n}.json`);
      if (!fs.existsSync(f)) { gaps.push({ field: n, label: LABELS.UNKNOWN, reason: `${n}.json missing in ${path.relative(repoRoot, dDir)}` }); return null; }
      sources.push({ id: `dataforseo:${n}`, kind: n, vendor: "dataforseo", path: path.relative(repoRoot, f), sha256: sha256File(f), epistemology: LABELS.ESTIMATE });
      return JSON.parse(fs.readFileSync(f, "utf8"));
    };
    const rk = readJson("ranked-keywords");
    ranked = rk ? normalizeRankedKeywords(rk) : null;
    const ov = readJson("domain-rank-overview");
    overview = ov ? normalizeDomainOverview(ov) : null;
    const bl = readJson("backlinks-summary");
    backlinks = bl ? normalizeBacklinks(bl) : null;
    const pm = path.join(dDir, "pull-meta.json");
    pullMeta = fs.existsSync(pm) ? JSON.parse(fs.readFileSync(pm, "utf8")) : null;
    // a raw file that EXISTS but normalizes to nothing is an UNKNOWN, not a
    // silent null — e.g. an unindexed target returns items: null
    const nullNormalized = [
      ["vendor_ranked_keywords", rk, ranked && ranked.keywords.length ? ranked : null],
      ["vendor_domain_overview", ov, overview],
      ["vendor_backlinks", bl, backlinks],
    ];
    for (const [field, raw, norm] of nullNormalized) {
      if (raw && !norm) gaps.push({ field, label: LABELS.UNKNOWN, reason: `raw response present in ${path.relative(repoRoot, dDir)} but the vendor returned NO data for this target (unindexed target / empty result) — recorded as UNKNOWN, not zero` });
    }
  } else {
    gaps.push({ field: "vendor_organic", label: LABELS.UNKNOWN, reason: "no dataforseo-* raw dir — GSC-only register (the documented vendor-neutral fallback path, §3.5)" });
  }

  gaps.push(
    { field: "ga4_12m", label: LABELS.UNKNOWN, reason: "GA4 Admin grants land with the Monday access chase (RPT-20260720-CHASE) — never invented (HARD GATE 6)" },
    { field: "crawl_fields", label: LABELS.UNKNOWN, reason: "crawler lane (Screaming Frog ruling / OnPage bake-off) is M3 remainder" },
    { field: "cwv", label: LABELS.UNKNOWN, reason: "CWV field-data lane is M3 remainder" },
    { field: "gsc_api_16m", label: LABELS.UNKNOWN, reason: "UI export caps tables at 1,000 rows; the API/BigQuery pull supersedes these tables at M3 remainder (daily Chart.csv series is complete regardless)" },
  );

  const kw = joinKeywords(gsc?.queries ?? [], ranked?.keywords ?? []);
  const register = {
    schema: REGISTER_SCHEMA,
    domain,
    generated: istTimestamp(),
    collected_at_utc: new Date().toISOString(),
    vendor_pull_meta: pullMeta ? { target: pullMeta.target, location_code: pullMeta.location_code, language_code: pullMeta.language_code, limit: pullMeta.limit, total_cost_usd: pullMeta.total_cost_usd, collected_at_utc: pullMeta.collected_at_utc } : null,
    sources,
    totals: {
      gsc_16m: gsc ? gscTotals(gsc) : null,
      vendor_domain_overview: overview,
      vendor_backlinks: backlinks,
    },
    keywords: {
      vendor_total_count: ranked?.total_count ?? null,
      vendor_returned: ranked?.returned ?? null,
      joined: kw.joined,
      vendor_only_count: kw.vendorOnly.length,
    },
    urls: buildUrlRegister(gsc?.pages ?? [], ranked?.keywords ?? []),
    gaps,
    flags: gsc?.flags ?? [],
  };
  if (register.totals.gsc_16m?.days_with_null_cells > 0) {
    register.flags.push(`gsc: ${register.totals.gsc_16m.days_with_null_cells} daily Chart.csv cell(s) were null ("-") and contribute 0 to the summed totals — declared, not hidden (HARD GATE 6)`);
  }

  // the register IS the baseline artifact — it gets the same manifest
  // discipline as the raws (Evidence Law v2; reviewer-confirmed gap)
  const outFile = claimDatedFile(path.join(base, "registers"), `register-${istDate()}`, ".json", JSON.stringify(register, null, 2));
  if (manifest) writeBundleManifest(repoRoot, path.join(base, "registers"), session, env);
  return { outFile, register };
}

export function cmdBakeoff(opts) {
  const { domain, registerFile, session, repoRoot = process.cwd(), env = process.env, manifest = true } = opts;
  if (!domain) throw new Error("--domain is required");
  assertDomainish(domain, "--domain");
  const base = path.join(repoRoot, "launches", domain, "baseline");
  let regFile = registerFile;
  if (!regFile) {
    // numeric (date, run) selection — a same-day -r2 CORRECTION must win over
    // its base name (raw lexicographic sort puts ".json" after "-r2.json";
    // reviewer-confirmed stale-evidence bug)
    regFile = selectLatestRun(path.join(base, "registers"), "register-", { ext: ".json", wantDir: false });
    if (!regFile) throw new Error(`no register-*.json under ${path.relative(repoRoot, path.join(base, "registers"))} — run register first`);
  }
  const registersDir = path.dirname(regFile);
  verifyBundleIfManifested(repoRoot, registersDir);
  const register = JSON.parse(fs.readFileSync(regFile, "utf8"));
  const bakeoff = computeBakeoff(register);
  const md = renderBakeoffMd(domain, register, bakeoff, {
    generated: istTimestamp(),
    registerRef: `${path.relative(repoRoot, regFile)} (sha256:${sha256File(regFile).slice(0, 16)}…)`,
  });
  const outDir = path.join(base, "bakeoff");
  const outFile = claimDatedFile(outDir, `${istDate()}-bakeoff`, ".md", md);
  if (manifest) writeBundleManifest(repoRoot, outDir, session, env);
  return { outFile, bakeoff };
}

// ───────────────────────── CLI ─────────────────────────

export function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  const opts = { _: [] };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith("--")) {
      const key = a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const val = rest[i + 1] != null && !rest[i + 1].startsWith("--") ? rest[++i] : "true";
      opts[key] = val;
    } else opts._.push(a);
  }
  return { cmd, opts };
}

async function main() {
  const { cmd, opts } = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();
  try {
    if (cmd === "verify-account") {
      const r = await cmdVerifyAccount();
      console.log(`account OK — balance $${r.balance_usd.toFixed(2)} of $${r.total_funded_usd} funded (call cost $${r.cost_usd})`);
    } else if (cmd === "pull" || cmd === "all") {
      const pullOpts = {
        domain: opts.domain, target: opts.target || opts.domain,
        location: opts.location ? Number(opts.location) : DEFAULT_LOCATION,
        language: opts.language || DEFAULT_LANGUAGE,
        limit: opts.limit ? Number(opts.limit) : DEFAULT_LIMIT,
        maxCost: opts.maxCost ? Number(opts.maxCost) : DEFAULT_MAX_COST_USD,
        session: opts.session, repoRoot,
      };
      const p = await cmdPull(pullOpts);
      console.log(`pull → ${path.relative(repoRoot, p.outDir)} (total cost $${p.total_cost_usd.toFixed(4)})`);
      if (cmd === "all") {
        const r = cmdRegister({ domain: opts.domain, gscDir: opts.gscDir, dfsDir: p.outDir, session: opts.session, repoRoot });
        console.log(`register → ${path.relative(repoRoot, r.outFile)}`);
        const b = cmdBakeoff({ domain: opts.domain, registerFile: r.outFile, session: opts.session, repoRoot });
        console.log(`bakeoff → ${path.relative(repoRoot, b.outFile)}`);
      }
    } else if (cmd === "register") {
      const r = cmdRegister({ domain: opts.domain, gscDir: opts.gscDir, dfsDir: opts.dfsDir, session: opts.session, repoRoot });
      console.log(`register → ${path.relative(repoRoot, r.outFile)}`);
      if (r.register.gaps.length) console.log(`  gaps (UNKNOWN, never invented): ${r.register.gaps.map((g) => g.field).join(", ")}`);
    } else if (cmd === "bakeoff") {
      const b = cmdBakeoff({ domain: opts.domain, registerFile: opts.register, session: opts.session, repoRoot });
      console.log(`bakeoff → ${path.relative(repoRoot, b.outFile)}`);
    } else {
      console.error("usage: seo-baseline.mjs verify-account | pull | register | bakeoff | all (see header)");
      process.exit(1);
    }
  } catch (err) {
    console.error(`seo-baseline: ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
