import downloads from "@/content/downloads.json";

const HUB = "https://kairali-documents.vercel.app/";
const TARGETS: Record<string, { property: string; collection: string }> = {
  "/download/Profile-of-Kairali-Ayurvedic-Healing-Village-Palakkad.pdf": { property: "ahv", collection: "healing-secrets" },
  "/download/Villa-Raag-Brochure.pdf": { property: "villa-raag", collection: "programme-rates" },
  "/download/ayurveda-corporate-brochure.pdf": { property: "ahv", collection: "healing-secrets" },
  "/download/kairali-products-full-list.pdf": { property: "kappl", collection: "kappl-retail" },
};

export function documentHubLink(href: string): string {
  if (!href.startsWith("/download/")) return href;
  const known = Object.entries(TARGETS).find(([path]) => path.toLowerCase() === href.toLowerCase())?.[1];
  if (known) return `${HUB}?property=${known.property}#${known.collection}`;
  const old = downloads.earlier.find((c) => c.editions.some((e) => e.url.toLowerCase() === href.toLowerCase()));
  const property = old?.property;
  const view = ["ahv", "villa-raag", "kappl"].includes(property || "") ? property : "all";
  return `${HUB}?property=${view}#library`;
}

export function documentLinkHtml(html: string): string {
  return html.replace(/href="(\/download\/[^" ]+)"/g, (_match, href: string) => `href="${documentHubLink(href).replace(/&/g, "&amp;")}"`);
}
