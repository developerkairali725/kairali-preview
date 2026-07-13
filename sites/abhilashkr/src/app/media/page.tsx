import { ZariRule } from "@/components/ui/ledger";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Media Logs & Press | Abhilash K. Ramesh",
  description: "Verified register of press coverage, featured interviews, columns, and audio publications.",
  alternates: {
    canonical: `${SITE_URL}/media`,
  },
  openGraph: {
    title: "Media Logs & Press | Abhilash K. Ramesh",
    description: "Verified register of press coverage, featured interviews, columns, and audio publications.",
    url: `${SITE_URL}/media`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Media%20Logs%20%26%20Press&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Press%20%26%20Publications`,
        width: 1200,
        height: 630,
        alt: "Media Logs & Press — Abhilash Kalathil Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Logs & Press | Abhilash K. Ramesh",
    description: "Verified register of press coverage, featured interviews, columns, and audio publications.",
    images: [`${SITE_URL}/api/og?title=Media%20Logs%20%26%20Press&subtitle=Executive%20Director%2C%20Kairali%20Ayurvedic%20Group&section=Press%20%26%20Publications`],
  },
};

export default function MediaPage() {
  const mediaItems = [
    {
      title: "Outlook Traveller — Budget 2026: Key Takeaways for Travel, Tourism & Hospitality",
      date: "Feb 2026",
      type: "Opinion Column",
      url: "https://www.outlooktraveller.com/News/union-budget-2026-key-takeaways-for-tourism-and-hospitality",
      summary: "Analysing public funding metrics and standardisation policies to build international trust in natural formulations."
    },
    {
      title: "SV Business & Hospitality Magazine — Expanding Ayurveda Globally",
      date: "2026",
      type: "Feature Interview",
      url: "https://whyayurveda.org/abhilash-k-ramesh-expanding-ayurveda-globally/",
      summary: "Interview on expanding Ayurveda globally without diluting its clinical integrity."
    },
    {
      title: "DNA India — Is Ayurveda Relevant Today?",
      date: "Dec 2025",
      type: "Studio Interview",
      url: "https://whyayurveda.org/is-ayurveda-relevant-today-health-benefits-facts-myths-insights-from-kairali-ayurvedic-group/",
      summary: "Studio interview on health benefits, myths, and clinical insights from Kairali Ayurvedic Group."
    },
    {
      title: "Failing It Up Podcast — Family Business Scaling",
      date: "2019",
      type: "Audio Interview",
      url: "https://www.youtube.com/watch?v=8EkW71lDfoM",
      summary: "In-depth podcast interview on entrepreneurship, legacy systems, and scaling family businesses."
    },
    {
      title: "World Travel Awards Video Interview",
      date: "2015",
      type: "Video Interview",
      url: "https://www.worldtravelawards.com/video/1499",
      summary: "Video interview discussing global wellness hospitality standards and international travel metrics."
    }
  ];

  return (
    <div className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-primary">
            media & press
          </div>
          <h1 className="font-display text-4xl md:text-5xl italic text-ink">
            Media Logs & Publications
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl">
            A verified register of press coverage, opinion pieces, columns, and audio publications.
          </p>
        </div>

        <ZariRule className="mb-12" />

        {/* Media Grid */}
        <section className="flex flex-col space-y-6">
          {mediaItems.map((item, idx) => (
            <div 
              key={idx}
              className="border border-border p-6 bg-card flex flex-col justify-between hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-baseline font-mono text-[10px] text-primary uppercase mb-2">
                <span>{item.type}</span>
                <span className="text-ink-muted">{item.date}</span>
              </div>
              
              <h2 className="font-display text-2xl text-ink italic mb-2">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h2>
              
              <p className="font-sans text-xs text-ink-muted leading-relaxed mb-4">
                {item.summary}
              </p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
