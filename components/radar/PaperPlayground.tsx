"use client";

import { useState } from "react";
import type { RadarPaper } from "@/lib/radar";

export default function PaperPlayground({ papers }: { papers: RadarPaper[] }) {
  const [selectedId, setSelectedId] = useState(papers[0]?.id ?? "");
  const [explanation, setExplanation] = useState("");
  const [project, setProject] = useState("");
  const [level, setLevel] = useState("Starter");
  const [loading, setLoading] = useState<"explanation" | "project" | null>(null);
  const [error, setError] = useState("");
  const selected = papers.find((paper) => paper.id === selectedId) ?? papers[0];

  const explain = async () => {
    if (!selected || loading) return;
    setLoading("explanation");
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
      setLoading(null);
    }
  };

  const buildProject = async () => {
    if (!selected || loading) return;
    setLoading("project");
    setError("");
    try {
      const response = await fetch("/api/paper-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paper: { id: selected.id, title: selected.title, summary: selected.summary },
          level,
        }),
      });
      const data = (await response.json()) as { project?: string; error?: string };
      if (!response.ok || !data.project) {
        throw new Error(data.error ?? "We couldn't create a project plan right now.");
      }
      setProject(data.project);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't create a project plan right now.");
    } finally {
      setLoading(null);
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

      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" aria-label="Choose a paper">
        {papers.map((paper) => (
          <button
            key={paper.id}
            type="button"
            onClick={() => {
              setSelectedId(paper.id);
              setExplanation("");
              setProject("");
              setError("");
            }}
            className={`w-64 shrink-0 rounded-lg border px-3 py-3 text-left text-sm transition sm:w-auto sm:max-w-full ${
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
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={() => void explain()}
            disabled={loading !== null}
            className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:py-2"
          >
            {loading === "explanation" ? "Making it simple…" : "Explain simply"}
          </button>
          <label className="flex items-center justify-between gap-2 text-sm text-zinc-600 dark:text-zinc-400 sm:justify-start">
            Build level
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              disabled={loading !== null}
              className="rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-sm text-zinc-800 outline-none focus:border-amber-400 dark:border-amber-500/30 dark:bg-zinc-950 dark:text-zinc-200"
            >
              <option>Starter</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void buildProject()}
            disabled={loading !== null}
            className="w-full rounded-lg border border-amber-300 bg-white px-4 py-3 text-sm font-semibold text-amber-900 transition hover:border-amber-500 hover:bg-amber-50 disabled:cursor-wait disabled:opacity-70 dark:border-amber-500/40 dark:bg-zinc-950 dark:text-amber-200 dark:hover:bg-amber-500/10 sm:w-auto sm:py-2"
          >
            {loading === "project" ? "Building your plan…" : "Build this paper"}
          </button>
          <a href={`https://arxiv.org/abs/${selected.id}`} target="_blank" rel="noreferrer" className="py-2 text-center text-sm font-medium text-amber-800 hover:underline dark:text-amber-300 sm:text-left">
            Read the paper →
          </a>
        </div>
      </div>

      {explanation && (
        <div className="mt-4 whitespace-pre-wrap rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-relaxed text-zinc-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-zinc-300">
          {explanation}
        </div>
      )}
      {project && (
        <div className="mt-4 whitespace-pre-wrap rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 text-sm leading-relaxed text-zinc-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-zinc-300">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Paper-to-Project plan</p>
          {project}
        </div>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
