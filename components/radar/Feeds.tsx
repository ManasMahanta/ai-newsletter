// Shared live-feed renderers used by both the homepage and /radar.
// Each is an async server component; wrap in <Suspense> at the call site.

import RadarCard, { StatPill } from "@/components/radar/RadarCard";
import {
  formatCount,
  formatShortDate,
  getAgentDiscussions,
  getAgentLabPosts,
  getAgentLaunches,
  getAgentModels,
  getAgentPapers,
  getAgentReleases,
  getAgentRepos,
  getAgentSpaces,
  getFreshArxiv,
  getLabPosts,
  getLatestReleases,
  getMediumAgentPosts,
  getShowHNLaunches,
  getTopStories,
  getTrendingDatasets,
  getTrendingModels,
  getTrendingPapers,
  getTrendingRepos,
  getTrendingSpaces,
} from "@/lib/radar";

export function EmptyFeed() {
  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      Couldn&apos;t load this feed right now — check back soon.
    </p>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
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

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export async function PapersFeed({ limit = 8 }: { limit?: number }) {
  const papers = await getTrendingPapers(limit);
  if (papers.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function ArxivFeed({ limit = 8 }: { limit?: number }) {
  const papers = await getFreshArxiv(limit);
  if (papers.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function ReposFeed({ limit = 8 }: { limit?: number }) {
  const repos = await getTrendingRepos(limit);
  if (repos.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function ReleasesFeed() {
  const releases = await getLatestReleases();
  if (releases.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function ModelsFeed({ limit = 8 }: { limit?: number }) {
  const models = await getTrendingModels(limit);
  if (models.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function DatasetsFeed({ limit = 8 }: { limit?: number }) {
  const datasets = await getTrendingDatasets(limit);
  if (datasets.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function SpacesFeed({ limit = 8 }: { limit?: number }) {
  const spaces = await getTrendingSpaces(limit);
  if (spaces.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function LaunchesFeed({ limit = 8 }: { limit?: number }) {
  const launches = await getShowHNLaunches(limit);
  if (launches.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function StoriesFeed({ limit = 8 }: { limit?: number }) {
  const stories = await getTopStories(limit);
  if (stories.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function LabsFeed({ limit = 8 }: { limit?: number }) {
  const posts = await getLabPosts(limit);
  if (posts.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function MediumAgentFeed({ limit = 9 }: { limit?: number }) {
  const posts = await getMediumAgentPosts(limit);
  if (posts.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

// --- Agentic AI: every feed above, re-scoped to AI agents specifically ----

export async function AgentPapersFeed({ limit = 8 }: { limit?: number }) {
  const papers = await getAgentPapers(limit);
  if (papers.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function AgentReposFeed({ limit = 8 }: { limit?: number }) {
  const repos = await getAgentRepos(limit);
  if (repos.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function AgentReleasesFeed() {
  const releases = await getAgentReleases();
  if (releases.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function AgentModelsFeed({ limit = 8 }: { limit?: number }) {
  const models = await getAgentModels(limit);
  if (models.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function AgentSpacesFeed({ limit = 8 }: { limit?: number }) {
  const spaces = await getAgentSpaces(limit);
  if (spaces.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function AgentLaunchesFeed({ limit = 8 }: { limit?: number }) {
  const launches = await getAgentLaunches(limit);
  if (launches.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function AgentDiscussionsFeed({ limit = 8 }: { limit?: number }) {
  const stories = await getAgentDiscussions(limit);
  if (stories.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}

export async function AgentLabsFeed({ limit = 8 }: { limit?: number }) {
  const posts = await getAgentLabPosts(limit);
  if (posts.length === 0) return <EmptyFeed />;
  return (
    <Grid>
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
    </Grid>
  );
}
