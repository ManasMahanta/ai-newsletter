import Link from "next/link";
import { Suspense } from "react";
import SignupForm from "@/components/SignupForm";
import SignalCanvas from "@/components/cinematic/SignalCanvas";
import { Parallax, Reveal, SceneLabel } from "@/components/cinematic/Motion";
import RadarCard, { StatPill } from "@/components/radar/RadarCard";
import Highlights from "@/components/radar/Highlights";
import {
  LabsFeed,
  LaunchesFeed,
  ModelsFeed,
  PapersFeed,
  ReposFeed,
  SkeletonGrid,
  StoriesFeed,
} from "@/components/radar/Feeds";
import {
  formatCount,
  getAgentPapers,
  getAgentRepos,
} from "@/lib/radar";
import { site } from "@/lib/site";

async function AgenticTeaser() {
  const [papers, repos] = await Promise.all([
    getAgentPapers(2),
    getAgentRepos(2),
  ]);
  if (papers.length === 0 && repos.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {papers.map((p) => (
        <RadarCard
          key={p.id}
          href={p.url}
          title={p.title}
          eyebrow="Agent research"
          description={p.summary}
          stats={<StatPill>arXiv {p.id}</StatPill>}
        />
      ))}
      {repos.map((r) => (
        <RadarCard
          key={r.fullName}
          href={r.url}
          title={r.fullName}
          eyebrow="Agent framework"
          description={r.description}
          stats={<StatPill>★ {formatCount(r.stars)}</StatPill>}
        />
      ))}
    </div>
  );
}

function LiveScene({
  scene,
  title,
  blurb,
  radarAnchor,
  children,
}: {
  scene: string;
  title: string;
  blurb: string;
  radarAnchor: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <Reveal>
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <SceneLabel>{scene}</SceneLabel>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">{title}</h2>
          </div>
          <Link
            href={`/radar#${radarAnchor}`}
            className="shrink-0 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            More →
          </Link>
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{blurb}</p>
      </Reveal>
      <div className="mt-6">
        <Suspense fallback={<SkeletonGrid />}>{children}</Suspense>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24">
      {/* Scene 01 — The Noise: chaos behind, one clear promise in front.
          No local glows or hard edges — the canvas fades into the site
          backdrop so the scene reads as part of the same environment. */}
      <section className="relative -mx-5 flex min-h-[72vh] items-center px-5">
        <SignalCanvas />
        <Parallax speed={0.08} className="relative">
          <div className="flex max-w-2xl flex-col items-start gap-5">
            <SceneLabel>01 · The noise</SceneLabel>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Every week, AI produces a thousand headlines.{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Maybe five matter.
              </span>
            </h1>
            <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              {site.name} finds them. One email, {site.cadence.toLowerCase()} —
              plus the live radar below, sweeping the field all day, every day.
            </p>
            <SignupForm />
          </div>
        </Parallax>
      </section>

      {/* Scene 02 — the digest: #1 item from every feed, one glance */}
      <section>
        <Reveal>
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <SceneLabel>02 · The brief</SceneLabel>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                Highlights
              </h2>
            </div>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            The single strongest signal from each feed right now —
            auto-compiled, refreshed all day.
          </p>
        </Reveal>
        <div className="mt-6">
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900" />
            }
          >
            <Highlights />
          </Suspense>
        </div>
      </section>

      {/* Scenes 03–09 — all live data, refreshed automatically */}
      <LiveScene
        scene="03 · The research"
        title="Trending papers"
        blurb="What researchers are upvoting right now, via Hugging Face Daily Papers."
        radarAnchor="papers"
      >
        <PapersFeed limit={4} />
      </LiveScene>

      <LiveScene
        scene="04 · The toolbox"
        title="Rising open-source tools"
        blurb="AI repos created in the last 30 days, ranked by stars."
        radarAnchor="tools"
      >
        <ReposFeed limit={4} />
      </LiveScene>

      {/* Flagship scene — its own dedicated section on /radar with 8 sub-feeds */}
      <section>
        <Reveal>
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <SceneLabel>05 · The agents</SceneLabel>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                Agentic AI
              </h2>
            </div>
            <Link
              href="/agents"
              className="shrink-0 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Explore agentic AI →
            </Link>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Research, frameworks, models, and launches — everything driving
            agentic systems forward, refreshed all day.
          </p>
        </Reveal>
        <div className="mt-6">
          <Suspense fallback={<SkeletonGrid />}>
            <AgenticTeaser />
          </Suspense>
        </div>
      </section>

      <LiveScene
        scene="06 · The models"
        title="Hot models"
        blurb="What's trending on the Hugging Face Hub right now."
        radarAnchor="models"
      >
        <ModelsFeed limit={4} />
      </LiveScene>

      <LiveScene
        scene="07 · The launchpad"
        title="Fresh launches"
        blurb="AI projects shown on Hacker News in the past two weeks."
        radarAnchor="launches"
      >
        <LaunchesFeed limit={4} />
      </LiveScene>

      <LiveScene
        scene="08 · The conversation"
        title="What everyone's arguing about"
        blurb="Top AI stories on Hacker News from the past week."
        radarAnchor="conversation"
      >
        <StoriesFeed limit={4} />
      </LiveScene>

      <LiveScene
        scene="09 · The labs"
        title="Lab notes"
        blurb="Fresh posts from OpenAI, Google DeepMind, Google AI, and Hugging Face."
        radarAnchor="labs"
      >
        <LabsFeed limit={4} />
      </LiveScene>

      {/* Scene 09 — Lock On: the invitation */}
      <section className="relative overflow-hidden rounded-2xl bg-zinc-100 p-8 dark:bg-zinc-900">
        <div className="glow-orb -top-20 right-0 h-56 w-56 bg-indigo-500/20 dark:bg-indigo-500/15" />
        <Reveal className="relative">
          <SceneLabel>10 · Lock on</SceneLabel>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            The signal, delivered — 5 minutes a week
          </h2>
          <p className="mt-2 mb-5 max-w-xl text-zinc-600 dark:text-zinc-400">
            The radar sweeps all day; the newsletter distills what mattered.{" "}
            {site.cadence}, free, unsubscribe anytime.
          </p>
          <SignupForm />
        </Reveal>
      </section>
    </div>
  );
}
