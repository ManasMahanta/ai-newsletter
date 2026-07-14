import SignupForm from "@/components/SignupForm";
import { site } from "@/lib/site";

export default function InlineCTA({
  heading = `Enjoying ${site.name}?`,
}: {
  heading?: string;
}) {
  return (
    <aside className="my-10 rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900 dark:bg-indigo-950/40">
      <h2 className="text-base font-semibold">{heading}</h2>
      <p className="mt-1 mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Get the next issue in your inbox — {site.tagline.toLowerCase()}.
      </p>
      <SignupForm compact />
    </aside>
  );
}
