import { API_CONFIG } from './apiConfig';
import { RateLimitError } from './errors';

interface RateLimitTracker {
  requests: number;
  windowStart: number;
}

const rateLimiters = new Map<string, RateLimitTracker>();

export function checkRateLimit(api: keyof typeof API_CONFIG.RATE_LIMITS): void {
  const limits = API_CONFIG.RATE_LIMITS[api];
  const tracker = rateLimiters.get(api) || { requests: 0, windowStart: Date.now() };
  
  // Reset window if expired
  if (Date.now() - tracker.windowStart > limits.window * 1000) {
    tracker.requests = 0;
    tracker.windowStart = Date.now();
  }

  if (tracker.requests >= limits.requests) {
    throw new RateLimitError(`Rate limit exceeded for ${api}`);
  }

  tracker.requests++;
  rateLimiters.set(api, tracker);
}

export function calculateBackoff(attempt: number): number {
  const delay = Math.min(
    API_CONFIG.RETRY_STRATEGY.BASE_DELAY * Math.pow(2, attempt),
    API_CONFIG.RETRY_STRATEGY.MAX_DELAY
  );
  return delay + Math.random() * 1000; // Add jitter
}