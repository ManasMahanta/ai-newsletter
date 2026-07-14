import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Subscribe",
  description: `Get ${site.name} in your inbox — ${site.tagline.toLowerCase()}.`,
};

export default function SubscribePage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        {site.tagline}
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        {site.cadence}, free. A 3-bullet TL;DR for the busy, research and tools
        for the hands-on, and the business angle for everyone in between.
      </p>
      <SignupForm />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Want to see it first?{" "}
        <Link
          href="/start-here"
          className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
        >
          Read a sample issue
        </Link>
      </p>
    </div>
  );
}
