import type { Metadata } from "next";
import InlineCTA from "@/components/InlineCTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Who writes ${site.name}, what you'll get, and why it exists.`,
};

export default function AboutPage() {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:tracking-tight">
      <h1>About {site.name}</h1>
      <p>
        AI advancements arrive faster than anyone can track — model releases,
        research papers, tooling shifts, policy moves. Most coverage either
        drowns you in links or dumbs it down to hype. {site.name} does neither:
        every issue is a curated, layered read that a busy person finishes in
        five minutes and a hands-on person can go deep on.
      </p>
      <h2>What you get</h2>
      <ul>
        <li>
          <strong>{site.cadence}:</strong> one email, no more. A 3-bullet TL;DR,
          one big story explained for builders <em>and</em> for business, research
          translated into plain English, a tool worth trying, the business angle,
          a lightning round, and one practical tip.
        </li>
        <li>
          <strong>Layered depth:</strong> executives can stop at the TL;DR,
          engineers can go all the way down. Every section says the quiet part —
          the &ldquo;so what&rdquo; — out loud.
        </li>
        <li>
          <strong>No hype:</strong> if a development doesn&apos;t change what you
          should build, buy, or believe, it goes in the lightning round or not at
          all.
        </li>
      </ul>
      <h2>Who writes it</h2>
      <p>
        {site.name} is written by {site.author}, an engineer who builds
        AI systems — routing meshes, agent orchestration, retrieval pipelines —
        and reads the papers so you don&apos;t have to. The analysis here comes
        from shipping this stuff, not just summarizing press releases.
      </p>
      <h2>The fine print</h2>
      <p>
        Free, {site.cadence.toLowerCase()}. Unsubscribe anytime with one click.
        Your email is used for the newsletter and nothing else — see the{" "}
        <a href="/privacy">privacy policy</a>.
      </p>
      <InlineCTA />
    </div>
  );
}
