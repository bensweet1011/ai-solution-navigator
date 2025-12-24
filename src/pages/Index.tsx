import React, { useState } from 'react';
import { AssessmentForm } from '@/components/AssessmentForm';
import { SummaryCards } from '@/components/SummaryCards';
import { FullReport } from '@/components/FullReport';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { FormData, AssessmentResults, AppState, initialFormData } from '@/types/assessment';
import { generateAssessment } from '@/lib/api';

const Index = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [appState, setAppState] = useState<AppState>('empty');
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async () => {
    setAppState('loading');
    setErrorMessage('');

    try {
      const assessmentResults = await generateAssessment(formData);
      setResults(assessmentResults);
      setAppState('results');
      
      // Scroll to results after a brief delay
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
      setAppState('error');
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResults(null);
    setAppState('empty');
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      {/* App Container */}
      <div className="max-w-6xl mx-auto bg-background rounded-xl shadow-2xl border border-border/50">
        {/* Header */}
        <header className="border-b border-border bg-card rounded-t-xl no-print">
          <div className="px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="font-semibold text-foreground">AI Solution Navigator</h1>
                <p className="text-xs text-muted-foreground">Enterprise AI Assessment Tool</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 lg:px-8 py-8 space-y-8">
          {/* Zone 1: Form */}
          {appState !== 'loading' && (
            <AssessmentForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isLoading={false}
            />
          )}

          {/* Loading State */}
          {appState === 'loading' && <LoadingState />}

          {/* Error State */}
          {appState === 'error' && (
            <ErrorState message={errorMessage} onRetry={handleRetry} />
          )}

          {/* Zone 2 & 3: Results */}
          {appState === 'results' && results && (
            <div id="results-section" className="space-y-8">
              {/* Summary Cards */}
              <SummaryCards
                viabilityScores={results.viabilityScores}
                mostConstraining={results.mostConstraining}
                responsibleAIRisks={results.responsibleAIRisks}
                euAiActClassification={results.euAiActClassification}
              />

              {/* Full Report */}
              <FullReport markdown={results.reportMarkdown} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border rounded-b-xl no-print">
          <div className="px-6 lg:px-8 py-6">
            <p className="text-sm text-muted-foreground text-center">
              AI Solution Navigator — First-pass assessment tool. Results should be validated through additional research.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
