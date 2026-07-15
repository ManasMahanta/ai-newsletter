// Live open positions for the Interview Prep page, bucketed by seniority.
// Sources are free, key-less public job-board APIs: Greenhouse + Ashby company
// boards for the big AI labs, plus Remotive's remote ML search (their terms:
// link to the Remotive listing URL and credit Remotive as the source, and
// don't poll more than ~4×/day — the 6h revalidate keeps us at exactly that).
// Every fetcher returns [] on failure so the page never breaks.

const REVALIDATE = 21600; // 6h

export type JobLevel = "entry" | "mid" | "senior" | "leadership";
export type JobRegion = "us" | "india";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  regions: JobRegion[]; // which location filters this job matches
  postedAt?: string; // ISO date
  via?: string; // aggregator credit, e.g. "Remotive"
};

const GREENHOUSE_BOARDS: [board: string, company: string][] = [
  ["anthropic", "Anthropic"],
  ["scaleai", "Scale AI"],
  ["turing", "Turing"],
];

const ASHBY_BOARDS: [board: string, company: string][] = [
  ["openai", "OpenAI"],
  ["cohere", "Cohere"],
  ["ElevenLabs", "ElevenLabs"],
  ["sarvam", "Sarvam AI"],
];

// Keep only roles someone prepping for a Gen AI interview would apply to.
const TECHNICAL =
  /\b(engineer|engineering|scientist|researcher|research|developer|architect|machine learning|deep learning|\bml\b|\bai\b|llm|genai|generative|data|infrastructure|technical|product manager|solutions)\b/i;
const EXCLUDED =
  /\b(account (executive|manager|director)|sales|marketing|recruit|sourcer|counsel|attorney|legal|finance|accountant|accounting|payroll|people (ops|operations|partner)|talent|executive assistant|administrative|events?|brand|communications|customer success|customer support|partnerships|procurement|workplace|facilities|physical security|revenue|billing|gtm|go.to.market|video editor)\b/i;

function relevant(title: string): boolean {
  return TECHNICAL.test(title) && !EXCLUDED.test(title);
}

const INDIA =
  /\b(india|bengaluru|bangalore|hyderabad|mumbai|delhi|gurgaon|gurugram|pune|chennai|noida|kolkata)\b/i;
const US =
  /\b(united states|usa|u\.s\.|us|san francisco|new york|nyc|seattle|mountain view|palo alto|sunnyvale|austin|boston|chicago|los angeles|san diego|denver|miami|atlanta|redmond|bellevue|cupertino|washington)\b/i;
const US_STATE = /,\s*(CA|NY|WA|TX|MA|IL|CO|GA|FL|DC|VA|NJ|PA|OR|UT|NC|MN|MI|AZ|TN|OH|MO)\b/;
// Location-agnostic remote roles show up under both filters.
const GLOBAL = /\b(worldwide|anywhere|global)\b/i;

export function classifyRegions(location: string): JobRegion[] {
  if (GLOBAL.test(location) || /^remote$/i.test(location.trim())) {
    return ["us", "india"];
  }
  const regions: JobRegion[] = [];
  if (US.test(location) || US_STATE.test(location)) regions.push("us");
  if (INDIA.test(location)) regions.push("india");
  return regions;
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
      .map((j) => {
        const location = j.location?.name ?? "Not specified";
        return {
          id: `gh-${board}-${j.id}`,
          title: j.title as string,
          company,
          location,
          url: j.absolute_url as string,
          regions: classifyRegions(location),
          postedAt: j.first_published,
        };
      });
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
      .map((j) => {
        const location = j.location ?? "Not specified";
        return {
          id: `ashby-${board}-${j.id}`,
          title: j.title as string,
          company,
          location,
          url: j.jobUrl as string,
          regions: classifyRegions(location),
          postedAt: j.publishedAt,
        };
      });
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
      .map((j) => {
        const location = j.candidate_required_location
          ? `Remote — ${j.candidate_required_location}`
          : "Remote";
        return {
          id: `remotive-${j.id}`,
          title: j.title as string,
          company: j.company_name ?? "Unknown",
          location,
          url: j.url as string,
          regions: classifyRegions(location),
          postedAt: j.publication_date,
          via: "Remotive",
        };
      });
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
      // Jobs outside both filterable regions are unreachable in the UI.
      if (!relevant(job.title) || job.regions.length === 0 || seen.has(job.url))
        continue;
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
  const counts: Record<JobLevel, Record<JobRegion, number>> = {
    entry: { us: 0, india: 0 },
    mid: { us: 0, india: 0 },
    senior: { us: 0, india: 0 },
    leadership: { us: 0, india: 0 },
  };
  for (const job of all) {
    const level = classifyLevel(job.title);
    const wanted = job.regions.filter((r) => counts[level][r] < PER_LEVEL);
    if (wanted.length === 0) continue;
    for (const r of wanted) counts[level][r] += 1;
    byLevel[level].push(job);
  }
  return byLevel;
}
