# Contributing

Thank you for considering a contribution to markup-site. Contributions of all kinds are welcome — bug reports, article corrections, feature suggestions, and code improvements.

---

## Ways to Contribute

### Fixing a typo or content error
Open a pull request directly with the correction. No issue needed for small fixes.

### Suggesting a new article or category
Open an issue describing the topic. Include why it fits the scope of the project.

### Reporting a bug
Open a GitHub issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser / OS if it's a UI issue

### Reporting a security vulnerability
Do **not** open a public issue. See [SECURITY.md](SECURITY.md).

---

## Development Setup

```bash
git clone https://github.com/Aviat-at/markup-site.git
cd markup-site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding an Article

1. Create a `.md` file under `content/<category>/` — e.g. `content/linux/file-permissions.md`
2. Add frontmatter at the top:

```markdown
---
title: "Your Article Title"
date: "2026-06-02"
tags: ["relevant", "tags"]
---
```

3. Write the body in standard [GFM Markdown](https://github.github.com/gfm/) — tables, code blocks, and strikethrough are all supported.
4. Run `npm run dev` and verify it renders correctly at `http://localhost:3000/<category>/<slug>`.

## Adding a New Category

1. Create a folder under `content/` — e.g. `content/rust/`
2. Add at least one article inside it.
3. Register the category in `app/page.tsx` inside the `CATEGORY_META` object with an icon, colour, and description:

```ts
rust: {
  icon: <Settings size={20} />,
  color: "#f97316",
  description: "Systems programming with Rust",
},
```

---

## Pull Request Guidelines

- Keep PRs focused — one topic per PR
- Follow the existing code style (TypeScript, MUI `sx` props, no inline styles)
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(linux): add file permissions article
fix(content): correct remark-gfm table rendering
docs: update CONTRIBUTING guide
```

- Run `npm run build` before submitting to confirm there are no build errors.

---

## Code of Conduct

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
