import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { getAllPosts, getCategories } from "@/lib/content";
import { articleHref, getCategoryMeta } from "@/lib/site";
import { Reveal } from "./components/AnimatedComponents";

function formatDate(date?: string) {
  if (!date) return "Field note";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}

export default function HomePage() {
  const categories = getCategories();
  const articleCategories = categories.filter(category => category !== "About-me");
  const posts = getAllPosts().filter(post => post.category !== "About-me");
  const featured = posts[0];

  return (
    <>
      <section className="hero shell">
        <Reveal>
          <div className="eyebrow"><span /> Software engineer · Toronto, Canada</div>
          <h1>I build systems that stay <em>useful.</em></h1>
          <div className="hero-bottom">
            <p>
              I&apos;m Akash, a software engineer working across product engineering,
              cloud infrastructure, DevOps, and AI systems. This is where I document
              the details worth remembering.
            </p>
            <div className="hero-actions">
              <a href="#writing" className="button button-primary">Read the field notes <ArrowDownRight size={17} /></a>
              <Link href="/about" className="text-link">More about me <ArrowRight size={16} /></Link>
            </div>
          </div>
        </Reveal>
        <div className="hero-index">01 / FIELD NOTES</div>
      </section>

      <section className="marquee-band" aria-label="Areas of expertise">
        <div className="shell expertise-list">
          <span>Product Engineering</span><i />
          <span>Cloud &amp; DevOps</span><i />
          <span>Distributed Systems</span><i />
          <span>AI Applications</span>
        </div>
      </section>

      <section className="section shell" id="writing">
        <div className="section-heading">
          <div>
            <span className="section-number">01</span>
            <p className="kicker">Latest writing</p>
            <h2>Notes from the workbench.</h2>
          </div>
          <p>Practical explanations, architecture notes, and lessons earned while building real systems.</p>
        </div>

        {featured && (
          <Link href={articleHref(featured.category, featured.slug)} className="featured-article">
            <div className="feature-visual">
              <span className="feature-category">{getCategoryMeta(featured.category).label}</span>
              <div className="diagram-orbit orbit-one" />
              <div className="diagram-orbit orbit-two" />
              <div className="diagram-core">{getCategoryMeta(featured.category).label.slice(0, 2).toUpperCase()}</div>
            </div>
            <div className="feature-copy">
              <span className="article-meta">{formatDate(featured.date)} · {featured.readingTime} min read</span>
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <span className="read-link">Read article <ArrowUpRight size={17} /></span>
            </div>
          </Link>
        )}

        <div className="article-list">
          {posts.slice(1, 5).map((post, index) => (
            <Link
              href={`/${encodeURIComponent(post.category)}/${encodeURIComponent(post.slug)}`}
              className="article-row"
              key={index}
            >
              <span className="row-index">{String(index + 2).padStart(2, "0")}</span>
              <div>
                <span className="article-meta">{getCategoryMeta(post.category).label} · {post.readingTime} min read</span>
                <h3>{post.title}</h3>
              </div>
              <span className="row-date">{formatDate(post.date)}</span>
              <ArrowUpRight className="row-arrow" size={20} />
            </Link>
          ))}
        </div>
        <div className="section-action">
          <Link href="/articles" className="button button-primary">Browse all articles <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="section topics-section">
        <div className="shell">
          <div className="section-heading compact">
            <div>
              <span className="section-number">02</span>
              <p className="kicker">Browse the library</p>
              <h2>Explore by discipline.</h2>
            </div>
          </div>
          <div className="topic-grid">
            {articleCategories.map((category, index) => {
              const meta = getCategoryMeta(category);
              const count = posts.filter((post) => post.category === category).length;
              return (
                <Link
                  href={`/${encodeURIComponent(category)}`}
                  className="topic-card"
                  key={index}
                  style={{ "--topic-accent": meta.accent } as React.CSSProperties}
                >
                  <span className="topic-number">{String(index + 1).padStart(2, "0")}</span>
                  <meta.icon size={25} strokeWidth={1.5} />
                  <h3>{meta.label}</h3>
                  <p>{meta.description}</p>
                  <span className="topic-count">{count} {count === 1 ? "article" : "articles"} <ArrowRight size={15} /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-strip shell">
        <div className="portrait-monogram">AT</div>
        <div className="about-copy">
          <span className="section-number">03</span>
          <p className="kicker">Behind the notes</p>
          <h2>Engineering with curiosity<br />and a bias for clarity.</h2>
          <p>I care about the seam between software design and operations—the place where good ideas have to survive contact with production.</p>
          <Link href="/about" className="text-link">My background and work <ArrowRight size={16} /></Link>
        </div>
        <div className="availability">
          <span><i /> Open to thoughtful conversations</span>
          <p><MapPin size={14} /> Toronto, Ontario</p>
        </div>
      </section>
    </>
  );
}
