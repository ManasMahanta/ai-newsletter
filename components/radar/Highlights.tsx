// Auto-compiled digest: the #1 item from each live feed, in one panel.
// Uses the same limits as the homepage scenes below, so every fetch here
// is deduped against theirs — the digest costs zero extra API calls.

import {
  formatCount,
  getAgentPapers,
  getLabPosts,
  getShowHNLaunches,
  getTopStories,
  getTrendingModels,
  getTrendingPapers,
  getTrendingRepos,
} from "@/lib/radar";

type Highlight = {
  tag: string;
  title: string;
  url: string;
  stat: string;
};

export default async function Highlights() {
  const [papers, repos, models, agentPapers, launches, stories, labs] =
    await Promise.all([
      getTrendingPapers(4),
      getTrendingRepos(4),
      getTrendingModels(4),
      getAgentPapers(2),
      getShowHNLaunches(4),
      getTopStories(4),
      getLabPosts(4),
    ]);

  const items = [
    papers[0] && {
      tag: "Top paper",
      title: papers[0].title,
      url: papers[0].url,
      stat: `▲ ${formatCount(papers[0].upvotes)} upvotes`,
    },
    repos[0] && {
      tag: "Hot tool",
      title: repos[0].fullName,
      url: repos[0].url,
      stat: `★ ${formatCount(repos[0].stars)}`,
    },
    models[0] && {
      tag: "Model to watch",
      title: models[0].id,
      url: models[0].url,
      stat: `⬇ ${formatCount(models[0].downloads)} downloads`,
    },
    agentPapers[0] && {
      tag: "Agents",
      title: agentPapers[0].title,
      url: agentPapers[0].url,
      stat: `arXiv ${agentPapers[0].id}`,
    },
    launches[0] && {
      tag: "Launch",
      title: launches[0].title,
      url: launches[0].url,
      stat: `${formatCount(launches[0].points)} points on HN`,
    },
    stories[0] && {
      tag: "Big debate",
      title: stories[0].title,
      url: stories[0].url,
      stat: `${formatCount(stories[0].comments)} comments`,
    },
    labs[0] && {
      tag: "From the labs",
      title: labs[0].title,
      url: labs[0].url,
      stat: labs[0].source,
    },
  ].filter(Boolean) as Highlight[];

  if (items.length === 0) return null;

  return (
    <ol className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white/65 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/55">
      {items.map((h) => (
        <li key={h.tag} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="w-28 shrink-0 font-mono text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-400">
            {h.tag}
          </span>
          <a
            href={h.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 font-medium leading-snug hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {h.title}
          </a>
          <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
            {h.stat}
          </span>
        </li>
      ))}
    </ol>
  );
}
