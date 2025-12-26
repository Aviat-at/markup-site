import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type PostMeta = {
  title: string;
  date?: string;
  tags?: string[];
  category: string;
  slug: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getCategories(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => !name.startsWith("."))
    .filter((name) => fs.statSync(path.join(CONTENT_DIR, name)).isDirectory());
}

export function getPostsByCategory(category: string): PostMeta[] {
  const categoryDir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(categoryDir)) return [];

  const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(categoryDir, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);

      return {
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? "",
        tags: (data.tags as string[]) ?? [],
        category,
        slug,
      };
    })
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));
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
      date: (data.date as string) ?? "",
      tags: (data.tags as string[]) ?? [],
      category,
      slug,
    } as PostMeta,
    contentHtml,
  };
}
