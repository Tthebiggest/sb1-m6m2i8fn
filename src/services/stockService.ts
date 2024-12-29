import axios, { AxiosError } from 'axios';
import { Asset, ApiResponse } from '../types';
import { AlphaVantageResponse, YahooFinanceResponse, ApiError } from '../types/api';
import { fetchWithRetry } from '../utils/api';
import { checkRateLimit } from '../utils/apiUtils';
import { validateAsset, sanitizeAssetData } from '../utils/validation';

export async function getStockData(symbol: string): Promise<ApiResponse<Asset>> {
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Invalid symbol provided');
  }

  return fetchWithRetry(
    async () => {
      checkRateLimit('ALPHA_VANTAGE');
      return fetchAlphaVantageData(symbol.toUpperCase());
    },
    async () => {
      checkRateLimit('YAHOO_FINANCE');
      return fetchYahooFinanceData(symbol.toUpperCase());
    },
    `stock_${symbol.toLowerCase()}`
  );
}

async function fetchAlphaVantageData(symbol: string): Promise<Asset> {
  try {
    const response = await axios.get<AlphaVantageResponse>(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const quote = response.data['Global Quote'];
    if (!quote) {
      throw new Error('Invalid response format');
    }

    const asset = sanitizeAssetData({
      id: symbol,
      symbol,
      type: 'stock',
      currentPrice: parseFloat(quote['05. price']),
      priceChange24h: parseFloat(quote['09. change']),
      lastUpdated: quote['07. latest trading day'],
    });

    if (!validateAsset(asset)) {
      throw new Error('Invalid asset data');
    }

    return asset;
  } catch (error) {
    const apiError: ApiError = {
      code: error instanceof AxiosError ? error.code || 'UNKNOWN' : 'PARSE_ERROR',
      message: error.message,
      source: 'ALPHA_VANTAGE',
    };
    throw apiError;
  }
}