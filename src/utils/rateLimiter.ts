import { RateLimitError } from './api';

interface RateLimit {
  maxRequests: number;
  timeWindow: number; // in milliseconds
  requests: number;
  windowStart: number;
}

class RateLimiter {
  private limits: Map<string, RateLimit> = new Map();
  private subscribers: ((usage: number) => void)[] = [];

  constructor() {
    // Reset counters periodically
    setInterval(() => this.cleanupExpiredWindows(), 60000);
  }

  configure(api: string, maxRequests: number, timeWindow: number) {
    this.limits.set(api, {
      maxRequests,
      timeWindow,
      requests: 0,
      windowStart: Date.now(),
    });
  }

  async checkLimit(api: string): Promise<void> {
    const limit = this.limits.get(api);
    if (!limit) return;

    const now = Date.now();
    if (now - limit.windowStart > limit.timeWindow) {
      // Reset window
      limit.requests = 0;
      limit.windowStart = now;
    }

    if (limit.requests >= limit.maxRequests) {
      throw new RateLimitError(`Rate limit exceeded for ${api}`);
    }

    limit.requests++;
    this.notifySubscribers(api);
  }

  getUsagePercentage(api: string): number {
    const limit = this.limits.get(api);
    if (!limit) return 0;
    return (limit.requests / limit.maxRequests) * 100;
  }

  onUsageUpdate(callback: (usage: number) => void) {
    this.subscribers.push(callback);
  }

  private notifySubscribers(api: string) {
    const usage = this.getUsagePercentage(api);
    this.subscribers.forEach(callback => callback(usage));
  }

  private cleanupExpiredWindows() {
    const now = Date.now();
    this.limits.forEach((limit, api) => {
      if (now - limit.windowStart > limit.timeWindow) {
        limit.requests = 0;
        limit.windowStart = now;
      }
    });
  }
}