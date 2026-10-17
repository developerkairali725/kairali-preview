"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    key: "ahv-grounds-pond",
    alt: "Lawns and a lily pond at Kairali – The Ayurvedic Healing Village, Palakkad",
    label: "The Ayurvedic Healing Village · Palakkad",
    widths: [480, 640, 1024, 1600, 2200],
  },
  {
    key: "ahv-footbridge",
    alt: "A white footbridge through tropical gardens at Kairali – The Ayurvedic Healing Village",
    label: "A restorative setting shaped by nature",
    widths: [640, 1024, 1600, 2200],
  },
  {
    key: "raag-facade",
    alt: "Villa Raag's white facade and columned portico at twilight in Agonda, South Goa",
    label: "Villa Raag · Agonda, South Goa",
    widths: [640, 1024, 1600, 2200],
  },
] as const;

function sourceSet(slide: (typeof slides)[number]) {
  return slide.widths.map((width) => `/media/photo/${slide.key}-${width}.webp ${width}w`).join(", ");
}

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[active];

  useEffect(() => {
    const next = slides[(active + 1) % slides.length];
    const preload = new Image();
    preload.src = `/media/photo/${next.key}-1024.webp`;
  }, [active]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const show = (index: number) => setActive((index + slides.length) % slides.length);

  return (
    <div
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Kairali destinations"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <img
        key={slide.key}
        className="hero-carousel__image"
        src={`/media/photo/${slide.key}-1600.webp`}
        srcSet={sourceSet(slide)}
        sizes="100vw"
        width="2200"
        height="1467"
        alt={slide.alt}
        loading={active === 0 ? "eager" : "lazy"}
        decoding={active === 0 ? "auto" : "async"}
        fetchPriority={active === 0 ? "high" : "auto"}
      />
      <div className="hero-carousel__meta">
        <p>{slide.label}</p>
        <div className="hero-carousel__controls">
          <button type="button" onClick={() => show(active - 1)} aria-label="Show previous image">←</button>
          <span aria-hidden="true">{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => show(active + 1)} aria-label="Show next image">→</button>
        </div>
      </div>
    </div>
  );
}
