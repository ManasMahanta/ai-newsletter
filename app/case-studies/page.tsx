import type { Metadata } from "next";
import CaseStudyList from "@/components/CaseStudyList";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "AI Case Studies",
  description:
    "Real, named, sourced deployments of AI and agentic AI across industries — finance, healthcare, retail, legal, manufacturing, and more — with an honest verdict on what actually held up.",
};

export default function CaseStudiesPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="pt-6">
        <h1 className="text-4xl font-bold tracking-tight">AI Case Studies</h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Real companies, real deployments, real sources — across healthcare,
          finance, retail, logistics, legal, manufacturing, and more. Each one
          gets an honest verdict: did it hold up, or was it noise?
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Figures are attributed to their source and dated. Vendor-reported
          numbers are labeled as such — a company's own claim, not an
          independent audit.
        </p>
      </section>
      <CaseStudyList items={caseStudies} />
    </div>
  );
}
