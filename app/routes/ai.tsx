import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import "../styles/ai.css";

export const meta: MetaFunction = () => {
  return [
    { title: "AI Work Portfolio - Adam Aslan" },
    {
      name: "description",
      content:
        "Nine AI systems (eight shipped, one in progress): a 457-name signal catalog, a self-grading eval harness, a six-seat deliberation council, a physical anti-hallucination gate, and self-healing model infrastructure.",
    },
    { property: "og:title", content: "AI Work Portfolio - Adam Aslan" },
    {
      property: "og:description",
      content:
        "What actually runs: multi-agent orchestration, citation grounding, LLM-as-judge evaluation, and self-healing model infra.",
    },
    { property: "og:type", content: "website" },
    {
      name: "keywords",
      content:
        "AI, Multi-Agent, LLM-as-judge, RAG, Grounding, MCP, Evaluation, Claude, OpenRouter, Ollama",
    },
  ];
};

type Status = "shipped" | "in progress";

interface AIFeature {
  project_id: string;
  name: string;
  hook: string;
  why_hard: string;
  tech_stack: string;
  status: Status;
  url: string;
  url_label: string;
}

const FINANCIAL: AIFeature[] = [
  {
    project_id: "boll-signals",
    name: "boll-signals — a 457-name technical-analysis signal catalog in one file",
    hook:
      "A single self-contained Python module computes indicator columns from OHLCV, runs 23 categories of bar-by-bar detectors, and scores every bar into a net bias via a ConfluenceRanker. A MultiTimeframeOutlook blends confluence across intervals into day-trade / swing / invest views.",
    why_hard:
      "The signal vocabulary is 457 distinct named signals across 23 categories (MA_CROSS, RSI, MACD, BB_BREAKOUT, SQUEEZE, ICHIMOKU, PSAR, AROON, MFI, VWAP, …). Reports are self-documenting: every run prints a per-category table of possible vs. fired signals, so a quiet report is legibly quiet rather than ambiguously broken. 69 tests run on seeded synthetic data — no network, no yfinance.",
    tech_stack: "Python · pandas · numpy · (optional) yfinance",
    status: "shipped",
    url: "https://github.com/adamaslan/nuwrrrld-portal",
    url_label: "Signal catalog + engine summary",
  },
  {
    project_id: "eval-harness",
    name: "The council eval harness — a self-selecting cohort graded on a 7-horizon ladder",
    hook:
      "Every month the system freezes the 20 strongest directional signals (10 bear / 10 bull), then tracks them daily even as the live ranking moves away — so it cannot quietly re-pick winners. Outcomes score across a 7-horizon ladder (d1 w1 m1 m3 m6 ytd y1), each with a horizon-scaled dead band (0.5% at 1 day → 8% at 1 year).",
    why_hard:
      "This is the part almost nobody builds — an AI system that keeps score on itself and can lose. The centerpiece is an outcome × reasoning judge quadrant: right-for-the-right-reason, right-for-the-wrong-reason, wrong-but-well-reasoned, wrong-and-badly-reasoned. n < 30 renders as insufficient, not as a number. Built on a pure view-model so the mobile app can adopt it unchanged.",
    tech_stack: "Next.js 16 · TypeScript · Neon Postgres · LLM-as-judge · Recharts",
    status: "shipped",
    url: "https://github.com/adamaslan/nuwrrrld-portal/pull/92",
    url_label: "PRs #85 → #87 → #90 → #92",
  },
  {
    project_id: "schwab-nu1",
    name: "schwab-nu1 — read-only brokerage integration enforced at three independent levels",
    hook:
      "Connects to a live Charles Schwab account via OAuth 2.0 PKCE, pulls positions and real-time marks, and reconstructs tax lots — and is structurally incapable of placing an order.",
    why_hard:
      "\"Read-only\" is usually a promise. Here it is enforced three ways with no shared failure mode: the OAuth request always sends scope=readonly so the token itself can't trade; schwabFetch() — the one function all Trader API calls flow through — throws on any non-GET; and a GitHub Action fails any PR that introduces a write call. Plus AES-256-GCM token encryption at rest with 30-minute auto-refresh, and FIFO cost-basis matching across a full 2-year window.",
    tech_stack: "Next.js 15 · React 19 · Drizzle ORM · SQLite/Postgres · Zod · Tailwind 4",
    status: "shipped",
    url: "https://github.com/adamaslan/schwab-nu1",
    url_label: "github.com/adamaslan/schwab-nu1",
  },
];

