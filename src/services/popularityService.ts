import { getSearchTrends } from './trendsService';
import { getSocialSentiment } from './sentimentService';
import { Asset } from '../types';

export interface PopularityMetrics {
  searchScore: number;
  sentimentScore: number;
  priceScore: number;
  totalScore: number;
}

export async function calculatePopularityScore(asset: Asset): Promise<PopularityMetrics> {
  try {
    const [trends, sentiment] = await Promise.all([
      getSearchTrends(asset.symbol),
      getSocialSentiment(asset.symbol),
    ]);

    const searchScore = normalizeScore(trends.searchInterest);
    const sentimentScore = normalizeScore(sentiment.overall);
    const priceScore = calculatePriceScore(asset.priceChange24h);

    const totalScore = (searchScore + sentimentScore + priceScore) / 3;

    return {
      searchScore,
      sentimentScore,
      priceScore,
      totalScore,
    };
  } catch (error) {
    return {
      searchScore: 0,
      sentimentScore: 0,
      priceScore: calculatePriceScore(asset.priceChange24h),
      totalScore: 0,
    };
  }
}

function normalizeScore(score: number): number {
  return Math.max(0, Math.min(1, (score + 1) / 2));
}

function calculatePriceScore(priceChange: number): number {
  // Convert price change percentage to a 0-1 score
  const maxChange = 10; // Consider ±10% as max change
  return normalizeScore(priceChange / maxChange);
}