import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/content";
import { getCategoryMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "All articles",
  description: "Technical field notes on software engineering, infrastructure, databases, and developer tooling.",
};

function formatDate(date?: string) {
  if (!date) return "Field note";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export default function ArticlesPage() {
  const posts = getAllPosts().filter(post => post.category !== "About-me");

  return (
    <div className="shell page-shell">
      <header className="library-hero">
        <span className="eyebrow plain">Technical library · {String(posts.length).padStart(2, "0")} articles</span>
        <h1>All field notes.</h1>
        <p>
          Practical guides, architecture explanations, and working notes gathered
          across software engineering, infrastructure, and operations.
        </p>
      </header>

      <div className="library-table">
        {posts.map((post, index) => (
          <Link
            href={`/${encodeURIComponent(post.category)}/${encodeURIComponent(post.slug)}`}
            className="library-row"
            key={`${post.category}-${post.slug}`}
          >
            <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <span className="article-meta">
                {getCategoryMeta(post.category).label} · {post.readingTime} min read
              </span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </div>
            <span className="row-date">{formatDate(post.date)}</span>
            <ArrowUpRight className="row-arrow" size={20} />
          </Link>
        ))}
      </div>
    </div>
  );
}
