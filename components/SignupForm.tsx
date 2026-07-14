"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "loading" | "info" | "error";

export default function SignupForm({
  compact = false,
}: {
  compact?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (data.configured === false) {
        setStatus("info");
        setMessage(data.message);
        return;
      }
      router.push("/thanks");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className={compact ? "" : "w-full max-w-md"}>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`email-${compact ? "compact" : "main"}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${compact ? "compact" : "main"}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe free"}
        </button>
      </form>
      {message && (
        <p
          role="status"
          className={`mt-2 text-sm ${
            status === "error"
              ? "text-red-600 dark:text-red-400"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          {message}
        </p>
      )}
      {!compact && !message && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Free, every Friday. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}
