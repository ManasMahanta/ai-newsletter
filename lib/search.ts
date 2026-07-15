import { getAllIssues } from "@/lib/issues";
import { glossary, slugifyTerm } from "@/lib/glossary";
import { entryQA } from "@/lib/qa/entry";
import { midQA } from "@/lib/qa/mid";
import { seniorQA } from "@/lib/qa/senior";
import { leadershipQA } from "@/lib/qa/leadership";
import { systemDesignQA } from "@/lib/qa/system-design";
import type { QA } from "@/lib/qa/types";

export type SearchDoc = {
  title: string;
  snippet: string;
  url: string;
  kind: "Issue" | "Glossary" | "Interview Q&A" | "Page";
};

const snippet = (text: string, max = 160) =>
  text.replace(/\s+/g, " ").trim().slice(0, max);

const STATIC_PAGES: SearchDoc[] = [
  { title: "Radar", snippet: "Live pulse on AI: trending papers, tools, models, launches, and discussion.", url: "/radar", kind: "Page" },
  { title: "Agentic AI", snippet: "Everything on AI agents: research, frameworks, tools, and discussion.", url: "/agents", kind: "Page" },
  { title: "Interview Prep", snippet: "Gen AI interview prep by level, an AI coach, a prep planner, and live open roles.", url: "/interview-prep", kind: "Page" },
  { title: "AI Glossary", snippet: "Plain-English definitions of 100+ AI and LLM terms.", url: "/glossary", kind: "Page" },
  { title: "Model Tracker", snippet: "Current frontier and open-weight models, context windows, and pricing.", url: "/models", kind: "Page" },
  { title: "Issues archive", snippet: "Every past issue of Signal & Noise.", url: "/issues", kind: "Page" },
];

// Builds the full client-side search index from all static content. Called
// once, server-side, and serialized into the search page.
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [...STATIC_PAGES];

  for (const issue of getAllIssues()) {
    docs.push({
      title: issue.title,
      snippet: snippet(issue.summary || issue.content),
      url: `/issues/${issue.slug}`,
      kind: "Issue",
    });
  }

  for (const term of glossary) {
    docs.push({
      title: term.term,
      snippet: snippet(term.def),
      url: `/glossary/${slugifyTerm(term.term)}`,
      kind: "Glossary",
    });
  }

  const banks: [QA[], string, string][] = [
    [entryQA, "Entry level", "entry"],
    [midQA, "Mid level", "mid"],
    [seniorQA, "Senior / Staff", "senior"],
    [leadershipQA, "Leadership", "leadership"],
    [systemDesignQA, "System design", "system-design"],
  ];
  for (const [qa, label, anchor] of banks) {
    for (const item of qa) {
      docs.push({
        title: item.q,
        snippet: `${label} · ${snippet(item.a)}`,
        url: `/interview-prep#${anchor}`,
        kind: "Interview Q&A",
      });
    }
  }

  return docs;
}
