"use client";

import { useEffect, useMemo, useState } from "react";
import type { QA } from "@/lib/qa/types";

const PAGE = 10;

// Renders answers with light structure: blank-line paragraphs, "- " bullet
// lists, and **bold** section labels. Plain single-paragraph answers pass
// through unchanged.
function Bold({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-zinc-800 dark:text-zinc-200">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function AnswerBody({ text }: { text: string }) {
  const blocks = text.split("\n\n");
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) =>
        block.trimStart().startsWith("- ") ? (
          <ul key={i} className="flex flex-col gap-1.5 pl-1">
            {block
              .split("\n")
              .filter((l) => l.trim())
              .map((line, j) => (
                <li key={j} className="flex gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"
                    aria-hidden="true"
                  />
                  <span>
                    <Bold text={line.replace(/^\s*- /, "")} />
                  </span>
                </li>
              ))}
          </ul>
        ) : (
          <p key={i}>
            <Bold text={block} />
          </p>
        ),
      )}
    </div>
  );
}

type Scores = Record<string, "knew" | "missed">;

function loadScores(key: string): Scores {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}");
  } catch {
    return {};
  }
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Quiz mode: shuffled flashcards with reveal + self-scoring in localStorage. */
function Quiz({ items, bankId }: { items: QA[]; bankId: string }) {
  const storageKey = `sn-quiz-${bankId}`;
  const [scores, setScores] = useState<Scores>({});
  const [deck, setDeck] = useState<QA[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [missedOnly, setMissedOnly] = useState(false);

  useEffect(() => {
    setScores(loadScores(storageKey));
  }, [storageKey]);

  useEffect(() => {
    const pool = missedOnly
      ? items.filter((i) => scores[i.q] !== "knew")
      : items;
    setDeck(shuffled(pool));
    setIdx(0);
    setRevealed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missedOnly, items]);

  const knownCount = items.filter((i) => scores[i.q] === "knew").length;
  const current = deck[idx];

  const record = (verdict: "knew" | "missed") => {
    const next = { ...scores, [current.q]: verdict };
    setScores(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  const reset = () => {
    localStorage.removeItem(storageKey);
    setScores({});
    setDeck(shuffled(items));
    setIdx(0);
    setRevealed(false);
  };

  if (deck.length === 0 || idx >= deck.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white/65 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950/55">
        <p className="text-lg font-semibold">
          {deck.length === 0 ? "Nothing left to review 🎉" : "Deck complete!"}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {knownCount} of {items.length} marked as known.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setDeck(shuffled(missedOnly ? items.filter((i) => scores[i.q] !== "knew") : items));
              setIdx(0);
              setRevealed(false);
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Shuffle again
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-indigo-400 dark:border-zinc-800 dark:text-zinc-400"
          >
            Reset progress
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          Card {idx + 1} of {deck.length} · {knownCount}/{items.length} known
        </span>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={missedOnly}
            onChange={(e) => setMissedOnly(e.target.checked)}
            className="accent-indigo-600"
          />
          Review missed &amp; new only
        </label>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white/65 p-6 dark:border-zinc-800 dark:bg-zinc-950/55">
        <p className="font-medium leading-snug">{current.q}</p>
        {revealed && (
          <div className="mt-4 border-t border-dashed border-zinc-200 pt-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <AnswerBody text={current.a} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Reveal answer
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => record("knew")}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              ✓ Knew it
            </button>
            <button
              type="button"
              onClick={() => record("missed")}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
            >
              ✗ Missed it
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            setRevealed(false);
            setIdx((i) => i + 1);
          }}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-indigo-400 dark:border-zinc-800 dark:text-zinc-400"
        >
          Skip →
        </button>
      </div>
    </div>
  );
}

// Expandable Q&A bank with "show more" pagination, a text filter, and a
// flashcard quiz mode with localStorage progress.
export default function QABank({
  items,
  bankId = "default",
}: {
  items: QA[];
  bankId?: string;
}) {
  const [mode, setMode] = useState<"study" | "quiz">("study");
  const [visible, setVisible] = useState(PAGE);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      q
        ? items.filter(
            (item) =>
              item.q.toLowerCase().includes(q) ||
              item.a.toLowerCase().includes(q),
          )
        : items,
    [q, items],
  );
  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-800">
            {(["study", "quiz"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-md px-3 py-1 text-sm font-medium capitalize transition ${
                  mode === m
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {m === "quiz" ? "Quiz me" : "Study"}
              </button>
            ))}
          </div>
          {mode === "study" && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {filtered.length} question{filtered.length === 1 ? "" : "s"}
              {q && ` matching “${query.trim()}”`}
            </p>
          )}
        </div>
        {mode === "study" && (
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE);
            }}
            placeholder="Filter questions…"
            className="w-full rounded-lg border border-zinc-200 bg-white/65 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-400 sm:max-w-56 dark:border-zinc-800 dark:bg-zinc-950/55 dark:focus:border-indigo-500"
          />
        )}
      </div>

      {mode === "quiz" ? (
        <Quiz items={items} bankId={bankId} />
      ) : (
        <>
          <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white/65 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/55">
            {shown.map((item, i) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer items-baseline gap-3 px-5 py-3.5 text-sm font-medium leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 [&::-webkit-details-marker]:hidden">
                  <span className="shrink-0 font-mono text-xs font-semibold text-indigo-500 dark:text-indigo-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{item.q}</span>
                  <span
                    className="shrink-0 text-zinc-400 transition-transform group-open:rotate-90"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </summary>
                <div className="border-t border-dashed border-zinc-200 bg-zinc-50/60 px-5 py-4 text-sm leading-relaxed text-zinc-600 sm:pl-12 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
                  <AnswerBody text={item.a} />
                </div>
              </details>
            ))}
            {shown.length === 0 && (
              <p className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                No questions match that filter.
              </p>
            )}
          </div>

          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + 15)}
              className="self-center rounded-lg border border-zinc-200 bg-white/65 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/55 dark:text-indigo-400 dark:hover:border-indigo-500"
            >
              Show more ({remaining} remaining)
            </button>
          )}
        </>
      )}
    </div>
  );
}
