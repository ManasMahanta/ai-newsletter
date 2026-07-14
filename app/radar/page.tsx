import type { Metadata } from "next";
import { Suspense } from "react";
import RadarCard, { StatPill } from "@/components/radar/RadarCard";
import RadarNav from "@/components/radar/RadarNav";
import {
  formatCount,
  formatShortDate,
  getFreshArxiv,
  getLabPosts,
  getLatestReleases,
  getShowHNLaunches,
  getTopStories,
  getTrendingDatasets,
  getTrendingModels,
  getTrendingPapers,
  getTrendingRepos,
  getTrendingSpaces,
} from "@/lib/radar";

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

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
    </div>
  );
}

function EmptyFeed() {
  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      Couldn&apos;t load this feed right now — check back soon.
    </p>
  );
}

function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-36 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        />
      ))}
    </div>
  );
}

async function TrendingPapers() {
  const papers = await getTrendingPapers();
  if (papers.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {papers.map((p) => (
        <RadarCard
          key={p.id}
          href={p.url}
          title={p.title}
          description={p.summary}
          stats={<StatPill>▲ {formatCount(p.upvotes)} upvotes</StatPill>}
          secondaryLink={{
            href: `https://arxiv.org/abs/${p.id}`,
            label: "arXiv →",
          }}
        />
      ))}
    </div>
  );
}

async function FreshArxiv() {
  const papers = await getFreshArxiv();
  if (papers.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {papers.map((p) => (
        <RadarCard
          key={p.id}
          href={p.url}
          title={p.title}
          eyebrow={formatShortDate(p.published)}
          description={p.summary}
          stats={<StatPill>arXiv {p.id}</StatPill>}
        />
      ))}
    </div>
  );
}

async function TrendingRepos() {
  const repos = await getTrendingRepos();
  if (repos.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {repos.map((r) => (
        <RadarCard
          key={r.fullName}
          href={r.url}
          title={r.fullName}
          description={r.description}
          stats={
            <>
              <StatPill>★ {formatCount(r.stars)}</StatPill>
              {r.language && <StatPill>{r.language}</StatPill>}
            </>
          }
        />
      ))}
    </div>
  );
}

async function ReleaseWatch() {
  const releases = await getLatestReleases();
  if (releases.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {releases.map((r) => (
        <RadarCard
          key={r.repo}
          href={r.url}
          title={`${r.repo.split("/")[1]} ${r.tag}`}
          eyebrow={r.repo}
          description={r.name !== r.tag ? r.name : undefined}
          stats={<StatPill>released {formatShortDate(r.publishedAt)}</StatPill>}
        />
      ))}
    </div>
  );
}

async function TrendingModels() {
  const models = await getTrendingModels();
  if (models.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {models.map((m) => (
        <RadarCard
          key={m.id}
          href={m.url}
          title={m.id}
          eyebrow={m.pipelineTag || undefined}
          stats={
            <>
              <StatPill>♥ {formatCount(m.likes)}</StatPill>
              <StatPill>⬇ {formatCount(m.downloads)} downloads</StatPill>
            </>
          }
        />
      ))}
    </div>
  );
}

async function TrendingDatasets() {
  const datasets = await getTrendingDatasets();
  if (datasets.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {datasets.map((d) => (
        <RadarCard
          key={d.id}
          href={d.url}
          title={d.id}
          stats={
            <>
              <StatPill>♥ {formatCount(d.likes)}</StatPill>
              <StatPill>⬇ {formatCount(d.downloads)} downloads</StatPill>
            </>
          }
        />
      ))}
    </div>
  );
}

async function TrendingSpaces() {
  const spaces = await getTrendingSpaces();
  if (spaces.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {spaces.map((s) => (
        <RadarCard
          key={s.id}
          href={s.url}
          title={s.id}
          eyebrow="Live demo"
          stats={
            <>
              <StatPill>♥ {formatCount(s.likes)}</StatPill>
              {s.sdk && <StatPill>{s.sdk}</StatPill>}
            </>
          }
        />
      ))}
    </div>
  );
}

async function ShowHNLaunches() {
  const launches = await getShowHNLaunches();
  if (launches.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {launches.map((s) => (
        <RadarCard
          key={s.hnUrl}
          href={s.url}
          title={s.title}
          eyebrow="Show HN"
          stats={
            <StatPill>
              {formatCount(s.points)} points · {formatCount(s.comments)} comments
            </StatPill>
          }
          secondaryLink={{ href: s.hnUrl, label: "Discussion →" }}
        />
      ))}
    </div>
  );
}

async function TopStories() {
  const stories = await getTopStories();
  if (stories.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stories.map((s) => (
        <RadarCard
          key={s.hnUrl}
          href={s.url}
          title={s.title}
          stats={
            <StatPill>
              {formatCount(s.points)} points · {formatCount(s.comments)} comments
            </StatPill>
          }
          secondaryLink={{ href: s.hnUrl, label: "Discussion →" }}
        />
      ))}
    </div>
  );
}

async function LabNotes() {
  const posts = await getLabPosts();
  if (posts.length === 0) return <EmptyFeed />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {posts.map((p) => (
        <RadarCard
          key={p.url}
          href={p.url}
          title={p.title}
          eyebrow={p.source}
          stats={
            p.publishedAt ? (
              <StatPill>{formatShortDate(p.publishedAt)}</StatPill>
            ) : null
          }
        />
      ))}
    </div>
  );
}

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
      <SectionHeading title={title} subtitle={subtitle} />
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
        <TrendingPapers />
      </RadarSection>

      <RadarSection
        id="arxiv"
        title="Fresh from arXiv"
        subtitle="The newest submissions in cs.AI, cs.LG, and cs.CL — raw and uncurated."
      >
        <FreshArxiv />
      </RadarSection>

      <RadarSection
        id="tools"
        title="Rising open-source tools"
        subtitle="AI repos created in the last 30 days, ranked by stars."
      >
        <TrendingRepos />
      </RadarSection>

      <RadarSection
        id="releases"
        title="Release watch"
        subtitle="Latest releases from the infrastructure everyone builds on."
      >
        <ReleaseWatch />
      </RadarSection>

      <RadarSection
        id="models"
        title="Hot models"
        subtitle="What's trending on the Hugging Face Hub right now."
      >
        <TrendingModels />
      </RadarSection>

      <RadarSection
        id="datasets"
        title="Trending datasets"
        subtitle="What the community is training and evaluating on."
      >
        <TrendingDatasets />
      </RadarSection>

      <RadarSection
        id="spaces"
        title="Try it live"
        subtitle="Trending Spaces — AI demos you can run in the browser right now."
      >
        <TrendingSpaces />
      </RadarSection>

      <RadarSection
        id="launches"
        title="Launches"
        subtitle="AI projects shown on Hacker News in the past two weeks."
      >
        <ShowHNLaunches />
      </RadarSection>

      <RadarSection
        id="conversation"
        title="The conversation"
        subtitle="Top AI stories on Hacker News from the past week."
      >
        <TopStories />
      </RadarSection>

      <RadarSection
        id="labs"
        title="Lab notes"
        subtitle="Fresh posts from OpenAI, Google DeepMind, Google AI, and Hugging Face."
      >
        <LabNotes />
      </RadarSection>
        </div>
      </div>
    </div>
  );
}
