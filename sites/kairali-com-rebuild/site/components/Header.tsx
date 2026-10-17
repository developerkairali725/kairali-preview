"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, PHONE } from "@/lib/site";

const Chev = () => (<svg className="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>);

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(null); setDrawer(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (drawer) { setDrawer(false); toggleRef.current?.focus(); }
      if (open !== null) {
        const btn = navRef.current?.querySelectorAll<HTMLButtonElement>(".nav-trigger")[open];
        setOpen(null); btn?.focus();
      }
    };
    const onClick = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, [drawer, open]);
  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
    if (drawer) closeRef.current?.focus();
  }, [drawer]);

  const current = (href: string) => (href === pathname ? "page" : undefined);
  const inGroup = (i: number) => NAV[i].links.some((l) => l.href === pathname);

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>Call us: <a href={PHONE.href}>{PHONE.label}</a></span>
          <Link href="/get-in-touch">Get in touch</Link>
          <Link href="/onlineconsultation" className="hide-sm">Online consultation</Link>
          <Link href="/careers" className="hide-sm">Careers</Link>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-row">
          <Link href="/" className="brand" aria-label="Kairali Ayurvedic Group — home">
            <img src="/brand/kairali-logo.svg" alt="Kairali — health through ayurveda, since 1908" width={82} height={72} />
          </Link>
          <nav className="primary-nav" aria-label="Main" ref={navRef}>
            <ul>
              {NAV.map((g, i) => (
                <li className="nav-item" key={g.label}>
                  <button className="nav-trigger" aria-expanded={open === i} aria-controls={`mega-${i}`} aria-current={inGroup(i) ? "true" : undefined}
                    onClick={(e) => { e.stopPropagation(); setOpen(open === i ? null : i); }}>
                    {g.label}<Chev />
                  </button>
                  <div className={`mega${open === i ? " open" : ""}`} id={`mega-${i}`}>
                    <p className="mega-title">{g.intro}</p>
                    <ul>
                      {g.links.map((l) => (
                        <li key={l.href}>
                          {l.external
                            ? <a href={l.href} className="mega-ext" rel="noopener" target="_blank">{l.label}<span className="sr-only"> (opens in a new tab)</span></a>
                            : <Link href={l.href} aria-current={current(l.href)}>{l.label}</Link>}
                        </li>))}
                    </ul>
                  </div>
                </li>))}
            </ul>
          </nav>
          <div className="header-tools">
            <Link href="/search" className="icon-btn" aria-label="Search the site">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </Link>
            <Link href="/enquiry-form" className="btn header-cta">Enquire now</Link>
            <button ref={toggleRef} className="icon-btn menu-toggle" aria-expanded={drawer} aria-controls="drawer" onClick={() => setDrawer(true)} aria-label="Open menu">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </header>
      <div className={`drawer${drawer ? " open" : ""}`} id="drawer" role="dialog" aria-modal="true" aria-label="Menu" hidden={!drawer}
        onClick={(e) => { if (e.target === e.currentTarget) setDrawer(false); }}>
        <div className="drawer-panel">
          <div className="drawer-head">
            <img src="/brand/kairali-logo.svg" alt="" width={73} height={64} />
            <button ref={closeRef} className="icon-btn" onClick={() => { setDrawer(false); toggleRef.current?.focus(); }} aria-label="Close menu">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
          <nav aria-label="Main (mobile)">
            {NAV.map((g) => (
              <details key={g.label} open={g.links.some((l) => l.href === pathname)}>
                <summary>{g.label}</summary>
                <ul>{g.links.map((l) => (<li key={l.href}>{l.external ? <a href={l.href} rel="noopener" target="_blank">{l.label} ↗</a> : <Link href={l.href} aria-current={current(l.href)}>{l.label}</Link>}</li>))}</ul>
              </details>))}
          </nav>
          <div className="drawer-actions">
            <Link href="/enquiry-form" className="btn">Enquire now</Link>
            <Link href="/onlineconsultation" className="btn secondary">Free online consultation</Link>
            <a href={PHONE.href} className="btn secondary">Call {PHONE.label}</a>
          </div>
        </div>
      </div>
    </>
  );
}
