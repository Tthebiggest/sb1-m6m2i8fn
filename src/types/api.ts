export interface AlphaVantageResponse {
  'Global Quote': {
    '01. symbol': string;
    '05. price': string;
    '09. change': string;
    '07. latest trading day': string;
  };
}

export interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        symbol: string;
        regularMarketPrice: number;
        previousClose: number;
        regularMarketTime: number;
      };
    }>;
  };
}

export interface ApiError {
  code: string;
  message: string;
  source?: string;
}