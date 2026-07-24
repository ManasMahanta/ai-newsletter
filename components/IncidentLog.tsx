"use client";

// The live "Incident Log" — real records from the AI Incident Database,
// searchable, domain-filterable, and paginated. Refreshes whenever the page
// revalidates (lib/incidents.ts, every 3h, or daily via the refresh cron),
// so this list grows and changes without anyone hand-writing an entry.

import { useMemo, useState } from "react";
import RadarCard, { StatPill } from "@/components/radar/RadarCard";
import { formatShortDate } from "@/lib/radar";
import type { Incident } from "@/lib/incidents";

const STEP = 24;

export default function IncidentLog({ incidents }: { incidents: Incident[] }) {
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState<string>("all");
  const [limit, setLimit] = useState(STEP);

  const usedDomains = useMemo(() => {
    const seen = new Set(incidents.map((i) => i.domain));
    return [...seen].sort((a, b) => (a === "Uncategorized" ? 1 : b === "Uncategorized" ? -1 : a.localeCompare(b)));
  }, [incidents]);

  const newest = incidents[0]?.publishedAt;

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return incidents.filter((i) => {
      if (domain !== "all" && i.domain !== domain) return false;
      if (!n) return true;
      return i.title.toLowerCase().includes(n) || i.snippet.toLowerCase().includes(n);
    });
  }, [q, domain, incidents]);
  const visible = filtered.slice(0, limit);

  return (
    <div className="flex flex-col gap-4">
      {newest && (
        <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Live — newest record {formatShortDate(newest)}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {filtered.length} record{filtered.length === 1 ? "" : "s"}
        </p>
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(STEP);
          }}
          placeholder="Search the incident log…"
          className="w-full max-w-64 rounded-lg border border-zinc-200 bg-white/65 px-3 py-1.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/55 dark:focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => {
            setDomain("all");
            setLimit(STEP);
          }}
          className={`rounded-md px-2.5 py-1 font-mono text-xs uppercase tracking-wider transition ${
            domain === "all"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-500 hover:text-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200"
          }`}
        >
          All categories
        </button>
        {usedDomains.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setDomain(d);
              setLimit(STEP);
            }}
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

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((i) => (
          <RadarCard
            key={i.url}
            href={i.url}
            title={i.title}
            eyebrow={i.domain !== "Uncategorized" ? i.domain : undefined}
            description={i.snippet}
            stats={i.publishedAt ? <StatPill>{formatShortDate(i.publishedAt)}</StatPill> : null}
            secondaryLink={i.reportUrl ? { href: i.reportUrl, label: "Full record ↗" } : undefined}
            actions={false}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No records match those filters.</p>
      )}

      {limit < filtered.length && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLimit((l) => l + STEP)}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition hover:border-indigo-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-zinc-100"
          >
            Show more
          </button>
          <button
            type="button"
            onClick={() => setLimit(filtered.length)}
            className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Show all ({filtered.length})
          </button>
        </div>
      )}
    </div>
  );
}
