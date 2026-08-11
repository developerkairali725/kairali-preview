/// <reference path="./next-font-local.d.ts" />

import localFont from "next/font/local";

// Asap stays split into official Unicode subsets in kairali.css. Keeping it
// in CSS lets browsers fetch Latin Extended only on pages that actually use
// those glyphs, while preserving the next/font-style `.variable` interface.
export const asap = {
  variable: "kairali-asap-variable",
} as const;

export const kurale = localFont({
  src: "../assets/kurale-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-kurale",
});

export const lato = localFont({
  src: [
    { path: "../assets/lato-300.woff2", weight: "300", style: "normal" },
    { path: "../assets/lato-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/lato-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-lato",
});
