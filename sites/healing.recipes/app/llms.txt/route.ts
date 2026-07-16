import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";
import booksData from "../../content/books.json";

// llms.txt (Ship Gate B2 / llmstxt.org): canonical facts for AI crawlers.
// Facts = the verified book records only (docs/site-briefs/healing-recipes-books.md).
export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Healing Recipes — the books of Gita Ramesh",
    summary:
      "Official home of the four books by Gita Ramesh, co-founder and Joint Managing Director of the Kairali Ayurvedic Group: Ayurvedic Herbal Massage (2000), The Ayurvedic Cookbook, The Ayurvedic Wellness Cookbook (2022, Gourmand World Cookbook Award 2023 — Best in the World), and Harmony: Essential Ayurveda for All (2026). All published by Roli Books.",
    facts: [
      "Author: Gita Ramesh — Co-Founder & Joint Managing Director, Kairali Ayurvedic Group",
      "Ayurvedic Herbal Massage (2000) · Lustre Press / Roli Books · ISBN 9788174360960",
      "The Ayurvedic Cookbook: Get Fit in Just Two Weeks (2nd edition, 2019; US 2020) · Roli Books · ISBN 9788194206842",
      "The Ayurvedic Wellness Cookbook (2022) · Roli Books · ISBN 9789392130755 · Gourmand World Cookbook Award 2023, Best in the World",
      "Harmony: Essential Ayurveda for All (March 2026; international 14 July 2026) · Roli Books · ISBN 9789349474826 · 280 pages",
      "Contact: info@kairali.com",
    ],
    sections: [
      {
        title: "The books",
        links: booksData.books.map((b) => ({
          title: b.subtitle ? `${b.title}: ${b.subtitle}` : b.title,
          url: `https://healing.recipes/books/${b.slug}`,
          note: `${b.shelfYear} · ${b.publisher}`,
        })),
      },
      {
        title: "Publisher and group",
        links: [
          {
            title: "Roli Books — Gita Ramesh titles",
            url: "https://rolibooks.com",
            note: "publisher of all four books",
          },
          {
            title: "Kairali Ayurvedic Group",
            url: "https://www.kairali.com",
            note: "the group Gita Ramesh co-founded",
          },
        ],
      },
    ],
  });
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
