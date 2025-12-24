import React from 'react';
import { ViabilityScore, ResponsibleAIRisk } from '@/types/assessment';
import { cn } from '@/lib/utils';
import { Shield, TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
  viabilityScores: ViabilityScore[];
  mostConstraining: string[];
  responsibleAIRisks: ResponsibleAIRisk[];
  euAiActClassification: string;
}

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={cn(
            "score-dot",
            dot <= score ? "score-dot-filled" : "score-dot-empty"
          )}
        />
      ))}
    </div>
  );
}

function RiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  return (
    <span className={cn(
      "risk-badge",
      level === 'Low' && "risk-low",
      level === 'Medium' && "risk-medium",
      level === 'High' && "risk-high"
    )}>
      {level}
    </span>
  );
}

export function SummaryCards({ 
  viabilityScores, 
  mostConstraining, 
  responsibleAIRisks,
  euAiActClassification 
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Viability Scorecard */}
      <div className="card-enterprise p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Viability Scorecard</h2>
        </div>

        <div className="space-y-3">
          {viabilityScores.map((item, index) => (
            <div 
              key={item.dimension} 
              className="flex items-start gap-4 p-3 bg-secondary/30 rounded-lg animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="min-w-[140px]">
                <p className="font-medium text-sm text-foreground">{item.dimension}</p>
              </div>
              <div className="flex-shrink-0">
                <ScoreDots score={item.score} />
              </div>
              <p className="text-xs text-muted-foreground flex-1">{item.rationale}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Most Constraining: </span>
            {mostConstraining.join(', ')}
          </p>
        </div>
      </div>

      {/* Responsible AI Screen */}
      <div className="card-enterprise p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Responsible AI Screen</h2>
        </div>

        <div className="space-y-3">
          {responsibleAIRisks.map((item, index) => (
            <div 
              key={item.dimension} 
              className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{item.dimension}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.rationale}</p>
              </div>
              <RiskBadge level={item.level} />
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
              NIST AI RMF
            </span>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
              EU AI Act
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">EU AI Act Classification: </span>
            {euAiActClassification}
          </p>
        </div>
      </div>
    </div>
  );
}
