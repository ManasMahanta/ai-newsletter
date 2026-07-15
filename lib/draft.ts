import { callGLM } from "@/lib/glm";
import {
  getAgentPapers,
  getLabPosts,
  getLatestReleases,
  getShowHNLaunches,
  getTopStories,
  getTrendingModels,
  getTrendingPapers,
  getTrendingRepos,
} from "@/lib/radar";

// Shared weekly-issue generator, used by both the on-demand drafter
// (/api/draft-issue, returns a downloadable file) and the automated
// publisher (/api/publish-issue, opens a GitHub PR). Returns the MDX
// document (starting with "---") or null on failure.
export async function generateIssueMdx(): Promise<string | null> {
  const [papers, repos, models, stories, launches, labs, agentPapers, releases] =
    await Promise.all([
      getTrendingPapers(8),
      getTrendingRepos(8),
      getTrendingModels(8),
      getTopStories(8),
      getShowHNLaunches(8),
      getLabPosts(8),
      getAgentPapers(6),
      getLatestReleases(),
    ]);

  const today = new Date().toISOString().slice(0, 10);
  const digest = [
    "TRENDING PAPERS:",
    ...papers.map((p) => `- ${p.title} (${p.upvotes} upvotes) [${p.url}]: ${p.summary}`),
    "\nAGENT RESEARCH:",
    ...agentPapers.map((p) => `- ${p.title} [${p.url}]: ${p.summary}`),
    "\nRISING TOOLS:",
    ...repos.map((r) => `- ${r.fullName} (★${r.stars}) [${r.url}]: ${r.description}`),
    "\nFRAMEWORK RELEASES:",
    ...releases.map((r) => `- ${r.repo} ${r.tag} (${r.publishedAt}) [${r.url}]`),
    "\nTRENDING MODELS:",
    ...models.map((m) => `- ${m.id} (${m.downloads} downloads) [${m.url}]`),
    "\nTOP HN STORIES:",
    ...stories.map((s) => `- ${s.title} (${s.points} pts, ${s.comments} comments) [${s.url}]`),
    "\nSHOW HN LAUNCHES:",
    ...launches.map((s) => `- ${s.title} (${s.points} pts) [${s.url}]`),
    "\nLAB POSTS:",
    ...labs.map((p) => `- [${p.source}] ${p.title} [${p.url}]`),
  ].join("\n");

  const system =
    "You draft weekly issues for Signal & Noise, an AI newsletter. Given a week of " +
    "raw feed data, write a complete issue as MDX with this exact structure:\n\n" +
    "1. YAML frontmatter: title (format: 'Issue #N: <punchy headline>' — leave N as " +
    `a literal N for the editor), date ("${today}"), summary (one-sentence hook), ` +
    "tags (2-3 from: models, research, tools, business, policy), featured: false.\n" +
    "2. Sections, in order: '## TL;DR' (3 bullets), '## The Big Story' (the week's " +
    "most consequential development, ~200 words, with 'For builders:' and 'For " +
    "business:' angles), '## Research Radar' (2 papers, plain English, with the " +
    "'so what'), '## Tool of the Week' (one repo/launch worth trying, why), " +
    "'## Lightning Round' (5 one-liners with links), '## One Tip' (something " +
    "actionable this week).\n\n" +
    "Link to sources with markdown links using the URLs provided. Write like a " +
    "sharp practitioner, zero hype. Where the data doesn't support a claim, " +
    "don't make it. Output ONLY the MDX document, starting with '---'.";

  const raw = await callGLM(system, digest, 8000);
  if (!raw) return null;
  // Models sometimes wrap output in a code fence despite instructions.
  const mdx = raw
    .replace(/^```(?:mdx|markdown)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
  return mdx.startsWith("---") ? mdx : null;
}
