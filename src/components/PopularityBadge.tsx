import React from 'react';
import { Trending, TrendingDown, TrendingUp } from 'lucide-react';
import { PopularityMetrics } from '../services/popularityService';

interface PopularityBadgeProps {
  metrics: PopularityMetrics;
}

export function PopularityBadge({ metrics }: PopularityBadgeProps) {
  const { totalScore } = metrics;
  
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'bg-green-100 text-green-800';
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (score: number) => {
    if (score >= 0.7) return <TrendingUp className="w-4 h-4" />;
    if (score >= 0.4) return <Trending className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getScoreColor(totalScore)}`}>
      {getTrendIcon(totalScore)}
      <span className="font-medium">
        {(totalScore * 100).toFixed(0)}%
      </span>
    </div>
  );
}