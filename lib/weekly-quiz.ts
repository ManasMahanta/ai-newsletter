import { unstable_cache } from "next/cache";
import { callGLM } from "@/lib/glm";
import {
  getTopStories,
  getTrendingModels,
  getTrendingPapers,
  getTrendingRepos,
} from "@/lib/radar";

export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

// "This week in AI" — GLM writes a short multiple-choice quiz from the live
// feeds. Cached 24h and rebuilt by the daily cron's revalidateTag call.
// Returns [] when unconfigured or on any parse failure (section hides).
async function generateQuiz(): Promise<QuizQuestion[]> {
  const [papers, repos, models, stories] = await Promise.all([
    getTrendingPapers(6),
    getTrendingRepos(6),
    getTrendingModels(6),
    getTopStories(6),
  ]);

  const digest = [
    "PAPERS:",
    ...papers.map((p) => `- ${p.title}: ${p.summary}`),
    "TOOLS:",
    ...repos.map((r) => `- ${r.fullName}: ${r.description}`),
    "MODELS:",
    ...models.map((m) => `- ${m.id}`),
    "HN STORIES:",
    ...stories.map((s) => `- ${s.title}`),
  ].join("\n");

  const system =
    "You write a fun but substantive multiple-choice quiz about this week's AI news. " +
    "Using ONLY the supplied feed data, write exactly 6 questions that test whether " +
    "someone read the week's developments. Each question has 4 options, exactly one " +
    "correct, with a one-sentence explanation. Base every question on a specific item " +
    "in the data — never invent facts. Return ONLY minified JSON, no markdown, no " +
    'prose, in this shape: [{"question":"...","options":["a","b","c","d"],' +
    '"answerIndex":0,"explanation":"..."}]';

  try {
    const raw = await callGLM(system, digest, 4000);
    if (!raw) return [];
    // Extract the JSON array even if wrapped in prose or a code fence.
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start === -1 || end <= start) return [];
    const parsed = JSON.parse(raw.slice(start, end + 1)) as QuizQuestion[];
    if (!Array.isArray(parsed)) return [];
    // Keep only well-formed questions.
    return parsed
      .filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.answerIndex === "number" &&
          q.answerIndex >= 0 &&
          q.answerIndex < 4,
      )
      .slice(0, 6);
  } catch {
    return [];
  }
}

export const getWeeklyQuiz = unstable_cache(generateQuiz, ["weekly-quiz"], {
  revalidate: 86400,
  tags: ["weekly-quiz"],
});