const MULTI_AGENT: AIFeature[] = [
  {
    project_id: "six-seat-council",
    name: "The six-seat council — structured disagreement with a synthesizing CHAIR",
    hook:
      "Six specialist seats argue about one ticker and a CHAIR synthesizes the dissent: T1 (1 day → 30–60 days), T2 (2 months → 3–5 years), RISK (explicit devil's advocate), MACRO, QUANT, CHAIR.",
    why_hard:
      "Seats aren't just different prompts — they get different evidence. buildGroundedBrief() walls each one off: T1/T2 are horizon-walled, RISK receives a deliberate counter-slice, MACRO is full-text-search only, QUANT gets numbers only. Every seat answers into a fixed 4-field scaffold — OUTLOOK / BECAUSE / INVALIDATION / EXECUTION — which makes an unfalsifiable answer structurally impossible.",
    tech_stack: "Next.js 16 · TypeScript · OpenRouter · Neon Postgres",
    status: "shipped",
    url: "https://github.com/adamaslan/nuwrrrld-portal/pull/39",
    url_label: "six-seat wiring: PR #37, #39",
  },
  {
    project_id: "verbatim-gate",
    name: "The verbatim-quote gate — a physical anti-hallucination check, not a prompt",
    hook:
      "Before any grounded rule reaches a seat, its quote field must be a verbatim substring of its source chunk. If it isn't, the rule is dropped — silently, mechanically, before the model ever sees it.",
    why_hard:
      "Almost every \"reduce hallucination\" approach is asking the model nicely and hoping. This is a string check that a fabricated citation cannot pass, positioned upstream of generation. Around it: a taxonomy.ts, three Neon tables (corpus_chunks, grounding_pack, grounding_misses — misses are recorded, so the gap is measurable), and a zero-dependency ESM port of the Python ingest.py chunker so the TS web stack and the Python research stack chunk text identically.",
    tech_stack: "TypeScript (zero-dep chunker) · Neon Postgres FTS · GitHub Actions",
    status: "shipped",
    url: "https://github.com/adamaslan/nuwrrrld-portal/pull/36",
    url_label: "PRs #35 → #36 → #37",
  },
  {
    project_id: "ai-text-opt",
    name: "ai-text-opt — Generate → Critique → Refine, entirely on a local 2B model (Feb 2025)",
    hook:
      "The origin of everything above, and it had nothing to do with finance. GeneratorAgent → CriticAgent → RefinerAgent, up to 3 refinement iterations, running fully offline on Ollama (Gemmasutra-Mini-2B) with zero cloud API calls.",
    why_hard:
      "The critic's prompt closes a real loop and the refiner answers that critique rather than regenerating blind. Supported by a ContextManager, Validator, EmotionSummarizer, and a SystemMetrics class tracking per-agent latency and quality, coordinated with ThreadPoolExecutor(max_workers=4). Retry discipline visibly hardens commit over commit — the \"small model, so validate and retry\" instinct arrived a year before it was doctrine. The architecture is 15 months older than the product.",
    tech_stack: "Python · Ollama (local LLM) · ThreadPoolExecutor · Jupyter",
    status: "shipped",
    url: "https://github.com/adamaslan/ai-text-opt-1024",
    url_label: "ai-text-opt → ai-text-opt-1024",
  },
];

const INFRA: AIFeature[] = [
  {
    project_id: "free-model-chain",
    name: "A self-healing free-model chain, deployed on three independent schedulers",
    hook:
      "FREE_MODEL_CHAIN refreshes itself weekly — probe OpenRouter's live $0/:free catalog → rank → rewrite the source file → open a PR only if something changed. A safety rail refuses to ever write a chain with fewer than one working model.",
    why_hard:
      "It is the fix for a real, expensive, silent failure: five of six seat models had been retired by OpenRouter, and every affected seat was burning a guaranteed-failed round trip before falling through — for weeks, with no error surfaced. The refresher runs on three independent schedulers on purpose (GCP Cloud Run Job, Modal Cron, and a weekly automation), all idempotent, converging on the same PR branch — redundancy against the scheduler itself dying.",
    tech_stack: "Node ESM · OpenRouter API · GCP Cloud Run + Secret Manager · Modal · GitHub Actions",
    status: "shipped",
    url: "https://github.com/adamaslan/nuwrrrld-portal/pull/75",
    url_label: "scripts/refresh-free-models.mjs (PR #75)",
  },
  {
    project_id: "signals-platform",
    name: "Signals as a platform — collapsing five disagreeing surfaces into one typed seam",
    hook:
      "The signals engine had five different ways to invoke it and no two agreed: a FastAPI app never deployed, a console script that takes no symbol and runs no analysis, 13 argparse scripts with overlapping flags, shell wrappers, and a GitHub Action that bypassed all of it. The fix: one typed signals_app.service module — analyze() scan() history() detectors() backtest() calibrate() universe() health() — with HTTP, CLI, and MCP as thin adapters over it.",
    why_hard:
      "The real bug is structural: the scan pipeline and the API pipeline were two separate assemblies of the same L1–L5 layers, free to drift apart forever. The MCP adapter is the payoff — it makes the engine agentically queryable: an agent can ask \"what's the signal on NVDA, and how often has that detector been right?\" with no glue code.",
    tech_stack: "Python · Pydantic · FastAPI · Typer/argparse · MCP SDK",
    status: "in progress",
    url: "https://github.com/adamaslan/homebase/blob/main/docs/signals-app-docs/signals-as-api-cli-mcp.md",
    url_label: "design doc (unshipped)",
  },
  {
    project_id: "ulysses-graph",
    name: "Ulysses force-directed knowledge graph — the range card",
    hook:
      "An interactive D3 force graph of Joyce's Ulysses — 18 episodes, characters, themes, and places — built from a hand-authored close-reading corpus with audio timestamps, cross-references into Portrait, and a 100-keyword index.",
    why_hard:
      "The engineering is modest; the ontology is the work. Deciding that Bloom's Rudy grief is a theme edge spanning Hades and Ithaca — not a character attribute — is a modeling judgment no LLM makes for you. It is the same entity/relationship extraction problem as the finance corpus, on a domain where the answers are contested.",
    tech_stack: "React · D3 · Vite · Oxlint",
    status: "shipped",
    url: "https://github.com/adamaslan/ulysses-graph-app",
    url_label: "github.com/adamaslan/ulysses-graph-app",
  },
];

