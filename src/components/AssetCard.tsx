import React, { useEffect, useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Asset, Tier } from '../types';
import { PopularityBadge } from './PopularityBadge';
import { NewsFeed } from './NewsFeed';
import { fetchAssetNews, NewsItem } from '../services/newsService';

interface AssetCardProps {
  asset: Asset;
  isWatchlisted: boolean;
  onTierChange: (id: string, tier: Tier) => void;
  onWatchlistToggle: (id: string) => void;
}

export function AssetCard({
  asset,
  isWatchlisted,
  onTierChange,
  onWatchlistToggle,
}: AssetCardProps) {
  const [showNews, setShowNews] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  useEffect(() => {
    if (showNews) {
      setIsLoadingNews(true);
      fetchAssetNews(asset.symbol, asset.type)
        .then(setNews)
        .finally(() => setIsLoadingNews(false));
    }
  }, [showNews, asset.symbol, asset.type]);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{asset.name}</h4>
          <p className="text-sm text-gray-600">{asset.symbol}</p>
        </div>
        <button
          onClick={() => onWatchlistToggle(asset.id)}
          className="text-gray-400 hover:text-yellow-400"
        >
          <Star className={isWatchlisted ? 'fill-yellow-400 text-yellow-400' : ''} />
        </button>
      </div>
      
      <div className="mt-2">
        <p className="text-lg font-semibold">${asset.currentPrice.toFixed(2)}</p>
        <p className={`text-sm ${asset.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
        </p>
      </div>

      {asset.popularityMetrics && (
        <div className="mt-2">
          <PopularityBadge metrics={asset.popularityMetrics} />
        </div>
      )}

      <select
        className="mt-2 w-full rounded-md border-gray-300 shadow-sm"
        value={asset.tier || ''}
        onChange={(e) => onTierChange(asset.id, e.target.value as Tier)}
      >
        <option value="">Select Tier</option>
        {['S', 'A', 'B', 'C', 'D', 'F'].map((tier) => (
          <option key={tier} value={tier}>
            Tier {tier}
          </option>
        ))}
      </select>

      <button
        onClick={() => setShowNews(!showNews)}
        className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        {showNews ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {showNews ? 'Hide News' : 'Show News'}
      </button>

      {showNews && (
        <div className="mt-4">
          <NewsFeed news={news} isLoading={isLoadingNews} />
        </div>
      )}
    </div>
  );
}