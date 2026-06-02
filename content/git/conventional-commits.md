---
title: "Conventional Commits: Writing Structured Git History"
date: "2026-06-02"
tags: ["git", "commits", "workflow", "best-practices"]
---

# Conventional Commits: Writing Structured Git History

Conventional Commits is a specification for writing consistent, machine-readable commit messages. It gives every commit a clear purpose at a glance — and unlocks automation on top of your git history.

---

## The Format

```
<type>(<scope>): <short summary>
```

| Part | Required | Description |
|------|----------|-------------|
| `type` | Yes | What kind of change this is |
| `scope` | No | What area it touches (e.g. `navbar`, `auth`, `api`) |
| `summary` | Yes | Imperative, lowercase, no trailing period |

**Imperative** means write it like a command: `add`, `fix`, `remove` — not `added`, `fixing`, `removes`.

---

## Commit Types

| Type | When to use |
|------|-------------|
| `feat` | New feature added |
| `fix` | Bug fix |
| `refactor` | Code restructure — no new feature, no bug fix |
| `style` | Formatting, whitespace, missing semicolons — no logic change |
| `docs` | Documentation only (README, comments, changelogs) |
| `test` | Adding or fixing tests |
| `chore` | Tooling, deps, config (e.g. updating `package.json`) |
| `perf` | Performance improvement |
| `ci` | CI/CD pipeline changes (GitHub Actions, etc.) |
| `build` | Build system changes (webpack, `next.config`, etc.) |
| `revert` | Reverts a previous commit |

---

## Real-World Examples

```bash
feat(auth): add Google OAuth login
fix(navbar): correct active link highlight on mobile
refactor(theme): replace hardcoded hex values with CSS tokens
chore(deps): upgrade MUI to v6
perf(images): convert banners to next/image with lazy loading
docs: add setup instructions to README
style: format components with prettier
test(api): add integration tests for /users endpoint
ci: add lint step to GitHub Actions workflow
build: migrate from webpack to Vite
revert: revert "feat(auth): add Google OAuth login"
```

---

## Breaking Changes

When a commit introduces a change that breaks the existing API or contract, signal it in one of two ways.

**Option 1 — Add `!` after the type:**

```bash
feat(api)!: remove deprecated /v1 endpoints
```

**Option 2 — Add a `BREAKING CHANGE:` footer in the commit body:**

```
feat(api): remove deprecated /v1 endpoints

BREAKING CHANGE: The /v1/users and /v1/posts endpoints have been removed.
Migrate to /v2/users and /v2/posts respectively.
```

Both approaches cause tools like `semantic-release` to bump the **major** version number automatically.

---

## Scopes in Practice

The scope is optional but adds valuable context in larger codebases:

```bash
fix(auth): handle expired JWT tokens
fix(cart): prevent duplicate item addition
fix(checkout): round currency values correctly
```

Without scopes these would all just read `fix: ...` — harder to scan at a glance.

Agree on scopes with your team and keep them consistent. Common patterns:

- **Feature areas:** `auth`, `dashboard`, `billing`
- **Layers:** `api`, `db`, `ui`
- **Packages:** `core`, `utils`, `cli` (monorepos)

---

## Why Bother?

**Changelogs write themselves.** Tools like [`conventional-changelog`](https://github.com/conventional-changelog/conventional-changelog) parse your history and generate a `CHANGELOG.md` automatically — grouped by type, filtered to user-facing changes.

**Automatic version bumps.** [`semantic-release`](https://semantic-release.gitbook.io/) reads your commits and decides whether to cut a patch, minor, or major release:

| Commit type | Version bump |
|-------------|-------------|
| `fix` | Patch `1.0.x` |
| `feat` | Minor `1.x.0` |
| `feat!` / `BREAKING CHANGE` | Major `x.0.0` |

**Readable `git log`.** Compare:

```bash
# Without conventions
update stuff
fix
wip
changes
finally working

# With conventions
feat(auth): add Google OAuth login
fix(navbar): correct active link highlight on mobile
refactor(theme): replace hardcoded hex values with CSS tokens
chore(deps): upgrade MUI to v6
```

The second log tells you exactly what shipped, where, and why — without opening a single file.

**Teammates (and future you) understand instantly.** A `refactor:` commit signals "nothing changed for users — safe to skip in a hotfix cherry-pick." A `feat:` signals "new surface area — worth a closer review."

---

## Quick Reference

```bash
# New feature
git commit -m "feat(search): add keyboard shortcut to open search modal"

# Bug fix
git commit -m "fix(form): prevent double submission on slow connections"

# No user impact
git commit -m "chore: update ESLint config to flat format"

# Breaking change
git commit -m "feat(api)!: require authentication on all /admin routes"
```

Keep summaries under 72 characters so they fit cleanly in `git log --oneline` output.
