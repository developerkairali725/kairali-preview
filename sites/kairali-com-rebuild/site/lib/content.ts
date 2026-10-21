import fs from "node:fs";
import path from "node:path";
import { NAV, SITE_URL } from "./site";
import { cleanRoute } from "./routes";

export type Img = { src: string; w: number; h: number; alt?: string; source?: string; sha256?: string };
export type Section = { cls: string; id: string; html: string; hidden: boolean; form?: boolean };
export type Banner = { tagline: string; h1: string; subtitle: string[]; sublinks: { label: string; href: string | null; current: boolean }[]; rest: string; actions?: { label: string; href: string }[] };
export type Page = {
  route: string; origin: string; sourceUrl: string; sourceSha256: string; family: string | null; template: string | null;
  mapTitle: string | null; group: string | null; ownerFact: string; title: string; description: string; keywords: string;
  sourceH1: string; banner: Banner | null; hero: Img | null; sections: Section[]; images: Img[]; videos: string[]; docs: string[];
  links: string[]; videoItems?: { id: string; title: string; caption: string }[]; text: string; words: number;
};
export type Photo = { alt: string; credit: string; w: number; h: number; ratio: number; sizes: number[]; og: string };
export type AwardTeaser = { href: string; rawHref: string; title: string; teaser: string; image: Img | null };

const CONTENT = path.join(process.cwd(), "content");
const read = <T,>(f: string): T => JSON.parse(fs.readFileSync(path.join(CONTENT, f), "utf8"));

let _pages: Record<string, Page> | null = null;
export function pages(): Record<string, Page> {
  if (!_pages) _pages = read<Record<string, Page>>("pages.json");
  return _pages;
}
export const photos = (): Record<string, Photo> => read("photos.json");
export const awardsIndex = (): AwardTeaser[] => read("awards-index.json");
export const legacyDocs = (): { path: string; bytes: number; sha256: string; linkedFrom: string[]; reviewFlag: string; status: string }[] => read("legacy-docs.json");
export const extra = <T,>(f: string): T => read<T>(f);

export function getPage(route: string): Page | undefined {
  return pages()[route];
}

/** Plain (non-query) legacy routes served by app/[slug]. */
export function plainSlugs(): string[] {
  return Object.keys(pages()).filter((r) => r !== "/" && !r.includes("?")).map((r) => r.slice(1));
}

// Award detail keys: base64url of the exact legacy `page` value (byte-exact, incl. trailing dot).
export const awardKey = (pageValue: string) => Buffer.from(pageValue, "utf8").toString("base64url");
export function awardRoutes(): { key: string; value: string; route: string }[] {
  return Object.keys(pages()).filter((r) => r.startsWith("/detail.aspx?page=")).map((r) => {
    const value = decodeURIComponent(r.slice("/detail.aspx?page=".length));
    return { key: awardKey(value), value, route: r };
  });
}
export function applyIds(): string[] {
  return Object.keys(pages()).filter((r) => r.startsWith("/apply-now.aspx?id=")).map((r) => r.split("=")[1]);
}

export function absolute(route: string): string {
  return SITE_URL + (route === "/" ? "/" : route);
}

/** Visible title for a page: source banner H1, else captured H1, else mapping title. */
export function pageHeading(p: Page): string {
  return p.banner?.h1 || p.sourceH1 || p.mapTitle || p.title;
}

export function navGroupFor(route: string) {
  const base = route.split("?")[0];
  const publicBase = cleanRoute(base);
  for (const g of NAV) if (g.links.some((l) => l.href === publicBase) || g.href === publicBase) return g;
  if (base.startsWith("/detail.aspx")) return NAV.find((g) => g.label === "Our group");
  if (base.startsWith("/apply-now.aspx") || base === "/current-openings.aspx") return NAV.find((g) => g.label === "Our group");
  if (base.includes("library") || base === "/photo-library.aspx" || base === "/virtual-tour.aspx") return NAV.find((g) => g.label === "Stories & resources");
  if (base.includes("policy") || base.includes("terms") || base === "/sitemap.aspx" || base === "/useful-links.aspx" || base === "/ayurveda-newsletter.aspx") return undefined;
  if (base === "/svata-katerina-prague-czech-republic.aspx") return NAV.find((g) => g.label === "Experience Kairali");
  if (base === "/kairali-ayurveda-brands.aspx") return NAV.find((g) => g.label === "Our group");
  return undefined;
}

export type Crumb = { name: string; href: string };
export function breadcrumbs(route: string, current: string): Crumb[] {
  const out: Crumb[] = [{ name: "Home", href: "/" }];
  if (route === "/") return out;
  const g = navGroupFor(route);
  const base = route.split("?")[0];
  if (g && g.href !== cleanRoute(base)) out.push({ name: g.label, href: g.href });
  if (base.startsWith("/detail.aspx")) out.push({ name: "Awards & Accreditations", href: "/kairali-group-awards" });
  if (base.startsWith("/apply-now.aspx") && route !== "/apply-now.aspx") out.push({ name: "Careers", href: "/careers" });
  if (base.includes("-library.aspx") && !["/photo-library.aspx", "/video-library.aspx"].includes(base))
    out.push({ name: base.includes("photo") ? "Photo Library" : "Video Library", href: base.includes("photo") ? "/photo-library" : "/video-library" });
  if (route.startsWith("/kairali-blog.aspx?page=")) out.push({ name: "Kairali Blog", href: "/kairali-blog" });
  out.push({ name: current, href: cleanRoute(route) });
  return out;
}

/** Family opener photograph (selected company photography) keyed by route/family. */
export function familyPhotoKey(p: Page): string {
  const r = p.route.split("?")[0];
  const f = p.family;
  if (r === "/villa-raag.aspx") return "raag-facade";
  if (r === "/ayurvedic-healing-village.aspx" || r === "/hospitality.aspx") return "ahv-footbridge";
  if (r.includes("treatment-centre") || r === "/locations.aspx" || r === "/treatment-centres.aspx") return "centre-emblem";
  if (r === "/onlineconsultation.aspx") return "ahv-consultation";
  if (r === "/ayurveda-treatments.aspx" || r === "/why-ayurveda.aspx") return "ahv-kati-vasti";
  if (f === "E" || r === "/ayurvedic-products.aspx") return "products-still";
  if (f === "F" || r === "/training.aspx") return "ahv-treatment-room";
  if (f === "K") return "ahv-colonnade";
  if (f === "L") return "ahv-cottages";
  if (f === "G" || r === "/about-us.aspx") return "ahv-founders-wall";
  if (f === "C" || f === "B") return "ahv-veranda";
  if (f === "H" || f === "I") return "ahv-reception";
  return "ahv-grounds-pond";
}

export function excerpt(text: string, n = 180): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

/** Headings (h2/h3) for an "On this page" rail, with stable ids injected into section HTML. */
export function withAnchors(html: string, used: Set<string>): { html: string; heads: { id: string; text: string; level: number }[] } {
  const heads: { id: string; text: string; level: number }[] = [];
  const out = html.replace(/<h([23])>(.*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
    if (!text) return "";
    let id = text.toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "section";
    while (used.has(id)) id += "-x";
    used.add(id);
    heads.push({ id, text, level: Number(lvl) });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, heads };
}
