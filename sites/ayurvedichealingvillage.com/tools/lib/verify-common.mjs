// Shared helpers for the VERIFY-lane hosted checks (WOPS-AHV-FINAL-DRAFT-20260924-001).
// Run every tool from the SITE directory (sites/ayurvedichealingvillage.com).
//
// Protected staging (HARD GATE 14 — never expose a secret):
//  * browser traffic: attachStagingToken() (tools/lib/staging-auth.mjs) — token on staging-origin requests only;
//  * plain fetches: stagingFetch() below — the header is passed EXPLICITLY, only when the request URL is on the
//    staging origin AND https, and redirects are followed by hand so the token never rides an off-origin hop.
// The token value is never printed, logged or written; reports record only whether it was present.
import fs from "node:fs";
import path from "node:path";
import { TOKEN_HEADER } from "./staging-auth.mjs";

export const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 && i + 1 < process.argv.length ? process.argv[i + 1] : d; };
export const flag = (k) => process.argv.includes("--" + k);
export const baseArg = (d = "http://127.0.0.1:4471") => arg("base", d).replace(/\/+$/, "");
export const outDir = (d) => { const o = arg("out", d); fs.mkdirSync(o, { recursive: true }); return o; };
export const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
export const writeJson = (dir, name, obj) => { const p = path.join(dir, name); fs.writeFileSync(p, JSON.stringify(obj, null, 1) + "\n"); return p; };
export const nowIso = () => new Date().toISOString();
export const istStamp = (d = new Date()) => {
  const t = new Date(d.getTime() + 330 * 60000).toISOString();
  return `${t.slice(0, 10)} ${t.slice(11, 19)} IST`;
};

/** Where the run is pointed, and whether the staging token is available (never its value). */
export function runContext(BASE) {
  const https = /^https:/.test(BASE);
  return {
    base: BASE, https, tokenPresent: !!process.env.VERCEL_OIDC_TOKEN,
    tokenAttached: https && !!process.env.VERCEL_OIDC_TOKEN,
    note: https ? (process.env.VERCEL_OIDC_TOKEN ? "token attached to staging-origin requests only" : "NO VERCEL_OIDC_TOKEN in env — a protected deployment will answer with its sign-in wall; identity checks will fail rather than pass")
      : "http base (local build) — transport/HTTPS claims are NOT provable from this run",
  };
}

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—", middot: "·", hellip: "…", euro: "€", rarr: "→", larr: "←" };
export const decodeEntities = (s) => String(s)
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in ENT ? ENT[n.toLowerCase()] : m));

/** Remove script/style/template/noscript bodies (the RSC payload repeats the page inside <script>). */
export const stripNonContent = (html) => String(html)
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
  .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ");

export const htmlText = (frag) => decodeEntities(String(frag).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ")).replace(/[ \t ]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();

/** Outer HTML of the element whose OPEN tag starts at `start` (balanced on the same tag name). */
export function elementAt(html, start) {
  const m = /^<([a-z][a-z0-9-]*)\b/i.exec(html.slice(start, start + 40));
  if (!m) return null;
  const tag = m[1].toLowerCase();
  const re = new RegExp(`<(/?)${tag}\\b[^>]*?(/?)>`, "gi");
  re.lastIndex = start; let depth = 0, mm;
  while ((mm = re.exec(html))) {
    if (mm[1]) depth--; else if (!mm[2]) depth++;
    if (depth === 0) return html.slice(start, re.lastIndex);
  }
  return html.slice(start);
}
/** First element whose open tag matches `openTagRe` (a RegExp tested against the open tag text). */
export function findElement(html, openTagRe, tag = "[a-z][a-z0-9-]*") {
  const re = new RegExp(`<(${tag})\\b[^>]*>`, "gi"); let m;
  while ((m = re.exec(html))) if (openTagRe.test(m[0])) return { start: m.index, html: elementAt(html, m.index) };
  return null;
}
/** Nearest enclosing element with tag name `tag` around index `idx`. */
export function enclosing(html, idx, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>`, "gi"); let best = null, m;
  while ((m = re.exec(html)) && m.index < idx) { const el = elementAt(html, m.index); if (el && m.index + el.length > idx) best = { start: m.index, html: el }; }
  return best;
}

export function identityFromHtml(html) {
  const clean = stripNonContent(html);
  const pick = (re, s = html) => { const m = re.exec(s); return m ? htmlText(m[1]).slice(0, 200) : null; };
  const attr = (name) => { const m = new RegExp(`\\b${name}="([^"]*)"`, "i").exec(clean); return m ? decodeEntities(m[1]) : null; };
  return {
    title: pick(/<title[^>]*>([\s\S]*?)<\/title>/i),
    h1: pick(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i, clean),
    lang: (/<html\b[^>]*\blang="([^"]*)"/i.exec(html) || [])[1] || null,
    ahvRoute: attr("data-ahv-route"), ahvLocale: attr("data-ahv-locale"),
    canonical: (/<link\b[^>]*rel="canonical"[^>]*href="([^"]*)"/i.exec(html) || /<link\b[^>]*href="([^"]*)"[^>]*rel="canonical"/i.exec(html) || [])[1] || null,
  };
}

