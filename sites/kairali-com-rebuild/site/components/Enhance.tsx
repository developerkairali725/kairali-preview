"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Progressive enhancement only: content is fully visible without this script.
export default function Enhance() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | undefined;
    if (!reduce && "IntersectionObserver" in window) {
      root.classList.add("js-motion");
      io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io?.unobserve(e.target); }
      }, { rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        // Tall blocks are never hidden (content access first); short blocks fade in once.
        if (r.top < window.innerHeight || r.height > window.innerHeight * 0.8) el.classList.add("in"); else io!.observe(el);
      });
      // Failsafe: nothing stays hidden for screenshots, print, find-in-page or fast anchor jumps.
      const showAll = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
      window.addEventListener("beforeprint", showAll);
      window.setTimeout(showAll, 1500);
    }
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const play = t.closest<HTMLButtonElement>("[data-yt-play]");
      if (play) {
        const box = play.closest<HTMLElement>("[data-yt-id]");
        if (!box) return;
        const id = box.dataset.ytId!;
        const label = play.getAttribute("aria-label")?.replace(/^Play video: /, "").replace(/ \(loads YouTube\)$/, "") || "Video";
        if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
        const f = document.createElement("iframe");
        f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
        f.title = label;
        f.allow = "autoplay; encrypted-media; picture-in-picture";
        f.allowFullscreen = true;
        box.replaceChildren(f);
        f.focus();
        return;
      }
      const map = t.closest<HTMLButtonElement>("[data-load-map]");
      if (map) {
        const box = map.closest<HTMLElement>("[data-map-src]");
        const src = box?.dataset.mapSrc || "";
        if (box && /^https:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+\/)/.test(src)) {
          const f = document.createElement("iframe");
          f.src = src; f.title = "Map: Kairali corporate office"; f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
          box.replaceChildren(f);
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("click", onClick); io?.disconnect(); };
  }, [pathname]);
  return null;
}
