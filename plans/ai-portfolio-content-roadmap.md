# AI Portfolio Content Roadmap

Document ID: AI-ROADMAP-001
Date: 2026-01-11
Status: Active

## Overview

This document defines the planned AI/ML projects for the portfolio. Projects are organized by AI category with estimated status, technical stack, and showcase type.

---

## RAG (Retrieval-Augmented Generation)

### 1. Document Q&A System
- **Status**: planned
- **Tech Stack**: LangChain, OpenAI, Pinecone, FastAPI, React
- **Showcase Type**: Interactive Demo
- **Description**: Upload PDFs or documents, ask questions about them. System retrieves relevant sections and generates answers with source citations. Shows RAG workflow with chunk visualization.
- **Key Features**: Document upload, semantic search, source tracking, answer explanation

### 2. Codebase Navigator
- **Status**: idea
- **Tech Stack**: Tree-sitter, Sentence Transformers, Claude, FastAPI
- **Showcase Type**: Code Tool
- **Description**: Index a GitHub repository. Query questions like "how does authentication work?" and get relevant file snippets plus explanation.
- **Key Features**: Code parsing, semantic indexing, multi-file context, explanation generation

### 3. Personal Knowledge Base
- **Status**: idea
- **Tech Stack**: Obsidian, Chroma, Local LLM, Python
- **Showcase Type**: Privacy-First
- **Description**: Offline semantic search over personal notes with RAG-enhanced Q&A. No data leaves your machine.
- **Key Features**: Local embedding, privacy-first, markdown support, relationship discovery

---

## Knowledge Graphs

### 4. Entity Relationship Visualizer
- **Status**: planned
- **Tech Stack**: spaCy, Neo4j, D3.js, FastAPI, React
- **Showcase Type**: Interactive Graph
- **Description**: Extract entities and relationships from text. Visualize as interactive graph. Explore connections between concepts.
- **Key Features**: Entity extraction, relationship detection, interactive visualization, filtering by type

### 5. Research Paper Explorer
- **Status**: idea
- **Tech Stack**: arXiv API, NetworkX, GraphQL, React
- **Showcase Type**: Search Tool
- **Description**: Map citation networks between research papers. Discover related papers. Visualize research clusters and trending topics.
- **Key Features**: Citation graph, trend detection, paper metadata, recommendation engine

### 6. Concept Mapper
- **Status**: planned
- **Tech Stack**: GPT-4, Cytoscape.js, FastAPI, React
- **Showcase Type**: Learning Tool
- **Description**: Generate knowledge graphs from any topic. Show hierarchies, dependencies, and prerequisite relationships.
- **Key Features**: Automatic graph generation, hierarchy detection, interactive exploration, export to multiple formats

---

## MCP (Model Context Protocol) Integrations

### 7. Claude Code Tools Demo
- **Status**: in-progress
- **Tech Stack**: Claude API, MCP SDK, TypeScript, React
- **Showcase Type**: Tool Use
- **Description**: Custom MCP server with multiple tools (calculator, file reader, API caller). Show how tools are selected and used by Claude.
- **Key Features**: Tool selection visualization, reasoning explanation, real-time execution, error handling

### 8. Multi-Model Orchestrator
- **Status**: idea
- **Tech Stack**: Claude, GPT-4, Llama API, Router Service, FastAPI
- **Showcase Type**: Comparison
- **Description**: Route queries to optimal model based on cost/quality tradeoffs. A/B testing interface to compare outputs.
- **Key Features**: Model routing logic, cost tracking, quality metrics, comparison view, latency analysis

### 9. IDE Copilot Extension
- **Status**: idea
- **Tech Stack**: VS Code API, MCP, Tree-sitter, Claude API
- **Showcase Type**: Dev Tool
- **Description**: VS Code extension with context-aware code completion, code explanation, and test generation using MCP tools.
- **Key Features**: Context window management, code parsing, test generation, documentation

---

## LLM Orchestration & Agents

### 10. Research Agent System
- **Status**: planned
- **Tech Stack**: CrewAI, Claude, Tavily Search API, FastAPI, React
- **Showcase Type**: Multi-Agent
- **Description**: Multi-agent team: Research Agent (finds info), Analyst Agent (evaluates), Writer Agent (summarizes). Shows collaboration and reasoning.
- **Key Features**: Agent collaboration logs, reasoning visualization, source tracking, iterative refinement

### 11. Autonomous Task Executor
- **Status**: idea
- **Tech Stack**: LangGraph, Claude, Tool Use, Memory, FastAPI
- **Showcase Type**: Workflow
- **Description**: Break complex tasks into steps and execute with feedback loops. Self-correct on errors. Show execution trace.
- **Key Features**: Task decomposition, execution tracing, error recovery, step visualization, reflection

