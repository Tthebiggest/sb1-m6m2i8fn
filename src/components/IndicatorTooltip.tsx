import React from 'react';
import { TechnicalIndicators } from '../utils/indicators';

interface IndicatorTooltipProps {
  indicators: TechnicalIndicators;
}

export function IndicatorTooltip({ indicators }: IndicatorTooltipProps) {
  return (
    <div className="absolute z-10 invisible group-hover:visible bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
      <div className="space-y-2">
        <div>
          <span className="font-medium">RSI:</span>{' '}
          <span className={getIndicatorColor(indicators.rsi, 30, 70)}>
            {indicators.rsi.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="font-medium">MACD:</span>
          <div className="pl-2 text-sm">
            <div>Signal: {indicators.macd.signal.toFixed(2)}</div>
            <div>Histogram: {indicators.macd.histogram.toFixed(2)}</div>
          </div>
        </div>
        <div>
          <span className="font-medium">SMA (20):</span>{' '}
          {indicators.sma.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

function getIndicatorColor(value: number, low: number, high: number): string {
  if (value <= low) return 'text-red-600';
  if (value >= high) return 'text-green-600';
  return 'text-yellow-600';
}