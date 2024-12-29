import React from 'react';
import { Brain } from 'lucide-react';

interface PredictionBadgeProps {
  suggestedTier: string;
  confidence: number;
}

export function PredictionBadge({ suggestedTier, confidence }: PredictionBadgeProps) {
  const getConfidenceColor = () => {
    if (confidence >= 0.7) return 'bg-purple-100 text-purple-800';
    if (confidence >= 0.4) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getConfidenceColor()}`}>
      <Brain className="w-4 h-4" />
      <span className="font-medium">
        Suggested: {suggestedTier} ({(confidence * 100).toFixed(0)}%)
      </span>
    </div>
  );
}