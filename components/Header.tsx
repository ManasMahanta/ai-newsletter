import Link from "next/link";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

const nav = [
  { href: "/issues", label: "Issues" },
  { href: "/radar", label: "Radar" },
  { href: "/start-here", label: "Start Here" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" aria-label={site.name}>
          <Logo />
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-6">
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
      </div>
    </header>
  );
}
