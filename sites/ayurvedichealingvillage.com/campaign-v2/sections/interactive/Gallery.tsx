"use client";
import type { GalleryUi } from "../../production/ui.ts";

// The photo gallery (Gallery.dc.html): a modal dialog opened by any [data-gallery-open] button (the Village
// "View all photos" button, whose data-track already fires gallery_open — not repeated here).
// Category filters (aria-pressed), a grid of photo buttons, and a lightbox view with Prev / Next / Close,
// an "n / N" counter and the "Get free doctor consultation" CTA. Mobile: full screen, 2 columns, and the
// buttons are always shown (no swipe-only control). Arrow keys work only while the dialog has focus
// (the dialog's onKeyDown). Escape closes the lightbox first, then the gallery. Focus returns to the trigger.
// Nothing inside downloads until the dialog opens (content renders only while open).

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import type { GalleryCategory, ImageRef } from "../../kit/types.ts";
import { useDialog } from "./useDialog";
import { wrapIndex } from "./ui-helpers.ts";

export type GalleryItem = { category: GalleryCategory; image: ImageRef };

const ORDER: GalleryCategory[] = ["Villas", "Therapies", "Grounds", "Dining", "Yoga"];

/** The kit's English gallery words (production/ui.ts GalleryUi shape). */
const GALLERY_EN: GalleryUi = {
  title: "Gallery", count: "The village · {n} photos", filter: "Filter photos", all: "All", close: "Close gallery", closeViewer: "Close photo viewer",
  prev: "Previous photo", next: "Next photo", photoOf: "Photo {i} of {n}", open: "Open photo:", cta: "Get free doctor consultation", categories: {},
};

const Svg = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={d} /></svg>
);
const CLOSE = "M5 5l14 14M19 5L5 19";
const PREV = "M15 5l-7 7 7 7";
const NEXT = "M9 5l7 7-7 7";

