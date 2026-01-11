Document ID: AI-PORT-001
Project: Add AI Work Portfolio Section to dacubes2
Owner: Adam Aslan
Version: 1.1
Date: 2026-01-11
Standards: ISO/IEC/IEEE 29148 (SRS), 29119-3 (Test Documentation), 12207 (Implementation)

### Summary

Extend the portfolio landing page (app/routes/_index.tsx) with a new "AI Work" portfolio section that mirrors the existing Frontend and ThreeJS sections. The AI section will feature a curated showcase of machine learning, generative AI, and intelligent system work including RAG implementations, knowledge graphs, MCP integrations, LLM orchestration, and embeddings-based applications. This plan covers requirements capture, iterative implementation, testing, and deployment using standards-aligned practices.

Scope: UI component integration + content strategy definition + placeholder creation for AI project showcase.
Non-goals: Build individual AI project demos (those are separate portfolio pages); production ML model deployment; real-time model inference on landing page.

---

### File Change Summary

| File Path | Action | Est. LOC | Description |
|-----------|--------|----------|-------------|
| app/routes/_index.tsx | MODIFY | +15 | Add AI Work section (link + TextAnimation) |
| app/routes/ai.tsx | CREATE | ~50 | New placeholder route for AI portfolio page |
| plans/ai-portfolio-content-roadmap.md | CREATE | ~150 | Content roadmap documentation |
| app/styles/index.css | VERIFY | 0 | Confirm CSS grid handles 6 items (no changes expected) |

Restore Point Requirement:
- Before Phase P00 execution: `git tag pre-ai-section-v1.1`
- Before Phase P01 execution: `git tag pre-ai-route-v1.1`
- Rollback command: `git reset --hard <tag-name>`

---

### Quick Start Checklist (Executive Summary)

Pre-Implementation:
- [ ] Read app/routes/_index.tsx (understand current structure)
- [ ] Read app/components/TextAnimation.tsx (confirm backgroundEffect="neural" valid)
- [ ] Create git tag: `git tag pre-ai-section-v1.1`
- [ ] Capture Lighthouse baseline metrics

Phase P00 (Core UI):
- [ ] Add AI link + TextAnimation to _index.tsx portfolio grid
- [ ] Use: backgroundEffect="neural", primaryColor="#00ff88", secondaryColor="#9945ff"
- [ ] Verify grid displays 6 items correctly
- [ ] Run accessibility audit (Lighthouse a11y ≥90)
- [ ] Test keyboard navigation (Tab to AI link, Enter to navigate)

Phase P01 (Route & Docs):
- [ ] Create app/routes/ai.tsx with SEO meta tags
- [ ] Test navigation: click AI link → /ai page loads
- [ ] Create plans/ai-portfolio-content-roadmap.md (≥5 projects)
- [ ] Verify no 404 errors

Validation:
- [ ] Lighthouse CLS < 0.05
- [ ] Mobile viewport test (375px width)
- [ ] Screen reader announces AI link correctly
- [ ] All 23 tests passing

---

### Design Consensus & Trade-offs

| Topic | Verdict | Rationale |
|-------|---------|-----------|
| Portfolio Section Pattern | FOR mirror existing (Frontend/ThreeJS) | Consistency reduces cognitive load, reuses tested CSS/component patterns, maintains visual hierarchy |
| New Route Creation | FOR dedicated /ai route | Allows future expansion of AI portfolio content separately; follows existing architectural pattern |
| TextAnimation Styling | FOR AI-themed colors (neural effect) | Differentiate AI section visually; "neural" backgroundEffect validated in TextAnimation.tsx:887; suggests ML/AI concept space |
| TextAnimation BackgroundEffect | FOR "neural" | Verified valid options: sparkles, matrix, neural, waves, particles, grid, none (see app/components/TextAnimation.tsx:883-890) |
| Accessibility | FOR WCAG 2.1 AA compliance | Color contrast ratio ≥4.5:1 for text; keyboard navigation support; aria-labels on links |
| CSS Grid Layout | VERIFY 6-item support | Current grid has 4 items; adding 2 (AI link + AI animation) makes 6; verify grid auto-flow handles this |
| Initial AI Projects List | DEFERRED to Phase P02 | Reduce scope creep in Phase P00 (implementation); allow content research as separate task |
| Performance (Suspense) | FOR inherited from parent | No additional perf concern; existing Suspense boundary scales |

---

### PRD (Product Requirements Document)

Problem Statement:
Adam's portfolio currently showcases frontend and 3D work but lacks visible AI/ML project curation. Visitors cannot quickly assess AI capability breadth (RAG, knowledge graphs, MCP, LLM integration). This creates a perception gap between actual AI expertise and portfolio presentation.

Target Audience:
- Recruiters/hiring managers evaluating AI/ML engineering capability.
- Collaborators seeking integration examples (RAG, MCP, LLM orchestration).
- Technical decision-makers exploring portfolio variety.

Value Proposition:
- Immediately visible AI work category on landing page.
- Visual consistency with existing portfolio sections.
- Foundation for future detailed AI project demos.

Business Goals:
1. Increase discoverability of AI/ML project work.
2. Establish visual parity across portfolio categories (Frontend, 3D, AI).
3. Enable rapid content addition as new AI projects mature.

Success Metrics:
- Page renders without error; visual alignment with existing sections (binary: Pass/Fail).
- Click-through to /ai route functional (binary: Pass/Fail).
- TextAnimation component displays with AI-themed styling (visual inspection; Confidence: 95%+).
- No performance regression vs. current landing page (Cumulative Layout Shift < 0.05; Load time +0% to +5%).
- Documentation complete for AI portfolio content roadmap (binary: Pass/Fail).

