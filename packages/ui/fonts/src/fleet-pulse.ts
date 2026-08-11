/// <reference path="./next-font-local.d.ts" />

import localFont from "next/font/local";

export const grotesk = localFont({
  src: "../assets/space-grotesk-variable.woff2",
  weight: "300 700",
  style: "normal",
  display: "swap",
});

export const mono = localFont({
  src: "../assets/jetbrains-mono-variable.woff2",
  weight: "100 800",
  style: "normal",
  display: "swap",
});
