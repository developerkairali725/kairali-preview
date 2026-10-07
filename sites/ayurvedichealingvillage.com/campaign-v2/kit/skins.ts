import { ahvCampaignV2Colors as colors } from "@kairali/ui/brand-colors";
import type { Variant } from "./types.ts";

export type VarName = "ground" | "surface" | "ink" | "muted" | "primary" | "onPrimary" | "accentText" | "accentLine" | "night" | "onNight" | "onNightAccent" | "wa" | "onWa" | "error";

export type Skin = {
  name: string;
  vars: Record<VarName, string>;
  fonts: { display: "marcellus" | "instrument" | "jakarta"; body: "mulish" | "jakarta" };
  radius: string;
  /**
   * The backing behind any text set over a photo (hero overlays, the Stillness band, film captions, photo chips):
   * `color` at `copy` % opacity where the copy sits, fading to transparent away from it. Sized so on-night text
   * (also at 72% alpha) and on-night-accent text pass 4.5:1 over a PURE WHITE photo (test/lp-v2-scrim.test.mjs),
   * so it holds for whatever photo the next campaign drops in. Never lowered per campaign.
   */
  scrim: { color: string; copy: number };
};

export const SHARED_PAIRS: [VarName, VarName][] = [
  ["ink", "ground"], ["ink", "surface"], ["muted", "ground"], ["muted", "surface"],
  ["accentText", "ground"], ["accentText", "surface"], ["primary", "ground"], ["primary", "surface"],
  ["error", "ground"], ["error", "surface"], ["onPrimary", "primary"], ["onWa", "wa"],
  ["onNight", "night"], ["onNightAccent", "night"]
];

export const SKINS: Record<Variant, Skin> = {
  A: { name: "Quiet Admission", radius: "2px", fonts: { display: "marcellus", body: "mulish" }, scrim: { color: colors.quietNight, copy: 80 },
    vars: { ground: colors.ivory, surface: colors.warmWhite, ink: colors.warmInk, muted: colors.warmMuted, primary: colors.quietNight, onPrimary: colors.ivory,
      accentText: colors.bronzeText, accentLine: colors.bronzeLine, night: colors.quietNight, onNight: colors.ivory, onNightAccent: colors.nightSand, wa: colors.contactGreen, onWa: colors.white, error: colors.error } },
  B: { name: "Garden Bento", radius: "14px", fonts: { display: "instrument", body: "jakarta" }, scrim: { color: colors.gardenInk, copy: 82 },
    vars: { ground: colors.gardenGround, surface: colors.white, ink: colors.gardenInk, muted: colors.gardenMuted, primary: colors.terracotta, onPrimary: colors.white,
      accentText: colors.gardenAccent, accentLine: colors.gardenAccentLine, night: colors.gardenInk, onNight: colors.gardenGround, onNightAccent: colors.gardenAccentLine, wa: colors.contactGreen, onWa: colors.white, error: colors.error } },
  C: { name: "Editorial", radius: "0px", fonts: { display: "marcellus", body: "mulish" }, scrim: { color: colors.quietNight, copy: 80 },
    vars: { ground: colors.editorialGround, surface: colors.white, ink: colors.warmInk, muted: colors.warmMuted, primary: colors.editorialWine, onPrimary: colors.white,
      accentText: colors.editorialWine, accentLine: colors.editorialWine, night: colors.quietNight, onNight: colors.white, onNightAccent: colors.nightSand, wa: colors.contactGreen, onWa: colors.white, error: colors.error } },
  D: { name: "Direct", radius: "12px", fonts: { display: "jakarta", body: "jakarta" }, scrim: { color: colors.directInk, copy: 80 },
    vars: { ground: colors.directGround, surface: colors.white, ink: colors.directInk, muted: colors.directMuted, primary: colors.directInk, onPrimary: colors.white,
      accentText: colors.contactGreen, accentLine: colors.directAccentLine, night: colors.directInk, onNight: colors.white, onNightAccent: colors.directNightAccent, wa: colors.contactGreen, onWa: colors.white, error: colors.error } },
};

export function skinCssVars(v: Variant): Record<string, string> {
  const s = SKINS[v];
  const out: Record<string, string> = { "--lp-radius": s.radius, "--lp-scrim": s.scrim.color, "--lp-scrim-copy": `${s.scrim.copy}%` };
  for (const [k, val] of Object.entries(s.vars)) out[`--lp-${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`] = val;
  return out;
}

/** `fg` at `alpha` over `bg`, as a hex color (used to test text over a translucent scrim). */
export function over(fg: string, alpha: number, bg: string): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [f, b] = [p(fg), p(bg)];
  return "#" + f.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, "0")).join("");
}

function lum(hex: string): number {
  if (!hex.match(/^#[0-9a-fA-F]{6}$/)) throw new Error(`Unsupported color: ${hex}`);
  const h = hex.slice(1);
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(fg: string, bg: string): number {
  const a = lum(fg), b = lum(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
