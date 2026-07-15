// Curated interview-prep tracks for Gen AI roles, organized by seniority.
// Static editorial content (edit freely); the live feeds on the page come
// from lib/radar.ts.

export type PrepLevel = {
  id: string;
  level: string;
  roles: string;
  summary: string;
  lookFor: string; // what interviewers are actually probing for
  topics: string[];
  questions: string[];
};

export const prepLevels: PrepLevel[] = [
  {
    id: "entry",
    level: "Entry level",
    roles: "New grad · Junior GenAI engineer · AI-adjacent SWE",
    summary:
      "At this level nobody expects you to have trained a frontier model. Interviews test whether your fundamentals are real (not just vocabulary) and whether you've actually built something with an LLM API, however small.",
    lookFor:
      "Solid intuition over buzzwords, one or two genuine projects you can defend line-by-line, and evidence you can learn fast. A well-explained toy RAG app beats a padded résumé every time.",
    topics: [
      "Transformer intuition: attention, context windows, why models hallucinate",
      "Tokenization & embeddings — what they are, cosine similarity, when embeddings fail",
      "Prompting techniques: few-shot, chain-of-thought, structured output",
      "Working with LLM APIs: temperature, top-p, max tokens, streaming, function calling",
      "Basic RAG: chunking, vector search, stuffing context",
      "Python + one framework (LangChain, LlamaIndex, or raw SDK) hands-on",
    ],
    questions: [
      "Explain attention to a smart non-engineer in under two minutes.",
      "What does temperature actually change? When would you set it to 0?",
      "Why do LLMs hallucinate, and name two mitigations you could ship this week.",
      "Walk me through a project where you used an LLM API. What broke first?",
      "You need semantic search over 10k documents — sketch the pipeline.",
      "What's the difference between fine-tuning and prompting? When is each wrong?",
    ],
  },
  {
    id: "mid",
    level: "Mid level",
    roles: "GenAI engineer · ML engineer · Applied scientist (2–5 yrs)",
    summary:
      "The bar shifts from 'can you use an LLM' to 'can you ship and operate an LLM feature'. Expect deep dives on RAG quality, fine-tuning trade-offs, evaluation, and the cost/latency realities of production.",
    lookFor:
      "Trade-off reasoning with numbers attached. Interviewers want scars from production: an eval you built, a retrieval pipeline you debugged, a cost you cut. 'It depends' answers must end with a decision.",
    topics: [
      "RAG beyond the demo: chunking strategy, hybrid search, re-ranking, retrieval evals",
      "Fine-tuning: LoRA/QLoRA vs full fine-tune vs RAG vs prompt — decision framework",
      "Evaluation: golden sets, LLM-as-judge (and its failure modes), regression testing",
      "Serving economics: token costs, caching, batching, quantization (GGUF, AWQ)",
      "Structured output & tool calling reliability; retries, validation, fallbacks",
      "Agent basics: tool use, planning loops, when agents are the wrong answer",
      "Guardrails: prompt injection, PII handling, content filtering",
    ],
    questions: [
      "Design RAG over a company's messy internal wiki. Where will quality die first?",
      "Your RAG answers are fluent but wrong. Diagnose: retrieval or generation?",
      "When would you fine-tune instead of RAG? Give a concrete case for each.",
      "How do you evaluate an LLM feature before launch — and after, in production?",
      "Cut this LLM feature's inference cost by 70% without killing quality. Go.",
      "A user makes your chatbot leak its system prompt. Walk through your defense layers.",
      "Explain LoRA to a backend engineer: what's trained, what's frozen, why it's cheap.",
    ],
  },
  {
    id: "senior",
    level: "Senior / Staff",
    roles: "Senior GenAI engineer · LLM platform/staff engineer · Architect",
    summary:
      "Interviews become system design and judgment under ambiguity: multi-team platforms, serving at scale, reliability, safety, and the organizational work of making AI systems maintainable by people other than you.",
    lookFor:
      "End-to-end ownership and the ability to say no. Strong candidates bring an opinionated architecture, quantify it (tokens/sec, p99, $/query), name its failure modes unprompted, and show they've grown other engineers.",
    topics: [
      "LLM serving at scale: vLLM/TGI, continuous batching, KV-cache management, GPU utilization",
      "Platform design: model routing, A/B-ing models, versioning prompts like code",
      "Multi-agent orchestration: state, retries, human-in-the-loop, failure isolation",
      "Observability: tracing LLM calls, drift detection, feedback loops, incident response",
      "Safety & governance at the system level: red-teaming, permissioning agents, audit trails",
      "Build-vs-buy and model strategy: open weights vs API, exit costs, data leverage",
      "Leading through others: design reviews, mentoring, cross-org alignment",
    ],
    questions: [
      "Design the serving stack for a 10M-DAU assistant. Walk the request end to end.",
      "An agent platform for a bank: how do you bound what agents can do, and prove it?",
      "Model your feature's unit economics: $/query today, and your plan to halve it.",
      "A model upgrade silently regressed a downstream team's feature. What do you change so it never happens again?",
      "Open-weights on your GPUs vs a frontier API: make the call for your org and defend it.",
      "Your org has 12 teams calling LLMs ad-hoc. Design the platform — and the migration.",
      "Tell me about a technical decision you reversed. What did it cost, and what did you learn?",
    ],
  },
  {
    id: "leadership",
    level: "Leadership",
    roles: "AI product manager · Head of AI · Director / VP",
    summary:
      "The technology questions get easier; the judgment questions get harder. Interviews test whether you can pick the right problems, resource them, govern the risk, and translate between the board and the builders.",
    lookFor:
      "Business-outcome thinking with technical credibility. Great answers tie every AI initiative to a metric someone outside the AI team cares about, and treat risk/governance as a design input, not paperwork.",
    topics: [
      "AI strategy: use-case portfolio, sequencing, build/buy/partner, moats and data flywheels",
      "Measuring success: leading vs lagging metrics for AI features, when to kill a project",
      "Governance & compliance: EU AI Act awareness, model risk, incident playbooks",
      "Org design: platform vs embedded AI teams, hiring profiles, managing researchers vs engineers",
      "Vendor & model strategy: negotiating with providers, avoiding lock-in, cost forecasting",
      "Responsible AI as product policy: hallucination tolerance by use case, human oversight",
      "Narrative: communicating AI progress honestly to execs, boards, and customers",
    ],
    questions: [
      "You have budget for 3 of 10 proposed GenAI initiatives. Show me your selection framework.",
      "How do you measure whether an AI feature is actually working — beyond usage graphs?",
      "Legal asks: 'can we guarantee the model never gives financial advice?' Your answer?",
      "Design the AI org for a 2,000-person company starting mostly from zero.",
      "Your flagship AI feature hallucinated publicly and it's in the press. First 48 hours?",
      "A team wants six months to fine-tune a custom model; an API call gets 90% of the value today. Decide.",
      "How do you keep AI strategy honest when the board wants 'agents everywhere' by Q3?",
    ],
  },
];

export const prepTips = [
  {
    title: "Bring one system you know cold",
    body: "Every level of interview goes better anchored to a real system you built or ran. Depth on one beats breadth on ten — expect five 'why' questions deep.",
  },
  {
    title: "Numbers are the difference",
    body: "Latency, cost per query, eval scores, adoption. Candidates who quantify are remembered as senior regardless of title.",
  },
  {
    title: "Read the room's incentives",
    body: "Startups probe shipping speed and scrappiness; big tech probes scale and safety; consultancies probe communication. Same question, different rubric.",
  },
  {
    title: "Stay current — it's checked",
    body: "Interviewers increasingly ask about this month's releases and papers. Ten minutes a day on a radar (ahem) compounds into easy credibility.",
  },
];
