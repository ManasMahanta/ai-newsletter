"use client";

import { useEffect, useState } from "react";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  savedAt: number;
};

const BOOKMARKS_KEY = "sn-bookmarks";
const VOTES_KEY = "sn-votes";
type Vote = "signal" | "noise";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Notifies other mounted instances (and the Saved page) within this tab,
// since the native `storage` event only fires across tabs.
function broadcast(key: string) {
  window.dispatchEvent(new CustomEvent("sn-store", { detail: key }));
}

// Personal bookmark star + Signal/Noise reaction for a radar item. All state
// is per-browser in localStorage — no account, no server. Votes are personal
// (they express your own take), not a shared tally.
export default function CardActions({
  id,
  title,
  url,
}: {
  id: string;
  title: string;
  url: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [vote, setVote] = useState<Vote | null>(null);

  useEffect(() => {
    const sync = () => {
      const marks = read<Bookmark[]>(BOOKMARKS_KEY, []);
      setSaved(marks.some((m) => m.id === id));
      const votes = read<Record<string, Vote>>(VOTES_KEY, {});
      setVote(votes[id] ?? null);
    };
    sync();
    setMounted(true);
    const handler = (e: Event) => {
      const key = (e as CustomEvent).detail;
      if (key === BOOKMARKS_KEY || key === VOTES_KEY) sync();
    };
    window.addEventListener("sn-store", handler);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sn-store", handler);
      window.removeEventListener("storage", sync);
    };
  }, [id]);

  const toggleSave = () => {
    const marks = read<Bookmark[]>(BOOKMARKS_KEY, []);
    const next = saved
      ? marks.filter((m) => m.id !== id)
      : [{ id, title, url, savedAt: Date.now() }, ...marks];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    setSaved(!saved);
    broadcast(BOOKMARKS_KEY);
  };

  const castVote = (v: Vote) => {
    const votes = read<Record<string, Vote>>(VOTES_KEY, {});
    if (votes[id] === v) delete votes[id];
    else votes[id] = v;
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
    setVote(votes[id] ?? null);
    broadcast(VOTES_KEY);
  };

  // Render inert placeholders pre-hydration to avoid a mismatch.
  const base =
    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition";

  return (
    <div className="ml-auto flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => castVote("signal")}
        aria-pressed={mounted && vote === "signal"}
        aria-label="Mark as signal"
        title="Signal — worth your attention"
        className={`${base} ${
          mounted && vote === "signal"
            ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "border-zinc-200 text-zinc-500 hover:border-emerald-300 dark:border-zinc-700 dark:text-zinc-400"
        }`}
      >
        <span aria-hidden="true">📡</span> Signal
      </button>
      <button
        type="button"
        onClick={() => castVote("noise")}
        aria-pressed={mounted && vote === "noise"}
        aria-label="Mark as noise"
        title="Noise — skip it"
        className={`${base} ${
          mounted && vote === "noise"
            ? "border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-300"
            : "border-zinc-200 text-zinc-500 hover:border-rose-300 dark:border-zinc-700 dark:text-zinc-400"
        }`}
      >
        <span aria-hidden="true">🔇</span> Noise
      </button>
      <button
        type="button"
        onClick={toggleSave}
        aria-pressed={mounted && saved}
        aria-label={saved ? "Remove bookmark" : "Save bookmark"}
        title={saved ? "Saved — click to remove" : "Save to your list"}
        className={`${base} ${
          mounted && saved
            ? "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-300"
            : "border-zinc-200 text-zinc-500 hover:border-amber-300 dark:border-zinc-700 dark:text-zinc-400"
        }`}
      >
        <span aria-hidden="true">{mounted && saved ? "★" : "☆"}</span> Save
      </button>
    </div>
  );
}