/** Signs that the response is NOT the page: an auth wall, a not-found page, or an empty body. */
export function wrongPageSigns(id, status) {
  const s = [];
  const t = `${id.title || ""} ${id.h1 || ""}`;
  if (status !== 200) s.push(`status ${status}`);
  if (/vercel|log ?in|sign ?in|authentication required|sso|access denied/i.test(t)) s.push("auth-wall-like title/H1");
  if (/\b404\b|not found|nicht gefunden|introuvable|page could not be found|no encontrada|non trovata/i.test(t)) s.push("not-found-like title/H1");
  if (!id.title) s.push("no <title>");
  return s;
}

/** Plain fetch to the staging origin. Token header ONLY for https + same-origin; manual redirects; body capped. */
export async function stagingFetch(url, BASE, { maxHops = 5, method = "GET" } = {}) {
  const origin = new URL(BASE).origin;
  const hops = [];
  let cur = url;
  for (let i = 0; i <= maxHops; i++) {
    const u = new URL(cur);
    const headers = { "user-agent": "ahv-verify/1.0 (+WOPS-AHV-FINAL-DRAFT-20260924-001)", accept: "text/html,*/*" };
    const sameOrigin = u.origin === origin;
    if (sameOrigin && u.protocol === "https:" && process.env.VERCEL_OIDC_TOKEN) headers[TOKEN_HEADER] = process.env.VERCEL_OIDC_TOKEN;
    let res;
    try { res = await fetch(cur, { method, headers, redirect: "manual" }); }
    catch (e) { return { status: 0, finalUrl: cur, hops, error: String(e.message || e).slice(0, 200), html: "" }; }
    hops.push({ url: cur, status: res.status, tokenSent: !!headers[TOKEN_HEADER] });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      const next = new URL(res.headers.get("location"), cur).href;
      if (new URL(next).origin !== origin) { hops.push({ url: next, status: null, note: "off-origin redirect — not followed (token must not ride it)" }); return { status: res.status, finalUrl: next, hops, html: "", offOrigin: true }; }
      cur = next; continue;
    }
    const html = method === "HEAD" ? "" : await res.text();
    return { status: res.status, finalUrl: cur, hops, html, contentType: res.headers.get("content-type") || "" };
  }
  return { status: 0, finalUrl: cur, hops, error: "too many redirects", html: "" };
}

// ── money ───────────────────────────────────────────────────────────────────────────────────────────
export const SYM = { "₹": "INR", "$": "USD", "€": "EUR" };
export const CUR_SYM = { INR: "₹", USD: "$", EUR: "€" };
/** Price tokens in text: "₹16,264", "$ 232", "€537*", and symbol-after forms "16.264 €". Numbers are integers. */
export function priceTokens(text) {
  const out = []; const t = String(text);
  const num = "(\\d{1,3}(?:,\\d{2})+,\\d{3}|\\d{1,3}(?:[,.\\u202f\\u00a0 ]\\d{3})+|\\d+)";
  const pre = new RegExp(`([₹$€])\\s?${num}(?![\\d])`, "g");
  const post = new RegExp(`(?<![\\d.,])${num}\\s?([₹€])`, "g");
  let m; const seen = new Set();
  while ((m = pre.exec(t))) { out.push({ cur: SYM[m[1]], value: +m[2].replace(/\D/g, ""), raw: m[0], at: m.index }); seen.add(m.index); }
  while ((m = post.exec(t))) { if (![...seen].some((i) => Math.abs(i - m.index) < 3)) out.push({ cur: SYM[m[2]], value: +m[1].replace(/\D/g, ""), raw: m[0], at: m.index }); }
  return out.sort((a, b) => a.at - b.at);
}

/** Playwright from the workspace (resolves via the repo-root node_modules). */
export async function playwright() { return import("@playwright/test"); }

/** Short, human line for the console. */
export const line = (status, id, detail) => console.log(`${status.padEnd(11)} ${id}${detail ? "  " + (typeof detail === "string" ? detail : JSON.stringify(detail)).slice(0, 320) : ""}`);
