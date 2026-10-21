"use client";
// Deliberate browsing for long lists (awards, news). Every item is server-rendered (crawlable, works without
// JavaScript); after hydration the list is filtered and shown in pages of `pageSize` with a "Show more" control.
import { useEffect, useMemo, useState } from "react";

export type BrowseItem = {
  id: string; title: string; href: string | null; external?: boolean; summary: string; year: number | null; date?: string | null;
  dateLabel: string; facets: Record<string, string>; image?: { src: string; w: number; h: number; alt?: string } | null; badges?: string[];
};
type Facet = { key: string; label: string };

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
const UNDATED = "Date not stated";

export default function Browse({ items, facets, pageSize = 12, label, recentSince, withImages = true, idPrefix }: {
  items: BrowseItem[]; facets: Facet[]; pageSize?: number; label: string; recentSince?: string; withImages?: boolean; idPrefix: string;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Record<string, string>>({});
  const [year, setYear] = useState("");
  const [order, setOrder] = useState<"new" | "old">("new");
  const [scope, setScope] = useState<"recent" | "all">(recentSince ? "recent" : "all");
  const [shown, setShown] = useState(pageSize);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    setPanelOpen(window.matchMedia("(min-width: 900px)").matches);
    // Back-navigation from a detail page: /…#<item-id> reveals and scrolls to that item.
    const revealHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const idx = sorted(items, "new").findIndex((x) => x.id === id);
      if (idx >= 0) {
        setScope("all");
        setShown(Math.max(pageSize, Math.ceil((idx + 1) / pageSize) * pageSize));
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "center" }), 0);
      }
    };
    revealHash();
    const retry = window.setTimeout(revealHash, 150);
    window.addEventListener("hashchange", revealHash);
    window.addEventListener("popstate", revealHash);
    return () => {
      window.clearTimeout(retry);
      window.removeEventListener("hashchange", revealHash);
      window.removeEventListener("popstate", revealHash);
    };
  }, [items, pageSize]);

  const years = useMemo(() => {
    const ys = [...new Set(items.map((i) => i.year).filter((y): y is number => y !== null))].sort((a, b) => b - a);
    return items.some((i) => i.year === null) ? [...ys.map(String), UNDATED] : ys.map(String);
  }, [items]);
  const options = (key: string) => [...new Set(items.map((i) => i.facets[key]).filter(Boolean))].sort();

  const filtered = useMemo(() => sorted(items, order).filter((i) =>
    (scope === "all" || !recentSince || (i.date ?? "") >= recentSince) &&
    (!year || (year === UNDATED ? i.year === null : String(i.year) === year)) &&
    facets.every((f) => !sel[f.key] || i.facets[f.key] === sel[f.key]) &&
    (!q || norm(`${i.title} ${i.summary} ${Object.values(i.facets).join(" ")} ${i.year ?? ""}`).includes(norm(q)))
  ), [items, order, scope, recentSince, year, facets, sel, q]);

  // Paging resets only when the visitor changes a filter (not on mount or hash-based back navigation).
  const change = <T,>(set: (v: T) => void) => (v: T) => { set(v); setShown(pageSize); };
  const visible = new Set(filtered.slice(0, shown).map((i) => i.id));
  const list = sorted(items, order);
  const active = !!(q || year || Object.values(sel).some(Boolean));
  const reset = () => { setQ(""); setSel({}); setYear(""); setShown(pageSize); };

  return (
    <div className="browse stack" style={{ gap: 20 }}>
      {recentSince && (
        <div className="facet" role="group" aria-label={`${label}: period`}>
          <button type="button" aria-pressed={scope === "recent"} onClick={() => change(setScope)("recent")}>Recent (last 12 months)</button>
          <button type="button" aria-pressed={scope === "all"} onClick={() => change(setScope)("all")}>All {label.toLowerCase()}</button>
        </div>)}
      <details className="filter-panel" open={panelOpen} onToggle={(e) => setPanelOpen((e.target as HTMLDetailsElement).open)}>
        <summary>Search and filter {label.toLowerCase()}</summary>
        <form className="dl-controls browse-controls" role="search" aria-label={`Filter ${label.toLowerCase()}`} onSubmit={(e) => e.preventDefault()}>
          <div className="field"><label htmlFor={`${idPrefix}-q`}>Search</label><input id={`${idPrefix}-q`} type="search" value={q} onChange={(e) => change(setQ)(e.target.value)} placeholder="Name, organiser or keyword" /></div>
          <div className="field"><label htmlFor={`${idPrefix}-year`}>Year</label><select id={`${idPrefix}-year`} value={year} onChange={(e) => change(setYear)(e.target.value)}><option value="">All years</option>{years.map((y) => <option key={y}>{y}</option>)}</select></div>
          {facets.map((f) => (
            <div className="field" key={f.key}><label htmlFor={`${idPrefix}-${f.key}`}>{f.label}</label>
              <select id={`${idPrefix}-${f.key}`} value={sel[f.key] || ""} onChange={(e) => change(setSel)({ ...sel, [f.key]: e.target.value })}><option value="">All</option>{options(f.key).map((o) => <option key={o}>{o}</option>)}</select></div>))}
          <div className="field"><label htmlFor={`${idPrefix}-order`}>Order</label><select id={`${idPrefix}-order`} value={order} onChange={(e) => change(setOrder)(e.target.value as "new" | "old")}><option value="new">Newest first</option><option value="old">Oldest first</option></select></div>
        </form>
      </details>
      <p role="status" className="meta" style={{ fontSize: 15 }}>
        Showing {Math.min(shown, filtered.length)} of {filtered.length} {filtered.length === 1 ? "item" : "items"}{scope === "recent" && recentSince ? " from the last 12 months" : ""}
        {active && <> · <button type="button" className="link-btn" onClick={reset}>Clear filters</button></>}
      </p>
      {filtered.length === 0 && (
        <div className="notice" role="note"><strong>Nothing matches these filters.</strong> Try another year or keyword, or <button type="button" className="link-btn" onClick={() => { reset(); setScope("all"); }}>show everything</button>.</div>)}
      <ol className="browse-list">
        {list.map((i) => (
          <li key={i.id} id={i.id} hidden={!visible.has(i.id)} className="browse-item">
            {withImages && i.image && (
              <div className="browse-thumb" aria-hidden="true"><img src={i.image.src} width={i.image.w} height={i.image.h} alt="" loading="lazy" decoding="async" /></div>)}
            <div className="stack" style={{ gap: 6 }}>
              <p className="meta">{i.dateLabel}{Object.values(i.facets).filter(Boolean).length ? " · " + Object.values(i.facets).filter(Boolean).join(" · ") : ""}</p>
              <h3 className="browse-title">{i.href ? (i.external ? <a href={i.href} rel="noopener">{i.title}<span className="sr-only"> (whyayurveda.org)</span></a> : <a href={i.href}>{i.title}</a>) : i.title}</h3>
              {i.badges?.map((b) => <span key={b} className="badge">{b}</span>)}
              {i.summary && <p style={{ fontSize: 15 }}>{i.summary}</p>}
            </div>
          </li>))}
      </ol>
      {shown < filtered.length && (
        <div><button type="button" className="btn secondary" onClick={() => setShown(shown + pageSize)}>Show {Math.min(pageSize, filtered.length - shown)} more <span className="sr-only">{label.toLowerCase()}</span> ({filtered.length - shown} remaining)</button></div>)}
    </div>
  );
}

function sorted(items: BrowseItem[], order: "new" | "old") {
  const key = (i: BrowseItem) => i.date || (i.year ? `${i.year}-00-00` : "");
  const dated = items.filter((i) => i.year !== null).sort((a, b) => (order === "new" ? key(b).localeCompare(key(a)) : key(a).localeCompare(key(b))));
  return [...dated, ...items.filter((i) => i.year === null)]; // undated records always last, never guessed
}
