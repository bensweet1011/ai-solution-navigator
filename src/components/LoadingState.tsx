import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="card-enterprise p-12 text-center animate-fade-in">
      <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
      <h3 className="text-xl font-semibold text-foreground mb-2">Generating Assessment</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
      Analyzing your solution concept, evaluating market viability, and assessing responsible AI considerations. This may take up to a minute.
      </p>
      <div className="mt-6 w-full max-w-xs mx-auto bg-secondary rounded-full h-2 overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  );
}
