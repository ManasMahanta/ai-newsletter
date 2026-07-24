"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { domains, type CaseStudy } from "@/lib/case-studies";
import VerdictBadge from "@/components/VerdictBadge";

type Filter = "all" | "agentic" | "ai";

export default function CaseStudyList({ items }: { items: CaseStudy[] }) {
  const [domain, setDomain] = useState<string>("all");
  const [kind, setKind] = useState<Filter>("all");

  const usedDomains = useMemo(
    () => domains.filter((d) => items.some((c) => c.domain === d)),
    [items],
  );

  const filtered = items.filter((c) => {
    if (domain !== "all" && c.domain !== domain) return false;
    if (kind === "agentic" && !c.agentic) return false;
    if (kind === "ai" && c.agentic) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "All"],
              ["agentic", "Agentic AI"],
              ["ai", "AI / ML"],
            ] as [Filter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind(value)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                kind === value
                  ? "border-indigo-500 bg-indigo-600 text-white"
                  : "border-zinc-200 text-zinc-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setDomain("all")}
            className={`rounded-md px-2.5 py-1 font-mono text-xs uppercase tracking-wider transition ${
              domain === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-500 hover:text-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200"
            }`}
          >
            All domains
          </button>
          {usedDomains.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomain(d)}
              className={`rounded-md px-2.5 py-1 font-mono text-xs uppercase tracking-wider transition ${
                domain === d
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-500 hover:text-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {filtered.length} case stud{filtered.length === 1 ? "y" : "ies"}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((c) => (
          <Link
            key={c.slug}
            href={`/case-studies/${c.slug}`}
            className="flex flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white/65 p-5 transition hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/55 dark:hover:border-indigo-500"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {c.domain}
              </span>
              <VerdictBadge verdict={c.verdict} />
            </div>
            <h3 className="text-lg font-semibold leading-snug">{c.headline}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{c.org} · {c.period}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No case studies match those filters.
        </p>
      )}
    </div>
  );
}
