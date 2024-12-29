export const API_CONFIGS = {
  ALPHA_VANTAGE: {
    maxRequests: 5,
    timeWindow: 60000, // 1 minute
    baseUrl: 'https://www.alphavantage.co/query',
  },
  COINGECKO: {
    maxRequests: 50,
    timeWindow: 60000,
    baseUrl: 'https://api.coingecko.com/api/v3',
  },
  YAHOO_FINANCE: {
    maxRequests: 100,
    timeWindow: 60000,
    baseUrl: 'https://query1.finance.yahoo.com/v8/finance/chart',
  },
  COINCAP: {
    maxRequests: 100,
    timeWindow: 60000,
    baseUrl: 'https://api.coincap.io/v2',
  },
} as const;