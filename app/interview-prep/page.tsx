import type { Metadata } from "next";
import { Suspense } from "react";
import RadarNav from "@/components/radar/RadarNav";
import RadarCard, { StatPill } from "@/components/radar/RadarCard";
import { EmptyFeed, SkeletonGrid } from "@/components/radar/Feeds";
import {
  formatCount,
  getInterviewRepos,
  getInterviewStories,
} from "@/lib/radar";
import { prepLevels, prepTips } from "@/lib/interview";
import QABank from "@/components/interview/QABank";
import type { QA } from "@/lib/qa/types";
import { entryQA } from "@/lib/qa/entry";
import { midQA } from "@/lib/qa/mid";
import { seniorQA } from "@/lib/qa/senior";
import { leadershipQA } from "@/lib/qa/leadership";
import { systemDesignQA } from "@/lib/qa/system-design";
import InterviewCoach from "@/components/interview/InterviewCoach";

const banks: Record<string, QA[]> = {
  entry: entryQA,
  mid: midQA,
  senior: seniorQA,
  leadership: leadershipQA,
};

export const metadata: Metadata = {
  title: "Interview Prep",
  description:
    "Interview preparation for Gen AI roles at every level — entry to leadership: core topics, real interview-style questions, what interviewers probe for, plus live prep resources and hiring discussions.",
};

const sections = [
  { id: "coach", label: "AI coach" },
  ...prepLevels.map((l) => ({ id: l.id, label: l.level })),
  { id: "system-design", label: "System design" },
  { id: "tips", label: "Ground rules" },
  { id: "resources", label: "Live resources" },
  { id: "hiring", label: "Hiring chatter" },
];

async function InterviewReposFeed() {
  const repos = await getInterviewRepos();
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

async function HiringStoriesFeed() {
  const stories = await getInterviewStories();
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

export default function InterviewPrepPage() {
  return (
    <div className="lg:relative lg:left-1/2 lg:w-[min(72rem,calc(100vw-4rem))] lg:-translate-x-1/2">
      <section className="pt-6">
        <h1 className="text-4xl font-bold tracking-tight">Interview Prep</h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Preparing for Gen AI roles, level by level — what to study, the
          questions you&apos;ll actually face, and what interviewers are really
          probing for. Live resources at the bottom refresh automatically.
        </p>
      </section>

      <div className="mt-8 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start lg:gap-12">
        <aside className="sticky top-0 z-20 -mx-5 border-b border-zinc-200 bg-white/90 px-5 py-2.5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 lg:top-8 lg:z-auto lg:mx-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <RadarNav sections={sections} />
        </aside>

        <div className="mt-8 flex flex-col gap-14 lg:mt-0">
          <section id="coach" className="scroll-mt-24 lg:scroll-mt-8">
            <InterviewCoach />
          </section>
          {prepLevels.map((l) => (
            <section
              key={l.id}
              id={l.id}
              className="flex scroll-mt-24 flex-col gap-6 lg:scroll-mt-8"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{l.level}</h2>
                <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {l.roles}
                </p>
                <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
                  {l.summary}
                </p>
              </div>

              <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-5 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                  What interviewers are really probing for
                </h3>
                <p className="mt-1.5 text-sm text-indigo-900/80 dark:text-indigo-100/80">
                  {l.lookFor}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white/65 p-5 dark:border-zinc-800 dark:bg-zinc-950/55">
                <h3 className="font-semibold">Core topics</h3>
                <ul className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2 dark:text-zinc-400">
                  {l.topics.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500"
                        aria-hidden="true"
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">
                  Q&amp;A bank — tap a question for the model answer
                </h3>
                <QABank items={banks[l.id] ?? []} bankId={l.id} />
              </div>
            </section>
          ))}

          <section
            id="system-design"
            className="flex scroll-mt-24 flex-col gap-6 lg:scroll-mt-8"
          >
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                System design: Gen AI &amp; Agentic AI
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Full design walkthroughs — RAG platforms, agents with real
                permissions, serving at scale, evals-as-CI, and the autonomy
                framework that answers half the agentic questions you&apos;ll
                get.
              </p>
            </div>
            <QABank items={systemDesignQA} bankId="system-design" />
          </section>

          <section
            id="tips"
            className="flex scroll-mt-24 flex-col gap-6 lg:scroll-mt-8"
          >
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Ground rules, every level
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                The advice that doesn&apos;t change with seniority.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {prepTips.map((t) => (
                <div
                  key={t.title}
                  className="rounded-xl border border-zinc-200 bg-white/65 p-5 dark:border-zinc-800 dark:bg-zinc-950/55"
                >
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                    {t.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="resources"
            className="flex scroll-mt-24 flex-col gap-6 lg:scroll-mt-8"
          >
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Live prep resources
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                The most-starred LLM interview-prep repos on GitHub, refreshed
                automatically.
              </p>
            </div>
            <Suspense fallback={<SkeletonGrid />}>
              <InterviewReposFeed />
            </Suspense>
          </section>

          <section
            id="hiring"
            className="flex scroll-mt-24 flex-col gap-6 lg:scroll-mt-8"
          >
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Hiring chatter
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                What Hacker News is saying about AI hiring and interviews, from
                the past three months.
              </p>
            </div>
            <Suspense fallback={<SkeletonGrid />}>
              <HiringStoriesFeed />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
}
