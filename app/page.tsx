import Link from "next/link";
import { Suspense } from "react";
import SignupForm from "@/components/SignupForm";
import IssueCard from "@/components/IssueCard";
import RadarCard, { StatPill } from "@/components/radar/RadarCard";
import SignalCanvas from "@/components/cinematic/SignalCanvas";
import { Parallax, Reveal, SceneLabel } from "@/components/cinematic/Motion";
import { getAllIssues } from "@/lib/issues";
import { formatCount, getTrendingPapers, getTrendingRepos } from "@/lib/radar";
import { site, topics } from "@/lib/site";

async function RadarTeaser() {
  const [papers, repos] = await Promise.all([
    getTrendingPapers(2),
    getTrendingRepos(2),
  ]);
  if (papers.length === 0 && repos.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {papers.map((p) => (
        <RadarCard
          key={p.id}
          href={p.url}
          title={p.title}
          eyebrow="Trending paper"
          stats={<StatPill>▲ {formatCount(p.upvotes)} upvotes</StatPill>}
        />
      ))}
      {repos.map((r) => (
        <RadarCard
          key={r.fullName}
          href={r.url}
          title={r.fullName}
          eyebrow="Rising tool"
          stats={<StatPill>★ {formatCount(r.stars)}</StatPill>}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const latest = getAllIssues().slice(0, 3);

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
              what actually advanced, why it matters, and what to do about it.
            </p>
            <SignupForm />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Not sure yet?{" "}
              <Link
                href="/start-here"
                className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
              >
                Read a sample issue first →
              </Link>
            </p>
          </div>
        </Parallax>
      </section>

      {/* Scene 02 — The Signal: what the filter produces */}
      <section>
        <Reveal>
          <SceneLabel>02 · The signal</SceneLabel>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            What&apos;s in every issue
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "TL;DR in 3 bullets",
              body: "The week's most important developments up top. Skim it in 30 seconds if that's all you have.",
            },
            {
              title: "One big story, two angles",
              body: "The advancement that matters most, explained for builders and for business — explicitly.",
            },
            {
              title: "Research, translated",
              body: "1–2 papers in plain English, always with the 'so what'. No arXiv account required.",
            },
            {
              title: "Something to use today",
              body: "A tool worth trying and one practical tip or prompt you can apply the same day.",
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <div className="h-full rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <blockquote className="mt-8 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <p className="text-sm italic text-zinc-600 dark:text-zinc-400">
              “The only AI newsletter I actually finish. The TL;DR respects my
              time and the deep dives respect my intelligence.”
            </p>
            <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              — An early reader (your testimonial here soon)
            </p>
          </blockquote>
        </Reveal>
      </section>

      {/* Scene 03 — The Spectrum: the frequencies we tune into */}
      <section>
        <Reveal>
          <SceneLabel>03 · The spectrum</SceneLabel>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">Coverage</h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.entries(topics).map(([tag, t]) => (
              <Link
                key={tag}
                href={`/topics/${tag}`}
                className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Scene 04 — The Archive: proof of the filter, week after week */}
      <section>
        <Reveal>
          <div className="flex items-baseline justify-between">
            <div>
              <SceneLabel>04 · The archive</SceneLabel>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                Latest issues
              </h2>
            </div>
            <Link
              href="/issues"
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View all →
            </Link>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4">
          {latest.map((issue, i) => (
            <Reveal key={issue.slug} delay={i * 90}>
              <IssueCard issue={issue} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Scene 05 — The Live Feed: the radar, always sweeping */}
      <section>
        <Reveal>
          <div className="flex items-baseline justify-between">
            <div>
              <SceneLabel>05 · The live feed</SceneLabel>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                On the radar
              </h2>
            </div>
            <Link
              href="/radar"
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              See the full radar →
            </Link>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Live between issues: trending papers, tools, models, and debates.
          </p>
        </Reveal>
        <div className="mt-6">
          <Suspense
            fallback={
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                  />
                ))}
              </div>
            }
          >
            <RadarTeaser />
          </Suspense>
        </div>
      </section>

      {/* Scene 06 — Lock On: the invitation */}
      <section className="relative overflow-hidden rounded-2xl bg-zinc-100 p-8 dark:bg-zinc-900">
        <div className="glow-orb -top-20 right-0 h-56 w-56 bg-indigo-500/20 dark:bg-indigo-500/15" />
        <Reveal className="relative">
          <SceneLabel>06 · Lock on</SceneLabel>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            Stay ahead of AI, 5 minutes a week
          </h2>
          <p className="mt-2 mb-5 max-w-xl text-zinc-600 dark:text-zinc-400">
            Join readers from engineering, product, and the exec floor.{" "}
            {site.cadence}, free, unsubscribe anytime.
          </p>
          <SignupForm />
        </Reveal>
      </section>
    </div>
  );
}
