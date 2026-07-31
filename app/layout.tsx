import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ThemeRegistry from "./theme-registry";
import Navbar from "./components/Navbar";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Akash Tharindu — Software Engineer & Technical Writer", template: "%s — Akash Tharindu" },
  description: "Field notes on software engineering, Linux, cloud infrastructure, databases, and building dependable systems.",
  openGraph: { type: "website", title: "Akash Tharindu", description: "Software engineering field notes and practical technical guides.", url: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Navbar />
          <main>{children}</main>
          <footer className="site-footer">
            <div className="shell footer-grid">
              <div>
                <span className="brand-mark footer-mark">A</span>
                <p className="footer-statement">
                  Building dependable software,<br />and documenting what I learn.
                </p>
              </div>
              <div className="footer-links">
                <span>Explore</span>
                <Link href="/articles">All articles</Link>
                <Link href="/about">About me</Link>
                <Link href="/about-this-site">About this site</Link>
                <a href="https://github.com/Aviat-at" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
                <a href="https://www.linkedin.com/in/akash-tharindu/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a>
              </div>
              <div className="footer-meta">
                <p>Made with Next.js and Markdown.</p>
                <p>© {new Date().getFullYear()} Akash Tharindu</p>
              </div>
            </div>
          </footer>
        </ThemeRegistry>
      </body>
    </html>
  );
}
