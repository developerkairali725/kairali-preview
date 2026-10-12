import localFont from "next/font/local";

// Skin A's faces (kit/skins.ts: Marcellus display, Mulish body), self-hosted from the site's own files, so the
// build never fetches Google Fonts (the /lp-v2 kit Document uses next/font/google). One preload, as the kit
// decided (PERF.md): the hero heading face. The body face swaps in.
export const display = localFont({
  src: "../../public/landing/specialist/marcellus.woff2",
  weight: "400",
  display: "swap",
  variable: "--f-marcellus",
  adjustFontFallback: "Times New Roman",
});

// Variant B's display face (kit/skins.ts "instrument"), self-hosted from the site's own copy of packages/ui's OFL file.
// Not preloaded: only B routes use it, and it swaps in.
export const instrument = localFont({
  src: [
    { path: "../../public/landing/specialist/instrument-serif-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/landing/specialist/instrument-serif-400-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  variable: "--f-instrument",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

export const body = localFont({
  src: [
    { path: "../../public/landing/specialist/mulish-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/landing/specialist/mulish-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/landing/specialist/mulish-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--f-mulish",
  preload: false,
  adjustFontFallback: "Arial",
});
