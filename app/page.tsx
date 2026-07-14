import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import IssueCard from "@/components/IssueCard";
import { getAllIssues } from "@/lib/issues";
import { site, topics } from "@/lib/site";

export default function HomePage() {
  const latest = getAllIssues().slice(0, 3);

  return (
    <div className="flex flex-col gap-16">
      {/* Hero */}
      <section className="flex flex-col items-start gap-5 pt-6">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {site.tagline} —{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            from research papers to boardroom impact
          </span>
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          One email, {site.cadence.toLowerCase()}. What actually advanced in AI
          this week, why it matters, and what to do about it — whether you ship
          code, ship products, or set strategy.
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
      </section>

      {/* Social proof */}
      <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <p className="text-sm italic text-zinc-600 dark:text-zinc-400">
          “The only AI newsletter I actually finish. The TL;DR respects my time
          and the deep dives respect my intelligence.”
        </p>
        <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          — An early reader (your testimonial here soon)
        </p>
      </section>

      {/* What you get */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight">
          What&apos;s in every issue
        </h2>
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
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight">Coverage</h2>
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
      </section>

      {/* Latest issues */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Latest issues</h2>
          <Link
            href="/issues"
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-4">
          {latest.map((issue) => (
            <IssueCard key={issue.slug} issue={issue} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-2xl bg-zinc-100 p-8 dark:bg-zinc-900">
        <h2 className="text-2xl font-bold tracking-tight">
          Stay ahead of AI, 5 minutes a week
        </h2>
        <p className="mt-2 mb-5 max-w-xl text-zinc-600 dark:text-zinc-400">
          Join readers from engineering, product, and the exec floor.{" "}
          {site.cadence}, free, unsubscribe anytime.
        </p>
        <SignupForm />
      </section>
    </div>
  );
}