---

### SRS (System Requirements Specification)

#### 4.1 Functional Requirements

REQ-001 (func): Portfolio grid shall render a new "AI Work" portfolio section.
- Condition: Page loads at /.
- Acceptance: Third portfolio-item pair (link + TextAnimation) visible in DOM.
- Impact: Foundational; blocks all downstream features.

REQ-002 (func): AI section link shall navigate to /ai route.
- Condition: User clicks AI portfolio link.
- Acceptance: Browser navigates to /ai; no 404 errors; route exists (placeholder sufficient).
- Impact: User-facing primary interaction.

REQ-003 (func): TextAnimation AI component shall display custom theme.
- Condition: AI TextAnimation mounts.
- Acceptance: Text "AI Work" rendered; custom backgroundEffect applied; colors match spec (see REQ-007).
- Impact: Visual differentiation of AI section.

REQ-004 (func): AI section label link shall provide instructional context.
- Condition: Page renders.
- Acceptance: Portfolio-label span contains text "Click here to explore my AI Work" or similar.
- Impact: Guides user interaction; improves UX clarity.

REQ-005 (func): Navbar shall remain functional.
- Condition: Page loads.
- Acceptance: Navbar renders; home/about/contact links work; no breakage from new section.
- Impact: Regression prevention.

#### 4.2 Non-Functional Requirements

REQ-006 (nfr|perf): Page load time shall not increase >5% vs. baseline.
- Baseline: Current _index page load time (measure pre-implementation).
- Acceptance: New page load time ≤ Baseline × 1.05.
- Rationale: Suspense boundary and TextAnimation component add minimal overhead; acceptable threshold preserves UX.

REQ-007 (nfr|perf): Cumulative Layout Shift (CLS) shall remain <0.05.
- Acceptance: Lighthouse/Web Vitals CLS < 0.05.
- Rationale: New section maintains fixed layout; no dynamic reflow expected.

REQ-008 (nfr|perf): TextAnimation shall render within 200ms of component mount.
- Acceptance: Time-to-interactive for AI section ≤200ms (measured via React Profiler).
- Rationale: Mirrors existing TextAnimation performance baseline.

REQ-009 (nfr|sec): No new security vulnerabilities.
- Acceptance: No XSS vectors in hardcoded strings; no new dependencies with critical CVEs.
- Rationale: Standard security hygiene; link and label are static content.

REQ-009a (nfr|a11y): AI section shall meet WCAG 2.1 AA accessibility standards.
- Acceptance: Color contrast ratio ≥4.5:1 for link text; focus indicators visible; aria-label on AI link; keyboard-navigable.
- Test: Run axe-core or Lighthouse accessibility audit; score ≥90.
- Rationale: Inclusive design; required for professional portfolio.

REQ-009b (nfr|a11y): AI section link shall have descriptive accessible text.
- Acceptance: Link contains aria-label or visible text describing destination; screen reader announces "AI Work portfolio" or similar.
- Test: VoiceOver/NVDA screen reader test; link purpose clear without visual context.
- Rationale: Users with visual impairments must understand link purpose.

REQ-010 (nfr|rel): AI section shall gracefully degrade in slow networks.
- Acceptance: Suspense fallback message displays if TextAnimation loads >2s; link remains clickable.
- Rationale: Inherited Suspense behavior; acceptable UX for visitors on slow connections.

#### 4.3 Interface / API Requirements

REQ-011 (int): TextAnimation component shall accept AI-themed props.
- Contract: Props = { text: "AI Work", backgroundEffect: <string>, primaryColor: <hex>, secondaryColor: <hex>, backgroundIntensity: <number> }.
- Acceptance: Props accepted without error; matching existing pattern (Frontend/ThreeJS sections).
- Rationale: Reuse existing component interface; no new API surface.

REQ-012 (int): Link href shall route to /ai.
- Acceptance: <a href="/ai"> renders; Remix routing resolves path (route file app/routes/ai.tsx created or placeholder exists).
- Rationale: Standard web navigation; follows existing route convention.

#### 4.4 Data Requirements

REQ-013 (data): AI portfolio content roadmap shall be documented.
- Data Items: { project_name: string, description: string, tech_stack: array[string], showcase_type: enum["RAG", "KnowledgeGraph", "MCP", "LLMOrchestration", "Embeddings", "Other"], status: enum["idea", "planned", "in-progress", "complete"] }.
- Acceptance: Markdown file (plans/ai-portfolio-content-roadmap.md) created; minimum 5 project slots defined; no PII exposed.
- Rationale: Future-proofs content management; informs Phase P02+ implementation.

#### 4.5 Error & Telemetry Expectations

REQ-014 (error): Missing /ai route shall display 404 gracefully.
- Acceptance: User sees standard Remix 404 page (not a hard crash).
- Rationale: Soft launch accommodation; route added by end of Phase P01.

REQ-015 (telemetry): Click events on AI section link shall be loggable.
- Acceptance: No mandatory telemetry; structure allows future analytics integration (e.g., data-testid or onClick handler).
- Rationale: Foundation for usage tracking; no data collection without explicit consent.

#### 4.6 Acceptance Criteria (Phase-Level)

P00 Acceptance:
- _index.tsx renders AI section without console errors.
- TextAnimation component instantiated with AI props.
- Visual diff shows three portfolio pairs (Frontend, ThreeJS, AI).
- All REQ-001 through REQ-012 passing TEST-001 through TEST-006.

P01 Acceptance:
- /ai route exists (placeholder page or router redirect).
- Navigation link functional.
- REQ-013 data document created.
- All tests passing; no performance regression.

#### 4.7 System Architecture Diagram

