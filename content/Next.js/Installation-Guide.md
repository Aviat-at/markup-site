---
title: "Next.js Portfolio Project – Installation Guide (Production Grade)"
date: "2025-12-25"
tags: ["Next.js", "linux"]
---


This document explains how I set up a **production-grade Next.js portfolio website** using modern best practices. It includes **each installation question**, **the chosen answer**, and **the meaning of that choice**.

---

## 1. Project Creation Command
```bash
npx create-next-app@latest akash-portfolio --ts --app --tailwind
```

### What this does

* Creates a new **Next.js** project
* Enables **TypeScript**
* Uses the **App Router**
* Preconfigures **Tailwind CSS**

This is the recommended foundation for modern, scalable Next.js applications.

---

## 2. Installation Questions & Answers

During setup, Next.js asks several configuration questions. Below are the **exact questions**, **selected answers**, and **why they matter**.

---

### ❓ Which linter would you like to use?

**Answer:** `ESLint`

#### Meaning

* ESLint checks code quality and catches bugs early
* It enforces best practices for React, TypeScript, and Next.js
* Most widely used linter in the React ecosystem

#### Why ESLint

* Industry standard
* Excellent Next.js integration
* Recruiter-friendly and production-safe

---

### ❓ Would you like to use React Compiler?

**Answer:** `Yes`

#### Meaning

* Enables the new React Compiler for automatic performance optimizations
* Reduces unnecessary re-renders
* Removes the need for excessive `useMemo` and `useCallback`

#### Why Yes

* Safe for new projects
* Improves performance automatically
* Aligns with the future direction of React

---

### ❓ Would you like your code inside a `src/` directory?

**Answer:** `Yes`

#### Meaning

* All application code lives inside the `src/` folder
* Configuration files remain at the project root

#### Why Yes

* Cleaner project structure
* Scales better for large applications
* Standard practice in production-grade projects

**Resulting structure:**
```
akash-portfolio/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ lib/
│  └─ styles/
├─ public/
├─ package.json
└─ tsconfig.json
```

---

### ❓ Would you like to customize the import alias?

**Answer:** `Yes`

---

### ❓ What import alias would you like configured?

**Answer:** `@/*`

#### Meaning

Allows absolute imports instead of relative paths.

#### Example
```ts
import Navbar from '@/components/layout/Navbar';
```

instead of:
```ts
import Navbar from '../../../components/layout/Navbar';
```

#### Why `@/*`

* Cleaner imports
* Easier refactoring
* Professional, readable code
* Common in large-scale projects

---

## 3. Final Setup Summary

| Setting | Selected |
|------------------|-----------|
| TypeScript | ✅ Enabled |
| App Router | ✅ Enabled |
| Tailwind CSS | ✅ Enabled |
| ESLint | ✅ Enabled |
| React Compiler | ✅ Enabled |
| `src/` directory | ✅ Enabled |
| Import alias | `@/*` |

This configuration represents a **production-ready Next.js foundation** suitable for:

* Personal portfolios
* SaaS products
* Blogs
* Enterprise web apps

---

## 4. Post-Installation Commands

After the setup completed successfully:

### Install icon library
```bash
npm install lucide-react
```

### Start development server
```bash
npm run dev
```

### Open in browser
```
http://localhost:3000
```

---

## 5. Why This Setup Is Production Grade

* ✅ Clean project structure
* ✅ Strong type safety
* ✅ Performance optimizations enabled
* ✅ Industry-standard tooling
* ✅ Easy to scale (blog, subdomains, APIs)

This setup is suitable for **professional portfolios** and **real-world applications**.

---

## 6. Next Planned Steps (Future)

* [ ] Remove boilerplate pages
* [ ] Add portfolio sections (Hero, About, Projects, Skills, Contact)
* [ ] Add CV download support
* [ ] Deploy to Vercel
* [ ] Add blog on subdomain (`blog.example.com`) using MDX

---

## 7. Technology Stack

| Category | Technology |
|-----------------|------------------|
| Framework | Next.js 15+ |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Linting | ESLint |
| Performance | React Compiler |
| Deployment | Vercel (planned) |

---

## 8. Folder Structure Explained
```
akash-portfolio/
├─ src/
│  ├─ app/                 # App Router pages
│  │  ├─ layout.tsx        # Root layout
│  │  ├─ page.tsx          # Home page
│  │  └─ globals.css       # Global styles
│  ├─ components/          # React components
│  │  ├─ layout/           # Layout components
│  │  ├─ sections/         # Page sections
│  │  └─ ui/               # Reusable UI components
│  ├─ lib/                 # Utilities and helpers
│  └─ styles/              # Additional styles
├─ public/                 # Static assets
│  ├─ images/
│  └─ cv/
├─ .eslintrc.json          # ESLint configuration
├─ tailwind.config.ts      # Tailwind configuration
├─ tsconfig.json           # TypeScript configuration
├─ next.config.ts          # Next.js configuration
└─ package.json            # Dependencies
```

---

## 9. Key Configuration Files

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

This enables the `@/` import alias.

### `next.config.ts`
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

This enables the React Compiler.

### `tailwind.config.ts`
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

This configures Tailwind to scan the `src/` directory.

---

## 10. Development Workflow

### Start development
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Run linter
```bash
npm run lint
```

---

## 11. Best Practices Implemented

1. **TypeScript** – Type safety throughout the application
2. **ESLint** – Code quality enforcement
3. **Tailwind CSS** – Utility-first styling
4. **App Router** – Modern Next.js routing
5. **React Compiler** – Automatic performance optimization
6. **Absolute Imports** – Clean, maintainable code
7. **Structured Folders** – Scalable architecture

---

## 12. Resources

* [Next.js Documentation](https://nextjs.org/docs)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/)
* [Tailwind CSS Docs](https://tailwindcss.com/docs)
* [React Compiler Documentation](https://react.dev/learn/react-compiler)
* [Lucide React Icons](https://lucide.dev/)

---

**Author:** Akash  
**Date:** December 26, 2025  
**Purpose:** Personal reference & future documentation  
**Project:** Production-grade Next.js portfolio website

---

## License

MIT License – Free to use for personal and commercial projects.

---

## Changelog

### v1.0.0 – Initial Setup
* ✅ Next.js 15 with TypeScript
* ✅ App Router configuration
* ✅ Tailwind CSS integration
* ✅ ESLint setup
* ✅ React Compiler enabled
* ✅ `src/` directory structure
* ✅ `@/*` import alias
* ✅ Lucide React icons

---

**End of Document**