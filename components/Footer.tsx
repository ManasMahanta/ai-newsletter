import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-5 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
        <p>
          © {new Date().getFullYear()} {site.name}. {site.cadence.toLowerCase()},
          free.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/issues" className="py-2 hover:text-zinc-900 dark:hover:text-zinc-100">
            Archive
          </Link>
          <Link href="/glossary" className="py-2 hover:text-zinc-900 dark:hover:text-zinc-100">
            Glossary
          </Link>
          <Link href="/models" className="py-2 hover:text-zinc-900 dark:hover:text-zinc-100">
            Models
          </Link>
          <Link href="/start-here" className="py-2 hover:text-zinc-900 dark:hover:text-zinc-100">
            Start Here
          </Link>
          <Link href="/rss.xml" className="py-2 hover:text-zinc-900 dark:hover:text-zinc-100">
            RSS
          </Link>
          <Link href="/radar.xml" className="py-2 hover:text-zinc-900 dark:hover:text-zinc-100">
            Radar RSS
          </Link>
          <Link href="/privacy" className="py-2 hover:text-zinc-900 dark:hover:text-zinc-100">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
