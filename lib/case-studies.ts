// Case studies: real, named, sourced deployments of AI and agentic AI across
// industries — editorially maintained, not generated. Every figure here is
// attributed to a public source (company disclosure, press coverage, or
// research) because an invented statistic is worse than no case study at all.
//
// Each entry gets an editorial verdict, on-brand for a "signal in the noise"
// newsletter:
//   signal — the deployment held up; real, durable value delivered
//   mixed  — real value, but with a real cost, walk-back, or open caveat
//   noise  — the deployment failed publicly or was reversed
// "agentic" marks systems that plan/act in a multi-step loop with tools,
// distinct from single-shot classification, generation, or optimization —
// see the "Agent" and "Agentic AI" entries in the glossary.
//
// Added 2026-07-24. Re-verify figures periodically; vendor-reported numbers
// (marked below) are the company's own claim, not an independent audit.

export type Verdict = "signal" | "mixed" | "noise";

export type CaseStudy = {
  slug: string;
  org: string;
  domain: string;
  agentic: boolean;
  verdict: Verdict;
  period: string;
  headline: string;
  summary: string;
  outcome: string;
  lesson: string;
  sources: { title: string; url: string }[];
};

export const domains = [
  "Customer Service",
  "Finance & Legal Ops",
  "Legal Services",
  "Healthcare & Pharma",
  "Real Estate",
  "Retail & Supply Chain",
  "Software Engineering",
  "Cybersecurity",
  "Food Service",
  "HR & Recruiting",
  "Logistics",
  "Manufacturing",
  "Education",
] as const;