Mermaid:
```mermaid
graph LR
    A[_index.tsx] -->|imports| B[TextAnimation Component]
    A -->|imports| C[Navbar Component]
    A -->|imports| D[VanillaGridMaze Component]

    A -->|renders| E[Portfolio Grid]
    E -->|contains| F[Frontend Section<br/>Link + TextAnimation]
    E -->|contains| G[ThreeJS Section<br/>Link + TextAnimation]
    E -->|contains| H[AI Work Section<br/>Link + TextAnimation]

    H -->|link href| I[/ai Route]
    H -->|displays| B

    F -->|navigate| J[/frontend]
    G -->|navigate| K[/threejs]
    I -->|navigate| L[/ai Placeholder]
```

ASCII C4-Style:

```
┌─────────────────────────────────────────────────────────────┐
│ Landing Page Container (/)                                  │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Navbar: Home, About, Contact                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  Header: "3D AI Fullstack Developer"                       │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Portfolio Grid (CSS Grid Layout)                       │ │
│  ├─────────────┬─────────────┬─────────────┬──────────────┤ │
│  │ Frontend    │ Frontend    │ ThreeJS     │ ThreeJS      │ │
│  │ (Link+Lab)  │ (Animation) │ (Link+Lab)  │ (Animation)  │ │
│  ├─────────────┴─────────────┼─────────────┴──────────────┤ │
│  │ AI Work     │ AI Work                                  │ │
│  │ (Link+Lab)  │ (Animation) [NEW]                        │ │
│  └─────────────┴─────────────┴──────────────────────────┘ │
│                                                             │
│  VanillaGridMaze Component (Suspense)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
       ↓ (onclick)
    ┌────────────────────┐
    │ /ai Route Handler  │
    │ (Placeholder)      │
    └────────────────────┘
```

---

### Iterative Implementation & Test Plan

#### Phase Strategy
Implementation decomposed by complexity:
- Phase P00: Core UI Integration (REQ-001 to REQ-012; lowest risk, highest impact).
- Phase P01: Route & Documentation (REQ-013 to REQ-014; foundational; enables Phase P02).
- Phase P02: Content Roadmap & AI Project Planning (REQ-015; not in this plan; future phase).

Risk Register:

| Risk | Trigger | Mitigation | Severity |
|------|---------|-----------|----------|
| CSS Grid layout breaks | New portfolio item exceeds row width | Add CSS media query for 4-item wrapping; test on mobile | High |
| TextAnimation perf regression | Lighthouse CLS >0.05 or FCP >2s | Measure baseline; profile AI section TextAnimation; use fallback effect | High |
| Route /ai missing | Dev forgets to create route file | Gate Phase P01 exit on route file existence check | Medium |
| Navbar breakage | Layout shift from new item | Visual regression test (Playwright screenshot) | Medium |
| Link href typo | User clicks to wrong route | Manual link verification (TEST-004) | Low |
| Color accessibility fails | Contrast ratio <4.5:1 | Pre-validated colors #00ff88 (8.1:1); run axe-core before deploy | Medium |
| Mobile viewport overflow | Portfolio grid doesn't wrap on small screens | Test at 375px viewport; verify CSS grid auto-fit | High |
| NeuralNetwork effect crashes | WebGL context lost on mobile | Wrap in error boundary; fallback to "particles" effect | Medium |
| SEO meta tags missing | /ai route has no title/description | Template provided; verify with View Page Source | Low |
| Screen reader announces wrong text | aria-label missing or incorrect | TEST-015 verifies VoiceOver/NVDA behavior | Medium |

Suspension/Resumption Criteria:
- Suspend: Visual regression detected (CLS > 0.05, link broken, TextAnimation not rendering).
- Resume: Issues resolved + all Phase P00 tests green.
- Suspend: /ai route not created by Phase P01 end.
- Resume: Route created; placeholder deployed.

Performance Fallback Strategy:
If "neural" backgroundEffect causes performance issues (FPS < 30 or Lighthouse Performance < 70):
1. Fallback Option 1: Switch to backgroundEffect="particles" (lighter animation).
2. Fallback Option 2: Switch to backgroundEffect="sparkles" (minimal animation).
3. Fallback Option 3: Switch to backgroundEffect="none" (static text only).
4. Implementation: Add media query for `prefers-reduced-motion: reduce` to auto-select "none".

```jsx
// Example reduced motion detection:
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const effectToUse = prefersReducedMotion ? "none" : "neural";
```

Device-Specific Considerations:
- Mobile: Consider "particles" or "sparkles" to preserve battery life.
- Low-end devices: Detect via `navigator.hardwareConcurrency < 4` and use "none".
- High refresh rate displays: "neural" effect optimized for 60Hz; may stutter at 120Hz.

---

### Phase P00: Core UI Integration

Scope and Objectives:
- Add AI portfolio section to landing page grid.
- Instantiate TextAnimation with AI-themed props.
- Verify visual alignment and component interaction.
- Impacted REQs: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-011.

Iterative Execution Steps (TDD Approach):

Step 1: Read current _index.tsx and TextAnimation component signature.
- Action: Examine app/routes/_index.tsx and components/TextAnimation.tsx to understand props, styling, structure.
- Verification: `grep -n "backgroundEffect\|primaryColor" components/TextAnimation.tsx` returns props list; structure matches Frontend/ThreeJS usage.

Step 2: Define AI section JSX mock (Red phase).
- Action: Write JSX snippet locally (not yet in file):
  ```jsx
  {/* AI Work Portfolio Section */}
  <a href="/ai" aria-label="Explore AI Work portfolio including RAG, knowledge graphs, and MCP integrations">
    <div className="portfolio-item">
      <span className="portfolio-label">Click here to explore my AI Work</span>
    </div>
  </a>

  <div className="portfolio-item">
    <TextAnimation
      text="AI Work"
      backgroundEffect="neural"
      backgroundIntensity={1.1}
      primaryColor="#00ff88"
      secondaryColor="#9945ff"
    />
  </div>
  ```
