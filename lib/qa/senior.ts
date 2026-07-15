import type { QA } from "./types";

// Senior / Staff: senior GenAI engineer, LLM platform engineer, architect.
export const seniorQA: QA[] = [
  {
    q: "Design the serving stack for a 10M-DAU assistant. Walk the request end to end.",
    a: "Edge: auth, rate limits, abuse screening. Gateway: request classification and model routing (cheap model for simple intents, frontier for hard ones), prompt assembly with versioned templates, cache checks (exact + prefix). Inference: vLLM-class servers with continuous batching and paged KV cache for self-hosted paths, plus API providers behind a unified interface with circuit breakers; streaming throughout. Post: guardrail filters, structured-output validation, telemetry (tokens, cost, trace). State: conversation store with tiered memory summarization. Capacity: model peak concurrent decodes, TTFT SLOs drive GPU count; autoscale on queue depth. Close with failure modes: provider outage → fallback tier, cache stampede → request coalescing, long-context abusers → token budgets.",
  },
  {
    q: "How does continuous batching actually work, and why did it replace static batching?",
    a: "Static batching waits to fill a batch, runs it to completion, and pads short sequences — GPUs idle on padding and everyone waits for the longest generation. Continuous (in-flight) batching schedules at the iteration level: each decode step, finished sequences exit and queued requests join immediately, keeping the GPU saturated. Combined with paged KV cache (vLLM's contribution — virtual-memory-style non-contiguous cache blocks eliminating fragmentation), it typically yields 2–4x throughput at better tail latency. This is the single most important serving concept at staff level.",
  },
  {
    q: "Explain KV-cache memory math and why it dominates serving capacity.",
    a: "Every generated token attends over all prior tokens, so you cache per-token key/value tensors: memory ≈ 2 × layers × kv_heads × head_dim × bytes × tokens per sequence. For a 70B-class model this lands around 300KB+ per token — a 32k-token conversation holds ~10GB of cache, competing with weights for HBM. Concurrency is therefore bounded by cache, not compute. Levers: grouped-query attention (fewer KV heads), cache quantization, paged allocation, prefix sharing for common system prompts, and context caps. If you can do this arithmetic on a whiteboard, the room relaxes.",
  },
  {
    q: "When do you self-host open-weight models vs use API providers? Give the actual decision framework.",
    a: "Quantify three axes. Economics: self-hosting wins when utilization is high and sustained — idle GPUs invert the math; compute break-even tokens/day against committed hardware. Control: data residency, fine-tuned checkpoints, latency floors, version pinning — if any is a hard requirement, APIs lose. Capability: if only frontier API models clear your quality bar, the decision is made for you. Most real orgs land hybrid: self-hosted fine-tuned small models for high-volume narrow tasks, API frontier models for the long tail. Present it as a portfolio, not a religion — and name the exit costs both directions.",
  },
  {
    q: "Design a model-routing layer. What signals route a request, and how do you keep it honest?",
    a: "Signals: task type (classifier or explicit product surface), prompt complexity heuristics, user tier, latency budget, and historical difficulty for similar queries. Route to a ladder: small local → mid API → frontier, with escalation on low confidence or failed validation. Keeping it honest is the hard part: per-route eval sets so you know cheap-route quality; shadow-sampling a percent of cheap-routed traffic through the expensive model to measure the quality gap continuously; drift alarms on escalation rate. Anti-pattern to name: routing on token count alone — short prompts are often the hardest.",
  },
  {
    q: "Your org has 12 teams calling LLMs ad-hoc. Design the platform — and the migration.",
    a: "Platform: a gateway service owning auth, model catalog, routing, caching, rate/cost quotas per team, prompt registry with versioning, unified telemetry, and guardrail middleware — teams get an SDK and stop holding provider keys. Paved road, not a cage: escape hatches for legitimate special cases. Migration is the senior half: inventory usage via provider billing and code search, migrate the two highest-spend teams first (they fund the ROI story), make the gateway strictly easier than direct calls, publish cost dashboards that make finance your ally, then deprecate direct keys on a dated schedule with exemptions requiring sign-off. Force through policy only after winning through product.",
  },
  {
    q: "A model upgrade silently regressed a downstream team's feature. What do you change so it never happens again?",
    a: "Treat models like dependencies: pin versions explicitly, never float on 'latest'. Publish upgrades through the platform with a deprecation calendar. Each consuming team registers an eval contract — their golden set runs automatically against candidate model versions in CI, producing a per-team pass/fail before any rollout. Roll out canary-first with automatic rollback on eval or production-metric regression. The cultural fix matters as much: the platform team owns providing the harness; consuming teams own their eval content. 'We upgraded and hoped' becomes structurally impossible.",
  },
  {
    q: "Design multi-agent orchestration for a real workflow — say, insurance claim processing. Where does it fail?",
    a: "Structure: an orchestrator (explicit state machine, not a free-form LLM loop) coordinating specialist agents — intake extraction, policy lookup, fraud signals, adjudication draft — each with least-privilege tools and its own eval. State persisted per step, idempotent and resumable; every hop traced. Human checkpoints at legally meaningful decisions. Failure modes to volunteer: error propagation (bad extraction poisons everything → validate at boundaries), runaway loops (hard step/token budgets), inter-agent 'telephone' distortion (pass structured artifacts, not prose), and the ops truth that debugging distributed LLM state without traces is archaeology. Senior signal: proposing the boring state machine over the exciting autonomous swarm.",
  },
  {
    q: "How do you bound what an agent can do — technically, not aspirationally?",
    a: "Capability confinement in code: tools are allowlisted per agent per context; parameters validated against schemas with no raw SQL/URL/shell construction from model text; the agent acts under the end user's identity and scopes, never a super-service-account; mutating actions require idempotency keys and, above a risk threshold, human approval; egress restricted to declared endpoints; budgets on steps, tokens, wall clock, and spend enforced by the runtime. Log every tool call immutably for audit. The prompt can ask the agent to behave; only the sandbox makes it true.",
  },
  {
    q: "Model your feature's unit economics: $0.04/query today, and your plan to halve it.",
    a: "Decompose first: input vs output tokens, retries, judge calls, retrieval infra amortization — the breakdown usually surprises. Typical plan: prefix caching on the shared system prompt (25–40% of input spend at many shops), route the easy 60% of queries to a model at a tenth the price after eval proves parity, cap and tighten outputs (verbosity is pure cost), distill the narrow high-volume path onto a fine-tuned small model, and move async work to batch APIs at half price. Sequence by effort-to-savings, re-run quality evals at each step, and report the curve weekly. Halving is usually conservative.",
  },
  {
    q: "What does LLM observability mean beyond logging? Design the trace.",
    a: "A request becomes a tree: user turn → prompt assembly (template version, variables) → retrieval spans (query, chunk IDs, scores) → model call (model+version, params, token counts, cost, TTFT) → tool calls with arguments/results → guardrail verdicts → final response, all under one trace ID joined to user feedback and judge scores arriving later. On top: distribution monitors (refusal rate, output length, parse failures, sentiment of feedback) with drift alerts, cost by feature/team/model, and replay — the ability to re-run any historical trace against a new prompt or model. Replay is the capability that turns incidents from anecdotes into experiments.",
  },
  {
    q: "Design your red-teaming and safety-testing program for a customer-facing assistant.",
    a: "Layers: a maintained adversarial suite (injection, jailbreaks, PII extraction, brand-damage prompts) run in CI against every prompt/model change; automated attack generation using an attacker LLM to mutate known exploits; periodic human red-team sprints, ideally with domain experts for regulated surfaces; and production monitoring for exploit signatures with an incident path. Findings become permanent regression tests. Report a coverage map — attack classes × surfaces — to make gaps visible. Key senior point: red-teaming is a program with an owner and cadence, not a pre-launch event.",
  },
  {
    q: "How do you run incident response when the model is the thing misbehaving?",
    a: "Same discipline as any sev process, plus model-specific moves. Immediate: kill switch or rollback to prior prompt/model version (which requires versioned deploys), tighten guardrails, or degrade to a safe scripted mode. Diagnose from traces: what changed — model version, prompt, retrieval index, traffic mix? Model incidents are often data incidents. Comms: user-facing honesty if outputs were harmful. Postmortem adds the failing case to evals and asks 'why didn't our evals catch this' — the eval gap is the real root cause. Have severity tiers defined for output harms in advance, not during.",
  },
  {
    q: "Fine-tuning at org scale: design the pipeline from data to deployed adapter.",
    a: "Data: capture production traces with outcomes, filter by quality signal (accepted answers, high ratings), dedupe and decontaminate against eval sets, PII-scrub, version datasets like code. Training: reproducible configs (base model hash, LoRA hyperparams, seed), tracked in an experiment system, with automatic eval harness runs — task metrics plus safety regressions. Registry: adapters versioned with lineage to dataset and base model. Deploy: canary behind the router, A/B against the incumbent, rollback wired. The differentiator is treating datasets as versioned, tested artifacts — most orgs version code and models but let data rot.",
  },
  {
    q: "When does RAG become insufficient and you need a different architecture?",
    a: "RAG assumes answers live in retrievable passages. It breaks on: aggregate questions ('how many contracts expire in Q3' → needs structured queries over a DB, so route to text-to-SQL or a semantic layer), multi-hop synthesis across many documents (needs iterative retrieval or agentic search), reasoning over tables/numbers (extract to structured form first), and freshness beyond index cadence (stream updates or query live systems). Senior answer: classify the query taxonomy up front and build routes — one retrieval pipeline pretending to be all things is the root of most 'RAG is bad' complaints.",
  },
  {
    q: "Design evaluation infrastructure as a platform capability, not a per-team script.",
    a: "Components: dataset registry (versioned golden sets per feature, with lineage and refresh policies), scorer library (exact checks, rubric judges with calibration data, safety suites), execution service (run any prompt/model/dataset combo, CI-triggered, cached), results store with regression detection and dashboards, and production sampling that routes real traffic into human-labeling queues to keep sets fresh. Teams bring content; platform brings machinery. Gate: no deploy without a green eval run, enforced in CI. This is the highest-leverage platform investment after the gateway itself.",
  },
  {
    q: "How do you think about latency budgets in a multi-step LLM pipeline?",
    a: "Set the user-facing budget first (e.g., first token < 800ms, complete < 6s), then allocate backwards: auth/routing 50ms, retrieval 150ms, re-rank 100ms, prefill+first-token 400ms, leaving headroom. Attack the sequential chain: parallelize retrieval with classification, speculative-start generation optimistically, stream everything streamable, and cache aggressively at each stage. Watch p99, not p50 — tail latency comes from provider queueing and long prompts. And push back on steps that don't earn their latency: every 'quick validation call' is 300ms someone must fund.",
  },
  {
    q: "What's your framework for build-vs-buy on the GenAI stack (gateway, evals, vector DB, observability)?",
    a: "Score each layer on: differentiation (does custom win us anything users notice?), integration cost with our stack, data sensitivity, vendor maturity/churn risk in a young market, and exit cost. General posture in 2026: buy or adopt OSS for vector storage and observability plumbing (commodities), be cautious with all-in-one agent platforms (highest churn, deepest lock-in), and own the thin layers where your logic lives — prompt registry, routing policy, eval content. Always own your data schemas and traces even when tools are bought; that's what makes switching survivable.",
  },
  {
    q: "A team wants to ship an autonomous agent that files changes to production configs. What do you require?",
    a: "A staged autonomy ladder with evidence at each rung. Rung 1: agent proposes, human applies — measure proposal acceptance rate. Rung 2: agent applies to staging with automated validation. Rung 3: production with human approval per change. Rung 4: auto-apply for a narrow, allowlisted change class with instant rollback and anomaly-triggered freeze. Requirements throughout: full audit trail, idempotent operations, blast-radius caps, tested rollback, and an owner on call. The message to the team: autonomy is earned by accumulated evidence, not granted by enthusiasm.",
  },
  {
    q: "How do you detect and handle model/data drift in production LLM systems?",
    a: "Three drift surfaces. Input drift: monitor query distributions (topics, length, language) — new user cohorts break prompts tuned on old ones. Model drift: provider-side silent updates — catch with a daily canary probe set with alarms on score deltas. Quality drift: rolling judge scores and feedback rates on sampled production traffic, segmented by feature. Handling: alarms route to owners with replay links; fixes are prompt/routing/retrieval changes validated on the eval suite. The discipline is the same as SRE golden signals — you just have to define the golden signals for meaning, not only latency.",
  },
  {
    q: "Explain prefix caching and where it changes architecture decisions.",
    a: "Providers and serving engines cache the KV state of repeated prompt prefixes, charging heavily discounted rates (or compute) for cached tokens. Consequence: prompt structure becomes an economic decision — put stable content (system prompt, tool schemas, few-shot examples) first and identical across requests; put volatile content (user query, retrieved chunks) last. Teams have cut input costs 40%+ by reordering prompts. It also favors fewer, larger shared system prompts over per-feature variants — a real tension with prompt specialization that you should manage deliberately.",
  },
  {
    q: "How would you architect for provider outages and model deprecations?",
    a: "Abstraction: all calls through your gateway with a provider-agnostic interface; prompts and evals stored provider-neutral. Redundancy: a qualified fallback model per critical route — qualified means it passed the route's eval, not just 'exists' — with circuit breakers and automatic failover, plus degraded modes (cached answers, scripted responses) when all else fails. Deprecations: subscribe to provider calendars, and your eval infrastructure makes re-qualification on a successor model a routine week, not a fire drill. Test failover quarterly like any DR plan; an untested fallback is a hypothesis.",
  },
  {
    q: "What changes in your architecture when conversations become truly long-running (weeks, not turns)?",
    a: "Memory becomes a first-class subsystem: verbatim recent turns, running summaries, and extracted structured facts (entities, preferences, commitments) in queryable storage, retrieved per turn — with provenance so wrong 'memories' can be corrected or expired. New problems: memory poisoning (user or injected content planting false facts — validate before persisting), privacy (right-to-forget must actually delete derived memories), cross-session identity, and eval methodology shifting to scripted long-horizon scenarios. Cost: memory retrieval per turn must be budgeted like any retrieval. Most 'agent memory' products are this subsystem with branding.",
  },
  {
    q: "You're asked to cut GPU spend 40% on the self-hosted fleet without capacity loss. Playbook?",
    a: "Measure first: most fleets run under 40% utilization, so the headroom usually exists. Levers: consolidate models (three fine-tuned variants → one adapter-swapped base with LoRA hot-loading), quantize weights and KV cache after eval sign-off, right-size — 70B doing a 7B's job is common, raise batch limits and enable chunked prefill to lift utilization, autoscale aggressively on off-peak, move burst work to spot/batch, and renegotiate committed-use pricing with the utilization data. Deliver as a measured sequence with eval gates, presenting utilization dashboards before and after — finance remembers graphs.",
  },
  {
    q: "How do you review a design doc for an LLM feature? What do you look for that others miss?",
    a: "Beyond standard design review: Where's the eval set, and was it built before the architecture hardened? What's the failure UX — what does the user see when the model is wrong, slow, or refuses? Cost model per request at projected volume, including retries and judges? Injection surface — what untrusted text reaches the prompt, and what can the output trigger? Version/rollback story for prompts and models? Data flows — what leaves our boundary, what's logged? And the meta-question: does this need an LLM at all, or is 20% of it deterministic code the doc is avoiding? Asking those calmly is the staff-engineer job description.",
  },
  {
    q: "Describe scaling laws and Chinchilla-optimal training in terms relevant to decisions today.",
    a: "Scaling laws: loss falls predictably with compute, parameters, and data. Chinchilla's correction: most early large models were undertrained — for a fixed compute budget, optimal training uses roughly 20x tokens per parameter, so smaller-but-longer-trained beats bigger-but-starved. Today's relevance: it explains why 7–9B models trained on 10T+ tokens punch far above their size, why frontier labs push data quality/synthesis over parameter count, and it grounds your intuition that a well-trained small model plus fine-tuning is often the rational choice for narrow production tasks.",
  },
  {
    q: "What is Mixture-of-Experts serving and how does it change infrastructure math?",
    a: "MoE models activate a few expert subnetworks per token instead of all parameters — e.g., 8 of 64 experts — giving frontier-quality output at a fraction of the FLOPs. Infrastructure catch: all experts must sit in memory even though few compute per token, so VRAM requirements track total parameters while throughput tracks active parameters. Consequences: memory-rich serving nodes, expert-parallel sharding across GPUs, and batching efficiency depends on expert routing balance. If you're evaluating open-weight MoE models for self-hosting, budget memory for the full model, not the 'active' marketing number.",
  },
  {
    q: "How do you technically enforce data boundaries in a multi-tenant RAG platform?",
    a: "Isolation at every layer, verified not assumed. Storage: per-tenant namespaces or partitions in the vector store; tenant ID mandatory in every query path, enforced by the data-access layer, never composed from model output. Retrieval: filters applied server-side pre-search where the engine supports it. Prompt: only the requesting tenant's chunks enter context — cross-tenant leakage via cache keys is a classic bug, so cache keys include tenant. Testing: automated cross-tenant probe suites in CI attempting to retrieve tenant A's data as tenant B. Plus per-tenant encryption keys and deletion certification. Auditors will ask for exactly this list.",
  },
  {
    q: "When and how do you introduce a semantic layer between LLMs and company data?",
    a: "When text-to-SQL against raw schemas starts hallucinating joins and metric definitions — which is immediately, for any nontrivial warehouse. The semantic layer defines governed entities and metrics ('active customer', 'net revenue') that the LLM targets instead of raw tables: smaller correct-by-construction surface, consistent definitions, permission-aware. Implementation: metric store or dbt-style definitions exposed as typed functions/tools; the model selects and parameterizes, never free-writes SQL. Quality jumps because the search space collapses. It's also an organizational forcing function — someone must finally own the metric definitions.",
  },
  {
    q: "Tell me about a technical decision you reversed. What did it cost and what did you learn?",
    a: "Rubric, not script: a real reversal with numbers (weeks spent, dollars, team churn), the signal that triggered reconsideration, how you decided — new evidence vs sunk-cost honesty — and the structural change since (spike-first policy, decision records with revisit dates, cheaper kill criteria). Strong senior candidates reverse decisions on evidence and build systems that make future reversals cheaper. If your example makes you look mildly foolish and clearly wiser, it's working.",
  },
  {
    q: "How do you mentor mid-level engineers on LLM work specifically?",
    a: "The recurring gaps: shipping without evals (pair on building the golden set for their feature — once), trusting demos (teach the adversarial habit: break your own feature before review), prompt-tweaking loops without hypotheses (require a one-line hypothesis per change), and framework magic (have them build one pipeline raw before adopting abstractions). Structure: design-doc review before code, failure-analysis sessions on production traces together, and rotating eval-set ownership. The goal is transferring judgment — the checklist above is just the syllabus.",
  },
  {
    q: "Design guardrails so a support agent can issue refunds — safely.",
    a: "The refund tool, not the model, owns policy: hard caps per transaction and per customer per period, eligibility rules evaluated in code against order data, velocity limits, and fraud signals — the model can only request a refund the tool independently verifies. Above thresholds: queue for human approval with the agent's reasoning attached. Every action logged with full context; anomaly detection on refund-rate spikes with automatic freeze. Prompt-level instructions are UX polish here, not control. One-liner for the room: the model drafts intent; deterministic systems adjudicate money.",
  },
  {
    q: "What's your approach to capacity planning for a new LLM feature launch?",
    a: "Model the load: expected DAU × sessions × turns × tokens-per-turn (with distribution, not just means), plus retry/judge/tool multipliers. Map to provider limits — TPM/RPM quotas are the real constraint; request raises weeks ahead with justification. For self-hosted: concurrent-decode capacity from KV-cache math, plus headroom for tails. Load-test with realistic prompt lengths (short synthetic prompts lie), and pre-negotiate burst behavior: queue with UX feedback, degrade to smaller models, or shed low-priority traffic. Launches die on quota errors more often than on quality.",
  },
  {
    q: "How should embeddings, indexes, and models be versioned together?",
    a: "As a compatibility triple: an index is valid only for the embedding model that built it, and downstream prompts are tuned for a retrieval distribution. Version manifest per deployment: {embedding_model, index_snapshot, reranker, prompt_version, generator_model} — promoted and rolled back as a unit, tested as a unit in evals. Migrations run as parallel stacks with shadow comparison, never in-place mutation. Sounds bureaucratic until the first time someone re-embeds half a corpus with a new model and retrieval silently degrades for weeks — tell that story if you have it.",
  },
  {
    q: "What organizational failure modes have you seen in AI platform efforts, and how do you preempt them?",
    a: "The greatest hits: platform built in isolation that no team asked for (preempt: build for two committed customer teams first), governance so heavy teams route around it (make the paved road genuinely faster), eval theater (metrics chosen to pass, not to inform — require production sampling), hero prompting (one person's head holds the system — enforce registries and docs), and pilot purgatory (no kill/scale criteria — set them at kickoff). Naming these fluently signals you've actually operated at org scale rather than read about it.",
  },
  {
    q: "How do you decide between extending context vs improving retrieval when users complain about missing information?",
    a: "Diagnose which failure it actually is: if the needed passage exists but isn't retrieved, it's recall — fix chunking, hybrid search, re-ranking, k. If it's retrieved but ignored, it's utilization — reduce noise, reorder context (edges beat middle), tighten prompts. If information genuinely spans more than fits, then consider larger context — with eyes open about cost scaling and lost-in-the-middle effects, and prefer iterative retrieval or summarization pyramids first. Run the cheap diagnostics before paying the big-context tax; most 'we need 1M context' requests are retrieval bugs wearing a costume.",
  },
  {
    q: "What does responsible deployment mean concretely for a feature that drafts legal or medical text?",
    a: "Human-in-the-loop as architecture, not disclaimer: the professional reviews and owns every output, and the UX makes review real (diffs, citations to sources, confidence flags) rather than a rubber stamp. Scope constraints enforced in code — no final-advice pathways. Provenance logging for liability. Domain-expert evals with unacceptable-error taxonomies defined by practitioners, not engineers. Refusal and escalation paths tested as hard as the happy path. And regulatory awareness: know whether your jurisdiction treats this as a regulated activity. The framing that lands: the system's job is to make the expert faster and more consistent — never to be the expert.",
  },
  {
    q: "A frontier lab releases a model that makes your fine-tuned pipeline obsolete. How do you respond, organizationally and technically?",
    a: "First, verify 'obsolete' with your own evals — marketing benchmarks routinely don't transfer. If it's real: this is why you built provider-agnostic gateways, versioned prompts, and eval harnesses — re-qualification should be days. Migrate routes where the new model wins on quality-per-dollar; keep fine-tuned paths where economics still favor them (high-volume narrow tasks usually do). Organizationally, normalize it: model churn is the environment, so celebrate the team whose abstraction made switching cheap rather than mourning the pipeline. Your moat was never the model — it's data, evals, and integration.",
  },
  {
    q: "Design the data flywheel for a GenAI product — how does usage make the product better, mechanically?",
    a: "Instrument outcomes, not just interactions: which answers were accepted, edited, escalated, or abandoned — edits are gold (implicit corrections). Pipeline: production traces → quality filtering → human labeling queues for ambiguous cases → versioned datasets feeding evals (continuous) and fine-tuning (periodic) → deployed improvements → better outcomes, measured against holdouts. Governance built in: consent and privacy filters at ingestion, decontamination against eval sets, and drift review of what you're learning. The mechanical detail matters — 'we learn from usage' without an edit-capture pipeline is a slide, not a flywheel.",
  },
  {
    q: "How do you keep prompt and pipeline complexity from compounding into an unmaintainable system?",
    a: "The same forces as microservice sprawl, faster. Disciplines: a prompt registry with owners and deprecation dates; composition over accretion (shared base prompts with feature overlays, not 4,000-word monoliths); ablation reviews quarterly — every instruction must justify itself against the eval or die; pipeline stages must each have a measurable contribution (delete stages that don't move evals); and architectural review for any new model call added to a flow. Budget 'prompt debt' cleanup like tech debt. Entropy is the default; the staff engineer's job is being the counterforce with data.",
  },
  {
    q: "What do you look for when hiring GenAI engineers, and what's a red flag?",
    a: "Look for: evidence of shipping and operating (talks about evals, cost, failure modes unprompted), tool-agnostic fundamentals (can explain retrieval or fine-tuning without naming a framework), calibrated claims ('this worked here, failed there'), and fast learning demonstrated across the field's churn. Red flags: framework-first identity ('I'm a LangChain developer'), demo-portfolio without production scars, benchmark-brained reasoning, and certainty — anyone who's operated LLM systems has been humbled by them. The interview question behind the question: would this person add judgment or just enthusiasm.",
  },
];
