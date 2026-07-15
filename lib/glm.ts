// Minimal Z.ai GLM client for the daily brief and issue drafter.
// Uses the OpenAI-compatible chat completions endpoint. Set ZAI_API_KEY
// (from https://z.ai) to enable; callers degrade gracefully when unset.

const ZAI_ENDPOINT = "https://api.z.ai/api/paas/v4/chat/completions";
const MODEL = process.env.ZAI_MODEL ?? "glm-4.5";

export function glmConfigured(): boolean {
  return Boolean(process.env.ZAI_API_KEY);
}

export async function callGLM(
  system: string,
  user: string,
  maxTokens: number,
): Promise<string | null> {
  if (!process.env.ZAI_API_KEY) return null;

  const res = await fetch(ZAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ZAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: maxTokens,
      // GLM thinks by default and reasoning consumes max_tokens, which can
      // leave `content` empty on tight budgets. These generation tasks don't
      // need it — disable for predictable output.
      thinking: { type: "disabled" },
    }),
  });

  if (!res.ok) {
    console.error("GLM API error", res.status, await res.text().catch(() => ""));
    return null;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
}
