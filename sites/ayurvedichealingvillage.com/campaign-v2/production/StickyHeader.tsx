"use client";

import { useEffect } from "react";

/**
 * Owner, 8 Oct 2026: "the header should be sticky in desktop view so when we scroll the CTA is always there".
 * The header over the hero is unchanged. Once it has scrolled out of view, this marks it [data-stuck] and
 * production.css pins it to the top as a compact bar carrying the consultation CTA — at desktop widths only; on
 * phones the attribute matches no rule, so their header and the site's bottom bar stay as they are. The header is
 * absolutely positioned over the hero, so pinning it moves nothing else on the page. Without JavaScript it simply
 * stays at the top of the page, as before. Presentation only: no link, event or form is touched.
 */
export default function StickyHeader() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".lp-prod .lp-header");
    if (!header) return;
    let stuck = false;
    let natural = header.offsetHeight;
    const update = () => {
      // the header's own height over the hero, read only while it sits there (pinned, it is shorter)
      if (!stuck) natural = header.offsetHeight || natural;
      const next = window.scrollY > natural;
      if (next === stuck) return;
      stuck = next;
      if (stuck) header.setAttribute("data-stuck", "");
      else header.removeAttribute("data-stuck");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      header.removeAttribute("data-stuck");
    };
  }, []);
  return null;
}
