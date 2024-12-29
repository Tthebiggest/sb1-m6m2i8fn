import { Asset } from '../types';

export function validateAsset(asset: Partial<Asset>): asset is Asset {
  if (!asset || typeof asset !== 'object') return false;

  const requiredFields: (keyof Asset)[] = ['id', 'symbol', 'type', 'currentPrice'];
  return requiredFields.every(field => {
    const value = asset[field];
    return value !== undefined && value !== null;
  });
}

export function sanitizeAssetData(data: Partial<Asset>): Asset {
  return {
    id: data.id || data.symbol || '',
    symbol: data.symbol || '',
    name: data.name || data.symbol || '',
    type: data.type || 'stock',
    currentPrice: Number(data.currentPrice) || 0,
    priceChange24h: Number(data.priceChange24h) || 0,
    lastUpdated: data.lastUpdated || new Date().toISOString(),
    popularityMetrics: data.popularityMetrics || undefined,
    tier: data.tier || undefined,
  };
}