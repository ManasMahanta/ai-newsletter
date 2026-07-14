# Signal & Noise — newsletter website

A subscriber-growth-focused website for an AI-advancements newsletter. Built with Next.js
(App Router) + Tailwind CSS; issues are MDX files; email delivery via Buttondown.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (statically generates all issue/topic pages)
```

The signup form works out of the box in a graceful "not configured" mode. To enable real
subscriptions, copy `.env.example` to `.env.local` and set `BUTTONDOWN_API_KEY`
(from https://buttondown.com/settings/api). Set `NEXT_PUBLIC_SITE_URL` to your real domain
before deploying — it drives SEO metadata, the sitemap, and the RSS feed.

## Publishing an issue

Add a file to `content/issues/`:

```mdx
---
title: "Issue #4: Your headline"
date: "2026-07-17"
summary: "One-sentence hook shown on cards, in search results, and in RSS."
tags: [models, research]        # slugs from lib/site.ts topics
featured: false                 # true = shown on /start-here
---

## TL;DR
...
```

Section template (encoded in the seed issues): **TL;DR → The Big Story (builder + business
angles) → Research Radar → Tool of the Week → The Business Angle → Lightning Round → One Tip**.

The archive, topic pages, sitemap, and RSS pick the file up automatically on the next build.
The three issues in `content/issues/` are **sample content** — replace them with your own.

## Map

- `app/` — pages: home, `/issues`, `/issues/[slug]`, `/topics/[tag]`, `/subscribe`,
  `/start-here`, `/about`, `/thanks`, `/privacy`, plus `rss.xml`, `sitemap.ts`, `robots.ts`
- `app/api/subscribe/route.ts` — POSTs to Buttondown; key stays server-side
- `components/` — `SignupForm`, `IssueCard`, `InlineCTA`, header/footer
- `lib/site.ts` — site name, tagline, URL, topic taxonomy (edit branding here)
- `lib/issues.ts` — MDX loading, tags, sorting

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com/new); add the two env vars in
project settings. No database or other services required.

## Roadmap (not built yet)

Sponsor page, referral program, tools directory / AI glossary for SEO, paid tier.
