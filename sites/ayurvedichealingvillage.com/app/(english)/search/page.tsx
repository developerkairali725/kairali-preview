import "@kairali/ui/brand-tokens.css";
import { CONSENT_RUNTIME } from "../_families/consent-runtime";
import analyticsConfig from "../../../analytics.config.json";
import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { siteChrome } from "./site-chrome";

/**
 * /search/?q=… — the results page behind the header search (Option B-lite,
 * D-20260922-37 / brainstorm §3.2). Three jobs:
 *
 *   1. No-JS fallback. The overlay's form and the header dialog submit here when
 *      JavaScript is off or has not loaded; the results are rendered SERVER-SIDE
 *      from the same index (public/ahv/search-index.json) with the same engine
 *      (public/design/search.js, run in node) — grouped Programmes / Questions /
 *      Pages, one-line answer per programme, the governed safety classes and the
 *      permanent fallback row (WhatsApp +91 92898 38797 · free online consultation
 *      · +91 9555 156 156). No client code is needed for the page to be useful.
 *   2. The WebSite SearchAction target (schema.ts) — a crawler told about
 *      /search/?q={search_term_string} lands on a real page.
 *   3. Shareable results ("send my mother the link").
 *
 * With JavaScript the layout's search.js also hooks the strip's search button, so
 * the instant overlay is one tap away here too. The page is deliberately plain:
 * the design's own paper/ink tokens and fonts, no design runtime, noindex
 * (search results are never indexable), dynamic on purpose (it reads ?q=).
 *
 * Locked facts only. Prices and durations come from the index's dated tariff
 * snapshot; an expired price prints "Request a quote".
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Kairali | Kairali – The Ayurvedic Healing Village",
  robots: { index: false, follow: true },
};

type Row = { route?: string; id?: string; data: Record<string, any>; hits: string[] };
type Result = {
  typed: string; cls: string; total: number; order: string[]; corrected: string | null; caveats: string[];
  programmes: Row[]; questions: Row[]; pages: Row[];
};
type Engine = { priceAvailable: (p: any) => boolean; query: (q: string, o: { scope: string; limit?: number }) => Result; answerLine: (p: any, cur: string, ui: any) => string };

let cached: { engine: Engine; index: any } | null = null;
function engine(): { engine: Engine; index: any } {
  if (cached) return cached;
  const src = readFileSync(join(process.cwd(), "public/design/search.js"), "utf8");
  const index = JSON.parse(readFileSync(join(process.cwd(), "public/ahv/search-index.json"), "utf8"));
  const ctx: any = { console };
  vm.createContext(ctx);
  vm.runInContext(src, ctx, { filename: "search.js" });
  cached = { engine: ctx.AHVSearch.createEngine(index) as Engine, index };
  return cached;
}

const WA = "https://wa.me/919289838797";
const TEL = "tel:+919555156156";
const CONSULT = "/online-consultation/";
const paper = "var(--ivory)", ink = "var(--ink)", muted = "color-mix(in srgb, var(--ink) 78%, var(--ivory))", gold = "var(--bronze-400)", green = "var(--forest-500)", brown = "var(--forest-700)";
const rowStyle: React.CSSProperties = { display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, minHeight: 64, padding: "10px 40px 10px 16px", color: ink, textDecoration: "none", position: "relative", borderTop: "1px solid color-mix(in srgb, var(--bronze-400) 18%, var(--ivory))" };
const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, padding: "0 16px", borderRadius: 4, fontWeight: 700, fontSize: 14, letterSpacing: 1.2, textTransform: "uppercase", textDecoration: "none", flex: "1 1 180px", textAlign: "center" };

function Group({ title, rows, render }: { title: string; rows: Row[]; render: (r: Row) => React.ReactNode }) {
  if (!rows.length) return null;
  return (
    <section aria-label={title} style={{ marginTop: 18 }}>
      <h2 style={{ font: "700 12.5px Mulish, sans-serif", letterSpacing: 2.4, textTransform: "uppercase", color: "var(--bronze-600)", margin: "0 0 6px" }}>{title}</h2>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, border: "1px solid color-mix(in srgb, var(--bronze-400) 18%, var(--ivory))", borderRadius: 4, background: "var(--card-bg)" }}>
        {rows.map((r, i) => <li key={`${r.route ?? r.id ?? "row"}-${i}`}>{render(r)}</li>)}
      </ul>
    </section>
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.q) ? sp.q[0] ?? "" : sp.q;
  const typed = String(raw || "").slice(0, 120).trim();
  const { engine: eng, index } = engine();
  const chrome = siteChrome();
  const measurement = process.env[analyticsConfig.activation.env] === analyticsConfig.activation.enabledWhen
    ? { ga4: analyticsConfig.measurement.ga4.id, clarity: analyticsConfig.measurement.clarity.id, metaPixel: analyticsConfig.measurement.metaPixel.id }
    : undefined;
  const consentScript = `(function () {
    var cfg = ${JSON.stringify({ breakpoint: 700, measurement })};
    var host = document.getElementById("ahv-design-root");
    ${CONSENT_RUNTIME}
    ensureConsentNotice();
    if (consentChoice() === "accepted") startMeasurement();
    window.addEventListener("resize", function () {
      var notice = document.getElementById("ahv-consent");
      if (notice) notice.remove();
      ensureConsentNotice();
    });
  })();`;
  const ui = index.ui;
  const res = typed.length >= 2 ? eng.query(typed, { scope: "site", limit: 1000 }) : null;
  const status = !res ? "" : res.total === 0 ? ui.zero.replace("{q}", typed) : res.corrected
    ? ui.showingFor.replace("{corrected}", res.corrected).replace("{typed}", typed)
    : (res.total === 1 ? ui.resultOne : ui.results).replace("{n}", String(res.total)).replace("{q}", typed);
  const rowT: React.CSSProperties = { fontSize: 18, lineHeight: 1.35 };
  const rowA: React.CSSProperties = { fontSize: 15, lineHeight: 1.45, color: muted };
  const chevron = <span aria-hidden="true" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: gold, fontSize: 22 }}>›</span>;
  return (
    // id="ahv-design-root": chrome.js (© line, WhatsApp, one chat link) and consistency.js scope their passes to this
    // id, so the lifted footer gets the same additions here as on every design page; overflow-x clip is what the
    // mobile views' root carries (the narrow header's right-hand group is wider than a 390px viewport by design).
    <div id="ahv-design-root" style={{ minHeight: "100vh", background: paper, color: ink, fontFamily: "Mulish, sans-serif", fontSize: 17, lineHeight: 1.5, overflowX: "clip" }}>
      <link rel="stylesheet" href="/ahv/fonts/ahv-33eeac48ab44.css" />
      {/* the site's own header + footer, lifted from the design's prerendered snapshot (site-chrome.ts) */}
      <style dangerouslySetInnerHTML={{ __html: chrome.css }} />
      <div dangerouslySetInnerHTML={{ __html: chrome.header }} />
      <main style={{ width: "min(760px,94%)", margin: "0 auto", padding: "26px 0 40px" }}>
        <h1 style={{ fontFamily: "Marcellus, serif", fontWeight: 400, fontSize: 32, margin: "0 0 14px" }}>{ui.dialogTitle}</h1>
        <form action="/search/" method="get" role="search" style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 56, border: "1px solid var(--bronze-400)", borderRadius: 4, background: "var(--card-bg)", padding: "0 6px 0 14px" }}>
          <span aria-hidden="true" style={{ color: "var(--bronze-600)", fontSize: 20 }}>⌕</span>
          <label htmlFor="search-q" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>{ui.dialogTitle}</label>
          <input id="search-q" name="q" type="search" maxLength={120} defaultValue={typed} placeholder={ui.placeholder} autoComplete="off" style={{ flex: 1, minWidth: 0, minHeight: 54, border: 0, outline: "none", background: "transparent", font: "18px Mulish, sans-serif", color: ink }} />
          <button type="submit" style={{ minHeight: 44, padding: "0 18px", border: 0, borderRadius: 4, background: brown, color: paper, font: "700 14px Mulish, sans-serif", letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer" }}>Search</button>
        </form>
        {res ? (
          <p aria-live="polite" style={{ margin: "12px 0 0", fontSize: 15.5, color: muted }}>{status}</p>
        ) : (
          <p style={{ margin: "12px 0 0", fontSize: 15.5, color: muted }}>{ui.emptyHeading}</p>
        )}
        {res && res.cls === "URGENT_MEDICAL_HELP" ? <div role="note" style={{ display: "flex", gap: 12, borderLeft: "3px solid var(--color-error)", background: "color-mix(in srgb, var(--color-error) 4%, var(--card-bg))", padding: "12px 16px", margin: "12px 0 0" }}><span aria-hidden="true" style={{ fontFamily: "Marcellus, serif", color: "var(--color-error)" }}>!</span><p style={{ margin: 0, fontSize: 15.5 }}>{ui.urgent}</p></div> : null}
        {res && res.cls === "NOT_TREATED" ? <p style={{ borderLeft: `3px solid ${gold}`, background: "var(--card-bg)", padding: "12px 16px", margin: "12px 0 0", fontSize: 15.5 }}>{ui.declined}</p> : null}
        {res && res.cls === "CONSULT_FIRST" ? <p style={{ borderLeft: `3px solid ${gold}`, background: "var(--card-bg)", padding: "12px 16px", margin: "12px 0 0", fontSize: 15.5 }}>{ui.consultFirst}</p> : null}
        {res && res.cls === "MULTIPLE_POSSIBLE_MATCHES" && res.programmes.length > 1 ? <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--bronze-600)" }}>{ui.multi}</p> : null}
        {res ? res.caveats.map((c) => <p key={c} style={{ margin: "12px 0 0", fontSize: 15.5, color: muted, borderLeft: `3px solid ${gold}`, paddingLeft: 12 }}>{c}</p>) : null}
        {res ? res.order.map((k) => {
          if (k === "programmes") return <Group key={k} title={ui.groups.programmes} rows={res.programmes} render={(r) => { const p = r.data; const a = eng.answerLine(p, "INR", ui) + (eng.priceAvailable(p) && p.basis !== "night" ? " " + ui.basis : ""); return <a href={p.route} style={rowStyle}><span style={rowT}>{p.name}{p.sanskrit ? <span style={{ fontFamily: "Marcellus, serif", fontSize: 15, color: "var(--bronze-600)", marginLeft: 8 }}>{p.sanskrit}</span> : null}</span><span style={rowA}>{a}</span>{chevron}</a>; }} />;
          if (k === "questions") return <Group key={k} title={ui.groups.questions} rows={res.questions} render={(r) => { const q = r.data; return <a href={`/faqs-downloads/?q=${encodeURIComponent(typed)}#${q.id}`} style={rowStyle}><span style={rowT}>{q.q}</span><span style={rowA}>{q.topic}</span>{chevron}</a>; }} />;
          return <Group key={k} title={ui.groups.pages} rows={res.pages} render={(r) => { const p = r.data; return <a href={p.route} style={rowStyle}><span style={rowT}>{p.label}</span>{p.desc ? <span style={rowA}>{p.desc}</span> : null}{chevron}</a>; }} />;
        }) : null}
        {!res || res.total === 0 ? (
          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
            {ui.emptyButtons.map((b: any) => <a key={b.label} href={b.href || "/ayurvedic-treatments/"} style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 72, padding: "8px 12px", border: "1.5px solid color-mix(in srgb, var(--bronze-400) 35%, var(--ivory))", borderRadius: 4, background: "var(--card-bg)", fontSize: 18, color: ink, textDecoration: "none" }}>{b.label}</a>)}
          </div>
        ) : null}
        <div style={{ marginTop: 28, borderTop: "1px solid color-mix(in srgb, var(--bronze-400) 18%, var(--ivory))", paddingTop: 14 }}>
          <p style={{ margin: "0 0 10px", fontSize: 15, color: muted }}>{ui.notSure}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: green, color: paper }}>{ui.fallback.whatsapp}</a>
            <a href={CONSULT} style={{ ...btn, background: "var(--marigold-400)", color: ink }}>{ui.fallback.consultation}</a>
            <a href={TEL} style={{ ...btn, border: `1.5px solid ${brown}`, color: brown, background: "var(--card-bg)" }}>{ui.fallback.call}</a>
          </div>
        </div>
      </main>
      <div dangerouslySetInnerHTML={{ __html: chrome.footer }} />
      <script dangerouslySetInnerHTML={{ __html: consentScript }} />
      {chrome.script ? <script dangerouslySetInnerHTML={{ __html: chrome.script }} /> : null}
    </div>
  );
}
