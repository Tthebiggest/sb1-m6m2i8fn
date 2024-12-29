export type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  currentPrice: number;
  priceChange24h: number;
  tier?: Tier;
  lastUpdated: string;
  popularityMetrics?: {
    searchScore: number;
    sentimentScore: number;
    priceScore: number;
    totalScore: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  source: 'primary' | 'fallback' | 'cache';
  timestamp: number;
}

export interface ChartData {
  timestamps: number[];
  prices: number[];
}