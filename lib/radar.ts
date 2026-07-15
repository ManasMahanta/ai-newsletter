// Live "radar" feeds pulled from free public APIs (no keys required).
// Every fetcher returns [] on failure so a flaky upstream never breaks a page.

export type RadarPaper = {
  id: string;
  title: string;
  summary: string;
  upvotes: number;
  url: string;
};

export type RadarRepo = {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  language: string;
  url: string;
};

export type RadarModel = {
  id: string;
  likes: number;
  downloads: number;
  pipelineTag: string;
  url: string;
};

export type RadarStory = {
  title: string;
  points: number;
  comments: number;
  url: string;
  hnUrl: string;
};

const HOUR = 3600;

function truncate(text: string, max = 220): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

async function getJson(url: string, revalidate: number, headers?: HeadersInit) {
  const res = await fetch(url, { next: { revalidate }, headers });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.json();
}

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "signal-and-noise-newsletter",
};

/** Trending papers from Hugging Face Daily Papers (community-upvoted arXiv). */
export async function getTrendingPapers(limit = 8): Promise<RadarPaper[]> {
  try {
    const data = await getJson(
      `https://huggingface.co/api/daily_papers?limit=${limit}`,
      3 * HOUR,
    );
    if (!Array.isArray(data)) return [];
    return data
      .filter((d) => d?.paper?.id && d?.paper?.title)
      .map((d) => ({
        id: String(d.paper.id),
        title: String(d.paper.title),
        summary: truncate(String(d.paper.summary ?? "")),
        upvotes: Number(d.paper.upvotes ?? 0),
        url: `https://huggingface.co/papers/${d.paper.id}`,
      }));
  } catch {
    return [];
  }
}

/** Shared GitHub repo search: any query string, sorted by stars. */
async function fetchRepos(query: string, limit: number): Promise<RadarRepo[]> {
  try {
    const data = await getJson(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`,
      6 * HOUR,
      GH_HEADERS,
    );
    if (!Array.isArray(data?.items)) return [];
    return data.items
      .filter((r: Record<string, unknown>) => r?.full_name && r?.html_url)
      .map((r: Record<string, unknown>) => ({
        name: String(r.name),
        fullName: String(r.full_name),
        description: truncate(String(r.description ?? ""), 160),
        stars: Number(r.stargazers_count ?? 0),
        language: String(r.language ?? ""),
        url: String(r.html_url),
      }));
  } catch {
    return [];
  }
}

/** Fast-rising open-source AI repos created in the last 30 days. */
export async function getTrendingRepos(limit = 8): Promise<RadarRepo[]> {
  const since = new Date(Date.now() - 30 * 24 * HOUR * 1000)
    .toISOString()
    .slice(0, 10);
  return fetchRepos(`topic:ai created:>${since}`, limit);
}

/** Trending models on the Hugging Face Hub right now. */
export async function getTrendingModels(limit = 8): Promise<RadarModel[]> {
  try {
    const data = await getJson(
      `https://huggingface.co/api/models?sort=trendingScore&limit=${limit}`,
      6 * HOUR,
    );
    if (!Array.isArray(data)) return [];
    return data
      .filter((m) => m?.id)
      .map((m) => ({
        id: String(m.id),
        likes: Number(m.likes ?? 0),
        downloads: Number(m.downloads ?? 0),
        pipelineTag: String(m.pipeline_tag ?? "").replace(/-/g, " "),
        url: `https://huggingface.co/${m.id}`,
      }));
  } catch {
    return [];
  }
}

/** Shared HN Algolia "top stories" search: any query, points threshold, days back. */
async function fetchTopStories(
  query: string,
  { pointsAbove, daysBack, limit }: { pointsAbove: number; daysBack: number; limit: number },
): Promise<RadarStory[]> {
  try {
    const since = Math.floor(Date.now() / 1000) - daysBack * 24 * HOUR;
    const filters = encodeURIComponent(`created_at_i>${since},points>${pointsAbove}`);
    const data = await getJson(
      `https://hn.algolia.com/api/v1/search?tags=story&query=${encodeURIComponent(query)}&numericFilters=${filters}&hitsPerPage=${limit}`,
      HOUR,
    );
    if (!Array.isArray(data?.hits)) return [];
    return data.hits
      .filter((h: Record<string, unknown>) => h?.title && h?.objectID)
      .map((h: Record<string, unknown>) => {
        const hnUrl = `https://news.ycombinator.com/item?id=${h.objectID}`;
        return {
          title: String(h.title),
          points: Number(h.points ?? 0),
          comments: Number(h.num_comments ?? 0),
          url: h.url ? String(h.url) : hnUrl,
          hnUrl,
        };
      });
  } catch {
    return [];
  }
}