export const caseStudies: CaseStudy[] = [
  {
    slug: "klarna-ai-customer-service",
    org: "Klarna",
    domain: "Customer Service",
    agentic: true,
    verdict: "mixed",
    period: "2024–2025",
    headline: "700 agents' worth of AI support — until the quality gap showed up",
    summary:
      "In February 2024 Klarna put an OpenAI-powered assistant in front of customer service chat, live in 23 markets and 35 languages, and let it handle full conversations end to end rather than just suggesting replies to a human.",
    outcome:
      "First month: 2.3 million conversations, doing the work of 700 full-time agents, resolution time down from 11 minutes to under 2, repeat-contact rate down 25%, an estimated $40M profit improvement for 2024. By May 2025, CEO Sebastian Siemiatkowski told Bloomberg the company was reversing course: the AI matched humans on simple queries but quality dropped noticeably on disputes, fraud claims, and hardship cases, and it sometimes gave confident, wrong answers about fees and policy. Klarna began rehiring human agents into a hybrid model; by Q3 2025 it reported the AI at ~853 agents' worth of work and ~$60M in annualized savings, response times 82% faster, alongside a rebuilt human layer for the cases that need one.",
    lesson:
      "The failure mode wasn't the AI being bad — it was routing 100% of volume through it and only later discovering which slice of tickets needed a human's judgment, not just a human's tone.",
    sources: [
      { title: "Klarna: AI assistant handles two-thirds of customer service chats in its first month (official)", url: "https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/" },
      { title: "Klarna reinvests in human talent for customer service — CX Dive", url: "https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-customer-service-AI-chatbot/747586/" },
    ],
  },
  {
    slug: "jpmorgan-coin-contract-review",
    org: "JPMorgan Chase",
    domain: "Finance & Legal Ops",
    agentic: false,
    verdict: "signal",
    period: "2017–ongoing",
    headline: "COiN reads commercial loan agreements in seconds, not 360,000 hours a year",
    summary:
      "JPMorgan's Contract Intelligence platform (COiN) uses NLP to extract clauses, dates, and obligations from commercial credit agreements — the document-review grind that previously ate law-firm and in-house-counsel hours by the tens of thousands.",
    outcome:
      "The bank reports COiN reviews roughly 12,000 commercial credit agreements a year in seconds each, recovering an estimated 360,000 hours of lawyer and loan-officer time annually — about $150,000 in annual review time reclaimed for every agreement type it's pointed at, at scale. It has since expanded toward additional document types beyond its original loan-agreement scope.",
    lesson:
      "The oldest, least glamorous AI win in enterprise finance is still the most reliable one: narrow, high-volume, structured-output extraction from documents a human would otherwise read line by line. No agent loop required.",
    sources: [
      { title: "AI Case Study: Automated Document Processing at JPMorgan (COIN) — Redress Compliance", url: "https://redresscompliance.com/ai-case-study-ai-for-automated-document-processing-at-jpmorgan-coin/" },
      { title: "JPMorgan reduced lawyers' hours by 360,000 annually with COIN — Best Practice AI", url: "https://www.bestpractice.ai/ai-case-study-best-practice/jpmorgan_reduced_lawyers'_hours_by_360,000_annually_by_automating_loan_agreement_analysis_with_machine_learning_software_coin" },
    ],
  },
  {
    slug: "air-canada-chatbot-liability",
    org: "Air Canada",
    domain: "Customer Service",
    agentic: false,
    verdict: "noise",
    period: "2022–2024",
    headline: "A chatbot invented a bereavement-fare policy — and a tribunal made the airline honor it",
    summary:
      "Air Canada's website chatbot told a customer, Jake Moffatt, that he could apply for a bereavement discount retroactively within 90 days of travel. That wasn't the airline's actual policy, which requires the discount request before booking.",
    outcome:
      "When Moffatt applied after flying, Air Canada refused and offered a $200 coupon instead, arguing in the tribunal that it wasn't liable for what its own chatbot said. Canada's Civil Resolution Tribunal disagreed: in Moffatt v. Air Canada, 2024 BCCRT 149, it ordered the airline to pay $812.02 in refund, interest, and fees, ruling a company is responsible for all information on its website — there's no reason a customer should know which part of the page to trust.",
    lesson:
      "\"The chatbot said it, not us\" is not a legal defense, and it shouldn't be a product assumption either — anything a support bot states as fact is a company statement the moment a customer relies on it.",
    sources: [
      { title: "Moffatt v. Air Canada: A Misrepresentation by an AI Chatbot — McCarthy Tétrault", url: "https://www.mccarthy.ca/en/insights/blogs/techlex/moffatt-v-air-canada-misrepresentation-ai-chatbot" },
      { title: "What Air Canada Lost In 'Remarkable' Lying AI Chatbot Case — Forbes", url: "https://www.forbes.com/sites/marisagarcia/2024/02/19/what-air-canada-lost-in-remarkable-lying-ai-chatbot-case/" },
    ],
  },
  {
    slug: "moderna-generative-ai-mrna",
    org: "Moderna",
    domain: "Healthcare & Pharma",
    agentic: false,
    verdict: "signal",
    period: "2020–ongoing",
    headline: "Generative AI screened hundreds of spike-protein mRNA sequences before a single one hit the lab",
    summary:
      "In its 2020 COVID-19 vaccine sprint, Moderna used generative sequence-design models to produce hundreds of candidate mRNA permutations for the SARS-CoV-2 spike protein, computationally pre-screening them so only the most promising went to wet-lab testing — collapsing a normally sequential design step into a parallel one.",
    outcome:
      "The practice has since scaled into standing infrastructure: Moderna deployed ChatGPT Enterprise to ~3,000 staff and built an internal tool ('mChat') reaching 80% adoption, later expanding to 750+ internal custom GPTs including a clinical-data tool ('Dose ID') and a contract-summarization tool. It's also applying generative design to a personalized cancer vaccine program (mRNA-4157) and, with IBM, a foundation model (MoLFormer) for lipid-nanoparticle and mRNA optimization.",
    lesson:
      "The highest-leverage use of generative AI in drug development isn't a chatbot feature — it's using generation-plus-screening to explore a design space (sequences, formulations) too large to hand-search, before any wet lab time is spent.",
    sources: [
      { title: "Generative AI in mRNA Vaccine Development: COVID-19 Case Study — IntuitionLabs", url: "https://intuitionlabs.ai/articles/generative-ai-mrna-vaccine-covid19-case-study" },
      { title: "Moderna and IBM to Explore Quantum Computing and Generative AI for mRNA Science (official)", url: "https://newsroom.ibm.com/2023-04-20-Moderna-and-IBM-to-Explore-Quantum-Computing-and-Generative-AI-for-mRNA-Science" },
    ],
  },
  {
    slug: "zillow-offers-ibuying-collapse",
    org: "Zillow",
    domain: "Real Estate",
    agentic: false,
    verdict: "noise",
    period: "2018–2021",
    headline: "The Zestimate could size up a market. It couldn't safely bet the company's balance sheet on one.",
    summary:
      "Zillow Offers used an ML pricing model to make instant cash offers on homes, renovate them, and resell for a margin (\"iBuying\") — a business model that depended on predicting a specific home's near-term resale value within a narrow error band, not just estimating a market trend.",
    outcome:
      "During the 2021 pandemic housing boom, prices moved faster than the model could track, and it overpaid systematically in hot markets like Phoenix and Atlanta. In November 2021 Zillow shut the division entirely, took a loss of over $500 million on homes it couldn't resell at a profit, and cut 25% of its workforce.",
    lesson:
      "A model that's a genuinely useful directional estimate (the Zestimate, still live today) can be actively dangerous the moment a business puts real capital behind its point estimate being right within a few percent, at scale, in a volatile market.",
    sources: [
      { title: "Why the iBuying algorithms failed Zillow — GeekWire", url: "https://www.geekwire.com/2021/ibuying-algorithms-failed-zillow-says-business-worlds-love-affair-ai/" },
      { title: "Zillow's home-buying debacle shows how hard it is to use AI to value real estate — CNN Business", url: "https://edition.cnn.com/2021/11/09/tech/zillow-ibuying-home-zestimate" },
    ],
  },
  {
    slug: "walmart-agentic-procurement",
    org: "Walmart",
    domain: "Retail & Supply Chain",
    agentic: true,
    verdict: "mixed",
    period: "2025",
    headline: "An AI agent negotiated payment terms with 2,000+ suppliers in parallel",
    summary:
      "Walmart deployed an autonomous procurement agent to run supplier negotiations at a scale no human buying team could match simultaneously — proposing terms, responding to counteroffers, and closing agreements without a person in each individual loop.",
    outcome:
      "Per Walmart's own disclosures, the agent engaged over 2,000 suppliers at once, with 68–72% of invited suppliers reaching a final agreement directly with it, and extended average payment terms by 35 days for many of them — freeing up working capital. Walmart frames this inside a broader 2025 shift from isolated AI models to a \"system-centric\" architecture of purpose-built agents across inventory, fulfillment, and supply chain.",
    lesson:
      "These are Walmart's own reported figures, not an independent audit — a healthy read treats the negotiation-agreement rate and terms extension as real signals of scale, not proof the agent negotiates as well as a skilled human buyer would on any single high-stakes contract.",
    sources: [
      { title: "Inside Walmart's strategy for building an agentic future (official)", url: "https://corporate.walmart.com/news/2025/05/29/inside-walmarts-strategy-for-building-an-agentic-future" },
      { title: "AI to ROI Case Study: Walmart's Autonomous Procurement Agent", url: "https://ai2roi.substack.com/p/ai-to-roi-case-study-walmarts-autonomous" },
    ],
  },
  {
    slug: "github-copilot-developer-productivity",
    org: "GitHub Copilot (multi-org studies)",
    domain: "Software Engineering",
    agentic: false,
    verdict: "mixed",
    period: "2023–2025",
    headline: "Real productivity gains — smaller and slower to arrive than the pitch decks suggest",
    summary:
      "As AI coding assistants moved from autocomplete to agentic \"fix this, then run the tests\" workflows, independent researchers ran longitudinal studies rather than taking vendor benchmarks at face value — tracking real engineering teams before and after adoption.",
    outcome:
      "Results diverge by study and metric. ZoomInfo (Jan 2025) reported a 33% suggestion-acceptance rate and a 40–50% productivity boost on developer-reported measures, growing with task difficulty. A separate longitudinal study at NAV IT, tracking 100→250 Copilot users from 2023–2025, found no statistically significant change in commit-based activity metrics, even though developers subjectively felt more productive — a real gap between perceived and measured gain. Microsoft's own research found it takes developers roughly 11 weeks to realize the tool's full productivity value, but most judge it in the first week, at only ~20% of that value.",
    lesson:
      "\"AI coding assistants boost productivity\" is true and also not a single number — it depends which metric you trust (commits vs. self-report), how long the team has used it, and how hard the tasks are. Treat any single-study claim as a data point, not the answer.",
    sources: [
      { title: "Developer Productivity With and Without GitHub Copilot: A Longitudinal Mixed-Methods Case Study — arXiv", url: "https://arxiv.org/abs/2509.20353" },
      { title: "Experience with GitHub Copilot for Developer Productivity at Zoominfo — arXiv", url: "https://arxiv.org/html/2501.13282v1" },
    ],
  },
  {
    slug: "microsoft-security-copilot-soc",
    org: "Microsoft Security Copilot",
    domain: "Cybersecurity",
    agentic: true,
    verdict: "signal",
    period: "2025–ongoing",
    headline: "An agent triages security alerts so analysts stop drowning in false positives",
    summary:
      "Security operations centers are flooded with alerts, most of them noise; Microsoft built an agentic triage layer into Security Copilot that investigates alerts autonomously — pulling context, correlating signals, and producing a verdict — before a human analyst ever opens the ticket.",
    outcome:
      "Microsoft reports its Alert Triage Agent identifies 6.5x more malicious alerts, improves verdict accuracy by 77%, and frees analysts to spend 53% more time on real investigation instead of triage. In a named customer deployment, St. Luke's healthcare system reported the agent saving its team nearly 200 hours a month and shifting the team from reactive triage to proactive threat hunting.",
    lesson:
      "Alert triage is a well-matched job for an agent: high volume, mostly repetitive, a bounded action space (escalate or dismiss), and a human still reviewing the verdicts that matter — the profile that tends to separate real agentic wins from overreach.",
    sources: [
      { title: "Security Copilot for SOC: bringing agentic AI to every defender — Microsoft (official)", url: "https://techcommunity.microsoft.com/blog/microsoftthreatprotectionblog/security-copilot-for-soc-bringing-agentic-ai-to-every-defender/4470187" },
      { title: "The agentic SOC — Rethinking SecOps for the next decade — Microsoft Security Blog (official)", url: "https://www.microsoft.com/en-us/security/blog/2026/04/09/the-agentic-soc-rethinking-secops-for-the-next-decade/" },
    ],
  },
  {
    slug: "mcdonalds-ibm-drive-thru",
    org: "McDonald's × IBM",
    domain: "Food Service",
    agentic: false,
    verdict: "noise",
    period: "2021–2024",
    headline: "260 chicken nuggets, bacon on ice cream: voice AI met the real drive-thru",
    summary:
      "From 2021, McDonald's piloted an IBM-built voice-AI order-taking system at more than 100 U.S. drive-thrus, aiming to automate the highest-volume, most repetitive part of front-line labor.",
    outcome:
      "In real conditions — background noise, overlapping voices, accents, lane crosstalk — the system misfired often enough to go viral for it: adding unwanted items, mixing up orders between adjacent lanes, and failing to understand customer corrections, in clips showing orders like 260 chicken nuggets or bacon added to ice cream. McDonald's ended the IBM partnership in June 2024, with the system fully shut off by late July, saying it would look for a different voice-AI vendor rather than abandoning the idea entirely.",
    lesson:
      "A demo-clean voice interface and a real drive-thru lane are different acoustic environments; McDonald's didn't conclude \"AI ordering is impossible,\" it concluded this specific system wasn't ready for the noise floor of the job it was hired to do.",
    sources: [
      { title: "McDonald's to end AI drive-thru test with IBM — CNBC", url: "https://www.cnbc.com/2024/06/17/mcdonalds-to-end-ibm-ai-drive-thru-test.html" },
      { title: "McDonald's Reportedly Ends IBM Partnership After AI Drive-Thru Ordering Errors — AI Incident Database", url: "https://incidentdatabase.ai/cite/475" },
    ],
  },
  {
    slug: "amazon-ai-recruiting-bias",
    org: "Amazon",
    domain: "HR & Recruiting",
    agentic: false,
    verdict: "noise",
    period: "2014–2017",
    headline: "The hiring model taught itself that being a man was a qualification",
    summary:
      "Amazon built an experimental ML tool to score résumés 1–5 stars for technical roles, training it on a decade of the company's own historical hiring data — a resume pool that skewed heavily male, as most of the tech industry's did at the time.",
    outcome:
      "By 2015, Amazon's own team found the model had taught itself that male candidates were preferable: it downgraded résumés containing the word \"women's\" (as in \"women's chess club captain\") and penalized graduates of two all-women's colleges. Engineers patched those specific signals, but couldn't rule out the model finding other proxies for gender, and Amazon scrapped the project entirely in 2017 rather than ship it.",
    lesson:
      "A model trained on \"who we hired before\" doesn't learn who's qualified — it learns who got hired before, bias included. This is now the canonical example cited whenever a company says its historical data will keep an AI hiring tool fair.",
    sources: [
      { title: "Amazon scraps secret AI recruiting tool that showed bias against women — Fortune (Reuters)", url: "https://fortune.com/2018/10/10/amazon-ai-recruitment-bias-women-sexist" },
      { title: "Amazon abandons AI hiring tool exposed for gender bias — Built In", url: "https://builtin.com/artificial-intelligence/amazon-abandons-ai-hiring-tool-exposed-gender-bias" },
    ],
  },
  {
    slug: "harvey-ai-allen-overy",
    org: "Harvey AI × Allen & Overy",
    domain: "Legal Services",
    agentic: false,
    verdict: "signal",
    period: "2023–ongoing",
    headline: "4,000 lawyers, one AI drafting assistant, kept firmly out of the decision seat",
    summary:
      "Allen & Overy became the first BigLaw firm to deploy Harvey AI firm-wide in 2023, scoping it deliberately to high-effort, low-risk work — first drafts, document summaries, preliminary research — with every output subject to lawyer review, not autonomous filing.",
    outcome:
      "Across 4,000+ lawyers in 43 jurisdictions, A&O reports an average 2–3 hours saved per lawyer per week, a 30% reduction in contract review time, and up to 7 hours saved on complex document analysis. The firm was named Europe's \"Most Innovative Law Firm\" in 2024, and Harvey has since expanded into PwC's legal services arm, reaching 4,000+ more professionals.",
    lesson:
      "The legal-AI deployments that have actually stuck share a pattern: assistant positioning, not autonomy — draft-and-summarize tasks where a licensed professional remains the last check, rather than tasks where the AI's output goes out the door unreviewed.",
    sources: [
      { title: "Which Law Firms Use AI? Case Studies from BigLaw to Solo Practices — Spellbook", url: "https://spellbook.com/learn/law-firms-using-ai" },
      { title: "Harvey | AI software for legal and professional services (official)", url: "https://www.harvey.ai/" },
    ],
  },
  {
    slug: "ups-orion-route-optimization",
    org: "UPS",
    domain: "Logistics",
    agentic: false,
    verdict: "signal",
    period: "2013–ongoing",
    headline: "ORION doesn't chat — it just quietly saves 100 million miles a year",
    summary:
      "UPS's ORION (On-Road Integrated Optimization and Navigation) is operations-research-plus-machine-learning applied to a brutally concrete problem: each delivery route has roughly 200,000 possible sequences, and picking a near-optimal one across 250 million address data points saves real fuel and time at UPS's volume.",
    outcome:
      "UPS reports ORION saves around 100 million miles and 10 million gallons of fuel a year, cutting CO2 emissions by roughly 100,000 metric tons, for an estimated $300–400M in annual savings. More than 70% of UPS's ~55,000 U.S. routes now run on it, at an average reduction of 6–8 driving miles per route per day — rolled out gradually, with driver training built around the fact that an optimal-looking route often looks wrong to an experienced human until they trust the system.",
    lesson:
      "The single longest-running, most durable AI success story in this list predates the LLM era entirely — a reminder that \"AI\" delivering real value has never required a chat interface, only a well-defined problem and a metric worth optimizing.",
    sources: [
      { title: "UPS saves 10 million gallons of fuel and $100M+ per year with ORION — Best Practice AI", url: "https://www.bestpractice.ai/ai-case-study-best-practice/ups_saves_10_million_gallons_of_fuel_and_$100_million_per_year_by_optimising_driver_delivery_routes_that_consider_real-time_traffic_and_weather_information_obtained_from_social_media_and_machine_learning" },
      { title: "Looking Under the Hood: ORION Technology Adoption at UPS — BSR", url: "https://www.bsr.org/en/case-studies/center-for-technology-and-sustainability-orion-technology-ups" },
    ],
  },
  {
    slug: "siemens-industrial-agents",
    org: "Siemens",
    domain: "Manufacturing",
    agentic: true,
    verdict: "mixed",
    period: "2025–ongoing",
    headline: "Factory copilots are graduating into agents that run whole workflows",
    summary:
      "Siemens' Industrial Copilot line (design, production planning, plant operations, maintenance) is expanding from assistants that answer engineer questions into agents that execute multi-step processes across the factory value chain with an orchestrator dispatching specialized sub-agents.",
    outcome:
      "At Siemens' own Bad Neustadt plant, the Insights Hub Production Copilot is credited with turning scattered sensor data into actionable operational insight. With powertrain and battery-assembly partner Thyssenkrupp Automation Engineering, Siemens cites improvements in code quality and development speed from its engineering copilot. Siemens' own marketing claims productivity gains of \"up to 50%\" for adopters — a ceiling figure from the vendor, not an independently audited industry average.",
    lesson:
      "Manufacturing is one of the newer frontiers for agentic AI, not a mature one yet — the named deployments so far are vendor case studies at Siemens' own sites and close partners, worth watching rather than treating as proof the pattern generalizes across the industry.",
    sources: [
      { title: "Siemens introduces AI agents for industrial automation (official)", url: "https://press.siemens.com/global/en/pressrelease/siemens-introduces-ai-agents-industrial-automation" },
      { title: "Siemens lights Industry 5.0 touchpaper with agentic AI for factories — RCR Wireless", url: "https://www.rcrwireless.com/20250512/industry-4-0/siemens-agentic-ai-industry-50" },
    ],
  },
  {
    slug: "duolingo-ai-first-backlash",
    org: "Duolingo",
    domain: "Education",
    agentic: false,
    verdict: "mixed",
    period: "2025–2026",
    headline: "\"AI-first\" tripled course output — and nearly cost Duolingo its users' trust",
    summary:
      "In April 2025, Duolingo's CEO announced the company would go \"AI-first,\" phasing out contract translators and content writers in favor of generative AI for course creation, and used it to launch 148 new language courses — more than doubling its prior catalog.",
    outcome:
      "The announcement, not the technology, was the failure: it read as \"we're replacing people with AI\" and triggered a social-media backlash so sharp that users publicly pledged to delete the app. The CEO walked the framing back within months, clarifying no full-time staff layoffs were planned and that contractors would shift toward higher-judgment creative work rather than being eliminated. Despite the backlash, Duolingo beat quarterly revenue estimates and its stock rose roughly 30% on the results; by mid-2026 the company had further reversed AI-usage performance mandates as full-time hiring kept growing.",
    lesson:
      "The AI use here mostly worked — the course-generation output shipped and revenue held up. What nearly backfired was internal-facing language about replacing people reaching an external, trust-sensitive audience verbatim; the memo needed a different audience in mind before it went out.",
    sources: [
      { title: "The backlash against Duolingo going 'AI-first' didn't even matter — TechCrunch", url: "https://techcrunch.com/2025/08/07/the-backlash-against-duolingo-going-ai-first-didnt-even-matter/" },
      { title: "Duolingo CEO clarifies layoff plans after AI memo controversy — HR Grapevine", url: "https://www.hrgrapevine.com/us/content/article/2025-08-19-no-layoffs-for-full-time-staff-duolingo-ceo-clarifies-ai-plans-after-memo-controversy" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function relatedCaseStudies(cs: CaseStudy, limit = 3): CaseStudy[] {
  return caseStudies
    .filter((c) => c.slug !== cs.slug && (c.domain === cs.domain || c.verdict === cs.verdict))
    .slice(0, limit);
}
