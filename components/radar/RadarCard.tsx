import type { ReactNode } from "react";

export function StatPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      {children}
    </span>
  );
}

export default function RadarCard({
  href,
  title,
  eyebrow,
  description,
  stats,
  secondaryLink,
}: {
  href: string;
  title: string;
  eyebrow?: string;
  description?: string;
  stats: ReactNode;
  secondaryLink?: { href: string; label: string };
}) {
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white/65 p-5 transition hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/55 dark:hover:border-indigo-500">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </p>
      )}
      <h3 className="font-semibold leading-snug">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {title}
        </a>
      </h3>
      {description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {stats}
        {secondaryLink && (
          <a
            href={secondaryLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {secondaryLink.label}
          </a>
        )}
      </div>
    </article>
  );
}
