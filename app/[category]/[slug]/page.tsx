import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { getCategories, getPostsByCategory, getPost } from "@/lib/content";
import { getCategoryMeta } from "@/lib/site";

export function generateStaticParams() {
  return getCategories().flatMap(category =>
    getPostsByCategory(category).map(post => ({ category, slug: post.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) return { title: "Article not found" };
  return { title: post.meta.title, description: post.meta.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const post = await getPost(category, slug);

  if (!post) {
    return <div className="shell not-found"><h1>That note could not be found.</h1><Link href="/">Return home</Link></div>;
  }

  const posts = getPostsByCategory(category);
  const index = posts.findIndex(item => item.slug === slug);
  const previous = posts[index + 1];
  const next = posts[index - 1];
  const categoryInfo = getCategoryMeta(category);

  return (
    <article className="article-page">
      <div className="shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href={`/${category}`}>{categoryInfo.label}</Link><span>/</span>
          <span>Article</span>
        </nav>

        <header className="article-header">
          <span className="article-label">{categoryInfo.label}</span>
          <h1>{post.meta.title}</h1>
          <p>{post.meta.excerpt}</p>
          <div className="article-byline">
            <span className="author-mark">AT</span>
            <span><strong>Akash Tharindu</strong><small>{post.meta.date ? `Published ${post.meta.date}` : "Field note"}</small></span>
            <span className="reading-time"><Clock3 size={14} /> {post.meta.readingTime} min read</span>
          </div>
        </header>

        <div className="article-layout">
          <aside className="article-aside">
            <span>On this page</span>
            <nav>
              {post.headings.slice(0, 8).map(heading => (
                <a href={`#${heading.id}`} className={heading.level === 3 ? "subheading" : ""} key={heading.id}>{heading.text}</a>
              ))}
            </nav>
          </aside>
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </div>

        <footer className="article-footer">
          <div className="tag-list">
            {post.meta.tags?.map(tag => <span key={tag}>{tag}</span>)}
          </div>
          <div className="article-nav">
            {previous ? (
              <Link href={`/${category}/${previous.slug}`}>
                <span><ArrowLeft size={14} /> Previous</span><strong>{previous.title}</strong>
              </Link>
            ) : <span />}
            {next && (
              <Link href={`/${category}/${next.slug}`} className="next">
                <span>Next <ArrowRight size={14} /></span><strong>{next.title}</strong>
              </Link>
            )}
          </div>
          <Link href={`/${category}`} className="back-link"><ArrowLeft size={15} /> Back to {categoryInfo.label}</Link>
        </footer>
      </div>
    </article>
  );
}
