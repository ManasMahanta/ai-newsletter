import type { QA } from "./types";

// Leadership: AI product manager, Head of AI, Director / VP.
export const leadershipQA: QA[] = [
  {
    q: "You have budget for 3 of 10 proposed GenAI initiatives. Show me your selection framework.",
    a: "Score each on: business value (revenue, cost, or risk reduction with an owner who'll sign the number), feasibility (data readiness, error tolerance of the workflow, integration surface), time-to-signal (can we prove or kill it in 8 weeks?), and strategic compounding (does it build data, platform, or capability the others reuse?). Kill anything where the workflow can't tolerate model errors or the data doesn't exist. Then portfolio-balance: one near-certain cost-saver to fund credibility, one revenue-side bet, one platform enabler. Publish the scoring so the seven declined teams see reasons, not politics.",
  },
  {
    q: "How do you measure whether an AI feature is actually working — beyond usage graphs?",
    a: "Tie it to the business metric it was funded on: deflection rate and CSAT for support, cycle time for drafting, conversion for search. Instrument outcome proxies — acceptance rate of AI outputs, edit distance before use, escalation/abandonment rates — and run holdouts (a control group without the feature) because adoption isn't impact. Add counter-metrics for the failure you fear: error-caused rework, complaint rate, trust scores. Review quarterly against the original business case, and be the person willing to say 'usage is high, value isn't materializing' — that credibility funds your next three asks.",
  },
  {
    q: "Legal asks: 'Can we guarantee the model never gives financial advice?' What's your answer?",
    a: "Honest framing: no probabilistic system offers a 'never' — what we offer is engineered risk reduction with measurement. Concretely: topic classifiers and output filters on the advice boundary, tested refusal behavior, human review on flagged categories, and a measured escape rate ('under X per 10k interactions in adversarial testing, here's the dashboard'). Then reframe the decision as risk acceptance: here's residual risk, mitigation cost curve, and comparable industry practice — legal and business jointly decide the threshold. Leaders who promise 'never' to legal are setting up tomorrow's crisis; leaders who quantify earn a partner.",
  },
  {
    q: "Design the AI org for a 2,000-person company starting mostly from zero.",
    a: "Start hub-heavy, evolve spoke-heavy. Year one: a central AI platform team (gateway, evals, governance, 8–12 people) plus 2–3 embedded pods in the highest-value business units, all under one leader with a seat at product strategy. Deliberately avoid: a research lab (you're not a lab), an 'AI center of excellence' that only writes decks, and scattering individual ML engineers into teams with no support. As patterns stabilize, push capability outward — platform stays central, use-case ownership moves to domains with certified tooling. Hiring order: platform lead, staff GenAI engineer, product-minded PM, then pods. Revisit the design at 18 months; org structures for AI age fast.",
  },
  {
    q: "Your flagship AI feature hallucinated publicly and it's in the press. First 48 hours?",
    a: "Hour one: assess blast radius and, if harm is ongoing, degrade or kill the feature — a day of downtime is cheaper than a week of screenshots. Communicate in this order: affected users (direct, factual, what happened and what we're doing), internal teams (one source of truth, no freelancing to press), then public statement — own it plainly, no 'the model did it' deflection; you shipped the model. Parallel: engineering runs the incident process on traces, adds the failing case to evals, and identifies why testing missed it. Within 48 hours: root-cause summary to leadership with the systemic fix and its cost. The reputational asset you're protecting is not 'we're perfect' but 'they handle problems like adults'.",
  },
  {
    q: "A team wants six months to fine-tune a custom model; an API call gets 90% of the value today. Decide.",
    a: "Ship the API version now — the 90% starts compounding value and, critically, generates the production data and eval baselines any future fine-tune needs. Then make the fine-tune case earn itself with numbers: at what volume does unit cost cross over, is the remaining 10% actually valuable to users, and is latency or data residency a real constraint? Often the answer is 'revisit at scale', sometimes fine-tuning genuinely wins — but sequence it as an optimization of a live product, not a prerequisite. Watch for the real motivation: résumé-driven engineering. Redirect that energy to owning the eval and data pipeline, which is the durable skill anyway.",
  },
  {
    q: "How do you keep AI strategy honest when the board wants 'agents everywhere' by Q3?",
    a: "Translate the enthusiasm rather than fighting it: agree on the outcome the board actually wants (efficiency, competitiveness, a story for investors) and map what agentic maturity realistically delivers by Q3 — likely 2–3 workflows with human-in-the-loop autonomy and measured ROI, not 'everywhere'. Bring a maturity ladder with evidence gates and show competitors' real deployments versus their press releases (the gap is your ally). Commit to the ambitious-but-real version in writing with metrics. Boards respect leaders who negotiate scope with data; they replace leaders who either overpromise and miss, or reflexively say no.",
  },
  {
    q: "How do you build AI literacy across a non-technical workforce without wasting a year on training theater?",
    a: "Anchor to workflows, not concepts: role-specific training built around the three tasks each function will actually do with AI tools, delivered in the tools, not in slides. Create a champions network — one volunteer per team, given early access and a direct line to the AI org — which surfaces real use cases and quietly retires fear. Publish clear usage policy (what's allowed, what data can go where) because uncertainty suppresses adoption more than inability. Measure behavior change (tool usage in workflow, time saved self-reported and sampled) not completion certificates. And executives train first, visibly — nothing licenses adoption like the CFO using it in a meeting.",
  },
  {
    q: "What's your policy framework for hallucination risk across different product surfaces?",
    a: "One dial doesn't fit: classify surfaces by consequence of error. Tier 1 (internal drafts, brainstorming): model output direct, light disclaimers. Tier 2 (customer-facing information): grounding required, citations, measured groundedness thresholds as launch gates. Tier 3 (decisions affecting money, health, legal standing): human owns every output, AI is draft-only, with review UX that makes rubber-stamping hard. Each tier has quantitative gates (error rates from adversarial evals), an owner, and audit sampling in production. The framework's power is that new features slot into a tier in one meeting instead of relitigating philosophy every launch.",
  },
  {
    q: "How do you negotiate with AI vendors from a position of strength?",
    a: "Strength comes from credible optionality: maintain a qualified second model/vendor for every critical route (your eval harness makes re-qualification cheap — this is why you funded it), and let vendors know switching is a sprint, not a rewrite. Negotiate on committed volume with re-open clauses tied to the price-performance curve, which in this market only moves in your favor. Watch the lock-in surfaces beyond price: proprietary features (caching semantics, tool formats), data terms, and deprecation policies — get model-sunset notice periods in writing. And time renewals after major open-weight releases; nothing improves a quote like a viable self-host alternative on the table.",
  },
  {
    q: "The EU AI Act (and similar regimes) — what does a Head of AI actually need to operationalize?",
    a: "Inventory and classification first: every AI system mapped to risk category (prohibited, high-risk, limited, minimal) — you can't comply with what you haven't catalogued. For high-risk systems: documented risk management, data governance records, human oversight design, accuracy/robustness testing evidence, and technical documentation — which, conveniently, your eval and trace infrastructure already generates if built right. Transparency obligations for AI-generated content and chatbot disclosure. Assign an accountable owner, integrate checks into launch gates rather than annual audits, and track regulatory divergence if you operate across jurisdictions. Message to the exec team: 80% of compliance is the engineering discipline we should have anyway.",
  },
  {
    q: "How do you decide when to kill an AI project, and how do you do it without demoralizing the team?",
    a: "Kill criteria are set at kickoff — metric thresholds and a date — so the decision is a pre-agreed trigger, not a surprise ambush. Common valid kills: value hypothesis disproven (users don't trust or use it), error tolerance mismatch (workflow needs 99%, ceiling is 95%), or unit economics that scale won't fix. Do it publicly and frame it as the system working: celebrate what was learned, name the artifacts that survive (data, evals, platform pieces — there are always some), and visibly redeploy the team onto a priority, not into limbo. Orgs that punish killed projects get zombie projects; orgs that honor them get honest pilots.",
  },
  {
    q: "What does an AI product roadmap look like when the underlying technology shifts every quarter?",
    a: "Commit to problems, not implementations: roadmap items are 'reduce support resolution time 30%' not 'ship RAG chatbot v2', so a model breakthrough changes the how without vaporizing the roadmap. Keep architecture optionality as a stated principle (gateway, evals, provider-agnostic prompts) and hold 15–20% capacity unallocated for capability jumps — when a new model unlocks something, you exploit it in weeks while competitors re-plan. Quarterly re-baseline: what got cheaper, what became possible, what should die. Communicate the rhythm honestly upward: our roadmap has firm outcomes and flexible means, and that's a feature of operating at the frontier, not indecision.",
  },
  {
    q: "How do you handle the 'shadow AI' problem — employees using unapproved tools with company data?",
    a: "Recognize it as demand signal, not just risk: people route around you when the sanctioned path is worse than the unsanctioned one. Response: provide a genuinely good approved alternative fast (enterprise LLM access with SSO and data protections), publish a short clear policy — what data classes can go where, in plain language — and instrument egress monitoring for the truly sensitive (DLP on known AI endpoints). Amnesty over punishment for disclosure: you want to know what people found useful; each shadow use case is free product research. Enforcement escalates only for sensitive-data violations after alternatives exist. Prohibition without provision just drives usage underground where you can't see it.",
  },
  {
    q: "Your CFO asks: 'What's our total AI spend, and what are we getting for it?' Can you answer?",
    a: "You should be able to, in one page: spend decomposed (API/inference, infrastructure, tooling, headcount) by initiative, with cost-per-transaction trends; value in the CFO's units — hours saved × loaded cost, deflected tickets × cost-per-ticket, incremental conversion revenue — each validated by the owning business unit, with holdout evidence where it exists, plus honest 'not yet measurable' entries with dates. If you can't produce this, that's the real answer to fix: per-feature cost telemetry and value instrumentation are leadership infrastructure, not engineering nice-to-haves. The trust from one honest page — including the disappointing rows — buys years of budget flexibility.",
  },
  {
    q: "How do you structure the relationship between a central AI platform team and product teams who want speed?",
    a: "A paved-road contract: the platform team's SLA is that the sanctioned path is the fastest path — golden templates, self-serve onboarding, hours-not-weeks approvals — and in exchange, product teams accept the guardrails (gateway, evals, spend quotas). Governance rides the platform invisibly: using the paved road IS compliance, no separate committee gauntlet. Escalation valve: teams can go off-road with a signed risk acceptance and a named owner, reviewed quarterly — making exceptions visible instead of forbidden. Platform funded centrally so it never charges internal customers into avoidance. The failure mode to prevent on both sides: platform-as-gatekeeper breeds shadow AI; product-teams-unbounded breeds incidents.",
  },
  {
    q: "What signals tell you your AI organization is actually maturing?",
    a: "Leading indicators over vanity counts: time from idea to evaluated prototype falling (weeks → days), fraction of features with real eval sets and cost telemetry rising, incidents caught by internal monitoring before users notice, model/vendor swaps executed in days without drama, business units bringing use cases to you (pull) rather than being sold (push), and post-launch value reviews that sometimes conclude 'kill it' — proof the measurement is honest. The anti-signals: demo count, 'AI-powered' press releases, and pilots that never die. Maturity is boring: it looks like infrastructure, cadence, and unremarkable launches that quietly hit their numbers.",
  },
  {
    q: "A business unit leader says 'AI will replace half my team — help me plan the reduction.' How do you respond?",
    a: "Slow the certainty before it becomes a commitment: current-generation AI reliably augments task bundles, and role-level replacement claims routinely miss the coordination, judgment, and exception-handling hidden in jobs. Offer rigor: task-level analysis of the team's work — what's automatable at what error tolerance — piloted with measurement before any workforce decision. Often the honest finding is 30% task automation enabling redeployment or absorbing growth without hiring, not 50% headcount. Also flag the execution risks of cutting first: you lose the domain experts needed to supervise and improve the AI. You'll earn more trust as the leader who prevents a premature reduction than the one who blesses it.",
  },
  {
    q: "How do you think about build-vs-buy for AI capabilities at the company level?",
    a: "Buy commodity, build differentiating, and be brutally honest about which is which: your industry's data, workflows, and integration points are differentiating; chat UIs, vector databases, and observability dashboards are not. Apply a churn discount to the buy side — this vendor market is consolidating, so weight escape hatches (data export, standard formats) heavily and prefer vendors aligned with open standards. Apply a capability discount to the build side — building well requires the platform team you may not have yet. Common right answer: buy the plumbing, build the thin decision layers where your logic lives, and always own your data, evals, and prompts regardless of what's bought.",
  },
  {
    q: "What's your framework for AI ethics decisions that don't have a policy yet?",
    a: "A standing review path, not ad-hoc Slack debates: a small cross-functional group (product, legal, engineering, and someone empowered to represent affected users) with a 48-hour SLA for novel questions. Analysis frame: who's affected and can they contest outcomes; is the data use within what its subjects would reasonably expect; would we be comfortable if this decision were public; and does it create precedent. Decisions get documented and become policy — the exception queue is how policy grows. Two leader behaviors matter most: never punishing the engineer who raised the question, and occasionally leaving revenue on the table visibly, which is what makes the framework real instead of theater.",
  },
  {
    q: "How do you retain senior AI talent when every lab and startup is recruiting them?",
    a: "Money must be market-sane, but the durable retainers are: real problems with real scale (interesting beats prestigious for most senior ICs), infrastructure that lets them ship (nothing burns out seniors like fighting for GPU quota and approvals), visible impact (their work in production, credited), a technical career ladder that doesn't force management, and access — conferences, publications where possible, time for exploration. Also: protect them from AI tourism — endless demo requests and strategy decks. Exit interviews in this field say the same thing repeatedly: people leave when shipping becomes politics. Your retention strategy is mostly your operating model.",
  },
  {
    q: "The CEO wants a weekly 'AI wins' update for the board. What do you actually send?",
    a: "Negotiate the frame from 'wins' to 'progress and posture' — a weekly wins mandate manufactures theater within a month. Structure: one metric movement that matters (with honest attribution), one shipped change, one risk or incident with response, and one frontier note (what changed in the field and what we're doing about it). Monthly, roll up to outcome trends against the AI strategy's committed metrics. Keep it one page; boards remember trajectories and candor, not feature lists. The compounding asset is credibility: the first time you report 'this initiative is underperforming and here's our call', every subsequent claim gets believed.",
  },
  {
    q: "How do you scope an AI transformation for a traditional enterprise realistically?",
    a: "Reject the big-bang program; run a capability-building sequence. Phase one (quarters 1–2): foundation — data access sorted for 2–3 target workflows, platform basics, policy, and two lighthouse use cases chosen for measurable ROI and forgiving error tolerance. Phase two: scale what worked, kill what didn't publicly (trust-building), stand up literacy and champions programs. Phase three: workflow redesign — the real value is re-architecting processes around the capability, not sprinkling AI on existing ones. Timeline honesty: meaningful P&L impact is 18–36 months, and anyone promising transformation in two quarters is selling something. Budget 30% for change management; adoption, not technology, is where these programs die.",
  },
  {
    q: "What do you personally review before approving a high-stakes AI feature launch?",
    a: "The eval evidence (adversarial included) against pre-agreed gates; the failure UX walked through personally — what a user sees when it's wrong; the incident plan (kill switch, owner, comms draft for the worst case); cost at 10x projected volume; data flows and retention against policy; and the accountable owner's name — singular. Then the two questions that catch what checklists miss: 'What's the most embarrassing output this could produce, and have we tried to produce it?' and 'If this goes wrong publicly, is the story that we were reckless, or that we were rigorous and unlucky?' Ship only in the second world.",
  },
  {
    q: "How do you balance moving fast on AI with the trust you owe existing customers?",
    a: "Segment the risk, not the speed: move at startup pace on internal tools and low-stakes surfaces, and at earned-trust pace on anything touching customer data, money, or commitments — with the tiering framework published so teams self-serve the decision. Customer-facing principles worth stating publicly: their data isn't training material without explicit consent, AI touchpoints are disclosed, and humans are reachable. Beta programs with opt-in customers give you speed and consent simultaneously — your most engaged customers want to co-develop. The strategic view: in a market full of AI recklessness, being the trustworthy fast-mover is a durable position; being fast and careless is a rented one.",
  },
  {
    q: "Where do you expect Gen AI to actually create defensible advantage, versus table stakes everyone gets?",
    a: "Table stakes: anything the model does out of the box — drafting, summarization, generic chat — every competitor gets it the same quarter you do. Defensible: proprietary data flywheels (outcome-labeled usage data competitors can't buy), workflow depth (AI woven into the process where switching means re-engineering, not re-subscribing), distribution (AI features riding your existing customer relationships), and organizational speed itself — the eval/platform/talent machinery that exploits each model generation faster than rivals. Strategy implication: spend less energy picking models and more building the data and deployment machine; the models equalize, the machine compounds.",
  },
];
