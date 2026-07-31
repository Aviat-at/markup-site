import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";

export type MarkdownNode = {
  type: string;
  value?: string;
  depth?: number;
  ordered?: boolean;
  start?: number | null;
  url?: string;
  alt?: string;
  title?: string | null;
  lang?: string | null;
  id?: string;
  align?: Array<"left" | "right" | "center" | null>;
  children?: MarkdownNode[];
};

export type PostMeta = {
  title: string;
  date?: string;
  tags?: string[];
  category: string;
  slug: string;
  excerpt: string;
  readingTime: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function cleanMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[*_`>|~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function contentDetails(content: string, description?: string) {
  const plain = cleanMarkdown(content);
  return {
    excerpt:
      description?.trim() ||
      `${plain.slice(0, 155).trim()}${plain.length > 155 ? "…" : ""}`,
    readingTime: Math.max(1, Math.ceil(plain.split(/\s+/).length / 220)),
  };
}

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
      const { data, content } = matter(raw);
      const details = contentDetails(content, data.description as string | undefined);

      return {
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? "",
        tags: (data.tags as string[]) ?? [],
        category,
        slug,
        ...details,
      };
    })
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));
}

export function getAllPosts(): PostMeta[] {
  return getCategories()
    .flatMap((category) => getPostsByCategory(category))
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));
}

export async function getPost(category: string, slug: string) {
  const fullPath = path.join(CONTENT_DIR, category, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const processor = remark().use(remarkGfm);
  const contentTree = processor.parse(content) as MarkdownNode;
  const usedIds = new Map<string, number>();
  const headings: { id: string; text: string; level: number }[] = [];

  function nodeText(node: MarkdownNode): string {
    if (node.value) return node.value;
    return (node.children ?? []).map(nodeText).join("");
  }

  function addHeadingIds(node: MarkdownNode) {
    if (node.type === "heading" && node.depth && node.depth >= 2 && node.depth <= 3) {
      const text = nodeText(node);
      const base = text
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "section";
      const count = usedIds.get(base) ?? 0;
      usedIds.set(base, count + 1);
      const id = count ? `${base}-${count + 1}` : base;
      node.id = id;
      headings.push({ id, text, level: node.depth });
    }
    node.children?.forEach(addHeadingIds);
  }

  addHeadingIds(contentTree);
  const details = contentDetails(content, data.description as string | undefined);

  return {
    meta: {
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? "",
      tags: (data.tags as string[]) ?? [],
      category,
      slug,
      ...details,
    } as PostMeta,
    contentTree,
    headings,
  };
}