/** Top AI stories on Hacker News from the past week. */
export async function getTopStories(limit = 8): Promise<RadarStory[]> {
  return fetchTopStories("AI", { pointsAbove: 50, daysBack: 7, limit });
}

export type RadarArxivPaper = {
  id: string;
  title: string;
  summary: string;
  url: string;
  published: string; // ISO date
};

export type RadarDataset = {
  id: string;
  likes: number;
  downloads: number;
  url: string;
};

export type RadarSpace = {
  id: string;
  likes: number;
  sdk: string;
  url: string;
};

export type RadarRelease = {
  repo: string;
  tag: string;
  name: string;
  url: string;
  publishedAt: string; // ISO date
};

export type RadarPost = {
  title: string;
  source: string;
  url: string;
  publishedAt: string; // ISO date
};

// --- XML helpers (arXiv Atom + blog RSS; avoids an XML parser dependency) --

function xmlBlocks(xml: string, tag: string): string[] {
  return xml.match(new RegExp(`<${tag}[\\s>][\\s\\S]*?</${tag}>`, "g")) ?? [];
}

function xmlText(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!m) return "";
  return m[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

async function getText(url: string, revalidate: number): Promise<string> {
  const res = await fetch(url, {
    next: { revalidate },
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SignalNoiseRadar/1.0)" },
  });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.text();
}

/** Shared arXiv search: any search_query expression, newest first. */
async function fetchArxiv(searchQuery: string, limit: number): Promise<RadarArxivPaper[]> {
  try {
    const xml = await getText(
      `https://export.arxiv.org/api/query?search_query=${searchQuery}&sortBy=submittedDate&sortOrder=descending&max_results=${limit}`,
      3 * HOUR,
    );
    return xmlBlocks(xml, "entry")
      .map((entry) => {
        const rawId = xmlText(entry, "id"); // e.g. http://arxiv.org/abs/2607.11883v1
        const id = rawId.split("/abs/")[1] ?? "";
        return {
          id,
          title: xmlText(entry, "title").replace(/\s+/g, " "),
          summary: truncate(xmlText(entry, "summary")),
          url: `https://arxiv.org/abs/${id}`,
          published: xmlText(entry, "published").slice(0, 10),
        };
      })
      .filter((p) => p.id && p.title);
  } catch {
    return [];
  }
}

/** Newest submissions on arXiv in cs.AI / cs.LG / cs.CL — raw, uncurated. */
export async function getFreshArxiv(limit = 8): Promise<RadarArxivPaper[]> {
  return fetchArxiv("cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL", limit);
}

/** Shared Hugging Face Hub search (models or spaces) by keyword. */
async function fetchHubSearch(
  kind: "models" | "spaces",
  params: string,
  limit: number,
): Promise<Array<{ id: string; likes: number; downloads?: number; sdk?: string; pipelineTag?: string }>> {
  try {
    const query = [params, `sort=trendingScore`, `limit=${limit}`]
      .filter(Boolean)
      .join("&");
    const data = await getJson(
      `https://huggingface.co/api/${kind}?${query}`,
      6 * HOUR,
    );
    if (!Array.isArray(data)) return [];
    return data
      .filter((d) => d?.id)
      .map((d) => ({
        id: String(d.id),
        likes: Number(d.likes ?? 0),
        downloads: Number(d.downloads ?? 0),
        sdk: String(d.sdk ?? ""),
        pipelineTag: String(d.pipeline_tag ?? "").replace(/-/g, " "),
      }));
  } catch {
    return [];
  }
}

/** Trending datasets on the Hugging Face Hub. */
export async function getTrendingDatasets(limit = 8): Promise<RadarDataset[]> {
  try {
    const data = await getJson(
      `https://huggingface.co/api/datasets?sort=trendingScore&limit=${limit}`,
      6 * HOUR,
    );
    if (!Array.isArray(data)) return [];
    return data
      .filter((d) => d?.id)
      .map((d) => ({
        id: String(d.id),
        likes: Number(d.likes ?? 0),
        downloads: Number(d.downloads ?? 0),
        url: `https://huggingface.co/datasets/${d.id}`,
      }));
  } catch {
    return [];
  }
}

/** Trending Spaces — live AI demos you can try in the browser. */
export async function getTrendingSpaces(limit = 8): Promise<RadarSpace[]> {
  const spaces = await fetchHubSearch("spaces", "", limit);
  return spaces.map((s) => ({
    id: s.id,
    likes: s.likes,
    sdk: s.sdk ?? "",
    url: `https://huggingface.co/spaces/${s.id}`,
  }));
}

