import { NextResponse } from "next/server";
import { callGLM, glmConfigured } from "@/lib/glm";

const MAX_MESSAGES = 8;

type CoachRequest = {
  action?: "start" | "coach";
  session?: { role?: string; experience?: string; focus?: string; context?: string };
  messages?: { role?: "coach" | "candidate"; text?: string }[];
  candidateAnswer?: string;
};

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  if (!glmConfigured()) {
    return NextResponse.json(
      { error: "Interview Coach is not configured yet. Add ZAI_API_KEY to enable it." },
      { status: 503 },
    );
  }

  let body: CoachRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const role = clean(body.session?.role, 120) || "GenAI engineer";
  const experience = clean(body.session?.experience, 80) || "not specified";
  const focus = clean(body.session?.focus, 120) || "General mock interview";
  const context = clean(body.session?.context, 500) || "No additional job context provided.";
  const answer = clean(body.candidateAnswer, 6000);
  const history = Array.isArray(body.messages)
    ? body.messages
        .slice(-MAX_MESSAGES)
        .map((message) => `${message.role === "candidate" ? "Candidate" : "Coach"}: ${clean(message.text, 6000)}`)
        .join("\n\n")
    : "";

  if (body.action !== "start" && (!answer || !history)) {
    return NextResponse.json({ error: "An interview answer is required." }, { status: 400 });
  }

  const system = `You are a rigorous, encouraging interview coach. Run a realistic mock interview for this candidate:
- Target role: ${role}
- Experience: ${experience}
- Focus: ${focus}
- Context: ${context}

${
    body.action === "start"
      ? "Ask exactly one tailored opening interview question. Do not provide an answer, rubric, or extra questions."
      : `Give concise, candid feedback on the candidate's latest answer in this exact structure:
Strengths:
- ...

Make it stronger:
- ...

A sharper version:
<brief example outline, never a full scripted answer>

Follow-up question:
<exactly one probing question>

Assess evidence and trade-offs, not confidence or personality.`
  }`;

  const user =
    body.action === "start"
      ? "Begin the mock interview."
      : `Conversation so far:\n${history}\n\nThe candidate just answered:\n${answer}\n\nCoach the answer and continue the interview.`;

  try {
    const reply = await callGLM(system, user, 900);
    if (!reply) {
      return NextResponse.json(
        { error: "The coach is unavailable right now. Please try again shortly." },
        { status: 502 },
      );
    }
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Interview Coach request failed", error);
    return NextResponse.json(
      { error: "The coach is unavailable right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
