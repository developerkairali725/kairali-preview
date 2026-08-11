/// <reference path="./next-font-local.d.ts" />

import localFont from "next/font/local";

export const instrumentSerif = localFont({
  src: [
    {
      path: "../assets/instrument-serif-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/instrument-serif-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-display",
});

export const instrumentSans = localFont({
  src: "../assets/instrument-sans-variable.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-sans",
});

export const ibmPlexMono = localFont({
  src: [
    { path: "../assets/ibm-plex-mono-300.woff2", weight: "300", style: "normal" },
    { path: "../assets/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/ibm-plex-mono-600.woff2", weight: "600", style: "normal" },
    { path: "../assets/ibm-plex-mono-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-mono",
});
