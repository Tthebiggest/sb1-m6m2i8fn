import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Recommendation } from '../services/recommendationService';
import { PopularityBadge } from './PopularityBadge';

interface DailyRecommendationsProps {
  recommendations: Recommendation[];
}

export function DailyRecommendations({ recommendations }: DailyRecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-green-600" />
        <h2 className="text-xl font-semibold">Daily Recommendations</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map(({ asset, reason, score }) => (
          <div key={asset.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{asset.name}</h3>
                <p className="text-sm text-gray-600">{asset.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${asset.currentPrice.toFixed(2)}</p>
                <p className={`text-sm ${asset.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                </p>
              </div>
            </div>
            {asset.popularityMetrics && (
              <div className="mb-2">
                <PopularityBadge metrics={asset.popularityMetrics} />
              </div>
            )}
            <p className="text-sm text-gray-600">{reason}</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${score * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}