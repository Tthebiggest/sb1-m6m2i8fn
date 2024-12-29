import React from 'react';
import { TrendingUp, Activity, Users } from 'lucide-react';
import { Asset } from '../types';
import { formatPercent } from '../utils/formatters';

interface LeaderboardProps {
  assets: Asset[];
}

export function Leaderboard({ assets }: LeaderboardProps) {
  const topGrowth = [...assets]
    .sort((a, b) => b.priceChange24h - a.priceChange24h)
    .slice(0, 5);

  const topPopularity = [...assets]
    .filter(a => a.popularityMetrics)
    .sort((a, b) => (b.popularityMetrics?.totalScore || 0) - (a.popularityMetrics?.totalScore || 0))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-600" />
          <h2 className="text-xl font-semibold">Top Performers</h2>
        </div>
        <div className="space-y-4">
          {topGrowth.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{asset.name}</p>
                <p className="text-sm text-gray-600">{asset.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${asset.currentPrice.toFixed(2)}</p>
                <p className={`text-sm ${asset.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(asset.priceChange24h)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-blue-600" />
          <h2 className="text-xl font-semibold">Most Popular</h2>
        </div>
        <div className="space-y-4">
          {topPopularity.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{asset.name}</p>
                <p className="text-sm text-gray-600">{asset.symbol}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  <Activity className="w-4 h-4" />
                  {((asset.popularityMetrics?.totalScore || 0) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}