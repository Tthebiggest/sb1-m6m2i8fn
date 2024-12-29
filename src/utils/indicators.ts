import { RSI, SMA, MACD } from 'technicalindicators';

export interface TechnicalIndicators {
  rsi: number;
  sma: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
}

export function calculateIndicators(prices: number[]): TechnicalIndicators {
  const rsi = calculateRSI(prices);
  const sma = calculateSMA(prices);
  const macd = calculateMACD(prices);

  return {
    rsi,
    sma,
    macd,
  };
}

function calculateRSI(prices: number[]): number {
  const rsi = new RSI({ period: 14, values: prices });
  const results = rsi.getResult();
  return results[results.length - 1];
}

function calculateSMA(prices: number[]): number {
  const sma = new SMA({ period: 20, values: prices });
  const results = sma.getResult();
  return results[results.length - 1];
}

function calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
  const macd = new MACD({
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });

  const results = macd.getResult();
  const latest = results[results.length - 1];

  return {
    macd: latest.MACD,
    signal: latest.signal,
    histogram: latest.histogram,
  };
}