### 12. Code Review Agent
- **Status**: idea
- **Tech Stack**: AST Parsing, Claude API, GitHub API, FastAPI, React
- **Showcase Type**: Dev Tool
- **Description**: Analyze PRs automatically. Suggest improvements. Explain reasoning. Learn from feedback.
- **Key Features**: Code analysis, suggestions with explanations, feedback integration, learning loop

---

## Embeddings & Vector Search

### 13. Semantic Image Search
- **Status**: idea
- **Tech Stack**: CLIP, Qdrant, React, FastAPI
- **Showcase Type**: Visual Demo
- **Description**: Search images by text description. Show similarity scores. Visualize embedding space.
- **Key Features**: Text-to-image search, similarity scoring, dimension reduction visualization, batch operations

### 14. Portfolio Similarity Finder
- **Status**: planned
- **Tech Stack**: Sentence Transformers, FAISS, FastAPI, React
- **Showcase Type**: Recommendation
- **Description**: Find similar projects in portfolio. Show embedding space. Explain similarity factors.
- **Key Features**: Semantic similarity search, embedding visualization, factor analysis, recommendations

### 15. Content Deduplication
- **Status**: idea
- **Tech Stack**: MinHash, SimHash, Sentence Transformers, FastAPI
- **Showcase Type**: Data Tool
- **Description**: Detect near-duplicate content. Show similarity heatmaps. Configurable thresholds.
- **Key Features**: Duplicate detection, similarity heatmaps, threshold tuning, batch processing

---

## Prompt Engineering & Evaluation

### 16. Prompt Playground
- **Status**: idea
- **Tech Stack**: Claude API, React, Diff View Library, Storage
- **Showcase Type**: Interactive
- **Description**: Test and iterate on prompts. Compare outputs. Track quality metrics. Version control prompts.
- **Key Features**: Side-by-side comparison, metrics tracking, version history, export/import

### 17. LLM Output Evaluator
- **Status**: planned
- **Tech Stack**: RAGAS, Claude API, Custom Metrics, FastAPI, React
- **Showcase Type**: Analytics
- **Description**: Evaluate RAG accuracy. Measure hallucination. Track performance trends over time.
- **Key Features**: Automated evaluation, metric dashboards, trend analysis, regression detection

### 18. Few-Shot Generator
- **Status**: idea
- **Tech Stack**: Template Engine, Examples Database, Claude API, FastAPI
- **Showcase Type**: Dev Tool
- **Description**: Generate optimal few-shot examples automatically. Test variations. Measure impact on output quality.
- **Key Features**: Automatic example generation, variation testing, impact measurement, recommendation

---

## Generative AI Applications

### 19. AI Art Generator
- **Status**: idea
- **Tech Stack**: Stable Diffusion, ControlNet, FastAPI, React
- **Showcase Type**: Creative
- **Description**: Text-to-image generation with style control. Show generation process. Compare different models/seeds.
- **Key Features**: Style transfer, image variation, generation history, model comparison

### 20. Code-to-Documentation
- **Status**: planned
- **Tech Stack**: Claude API, Markdown Parser, AST, FastAPI, React
- **Showcase Type**: Dev Tool
- **Description**: Automatically generate documentation from code. Maintain consistency. Update when code changes.
- **Key Features**: Doc generation, consistency checking, auto-update, format selection

### 21. Conversational UI Builder
- **Status**: idea
- **Tech Stack**: Claude API, React, Storybook, Component Library
- **Showcase Type**: Prototyping
- **Description**: Describe UI in natural language. Generate React components. Iterate with feedback.
- **Key Features**: Natural language to component mapping, iteration feedback, preview, code export

---

## Project Status Definitions

- **idea**: Conceptual stage; planned for future exploration
- **planned**: Requirements defined; ready to start implementation
- **in-progress**: Currently being developed; may have partial demos
- **complete**: Fully implemented with live demo or code available
- **archived**: Previously developed; maintained but not actively updated

## Next Steps

1. **Q1 2026**: Develop Document Q&A System, Entity Relationship Visualizer, Concept Mapper
2. **Q2 2026**: Add Research Agent System, Portfolio Similarity Finder, Code-to-Documentation
3. **Q3 2026**: Expand with Codebase Navigator, Multi-Model Orchestrator, LLM Output Evaluator
4. **Q4 2026+**: Continue adding projects from pipeline based on portfolio priorities

## Showcase Strategy

Each project will include:
- Live interactive demo (where applicable)
- Technical walkthrough/explanation
- Source code link (GitHub)
- Key technologies highlighted
- Performance metrics (if applicable)
- Real-world use cases

---

**Last Updated**: 2026-01-11
**Next Review**: 2026-02-11
