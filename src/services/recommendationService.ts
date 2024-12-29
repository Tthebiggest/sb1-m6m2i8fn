import { Asset } from '../types';
import { CustomTier } from '../types/tiers';

export interface Recommendation {
  asset: Asset;
  reason: string;
  score: number;
  timestamp: number;
}

export class RecommendationService {
  private static instance: RecommendationService;
  private recommendations: Map<string, Recommendation> = new Map();
  private readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): RecommendationService {
    if (!this.instance) {
      this.instance = new RecommendationService();
    }
    return this.instance;
  }

  updateRecommendations(assets: Asset[], customTiers: CustomTier[]) {
    const now = Date.now();
    this.cleanOldRecommendations();

    assets.forEach(asset => {
      const score = this.calculateRecommendationScore(asset);
      if (score > 0.7) { // Threshold for recommendations
        const matchingTier = this.findMatchingTier(asset, customTiers);
        const reason = this.generateRecommendationReason(asset, matchingTier);
        
        this.recommendations.set(asset.id, {
          asset,
          reason,
          score,
          timestamp: now,
        });
      }
    });
  }

  getTopRecommendations(limit: number = 5): Recommendation[] {
    return Array.from(this.recommendations.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private calculateRecommendationScore(asset: Asset): number {
    const priceScore = this.normalizePriceChange(asset.priceChange24h);
    const popularityScore = asset.popularityMetrics?.totalScore ?? 0;
    
    return (priceScore + popularityScore) / 2;
  }

  private normalizePriceChange(change: number): number {
    const maxChange = 10;
    return Math.max(0, Math.min(1, (change + maxChange) / (2 * maxChange)));
  }

  private findMatchingTier(asset: Asset, tiers: CustomTier[]): CustomTier | undefined {
    return tiers.find(tier => {
      const { criteria } = tier;
      return (
        (!criteria.minPrice || asset.currentPrice >= criteria.minPrice) &&
        (!criteria.maxPrice || asset.currentPrice <= criteria.maxPrice) &&
        (!criteria.minChange || asset.priceChange24h >= criteria.minChange) &&
        (!criteria.maxChange || asset.priceChange24h <= criteria.maxChange) &&
        (!criteria.minPopularity || (asset.popularityMetrics?.totalScore ?? 0) >= criteria.minPopularity)
      );
    });
  }

  private generateRecommendationReason(asset: Asset, tier?: CustomTier): string {
    const reasons: string[] = [];

    if (asset.priceChange24h > 5) {
      reasons.push('Strong price momentum');
    }
    if (asset.popularityMetrics?.totalScore ?? 0 > 0.7) {
      reasons.push('High social interest');
    }
    if (tier) {
      reasons.push(`Matches ${tier.name} criteria`);
    }

    return reasons.join(' • ');
  }

  private cleanOldRecommendations() {
    const now = Date.now();
    this.recommendations.forEach((rec, id) => {
      if (now - rec.timestamp > this.MAX_AGE) {
        this.recommendations.delete(id);
      }
    });
  }
}