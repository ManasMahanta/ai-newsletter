import { NextResponse } from "next/server";
import { callGLM, glmConfigured } from "@/lib/glm";

export const maxDuration = 60;

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

// Turns a pasted job description into a tailored Gen-AI interview study plan
// that leans on this site's own resources (Q&A banks by level, the system
// design section, the AI coach, and the live open-roles feed).
export async function POST(request: Request) {
  if (!glmConfigured()) {
    return NextResponse.json(
      { error: "The prep planner isn't configured yet. Add ZAI_API_KEY to enable it." },
      { status: 503 },
    );
  }

  let body: { jd?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const jd = clean(body.jd, 6000);
  if (jd.length < 40) {
    return NextResponse.json(
      { error: "Paste a bit more of the job description (at least a few sentences)." },
      { status: 400 },
    );
  }

  const system = `You are an interview-prep strategist for Gen AI / Agentic AI roles. Given a job description, produce a focused, honest 1-2 week study plan. Do not invent requirements the JD doesn't state. Use only skills implied by the JD. Write in this exact format:

Role read:
<2 sentences: the seniority level (entry/mid/senior/leadership) you infer and the 2-3 things this specific role will test hardest>

Focus areas:
- <4-6 concrete topics to drill, each with a one-line why, ordered by importance>

Your 10-day plan:
- <6-8 day-by-day or block-by-block items; concrete actions, not vague advice>

Likely interview questions:
- <5 questions tailored to THIS role, mixing technical + system design where relevant>

One project to build:
<a single portfolio project that would most impress this employer, one sentence>

Red flags to prepare for:
- <2-3 gaps a candidate for this JD commonly has, and how to close them fast>

Keep it practical and specific to the JD. Zero hype words.`;

  try {
    const plan = await callGLM(system, `Job description:\n\n${jd}`, 1400);
    if (!plan) {
      return NextResponse.json(
        { error: "The planner is unavailable right now. Please try again shortly." },
        { status: 502 },
      );
    }
    return NextResponse.json({ plan });
  } catch (error) {
    console.error("prep-plan failed", error);
    return NextResponse.json(
      { error: "The planner is unavailable right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
