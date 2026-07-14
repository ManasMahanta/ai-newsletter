import Link from "next/link";
import { topicLabel } from "@/lib/site";

export default function TagBadge({ tag }: { tag: string }) {
  return (
    <Link
      href={`/topics/${tag}`}
      className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
    >
      {topicLabel(tag)}
    </Link>
  );
}
