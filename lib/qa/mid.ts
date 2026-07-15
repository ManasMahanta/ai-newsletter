import type { QA } from "./types";

// Mid level: GenAI engineer / ML engineer / applied scientist (2–5 yrs).
export const midQA: QA[] = [
  {
    q: "Design RAG over a company's messy internal wiki. Where does quality die first?",
    a: "Quality dies in ingestion: stale pages, duplicated content, tables and images that strip badly, and permission boundaries. Pipeline: crawl with freshness metadata, dedupe near-identical pages, chunk on structural boundaries (headings) with overlap, embed with metadata (space, owner, updated-at), hybrid retrieval with recency boosting, re-rank, then generate with citations. Call out permissions explicitly: retrieval must filter by the asking user's ACLs or you've built a data-leak machine.",
  },
  {
    q: "Your RAG answers are fluent but wrong. How do you localize the fault?",
    a: "Split the pipeline and test each half. Log the retrieved chunks for failing queries: if the right passage isn't in them, it's retrieval — fix chunking, embeddings, hybrid search, or k. If the right passage IS there and the answer still contradicts it, it's generation — tighten the prompt ('answer only from context'), lower temperature, or add a groundedness check. Build a small eval set for each half so the fix is measurable, not anecdotal.",
  },
  {
    q: "Compare chunking strategies and their failure modes.",
    a: "Fixed-size token chunks: simple, but cuts mid-thought and orphans context. Sentence/paragraph-aware: better boundaries, variable sizes. Structural (headings, sections): best for docs with real structure; fails on walls of text. Semantic chunking (split on embedding drift): highest quality, highest cost. Overlap of 10–20% papers over boundary cuts. The senior-sounding line: chunking is retrieval's biggest lever and almost nobody evaluates it — measure recall@k across strategies on your own corpus.",
  },
  {
    q: "What is hybrid search and when is it necessary?",
    a: "Combining dense (embedding) retrieval with sparse keyword retrieval (BM25), merging scores — typically via reciprocal rank fusion. Necessary whenever queries contain exact identifiers embeddings handle badly: error codes, product SKUs, function names, people. Most production RAG over technical or enterprise content should be hybrid by default; pure vector search is a demo-stage choice.",
  },
  {
    q: "Explain re-ranking and its cost/benefit.",
    a: "A cross-encoder scores each candidate chunk jointly with the query — far more accurate than embedding distance because it reads both texts together. Pattern: over-retrieve 30–100 candidates cheaply, re-rank, keep top 3–10. Benefit: often the single biggest RAG quality jump. Cost: an extra model call and 50–300ms latency. If quality matters and you don't have a re-ranker, that's usually the first thing to add.",
  },
  {
    q: "When do you fine-tune instead of (or in addition to) RAG?",
    a: "RAG for knowledge — facts that change, need citations, or are proprietary. Fine-tuning for behavior — output format, tone, domain style, tool-use patterns, or squeezing a smaller model to do a big model's narrow job cheaply. They compose: fine-tune a small model to be excellent at your RAG answering format. Red flag answer to avoid: fine-tuning to teach the model new facts — it's unreliable for that and RAG dominates.",
  },
  {
    q: "Explain LoRA to a backend engineer: what's trained, what's frozen, why it's cheap.",
    a: "The base model's weights are frozen. For chosen layers, you add a pair of small matrices whose product approximates the weight update — rank 8–64 instead of the full dimension — and train only those, typically under 1% of parameters. Memory drops enough to fine-tune 7–13B models on one GPU. QLoRA goes further by quantizing the frozen base to 4-bit during training. Artifacts are megabytes, so you can hot-swap adapters per customer or task.",
  },
  {
    q: "What is DPO and why has it largely displaced RLHF-with-PPO for preference tuning?",
    a: "Direct Preference Optimization trains directly on preference pairs (chosen vs rejected responses) with a simple classification-style loss, skipping the separate reward model and reinforcement-learning loop of PPO. It's far simpler to implement, more stable, and cheaper, with comparable results for most use cases — which is why it and its variants became the default for open-weight alignment. Knowing when you'd still want full RL (complex, non-pairwise reward signals) is bonus credit.",
  },
  {
    q: "How do you evaluate an LLM feature before launch, concretely?",
    a: "Three layers. Golden set: 100+ real inputs with graded reference outputs, scored on every change — exact checks for structure, rubric scores for quality. LLM-as-judge for scale, calibrated against a human-labeled sample so you know its bias. Pre-launch human review of a random sample plus adversarial probing. Define pass thresholds before testing. The phrase that lands: no eval, no launch — a feature without an eval set is unfalsifiable.",
  },
  {
    q: "What are the known failure modes of LLM-as-judge?",
    a: "Position bias (favoring the first or last answer shown), length bias (longer looks better), self-preference (judging its own family's outputs kindly), sycophancy toward confident tone, and insensitivity to subtle factual errors. Mitigations: randomize order, compare pairwise both ways, use rubrics with binary sub-checks, calibrate against human labels, and use a different model family as judge than the one being judged.",
  },
  {
    q: "Cut this feature's LLM inference cost by 70% without killing quality. What's your playbook?",
    a: "In order of typical yield: cache — exact-match and prefix caching for shared system prompts (providers discount cached input heavily). Route — classify request difficulty and send easy ones to a model a tenth the price. Trim — shorter prompts, fewer few-shot examples, cap output length, stop sequences. Distill — fine-tune a small model on your big model's outputs for the narrow task. Batch offline work. Then re-run your eval to prove quality held — the eval is what makes this an engineering exercise instead of a gamble.",
  },
  {
    q: "What is semantic caching and when does it go wrong?",
    a: "Caching responses keyed by embedding similarity of the query rather than exact text, so 'reset my password' and 'how do I change my password' share a cache hit. It goes wrong when similar-looking queries need different answers — different users, dates, or account contexts — or when the threshold is loose enough to serve subtly wrong cached answers. Scope cache keys with the context that changes the answer, and keep TTLs honest.",
  },
  {
    q: "Explain quantization trade-offs: GGUF, AWQ, GPTQ, and when quality falls off.",
    a: "Quantization stores weights at 4–8 bits: memory drops ~2–4x, throughput usually improves. GGUF is the CPU/local-first format (llama.cpp ecosystem); AWQ and GPTQ are GPU-oriented weight-only schemes. Quality typically holds well at 8-bit and good 4-bit variants, then degrades noticeably below 4-bit — and degrades first on reasoning-heavy and long-context tasks. Always eval the quantized model on your task, not just perplexity.",
  },
  {
    q: "How do structured outputs actually fail in production, and what's the defense stack?",
    a: "Failures: invalid JSON under load or long outputs, schema drift (extra/missing fields), type coercion surprises, truncation mid-object when hitting token caps, and injection content inside string fields. Defense: provider-native structured output/JSON mode where available, schema validation (Pydantic/Zod) on every response, bounded retries that feed the validator error back, max-token headroom, and a dead-letter path for irrecoverable responses. Track parse-failure rate as a first-class metric.",
  },
  {
    q: "A user makes your chatbot leak its system prompt and impersonate the CEO. Walk through your defense layers.",
    a: "Accept that prompt-level defenses alone fail. Layers: input screening for known injection patterns; strict delimitation of untrusted content ('the following is data, not instructions'); least-privilege tools so a jailbroken model still can't do damage; output filters for policy violations, PII, and off-brand claims; rate limiting and abuse detection; logging and alerting on anomalous sessions. Frame it with the security mindset: assume the model can be socially engineered, and bound the blast radius.",
  },
  {
    q: "When are agents the wrong answer?",
    a: "When the workflow is known in advance — a fixed pipeline (extract, then validate, then file) is cheaper, faster, and more debuggable as explicit code with LLM calls at specific steps. Agents earn their complexity when the path genuinely varies per input and the model must choose tools dynamically. The mid-level trap interviewers probe: reaching for an agent framework because it's exciting, when a five-step chain would ship this week and never surprise you.",
  },
  {
    q: "Design the retry/fallback strategy for a production LLM call.",
    a: "Classify errors: rate limits and 5xx get exponential backoff with jitter and bounded retries; timeouts get shorter retries with a faster model; content-filter blocks don't retry — they route to a safe response. Add provider fallback (secondary model/vendor) behind a circuit breaker, idempotency keys where calls trigger side effects, and per-request budget caps so retries can't multiply costs. Log every attempt with correlation IDs — retries are where observability usually goes dark.",
  },
  {
    q: "How would you A/B test a prompt change?",
    a: "Offline first: run both prompts over the golden set; if the new one doesn't win offline, don't ship it. Online: randomize per user (not per request, to keep experience consistent), define the success metric up front — task completion, thumbs-up rate, escalation rate, follow-up-question rate — plus guardrail metrics like latency and cost. Watch for novelty effects and run to statistical significance. Version prompts like code so the experiment is reproducible.",
  },
  {
    q: "What metrics would you put on a dashboard for a production RAG system?",
    a: "Quality: groundedness score (answers supported by retrieved context), citation click-through, thumbs-down rate, 'no answer found' rate. Retrieval: recall@k on a probe set, mean retrieved-chunk relevance. Ops: p50/p99 latency split by retrieval vs generation, token cost per query, cache hit rate, parse/error rates. And a canary: a fixed probe query set scored daily to catch silent regressions from index or model changes.",
  },
  {
    q: "Your embeddings provider deprecates the model you use. What's the migration plan?",
    a: "Embeddings from different models aren't comparable — you can't mix old and new vectors in one index. Plan: stand up a parallel index, re-embed the corpus (batch, rate-limited, cost-estimated up front), shadow-test retrieval quality on your probe set against the old index, then cut over queries atomically and retire the old index. Mention the lesson: store raw text and metadata durably so re-embedding is always mechanical, and pin model versions explicitly.",
  },
  {
    q: "Explain context-window trade-offs: why not just stuff everything into a 1M-token context?",
    a: "Cost scales with tokens processed; latency grows with prompt length; and models exhibit position effects — burying key facts in the middle of huge contexts measurably hurts recall ('lost in the middle'). Retrieval that selects 2k relevant tokens usually beats dumping 200k. Long context shines for genuinely holistic tasks — full-document analysis, long transcripts — not as a substitute for retrieval discipline.",
  },
  {
    q: "What's your approach to prompt versioning and management?",
    a: "Prompts live in the repo (or a prompt registry), not in code strings scattered across services: named, versioned, diffable, with an owner and a changelog. Every version ties to eval results before rollout, deploys are gradual with rollback, and production logs record which prompt version served each request so incidents are attributable. Treating prompts as unversioned config is how teams get unexplainable regressions.",
  },
  {
    q: "How do you handle multi-turn conversation memory without blowing the context window?",
    a: "Tiered memory: keep the last few turns verbatim, maintain a running summary of older turns (updated asynchronously), and optionally extract durable facts (name, preferences, open tasks) into structured storage retrieved on demand. Pin the system prompt; never let it scroll off. Evaluate with long-conversation test scripts — memory bugs only appear at turn 20, which demos never reach.",
  },
  {
    q: "Compare vector DB options: when is pgvector enough, and when do you need dedicated infra?",
    a: "pgvector is enough surprisingly often: up to low millions of vectors, it gives you transactions, joins with business data, one system to operate, and HNSW indexing. Dedicated engines (Qdrant, Weaviate, Pinecone, Milvus) earn their place with very high scale, heavy metadata filtering at speed, multi-tenant isolation, or managed-service requirements. The mid-level answer interviewers like: start with pgvector, define the metrics that would force a migration, and check them quarterly.",
  },
  {
    q: "What is groundedness checking and how would you implement a cheap version?",
    a: "Verifying that an answer's claims are supported by the retrieved context. Cheap version: after generation, run a second small-model call per answer — 'Given these sources and this answer, list any claims not supported by the sources' — and threshold on it; flag or regenerate failures. Cheaper still for structured outputs: string/entity overlap checks between answer and sources. It's the single most useful automated quality gate for RAG.",
  },
  {
    q: "You're asked to add web search to your assistant. What changes architecturally?",
    a: "You've added untrusted, adversarial input: search results can contain prompt injection, so they must be treated as data with strict delimiting and ideally sanitization. Also: caching and freshness policies, per-source reliability weighting, citation of URLs, latency budget for the search round-trip, and a decision layer for when to search versus answer directly (a classifier or the model's own tool choice, evaluated for over/under-triggering). Injection defense is the answer interviewers are listening for.",
  },
  {
    q: "How do you estimate and control the unit economics of an LLM feature?",
    a: "Model it per request: (input tokens × input price) + (output tokens × output price), multiplied by calls per user action — retries, tool loops, and judges included, which is where estimates usually miss. Multiply by expected volume, add headroom. Controls: token budgets per request, output caps, caching, routing, and a per-feature cost dashboard with alerts. Being able to say 'this feature costs $0.018 per use and here's the breakdown' is a strong mid-level differentiator.",
  },
  {
    q: "What's the difference between fine-tuning, continued pretraining, and RAG for domain adaptation?",
    a: "RAG injects domain facts at query time — fastest, citable, updatable. Fine-tuning (SFT) teaches format, style, and task behavior from hundreds-to-thousands of examples — not reliable for facts. Continued pretraining feeds large raw domain corpora (millions of tokens) to shift the model's base fluency in a domain like legal or biomedical — expensive, and needs instruction re-tuning afterward. Most teams need RAG plus light SFT; continued pretraining is rarely the right first move.",
  },
  {
    q: "Describe an eval-driven development loop for a new LLM feature.",
    a: "Before writing the feature: collect 50–200 real or realistic inputs, write expected behaviors, build the scorer. Then iterate — prompt v1, score, inspect failures, adjust, re-score — committing eval results with each change. Gate merges on eval regression like you'd gate on tests. Post-launch, sample production traffic back into the eval set so it tracks reality. This is the answer to 'how do you avoid prompt whack-a-mole', and interviewers weight it heavily.",
  },
  {
    q: "Your tool-calling agent works 90% of the time. The other 10% it calls the wrong tool or malforms arguments. Fixes?",
    a: "First, measure per-tool: confusion between similar tools usually means overlapping descriptions — rewrite them with crisp boundaries and disambiguating examples. Malformed arguments: tighten schemas (enums, required fields), validate and feed errors back for one bounded retry. Reduce tool count per call by routing to a subset. If a tool is high-stakes, add a confirmation step. And add tool-call accuracy to your eval set so improvements are provable — 'it feels better' doesn't count.",
  },
  {
    q: "When would you choose a small open-weight model over a frontier API model?",
    a: "When the task is narrow and well-specified (classification, extraction, formatting), volume is high enough that per-token pricing dominates, latency must be tight and local, or data can't leave your infrastructure. Fine-tuned 3–8B models routinely match frontier models on narrow tasks at a fraction of the cost. Stay with frontier APIs for open-ended reasoning, low volume, or when you can't invest in serving. Give the decision rule, not a tribal preference.",
  },
  {
    q: "What is speculative decoding, at a working level?",
    a: "A small draft model proposes several tokens ahead; the large model verifies them in one parallel pass, accepting the prefix that matches what it would have produced. Output is identical to the large model alone, but throughput improves — often 2–3x — because verification is parallel while generation is sequential. It's a serving-side optimization: same quality, lower latency/cost, invisible to the application.",
  },
  {
    q: "How do you test for prompt regressions when upgrading to a new model version?",
    a: "Never trust 'it's just better'. Freeze the eval suite, run old and new models side by side, and compare per-category — new models often improve averages while regressing specific behaviors (format compliance, refusal patterns, tone). Shadow-run the new model on live traffic without serving it, diff outputs, and canary the rollout with rollback wired. Pin model versions in config; 'auto-upgrade' is how silent regressions happen.",
  },
  {
    q: "Explain embeddings drift and index hygiene in a long-lived RAG system.",
    a: "Content changes: documents update, get deleted, or contradict newer ones — a stale index serves confidently outdated answers. Hygiene: re-embed on document change (event-driven, not annual), tombstone deletions immediately, store updated-at and boost recency at retrieval, and periodically audit top-retrieved chunks for staleness. Also dedupe: near-identical chunks crowd out diverse evidence in top-k. Index maintenance is unglamorous and where most mature RAG systems quietly rot.",
  },
  {
    q: "What observability do you add around LLM calls that normal APM doesn't give you?",
    a: "Semantic telemetry: full prompt/response capture (with PII redaction), prompt version, model and parameters, token counts and cost per call, tool-call traces across multi-step chains, retrieved-chunk IDs, and quality signals (user feedback, judge scores) joined to traces. Plus distribution monitoring — output length, refusal rate, parse-failure rate — to catch drift. Tools like Langfuse/LangSmith/OTel-GenAI conventions exist, but naming the data you need matters more than the vendor.",
  },
  {
    q: "A stakeholder wants 'the AI to be more accurate'. How do you turn that into work?",
    a: "Decompose: collect the failures they're seeing, categorize them — retrieval misses, hallucination, format errors, stale data, misunderstood intent — and quantify each bucket on an eval set. Each bucket has a different fix with a different cost; present the Pareto: 'retrieval misses are 60% of errors; hybrid search plus re-ranking addresses that, est. two weeks'. The skill on display is converting vibes into a measurable, prioritized backlog.",
  },
  {
    q: "How do multimodal inputs change your RAG design?",
    a: "Ingestion must parse images, tables, and diagrams — either into text descriptions via a vision model at index time, or via multimodal embeddings enabling cross-modal retrieval. Chunking must keep figures attached to their captions and surrounding text. At query time, decide whether to pass images to the generator directly or their extracted descriptions. Cost jumps: vision calls at index time are significant at corpus scale — say you'd measure retrieval lift before paying it.",
  },
  {
    q: "What's your strategy when a single LLM call needs to become a pipeline?",
    a: "Split when one prompt does multiple jobs badly: decomposition (plan, then execute), specialization (extract with a cheap model, reason with a strong one), or validation stages (generate, then critique, then finalize). Each stage gets its own eval. Costs: added latency and error propagation — a wrong early stage poisons the rest, so add checks at boundaries. The judgment being tested: split for measurable quality gains, not for architectural aesthetics.",
  },
  {
    q: "How do you keep costs sane in an agent that can loop?",
    a: "Hard budgets: max steps, max tokens, and max wall-clock per task, enforced outside the model. Track spend per task ID in real time; kill and surface tasks that exceed budget rather than letting them spin. Design tools to return compact results (summaries, IDs) instead of dumping raw data into context. And log loop patterns — agents repeating the same failing tool call is the classic money leak, fixed by feeding failure memory back into the loop.",
  },
  {
    q: "What is a golden dataset and what makes one actually good?",
    a: "A frozen, versioned set of inputs with reference outputs or grading rubrics, used to score every change. Good ones: drawn from real traffic (not invented), covering the head and the ugly tail (ambiguous, adversarial, multilingual), sized for statistical signal (100+ per category you care about), refreshed as the product evolves, and with grading criteria specific enough that two humans agree. The most common failure: a golden set of 15 happy-path examples that everything passes.",
  },
  {
    q: "Walk me through debugging a sudden latency spike in your LLM feature.",
    a: "Segment first: time-to-first-token vs total generation vs your own pipeline (retrieval, re-ranking, tool calls) — traces answer this instantly if you built them. Provider-side prefill queueing shows as TTFT growth; your retrieval index degrading shows before the model call; longer outputs show as total-time growth with normal TTFT (check whether a prompt change made answers wordier). Correlate with deploys, traffic mix, and provider status. The rubric: do you have the telemetry to answer without guessing.",
  },
  {
    q: "How would you build content moderation for user inputs and model outputs?",
    a: "Input side: fast classifier (provider moderation endpoint or small model) gating obviously abusive/injection content before spending tokens. Output side: policy classifier on responses, PII scanner, and domain-specific rules (no medical dosages, no financial advice) — block, rewrite, or route to human depending on severity. Log all triggers for tuning; measure false positives, which quietly destroy UX. Note that moderation models have their own latency/cost, so tier them by risk.",
  },
  {
    q: "What did you learn from an LLM feature that failed or got rolled back?",
    a: "The rubric: honest specifics, causal diagnosis, and changed behavior. Strong shape: what shipped, the metric that went wrong (cost blew up, users didn't trust it, hallucination in a sensitive flow), why the pre-launch process missed it, and the concrete process change since — eval coverage added, canary stages, cost gates. Avoid failures that are secretly humblebrags; interviewers can tell.",
  },
  {
    q: "When would you use batch/offline inference, and what changes?",
    a: "Anything not user-facing-synchronous: enrichment, classification backfills, summarization pipelines, eval runs. Changes: batch APIs cost ~50% less at relaxed latency, you can max out throughput with large batches, retries are trivial, and you can use bigger models than realtime budgets allow. Design jobs idempotent with checkpointing so a failure at row 80k doesn't restart from zero. Moving work from realtime to batch is one of the easiest cost wins available.",
  },
  {
    q: "Explain the trade-offs of streaming structured output.",
    a: "Users want progressive display, but partial JSON is unparseable — you can't validate a schema mid-stream. Options: stream free-text sections while collecting structured parts at the end; use streaming-friendly formats (line-delimited items) so each element validates independently; or optimistic partial parsing with repair. Also: tool calls mid-stream complicate UI state. Pick per surface — chat prose streams; a form-filling extraction probably shouldn't.",
  },
  {
    q: "How do you decide k, chunk size, and overlap — actually decide, not guess?",
    a: "Grid-search against a retrieval eval: for a probe set of questions with known source passages, measure recall@k and answer quality across combinations (e.g., chunk 200/400/800 tokens, overlap 0/15%, k 3/5/10). Costs scale with k and chunk size, so plot quality against tokens-per-query and pick the knee. The honest meta-answer: these parameters are corpus-specific; anyone quoting universal best values hasn't measured.",
  },
  {
    q: "What security review would you do before connecting an LLM to internal APIs?",
    a: "Threat-model the model as a confused deputy: it will eventually receive injected instructions. Therefore: least-privilege scopes per tool, allowlisted endpoints and parameters (never raw URL or SQL construction from model output), auth as the end user not a super-service-account, human confirmation for mutating actions, rate limits, full audit logging of tool calls, and injection testing in the eval suite. The one-liner: authorization lives in code, never in the prompt.",
  },
  {
    q: "Your team wants to adopt an agent framework. How do you evaluate it?",
    a: "Spike the riskiest real workflow, not the tutorial. Evaluate: debuggability (can you see every prompt and tool call?), escape hatches (override any prompt/loop?), state management and retries, streaming and structured-output support, versioning story, community and release cadence, and lock-in surface. Compare against the baseline of 200 lines of your own orchestration — frameworks must beat that with clarity, not just features. Present findings as a matrix with a recommendation.",
  },
  {
    q: "How do you evaluate summarization quality at scale?",
    a: "Define what a good summary means for your use case first — coverage of key points, faithfulness (no invented claims), length, audience fit. Then: faithfulness via judge checks of each summary claim against the source (the metric that matters most); coverage via key-point extraction from source and overlap scoring; human calibration on a sample. Classic ROUGE correlates poorly with what users want; say so, and say what you use instead.",
  },
  {
    q: "What happens under the hood when inference gets slow at high concurrency?",
    a: "GPU serving batches requests; under load, new requests queue for prefill, and decode steps share the GPU across the batch — so TTFT grows first, then per-token latency. KV-cache memory becomes the bottleneck: long contexts evict or block others. Mitigations at the app layer: shorter prompts, output caps, request prioritization, and paying for provisioned throughput where SLAs demand it. Understanding queue-vs-compute is what separates 'the API is slow' from a diagnosis.",
  },
  {
    q: "You inherit a prompt with 4,000 words of accumulated instructions. What do you do?",
    a: "Resist rewriting on instinct. First, get or build the eval set — the prompt encodes years of fixes you can't see. Then ablate: remove sections one at a time and measure; you'll find 30% is dead weight, 50% matters, 20% conflicts. Restructure survivors by priority, dedupe contradictions, and lock in the eval as the regression suite before shipping. This question is really 'do you refactor with tests' in prompt clothing.",
  },
  {
    q: "How would you support multiple languages in a RAG product?",
    a: "Choose multilingual embeddings so queries and documents match across languages, and verify cross-lingual retrieval quality per language pair — it varies. Decide answer-language policy (mirror the user) and instruct explicitly. Eval sets per supported language, not just English; tokenizer costs differ significantly by language and script, which affects budgets. If quality gaps appear, per-language re-rankers or translated shadow indexes are pragmatic patches.",
  },
  {
    q: "What's your checklist before shipping an LLM feature to production?",
    a: "Eval suite passing with agreed thresholds; adversarial and injection cases tested; cost per request measured with alerts wired; latency p99 within budget; retries, fallbacks, and rate-limit handling implemented; observability capturing prompts, versions, and tool traces; PII policy applied to logs; kill switch and rollback path; on-call briefed with a runbook; and a post-launch sampling plan feeding production traffic back into evals. Reciting eight of these ten fluently is a pass.",
  },
];
