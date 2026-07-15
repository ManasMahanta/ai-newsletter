import Link from "next/link";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

const nav = [
  { href: "/issues", label: "Issues" },
  { href: "/radar", label: "Radar" },
  { href: "/agents", label: "Agentic AI" },
  { href: "/interview-prep", label: "Interview Prep" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <Link href="/" aria-label={site.name}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex md:gap-6" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/subscribe"
            className="rounded-lg bg-indigo-600 px-3.5 py-1.5 font-semibold text-white transition hover:bg-indigo-500"
          >
            Subscribe
          </Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="flex h-11 cursor-pointer list-none items-center rounded-lg border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 marker:content-none dark:border-zinc-800 dark:text-zinc-200 [&::-webkit-details-marker]:hidden">
            Menu
            <span className="ml-2 text-zinc-400" aria-hidden="true">⌄</span>
          </summary>
          <nav aria-label="Mobile navigation" className="absolute right-0 z-50 mt-2 flex w-56 flex-col rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900">
                {item.label}
              </Link>
            ))}
            <Link href="/subscribe" className="mt-1 rounded-lg bg-indigo-600 px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-500">
              Subscribe free
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
