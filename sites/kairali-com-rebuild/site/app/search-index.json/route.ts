import { pages, pageHeading, navGroupFor } from "@/lib/content";

export const dynamic = "force-static";

const KIND: Record<string, string> = {
  "Discover Ayurveda": "Ayurveda", "Experience Kairali": "Stays & centres", "Ayurvedic products": "Products", "Learn & train": "Training",
  "Our group": "Group & awards", "Stories & resources": "Stories & media", "Partner with us": "Contact & careers",
};

export function GET() {
  const docs = Object.values(pages())
    .filter((p) => p.route !== "/kairali-blog.aspx?page=1")
    .map((p) => {
      const g = navGroupFor(p.route)?.label || "";
      const heads = (p.sections.map((s) => s.html).join(" ").match(/<h[2-4]>(.*?)<\/h[2-4]>/g) || []).map((h) => h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&")).slice(0, 16);
      const kind = KIND[g] || (p.route.startsWith("/apply-now") || p.route.includes("career") || p.route.includes("opening") ? "Contact & careers" : "Stories & media");
      return { r: p.route, t: pageHeading(p), g: g || kind, h: heads, x: p.text.slice(0, 8000), k: kind };
    });
  return Response.json(docs, { headers: { "Cache-Control": "public, max-age=3600" } });
}
