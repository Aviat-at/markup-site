import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCategories, getPostsByCategory } from "@/lib/content";
import { getCategoryMeta } from "@/lib/site";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  return { title: meta.label, description: meta.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const meta = getCategoryMeta(category);
  const Icon = meta.icon;

  return (
    <div className="shell page-shell">
      <Link href="/" className="back-link"><ArrowLeft size={15} /> All topics</Link>
      <header className="category-hero">
        <div className="category-icon" style={{ color: meta.accent }}><Icon size={30} strokeWidth={1.4} /></div>
        <div>
          <span className="eyebrow plain">Knowledge library · {String(posts.length).padStart(2, "0")} articles</span>
          <h1>{meta.label}</h1>
          <p>{meta.description}</p>
        </div>
      </header>

      <div className="category-list">
        {posts.map((post, index) => (
          <Link href={`/${post.category}/${post.slug}`} className="category-article" key={post.slug}>
            <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="category-article-copy">
              <span className="article-meta">{post.date || "Field note"} · {post.readingTime} min read</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="tag-list">{post.tags?.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
            </div>
            <ArrowUpRight className="category-arrow" size={22} />
          </Link>
        ))}
        {posts.length === 0 && <div className="empty-state">The first note in this collection is still being written.</div>}
      </div>
    </div>
  );
}
