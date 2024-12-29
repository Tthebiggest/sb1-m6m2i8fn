export const API_CONFIG = {
  RETRY_STRATEGY: {
    MAX_RETRIES: 3,
    BASE_DELAY: 1000,
    MAX_DELAY: 10000,
  },
  RATE_LIMITS: {
    ALPHA_VANTAGE: { requests: 5, window: 60 }, // 5 requests per minute
    YAHOO_FINANCE: { requests: 100, window: 60 }, // 100 requests per minute
    NEWS_API: { requests: 100, window: 60 }, // 100 requests per minute
  },
  CACHE: {
    TTL: 5 * 60 * 1000, // 5 minutes
    STALE_WHILE_REVALIDATE: 60 * 1000, // 1 minute
  },
} as const;