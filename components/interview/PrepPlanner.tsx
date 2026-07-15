"use client";

import { useState } from "react";

// Renders GLM's plan text: **bold** labels, "- " bullets, blank-line blocks.
function PlanBody({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
      {text.split("\n\n").map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim());
        if (lines.every((l) => l.trimStart().startsWith("- "))) {
          return (
            <ul key={i} className="flex flex-col gap-1.5 pl-1">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" aria-hidden="true" />
                  <span>{line.replace(/^\s*-\s/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        // A "Label:" heading line, optionally followed by prose.
        return (
          <div key={i}>
            {lines.map((line, j) => {
              const heading = /^[A-Z][^:]{2,40}:$/.test(line.trim());
              return heading ? (
                <p key={j} className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {line.trim()}
                </p>
              ) : (
                <p key={j}>{line}</p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function PrepPlanner() {
  const [jd, setJd] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (loading || jd.trim().length < 40) {
      setError("Paste a bit more of the job description first.");
      return;
    }
    setLoading(true);
    setError("");
    setPlan("");
    try {
      const res = await fetch("/api/prep-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd }),
      });
      const data = (await res.json()) as { plan?: string; error?: string };
      if (!res.ok || !data.plan) throw new Error(data.error ?? "Couldn't build a plan right now.");
      setPlan(data.plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white/65 p-5 dark:border-zinc-800 dark:bg-zinc-950/55">
      <h3 className="font-semibold">Build my prep plan from a job description</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Paste a Gen AI job description and get a tailored study plan — focus areas, a
        day-by-day schedule, likely questions, and one project to build. Then drill the
        matching Q&amp;A bank below and rehearse with the AI coach.
      </p>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={6}
        placeholder="Paste the full job description here…"
        className="mt-3 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-indigo-500"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Building your plan…" : "Build my plan"}
        </button>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {jd.length}/6000 characters
        </span>
      </div>

      {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      {plan && (
        <div className="mt-5 border-t border-dashed border-zinc-200 pt-5 dark:border-zinc-800">
          <PlanBody text={plan} />
        </div>
      )}
    </div>
  );
}
