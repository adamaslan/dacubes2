import Navbar from "~/components/navbar";
import type { MetaFunction } from "@remix-run/node";
import "../styles/index.css";

export const meta: MetaFunction = () => {
  return [
    { title: "AI Work Portfolio - Adam Aslan" },
    { name: "description", content: "Explore AI engineering projects including RAG systems, knowledge graphs, MCP integrations, LLM orchestration, and embeddings applications." },
    { property: "og:title", content: "AI Work Portfolio - Adam Aslan" },
    { property: "og:description", content: "AI/ML engineering portfolio showcasing RAG, knowledge graphs, and intelligent systems." },
    { property: "og:type", content: "website" },
    { name: "keywords", content: "AI, Machine Learning, RAG, Knowledge Graphs, MCP, LLM, Embeddings, Claude, OpenAI" }
  ];
};

export default function AIPortfolio() {
  return (
    <div className="page-container">
      <Navbar
        links={[
          { href: "/", text: "Home" },
          { href: "/about", text: "About" },
          { href: "/contact", text: "Contact" }
        ]}
        logo={<div className="navbar-logo">Adam Aslan&apos;s Portfolio</div>}
      />

      <div className="header-content">
        <h1 className="main-title">AI Work Portfolio</h1>
        <h2 className="subtitle">Intelligent Systems &amp; Machine Learning</h2>
      </div>

      <div style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "#00ff88" }}>
            AI & ML Projects
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#cccccc" }}>
            This section showcases AI engineering work including:
          </p>
          <ul style={{ fontSize: "16px", lineHeight: "1.8", color: "#cccccc", marginLeft: "20px" }}>
            <li><strong style={{ color: "#00ff88" }}>RAG (Retrieval-Augmented Generation)</strong> - Document Q&A, codebase navigation, knowledge bases</li>
            <li><strong style={{ color: "#00ff88" }}>Knowledge Graphs</strong> - Entity extraction, relationship mapping, semantic networks</li>
            <li><strong style={{ color: "#9945ff" }}>MCP Integrations</strong> - Model Context Protocol, tool-use demonstrations, multi-model orchestration</li>
            <li><strong style={{ color: "#9945ff" }}>LLM Orchestration</strong> - Multi-agent systems, workflow automation, agentic reasoning</li>
            <li><strong style={{ color: "#00ff88" }}>Embeddings & Vector Search</strong> - Semantic similarity, clustering, recommendations</li>
            <li><strong style={{ color: "#9945ff" }}>Prompt Engineering</strong> - Optimization, evaluation, few-shot learning</li>
            <li><strong style={{ color: "#00ff88" }}>Generative AI</strong> - Text generation, code synthesis, creative applications</li>
          </ul>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "#00ff88" }}>
            Featured Technologies
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginTop: "12px"
          }}>
            {["LangChain", "Claude API", "OpenAI", "LangGraph", "CrewAI", "Neo4j", "Qdrant", "FAISS", "Pinecone", "Chroma", "spaCy", "Tree-sitter"].map(tech => (
              <div
                key={tech}
                style={{
                  padding: "12px",
                  background: "rgba(0, 255, 136, 0.1)",
                  border: "1px solid rgba(0, 255, 136, 0.3)",
                  borderRadius: "4px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#00ff88"
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "#00ff88" }}>
            Project Details Coming Soon
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#cccccc" }}>
            Detailed case studies, interactive demos, and technical breakdowns of each AI project will be added as they mature.
            Check back soon for comprehensive portfolio content including links to live demos and source code repositories.
          </p>
        </section>
      </div>
    </div>
  );
}
