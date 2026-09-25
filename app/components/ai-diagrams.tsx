/** Inline-SVG diagrams for the /ai cards. Colors come from `.ai-diagram*` classes in ai.css. */

interface NodeProps {
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  variant?: "default" | "gate" | "drop" | "hub";
}

function Node({ x, y, w, h = 34, label, variant = "default" }: NodeProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        className={`ai-diagram-node ai-diagram-node--${variant}`}
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="ai-diagram-text"
      >
        {label}
      </text>
    </g>
  );
}

function Arrow({ d, dashed = false }: { d: string; dashed?: boolean }) {
  return (
    <path
      d={d}
      className={`ai-diagram-arrow${dashed ? " ai-diagram-arrow--dashed" : ""}`}
      markerEnd="url(#ai-arrowhead)"
    />
  );
}

function Defs() {
  return (
    <defs>
      <marker
        id="ai-arrowhead"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" className="ai-diagram-arrowhead" />
      </marker>
    </defs>
  );
}

/** Corpus → chunk → candidate rule → verbatim gate → pack → seat, with the dropped-rule branch. */
export function VerbatimGateDiagram() {
  return (
    <svg
      viewBox="0 0 640 150"
      className="ai-diagram"
      role="img"
      aria-label="Corpus is chunked into candidate rules. A verbatim-quote gate passes rules whose quote is a substring of the source chunk into the grounding pack for a seat, and drops the rest."
    >
      <Defs />
      <Node x={4} y={30} w={78} label="corpus" />
      <Node x={110} y={30} w={78} label="chunk" />
      <Node x={216} y={30} w={100} label="candidate rule" />
      <Node x={344} y={22} w={110} h={50} label="verbatim gate" variant="gate" />
      <Node x={482} y={30} w={64} label="pack" />
      <Node x={574} y={30} w={62} label="seat" />
      <Node x={344} y={100} w={110} label="dropped + logged" variant="drop" />
      <Arrow d="M82 47 H108" />
      <Arrow d="M188 47 H214" />
      <Arrow d="M316 47 H342" />
      <Arrow d="M454 47 H480" />
      <Arrow d="M546 47 H572" />
      <Arrow d="M399 72 V98" dashed />
      <text x={410} y={90} className="ai-diagram-note">
        quote ∉ chunk
      </text>
      <text x={462} y={40} className="ai-diagram-note">
        quote ∈ chunk
      </text>
    </svg>
  );
}

/** Three independent schedulers converging on one PR branch. */
export function SchedulerDiagram() {
  return (
    <svg
      viewBox="0 0 640 150"
      className="ai-diagram"
      role="img"
      aria-label="Three independent idempotent schedulers — GCP Cloud Run Job, Modal Cron, and a weekly automation — each run the same refresher and converge on a single pull-request branch."
    >
      <Defs />
      <Node x={4} y={8} w={190} label="GCP Cloud Run Job" />
      <Node x={4} y={58} w={190} label="Modal Cron" />
      <Node x={4} y={108} w={190} label="Weekly automation" />
      <Node x={270} y={53} w={130} h={44} label="refresh-free-models" variant="hub" />
      <Node x={474} y={53} w={162} h={44} label="one PR branch" variant="gate" />
      <Arrow d="M194 25 C232 25 232 66 268 68" />
      <Arrow d="M194 75 H268" />
      <Arrow d="M194 125 C232 125 232 84 268 82" />
      <Arrow d="M400 75 H472" />
      <text x={406} y={66} className="ai-diagram-note">
        idempotent
      </text>
    </svg>
  );
}

/** Before: five surfaces, five paths. After: five adapters into one typed service. */
export function SeamDiagram() {
  const labels = ["FastAPI app", "console script", "argparse ×13", "shell wrappers", "GitHub Action"];
  return (
    <svg
      viewBox="0 0 640 210"
      className="ai-diagram"
      role="img"
      aria-label="Before: five invocation surfaces each reach the engine by a different path. After: HTTP, CLI and MCP adapters all call one typed signals_app.service module."
    >
      <Defs />
      <text x={4} y={12} className="ai-diagram-caption">
        before
      </text>
      <text x={344} y={12} className="ai-diagram-caption">
        after
      </text>
      {labels.map((label, i) => (
        <g key={label}>
          <Node x={4} y={22 + i * 36} w={120} h={28} label={label} />
          <Arrow d={`M124 ${36 + i * 36} L${230 + (i % 2) * 14} ${100 + ((i * 17) % 40)}`} dashed />
        </g>
      ))}
      <Node x={236} y={84} w={84} h={44} label="engine" variant="drop" />
      <Node x={344} y={22} w={80} h={28} label="HTTP" />
      <Node x={344} y={88} w={80} h={28} label="CLI" />
      <Node x={344} y={154} w={80} h={28} label="MCP" />
      <Node x={490} y={72} w={146} h={60} label="signals_app.service" variant="gate" />
      <Arrow d="M424 36 C456 36 456 92 488 96" />
      <Arrow d="M424 102 H488" />
      <Arrow d="M424 168 C456 168 456 112 488 108" />
    </svg>
  );
}
