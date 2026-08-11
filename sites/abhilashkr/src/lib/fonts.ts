import localFont from "next/font/local";

export const instrumentSerif = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    {
      path: "../app/fonts/instrument-serif-regular-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/instrument-serif-italic-latin.woff2",
      weight: "400",
      style: "italic",
    },
  ],
});

export const instrumentSans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: "../app/fonts/instrument-sans-variable-latin.woff2",
  weight: "400 700",
  style: "normal",
});

export const ibmPlexMono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "../app/fonts/ibm-plex-mono-300-latin.woff2", weight: "300", style: "normal" },
    { path: "../app/fonts/ibm-plex-mono-400-latin.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/ibm-plex-mono-500-latin.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/ibm-plex-mono-600-latin.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/ibm-plex-mono-700-latin.woff2", weight: "700", style: "normal" },
  ],
});
