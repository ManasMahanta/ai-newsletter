"use client";

import { useState } from "react";
import type { QA } from "@/lib/qa/types";

const PAGE = 10;

// Expandable Q&A bank with "show more" pagination and a text filter.
export default function QABank({ items }: { items: QA[] }) {
  const [visible, setVisible] = useState(PAGE);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter(
        (item) =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
      )
    : items;
  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {filtered.length} question{filtered.length === 1 ? "" : "s"}
          {q && ` matching “${query.trim()}”`}
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PAGE);
          }}
          placeholder="Filter questions…"
          className="w-full max-w-56 rounded-lg border border-zinc-200 bg-white/65 px-3 py-1.5 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/55 dark:focus:border-indigo-500"
        />
      </div>

      <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white/65 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/55">
        {shown.map((item, i) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer items-baseline gap-3 px-5 py-3.5 text-sm font-medium leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 [&::-webkit-details-marker]:hidden">
              <span className="shrink-0 font-mono text-xs font-semibold text-indigo-500 dark:text-indigo-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{item.q}</span>
              <span
                className="shrink-0 text-zinc-400 transition-transform group-open:rotate-90"
                aria-hidden="true"
              >
                ›
              </span>
            </summary>
            <div className="border-t border-dashed border-zinc-200 bg-zinc-50/60 px-5 py-4 pl-12 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
              {item.a}
            </div>
          </details>
        ))}
        {shown.length === 0 && (
          <p className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
            No questions match that filter.
          </p>
        )}
      </div>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + 15)}
          className="self-center rounded-lg border border-zinc-200 bg-white/65 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/55 dark:text-indigo-400 dark:hover:border-indigo-500"
        >
          Show more ({remaining} remaining)
        </button>
      )}
    </div>
  );
}
