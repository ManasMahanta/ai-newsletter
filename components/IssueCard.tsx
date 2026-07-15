import Link from "next/link";
import type { IssueMeta } from "@/lib/issues";
import { formatDate } from "@/lib/issues";
import TagBadge from "@/components/TagBadge";

export default function IssueCard({ issue }: { issue: IssueMeta }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white/65 p-5 transition hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/55 dark:hover:border-indigo-500">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {formatDate(issue.date)}
      </p>
      <h3 className="mt-1 text-lg font-semibold leading-snug">
        <Link href={`/issues/${issue.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
          {issue.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {issue.summary}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {issue.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
}