/** `ui` / `alt`: the page language's words and alt texts (production German and Russian routes); absent = English. */
export default function Gallery({ items, ui, alt = {} }: { items: GalleryItem[]; ui?: GalleryUi; alt?: Record<string, string> }) {
  const w = ui ?? GALLERY_EN;
  const altOf = (im: GalleryItem["image"]) => alt[im.id] ?? im.alt;
  const catName = (c: string) => (c === "All" ? w.all : w.categories[c] ?? c);
  const fill = (s: string, i: number, n: number) => s.replace("{i}", String(i)).replace("{n}", String(n));
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<"All" | GalleryCategory>("All");
  const [idx, setIdx] = useState(-1); // lightbox index within the filtered list; -1 = grid view
  const lastThumb = useRef<number>(-1);
  const viewer = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLUListElement>(null);

  const idxRef = useRef(idx);
  idxRef.current = idx;
  const closeAll = useCallback(() => { setOpen(false); setIdx(-1); setCat("All"); }, []);
  // Escape: the lightbox first, then the gallery.
  const onEscape = useCallback(() => { if (idxRef.current >= 0) setIdx(-1); else closeAll(); }, [closeAll]);
  const { ref, trapKeyDown, setTrigger, skipFocusReturn, dialogProps } = useDialog(open, closeAll, onEscape);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target instanceof Element ? e.target.closest("[data-gallery-open]") : null;
      if (!t) return;
      e.preventDefault();
      setTrigger(t);
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [setTrigger]);

  const cats = ORDER.filter((c) => items.some((g) => g.category === c));
  const list = cat === "All" ? items : items.filter((g) => g.category === cat);
  const n = list.length;
  const current = idx >= 0 && idx < n ? list[idx] : null;

  // Focus: into the viewer when it opens; back to the photo that opened it when it closes.
  const wasViewing = useRef(false);
  useEffect(() => {
    if (current && !wasViewing.current) viewer.current?.querySelector<HTMLElement>(".lp-gal__next")?.focus();
    if (!current && wasViewing.current && lastThumb.current >= 0) {
      grid.current?.querySelectorAll<HTMLElement>(".lp-gal__thumb")[lastThumb.current]?.focus();
    }
    wasViewing.current = !!current;
  }, [current]);

  const show = (i: number) => { lastThumb.current = i; setIdx(i); };
  const step = (d: number) => setIdx((i) => { const j = wrapIndex(i + d, n); lastThumb.current = j; return j; });

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    trapKeyDown(e);
    if (!current) return;
    const rtl = document.documentElement.dir === "rtl";
    if (e.key === "ArrowRight") { e.preventDefault(); step(rtl ? -1 : 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(rtl ? 1 : -1); }
  };

  const toEnquire = () => {
    skipFocusReturn();
    closeAll();
    // After the dialog has closed and the scroll lock is released.
    window.setTimeout(() => {
      const sec = document.getElementById("enquiry");
      if (!sec) return;
      sec.scrollIntoView({ block: "start" });
      const h = sec.querySelector<HTMLElement>("h2") ?? sec;
      if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
      h.focus({ preventScroll: true });
    }, 0);
  };

  return (
    <dialog ref={ref} className="lp-dlg lp-gal" aria-labelledby="lp-gal-h" {...dialogProps} onKeyDown={onKeyDown}>
      {open ? (
        <div className="lp-gal__inner">
          <div className="lp-gal__top" hidden={!!current}>
            <div className="lp-gal__titles">
              <p className="lp-over lp-gal__count">{fill(w.count, 0, n)}</p>
              <h2 id="lp-gal-h" className="lp-gal__h">{w.title}</h2>
            </div>
            <div className="lp-gal__filters" role="group" aria-label={w.filter}>
              {(["All", ...cats] as const).map((c) => (
                <button key={c} type="button" className="lp-gal__filter" aria-pressed={c === cat}
                  onClick={() => { setCat(c); setIdx(-1); lastThumb.current = -1; }}>{catName(c)}</button>
              ))}
            </div>
            <button type="button" className="lp-gal__close" aria-label={w.close} onClick={closeAll}><Svg d={CLOSE} /></button>
          </div>
          {current ? (
            <div className="lp-gal__viewer" ref={viewer} role="group" aria-roledescription="photo viewer" aria-label={fill(w.photoOf, idx + 1, n)}>
              <div className="lp-gal__vbar">
                <p className="lp-gal__pos" aria-live="polite">{idx + 1} / {n} · {catName(current.category)}</p>
                <button type="button" className="lp-gal__close" aria-label={w.closeViewer} onClick={() => setIdx(-1)}><Svg d={CLOSE} /></button>
              </div>
              <div className="lp-gal__stage">
                <button type="button" className="lp-gal__nav lp-gal__prev" aria-label={w.prev} onClick={() => step(-1)}><span className="lp-mirror"><Svg d={PREV} size={22} /></span></button>
                <div className="lp-gal__photo">
                  <Image key={current.image.id} src={current.image.src} alt={altOf(current.image)} width={current.image.width} height={current.image.height}
                    sizes="(max-width: 767px) 100vw, 80vw" className="lp-gal__img" />
                </div>
                <button type="button" className="lp-gal__nav lp-gal__next" aria-label={w.next} onClick={() => step(1)}><span className="lp-mirror"><Svg d={NEXT} size={22} /></span></button>
              </div>
              <div className="lp-gal__foot">
                <p className="lp-gal__caption">{altOf(current.image)}</p>
                <button type="button" className="lp-btn lp-gal__cta" onClick={toEnquire}
                  data-track="cta_click" data-track-cta="consult" data-track-position="lightbox">{w.cta}</button>
              </div>
            </div>
          ) : (
            <ul className="lp-gal__grid" ref={grid}>
              {list.map((g, i) => (
                <li key={g.image.id}>
                  <button type="button" className="lp-gal__thumb" aria-label={`${w.open} ${altOf(g.image)}`} onClick={() => show(i)}>
                    <Image src={g.image.src} alt="" width={g.image.width} height={g.image.height} loading="lazy"
                      sizes="(max-width: 767px) 50vw, 25vw" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </dialog>
  );
}
