import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../types';
import { ApiMonitor } from './apiMonitor';
import { API_CONFIG } from './apiConfig';
import { calculateBackoff } from './apiUtils';
import { ApiError, RateLimitError } from './errors';

const apiMonitor = ApiMonitor.getInstance();

export async function fetchWithRetry<T>(
  primaryFn: () => Promise<T>,
  fallbackFns: Array<() => Promise<T>>,
  cacheKey: string
): Promise<ApiResponse<T>> {
  // Check cache first
  const cached = getCachedData<T>(cacheKey);
  if (cached) {
    return { data: cached, source: 'cache', timestamp: Date.now() };
  }

  // Try primary source with retries
  for (let attempt = 0; attempt < API_CONFIG.RETRY_STRATEGY.MAX_RETRIES; attempt++) {
    try {
      const startTime = Date.now();
      const data = await primaryFn();
      
      apiMonitor.recordSuccess('primary', Date.now() - startTime);
      cacheData(cacheKey, data);
      
      return { data, source: 'primary', timestamp: Date.now() };
    } catch (error) {
      apiMonitor.recordFailure('primary');

      if (error instanceof RateLimitError || attempt === API_CONFIG.RETRY_STRATEGY.MAX_RETRIES - 1) {
        break;
      }

      await delay(calculateBackoff(attempt));
    }
  }

  // Try each fallback source
  for (const [index, fallbackFn] of fallbackFns.entries()) {
    try {
      const startTime = Date.now();
      const data = await fallbackFn();
      
      apiMonitor.recordSuccess(`fallback_${index}`, Date.now() - startTime);
      cacheData(cacheKey, data);
      
      return { data, source: 'fallback', timestamp: Date.now() };
    } catch (error) {
      apiMonitor.recordFailure(`fallback_${index}`);
      continue;
    }
  }

  throw new Error('All data sources failed');
}

function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > API_CONFIG.CACHE.TTL) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function cacheData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Failed to cache data:', error);
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));