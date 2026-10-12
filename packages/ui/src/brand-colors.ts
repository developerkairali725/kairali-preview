/* Serialized HTML/email colours from brand-tokens.css; email clients cannot consume CSS variables. */
export const brandColors = { ink: "#1C1B19", ivory: "#F7F4EA", forest500: "#006038", forest700: "#004226", white: "#fff", emailMuted: "#666" } as const;

/* AHV campaign-v2 kit palette from PR355, preserved exactly for the owner-requested
 * template rollout. Central serialized tokens keep skin contrast/scrim calculations
 * and rendered CSS on the same values; these are not changes to the base brand ramp. */
export const ahvCampaignV2Colors = {
  quietNight: "#121A15",
  ivory: brandColors.ivory,
  warmWhite: "#FFFDF7",
  warmInk: "#2A2118",
  warmMuted: "#5C5448",
  bronzeText: "#7A5A22",
  bronzeLine: "#B8955A",
  nightSand: "#D8C3A0",
  contactGreen: "#1F5E43",
  white: "#FFFFFF",
  error: "#A3212C",
  gardenInk: "#26201B",
  gardenGround: "#F3EFE6",
  gardenMuted: "#6A6058",
  terracotta: "#9A4A2A",
  gardenAccent: "#3F5A45",
  gardenAccentLine: "#E3E7DA",
  editorialGround: "#F4EEE4",
  editorialWine: "#5E2230",
  directInk: "#111311",
  directGround: "#EFEFEC",
  directMuted: "#5D615C",
  directAccentLine: "#E6F0EA",
  directNightAccent: "#A9D3BA",
} as const;
