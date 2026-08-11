/// <reference path="./next-font-local.d.ts" />

import localFont from "next/font/local";

export const fraunces = localFont({
  src: [
    {
      path: "../assets/fraunces-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../assets/fraunces-variable-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-fraunces",
});

export const montserrat = localFont({
  src: "../assets/montserrat-variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-montserrat",
});

export const allura = localFont({
  src: "../assets/allura-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-allura",
});
