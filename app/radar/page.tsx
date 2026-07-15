import type { Metadata } from "next";
import { Suspense } from "react";
import RadarNav from "@/components/radar/RadarNav";
import {
  ArxivFeed,
  DatasetsFeed,
  LabsFeed,
  LaunchesFeed,
  ModelsFeed,
  PapersFeed,
  ReleasesFeed,
  ReposFeed,
  SkeletonGrid,
  SpacesFeed,
  StoriesFeed,
} from "@/components/radar/Feeds";

export const metadata: Metadata = {
  title: "Radar",
  description:
    "A live pulse on AI: trending research, fast-rising open-source tools, hot models and datasets, live demos, launches, releases, and the discussions everyone is having. Auto-refreshed throughout the day.",
};

const sections = [
  { id: "papers", label: "Trending papers" },
  { id: "arxiv", label: "Fresh from arXiv" },
  { id: "tools", label: "Rising tools" },
  { id: "releases", label: "Release watch" },
  { id: "models", label: "Hot models" },
  { id: "datasets", label: "Datasets" },
  { id: "spaces", label: "Try it live" },
  { id: "launches", label: "Launches" },
  { id: "conversation", label: "The conversation" },
  { id: "labs", label: "Lab notes" },
];

function RadarSection({
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

export default function RadarPage() {
  return (
    <div className="lg:relative lg:left-1/2 lg:w-[min(72rem,calc(100vw-4rem))] lg:-translate-x-1/2">
      <section className="pt-6">
        <h1 className="text-4xl font-bold tracking-tight">Radar</h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          A live pulse on AI, between issues: what researchers are reading, what
          builders are shipping, and what everyone is arguing about.
          Auto-refreshes throughout the day.
        </p>
      </section>

      <div className="mt-8 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start lg:gap-12">
        <aside className="sticky top-0 z-20 -mx-5 border-b border-zinc-200 bg-white/90 px-5 py-2.5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 lg:top-8 lg:z-auto lg:mx-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <RadarNav sections={sections} />
        </aside>

        <div className="mt-8 flex flex-col gap-14 lg:mt-0">
          <RadarSection
            id="papers"
            title="Trending papers"
            subtitle="Community-upvoted research from Hugging Face Daily Papers."
          >
            <PapersFeed />
          </RadarSection>

          <RadarSection
            id="arxiv"
            title="Fresh from arXiv"
            subtitle="The newest submissions in cs.AI, cs.LG, and cs.CL — raw and uncurated."
          >
            <ArxivFeed />
          </RadarSection>

          <RadarSection
            id="tools"
            title="Rising open-source tools"
            subtitle="AI repos created in the last 30 days, ranked by stars."
          >
            <ReposFeed />
          </RadarSection>

          <RadarSection
            id="releases"
            title="Release watch"
            subtitle="Latest releases from the infrastructure everyone builds on."
          >
            <ReleasesFeed />
          </RadarSection>

          <RadarSection
            id="models"
            title="Hot models"
            subtitle="What's trending on the Hugging Face Hub right now."
          >
            <ModelsFeed />
          </RadarSection>

          <RadarSection
            id="datasets"
            title="Trending datasets"
            subtitle="What the community is training and evaluating on."
          >
            <DatasetsFeed />
          </RadarSection>

          <RadarSection
            id="spaces"
            title="Try it live"
            subtitle="Trending Spaces — AI demos you can run in the browser right now."
          >
            <SpacesFeed />
          </RadarSection>

          <RadarSection
            id="launches"
            title="Launches"
            subtitle="AI projects shown on Hacker News in the past two weeks."
          >
            <LaunchesFeed />
          </RadarSection>

          <RadarSection
            id="conversation"
            title="The conversation"
            subtitle="Top AI stories on Hacker News from the past week."
          >
            <StoriesFeed />
          </RadarSection>

          <RadarSection
            id="labs"
            title="Lab notes"
            subtitle="Fresh posts from OpenAI, Google DeepMind, Google AI, and Hugging Face."
          >
            <LabsFeed />
          </RadarSection>
        </div>
      </div>
    </div>
  );
}
