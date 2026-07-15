import type { Metadata } from "next";
import { modelsLastReviewed, trackedModels } from "@/lib/models-data";

export const metadata: Metadata = {
  title: "Model Tracker",
  description:
    "A curated comparison of the frontier and open-weight AI models that matter right now — context windows, pricing, and what each is actually best at.",
};

export default function ModelsPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="pt-6">
        <h1 className="text-4xl font-bold tracking-tight">Model Tracker</h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          The models that matter right now, in one table — curated
          editorially, so it reflects what&apos;s actually worth using rather
          than everything that exists.
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Prices are per 1M tokens. Last reviewed {modelsLastReviewed} —
          &ldquo;verify&rdquo; means check the provider&apos;s current pricing
          page before budgeting.
        </p>
      </section>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white/65 dark:border-zinc-800 dark:bg-zinc-950/55">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
              <th className="px-4 py-3 font-semibold">Model</th>
              <th className="px-4 py-3 font-semibold">Provider</th>
              <th className="px-4 py-3 font-semibold">Context</th>
              <th className="px-4 py-3 font-semibold">Input</th>
              <th className="px-4 py-3 font-semibold">Output</th>
              <th className="px-4 py-3 font-semibold">Weights</th>
              <th className="px-4 py-3 font-semibold">Best for</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {trackedModels.map((m) => (
              <tr key={m.name}>
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {m.provider}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {m.context}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {m.inputPrice}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {m.outputPrice}
                </td>
                <td className="px-4 py-3">
                  {m.openWeights ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                      open
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      closed
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {m.bestFor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
