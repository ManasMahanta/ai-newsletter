// Curated model tracker — editorially maintained, not API-fetched.
// Anthropic rows sourced from official docs (cached 2026-06-24); other
// providers last reviewed on the date below. Edit freely; the /models
// page renders whatever is here.

export const modelsLastReviewed = "2026-07-15";

export type TrackedModel = {
  name: string;
  provider: string;
  context: string;
  inputPrice: string; // $ per 1M input tokens
  outputPrice: string; // $ per 1M output tokens
  openWeights: boolean;
  bestFor: string;
};

export const trackedModels: TrackedModel[] = [
  {
    name: "Claude Fable 5",
    provider: "Anthropic",
    context: "1M",
    inputPrice: "$10.00",
    outputPrice: "$50.00",
    openWeights: false,
    bestFor: "Hardest reasoning and long-horizon agentic work; always-on thinking",
  },
  {
    name: "Claude Opus 4.8",
    provider: "Anthropic",
    context: "1M",
    inputPrice: "$5.00",
    outputPrice: "$25.00",
    openWeights: false,
    bestFor: "Flagship coding and agentic work; long autonomous runs",
  },
  {
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    context: "1M",
    inputPrice: "$3.00 ($2 intro)",
    outputPrice: "$15.00 ($10 intro)",
    openWeights: false,
    bestFor: "Near-Opus coding quality at Sonnet cost; the volume workhorse",
  },
  {
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    context: "200K",
    inputPrice: "$1.00",
    outputPrice: "$5.00",
    openWeights: false,
    bestFor: "Fast, cheap classification, extraction, and routing",
  },
  {
    name: "GPT-5.x (latest)",
    provider: "OpenAI",
    context: "400K+",
    inputPrice: "verify",
    outputPrice: "verify",
    openWeights: false,
    bestFor: "General-purpose flagship; broad ecosystem and tooling",
  },
  {
    name: "o-series (reasoning)",
    provider: "OpenAI",
    context: "200K+",
    inputPrice: "verify",
    outputPrice: "verify",
    openWeights: false,
    bestFor: "Hard math, science, and multi-step reasoning at higher latency",
  },
  {
    name: "Gemini 3 Pro",
    provider: "Google",
    context: "1M+",
    inputPrice: "verify",
    outputPrice: "verify",
    openWeights: false,
    bestFor: "Very long context, multimodal breadth, Workspace integration",
  },
  {
    name: "Llama 4 family",
    provider: "Meta",
    context: "up to 1M+",
    inputPrice: "self-host",
    outputPrice: "self-host",
    openWeights: true,
    bestFor: "Open-weights general models; fine-tuning base for enterprises",
  },
  {
    name: "DeepSeek V3.x / R1",
    provider: "DeepSeek",
    context: "128K",
    inputPrice: "very low",
    outputPrice: "very low",
    openWeights: true,
    bestFor: "Open-weights reasoning at aggressive cost; MoE efficiency",
  },
  {
    name: "Qwen 3 family",
    provider: "Alibaba",
    context: "128K+",
    inputPrice: "self-host",
    outputPrice: "self-host",
    openWeights: true,
    bestFor: "Strong multilingual open weights across many sizes; agent tuning",
  },
  {
    name: "Mistral (Large / small)",
    provider: "Mistral",
    context: "128K",
    inputPrice: "verify",
    outputPrice: "verify",
    openWeights: true,
    bestFor: "European provider; efficient open and hosted models",
  },
  {
    name: "Gemma 3 family",
    provider: "Google",
    context: "128K",
    inputPrice: "self-host",
    outputPrice: "self-host",
    openWeights: true,
    bestFor: "Small open models that run on a single GPU or laptop",
  },
];
