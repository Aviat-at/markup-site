import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type PostMeta = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  readingTime: string;
  author: string;
  featured: boolean;
  coverImage: string;
  subtitle: string;
};

export type Post = {
  meta: PostMeta;
  contentHtml: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

const fallbackCovers = [
  "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
  "linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)",
  "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
];

function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function deriveCoverFromSlug(slug: string): string {
  const code = slug
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackCovers[code % fallbackCovers.length];
}

function parsePostMeta(category: string, slug: string, raw: string, content: string): PostMeta {
  const { data } = matter(raw);

  return {
    title: (data.title as string) ?? slug,
    subtitle: (data.subtitle as string) ?? "",
    description: (data.description as string) ?? "",
    date: (data.date as string) ?? "",
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    category,
    slug,
    readingTime: estimateReadingTime(content),
    author: (data.author as string) ?? "Akash Tharindu",
    featured: Boolean(data.featured),
    coverImage: (data.coverImage as string) ?? deriveCoverFromSlug(slug),
  };
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
      const { content } = matter(raw);
      return parsePostMeta(category, slug, raw, content);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPosts(): PostMeta[] {
  return getCategories().flatMap((category) => getPostsByCategory(category));
}

export function getFeaturedPosts(limit = 3): PostMeta[] {
  const posts = getAllPosts();
  const explicitFeatured = posts.filter((post) => post.featured);
  if (explicitFeatured.length >= limit) {
    return explicitFeatured.slice(0, limit);
  }

  const additional = posts
    .filter((post) => !post.featured)
    .sort((a, b) => ((b.tags?.length ?? 0) - (a.tags?.length ?? 0)))
    .slice(0, limit - explicitFeatured.length);

  return [...explicitFeatured, ...additional];
}

export function getCategorySummaries() {
  return getCategories().map((category) => {
    const posts = getPostsByCategory(category);
    return {
      category,
      postCount: posts.length,
      latestPostDate: posts[0]?.date ?? "",
      featuredPost: posts[0],
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

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => (post.tags ?? []).includes(tag));
}

export function getRelatedPosts(post: PostMeta, limit = 3): PostMeta[] {
  return getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      const sameCategory = candidate.category === post.category ? 2 : 0;
      return { candidate, score: sharedTags + sameCategory };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.candidate)
    .slice(0, limit);
}

export async function getPost(category: string, slug: string): Promise<Post | null> {
  const fullPath = path.join(CONTENT_DIR, category, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(raw);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    meta: parsePostMeta(category, slug, raw, content),
    contentHtml,
  };
}
