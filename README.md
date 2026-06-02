# markup-site

A fast, file-system-driven technical blog built with **Next.js App Router**, **Material UI**, and plain **Markdown**. No database, no CMS — content lives as `.md` files in the repository.

**Live:** [blog.akashtharindu.com](https://blog.akashtharindu.com)

---

## Features

- Markdown-based content — no database required
- Category-based article organisation, auto-discovered from the filesystem
- GFM support — tables, strikethrough, task lists (via `remark-gfm`)
- Static generation — every page pre-built at deploy time via `generateStaticParams()`
- Dark theme with Material UI
- Automatic deployments from GitHub via Vercel
- Global CDN + DNS managed through Cloudflare

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Material UI (MUI v6) |
| Markdown | `gray-matter` + `remark` + `remark-gfm` + `remark-html` |
| Hosting | Vercel |
| DNS / CDN | Cloudflare |

---

## Project Structure

```
markup-site/
├── app/
│   ├── layout.tsx              # Root layout — theme provider, Navbar
│   ├── page.tsx                # Homepage — category card grid
│   ├── [category]/
│   │   ├── page.tsx            # Category listing page
│   │   └── [slug]/
│   │       └── page.tsx        # Individual article page
│   └── components/             # Shared UI components
│
├── content/                    # All Markdown articles
│   ├── About-me/
│   ├── git/
│   ├── linux/
│   ├── Next.js/
│   └── Docker/
│
├── lib/
│   └── content.ts              # Filesystem reader + Markdown parser
│
├── theme/
│   └── theme.ts                # MUI dark theme config
│
└── public/                     # Static assets
```

---

## Writing Articles

### 1. Create a Markdown file under the right category

```
content/<category>/<slug>.md
```

### 2. Add frontmatter

```markdown
---
title: "Your Article Title"
date: "2026-06-02"
tags: ["tag-one", "tag-two"]
---

Article content starts here...
```

### 3. Adding a new category

Create a new folder under `content/`. The site discovers it automatically via `getCategories()` in `lib/content.ts`.

To give the category a custom icon, colour, and description on the homepage, add an entry to `CATEGORY_META` in `app/page.tsx`.

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

Push to `main` — Vercel detects the push, runs `next build`, and deploys automatically. The full cycle from commit to live is under a minute.

```
git push → Vercel build → CDN deploy → live
```

---

## URL Structure

| URL | Source |
|-----|--------|
| `/` | Homepage — category grid |
| `/<category>` | Lists all posts in `content/<category>/` |
| `/<category>/<slug>` | Renders `content/<category>/<slug>.md` |

---

## License

MIT — free to use, modify, and distribute with attribution.
