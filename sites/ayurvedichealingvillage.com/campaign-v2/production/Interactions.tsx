"use client";

import { useEffect } from "react";
import { interactionForLink } from "./interaction-map.ts";

/**
 * The live page's interaction diagnostics (production/interaction-map.ts interactionForLink), sent to the same
 * consented runtime as before: window.AHV_MEASUREMENT.recordInteraction, which itself limits these events to the
 * treatment-packages path and to accepted consent. The old exit-help dialog is not carried over: it belonged to
 * the old design.
 */
type Measurement = { recordInteraction?: (name: string, target: string) => boolean };

export default function Interactions() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const a = e.target instanceof Element ? e.target.closest("a") : null;
        if (!a) return;
        const hit = interactionForLink(a.getAttribute("href") || "", !!a.closest("#section-1,#section-6"));
        if (hit) (window as Window & { AHV_MEASUREMENT?: Measurement }).AHV_MEASUREMENT?.recordInteraction?.(hit[0], hit[1]);
      } catch { /* measurement never breaks a click */ }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
