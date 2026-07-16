// Press page — only coverage that actually exists, each item linked to its
// source. Publisher promotion is labelled as such (honest-steward register).
import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../site.config.json";

export const metadata: Metadata = buildMetadata(siteConfig, {
  title: "Press — the books of Gita Ramesh",
  description:
    "Press coverage of Gita Ramesh's books: The Hindu on the Gourmand World Cookbook Award 2023 win, reviews, and publisher features.",
  path: "/press",
  siteName: "Healing Recipes",
}) as Metadata;

const ITEMS = [
  {
    source: "The Hindu · July 2023",
    label:
      "An Ayurvedic cookbook wins the Gourmand World Cookbook Award 2023 — on The Ayurvedic Wellness Cookbook taking the world title at the Umeå Food Symposium, Sweden",
    url: "https://www.thehindu.com/life-and-style/food/an-ayurvedic-cookbook-wins-the-gourmand-world-cookbook-award-2023/article67093497.ece",
  },
  {
    source: "Travel Potpourri · December 2024",
    label:
      "Review: The Ayurvedic Wellness Cookbook — recipes for regaining your inner balance",
    url: "https://travelpotpourri.net/2024/12/16/the-ayurvedic-wellness-cookbook-recipes-for-regaining-your-inner-balance",
  },
  {
    source: "Ayurveda Journals",
    label: "In conversation with Gita Ramesh, Kairali (interview)",
    url: "https://www.beta.ayurvedajournals.com/article/talk-kairali-gita-ramesh-01",
  },
  {
    source: "Roli Books (publisher) · 2026",
    label:
      "Harmony: Essential Ayurveda for All — publisher feature and promotion for the new book",
    url: "https://rolibooks.com/product/harmony-essential-ayurveda-for-all",
  },
];

export default function PressPage() {
  return (
    <main className="prose-page">
      <div className="container">
        <p className="overline">Press</p>
        <h1>In print and online</h1>
        <div className="prose">
          <ul className="press-list">
            {ITEMS.map((it) => (
              <li key={it.url}>
                <span className="biblio-line">{it.source}</span>
                <a href={it.url} rel="noopener">
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
          <p>
            For press enquiries and review copies, write to{" "}
            <a href="mailto:info@kairali.com" data-cta="email_click">
              info@kairali.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
