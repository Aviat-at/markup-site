# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- `git` category with Conventional Commits article
- `About-me/about-this-site.md` — project architecture overview
- `SECURITY.md` — vulnerability reporting policy
- `CONTRIBUTING.md` — contribution guidelines
- `CODE_OF_CONDUCT.md` — community standards
- `LICENSE` — MIT licence
- `remark-gfm` — GFM table, strikethrough, and task list support

### Fixed
- Markdown tables not rendering — added `remark-gfm` to the remark processor chain

### Changed
- README rewritten to focus on project architecture and usage

---

## [1.0.0] — 2026-04-04

### Added
- Initial release
- Next.js App Router with filesystem-based routing
- Markdown content pipeline (`gray-matter` + `remark` + `remark-html`)
- Material UI dark theme
- Category-based article organisation
- Static generation via `generateStaticParams()`
- Vercel deployment with Cloudflare DNS
- `linux`, `Docker`, `Next.js`, `About-me` categories
- `robots.txt` and dynamic sitemap for SEO
