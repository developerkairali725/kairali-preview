import type { Channel } from "./types.ts";

const WA = "919289838797";
const IG = "kairaliayurvedichealingvillage";
const FB = "KairaliTheAyurvedicHealingVillage";

/** Short, stable, non-personal code derived from the submission UUID. */
export function refCode(token: string): string {
  let h = 2166136261;
  for (const ch of token) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return "KT-" + h.toString(36).toUpperCase().padStart(6, "0").slice(-6);
}

export function channelLink(ch: Channel, ref: string): string | null {
  switch (ch) {
    case "whatsapp": return `https://wa.me/${WA}?text=${encodeURIComponent(`Hello, my enquiry reference is ${ref}`)}`;
    case "instagram": return `https://ig.me/m/${IG}?ref=${encodeURIComponent(ref)}`;
    case "messenger": return `https://m.me/${FB}?ref=${encodeURIComponent(ref)}`;
    case "call": return "tel:+919555156156";
    case "chat": return "#chat";
    case "email": return null;
  }
}
