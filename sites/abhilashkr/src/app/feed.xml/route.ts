import { getAllEssays } from "@/lib/mdx";
import { SITE_URL } from "@/lib/config";

export async function GET() {
  const baseUrl = SITE_URL;
  const essays = getAllEssays();

  const items = essays
    .map(
      (essay) => `    <item>
      <title>${escapeXml(essay.title)}</title>
      <link>${baseUrl}/writing/${essay.slug}</link>
      <guid isPermaLink="true">${baseUrl}/writing/${essay.slug}</guid>
      <description>${escapeXml(essay.description)}</description>
      <pubDate>${new Date(essay.datePublished).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Abhilash Kalathil Ramesh — Essays</title>
    <link>${baseUrl}/writing</link>
    <description>Essays on Ayurveda, wellness tourism, AYUSH policy, and enterprise leadership.</description>
    <language>en</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
