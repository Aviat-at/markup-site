"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { getCategoryMeta } from "@/lib/site";

export default function NavbarClient({ categories }: { categories: string[] }) {
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const topicsRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      const target = event.target as Node;
      if (topicsRef.current && !topicsRef.current.contains(target)) setTopicsOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(target)) setMobileOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setTopicsOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="Akash Tharindu — home">
          <span className="brand-mark">A</span>
          <span className="brand-copy">
            <strong>Akash Tharindu</strong>
            <small>Engineer &amp; writer</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link href="/articles">Articles</Link>
          <div className="topics-menu" ref={topicsRef}>
            <button
              type="button"
              aria-expanded={topicsOpen}
              aria-haspopup="menu"
              onClick={() => setTopicsOpen(open => !open)}
            >
              Topics <ChevronDown size={13} className={topicsOpen ? "rotated" : ""} />
            </button>
            {topicsOpen && (
              <>
                <button
                  type="button"
                  className="topics-dismiss"
                  aria-label="Close topics menu"
                  onClick={() => setTopicsOpen(false)}
                />
                <div className="topics-popover" role="menu">
                {categories.map((category, index) => {
                    const meta = getCategoryMeta(category);
                    return (
                      <Link href={`/${encodeURIComponent(category)}`} key={index} role="menuitem" onClick={() => setTopicsOpen(false)}>
                        <meta.icon size={16} />
                        <span>
                          <strong>{meta.label}</strong>
                          <small>{meta.description}</small>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <Link href="/about">About</Link>
        </nav>

        <a className="header-cta" href="https://www.linkedin.com/in/akash-tharindu/" target="_blank" rel="noreferrer">
          Let&apos;s connect <ArrowUpRight size={15} />
        </a>

        <div className="mobile-menu" ref={mobileRef}>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(open => !open)}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          {mobileOpen && (
            <nav>
              <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/articles" onClick={() => setMobileOpen(false)}>All articles</Link>
              {categories.map((category, index) => (
                <Link href={`/${encodeURIComponent(category)}`} key={index} onClick={() => setMobileOpen(false)}>{getCategoryMeta(category).label}</Link>
              ))}
              <Link href="/about" onClick={() => setMobileOpen(false)}>About me</Link>
              <Link href="/about-this-site" onClick={() => setMobileOpen(false)}>About this site</Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
