import React from 'react';
import { Asset, Tier } from '../types';
import { useAssetStore } from '../store/assetStore';
import { Star } from 'lucide-react';

const TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F'];

export function TierList() {
  const { assets, watchlist, setTier, toggleWatchlist } = useAssetStore();

  const tierAssets = TIERS.map((tier) => ({
    tier,
    assets: assets.filter((asset) => asset.tier === tier),
  }));

  return (
    <div className="space-y-4">
      {tierAssets.map(({ tier, assets }) => (
        <div
          key={tier}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${getTierColor(tier)}`}>
              {tier}
            </div>
            <h3 className="text-lg font-semibold">Tier {tier}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                isWatchlisted={watchlist.includes(asset.id)}
                onTierChange={setTier}
                onWatchlistToggle={toggleWatchlist}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AssetCard({
  asset,
  isWatchlisted,
  onTierChange,
  onWatchlistToggle,
}: {
  asset: Asset;
  isWatchlisted: boolean;
  onTierChange: (id: string, tier: Tier) => void;
  onWatchlistToggle: (id: string) => void;
}) {
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
      <select
        className="mt-2 w-full rounded-md border-gray-300 shadow-sm"
        value={asset.tier || ''}
        onChange={(e) => onTierChange(asset.id, e.target.value as Tier)}
      >
        <option value="">Select Tier</option>
        {TIERS.map((tier) => (
          <option key={tier} value={tier}>
            Tier {tier}
          </option>
        ))}
      </select>
    </div>
  );
}

function getTierColor(tier: Tier): string {
  const colors: Record<Tier, string> = {
    S: 'bg-purple-100 text-purple-700',
    A: 'bg-blue-100 text-blue-700',
    B: 'bg-green-100 text-green-700',
    C: 'bg-yellow-100 text-yellow-700',
    D: 'bg-orange-100 text-orange-700',
    F: 'bg-red-100 text-red-700',
  };
  return colors[tier];
}