```md
# Akash Tharindu – Technical Blog & Knowledge Base

A modern, fast, and SEO-friendly personal blog built with **Next.js (App Router)**, **Material UI**, and **Markdown**.  
This website is used to publish technical articles and notes related to **Linux**, **Docker**, **Python**, and other engineering topics.

🌐 Live at: **https://blog.akashtharindu.com**

---

## ✨ Features

- 📄 Markdown-based content (no database required)
- ⚡ Built with Next.js App Router (server-side rendering & static generation)
- 🎨 Material UI (responsive, modern UI)
- 🗂 Category-based articles (Linux, Docker, Python, etc.)
- 🖼 Category cards with background images
- 🔒 HTTPS enabled automatically via Vercel
- 🌍 Global CDN hosting
- 🚀 Automatic deployments from GitHub
- ☁️ DNS managed via Cloudflare

---

## 🧱 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Material UI (MUI)
- **Styling**: MUI system (sx)
- **Content**: Markdown (`.md`) files
- **Hosting**: Vercel (Free plan)
- **DNS**: Cloudflare
- **Language**: TypeScript

---

## 📁 Project Structure

```
.
├── app/
│   ├── layout.tsx              # Root layout (theme, container)
│   ├── page.tsx                # Home page (categories)
│   └── [category]/
│       ├── page.tsx            # Category page (list of posts)
│       └── [slug]/
│           └── page.tsx        # Article page
│
├── content/
│   ├── linux/
│   │   └── ubuntu-basics.md
│   ├── docker/
│   │   └── docker-compose.md
│   └── python/
│       └── venv.md
│
├── lib/
│   └── content.ts              # Markdown loader & parser
│
├── public/
│   └── images/
│       └── categories/         # Category background images
│
├── package.json
└── README.md
```

---

## 📝 Writing Articles

### 1️⃣ Create a new Markdown file

Example:
```
content/docker/docker-volumes.md
```

### 2️⃣ Add frontmatter + content

```md
---
title: "Docker Volumes"
date: "2025-01-01"
tags: ["docker", "storage"]
---

# Docker Volumes

Docker volumes are used to persist data...

```bash
docker volume create mydata
```
```

### 3️⃣ Run locally
```bash
npm run dev
```

Open:
```
http://localhost:3000/docker/docker-volumes
```

---

## 🚀 Deployment

This project is deployed using **Vercel** with GitHub integration.

### Deployment flow

1. Push code to GitHub
2. Vercel auto-builds and deploys
3. Changes go live instantly

### Custom domain

- Blog URL: `blog.akashtharindu.com`
- DNS managed via Cloudflare
- SSL handled automatically by Vercel

---

## 🌐 DNS & Hosting Architecture

```
User → Cloudflare DNS → Vercel CDN → Next.js App
```

- Cloudflare handles DNS & security
- Vercel handles hosting, SSL, and scaling

---

## 🛠 Development

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## 📌 Roadmap (Planned Improvements)

- 🔍 Full-text search
- 🧭 Sidebar documentation layout
- 🧩 MDX support (React components inside articles)
- 🖨 Code highlighting with copy button
- 🗺 Sitemap & SEO enhancements
- 📊 Analytics integration

---

## 👤 Author

**Akash Tharindu Kumarasiri**  
Software Engineer | Cloud & DevOps Enthusiast

- 🌐 Website: [https://blog.akashtharindu.com](https://blog.akashtharindu.com)
- 💼 LinkedIn: [https://www.linkedin.com/in/akash-tharindu](https://www.linkedin.com/in/akash-tharindu)
- 🧑‍💻 GitHub: [https://github.com/akashtharindu](https://github.com/akashtharindu)

---

## 📄 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute with attribution.

---

⭐ If you find this project useful, consider starring the repository!
```