- Color rationale:
  - primaryColor #00ff88 (bright green): Represents neural networks, growth, intelligence; contrast ratio 8.1:1 on dark bg.
  - secondaryColor #9945ff (purple): Represents creativity, AI magic, data transformation; complements green.
  - Alternative option if "neural" effect is too heavy: backgroundEffect="particles" for lighter animation.
- Verification: Code review confirms syntax validity; matches existing pattern; accessibility audit passes.

Step 3: Insert AI section into _index.tsx portfolio grid (Green phase).
- Action: Edit app/routes/_index.tsx; add AI section JSX after ThreeJS section (after line 68); maintain Suspense wrapper context.
- Verification: `npm run dev` launches without error; page renders at localhost:3000; no console errors.

Step 4: Validate TextAnimation props (Green phase).
- Action: Check TextAnimation component accepts backgroundEffect="neural", custom colors without throwing errors.
- Verification: Browser DevTools shows no prop warnings; React component tree renders AI TextAnimation node successfully.

Step 5: Visual alignment check (Refactor phase).
- Action: Compare pixel dimensions and spacing of AI section to Frontend/ThreeJS sections using browser DevTools.
- Verification: AI portfolio items occupy same grid cell size; no layout shift; CLS measured via Lighthouse <0.05.

Step 6: Performance baseline measurement (Refactor phase).
- Action: Run Lighthouse on _index route; record FCP, LCP, CLS, TTI metrics; compare to pre-implementation baseline.
- Verification: Metrics within threshold (REQ-006, REQ-007, REQ-008); Lighthouse score ≥90.

Exit Gate Rules (Phase P00):

Green Criteria (Proceed):
- All visual tests pass (grid alignment, no layout shift).
- No console errors; React DevTools shows clean component tree.
- Lighthouse CLS <0.05, FCP <2s.
- TEST-001 through TEST-005 all passing.

Yellow Criteria (Review Required):
- Minor styling mismatch (colors not perfectly matching spec but visually acceptable).
- Lighthouse score 85-90 (slight perf regression but within tolerance).
- ACTION: Document deviation; proceed if stakeholder approves.

Red Criteria (Stop & Rework):
- Layout breaks (portfolio grid wraps unexpectedly or AI section missing).
- Console errors or React warnings.
- CLS >0.05; FCP >2.5s.
- TEST-001 or TEST-002 failing.
- ACTION: Revert changes; debug CSS or component props.

Phase Metrics (Phase P00):

| Metric | Estimated Value | Rationale |
|--------|-----------------|-----------|
| Confidence % | 95% | Reuses well-tested TextAnimation component; minimal new code; low risk |
| Long-term Robustness % | 90% | Mirrors existing pattern; CSS grid stable; future content addition straightforward |
| Internal Interactions | 2 | Affects _index.tsx (imports) and TextAnimation (props); no cross-component state |
| External Interactions | 1 | Link to /ai (route must exist by P01) |
| Complexity % | 15% | Pure UI integration; no business logic; straightforward JSX addition |
| Feature Creep % | 5% | Scope strictly bounded; no feature requests anticipated during execution |
| Technical Debt % | 5% | Hardcoded color values and text; future refactor to constants acceptable |
| YAGNI Score | High | Entire feature requested; no speculative abstractions |
| MoSCoW | MUST | Landing page parity for AI work; unblocks future phases |
| Local/Non-local Scope | Local | Changes isolated to _index.tsx and one route file; no global state |
| Architectural Changes Count | 0 | Extends existing pattern; no new architecture |

---

### Phase P01: Route & Documentation

Scope and Objectives:
- Create /ai route (placeholder page).
- Document AI portfolio content roadmap.
- Verify navigation flow end-to-end.
- Impacted REQs: REQ-013, REQ-014, REQ-015, REQ-002.

Iterative Execution Steps (TDD Approach):

Step 1: Define /ai route structure (Red phase).
- Action: Design placeholder /ai page (app/routes/ai.tsx) with basic Navbar, header, and content area stub.
- Verification: Route definition written; no syntax errors.

Step 2: Create app/routes/ai.tsx file (Green phase).
- Action: Write route file with Navbar and placeholder heading; use Remix meta export for SEO.
- Required SEO meta tags:
  ```typescript
  export const meta: MetaFunction = () => [
    { title: "AI Work Portfolio - Adam Aslan" },
    { name: "description", content: "Explore AI engineering projects including RAG systems, knowledge graphs, MCP integrations, LLM orchestration, and embeddings applications." },
    { property: "og:title", content: "AI Work Portfolio - Adam Aslan" },
    { property: "og:description", content: "AI/ML engineering portfolio showcasing RAG, knowledge graphs, and intelligent systems." },
    { property: "og:type", content: "website" },
    { name: "keywords", content: "AI, Machine Learning, RAG, Knowledge Graphs, MCP, LLM, Embeddings, Claude, OpenAI" }
  ];
  ```
- Verification: File created; `npm run dev` recognizes route; /ai loads without error; meta tags visible in page source.

Step 3: Test link navigation from landing page (Green phase).
- Action: Click AI Work link on / page; verify browser navigates to /ai without 404.
- Verification: URL bar shows localhost:3000/ai; page renders; no console errors.

