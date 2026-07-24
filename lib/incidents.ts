// Live-fetched "Incident Log" — real, dated, sourced AI deployment failures
// and harms, pulled from the AI Incident Database (incidentdatabase.ai), a
// citation-backed public database run by the Responsible AI Collaborative.
// Unlike lib/case-studies.ts, these entries are NOT editorially written —
// they're the database's own record titles/excerpts, linked straight to the
// primary source. This is what lets the case-studies page reach "100+"
// entries and refresh automatically, without an LLM inventing a company's
// numbers: the raw feed does the growing, the hand-authored set does the
// editorial depth.

const FEED_URL = "https://incidentdatabase.ai/rss.xml";
const HOUR = 3600;

export type Incident = {
  title: string;
  snippet: string;
  url: string; // primary source (news outlet, company blog, court filing coverage)
  reportUrl: string; // the AI Incident Database's own record page, if present
  publishedAt: string; // ISO date, "" if unparseable
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

export async function getAiIncidents(limit = 100): Promise<Incident[]> {
  try {
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
        };
      })
      .filter((i) => i.title && i.title !== "No title" && i.url)
      .slice(0, limit);
  } catch {
    return [];
  }
}
