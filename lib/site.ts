export const site = {
  name: "The AI Brief",
  tagline: "The week's AI advancements, explained in 5 minutes",
  description:
    "A weekly newsletter on AI advancements — from research papers to boardroom impact. Written for engineers, founders, and the tech-curious.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-brief.example.com",
  author: "Manas Mahanta",
  cadence: "Every Friday",
};

export const topics: Record<string, { label: string; blurb: string }> = {
  models: {
    label: "Models & Releases",
    blurb: "New frontier and open-weight models, benchmarks, and what actually changed.",
  },
  research: {
    label: "Research",
    blurb: "Papers that matter, translated into plain English with the 'so what'.",
  },
  tools: {
    label: "Tools",
    blurb: "Libraries, products, and workflows worth trying this week.",
  },
  business: {
    label: "Business & Strategy",
    blurb: "Funding, adoption, and what AI advancements mean for products and companies.",
  },
  policy: {
    label: "Policy & Safety",
    blurb: "Regulation, governance, and the safety debates shaping deployment.",
  },
};

export function topicLabel(tag: string): string {
  return topics[tag]?.label ?? tag;
}
