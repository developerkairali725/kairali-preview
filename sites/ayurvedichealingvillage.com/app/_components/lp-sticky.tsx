"use client";
// Sticky mobile CTA — ONE marigold object per viewport state (Gate-1 law).
// Hidden until the hero CTA (#lp-hero-cta) has left the viewport by >=24px;
// hides again when it returns. Same single conversion action, same data-cta.
import { useEffect, useState } from "react";

export function LpSticky({ label = "Speak to Priya on WhatsApp" }: { label?: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById("lp-hero-cta");
    if (!heroCta) return;
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), {
      rootMargin: "-24px 0px 0px 0px",
    });
    io.observe(heroCta);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`lp-sticky${shown ? " shown" : ""}`} aria-hidden={!shown}>
      <a
        className="btn-wa"
        href="https://wa.me/919289838797"
        data-cta="whatsapp_click"
        tabIndex={shown ? 0 : -1}
      >
        {label}
      </a>
    </div>
  );
}
