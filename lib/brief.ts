import Anthropic from "@anthropic-ai/sdk";
import { unstable_cache } from "next/cache";
import {
  getAgentPapers,
  getLabPosts,
  getShowHNLaunches,
  getTopStories,
  getTrendingModels,
  getTrendingPapers,
  getTrendingRepos,
} from "@/lib/radar";

// The daily brief: Claude reads today's feeds and writes a short synthesis —
// actual editorial connective tissue, not another list. Cached for 24h;
// the daily cron's revalidateTag("daily-brief") forces regeneration.
// Degrades gracefully: returns null (section hidden) when no API key is set.

async function generateBrief(): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const [papers, repos, models, stories, launches, labs, agentPapers] =
    await Promise.all([
      getTrendingPapers(6),
      getTrendingRepos(6),
      getTrendingModels(6),
      getTopStories(6),
      getShowHNLaunches(6),
      getLabPosts(6),
      getAgentPapers(4),
    ]);

  const digest = [
    "TRENDING PAPERS (Hugging Face Daily Papers, by upvotes):",
    ...papers.map((p) => `- ${p.title} (${p.upvotes} upvotes): ${p.summary}`),
    "\nAGENT RESEARCH (newest arXiv, title-matched):",
    ...agentPapers.map((p) => `- ${p.title}: ${p.summary}`),
    "\nRISING OPEN-SOURCE TOOLS (GitHub, created <30d, by stars):",
    ...repos.map((r) => `- ${r.fullName} (★${r.stars}): ${r.description}`),
    "\nTRENDING MODELS (Hugging Face Hub):",
    ...models.map((m) => `- ${m.id} (${m.downloads} downloads, ${m.likes} likes)`),
    "\nTOP HACKER NEWS AI STORIES (past week):",
    ...stories.map((s) => `- ${s.title} (${s.points} pts, ${s.comments} comments)`),
    "\nSHOW HN AI LAUNCHES (past 2 weeks):",
    ...launches.map((s) => `- ${s.title} (${s.points} pts)`),
    "\nAI LAB BLOG POSTS:",
    ...labs.map((p) => `- [${p.source}] ${p.title}`),
  ].join("\n");

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      thinking: { type: "adaptive" },
      system:
        "You write the daily brief for Signal & Noise, an AI newsletter site. " +
        "Given today's raw feed data, write 3-5 sentences of genuine synthesis: " +
        "connect items across feeds, name the day's real theme(s), and note what " +
        "practitioners should pay attention to and why. Refer to specific papers, " +
        "tools, or stories by name. No bullet points, no headers, no preamble — " +
        "just the prose paragraph. Plain text only, no markdown. Confident, " +
        "concrete, zero hype words like 'exciting' or 'game-changing'.",
      messages: [{ role: "user", content: digest }],
    });

    if (response.stop_reason === "refusal") return null;
    const text = response.content.find((b) => b.type === "text");
    return text && "text" in text ? text.text.trim() : null;
  } catch {
    // Never let a model error break the homepage — the section just hides.
    return null;
  }
}

export const getDailyBrief = unstable_cache(generateBrief, ["daily-brief"], {
  revalidate: 86400,
  tags: ["daily-brief"],
});
