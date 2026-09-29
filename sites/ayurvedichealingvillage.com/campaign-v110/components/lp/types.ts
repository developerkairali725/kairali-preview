// Content model for the /lp/ pages. Each page's content.ts is generated from
// its saved staging file (verbatim copy), then corrected by hand; every
// correction is logged in docs/changes/<page>.md.

import type { StaticImageData } from "next/image";

export type Img = { src: StaticImageData; alt: string };

/** Inline text: plain strings, links, emphasis and line breaks, as on staging. */
export type Run =
  | string
  | { a: string; href: string }
  | { em: string }
  | { strong: string }
  | { br: true };

export type Block =
  | { type: "lead"; runs: Run[] }
  | { type: "para"; runs: Run[] }
  | { type: "steps"; cards: { k: string; title: string; text: string }[] }
  | { type: "photos"; images: Img[] }
  | { type: "proof"; items: { title: string; text: string }[] }
  | { type: "physician"; image: Img; name: string; role: string }
  | { type: "physicianNote"; text: string }
  | { type: "video"; youtubeId: string; title: string }
  | { type: "videoNote"; runs: Run[] }
  | { type: "faq"; items: { q: string; a: Run[][] }[] };

export type LpSectionContent = {
  id: string;
  variant?: "alt" | "proof";
  overline: string;
  title: string;
  blocks: Block[];
};

export type LpContent = {
  path: string;
  lang?: string;
  head: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    ogImage?: string;
    locale: string;
    siteName: string;
  };
  jsonLd?: object;
  hero: {
    overline: string;
    h1: Run[];
    sub: string;
    doctor?: { image: Img; name: string; role: string };
    creds: { label: string; nabh?: boolean; detail: string }[];
    photo: Img & { caption: string; detail: string };
  };
  sections: LpSectionContent[];
  enquiry: {
    overline: string;
    title: string;
    lead: Run[];
    form: { heading: string; intro: string };
    aside: { k: string; kLang?: string; paragraphs: Run[][]; paragraphLangs?: (string | undefined)[] };
  };
  /** Footer legal-link labels when the page is not in English (staging's own wording). */
  legalLabels?: { privacy: string; terms: string; cookies: string };
  /** Staging's WhatsApp pre-fill, verbatim. */
  whatsappText: string;
};