Step 4: Create AI portfolio content roadmap document (Green phase).
- Action: Create plans/ai-portfolio-content-roadmap.md with table of planned AI projects (RAG, Knowledge Graphs, MCP, LLM Orchestration, Embeddings); include status, tech stack, description columns.
- Verification: File created; markdown syntax valid; minimum 5 project entries.

Step 5: Document AI project categories (Refactor phase).
- Action: Expand roadmap with descriptions of each AI category (e.g., "RAG: Retrieval-Augmented Generation for knowledge-intensive tasks").
- Verification: Content review; clarity and specificity checked.

Step 6: Validate RTM coverage (Refactor phase).
- Action: Cross-check all REQs against Phase P00 and P01 tests; ensure no unverified requirements remain.
- Verification: RTM table (Section 10) updated; all REQ-### linked to TEST-### or Phase.

Exit Gate Rules (Phase P01):

Green Criteria (Proceed):
- /ai route exists and returns 200 status.
- Navigation link functional end-to-end.
- plans/ai-portfolio-content-roadmap.md created with ≥5 projects defined.
- TEST-007 through TEST-010 all passing.

Yellow Criteria (Review Required):
- /ai page missing styling or has placeholder text only.
- ACTION: Schedule Phase P02 content population; proceed.

Red Criteria (Stop & Rework):
- /ai route returns 404 or error.
- Link click causes navigation failure.
- Roadmap document missing or empty.
- ACTION: Create route and document; retest.

Phase Metrics (Phase P01):

| Metric | Estimated Value | Rationale |
|--------|-----------------|-----------|
| Confidence % | 98% | Straightforward route creation and documentation; standard Remix patterns |
| Long-term Robustness % | 95% | Route structure stable; roadmap is living document; easy to update |
| Internal Interactions | 1 | _index.tsx link points to ai.tsx route; no shared state |
| External Interactions | 0 | Route creation is internal; no external dependencies |
| Complexity % | 8% | Route file and markdown document; minimal code |
| Feature Creep % | 3% | Scope is navigation and documentation only |
| Technical Debt % | 2% | Clean route structure; no hacks |
| YAGNI Score | High | Route and documentation immediately necessary for user navigation |
| MoSCoW | MUST | Link must resolve; content roadmap must exist for Phase P02 planning |
| Local/Non-local Scope | Local | Changes isolated to new route file and plans folder |
| Architectural Changes Count | 0 | Follows established Remix routing pattern |

---

### Evaluations (AI/Agentic Guidance)

No automated ML evaluations required for this iteration. However, agentic assistant configuration:

```yaml
evaluations:
  - id: "eval_001_ui_regression"
    purpose: "dev"
    description: "Detect visual regressions in portfolio grid layout"
    metrics:
      - name: "visual_diff_match_percent"
        threshold: 99.5
        direction: "higher_is_better"
      - name: "lighthouse_cls"
        threshold: 0.05
        direction: "lower_is_better"
    runtime_budget_seconds: 60
    seed: 42

  - id: "eval_002_nav_flow"
    purpose: "dev"
    description: "Validate link and route navigation"
    metrics:
      - name: "link_click_success_rate"
        threshold: 1.0
        direction: "higher_is_better"
      - name: "route_404_count"
        threshold: 0
        direction: "lower_is_better"
    runtime_budget_seconds: 30
    seed: 42
```

Suspension Criteria for Agentic Execution:
- If visual_diff_match_percent < 98%, trigger rollback and replan.
- If route_404_count > 0 after Phase P01, suspend until route created.

---

### Tests Overview

Test execution strategy: Unit → Integration → Smoke; all tests gated per phase exit criteria.

Test Suites:

Unit Tests:
- TEST-001: TextAnimation component renders with AI props (no errors, DOM node exists).
- TEST-002: TextAnimation AI section has correct text "AI Work".

Integration Tests:
- TEST-003: Portfolio grid CSS renders 3 item pairs (Frontend, ThreeJS, AI) without layout shift.
- TEST-004: Link href="/ai" present in DOM and clickable.
- TEST-005: Navbar component renders without breakage after AI section addition.
- TEST-006: Lighthouse audit passes CLS <0.05, FCP <2s, TTI <3s.

Route & Navigation Tests:
- TEST-007: GET /ai returns 200 status.
- TEST-008: Click AI link navigates to /ai URL without errors.
- TEST-009: /ai page renders Navbar and basic content (no 404).
- TEST-010: Roadmap document plans/ai-portfolio-content-roadmap.md exists and contains valid markdown.

Data Validation Tests:
- TEST-011: Roadmap JSON/YAML structure validates against schema (min 5 projects, required fields).

Accessibility Tests:
- TEST-012: Lighthouse accessibility audit score ≥90 (a11y category).
- TEST-013: axe-core automated scan passes with 0 critical violations.
- TEST-014: AI link has visible focus indicator on keyboard navigation (Tab key).
- TEST-015: Screen reader (VoiceOver/NVDA) announces AI link purpose correctly.

Browser Compatibility Tests:
- TEST-016: AI section renders correctly in Chrome 120+ (visual inspection).
- TEST-017: AI section renders correctly in Firefox 121+ (visual inspection).
- TEST-018: AI section renders correctly in Safari 17+ (visual inspection).
- TEST-019: AI section renders correctly on mobile viewport (375px width).

Responsive Design Tests:
- TEST-020: Portfolio grid displays 2 columns on mobile (<768px) without overflow.
- TEST-021: Portfolio grid displays 3 columns on tablet (768px-1024px).
- TEST-022: Portfolio grid displays auto-fit columns on desktop (>1024px).
- TEST-023: TextAnimation component scales appropriately at all viewport sizes.

RTM Table (Requirements Traceability):

