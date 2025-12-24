import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FormData, initialFormData } from '@/types/assessment';
import { cn } from '@/lib/utils';

interface AssessmentFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
}

const SENSITIVE_KEYWORDS = ['ssn', 'password', 'credit card', 'social security', 'bank account', 'pin number'];

export function AssessmentForm({ formData, setFormData, onSubmit, onReset, isLoading }: AssessmentFormProps) {
  const [optionalOpen, setOptionalOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [sensitiveWarning, setSensitiveWarning] = useState(false);

  const isFormValid = formData.solutionConcept.trim().length >= 50 && 
                      formData.primaryUser.trim().length > 0 && 
                      formData.industryDomain.trim().length > 0;

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check for sensitive keywords
    if (typeof value === 'string') {
      const hasWarning = SENSITIVE_KEYWORDS.some(keyword => 
        value.toLowerCase().includes(keyword)
      );
      setSensitiveWarning(hasWarning);
    }
  };

  const conceptLength = formData.solutionConcept.length;
  const conceptGuidance = conceptLength < 50 
    ? `${50 - conceptLength} more characters needed (minimum 3 sentences)` 
    : conceptLength > 1000 
      ? 'Consider being more concise' 
      : 'Good length';

  return (
    <div className="card-enterprise p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">AI Solution Navigator</h1>
        <p className="text-muted-foreground">
          First-pass AI solution scoping and market viability assessment
        </p>
      </div>

      {/* Sensitive Data Warning */}
      {sensitiveWarning && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Sensitive Data Detected</p>
            <p className="text-sm text-yellow-700">
              Please don't include sensitive personal data (SSN, passwords, credit card numbers) in your inputs.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Required Fields */}
        <div className="space-y-4">
          <h2 className="section-title flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full" />
            Required Information
          </h2>

          <div>
            <Label htmlFor="solutionConcept" className="input-label">
              Solution Concept <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="solutionConcept"
              placeholder="Describe your AI solution in 3-10 sentences. What does it do? How does it help users? What makes it different?"
              value={formData.solutionConcept}
              onChange={(e) => handleInputChange('solutionConcept', e.target.value)}
              className="min-h-[120px] resize-y"
              disabled={isLoading}
            />
            <p className={cn(
              "input-hint",
              conceptLength < 50 ? "text-muted-foreground" : conceptLength > 1000 ? "text-yellow-600" : "text-green-600"
            )}>
              {conceptGuidance} ({conceptLength} characters)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryUser" className="input-label">
                Primary User/Buyer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="primaryUser"
                placeholder="e.g., HR managers at mid-size companies"
                value={formData.primaryUser}
                onChange={(e) => handleInputChange('primaryUser', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="industryDomain" className="input-label">
                Industry/Domain <span className="text-destructive">*</span>
              </Label>
              <Input
                id="industryDomain"
                placeholder="e.g., Healthcare, Financial Services, Retail"
                value={formData.industryDomain}
                onChange={(e) => handleInputChange('industryDomain', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Optional Fields */}
        <Collapsible open={optionalOpen} onOpenChange={setOptionalOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
              <span className="font-medium text-foreground">Add Context to Improve Results</span>
              {optionalOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4 animate-accordion-down">
            <div>
              <Label htmlFor="problemPainPoint" className="input-label">Problem & Pain Point</Label>
              <Textarea
                id="problemPainPoint"
                placeholder="What specific problem are you solving? What pain does your target user experience today?"
                value={formData.problemPainPoint}
                onChange={(e) => handleInputChange('problemPainPoint', e.target.value)}
                className="min-h-[80px]"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="successMetric" className="input-label">Intended Success Metric</Label>
              <Input
                id="successMetric"
                placeholder="e.g., Reduce processing time by 50%, Increase accuracy to 95%"
                value={formData.successMetric}
                onChange={(e) => handleInputChange('successMetric', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="constraints" className="input-label">Constraints</Label>
              <Textarea
                id="constraints"
                placeholder="Timeline, budget, integration requirements, technical limitations..."
                value={formData.constraints}
                onChange={(e) => handleInputChange('constraints', e.target.value)}
                className="min-h-[80px]"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="dataAvailability" className="input-label">Data Availability</Label>
              <Textarea
                id="dataAvailability"
                placeholder="What data exists? Do you have access to it? Quality and quantity estimates?"
                value={formData.dataAvailability}
                onChange={(e) => handleInputChange('dataAvailability', e.target.value)}
                className="min-h-[80px]"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="sensitiveDataTypes" className="input-label">Sensitive Data Types</Label>
              <Input
                id="sensitiveDataTypes"
                placeholder="e.g., PII, PHI, financial records, biometric data"
                value={formData.sensitiveDataTypes}
                onChange={(e) => handleInputChange('sensitiveDataTypes', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <Label htmlFor="highStakes" className="input-label mb-0">High-Stakes Decisions</Label>
                <p className="text-xs text-muted-foreground">
                  Employment, credit, healthcare, education, or similar consequential decisions
                </p>
              </div>
              <Switch
                id="highStakes"
                checked={formData.highStakesDecisions}
                onCheckedChange={(checked) => handleInputChange('highStakesDecisions', checked)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="differentiationHypothesis" className="input-label">Differentiation Hypothesis</Label>
              <Input
                id="differentiationHypothesis"
                placeholder="Why will your solution win against alternatives?"
                value={formData.differentiationHypothesis}
                onChange={(e) => handleInputChange('differentiationHypothesis', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="knownCompetitors" className="input-label">Known Competitors</Label>
              <Input
                id="knownCompetitors"
                placeholder="Company A, Company B, Open Source Tool X"
                value={formData.knownCompetitors}
                onChange={(e) => handleInputChange('knownCompetitors', e.target.value)}
                disabled={isLoading}
              />
              <p className="input-hint">Comma-separated list</p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Advanced Mode */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Settings2 className="w-4 h-4" />
                Advanced Mode
              </span>
              {advancedOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4 animate-accordion-down">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="input-label">Deployment Context</Label>
                <Select
                  value={formData.deploymentContext}
                  onValueChange={(value) => handleInputChange('deploymentContext', value as FormData['deploymentContext'])}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select deployment context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal Enterprise Tool</SelectItem>
                    <SelectItem value="external">External Customer-Facing</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="input-label">Geography</Label>
                <Select
                  value={formData.geography}
                  onValueChange={(value) => handleInputChange('geography', value as FormData['geography'])}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select geography" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="eu">European Union</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={onSubmit}
            disabled={!isFormValid || isLoading}
            className="flex-1 h-12 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <span className="animate-pulse-subtle">Generating Assessment...</span>
              </>
            ) : (
              'Generate Assessment'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            disabled={isLoading}
            className="sm:w-32 h-12"
          >
            Reset Form
          </Button>
        </div>

        {!isFormValid && (
          <p className="text-sm text-muted-foreground text-center">
            Complete all required fields to enable assessment generation
          </p>
        )}
      </div>
    </div>
  );
}
