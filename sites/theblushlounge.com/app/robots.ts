import type { MetadataRoute } from "next";
import siteConfig from "../site.config.json";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        // Search/index and user-retrieval agents remain explicitly welcome.
        // Google-Extended stays allowed because its single preference also
        // controls grounding in Gemini Apps; Googlebot is covered by "*".
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
        ],
        allow: "/",
      },
      {
        // These vendors provide separate controls for model-training crawls,
        // so training can be declined without reducing current search access.
        userAgent: ["GPTBot", "ClaudeBot"],
        disallow: "/",
      },
    ],
    sitemap: `https://${siteConfig.domain}/sitemap.xml`,
  };
}
