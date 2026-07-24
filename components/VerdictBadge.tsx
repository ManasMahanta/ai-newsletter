import type { Verdict } from "@/lib/case-studies";

const STYLES: Record<Verdict, string> = {
  signal: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  mixed: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  noise: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
};

const LABELS: Record<Verdict, string> = {
  signal: "Signal",
  mixed: "Mixed",
  noise: "Noise",
};

export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[verdict]}`}>
      {LABELS[verdict]}
    </span>
  );
}
