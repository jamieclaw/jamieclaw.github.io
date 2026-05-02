# jamieclaw.github.io

Personal blog — Astro + GitHub Pages.

Live at <https://jamieclaw.github.io/>.

## Writing a post

Drop a Markdown file in `src/content/blog/`:

```md
---
title: "Post title"
description: "One-line summary for the feed and meta tags."
pubDate: 2026-05-10
tags: ["note"]
draft: false
---

Post body in Markdown.
```

Then:

```bash
git add src/content/blog/<slug>.md
git commit -m "post: <slug>"
git push
```

GitHub Actions builds and deploys automatically.

## Local dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
```

## Structure

- `src/content/blog/` — posts (Markdown)
- `src/layouts/BaseLayout.astro` — shared page shell
- `src/pages/` — routes (`index`, `posts/[...slug]`, `tags/[tag]`, `about`, `rss.xml`)
- `src/styles/global.css` — dark theme
- `.github/workflows/deploy.yml` — CI/CD
