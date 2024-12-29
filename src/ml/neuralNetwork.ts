import * as brain from '@brain.js/brain.js';
import { Asset } from '../types';
import { TechnicalIndicators } from '../utils/indicators';

interface TrainingData {
  input: {
    price: number;
    priceChange: number;
    rsi: number;
    macdHistogram: number;
    sentiment: number;
    popularity: number;
  };
  output: number[];
}

export class AssetPredictor {
  private network: brain.NeuralNetwork;
  private trained: boolean = false;

  constructor() {
    this.network = new brain.NeuralNetwork({
      hiddenLayers: [6, 4],
    });
  }

  public async train(assets: Asset[], indicators: Map<string, TechnicalIndicators>): Promise<void> {
    const trainingData = this.prepareTrainingData(assets, indicators);
    
    await this.network.trainAsync(trainingData, {
      iterations: 1000,
      errorThresh: 0.005,
    });

    this.trained = true;
  }

  public predict(asset: Asset, indicators: TechnicalIndicators): number {
    if (!this.trained) {
      throw new Error('Neural network not trained');
    }

    const input = this.normalizeInput({
      price: asset.currentPrice,
      priceChange: asset.priceChange24h,
      rsi: indicators.rsi,
      macdHistogram: indicators.macd.histogram,
      sentiment: asset.popularityMetrics?.sentimentScore || 0,
      popularity: asset.popularityMetrics?.searchScore || 0,
    });

    const output = this.network.run(input);
    return this.denormalizeTierScore(output);
  }

  private prepareTrainingData(
    assets: Asset[],
    indicators: Map<string, TechnicalIndicators>
  ): TrainingData[] {
    return assets
      .filter(asset => asset.tier && indicators.has(asset.id))
      .map(asset => ({
        input: this.normalizeInput({
          price: asset.currentPrice,
          priceChange: asset.priceChange24h,
          rsi: indicators.get(asset.id)!.rsi,
          macdHistogram: indicators.get(asset.id)!.macd.histogram,
          sentiment: asset.popularityMetrics?.sentimentScore || 0,
          popularity: asset.popularityMetrics?.searchScore || 0,
        }),
        output: this.tierToOutput(asset.tier!),
      }));
  }

  private normalizeInput(input: TrainingData['input']): TrainingData['input'] {
    return {
      price: this.normalize(input.price, 0, 10000),
      priceChange: this.normalize(input.priceChange, -100, 100),
      rsi: this.normalize(input.rsi, 0, 100),
      macdHistogram: this.normalize(input.macdHistogram, -2, 2),
      sentiment: input.sentiment,
      popularity: input.popularity,
    };
  }

  private normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  private tierToOutput(tier: string): number[] {
    const tiers = ['F', 'D', 'C', 'B', 'A', 'S'];
    const index = tiers.indexOf(tier);
    return tiers.map((_, i) => i === index ? 1 : 0);
  }

  private denormalizeTierScore(output: number[]): number {
    const maxIndex = output.indexOf(Math.max(...output));
    return maxIndex / (output.length - 1);
  }
}