"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, PHONE, TAGLINE } from "@/lib/site";

const Chev = () => (<svg className="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>);

// Premium v4 header: charcoal utility strip → ivory masthead (search · centred logo · Enquire) → hairlined
// primary-nav row. Links, groups and the mega-menu / drawer behaviour are unchanged from Premium v3.
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const prevDrawerRef = useRef(false);

  const closeDrawer = () => {
    const main = document.getElementById("main");
    const footer = document.querySelector(".site-footer");
    const masthead = document.querySelector(".masthead");
    const util = document.querySelector(".util");
    const navrow = document.querySelector(".navrow");
    [main, footer, masthead, util, navrow].forEach((el) => el?.removeAttribute("inert"));
    setDrawer(false);
    toggleRef.current?.focus();
  };

  useEffect(() => { setOpen(null); setDrawer(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (drawer) {
          e.preventDefault();
          closeDrawer();
          return;
        }
        if (open !== null) {
          const btn = navRef.current?.querySelectorAll<HTMLButtonElement>(".nav-trigger")[open];
          setOpen(null); btn?.focus(); return;
        }
      }
      if (e.key === "Tab" && drawer && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first || !drawerRef.current.contains(document.activeElement)) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      }
    };
    const onClick = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, [drawer, open]);
  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
    const main = document.getElementById("main");
    const footer = document.querySelector(".site-footer");
    const masthead = document.querySelector(".masthead");
    const util = document.querySelector(".util");
    const navrow = document.querySelector(".navrow");
    const bgElements = [main, footer, masthead, util, navrow].filter(Boolean) as HTMLElement[];
    if (drawer) {
      bgElements.forEach((el) => el.setAttribute("inert", ""));
      closeRef.current?.focus();
    } else {
      bgElements.forEach((el) => el.removeAttribute("inert"));
      if (prevDrawerRef.current) {
        toggleRef.current?.focus();
      }
    }
    prevDrawerRef.current = drawer;
    return () => {
      bgElements.forEach((el) => el.removeAttribute("inert"));
    };
  }, [drawer]);

  const current = (href: string) => (href === pathname ? "page" : undefined);
  const inGroup = (i: number) => NAV[i].links.some((l) => l.href === pathname);

  return (
    <>
      <div className="util">
        <div className="container">
          <span className="util-tag">{TAGLINE}</span>
          <span className="util-links">
            <a href={PHONE.href}>Call us: {PHONE.label}</a>
            <Link href="/get-in-touch">Get in touch</Link>
            <Link href="/onlineconsultation">Online consultation</Link>
            <Link href="/careers">Careers</Link>
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container masthead">
          <div className="masthead-tools">
            <button ref={toggleRef} className="icon-btn menu-toggle" aria-expanded={drawer} aria-controls="drawer" onClick={() => setDrawer(true)} aria-label="Open menu">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
            <Link href="/search" className="icon-btn search-btn" aria-label="Search the site">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </Link>
          </div>
          <Link href="/" className="brand" aria-label="Kairali Ayurvedic Group — home">
            <img src="/brand/kairali-logo.svg" alt="Kairali — health through ayurveda, since 1908" width={96} height={84} />
          </Link>
          <div className="masthead-cta">
            <Link href="/enquiry-form" className="btn header-cta">Enquire now</Link>
          </div>
        </div>
        <div className="container navrow">
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
        </div>
      </header>
      <div ref={drawerRef} className={`drawer${drawer ? " open" : ""}`} id="drawer" role="dialog" aria-modal="true" aria-label="Menu" hidden={!drawer}
        onClick={(e) => { if (e.target === e.currentTarget) closeDrawer(); }}>
        <div className="drawer-panel">
          <div className="drawer-head">
            <img src="/brand/kairali-logo.svg" alt="" width={73} height={64} loading="lazy" decoding="async" />
            <button ref={closeRef} className="icon-btn" onClick={closeDrawer} aria-label="Close menu">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="drawer-search"><Link href="/search" className="text-link">Search the site</Link></div>
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
            <Link href="/get-in-touch" className="btn secondary">Get in touch</Link>
            <Link href="/careers" className="btn secondary">Careers</Link>
          </div>
        </div>
      </div>
    </>
  );
}
