import type { Metadata } from "next";
import GlossaryList from "@/components/GlossaryList";
import { glossary } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "AI Glossary",
  description:
    "Plain-English definitions of 100+ AI and LLM terms — from attention and RAG to KV cache, LoRA, prompt injection, and agent autonomy. No jargon required to understand the jargon.",
};

export default function GlossaryPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="pt-6">
        <h1 className="text-4xl font-bold tracking-tight">AI Glossary</h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Every term you&apos;ll meet in papers, launch posts, and interviews —
          defined in plain English, with the practical &ldquo;so what&rdquo;
          included.
        </p>
      </section>
      <GlossaryList terms={glossary} />
    </div>
  );
}
