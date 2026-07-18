"use client";
// Category filter — the STRATEGY §4 portfolio_filter soft signal. Categories
// are the honest ones the screened capture set actually supports (bridal ·
// cocktail & party · editorial); a "destination" filter waits for the hi-res
// shoot sets — no capture is destination-labelled and we do not invent labels.
import { useState } from "react";
import Image from "next/image";

export type Work = {
  src: string;
  label: string;
  category: "bridal" | "cocktail-party" | "editorial";
  alt: string;
};

const FILTERS = [
  { id: "all", label: "All work" },
  { id: "bridal", label: "Bridal" },
  { id: "cocktail-party", label: "Cocktail & party" },
  { id: "editorial", label: "Editorial" },
] as const;

export function Gallery({ works }: { works: Work[] }) {
  const [active, setActive] = useState<string>("all");
  const shown = works.filter((w) => active === "all" || w.category === active);
  return (
    <>
      <div className="filter" role="group" aria-label="Filter the portfolio">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={active === f.id ? "filter__btn filter__btn--on" : "filter__btn"}
            aria-pressed={active === f.id}
            data-cta="portfolio_filter"
            data-filter={f.id}
            onClick={() => setActive(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="portfolio__grid portfolio__grid--page">
        {shown.map((w) => (
          <figure key={w.src} style={{ margin: 0 }}>
            <span className="portfolio__item">
              <Image src={w.src} alt={w.alt} width={900} height={1200} sizes="(max-width: 900px) 50vw, 25vw" loading="lazy" />
              <figcaption>{w.label}</figcaption>
            </span>
          </figure>
        ))}
      </div>
    </>
  );
}
