"use client";

import { useState } from "react";
import type { RadarPaper } from "@/lib/radar";

export default function PaperPlayground({ papers }: { papers: RadarPaper[] }) {
  const [selectedId, setSelectedId] = useState(papers[0]?.id ?? "");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selected = papers.find((paper) => paper.id === selectedId) ?? papers[0];

  const explain = async () => {
    if (!selected || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/explain-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paper: { id: selected.id, title: selected.title, summary: selected.summary },
        }),
      });
      const data = (await response.json()) as { explanation?: string; error?: string };
      if (!response.ok || !data.explanation) {
        throw new Error(data.error ?? "We couldn't explain that paper right now.");
      }
      setExplanation(data.explanation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't explain that paper right now.");
    } finally {
      setLoading(false);
    }
  };

  if (!selected) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-zinc-950">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Paper Playground</p>
      <h3 className="mt-1 text-xl font-bold tracking-tight">Explain this paper like I&apos;m five</h3>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        Pick a trending paper. We&apos;ll turn its research summary into a tiny story—without pretending the paper says more than it does.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Choose a paper">
        {papers.map((paper) => (
          <button
            key={paper.id}
            type="button"
            onClick={() => {
              setSelectedId(paper.id);
              setExplanation("");
              setError("");
            }}
            className={`max-w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
              paper.id === selected.id
                ? "border-amber-400 bg-amber-100 font-medium text-amber-950 dark:border-amber-400/70 dark:bg-amber-500/20 dark:text-amber-100"
                : "border-zinc-200 bg-white/70 text-zinc-700 hover:border-amber-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300"
            }`}
          >
            <span className="line-clamp-2">{paper.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-amber-100 bg-white/75 p-4 dark:border-amber-500/20 dark:bg-zinc-950/65">
        <p className="text-sm font-semibold">{selected.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{selected.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void explain()}
            disabled={loading}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Making it simple…" : "Explain simply"}
          </button>
          <a href={`https://arxiv.org/abs/${selected.id}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-amber-800 hover:underline dark:text-amber-300">
            Read the paper →
          </a>
        </div>
      </div>

      {explanation && (
        <div className="mt-4 whitespace-pre-wrap rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-relaxed text-zinc-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-zinc-300">
          {explanation}
        </div>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