/** Shared GitHub "latest release" lookup across a fixed list of repos. */
async function fetchReleases(repos: string[]): Promise<RadarRelease[]> {
  const results = await Promise.allSettled(
    repos.map(async (repo) => {
      const r = await getJson(
        `https://api.github.com/repos/${repo}/releases/latest`,
        6 * HOUR,
        GH_HEADERS,
      );
      if (!r?.html_url) throw new Error("no release");
      return {
        repo,
        tag: String(r.tag_name ?? ""),
        name: truncate(String(r.name || r.tag_name || ""), 80),
        url: String(r.html_url),
        publishedAt: String(r.published_at ?? "").slice(0, 10),
      } satisfies RadarRelease;
    }),
  );
  return results
    .filter(
      (r): r is PromiseFulfilledResult<RadarRelease> => r.status === "fulfilled",
    )
    .map((r) => r.value)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/** Repos whose releases are worth watching, newest release first. */
const RELEASE_REPOS = [
  "vllm-project/vllm",
  "huggingface/transformers",
  "ggml-org/llama.cpp",
  "ollama/ollama",
  "langchain-ai/langchain",
  "pytorch/pytorch",
];

export async function getLatestReleases(): Promise<RadarRelease[]> {
  return fetchReleases(RELEASE_REPOS);
}

/** Shared "Show HN" search: any query, newest launches first. */
async function fetchShowHN(
  query: string,
  { pointsAbove, daysBack, limit }: { pointsAbove: number; daysBack: number; limit: number },
): Promise<RadarStory[]> {
  try {
    const since = Math.floor(Date.now() / 1000) - daysBack * 24 * HOUR;
    const filters = encodeURIComponent(`created_at_i>${since},points>${pointsAbove}`);
    const data = await getJson(
      `https://hn.algolia.com/api/v1/search?tags=show_hn&query=${encodeURIComponent(query)}&numericFilters=${filters}&hitsPerPage=${limit}`,
      3 * HOUR,
    );
    if (!Array.isArray(data?.hits)) return [];
    return data.hits
      .filter((h: Record<string, unknown>) => h?.title && h?.objectID)
      .map((h: Record<string, unknown>) => {
        const hnUrl = `https://news.ycombinator.com/item?id=${h.objectID}`;
        return {
          title: String(h.title).replace(/^Show HN:\s*/i, ""),
          points: Number(h.points ?? 0),
          comments: Number(h.num_comments ?? 0),
          url: h.url ? String(h.url) : hnUrl,
          hnUrl,
        };
      });
  } catch {
    return [];
  }
}

/** Show HN: AI projects launched in the past two weeks. */
export async function getShowHNLaunches(limit = 8): Promise<RadarStory[]> {
  return fetchShowHN("AI", { pointsAbove: 10, daysBack: 14, limit });
}

/** Major AI labs' blogs (RSS), optionally filtered to matching titles. */
const LAB_FEEDS = [
  { source: "OpenAI", url: "https://openai.com/news/rss.xml" },
  { source: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml" },
  { source: "Google AI", url: "https://blog.google/technology/ai/rss/" },
  { source: "Hugging Face", url: "https://huggingface.co/blog/feed.xml" },
];

async function fetchLabPosts(
  limit: number,
  filter?: (title: string) => boolean,
): Promise<RadarPost[]> {
  const results = await Promise.allSettled(
    LAB_FEEDS.map(async ({ source, url }) => {
      const xml = await getText(url, 3 * HOUR);
      return xmlBlocks(xml, "item")
        .slice(0, 8)
        .map((item) => {
          const date = new Date(xmlText(item, "pubDate"));
          return {
            title: xmlText(item, "title"),
            source,
            url: xmlText(item, "link"),
            publishedAt: Number.isNaN(date.getTime())
              ? ""
              : date.toISOString(),
          };
        })
        .filter((p) => p.title && p.url && (!filter || filter(p.title)));
    }),
  );
  return results
    .filter(
      (r): r is PromiseFulfilledResult<RadarPost[]> => r.status === "fulfilled",
    )
    .flatMap((r) => r.value)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, limit);
}

export async function getLabPosts(limit = 8): Promise<RadarPost[]> {
  return fetchLabPosts(limit);
}

// Agentic-AI writing on Medium. Medium's public RSS is sorted by recency and
// doesn't expose clap counts, so this is "latest from these tags", not a true
// vote ranking. `source` carries the author's byline. Returns [] on failure.
const MEDIUM_TAGS = ["agentic-ai", "ai-agents", "llm-agents"];

export async function getMediumAgentPosts(limit = 9): Promise<RadarPost[]> {
  const results = await Promise.allSettled(
    MEDIUM_TAGS.map(async (tag) => {
      const xml = await getText(`https://medium.com/feed/tag/${tag}`, 3 * HOUR);
      return xmlBlocks(xml, "item")
        .slice(0, 10)
        .map((item) => {
          const date = new Date(xmlText(item, "pubDate"));
          const author = xmlText(item, "dc:creator");
          return {
            title: xmlText(item, "title"),
            source: author || "Medium",
            url: xmlText(item, "link").split("?")[0],
            publishedAt: Number.isNaN(date.getTime()) ? "" : date.toISOString(),
          };
        })
        .filter((p) => p.title && p.url);
    }),
  );

  const seen = new Set<string>();
  return results
    .filter(
      (r): r is PromiseFulfilledResult<RadarPost[]> => r.status === "fulfilled",
    )
    .flatMap((r) => r.value)
    .filter((p) => {
      if (seen.has(p.url)) return false;
      seen.add(p.url);
      return true;
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, limit);
}

export function formatShortDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

// --- Agentic AI: every feed above, re-scoped to AI agents specifically ----

/** Title-anchored arXiv search: papers actually about agents, not passing mentions. */
export async function getAgentPapers(limit = 8): Promise<RadarArxivPaper[]> {
  return fetchArxiv("ti:agent+AND+%28cat:cs.AI+OR+cat:cs.MA+OR+cat:cs.CL%29", limit);
}

/** Repos tagged with the standard "ai-agents" GitHub topic, active recently. */
export async function getAgentRepos(limit = 8): Promise<RadarRepo[]> {
  const since = new Date(Date.now() - 60 * 24 * HOUR * 1000)
    .toISOString()
    .slice(0, 10);
  return fetchRepos(`topic:ai-agents pushed:>${since}`, limit);
}

/** Releases from the agent frameworks most people build on. */
const AGENT_RELEASE_REPOS = [
  "langchain-ai/langchain",
  "browser-use/browser-use",
  "All-Hands-AI/OpenHands",
  "crewAIInc/crewAI",
  "microsoft/autogen",
  "openai/openai-agents-python",
];

export async function getAgentReleases(): Promise<RadarRelease[]> {
  return fetchReleases(AGENT_RELEASE_REPOS);
}

/** Trending agent-related models on the Hugging Face Hub. */
export async function getAgentModels(limit = 8): Promise<RadarModel[]> {
  const models = await fetchHubSearch("models", "search=agent", limit);
  return models.map((m) => ({
    id: m.id,
    likes: m.likes,
    downloads: m.downloads ?? 0,
    pipelineTag: m.pipelineTag ?? "",
    url: `https://huggingface.co/${m.id}`,
  }));
}

/** Trending agent demos (Spaces) you can run in the browser. */
export async function getAgentSpaces(limit = 8): Promise<RadarSpace[]> {
  const spaces = await fetchHubSearch("spaces", "search=agent", limit);
  return spaces.map((s) => ({
    id: s.id,
    likes: s.likes,
    sdk: s.sdk ?? "",
    url: `https://huggingface.co/spaces/${s.id}`,
  }));
}

/** Show HN: agent projects launched in the past two weeks. */
export async function getAgentLaunches(limit = 8): Promise<RadarStory[]> {
  return fetchShowHN("agent", { pointsAbove: 5, daysBack: 14, limit });
}

/** Top Hacker News discussions specifically about AI agents. */
export async function getAgentDiscussions(limit = 8): Promise<RadarStory[]> {
  return fetchTopStories("AI agent", { pointsAbove: 50, daysBack: 7, limit });
}

/** Lab blog posts whose titles mention agents. */
export async function getAgentLabPosts(limit = 8): Promise<RadarPost[]> {
  return fetchLabPosts(limit, (title) => /agent/i.test(title));
}

// --- Interview prep: live feeds for the /interview-prep page -------------

/** Most-starred LLM/GenAI interview-prep repos on GitHub. */
export async function getInterviewRepos(limit = 8): Promise<RadarRepo[]> {
  return fetchRepos("llm interview", limit);
}

/** Recent HN discussions about AI hiring and interviews. */
export async function getInterviewStories(limit = 8): Promise<RadarStory[]> {
  return fetchTopStories("AI interview", {
    pointsAbove: 20,
    daysBack: 90,
    limit,
  });
}
