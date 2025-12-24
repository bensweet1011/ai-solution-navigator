export interface FormData {
  // Required fields
  solutionConcept: string;
  primaryUser: string;
  industryDomain: string;
  
  // Optional fields
  problemPainPoint: string;
  successMetric: string;
  constraints: string;
  dataAvailability: string;
  sensitiveDataTypes: string;
  highStakesDecisions: boolean;
  differentiationHypothesis: string;
  knownCompetitors: string;
  
  // Advanced fields
  deploymentContext: 'internal' | 'external' | 'unknown';
  geography: 'us' | 'eu' | 'global' | 'unknown';
}

export interface ViabilityScore {
  dimension: string;
  score: number; // 1-5
  rationale: string;
}

export interface ResponsibleAIRisk {
  dimension: string;
  level: 'Low' | 'Medium' | 'High';
  rationale: string;
}

export interface AssessmentResults {
  viabilityScores: ViabilityScore[];
  mostConstraining: string[];
  responsibleAIRisks: ResponsibleAIRisk[];
  euAiActClassification: string;
  reportMarkdown: string;
}

export type AppState = 'empty' | 'loading' | 'results' | 'error';

export const initialFormData: FormData = {
  solutionConcept: '',
  primaryUser: '',
  industryDomain: '',
  problemPainPoint: '',
  successMetric: '',
  constraints: '',
  dataAvailability: '',
  sensitiveDataTypes: '',
  highStakesDecisions: false,
  differentiationHypothesis: '',
  knownCompetitors: '',
  deploymentContext: 'unknown',
  geography: 'unknown',
};
