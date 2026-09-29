"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Doc = { r: string; t: string; g: string; h: string[]; x: string; k: string };
type Hit = { d: Doc; score: number; snippet: string };
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
const TYPES = ["All", "Ayurveda", "Stays & centres", "Products", "Training", "Group & awards", "Stories & media", "Contact & careers"];

function search(docs: Doc[], q: string): Hit[] {
  const terms = norm(q).split(/[^a-z0-9]+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const hits: Hit[] = [];
  for (const d of docs) {
    const T = norm(d.t), H = norm(d.h.join(" ")), X = norm(d.x);
    let score = 0, ok = true;
    for (const t of terms) {
      const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g");
      const s = (T.match(re)?.length || 0) * 8 + (H.match(re)?.length || 0) * 3 + Math.min(X.match(re)?.length || 0, 12);
      if (!s) { ok = false; break; }
      score += s;
    }
    if (!ok) continue;
    if (T.includes(norm(q))) score += 20;
    const i = X.search(new RegExp(`\\b${terms[0]}`));
    const start = Math.max(0, i - 80);
    const snippet = (start > 0 ? "…" : "") + d.x.slice(start, start + 220) + (d.x.length > start + 220 ? "…" : "");
    hits.push({ d, score, snippet });
  }
  return hits.sort((a, b) => b.score - a.score);
}

function Mark({ text, q }: { text: string; q: string }) {
  const terms = norm(q).split(/[^a-z0-9]+/).filter((t) => t.length > 1);
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return <>{text.split(re).map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>))}</>;
}

export default function SearchPage() {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [active, setActive] = useState(-1);
  const [shown, setShown] = useState(20);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q") || "";
    setQ(initial);
    fetch("/search-index.json").then((r) => r.json()).then(setDocs).catch(() => setDocs([]));
    if (!initial) inputRef.current?.focus();
  }, []);
  useEffect(() => {
    const u = new URL(window.location.href);
    if (q) u.searchParams.set("q", q); else u.searchParams.delete("q");
    window.history.replaceState(null, "", u.toString());
    setActive(-1);
    setShown(20);
  }, [q]);

  const hits = useMemo(() => (docs ? search(docs, q).filter((h) => type === "All" || h.d.k === type) : []), [docs, q, type]);
  const onKey = (e: React.KeyboardEvent) => {
    if (!hits.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = e.key === "ArrowDown" ? Math.min(active + 1, hits.length - 1) : Math.max(active - 1, -1);
      setActive(n);
      if (n === -1) inputRef.current?.focus();
      else listRef.current?.querySelectorAll<HTMLAnchorElement>("a")[n]?.focus();
    }
  };

  return (
    <section className="section" style={{ paddingTop: 40 }} onKeyDown={onKey}>
      <div className="container stack" style={{ gap: 28, maxWidth: 960 }}>
        <form role="search" className="search-box" onSubmit={(e) => e.preventDefault()} aria-label="Search kairali.com">
          <label htmlFor="site-q" className="sr-only">Search kairali.com</label>
          <input ref={inputRef} id="site-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search treatments, places, products, awards…" autoComplete="off" aria-controls="search-results" aria-describedby="search-help" />
        </form>
        <p id="search-help" className="meta">Searches the full text of every page on this site. Use the arrow keys to move through results.</p>
        <div className="facet" role="group" aria-label="Filter by section">
          {TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)}>{t}</button>)}
        </div>
        <div role="status" aria-live="polite" className="meta" style={{ fontSize: 15 }}>
          {docs === null ? "Loading the search index…" : q.trim().length < 2 ? "Type at least two characters to search." : `${hits.length} ${hits.length === 1 ? "result" : "results"} for “${q}”${hits.length > shown ? ` (showing ${shown})` : ""}${type !== "All" ? ` in ${type}` : ""}`}
        </div>
        {docs && q.trim().length >= 2 && hits.length === 0 && (
          <div className="card stack" style={{ gap: 12 }}>
            <h2 style={{ fontSize: "1.6rem" }}>No pages match “{q}”</h2>
            <p>Check the spelling, try a broader word such as “Panchakarma”, “oil” or “yoga”, or {type !== "All" ? <button type="button" onClick={() => setType("All")} style={{ all: "unset", cursor: "pointer", color: "var(--forest)", textDecoration: "underline" }}>search all sections</button> : "browse the main sections"}.</p>
            <div className="actions"><a className="btn secondary" href="/ayurveda.aspx">Discover Ayurveda</a><a className="btn secondary" href="/sitemap.aspx">Site map</a><a className="btn secondary" href="/get-in-touch.aspx">Get in touch</a></div>
          </div>)}
        <ul className="results" id="search-results" ref={listRef}>
          {hits.slice(0, shown).map((h, i) => (
            <li key={h.d.r}>
              <a href={h.d.r} aria-selected={i === active} onFocus={() => setActive(i)}>
                <span className="meta">{h.d.g || h.d.k}</span>
                <span className="r-title"><Mark text={h.d.t} q={q} /></span>
                <span style={{ fontSize: 15, color: "var(--muted)" }}><Mark text={h.snippet} q={q} /></span>
              </a>
            </li>))}
        </ul>
        {hits.length > shown && <div><button type="button" className="btn secondary" onClick={() => setShown(shown + 20)}>Show {Math.min(20, hits.length - shown)} more results ({hits.length - shown} remaining)</button></div>}
      </div>
    </section>
  );
}
