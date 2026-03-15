import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type PostMeta = {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  category: string;
  slug: string;
  readingTime: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function getCategories(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => !name.startsWith("."))
    .filter((name) => fs.statSync(path.join(CONTENT_DIR, name)).isDirectory())
    .sort((a, b) => a.localeCompare(b));
}

export function getPostsByCategory(category: string): PostMeta[] {
  const categoryDir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(categoryDir)) return [];

  const files = fs.readdirSync(categoryDir).filter((file) => file.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(categoryDir, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(raw);

      return {
        title: (data.title as string) ?? slug,
        description: (data.description as string) ?? "",
        date: (data.date as string) ?? "",
        tags: (data.tags as string[]) ?? [],
        category,
        slug,
        readingTime: estimateReadingTime(content),
      };
    })
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));
}

export function getAllPosts(): PostMeta[] {
  return getCategories().flatMap((category) => getPostsByCategory(category));
}

export function getCategorySummaries() {
  return getCategories().map((category) => {
    const posts = getPostsByCategory(category);

    return {
      category,
      postCount: posts.length,
      latestPostDate: posts[0]?.date ?? "",
    };
  });
}

export function getTags(): string[] {
  const tags = new Set<string>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags ?? []) {
      tags.add(tag);
    }
  }

  return [...tags].sort((a, b) => a.localeCompare(b));
}

export async function getPost(category: string, slug: string) {
  const fullPath = path.join(CONTENT_DIR, category, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    meta: {
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "",
      date: (data.date as string) ?? "",
      tags: (data.tags as string[]) ?? [],
      category,
      slug,
      readingTime: estimateReadingTime(content),
    } as PostMeta,
    contentHtml,
  };
}
