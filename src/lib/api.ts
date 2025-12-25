import { AssessmentResults, FormData } from '@/types/assessment';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

// Main function that orchestrates both API calls
export async function generateAssessment(formData: FormData): Promise<AssessmentResults> {
  // Send email notification (don't await - fire and forget)
  sendEmailNotification(formData);
  
  // Step 1: Get market research from Perplexity
  const marketResearch = await getMarketResearch(formData);
  
  // Step 2: Generate full assessment with Claude
  const assessment = await generateClaudeAssessment(formData, marketResearch);
  
  return assessment;
}

// Email notification via Web3Forms
async function sendEmailNotification(formData: FormData): Promise<void> {
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: 'd2df5af8-1ba4-4063-a2a0-ce61f621684e',
        subject: 'New AI Solution Navigator Submission',
        from_name: 'AI Solution Navigator',
        solution_concept: formData.solutionConcept,
        primary_user: formData.primaryUser,
        industry: formData.industryDomain,
        problem: formData.problemPainPoint || 'Not provided',
        constraints: formData.constraints || 'Not provided',
        differentiation: formData.differentiationHypothesis || 'Not provided',
        competitors: formData.knownCompetitors || 'Not provided',
      }),
    });
  } catch (error) {
    console.error('Email notification failed:', error);
  }
}

