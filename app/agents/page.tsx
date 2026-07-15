import type { Metadata } from "next";
import { Suspense } from "react";
import RadarNav from "@/components/radar/RadarNav";
import {
  AgentDiscussionsFeed,
  AgentLabsFeed,
  AgentLaunchesFeed,
  AgentModelsFeed,
  AgentPapersFeed,
  AgentReleasesFeed,
  AgentReposFeed,
  AgentSpacesFeed,
  SkeletonGrid,
} from "@/components/radar/Feeds";

export const metadata: Metadata = {
  title: "Agentic AI",
  description:
    "A live pulse on agentic AI: agent research, frameworks, releases, models, demos, launches, and the discussions shaping autonomous systems. Auto-refreshed throughout the day.",
};

const sections = [
  { id: "research", label: "Research" },
  { id: "frameworks", label: "Frameworks & tools" },
  { id: "releases", label: "Release watch" },
  { id: "models", label: "Models" },
  { id: "demos", label: "Try it live" },
  { id: "launches", label: "Launches" },
  { id: "conversation", label: "The conversation" },
  { id: "labs", label: "Lab notes" },
];

function AgentSection({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-6 lg:scroll-mt-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>
      <Suspense fallback={<SkeletonGrid />}>{children}</Suspense>
    </section>
  );
}

export default function AgentsPage() {
  return (
    <div className="lg:relative lg:left-1/2 lg:w-[min(72rem,calc(100vw-4rem))] lg:-translate-x-1/2">
      <section className="pt-6">
        <h1 className="text-4xl font-bold tracking-tight">Agentic AI</h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          The fastest-moving corner of AI, tracked live: the research,
          frameworks, models, and launches driving autonomous systems forward.
          Auto-refreshes throughout the day.
        </p>
      </section>

      <div className="mt-8 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start lg:gap-12">
        <aside className="sticky top-0 z-20 -mx-5 border-b border-zinc-200 bg-white/90 px-5 py-2.5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 lg:top-8 lg:z-auto lg:mx-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <RadarNav sections={sections} />
        </aside>

        <div className="mt-8 flex flex-col gap-14 lg:mt-0">
          <AgentSection
            id="research"
            title="Research"
            subtitle="Title-anchored arXiv search, so results are actually about agents."
          >
            <AgentPapersFeed />
          </AgentSection>

          <AgentSection
            id="frameworks"
            title="Frameworks & tools"
            subtitle="Repos tagged ai-agents on GitHub, active in the last 60 days."
          >
            <AgentReposFeed />
          </AgentSection>

          <AgentSection
            id="releases"
            title="Release watch"
            subtitle="Latest releases from the agent frameworks most people build on."
          >
            <AgentReleasesFeed />
          </AgentSection>

          <AgentSection
            id="models"
            title="Models"
            subtitle="Trending agent-oriented models on the Hugging Face Hub."
          >
            <AgentModelsFeed />
          </AgentSection>

          <AgentSection
            id="demos"
            title="Try it live"
            subtitle="Trending agent Spaces you can run in the browser right now."
          >
            <AgentSpacesFeed />
          </AgentSection>

          <AgentSection
            id="launches"
            title="Launches"
            subtitle="Agent projects shown on Hacker News in the past two weeks."
          >
            <AgentLaunchesFeed />
          </AgentSection>

          <AgentSection
            id="conversation"
            title="The conversation"
            subtitle="Top Hacker News discussions specifically about AI agents."
          >
            <AgentDiscussionsFeed />
          </AgentSection>

          <AgentSection
            id="labs"
            title="Lab notes"
            subtitle="Lab blog posts whose titles mention agents."
          >
            <AgentLabsFeed />
          </AgentSection>
        </div>
      </div>
    </div>
  );
}
