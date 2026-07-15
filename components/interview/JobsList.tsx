"use client";

import { useState } from "react";
import RadarCard, { StatPill } from "@/components/radar/RadarCard";
import type { JobRegion } from "@/lib/jobs";

export type JobItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  regions: JobRegion[];
  posted?: string; // pre-formatted date, e.g. "Jul 14"
  via?: string;
};

const REGIONS: { id: JobRegion; label: string }[] = [
  { id: "us", label: "United States" },
  { id: "india", label: "India" },
];

export default function JobsList({ jobs }: { jobs: JobItem[] }) {
  const [region, setRegion] = useState<JobRegion>("us");
  const shown = jobs.filter((job) => job.regions.includes(region));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter roles by location">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRegion(r.id)}
            aria-pressed={region === r.id}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              region === r.id
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "border border-zinc-300 text-zinc-600 hover:border-indigo-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No open listings matched this level in{" "}
          {REGIONS.find((r) => r.id === region)?.label} right now — check back
          soon or try the other location.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {shown.map((job) => (
            <RadarCard
              key={job.id}
              href={job.url}
              title={job.title}
              description={`${job.company} · ${job.location}`}
              stats={
                <>
                  {job.posted && <StatPill>{job.posted}</StatPill>}
                  {job.via && <StatPill>via {job.via}</StatPill>}
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