const STACK_CHIPS = [
  "OpenRouter",
  "Claude API",
  "Ollama",
  "Neon Postgres",
  "Chroma / Zilliz",
  "Voyage rerank",
  "Firestore",
  "Supabase",
  "MCP SDK",
  "pandas / numpy",
  "Next.js",
  "Expo",
  "D3",
  "Drizzle",
  "GCP Cloud Run",
  "Modal",
];

/** Renders a feature's status as a text label plus color (never color alone). */
function Badge({ status }: { status: Status }) {
  const isShipped = status === "shipped";
  return (
    <span
      className={`ai-badge ${isShipped ? "ai-badge--shipped" : "ai-badge--progress"}`}
    >
      {status}
    </span>
  );
}

/** One feature card: title, hook, "why it's hard", tech line, source link, status badge. */
function FeatureCard({ f }: { f: AIFeature }) {
  return (
    <article className="ai-card">
      <div className="ai-card-top">
        <h3 className="ai-card-title">{f.name}</h3>
        <Badge status={f.status} />
      </div>
      <p className="ai-card-hook">{f.hook}</p>
      <p className="ai-card-why">
        <strong>Why it&apos;s hard: </strong>
        {f.why_hard}
      </p>
      <div className="ai-card-foot">
        <span className="ai-tech-list">{f.tech_stack}</span>
        <a
          className="ai-card-link"
          href={f.url}
          target="_blank"
          rel="noreferrer"
        >
          {f.url_label} ↗
        </a>
      </div>
    </article>
  );
}

/** A titled `<section>` wrapping one group of feature cards. */
function Group({ title, features }: { title: string; features: AIFeature[] }) {
  return (
    <section className="ai-group" aria-label={title}>
      <h2 className="ai-group-heading">{title}</h2>
      <div className="ai-cards">
        {features.map((f) => (
          <FeatureCard key={f.project_id} f={f} />
        ))}
      </div>
    </section>
  );
}

/** The `/ai` route: nine AI feature cards in three groups, plus stack chips and a roadmap note. */
export default function AIPortfolio() {
  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
  ];

  return (
    <div className="ai-page">
      <Navbar links={navLinks} logo={<div className="navbar-logo">Adam Timur Aslan</div>} />

      <main className="ai-main">
        <header className="ai-header">
          <h1 className="ai-title">AI Work Portfolio</h1>
          <p className="ai-subtitle">Nine real systems — eight shipped, one in progress. Not a roadmap.</p>
        </header>

        <p className="ai-throughline">
          A multi-agent council that started as a cover-letter critic on a local 2B
          model in February 2025, became a six-seat financial deliberation engine
          with citation grounding, and now grades its own predictions across seven
          time horizons. Several of these features live inside one repo
          (nuwrrrld-portal) — one system, many surfaces.
        </p>

        <Group title="Financial Systems" features={FINANCIAL} />
        <Group title="Multi-Agent AI" features={MULTI_AGENT} />
        <Group title="Infrastructure & Range" features={INFRA} />

        <section className="ai-group" aria-label="Stack across all AI work">
          <h2 className="ai-group-heading">Stack across all AI work</h2>
          <ul className="ai-chips">
            {STACK_CHIPS.map((tech) => (
              <li key={tech} className="ai-chip">
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section className="ai-next" aria-label="What's next">
          <h2>What&apos;s next</h2>
          <p>
            An earlier planning doc sketched 21 hypothetical projects (Document Q&amp;A,
            semantic image search, and similar). That list is kept as a roadmap
            appendix, not shown here as shipped work — this page shows what actually
            runs. See{" "}
            <a
              href="https://github.com/adamaslan/dacubes2/blob/main/plans/ai-portfolio-content-roadmap.md"
              target="_blank"
              rel="noreferrer"
            >
              plans/ai-portfolio-content-roadmap.md
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
