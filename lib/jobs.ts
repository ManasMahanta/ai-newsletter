// Live open positions for the Interview Prep page, bucketed by seniority.
// Sources are free, key-less public job-board APIs: Greenhouse + Ashby company
// boards for the big AI labs, plus Remotive's remote ML search (their terms:
// link to the Remotive listing URL and credit Remotive as the source, and
// don't poll more than ~4×/day — the 6h revalidate keeps us at exactly that).
// Every fetcher returns [] on failure so the page never breaks.

const REVALIDATE = 21600; // 6h

export type JobLevel = "entry" | "mid" | "senior" | "leadership";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  postedAt?: string; // ISO date
  via?: string; // aggregator credit, e.g. "Remotive"
};

const GREENHOUSE_BOARDS: [board: string, company: string][] = [
  ["anthropic", "Anthropic"],
  ["scaleai", "Scale AI"],
];

const ASHBY_BOARDS: [board: string, company: string][] = [
  ["openai", "OpenAI"],
  ["cohere", "Cohere"],
  ["ElevenLabs", "ElevenLabs"],
];

// Keep only roles someone prepping for a Gen AI interview would apply to.
const TECHNICAL =
  /\b(engineer|engineering|scientist|researcher|research|developer|architect|machine learning|deep learning|\bml\b|\bai\b|llm|genai|generative|data|infrastructure|technical|product manager|solutions)\b/i;
const EXCLUDED =
  /\b(account (executive|manager|director)|sales|marketing|recruit|sourcer|counsel|attorney|legal|finance|accountant|accounting|payroll|people (ops|operations|partner)|talent|executive assistant|administrative|events?|brand|communications|customer success|partnerships|procurement|workplace|facilities|physical security|revenue|billing)\b/i;

function relevant(title: string): boolean {
  return TECHNICAL.test(title) && !EXCLUDED.test(title);
}

export function classifyLevel(title: string): JobLevel {
  if (/\b(head|director|vp|svp|evp|vice president|chief|cto|manager)\b/i.test(title)) {
    return "leadership";
  }
  if (/\b(intern|internship|junior|new grad|graduate|entry|early career|apprentice|associate|residency|resident)\b/i.test(title)) {
    return "entry";
  }
  if (/\b(senior|staff|principal|sr\.?|lead|distinguished)\b/i.test(title)) {
    return "senior";
  }
  return "mid";
}

async function fetchGreenhouse(board: string, company: string): Promise<Job[]> {
  try {
    const res = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${board}/jobs`,
      { next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      jobs?: {
        id: number;
        title?: string;
        absolute_url?: string;
        location?: { name?: string };
        first_published?: string;
      }[];
    };
    return (data.jobs ?? [])
      .filter((j) => j.title && j.absolute_url)
      .map((j) => ({
        id: `gh-${board}-${j.id}`,
        title: j.title as string,
        company,
        location: j.location?.name ?? "Not specified",
        url: j.absolute_url as string,
        postedAt: j.first_published,
      }));
  } catch {
    return [];
  }
}

async function fetchAshby(board: string, company: string): Promise<Job[]> {
  try {
    const res = await fetch(
      `https://api.ashbyhq.com/posting-api/job-board/${board}`,
      { next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      jobs?: {
        id: string;
        title?: string;
        jobUrl?: string;
        location?: string;
        publishedAt?: string;
        isListed?: boolean;
      }[];
    };
    return (data.jobs ?? [])
      .filter((j) => j.title && j.jobUrl && j.isListed !== false)
      .map((j) => ({
        id: `ashby-${board}-${j.id}`,
        title: j.title as string,
        company,
        location: j.location ?? "Not specified",
        url: j.jobUrl as string,
        postedAt: j.publishedAt,
      }));
  } catch {
    return [];
  }
}

async function fetchRemotive(): Promise<Job[]> {
  try {
    const res = await fetch(
      "https://remotive.com/api/remote-jobs?search=machine%20learning&limit=50",
      { next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      jobs?: {
        id: number;
        title?: string;
        url?: string;
        company_name?: string;
        candidate_required_location?: string;
        publication_date?: string;
      }[];
    };
    return (data.jobs ?? [])
      .filter((j) => j.title && j.url)
      .map((j) => ({
        id: `remotive-${j.id}`,
        title: j.title as string,
        company: j.company_name ?? "Unknown",
        location: j.candidate_required_location
          ? `Remote — ${j.candidate_required_location}`
          : "Remote",
        url: j.url as string,
        postedAt: j.publication_date,
        via: "Remotive",
      }));
  } catch {
    return [];
  }
}

const PER_LEVEL = 8;

export async function getJobsByLevel(): Promise<Record<JobLevel, Job[]>> {
  const results = await Promise.allSettled([
    ...GREENHOUSE_BOARDS.map(([b, c]) => fetchGreenhouse(b, c)),
    ...ASHBY_BOARDS.map(([b, c]) => fetchAshby(b, c)),
    fetchRemotive(),
  ]);

  const seen = new Set<string>();
  const all: Job[] = [];
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const job of r.value) {
      if (!relevant(job.title) || seen.has(job.url)) continue;
      seen.add(job.url);
      all.push(job);
    }
  }

  all.sort((a, b) => (b.postedAt ?? "").localeCompare(a.postedAt ?? ""));

  const byLevel: Record<JobLevel, Job[]> = {
    entry: [],
    mid: [],
    senior: [],
    leadership: [],
  };
  for (const job of all) {
    const bucket = byLevel[classifyLevel(job.title)];
    if (bucket.length < PER_LEVEL) bucket.push(job);
  }
  return byLevel;
}
