"use client";
import { useMemo, useState } from "react";
import type { Collection, Edition } from "./DownloadCentre";

const kb = (b?: number) => (b ? (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`) : "");
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

export default function DownloadFilters({ collections, portal, checked }: { collections: Collection[]; portal: string; checked: string }) {
  const [q, setQ] = useState("");
  const [prop, setProp] = useState("");
  const [lang, setLang] = useState("");
  const [cur, setCur] = useState("");
  const props = useMemo(() => [...new Map(collections.map((c) => [c.property, c.propertyName || c.property])).entries()], [collections]);
  const langs = useMemo(() => [...new Set(collections.flatMap((c) => c.editions.map((e) => e.language).filter(Boolean) as string[]))].sort(), [collections]);
  const curs = useMemo(() => [...new Set(collections.flatMap((c) => c.editions.map((e) => e.currency).filter(Boolean)))].sort(), [collections]);

  const match = (c: Collection, e: Edition) =>
    (!lang || e.language === lang || (!e.language && lang === "English")) && (!cur || e.currency === cur) &&
    (!q || norm(`${c.title} ${c.propertyName} ${e.label || ""} ${e.language || ""} ${e.currency} ${e.period || ""}`).includes(norm(q)));
  const shown = collections.filter((c) => !prop || c.property === prop).map((c) => ({ ...c, editions: c.editions.filter((e) => match(c, e)) }))
    .filter((c) => c.editions.length);
  const current = shown.filter((c) => c.status !== "earlier");
  const earlier = shown.filter((c) => c.status === "earlier");
  const count = shown.reduce((n, c) => n + c.editions.length, 0);
  const reset = () => { setQ(""); setProp(""); setLang(""); setCur(""); };

  return (
    <div className="stack" style={{ gap: 32 }}>
      <form className="dl-controls" role="search" aria-label="Filter downloads" onSubmit={(e) => e.preventDefault()}>
        <div className="field"><label htmlFor="dl-q">Find a document</label><input id="dl-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try room rates, programmes or products" /></div>
        <div className="field"><label htmlFor="dl-p">Property / brand</label><select id="dl-p" value={prop} onChange={(e) => setProp(e.target.value)}><option value="">All</option>{props.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div className="field"><label htmlFor="dl-l">Language</label><select id="dl-l" value={lang} onChange={(e) => setLang(e.target.value)}><option value="">All languages</option>{langs.map((l) => <option key={l}>{l}</option>)}</select></div>
        <div className="field"><label htmlFor="dl-c">Currency</label><select id="dl-c" value={cur} onChange={(e) => setCur(e.target.value)}><option value="">All currencies</option>{curs.map((c) => <option key={c}>{c}</option>)}</select></div>
      </form>
      <p role="status" className="meta" style={{ fontSize: 15 }}>{count} document {count === 1 ? "edition" : "editions"} shown{(q || prop || lang || cur) && <> · <button type="button" onClick={reset} style={{ all: "unset", cursor: "pointer", color: "var(--forest)", textDecoration: "underline", minHeight: 44 }}>Clear filters</button></>}</p>

      {shown.length === 0 && (
        <div className="notice" role="note"><strong>No documents match these filters.</strong> Try another language, currency or search term, or <button type="button" onClick={reset} style={{ all: "unset", cursor: "pointer", textDecoration: "underline" }}>clear all filters</button>.</div>)}

      {current.length > 0 && (
        <section aria-labelledby="dl-current" className="stack" style={{ gap: 20 }}>
          <div className="stack" style={{ gap: 6 }}><h2 id="dl-current">Current editions</h2>
            <p className="meta">Opened from Kairali’s shared document library (<a href={portal} rel="noopener">kairali-documents</a>). Listing checked {checked}.</p></div>
          <div className="collections three">{current.map((c) => <Card key={c.id} c={c} />)}</div>
        </section>)}
      {earlier.length > 0 && (
        <section aria-labelledby="dl-earlier" className="stack" style={{ gap: 20 }}>
          <div className="stack" style={{ gap: 6 }}><h2 id="dl-earlier">Earlier editions still available</h2>
            <p className="meta">Historical documents kept available until replacements are published. Rates and prices in these files are <strong>not current</strong>; each is labelled with the period stated on the file where one is given.</p></div>
          <div className="collections three">{earlier.map((c) => <Card key={c.id} c={c} />)}</div>
        </section>)}
    </div>
  );
}

function Card({ c }: { c: Collection }) {
  return (
    <article className={`collection${c.status === "earlier" ? " earlier" : ""}`} aria-labelledby={`c-${c.id}`}>
      <span className="overline">{c.propertyName}</span>
      <h3 id={`c-${c.id}`}>{c.title}</h3>
      {
        <ul className="ed-list">
          {c.editions.map((e, i) => c.status === "earlier" ? (
            <li key={i}>
              <span>{e.label}<br /><span className="meta">{e.period ? `Period: ${e.period}` : "Date not stated on file"}{e.rates ? " · historical rates, not current" : ""} · {e.format} {kb(e.bytes)}</span></span>
              <a href={e.url} aria-label={`Open ${e.label} (${e.format})`}>Open</a>
            </li>) : (
            <li key={i}>
              <span>{e.language}{e.currency ? ` · ${e.currency}` : ""}<br /><span className="meta">{e.edition}{e.validity ? ` · ${e.validity}` : ""}{e.size ? ` · ${e.size}` : ""}</span></span>
              <a href={e.url} rel="noopener" target="_blank" aria-label={`Open ${c.title}, ${e.language} ${e.currency} (PDF, opens in a new tab)`}>Open PDF ↗</a>
            </li>))}
        </ul>}
    </article>
  );
}
