import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = 'Something went wrong while generating your assessment.', onRetry }: ErrorStateProps) {
  return (
    <div className="card-enterprise p-12 text-center animate-fade-in">
      <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">Assessment Failed</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {message}
      </p>
      <Button onClick={onRetry} className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
}
