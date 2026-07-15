"use client";

import { FormEvent, useState } from "react";

type Message = { role: "coach" | "candidate"; text: string };

type Session = {
  role: string;
  experience: string;
  focus: string;
  context: string;
};

const focusAreas = [
  "General mock interview",
  "LLM / RAG systems",
  "System design",
  "Behavioral & leadership",
  "Resume / project deep dive",
];

export default function InterviewCoach() {
  const [session, setSession] = useState<Session>({
    role: "GenAI engineer",
    experience: "",
    focus: focusAreas[0],
    context: "",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askCoach = async (action: "start" | "coach", candidateAnswer?: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/interview-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, session, messages, candidateAnswer }),
      });
      const payload = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? "The coach could not respond just now.");
      }
      setMessages((current) => [...current, { role: "coach", text: payload.reply! }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The coach could not respond just now.");
    } finally {
      setLoading(false);
    }
  };

  const start = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessages([]);
    void askCoach("start");
  };

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = answer.trim();
    if (!trimmed || loading) return;
    setMessages((current) => [...current, { role: "candidate", text: trimmed }]);
    setAnswer("");
    void askCoach("coach", trimmed);
  };

  const active = messages.length > 0;

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">AI Interview Coach</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">Practice the interview, not just the questions.</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Get a tailored mock interview, direct feedback on each answer, and a sharper follow-up question.
          </p>
        </div>
        {active && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setAnswer("");
              setError("");
            }}
            className="rounded-lg border border-indigo-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:border-indigo-400 dark:border-indigo-500/30 dark:bg-zinc-950/70 dark:text-indigo-300"
          >
            New session
          </button>
        )}
      </div>

      {!active ? (
        <form onSubmit={start} className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Target role
            <input value={session.role} onChange={(e) => setSession({ ...session, role: e.target.value })} required maxLength={120} placeholder="e.g. ML engineer" className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" />
          </label>
          <label className="text-sm font-medium">
            Experience
            <input value={session.experience} onChange={(e) => setSession({ ...session, experience: e.target.value })} maxLength={80} placeholder="e.g. 3 years, moving from backend" className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" />
          </label>
          <label className="text-sm font-medium">
            Focus
            <select value={session.focus} onChange={(e) => setSession({ ...session, focus: e.target.value })} className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950">
              {focusAreas.map((area) => <option key={area}>{area}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">
            Job or company context <span className="font-normal text-zinc-500">(optional)</span>
            <input value={session.context} onChange={(e) => setSession({ ...session, context: e.target.value })} maxLength={500} placeholder="Paste the key requirements" className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-70">
              {loading ? "Preparing your interview…" : "Start mock interview"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5">
          <div className="max-h-[34rem] space-y-4 overflow-y-auto rounded-xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/70" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "candidate" ? "ml-auto max-w-[90%] rounded-xl bg-indigo-600 px-4 py-3 text-sm leading-relaxed text-white" : "max-w-[95%] whitespace-pre-wrap rounded-xl bg-zinc-100 px-4 py-3 text-sm leading-relaxed text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"}>
                {message.role === "coach" && <p className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Coach</p>}
                {message.text}
              </div>
            ))}
            {loading && <p className="text-sm text-zinc-500 dark:text-zinc-400">Your coach is thinking…</p>}
          </div>
          <form onSubmit={submitAnswer} className="mt-3">
            <label className="sr-only" htmlFor="interview-answer">Your answer</label>
            <textarea id="interview-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} maxLength={6000} rows={5} placeholder="Answer as you would in the interview. Concrete decisions, trade-offs, and outcomes make the best practice." className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm leading-relaxed outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" />
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{answer.length}/6000</p>
              <button type="submit" disabled={!answer.trim() || loading} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">Get feedback &amp; next question</button>
            </div>
          </form>
        </div>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
