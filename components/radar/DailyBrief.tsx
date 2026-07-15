import { getDailyBrief } from "@/lib/brief";

// Claude-written synthesis of today's feeds. Renders nothing until
// ANTHROPIC_API_KEY is configured or if generation fails.
export default async function DailyBrief() {
  const brief = await getDailyBrief();
  if (!brief) return null;
  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 dark:border-indigo-500/30 dark:bg-indigo-500/10">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-400">
        Today&apos;s read
      </p>
      <p className="mt-2 leading-relaxed text-indigo-950/90 dark:text-indigo-100/90">
        {brief}
      </p>
    </div>
  );
}
