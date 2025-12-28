# AI Solution Navigator

A decision-support tool that helps organizations evaluate AI solution approaches and understand the competitive landscape. Built with React, Tailwind CSS, and integrated with Claude and Perplexity APIs for intelligent analysis.

**[Live Demo →](https://navigator.bensweet.ai)**

---

## What It Does

The AI Solution Navigator guides users through a structured assessment process to answer two critical questions:

1. **Build vs. Buy vs. Hybrid** — Should you build custom AI, purchase an existing solution, or take a hybrid approach?
2. **What's Already Out There** — Who are the existing players, and how does your concept compare?

### Input

Users complete a scoping questionnaire covering:
- Problem description and business context
- Target users and use case
- Data sensitivity and compliance requirements
- Integration needs and technical constraints
- Budget and timeline considerations
- Customization requirements

### Output

The tool generates a structured assessment report including:

- **Executive Summary** — High-level recommendation with key considerations
- **Build vs. Buy Analysis** — Detailed reasoning for the recommended approach
- **Competitive Landscape** — Current market players and how they compare
- **Technical Feasibility** — Assessment of implementation complexity
- **Responsible AI Considerations** — Governance, bias, and compliance factors
- **Next Steps** — Actionable recommendations for moving forward

Reports can be exported as Markdown or PDF.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + TypeScript | UI components and state management |
| Styling | Tailwind CSS | Responsive design system |
| AI Analysis | Claude API (Anthropic) | Reasoning and recommendation generation |
| Market Research | Perplexity API | Real-time competitive landscape research |
| Hosting | Vercel | Deployment and edge functions |
| Build Tool | Vite | Fast development and bundling |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Intake Form    │→ │  Loading State  │→ │    Report    │ │
│  │  (6 questions)  │  │  (API calls)    │  │   Display    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Vercel)                      │
│  ┌─────────────────────────┐  ┌───────────────────────────┐ │
│  │  /api/assess            │  │  /api/research            │ │
│  │  Claude API call        │  │  Perplexity API call      │ │
│  │  → Recommendation       │  │  → Competitive landscape  │ │
│  └─────────────────────────┘  └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Why two APIs?**

- **Claude** excels at reasoning through complex tradeoffs and generating nuanced recommendations based on user-provided context
- **Perplexity** excels at real-time web search and synthesizing current market information with source citations

This separation lets each model do what it's best at.

---

## Local Development

### Prerequisites

- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Perplexity API key ([get one here](https://www.perplexity.ai/settings/api))

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-solution-navigator.git
cd ai-solution-navigator

# Install dependencies
npm install

# Create environment file with your API keys
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

> **Note:** This project requires API keys for Claude and Perplexity. See `.env.example` for required variables.

---

## Project Structure

```
ai-solution-navigator/
├── src/
│   ├── components/
│   │   ├── IntakeForm.tsx      # Multi-step questionnaire
│   │   ├── LoadingState.tsx    # Processing indicator
│   │   ├── ReportDisplay.tsx   # Assessment output
│   │   └── SectionNav.tsx      # Report navigation
│   ├── api/
│   │   ├── assess.ts           # Claude API integration
│   │   └── research.ts         # Perplexity API integration
│   ├── utils/
│   │   ├── exportMarkdown.ts   # Markdown export
│   │   └── exportPdf.ts        # PDF generation
│   └── App.tsx
├── public/
├── .env.example
└── package.json
```

---

## Design Decisions

### Why a wizard instead of a single form?

Breaking the intake into steps reduces cognitive load and improves completion rates. Each step focuses on one aspect of the decision (problem, constraints, requirements).

### Why not just use ChatGPT/Claude directly?

Three reasons:

1. **Structured output** — The tool enforces a consistent report format that's easy to share and act on
2. **Dual-model approach** — Combines Claude's reasoning with Perplexity's search capabilities
3. **Domain expertise** — The prompts encode best practices for AI solution evaluation that a general chat wouldn't include

### Why show Responsible AI considerations?

AI governance is increasingly required for enterprise deployments. Surfacing these considerations early helps users avoid surprises during procurement or compliance review.

---

## Roadmap

- [ ] Save and compare multiple assessments
- [ ] Team sharing and collaboration
- [ ] Integration with project management tools
- [ ] Industry-specific templates (healthcare, finance, government)
- [ ] Cost estimation module

---

## About

Built by [Ben Sweet](https://bensweet.ai) as part of an AI product management portfolio. 

This tool reflects a "pragmatic AI" philosophy: using foundation model APIs and thoughtful orchestration to deliver immediate value, rather than over-engineering custom models for problems that don't require them.

---

## License

MIT

---

## Contributing

Issues and pull requests welcome. For major changes, please open an issue first to discuss the proposed change.
