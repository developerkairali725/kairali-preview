"use client";

// Client boundary is required only to reveal the sticky CTA after the existing
// in-page WhatsApp controls leave the viewport.
import { useEffect, useState } from "react";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "./chrome";

const INLINE_WHATSAPP_SELECTOR = '[data-cta="whatsapp_click"]:not(.floating-whatsapp)';

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const inlineControls = Array.from(document.querySelectorAll<HTMLElement>(INLINE_WHATSAPP_SELECTOR));
    const intersecting = new Set<Element>();

    const updateVisibility = () => {
      setVisible(window.scrollY > 120 && intersecting.size === 0);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }
        updateVisibility();
      },
      { threshold: [0, 0.15] },
    );

    for (const control of inlineControls) observer.observe(control);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  return (
    <a
      className="floating-whatsapp"
      data-visible={visible ? "true" : "false"}
      href={WHATSAPP_URL}
      data-cta="whatsapp_click"
      rel="noopener"
      aria-label={`WhatsApp Sneha on ${WHATSAPP_DISPLAY}`}
    >
      WhatsApp Sneha
    </a>
  );
}
