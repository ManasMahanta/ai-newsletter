import { NextResponse } from "next/server";
import { getDailyBrief } from "@/lib/brief";
import { site } from "@/lib/site";
import {
  getTrendingPapers,
  getTrendingRepos,
  getTopStories,
} from "@/lib/radar";

export const maxDuration = 120;

// Composes the daily brief plus a few top links into a newsletter email and
// creates it as a DRAFT in Buttondown. You review and hit send there — this
// route never sends to subscribers on its own. To auto-send instead, change
// `status` below to "about_to_send" (see the comment).
// Trigger: GET /api/email-brief?secret=<CRON_SECRET>
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const provided = new URL(request.url).searchParams.get("secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "BUTTONDOWN_API_KEY is not configured." },
      { status: 503 },
    );
  }

  const [brief, papers, repos, stories] = await Promise.all([
    getDailyBrief(),
    getTrendingPapers(3),
    getTrendingRepos(3),
    getTopStories(3),
  ]);

  if (!brief) {
    return NextResponse.json(
      { error: "No brief available to send (is ZAI_API_KEY set?)." },
      { status: 503 },
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const base = site.url.replace(/\/$/, "");
  const list = (title: string, items: { label: string; url: string }[]) =>
    items.length
      ? `\n\n**${title}**\n${items.map((i) => `- [${i.label}](${i.url})`).join("\n")}`
      : "";

  const body =
    `${brief}` +
    list(
      "Trending papers",
      papers.map((p) => ({ label: p.title, url: p.url })),
    ) +
    list(
      "Rising tools",
      repos.map((r) => ({ label: r.fullName, url: r.url })),
    ) +
    list(
      "On Hacker News",
      stories.map((s) => ({ label: s.title, url: s.url })),
    ) +
    `\n\n---\n\nMore live on the [radar](${base}/radar) · [Signal & Noise](${base})`;

  const subject = `Signal & Noise — ${today}`;

  const res = await fetch("https://api.buttondown.com/v1/emails", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject,
      body,
      // "draft" = safe: appears in Buttondown for review. Change to
      // "about_to_send" to dispatch to subscribers immediately.
      status: "draft",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Buttondown email create failed", res.status, detail);
    return NextResponse.json(
      { error: "Buttondown rejected the draft.", status: res.status },
      { status: 502 },
    );
  }

  const data = (await res.json().catch(() => ({}))) as { id?: string };
  return NextResponse.json({
    ok: true,
    status: "draft",
    emailId: data.id ?? null,
    message: "Draft created in Buttondown — review and send it there.",
  });
}
