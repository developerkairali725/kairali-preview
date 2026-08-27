import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { getAllEssays, getEssayBySlug } from "@/lib/mdx";
import { ZariRule, LedgerList, LedgerRow } from "@/components/ui/ledger";
import { ReadingProgressBar, CopyLinkButton } from "@/components/ui/primitives";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay || essay.draft) return {};

  const url = `${SITE_URL}/writing/${slug}`;
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(essay.title)}&subtitle=Editorial%20Essay&section=Essays%20%26%20Publications`;

  return {
    title: essay.title,
    description: essay.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: essay.title,
      description: essay.description,
      url,
      type: "article",
      publishedTime: essay.datePublished,
      modifiedTime: essay.dateModified || essay.datePublished,
      authors: ["Abhilash Kalathil Ramesh"],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: essay.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: essay.title,
      description: essay.description,
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  return getAllEssays().map((essay) => ({
    slug: essay.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EssayDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);

  if (!essay || essay.draft) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/writing/${essay.slug}#article`,
    "isPartOf": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/writing/${essay.slug}#webpage`
    },
    "headline": essay.title,
    "description": essay.description,
    "datePublished": essay.datePublished,
    "dateModified": essay.dateModified || essay.datePublished,
    "author": {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      "name": "Abhilash Kalathil Ramesh"
    },
    "publisher": {
      "@id": `${SITE_URL}/#person`
    }
  };

  return (
    <div className="w-full bg-background text-foreground min-h-screen py-12 md:py-20 relative">
      <JsonLd data={articleSchema} />
      <ReadingProgressBar />
      
      <div className="max-w-3xl mx-auto px-6">
        <Breadcrumbs
          locale="en"
          pageKey="writing"
          parentKey="writing"
          currentLabel={essay.title}
          currentPath={`/writing/${essay.slug}`}
          pageType="WebPage"
        />
        
        {/* Back navigation & Copy Utility */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/writing"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-ink-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={12} />
            <span>All Documents</span>
          </Link>
          <CopyLinkButton href={`/writing/${essay.slug}`} />
        </div>

        {/* Essay Title and Meta Info */}
        <header className="mb-10 flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase text-primary">
            {essay.tags.map((tag) => (
              <span key={tag} className="border border-primary/20 px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl italic text-ink leading-tight">
            {essay.title}
          </h1>
          
          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            {essay.description}
          </p>

          <div className="max-w-sm pt-4">
            <LedgerList>
              <LedgerRow label="Published" value={essay.datePublished} />
              <LedgerRow label="Modified" value={essay.dateModified} />
              <LedgerRow label="Reviewer" value={essay.reviewedBy || "Not listed"} />
              <LedgerRow label="Metrics" value={essay.readingTime} />
            </LedgerList>
          </div>
        </header>

        <ZariRule className="mb-10" />

        {/* Dynamic HTML Content compiled by marked */}
        <article 
          className="prose prose-invert max-w-none font-sans text-sm text-ink leading-relaxed space-y-6 
            prose-headings:font-display prose-headings:italic prose-headings:text-ink prose-headings:font-normal
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-a:text-primary prose-a:underline hover:prose-a:text-ink transition-colors
            prose-ul:list-disc prose-ul:pl-5 prose-li:my-1
            prose-strong:text-ink prose-strong:font-bold select-text"
          dangerouslySetInnerHTML={{ __html: essay.contentHtml }}
        />

        <ZariRule className="my-12" />

        {/* Colophon Note */}
        <div className="font-mono text-[9px] uppercase text-ink-muted text-center tracking-widest">
          end of transmission // publication record // {essay.reviewedBy ? `reviewed by ${essay.reviewedBy}` : "author publication"}
        </div>

      </div>
    </div>
  );
}
