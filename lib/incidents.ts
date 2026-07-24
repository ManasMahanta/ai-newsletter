// Live-fetched "Incident Log" — real, dated, sourced AI deployment failures
// and harms, pulled from the AI Incident Database (incidentdatabase.ai), a
// citation-backed public database run by the Responsible AI Collaborative.
// Unlike lib/case-studies.ts, these entries are NOT editorially written —
// they're the database's own record titles/excerpts, linked straight to the
// primary source. This is what lets the case-studies page reach "100+"
// entries and refresh automatically, without an LLM inventing a company's
// numbers: the raw feed does the growing, the hand-authored set does the
// editorial depth.

import { caseStudies } from "@/lib/case-studies";

const FEED_URL = "https://incidentdatabase.ai/rss.xml";
const HOUR = 3600;

export type Incident = {
  title: string;
  snippet: string;
  url: string; // primary source (news outlet, company blog, court filing coverage)
  reportUrl: string; // the AI Incident Database's own record page, if present
  publishedAt: string; // ISO date, "" if unparseable
  domain: string; // best-guess category, from title/snippet keywords
};

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

const CITE_RE = /(https:\/\/incidentdatabase\.ai\/cite\/\d+(?:#\d+)?)/;

// --- Best-guess domain tagging (keyword heuristic, not authoritative) -----

const DOMAIN_KEYWORDS: [string, RegExp][] = [
  ["Healthcare & Pharma", /\b(health|hospital|patient|medical|clinic|doctor|pharma|diagnos)/i],
  ["Automotive & Mobility", /\b(self-driving|autonomous vehicle|robotaxi|waymo|cruise|tesla|driverless)/i],
  ["Government", /\b(government|police|welfare|immigration|court order|regulator|federal agency|military)/i],
  ["Legal Services", /\b(lawsuit|lawyer|attorney|judge|litigation|sanctioned|court)/i],
  ["Finance & Legal Ops", /\b(bank|loan|credit score|fraud detection|trading|invest(or|ment))/i],
  ["Cybersecurity", /\b(security|hack|breach|malware|vulnerabilit|cyberattack)/i],
  ["HR & Recruiting", /\b(hiring|recruit(ing|er|ment)|resume|job applicant)/i],
  ["Media & Journalism", /\b(news(paper|room)?|journalis|article|publish(ed|er))/i],
  ["Education", /\b(school|student|university|classroom|teacher)/i],
  ["Retail & Supply Chain", /\b(warehouse|e-commerce|retailer|supply chain|amazon)/i],
  ["Customer Service", /\b(chatbot|customer service|support agent|virtual assistant)/i],
  ["Software Engineering", /\b(developer|github|copilot|source code|coding agent)/i],
  ["Social Media & Platforms", /\b(social media|platform|content moderation|deepfake|misinformation)/i],
];

function guessDomain(text: string): string {
  for (const [domain, re] of DOMAIN_KEYWORDS) {
    if (re.test(text)) return domain;
  }
  return "Uncategorized";
}

// --- Dedup against the hand-authored Editor's Picks -----------------------
// A live record is hidden if it mentions BOTH a case study's organization
// AND one of that case study's distinctive slug keywords — a deliberately
// conservative AND, so a passing mention of "Amazon" alone never hides an
// unrelated record.

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const WATCHLIST = caseStudies.map((cs) => {
  const org = cs.org.toLowerCase().split(/[×(·]/)[0].trim();
  const keywords = cs.slug.split("-").filter((w) => w.length > 4);
  return {
    orgRe: new RegExp(`\\b${escapeRe(org)}\\b`, "i"),
    keywordRes: keywords.map((k) => new RegExp(`\\b${escapeRe(k)}\\b`, "i")),
  };
});

function isDuplicateOfCaseStudy(text: string): boolean {
  return WATCHLIST.some(
    (w) => w.orgRe.test(text) && w.keywordRes.some((k) => k.test(text)),
  );
}

async function fetchIncidents(): Promise<Incident[]> {
  const res = await fetch(FEED_URL, {
    next: { revalidate: 3 * HOUR },
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SignalNoiseCaseStudies/1.0)" },
  });
  if (!res.ok) throw new Error(`${FEED_URL} responded ${res.status}`);
  const xml = await res.text();

  return xmlBlocks(xml, "item")
    .map((item) => {
      const title = xmlText(item, "title");
      const rawDesc = xmlText(item, "description");
      const citeMatch = rawDesc.match(CITE_RE);
      const snippet = rawDesc.replace(CITE_RE, "").replace(/\(\s*\)\s*$/, "").trim();
      const url = xmlText(item, "link");
      const date = new Date(xmlText(item, "pubDate"));
      return {
        title,
        snippet,
        url,
        reportUrl: citeMatch?.[1] ?? "",
        publishedAt: Number.isNaN(date.getTime()) ? "" : date.toISOString(),
        domain: guessDomain(`${title} ${snippet}`),
      };
    })
    .filter((i) => i.title && i.title !== "No title" && i.url)
    .filter((i) => !isDuplicateOfCaseStudy(`${i.title} ${i.snippet}`));
}

export async function getAiIncidents(limit = 100): Promise<Incident[]> {
  try {
    const incidents = await fetchIncidents();
    return incidents.slice(0, limit);
  } catch {
    return [];
  }
}
