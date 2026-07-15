import {
  getLabPosts,
  getShowHNLaunches,
  getTopStories,
  getTrendingPapers,
  getTrendingRepos,
} from "@/lib/radar";
import { site } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function item(title: string, url: string, description: string): string {
  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <description>${escapeXml(description)}</description>
    </item>`;
}

// Live radar as RSS: the current top items across the main feeds.
export async function GET() {
  const [papers, repos, stories, launches, labs] = await Promise.all([
    getTrendingPapers(5),
    getTrendingRepos(5),
    getTopStories(5),
    getShowHNLaunches(5),
    getLabPosts(5),
  ]);

  const items = [
    ...papers.map((p) =>
      item(`[Paper] ${p.title}`, p.url, `${p.upvotes} upvotes · ${p.summary}`),
    ),
    ...repos.map((r) =>
      item(`[Tool] ${r.fullName}`, r.url, `★ ${r.stars} · ${r.description}`),
    ),
    ...launches.map((s) =>
      item(`[Launch] ${s.title}`, s.url, `${s.points} points on Show HN`),
    ),
    ...stories.map((s) =>
      item(
        `[Discussion] ${s.title}`,
        s.url,
        `${s.points} points · ${s.comments} comments on Hacker News`,
      ),
    ),
    ...labs.map((p) => item(`[${p.source}] ${p.title}`, p.url, p.source)),
  ].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${site.name} — Radar`)}</title>
    <link>${site.url}/radar</link>
    <description>A live pulse on AI: trending papers, rising tools, launches, discussions, and lab posts. Auto-refreshed.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
