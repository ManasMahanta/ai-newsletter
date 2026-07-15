import { NextResponse } from "next/server";
import { callGLM, glmConfigured } from "@/lib/glm";

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  if (!glmConfigured()) {
    return NextResponse.json(
      { error: "Paper-to-Project is not configured yet. Add ZAI_API_KEY to enable it." },
      { status: 503 },
    );
  }

  let body: { paper?: { title?: unknown; summary?: unknown }; level?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = clean(body.paper?.title, 300);
  const summary = clean(body.paper?.summary, 2000);
  const level = clean(body.level, 30);
  if (!title || !summary || !["Starter", "Intermediate", "Advanced"].includes(level)) {
    return NextResponse.json({ error: "A paper and project level are required." }, { status: 400 });
  }

  const system = `You are a practical AI project mentor. Turn the research idea in the supplied title and summary into one portfolio-ready ${level.toLowerCase()} project. The project must be achievable by one person in a weekend for Starter, a week for Intermediate, or two weeks for Advanced. Do not ask the learner to reproduce the paper or claim the summary proves details it does not contain. Prefer simple, inexpensive, locally runnable tools where possible. Write only in this exact format:\n\nProject:\n<one clear project title and 1-sentence goal>\n\nWhat you will learn:\n- <3 concise items>\n\nRecommended stack:\n- <3-5 tools, including a low-cost option where useful>\n\nWeekend MVP:\n- <4-6 ordered build steps>\n\nHow to know it works:\n- <2-3 concrete checks or test cases>\n\nStretch goals:\n- <2 optional extensions>\n\nPortfolio bullet:\n- <one honest résumé-style bullet with placeholders for real metrics>\n\nInterview prompts:\n- <3 questions a hiring manager could ask about this project>.`;
  const user = `Paper title: ${title}\n\nResearch summary: ${summary}`;

  try {
    const project = await callGLM(system, user, 900);
    if (!project) {
      return NextResponse.json({ error: "We couldn't create a project plan right now." }, { status: 502 });
    }
    return NextResponse.json({ project });
  } catch (error) {
    console.error("Paper-to-Project request failed", error);
    return NextResponse.json({ error: "We couldn't create a project plan right now." }, { status: 502 });
  }
}
