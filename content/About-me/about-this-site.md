---
title: "About This Site"
date: "2026-06-02"
tags: ["project", "next.js", "markdown", "architecture"]
---

# About This Site

**blog.akashtharindu.com** is a personal knowledge base and technical blog built around a single idea: content should live in plain Markdown files, not locked inside a database or a CMS.

Every article on this site — including this one — is a `.md` file committed to a GitHub repository. No admin panel, no database, no content API. Just text files and a build step.

---

## Why Markdown?

Markdown keeps content portable, version-controlled, and fast to write.

- **Git is the CMS.** Every article has a full commit history. Rolling back, diffing, or branching a draft is a normal `git` operation.
- **Zero infrastructure.** No database to provision, no migrations to run, no connection strings to manage.
- **Focus on writing.** The format is minimal by design — structure comes from headings, code blocks, and tables, not from a visual editor.
- **Portable forever.** A `.md` file will be readable 20 years from now without any special tooling.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| UI Components | Material UI (MUI v6) |
| Markdown parsing | `gray-matter` (frontmatter) + `remark` + `remark-html` |
| Hosting | Vercel |
| DNS / CDN | Cloudflare |
| Source | [github.com/Aviat-at/markup-site](https://github.com/Aviat-at/markup-site) |

---

## How It Works

### Content layer

All articles sit under the `content/` directory, organized into category folders:

```
content/
├── About-me/
│   ├── ubuntu-basics.md
│   └── about-this-site.md   ← you are here
├── git/
│   └── conventional-commits.md
├── linux/
│   ├── linux-distributions.md
│   └── filesystem-and-navigation.md
├── Next.js/
│   └── Installation-Guide.md
└── Docker/
    └── Docker-Compose-Full-Stack.md
```

Each file starts with YAML frontmatter:

```markdown
---
title: "Your Article Title"
date: "2026-06-02"
tags: ["tag-one", "tag-two"]
---

# Article content starts here...
```

The `lib/content.ts` module reads these files at build time using Node's `fs` module, parses frontmatter with `gray-matter`, and converts the Markdown body to HTML with `remark`.

### Routing

Next.js App Router generates routes directly from the filesystem layout:

| URL | Source |
|-----|--------|
| `/` | Home — lists all categories |
| `/git` | Lists all posts in `content/git/` |
| `/git/conventional-commits` | Renders `content/git/conventional-commits.md` |

`generateStaticParams()` on each dynamic route pre-builds every page at deploy time, so the site is fully static — no server compute on each request.

### Deployment pipeline

```
Write .md file  →  git push  →  Vercel detects push
       →  next build  →  static HTML + CDN deploy  →  live in ~30s
```

Vercel watches the GitHub repository. Every push to `main` triggers a new build and deployment. The whole cycle from commit to live is under a minute.

---

## Project Structure

```
markup-site/
├── app/                    # Next.js App Router pages & components
│   ├── layout.tsx          # Root layout (Navbar, theme provider)
│   ├── page.tsx            # Homepage — category card grid
│   ├── [category]/
│   │   ├── page.tsx        # Category listing page
│   │   └── [slug]/
│   │       └── page.tsx    # Individual article page
│   ├── components/         # Shared UI components (Navbar, animations)
│   └── globals.css         # Global styles
├── content/                # All Markdown articles (the actual content)
├── lib/
│   └── content.ts          # File system reader + Markdown parser
├── theme/
│   └── theme.ts            # MUI dark theme configuration
└── public/                 # Static assets
```

---

## Adding New Content

To publish a new article:

1. Create a `.md` file in the appropriate `content/<category>/` folder.
2. Add frontmatter (`title`, `date`, `tags`).
3. Write the article in standard Markdown.
4. `git add`, `git commit`, `git push`.
5. Vercel picks it up automatically — no redeployment needed beyond the push.

To create a new category, make a new folder under `content/`. The site discovers it automatically. For a custom icon and color on the home page, add an entry to `CATEGORY_META` in `app/page.tsx`.

---

## Open Source

The full source is available on GitHub under the MIT licence:
[github.com/Aviat-at/markup-site](https://github.com/Aviat-at/markup-site)

Feel free to fork it and adapt it for your own knowledge base.
