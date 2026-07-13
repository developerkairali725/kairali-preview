import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export interface Essay {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  tags: string[];
  draft: boolean;
  reviewedBy?: string;
  readingTime: string;
  contentHtml: string;
  contentRaw: string;
}

let essaysDirectory = path.join(process.cwd(), "content/essays");
if (!fs.existsSync(essaysDirectory)) {
  essaysDirectory = path.join(process.cwd(), "src/content/essays");
}

export function getEssaySlugs(): string[] {
  if (!fs.existsSync(essaysDirectory)) {
    return [];
  }
  return fs.readdirSync(essaysDirectory).filter((file) => file.endsWith(".mdx"));
}


export function getEssayBySlug(slug: string): Essay | null {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(essaysDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Compute reading time (approx. 200 words per minute)
  const wordCount = content.trim().split(/\s+/).length;
  const readingTimeVal = Math.max(1, Math.ceil(wordCount / 200));
  const readingTime = `${readingTimeVal} min read`;

  // Parse markdown content to html
  const contentHtml = marked.parse(content) as string;

  return {
    slug: realSlug,
    title: data.title || "",
    description: data.description || "",
    datePublished: data.datePublished || "",
    dateModified: data.dateModified || "",
    tags: data.tags || [],
    draft: typeof data.draft === "boolean" ? data.draft : false,
    reviewedBy: data.reviewedBy || undefined,
    readingTime,
    contentHtml,
    contentRaw: content,
  };
}

export function getAllEssays(): Essay[] {
  const slugs = getEssaySlugs();
  const essays = slugs
    .map((slug) => getEssayBySlug(slug))
    .filter((essay): essay is Essay => essay !== null && !essay.draft)
    .sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
  
  return essays;
}
