import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, relatedCaseStudies } from "@/lib/case-studies";
import { site } from "@/lib/site";
import VerdictBadge from "@/components/VerdictBadge";
import InlineCTA from "@/components/InlineCTA";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  const title = `${cs.org} — AI Case Study`;
  const description = cs.headline;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${site.url}/case-studies/${slug}`,
    },
    alternates: { canonical: `${site.url}/case-studies/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const related = relatedCaseStudies(cs);

  return (
    <article className="flex flex-col gap-8">
      <nav className="pt-6 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/case-studies" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          AI Case Studies
        </Link>{" "}
        / <span className="text-zinc-700 dark:text-zinc-300">{cs.org}</span>
      </nav>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-zinc-100 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            {cs.domain}
          </span>
          <span className="rounded-md bg-zinc-100 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            {cs.agentic ? "Agentic AI" : "AI / ML"}
          </span>
          <VerdictBadge verdict={cs.verdict} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-balance">{cs.headline}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{cs.org} · {cs.period}</p>
      </header>

      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            What they did
          </h2>
          <p className="mt-2 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {cs.summary}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            What happened
          </h2>
          <p className="mt-2 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {cs.outcome}
          </p>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            The so-what
          </h2>
          <p className="mt-2 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {cs.lesson}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold">Sources</h2>
        <ul className="mt-2 flex flex-col gap-1.5">
          {cs.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {s.title} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold">Related case studies</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/case-studies/${r.slug}`}
                className="flex flex-col gap-1.5 rounded-xl border border-zinc-200 bg-white/65 p-4 transition hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/55 dark:hover:border-indigo-500"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {r.domain}
                </span>
                <span className="text-sm font-semibold leading-snug">{r.org}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <InlineCTA heading="Want the next real case study, not the next hype cycle?" />

      <Link href="/case-studies" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Back to all case studies
      </Link>
    </article>
  );
}