// Perplexity API call for market research
async function getMarketResearch(formData: FormData): Promise<string> {
  const query = `Research the competitive landscape for this AI solution concept:

Industry: ${formData.industryDomain}
Target User: ${formData.primaryUser}
Solution Concept: ${formData.solutionConcept}
${formData.knownCompetitors ? `Known Competitors: ${formData.knownCompetitors}` : ''}

Please provide:
1. 3-5 relevant competitors or existing solutions in this space with brief descriptions
2. Key market dynamics (is the market growing, consolidating, etc.)
3. Recent trends or developments in this space
4. Potential differentiation opportunities

Include source URLs for competitor information.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a market research analyst. Provide factual, well-sourced information about competitors and market dynamics. Always include source URLs when referencing specific companies or data.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 2000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Perplexity API error:', errorData);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity response:', data.choices[0].message.content);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Market research failed:', error);
    return 'Market research unavailable. Proceeding with analysis based on provided information.';
  }
}

// Claude API call for full assessment
async function generateClaudeAssessment(formData: FormData, marketResearch: string): Promise<AssessmentResults> {
  const systemPrompt = `You are an expert AI product strategist and solution architect. You help organizations evaluate AI solution concepts with rigorous, structured analysis.

Your assessments are known for:
- Explicit assumptions and uncertainties (you state what you don't know)
- Grounded analysis (not generic advice)
- Practical viability scoring
- Responsible AI awareness (NIST AI RMF, EU AI Act)
- Clear kill criteria and validation steps

You output structured JSON that matches the required schema exactly.`;

  const userPrompt = `Analyze this AI solution concept and provide a comprehensive first-pass assessment.

## Solution Input

**Solution Concept:** ${formData.solutionConcept}

**Primary User/Buyer:** ${formData.primaryUser}

**Industry/Domain:** ${formData.industryDomain}

**Problem & Pain Point:** ${formData.problemPainPoint || 'Not specified'}

**Success Metric:** ${formData.successMetric || 'Not specified'}

**Constraints:** ${formData.constraints || 'Not specified'}

**Data Availability:** ${formData.dataAvailability || 'Not specified'}

**Sensitive Data Types:** ${formData.sensitiveDataTypes || 'None specified'}

**High-Stakes Decisions:** ${formData.highStakesDecisions ? 'Yes' : 'No'}

**Differentiation Hypothesis:** ${formData.differentiationHypothesis || 'Not specified'}

**Known Competitors:** ${formData.knownCompetitors || 'Not specified'}

**Deployment Context:** ${formData.deploymentContext}

**Geography:** ${formData.geography}

## Market Research (from Perplexity)

${marketResearch}

---

## Required Output

Return a JSON object with this exact structure:

{
  "viabilityScores": [
    {"dimension": "Demand Signal", "score": 1-5, "rationale": "one sentence"},
    {"dimension": "Differentiation", "score": 1-5, "rationale": "one sentence"},
    {"dimension": "Distribution Ease", "score": 1-5, "rationale": "one sentence"},
    {"dimension": "Build Complexity", "score": 1-5, "rationale": "one sentence"},
    {"dimension": "Regulatory Risk", "score": 1-5, "rationale": "one sentence"},
    {"dimension": "Defensibility", "score": 1-5, "rationale": "one sentence"},
    {"dimension": "Time-to-Value", "score": 1-5, "rationale": "one sentence"}
  ],
  "mostConstraining": ["dimension1", "dimension2"],
  "responsibleAIRisks": [
    {"dimension": "Privacy & Data Protection", "level": "Low|Medium|High", "rationale": "one sentence"},
    {"dimension": "Bias & Fairness", "level": "Low|Medium|High", "rationale": "one sentence"},
    {"dimension": "Transparency", "level": "Low|Medium|High", "rationale": "one sentence"},
    {"dimension": "Safety & Harm", "level": "Low|Medium|High", "rationale": "one sentence"},
    {"dimension": "Security & Misuse", "level": "Low|Medium|High", "rationale": "one sentence"},
    {"dimension": "Human Oversight", "level": "Low|Medium|High", "rationale": "one sentence"}
  ],
  "euAiActClassification": "Minimal Risk | Limited Risk | High Risk | Unacceptable Risk - with brief explanation",
  "reportMarkdown": "full markdown report (see structure below)"
}

## Report Markdown Structure

The reportMarkdown field should contain a complete markdown report with these sections:

# AI Solution Assessment Report

## Executive Summary
- One paragraph summarizing concept and target user
- Conditional recommendation: "Promising if...", "Risky if...", or "Do not proceed until..."
- Single biggest uncertainty
- Decision focus: what to validate first

## Problem Framing and Assumptions
- Restated problem in plain language
- Why existing solutions fail
- Explicit assumptions (demand, buyer, data, integration, regulatory)
- Top unknowns

## Proposed Solution Concept
- User journey in 3 steps
- System boundaries (what it does and doesn't do)
- LLM contribution explanation

## AI Feasibility Snapshot
- LLM fit statement
- Data and context requirements
- Integration complexity
- Top technical risks

## Market and Competitive Snapshot
- 3-5 competitors with descriptions and source citations
- Category dynamics
- Differentiation direction
- "Information Needed to Increase Confidence" subsection

## Viability Analysis
- Score table with visual indicators
- Interpretation paragraph naming most constraining dimensions

## Risks, Kill Criteria, and Responsible AI
### Execution and Product Risks
- Top 5 risks with severity and mitigation direction

### Responsible AI and Regulatory Risk Screen
- Six-dimension rubric
- NIST AI RMF mapping
- EU AI Act preliminary classification
- Information needed to refine classification
- Disclaimer: not legal advice

### Kill Criteria
- 3-7 concrete, testable stop conditions

## Next Steps for Validation
- Phase 1: Validate Demand (2-4 actions)
- Phase 2: Validate Feasibility (2-4 actions)
- Phase 3: Validate Differentiation & Risk (2-4 actions)

---

Important:
- Be specific to the actual solution, not generic
- State assumptions and uncertainties explicitly
- Include "Information Needed to Increase Confidence" where relevant
- Keep rationales concise but substantive
- For competitors, use the market research provided and include source URLs
- Score conservatively; a 5 should be rare and well-justified`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Claude API error:', errorData);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    // Parse the JSON response
    // Claude might wrap it in markdown code blocks, so we need to extract it
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    
    // Try to find JSON object if not wrapped in code blocks
    if (!jsonStr.trim().startsWith('{')) {
      const objectMatch = content.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonStr = objectMatch[0];
      }
    }

    const result = JSON.parse(jsonStr);
    
    // Validate and return
    return {
      viabilityScores: result.viabilityScores,
      mostConstraining: result.mostConstraining,
      responsibleAIRisks: result.responsibleAIRisks,
      euAiActClassification: result.euAiActClassification,
      reportMarkdown: result.reportMarkdown,
    };
  } catch (error) {
    console.error('Claude assessment failed:', error);
    throw new Error('Failed to generate assessment. Please try again.');
  }
}