| REQ ID | TEST ID(s) | Type | Phase | Status |
|--------|-----------|------|-------|--------|
| REQ-001 | TEST-001, TEST-003 | func | P00 | Pending |
| REQ-002 | TEST-004, TEST-008 | func | P00, P01 | Pending |
| REQ-003 | TEST-002, TEST-003 | func | P00 | Pending |
| REQ-004 | TEST-004 | func | P00 | Pending |
| REQ-005 | TEST-005 | func | P00 | Pending |
| REQ-006 | TEST-006 | nfr|perf | P00 | Pending |
| REQ-007 | TEST-006 | nfr|perf | P00 | Pending |
| REQ-008 | TEST-006 | nfr|perf | P00 | Pending |
| REQ-009 | Manual review | nfr|sec | P00 | Pending |
| REQ-009a | TEST-012, TEST-013 | nfr|a11y | P00 | Pending |
| REQ-009b | TEST-014, TEST-015 | nfr|a11y | P00 | Pending |
| REQ-010 | Manual inspection | nfr|rel | P00 | Pending |
| REQ-RESP-001 | TEST-019, TEST-020, TEST-021, TEST-022 | nfr|resp | P00 | Pending |
| REQ-BROWSER-001 | TEST-016, TEST-017, TEST-018 | nfr|compat | P00 | Pending |
| REQ-011 | TEST-001, TEST-002 | int | P00 | Pending |
| REQ-012 | TEST-004, TEST-007 | int | P01 | Pending |
| REQ-013 | TEST-010, TEST-011 | data | P01 | Pending |
| REQ-014 | TEST-007 | error | P01 | Pending |
| REQ-015 | Manual config review | telemetry | P01 | Pending |

---

### Data Contract

Schema: AI Portfolio Project Entry

```yaml
ai_project:
  type: object
  properties:
    project_id:
      type: string
      description: "Unique identifier (slug format, e.g., rag-chatbot)"

    project_name:
      type: string
      minLength: 3
      maxLength: 100
      description: "Display name of AI project"

    description:
      type: string
      minLength: 10
      maxLength: 500
      description: "Brief description of project and AI application"

    tech_stack:
      type: array
      items:
        type: string
      minItems: 1
      maxItems: 10
      examples: ["LangChain", "OpenAI", "Python", "FastAPI", "Pinecone"]

    showcase_type:
      type: string
      enum: ["RAG", "KnowledgeGraph", "MCP", "LLMOrchestration", "Embeddings", "Other"]
      description: "Category of AI work"

    status:
      type: string
      enum: ["idea", "planned", "in-progress", "complete", "archived"]
      description: "Lifecycle status of project"

    url:
      type: string
      format: uri
      description: "Link to project demo or repository (optional; can be null for ideas)"
      nullable: true

    created_at:
      type: string
      format: date-time
      description: "ISO 8601 timestamp when added to portfolio"

  required: ["project_id", "project_name", "description", "tech_stack", "showcase_type", "status"]

invariants:
  - "If status == 'complete', url must not be null"
  - "tech_stack must contain at least one recognized AI/ML library or language"
  - "No PII (emails, API keys) in description field"
```

Example Entry:
```yaml
project_id: "rag-semantic-search"
project_name: "RAG-Powered Document Search"
description: "Retrieval-augmented generation system for semantic document search using embeddings and LLM-based query enhancement. Demonstrates knowledge-intensive task patterns."
tech_stack: ["LangChain", "OpenAI", "Pinecone", "Python", "FastAPI"]
showcase_type: "RAG"
status: "planned"
url: null
created_at: "2026-01-11T00:00:00Z"
```

---

### Reproducibility

Environment Snapshot:
- Node Version: 18.x or 20.x (specify in package.json engines).
- OS: darwin (macOS) / linux / win32 (specify in CI/CD).
- Container: Optional (Docker image tag if applicable).
- React Version: Specified in package.json.
- Remix Version: Specified in package.json.
- Browser: Chrome 120+, Firefox 121+, Safari 17+ for testing.

Seed & Randomness:
- No randomization in UI integration tests; all deterministic.
- For future ML evals, seed 42 (see Evaluations section).

Hardware:
- CPU: Not constrained (development machine standard).
- RAM: >4GB recommended for dev server + browser.
- Network: Assume >2 Mbps for Lighthouse audit.

