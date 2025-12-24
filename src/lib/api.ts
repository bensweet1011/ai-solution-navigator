import { AssessmentResults, FormData } from '@/types/assessment';

// Placeholder function for API calls - to be implemented later
export async function generateAssessment(formData: FormData): Promise<AssessmentResults> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock results for now
  return getMockResults(formData);
}

function getMockResults(formData: FormData): AssessmentResults {
  return {
    viabilityScores: [
      { dimension: 'Demand Signal', score: 4, rationale: 'Strong market pull indicated by existing pain points in target industry' },
      { dimension: 'Differentiation', score: 3, rationale: 'Moderate differentiation; AI-native approach provides edge over legacy solutions' },
      { dimension: 'Distribution Ease', score: 4, rationale: 'Clear buyer persona with established procurement channels' },
      { dimension: 'Build Complexity', score: 2, rationale: 'Significant ML pipeline and integration requirements expected' },
      { dimension: 'Regulatory Risk', score: 3, rationale: 'Moderate compliance requirements; standard data protection applies' },
      { dimension: 'Defensibility', score: 3, rationale: 'Data network effects possible; execution speed is primary moat' },
      { dimension: 'Time-to-Value', score: 4, rationale: 'MVP can demonstrate value within 8-12 weeks' },
    ],
    mostConstraining: ['Build Complexity', 'Differentiation'],
    responsibleAIRisks: [
      { dimension: 'Privacy & Data Protection', level: 'Medium', rationale: 'User data handling requires standard safeguards' },
      { dimension: 'Bias & Fairness', level: 'Low', rationale: 'Limited impact on protected groups' },
      { dimension: 'Transparency', level: 'Low', rationale: 'Decisions are advisory, not deterministic' },
      { dimension: 'Safety & Harm', level: 'Low', rationale: 'No physical safety implications identified' },
      { dimension: 'Security & Misuse', level: 'Medium', rationale: 'Standard security practices recommended' },
      { dimension: 'Human Oversight', level: 'Low', rationale: 'Human-in-the-loop design appropriate' },
    ],
    euAiActClassification: 'Limited Risk (requires transparency obligations)',
    reportMarkdown: generateMockReport(formData),
  };
}

function generateMockReport(formData: FormData): string {
  return `# AI Solution Assessment Report

## Executive Summary

This assessment evaluates the viability and responsible AI considerations for **${formData.solutionConcept.slice(0, 100)}...** targeting **${formData.primaryUser}** in the **${formData.industryDomain}** sector.

**Overall Verdict:** The solution shows promising market viability with manageable technical and regulatory risks. Key focus areas include addressing build complexity and strengthening differentiation strategy.

---

## Problem Framing

### The Challenge
${formData.problemPainPoint || 'The core problem centers on inefficiencies and friction in current workflows that the target users face daily.'}

### Why Now?
Recent advances in large language models and AI infrastructure have made solutions in this space newly feasible. Market timing appears favorable given increased digital transformation investment.

### Target Users
**Primary:** ${formData.primaryUser}

The primary users are likely experiencing significant friction with existing solutions, creating receptivity to AI-powered alternatives.

---

## Solution Concept

### Core Proposition
${formData.solutionConcept}

### Key Differentiators
${formData.differentiationHypothesis || 'The solution leverages modern AI capabilities to deliver automation and insights not possible with traditional approaches.'}

### Success Metrics
${formData.successMetric || 'Primary metrics should focus on time savings, accuracy improvements, and user adoption rates.'}

---

## AI Feasibility Assessment

### Technical Approach
Based on the solution requirements, a hybrid approach combining:
- **Foundation Models:** Leveraging pre-trained LLMs for natural language understanding
- **Custom Fine-tuning:** Domain-specific optimization for accuracy
- **RAG Architecture:** Retrieval-augmented generation for knowledge grounding

### Data Requirements
${formData.dataAvailability || 'Data availability and quality will be critical success factors. Initial assessment suggests adequate training data may be accessible.'}

### Build Complexity Analysis
| Component | Complexity | Notes |
|-----------|------------|-------|
| Data Pipeline | Medium | Standard ETL with quality controls |
| ML Models | Medium-High | Custom fine-tuning required |
| Integration Layer | Medium | API-first architecture recommended |
| User Interface | Low-Medium | Standard web application |

---

## Market Snapshot

### Industry Context
The **${formData.industryDomain}** sector is experiencing significant AI adoption pressure, with enterprises actively seeking automation solutions.

### Competitive Landscape
${formData.knownCompetitors ? `Known competitors include: ${formData.knownCompetitors}` : 'The competitive landscape includes both established players and emerging AI-native startups.'}

### Market Timing
Current conditions favor new entrants with genuine AI capabilities, as buyers increasingly distinguish between "AI-washed" products and genuine innovation.

---

## Viability Analysis

### Scoring Summary

| Dimension | Score | Assessment |
|-----------|-------|------------|
| Demand Signal | ●●●●○ | Strong market pull |
| Differentiation | ●●●○○ | Moderate, needs strengthening |
| Distribution Ease | ●●●●○ | Clear go-to-market path |
| Build Complexity | ●●○○○ | Significant effort required |
| Regulatory Risk | ●●●○○ | Manageable with proper controls |
| Defensibility | ●●●○○ | Execution-dependent |
| Time-to-Value | ●●●●○ | Quick wins possible |

### Key Constraints
1. **Build Complexity** - The technical requirements will demand experienced ML engineering talent and significant iteration cycles
2. **Differentiation** - Recommend deepening the unique value proposition before market entry

---

## Risks & Responsible AI

### Responsible AI Framework Alignment
This assessment references both **NIST AI Risk Management Framework** and **EU AI Act** requirements.

### Risk Assessment

| Dimension | Level | Mitigation |
|-----------|-------|------------|
| Privacy & Data Protection | 🟡 Medium | Implement privacy-by-design principles |
| Bias & Fairness | 🟢 Low | Standard testing protocols sufficient |
| Transparency | 🟢 Low | Explainability features recommended |
| Safety & Harm | 🟢 Low | No critical safety concerns |
| Security & Misuse | 🟡 Medium | Security audit pre-launch |
| Human Oversight | 🟢 Low | HITL design inherent |

### Regulatory Classification
**EU AI Act Preliminary Classification:** Limited Risk System
- Transparency obligations apply
- No prohibited use cases identified
- Recommended: Document AI system characteristics

---

## Next Steps

### Immediate Actions (0-30 days)
1. **Validate demand** - Conduct 5-10 customer discovery interviews
2. **Technical spike** - Prototype core AI functionality with sample data
3. **Competitive deep-dive** - Analyze top 3 competitors' positioning

### Medium-term (30-90 days)
1. Build MVP focusing on single highest-value use case
2. Establish data pipeline and quality metrics
3. Develop responsible AI documentation

### Go/No-Go Criteria
- [ ] Confirmed demand signal from 3+ prospective customers
- [ ] Technical feasibility validated through prototype
- [ ] Data access confirmed for training and inference
- [ ] Regulatory pathway understood and documented

---

*This assessment was generated using AI Solution Navigator. Results should be validated through additional research and expert consultation.*
`;
}
