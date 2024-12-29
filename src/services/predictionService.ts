import { Asset } from '../types';
import { calculateIndicators, TechnicalIndicators } from '../utils/indicators';
import { AssetPredictor } from '../ml/neuralNetwork';

interface PredictionResult {
  suggestedTier: string;
  confidence: number;
  indicators: TechnicalIndicators;
}

class PredictionService {
  private predictor: AssetPredictor;
  private indicators: Map<string, TechnicalIndicators>;
  private initialized: boolean;

  constructor() {
    this.predictor = new AssetPredictor();
    this.indicators = new Map();
    this.initialized = false;
  }

  public async initialize(assets: Asset[]): Promise<void> {
    if (this.initialized) return;

    // Calculate indicators for all assets
    assets.forEach(asset => {
      const prices = this.getPriceHistory(asset);
      const indicators = calculateIndicators(prices);
      this.indicators.set(asset.id, indicators);
    });

    // Train the neural network
    await this.predictor.train(assets, this.indicators);
    this.initialized = true;
  }

  public async getPrediction(asset: Asset): Promise<PredictionResult> {
    if (!this.initialized) {
      await this.initialize([asset]);
    }

    if (!this.indicators.has(asset.id)) {
      const prices = this.getPriceHistory(asset);
      const indicators = calculateIndicators(prices);
      this.indicators.set(asset.id, indicators);
    }

    const indicators = this.indicators.get(asset.id)!;
    const score = this.predictor.predict(asset, indicators);
    
    return {
      suggestedTier: this.scoreTotier(score),
      confidence: score,
      indicators,
    };
  }

  private getPriceHistory(asset: Asset): number[] {
    // In a real implementation, this would fetch historical prices
    // For now, we'll generate some dummy data
    return [
      asset.currentPrice * 0.95,
      asset.currentPrice * 0.97,
      asset.currentPrice * 0.99,
      asset.currentPrice,
    ];
  }

  private scoreTotier(score: number): string {
    if (score >= 0.83) return 'S';
    if (score >= 0.67) return 'A';
    if (score >= 0.50) return 'B';
    if (score >= 0.33) return 'C';
    if (score >= 0.17) return 'D';
    return 'F';
  }
}

export const predictionService = new PredictionService();