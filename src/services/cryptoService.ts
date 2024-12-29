import axios from 'axios';
import { Asset, ApiResponse } from '../types';
import { fetchWithRetry } from '../utils/api';
import { checkRateLimit } from '../utils/apiUtils';
import { validateAsset, sanitizeAssetData } from '../utils/validation';
import { ApiError } from '../utils/errors';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const COINCAP_API_URL = 'https://api.coincap.io/v2';
const BINANCE_API_URL = 'https://api.binance.com/api/v3';

export async function getCryptoData(id: string): Promise<ApiResponse<Asset>> {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid crypto id provided');
  }

  return fetchWithRetry(
    async () => {
      checkRateLimit('COINGECKO');
      return fetchCoinGeckoData(id.toLowerCase());
    },
    [
      async () => {
        checkRateLimit('COINCAP');
        return fetchCoinCapData(id.toLowerCase());
      },
      async () => {
        checkRateLimit('BINANCE');
        return fetchBinanceData(id.toLowerCase());
      }
    ],
    `crypto_${id.toLowerCase()}`
  );
}

async function fetchCoinGeckoData(id: string): Promise<Asset> {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: id,
        vs_currencies: 'usd',
        include_24hr_change: true,
      },
    });

    if (!response.data[id]) {
      throw new Error('Crypto not found');
    }

    const data = response.data[id];
    const asset = sanitizeAssetData({
      id,
      symbol: id,
      name: id,
      type: 'crypto',
      currentPrice: data.usd,
      priceChange24h: data.usd_24h_change,
      lastUpdated: new Date().toISOString(),
    });

    if (!validateAsset(asset)) {
      throw new Error('Invalid asset data');
    }

    return asset;
  } catch (error) {
    throw new ApiError(
      error.message,
      error.response?.status?.toString() || 'UNKNOWN',
      'COINGECKO'
    );
  }
}

async function fetchCoinCapData(id: string): Promise<Asset> {
  try {
    const response = await axios.get(`${COINCAP_API_URL}/assets/${id}`);
    const data = response.data.data;

    const asset = sanitizeAssetData({
      id,
      symbol: data.symbol,
      name: data.name,
      type: 'crypto',
      currentPrice: parseFloat(data.priceUsd),
      priceChange24h: parseFloat(data.changePercent24Hr),
      lastUpdated: data.lastUpdated,
    });

    if (!validateAsset(asset)) {
      throw new Error('Invalid asset data');
    }

    return asset;
  } catch (error) {
    throw new ApiError(
      error.message,
      error.response?.status?.toString() || 'UNKNOWN',
      'COINCAP'
    );
  }
}

async function fetchBinanceData(id: string): Promise<Asset> {
  try {
    const [priceResponse, dayStatsResponse] = await Promise.all([
      axios.get(`${BINANCE_API_URL}/ticker/price`, {
        params: { symbol: `${id}USDT` },
      }),
      axios.get(`${BINANCE_API_URL}/ticker/24hr`, {
        params: { symbol: `${id}USDT` },
      }),
    ]);

    const asset = sanitizeAssetData({
      id,
      symbol: id,
      name: id,
      type: 'crypto',
      currentPrice: parseFloat(priceResponse.data.price),
      priceChange24h: parseFloat(dayStatsResponse.data.priceChangePercent),
      lastUpdated: new Date().toISOString(),
    });

    if (!validateAsset(asset)) {
      throw new Error('Invalid asset data');
    }

    return asset;
  } catch (error) {
    throw new ApiError(
      error.message,
      error.response?.status?.toString() || 'UNKNOWN',
      'BINANCE'
    );
  }
}