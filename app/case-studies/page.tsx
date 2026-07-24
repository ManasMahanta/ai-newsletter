import type { Metadata } from "next";
import { Suspense } from "react";
import CaseStudyList from "@/components/CaseStudyList";
import IncidentLog from "@/components/IncidentLog";
import { caseStudies } from "@/lib/case-studies";
import { getAiIncidents } from "@/lib/incidents";

export const metadata: Metadata = {
  title: "AI Case Studies",
  description:
    "Real, named, sourced deployments of AI and agentic AI across industries — finance, healthcare, retail, legal, manufacturing, and more — with an honest verdict on what actually held up, plus a live-updating incident log.",
};

async function IncidentLogSection() {
  const incidents = await getAiIncidents(100);
  if (incidents.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Couldn&apos;t load the live incident log right now — check back soon.
      </p>
    );
  }
  return <IncidentLog incidents={incidents} />;
}

export default function CaseStudiesPage() {
  return (
    <div className="flex flex-col gap-14">
      <section className="pt-6">
        <h1 className="text-4xl font-bold tracking-tight">AI Case Studies</h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Real companies, real deployments, real sources — across healthcare,
          finance, retail, logistics, legal, manufacturing, and more. Each one
          gets an honest verdict: did it hold up, or was it noise?
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Figures are attributed to their source and dated. Vendor-reported
          numbers are labeled as such — a company&apos;s own claim, not an
          independent audit.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editor&apos;s picks</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {caseStudies.length} deep dives — the full story, what actually happened, and the so-what.
          </p>
        </div>
        <CaseStudyList items={caseStudies} />
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">The Incident Log</h2>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            The raw feed, not the editorial: live records from the{" "}
            <a
              href="https://incidentdatabase.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              AI Incident Database
            </a>
            , a citation-backed public database of real AI deployments causing
            real harm — pulled fresh on every visit, newest first, unedited.
            This is what keeps the list growing daily without anyone here
            inventing a statistic.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900" />
              ))}
            </div>
          }
        >
          <IncidentLogSection />
        </Suspense>
      </section>
    </div>
  );
}
