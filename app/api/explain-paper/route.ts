import { NextResponse } from "next/server";
import { callGLM, glmConfigured } from "@/lib/glm";

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  if (!glmConfigured()) {
    return NextResponse.json(
      { error: "Paper Playground is not configured yet. Add ZAI_API_KEY to enable it." },
      { status: 503 },
    );
  }

  let body: { paper?: { title?: unknown; summary?: unknown } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = clean(body.paper?.title, 300);
  const summary = clean(body.paper?.summary, 2000);
  if (!title || !summary) {
    return NextResponse.json({ error: "A paper title and summary are required." }, { status: 400 });
  }

  const system = `You make research understandable for a curious five-year-old, without talking down to them. Use only the title and summary supplied; do not invent results, methods, or certainty that are not there. Keep technical words only when needed and explain them immediately. Write in this exact friendly format:\n\nThe big idea:\n<2 short sentences>\n\nHow it works:\n<2-3 very short sentences or bullets>\n\nWhy people care:\n<1-2 short sentences>\n\nA tiny example:\n<one everyday comparison>\n\nOne grown-up word:\n<one term and its plain-English meaning>.`;
  const user = `Paper title: ${title}\n\nResearch summary: ${summary}`;

  try {
    const explanation = await callGLM(system, user, 500);
    if (!explanation) {
      return NextResponse.json({ error: "We couldn't explain that paper right now." }, { status: 502 });
    }
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Paper Playground request failed", error);
    return NextResponse.json({ error: "We couldn't explain that paper right now." }, { status: 502 });
  }
}