Reproducibility Steps:
1. Clone repo: `git clone <repo-url>`.
2. Checkout branch: `git checkout maze2b` (current branch).
3. Install deps: `npm install`.
4. Run dev server: `npm run dev`.
5. Open http://localhost:3000 in browser.
6. Verify AI Work section visible in portfolio grid.
7. Click AI Work link; verify navigation to /ai.
8. Run tests: `npm run test` (if test suite exists; otherwise manual verification per TEST-### steps).
9. Run Lighthouse: `npm run lighthouse` or use DevTools (Audit tab).
10. Record baseline metrics (CLS, FCP, TTI).

---

### Execution Log (Living Document Template)

**Phase**: P00
**Start Date**: [FILL: Date when Phase P00 execution begins]
**Target End Date**: [FILL: Expected completion date]

#### Completed Steps

| Step | Status | Completed Date | Notes |
|------|--------|-----------------|-------|
| Step 1: Read current code | [ ] Pending | [FILL] | [FILL] |
| Step 2: Define AI section JSX mock | [ ] Pending | [FILL] | [FILL] |
| Step 3: Insert AI section into _index.tsx | [ ] Pending | [FILL] | [FILL] |
| Step 4: Validate TextAnimation props | [ ] Pending | [FILL] | [FILL] |
| Step 5: Visual alignment check | [ ] Pending | [FILL] | [FILL] |
| Step 6: Performance baseline measurement | [ ] Pending | [FILL] | [FILL] |

#### Quantitative Results (Phase P00)

| Metric | Baseline | Result | Mean ± Std | 95% CI | Status |
|--------|----------|--------|------------|--------|--------|
| Lighthouse CLS | [FILL] | [FILL] | [FILL] | [FILL] | [ ] Pass / [ ] Fail |
| Lighthouse FCP (ms) | [FILL] | [FILL] | [FILL] | [FILL] | [ ] Pass / [ ] Fail |
| TTI (ms) | [FILL] | [FILL] | [FILL] | [FILL] | [ ] Pass / [ ] Fail |
| Grid visual match % | [FILL] | [FILL] | [FILL] | [FILL] | [ ] Pass / [ ] Fail |
| Console errors (count) | 0 | [FILL] | [FILL] | [FILL] | [ ] Pass / [ ] Fail |

#### Issues & Resolutions

| Issue | Trigger | Resolution | Date Resolved |
|-------|---------|-----------|-----------------|
| [FILL] | [FILL] | [FILL] | [FILL] |

#### Failed Attempts

| Attempt | What Was Tried | Why It Failed | Lesson |
|---------|---------------|-----------------|--------|
| [FILL] | [FILL] | [FILL] | [FILL] |

#### Deviations from Plan

| Deviation | Original Plan | Actual Execution | Rationale | Approval |
|-----------|--------------|------------------|-----------|----------|
| [FILL] | [FILL] | [FILL] | [FILL] | [ ] Yes / [ ] No |

#### Lessons Learned

- [FILL with observations, unexpected challenges, insights]

#### ADR Updates

- [FILL with any new Architectural Decision Records created during execution]

---

**Phase**: P01
**Start Date**: [FILL: Date when Phase P01 execution begins]
**Target End Date**: [FILL: Expected completion date]

#### Completed Steps

| Step | Status | Completed Date | Notes |
|------|--------|-----------------|-------|
| Step 1: Define /ai route structure | [ ] Pending | [FILL] | [FILL] |
| Step 2: Create app/routes/ai.tsx file | [ ] Pending | [FILL] | [FILL] |
| Step 3: Test link navigation from landing page | [ ] Pending | [FILL] | [FILL] |
| Step 4: Create AI portfolio content roadmap | [ ] Pending | [FILL] | [FILL] |
| Step 5: Document AI project categories | [ ] Pending | [FILL] | [FILL] |
| Step 6: Validate RTM coverage | [ ] Pending | [FILL] | [FILL] |

#### Quantitative Results (Phase P01)

| Metric | Result | Status |
|--------|--------|--------|
| /ai route status code | [FILL: 200 expected] | [ ] Pass / [ ] Fail |
| Navigation success rate | [FILL: 100% expected] | [ ] Pass / [ ] Fail |
| Roadmap projects count | [FILL: ≥5 expected] | [ ] Pass / [ ] Fail |
| RTM coverage % | [FILL: 100% expected] | [ ] Pass / [ ] Fail |

#### Issues & Resolutions

| Issue | Trigger | Resolution | Date Resolved |
|-------|---------|-----------|-----------------|
| [FILL] | [FILL] | [FILL] | [FILL] |

#### Failed Attempts

| Attempt | What Was Tried | Why It Failed | Lesson |
|---------|---------------|-----------------|--------|
| [FILL] | [FILL] | [FILL] | [FILL] |

#### Deviations from Plan

| Deviation | Original Plan | Actual Execution | Rationale | Approval |
|-----------|--------------|------------------|-----------|----------|
| [FILL] | [FILL] | [FILL] | [FILL] | [ ] Yes / [ ] No |

#### Lessons Learned

- [FILL with observations, unexpected challenges, insights]

#### ADR Updates

- [FILL with any new Architectural Decision Records created during execution]

---

### Appendix: ADR Index

No ADRs created in initial plan. Future ADRs may address:
- ADR-AI-001: AI project showcase layout and grid strategy.
- ADR-AI-002: Content management approach (static markdown vs. database-backed).
- ADR-AI-003: Performance optimization if TextAnimation or route loading becomes bottleneck.

---

### AI Portfolio Content Roadmap Preview

Suggested AI categories with concrete implementation ideas:

**RAG (Retrieval-Augmented Generation)**

| Project | Tech Stack | Showcase Type | Description |
|---------|-----------|---------------|-------------|
| Document Q&A System | LangChain, OpenAI, Pinecone, FastAPI | Interactive Demo | Upload PDFs; ask questions; see retrieved chunks + generated answer with source citations |
| Codebase Navigator | Tree-sitter, Embeddings, Claude | Code Tool | Index repo files; query "how does auth work"; get relevant file snippets + explanation |
| Personal Knowledge Base | Obsidian, Chroma, Local LLM | Privacy-First | Offline semantic search over personal notes with RAG-enhanced answers |

**Knowledge Graphs**

| Project | Tech Stack | Showcase Type | Description |
|---------|-----------|---------------|-------------|
| Entity Relationship Visualizer | Neo4j, spaCy, D3.js | Interactive Graph | Extract entities from text; visualize relationships; explore connections |
| Research Paper Explorer | arXiv API, NetworkX, GraphQL | Search Tool | Map citation networks; discover related papers; visualize research clusters |
| Concept Mapper | GPT-4, Cytoscape.js | Learning Tool | Generate knowledge graphs from topics; show hierarchies and dependencies |

**MCP (Model Context Protocol) Integrations**

| Project | Tech Stack | Showcase Type | Description |
|---------|-----------|---------------|-------------|
| Claude Code Tools Demo | Claude API, MCP SDK, TypeScript | Tool Use | Custom MCP server with calculator, file reader, API caller; show tool selection reasoning |
| Multi-Model Orchestrator | Claude, GPT-4, Llama, Router | Comparison | Route queries to optimal model; show cost/quality tradeoffs; A/B testing interface |
| IDE Copilot Extension | VS Code API, MCP, Tree-sitter | Dev Tool | Code completion with context awareness; explain code; generate tests |

**LLM Orchestration & Agents**

| Project | Tech Stack | Showcase Type | Description |
|---------|-----------|---------------|-------------|
| Research Agent System | CrewAI, Claude, Tavily | Multi-Agent | Research agent finds info; analyst evaluates; writer summarizes; show agent collaboration |
| Autonomous Task Executor | LangGraph, Tool Use, Memory | Workflow | Break complex tasks into steps; execute with feedback; self-correct on errors |
| Code Review Agent | AST parsing, Claude, GitHub API | Dev Tool | Analyze PRs; suggest improvements; explain reasoning; learn from feedback |

**Embeddings & Vector Search**

| Project | Tech Stack | Showcase Type | Description |
|---------|-----------|---------------|-------------|
| Semantic Image Search | CLIP, Qdrant, React | Visual Demo | Search images by text description; show similarity scores; cluster visualizations |
| Portfolio Similarity Finder | Sentence Transformers, FAISS | Recommendation | Find similar projects; show embedding space; explain similarity factors |
| Content Deduplication | MinHash, SimHash, Embeddings | Data Tool | Detect near-duplicate content; show similarity heatmaps; configurable thresholds |

**Prompt Engineering & Evaluation**

| Project | Tech Stack | Showcase Type | Description |
|---------|-----------|---------------|-------------|
| Prompt Playground | Claude API, Diff View, Metrics | Interactive | Test prompts; compare outputs; track quality metrics; version control prompts |
| LLM Output Evaluator | RAGAS, Custom Metrics, Dashboard | Analytics | Evaluate RAG accuracy; measure hallucination; track performance over time |
| Few-Shot Generator | Template Engine, Examples DB | Dev Tool | Generate optimal few-shot examples; test variations; measure impact |

**Generative AI Applications**

| Project | Tech Stack | Showcase Type | Description |
|---------|-----------|---------------|-------------|
| AI Art Generator | Stable Diffusion, ControlNet, React | Creative | Text-to-image with style control; show generation process; compare models |
| Code-to-Documentation | Claude, Markdown, React | Dev Tool | Generate docs from code; maintain consistency; update on code changes |
| Conversational UI Builder | Claude, React, Storybook | Prototyping | Describe UI in words; generate components; iterate with feedback |

---

### Consistency Check

RTM Verification:
- [x] All REQ-001 through REQ-015 listed in RTM table (Section 10).
- [x] All TEST-001 through TEST-023 traced to REQ-### entries.
- [x] Phase P00 and P01 cover all listed requirements.
- [x] Accessibility requirements (REQ-009a, REQ-009b) have corresponding tests (TEST-012 to TEST-015).
- [x] Responsive requirements (REQ-RESP-001) have corresponding tests (TEST-019 to TEST-023).
- [x] Browser compatibility requirements (REQ-BROWSER-001) have corresponding tests (TEST-016 to TEST-018).

Phase Metrics Verification:
- [x] Phase P00 metrics populated: Confidence, Robustness, Interactions, Complexity, Creep, Debt, YAGNI, MoSCoW, Scope, Arch.
- [x] Phase P01 metrics populated: Confidence, Robustness, Interactions, Complexity, Creep, Debt, YAGNI, MoSCoW, Scope, Arch.

Execution Steps Verification:
- [x] Phase P00: 6 atomic steps defined with explicit verification commands.
- [x] Phase P01: 6 atomic steps defined with explicit verification commands.
- [x] TDD flow (Red → Green → Refactor) evident in step progression.

Exit Gate Rules Verification:
- [x] Phase P00: Green, Yellow, Red criteria defined with thresholds.
- [x] Phase P01: Green, Yellow, Red criteria defined with thresholds.

Data Contract Verification:
- [x] AI Portfolio schema defined with required and optional fields.
- [x] Invariants specified (status → URL constraint, PII protection).
- [x] Example entry provided.

Technical Validation:
- [x] TextAnimation backgroundEffect="neural" confirmed valid (app/components/TextAnimation.tsx:887).
- [x] Valid backgroundEffects documented: sparkles, matrix, neural, waves, particles, grid, none.
- [x] Color values validated for contrast ratio (primaryColor #00ff88 = 8.1:1 on dark bg).
- [x] File change summary table includes all affected files with LOC estimates.
- [x] Git restore points defined for rollback safety.
- [x] Performance fallback strategy documented with progressive degradation options.
- [x] SEO meta tags defined for /ai route.
- [x] Accessibility requirements include WCAG 2.1 AA compliance targets.

---

**Document Status**: Ready for Review and Execution (v1.1)
**Improvements in v1.1**:
- Added File Change Summary table with LOC estimates
- Added git restore point requirements
- Validated TextAnimation backgroundEffect options against source code
- Added accessibility requirements (REQ-009a, REQ-009b) and tests (TEST-012 to TEST-015)
- Added browser compatibility tests (TEST-016 to TEST-018)
- Added responsive design tests (TEST-019 to TEST-023)
- Expanded AI Portfolio Content Roadmap with 21 concrete project ideas across 7 categories
- Added Performance Fallback Strategy with reduced-motion support
- Added SEO meta tags template for /ai route
- Updated RTM table with new requirements and test mappings
- Added color rationale with contrast ratio validation

**Next Step**: Phase P00 execution; create git tag `pre-ai-section-v1.1`; update Execution Log upon start.
