import type { Metadata } from "next";
import type { LpContent } from "../components/lp/types";

// Head as on staging. robots noindex, nofollow comes from app/layout.tsx.
// og:image dimensions are omitted: staging declared 1200 × 630 for images
// that are neither that size nor published on the live domain (OPEN-ITEMS).
export function lpMetadata(c: LpContent): Metadata {
  const { title, description, keywords, canonical, ogImage, locale, siteName } = c.head;
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: ogImage ? [ogImage] : undefined },
  };
}
