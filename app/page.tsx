import Link from "next/link";
import { Suspense } from "react";
import SignupForm from "@/components/SignupForm";
import SignalCanvas from "@/components/cinematic/SignalCanvas";
import { Parallax, Reveal, SceneLabel } from "@/components/cinematic/Motion";
import {
  LabsFeed,
  LaunchesFeed,
  ModelsFeed,
  PapersFeed,
  ReposFeed,
  SkeletonGrid,
  StoriesFeed,
} from "@/components/radar/Feeds";
import { site } from "@/lib/site";

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
      {/* Scene 01 — The Noise: chaos behind, one clear promise in front */}
      <section className="relative -mx-5 flex min-h-[72vh] items-center overflow-hidden px-5">
        <SignalCanvas />
        <div className="glow-orb -top-24 -left-24 h-72 w-72 bg-indigo-500/25 dark:bg-indigo-500/20" />
        <div
          className="glow-orb -right-16 bottom-0 h-64 w-64 bg-violet-500/20 dark:bg-violet-500/15"
          style={{ animationDelay: "-8s" }}
        />
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

      {/* Scenes 02–07 — all live data, refreshed automatically */}
      <LiveScene
        scene="02 · The research"
        title="Trending papers"
        blurb="What researchers are upvoting right now, via Hugging Face Daily Papers."
        radarAnchor="papers"
      >
        <PapersFeed limit={4} />
      </LiveScene>

      <LiveScene
        scene="03 · The toolbox"
        title="Rising open-source tools"
        blurb="AI repos created in the last 30 days, ranked by stars."
        radarAnchor="tools"
      >
        <ReposFeed limit={4} />
      </LiveScene>

      <LiveScene
        scene="04 · The models"
        title="Hot models"
        blurb="What's trending on the Hugging Face Hub right now."
        radarAnchor="models"
      >
        <ModelsFeed limit={4} />
      </LiveScene>

      <LiveScene
        scene="05 · The launchpad"
        title="Fresh launches"
        blurb="AI projects shown on Hacker News in the past two weeks."
        radarAnchor="launches"
      >
        <LaunchesFeed limit={4} />
      </LiveScene>

      <LiveScene
        scene="06 · The conversation"
        title="What everyone's arguing about"
        blurb="Top AI stories on Hacker News from the past week."
        radarAnchor="conversation"
      >
        <StoriesFeed limit={4} />
      </LiveScene>

      <LiveScene
        scene="07 · The labs"
        title="Lab notes"
        blurb="Fresh posts from OpenAI, Google DeepMind, Google AI, and Hugging Face."
        radarAnchor="labs"
      >
        <LabsFeed limit={4} />
      </LiveScene>

      {/* Scene 08 — Lock On: the invitation */}
      <section className="relative overflow-hidden rounded-2xl bg-zinc-100 p-8 dark:bg-zinc-900">
        <div className="glow-orb -top-20 right-0 h-56 w-56 bg-indigo-500/20 dark:bg-indigo-500/15" />
        <Reveal className="relative">
          <SceneLabel>08 · Lock on</SceneLabel>
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
