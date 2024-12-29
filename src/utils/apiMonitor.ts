interface ApiStatus {
  isHealthy: boolean;
  lastCheck: number;
  failureCount: number;
  responseTime: number;
}

export class ApiMonitor {
  private static instance: ApiMonitor;
  private statuses: Map<string, ApiStatus> = new Map();
  private healthCheckInterval: number = 60000; // 1 minute
  private maxFailures: number = 3;

  private constructor() {
    setInterval(() => this.runHealthChecks(), this.healthCheckInterval);
  }

  static getInstance(): ApiMonitor {
    if (!ApiMonitor.instance) {
      ApiMonitor.instance = new ApiMonitor();
    }
    return ApiMonitor.instance;
  }

  registerApi(apiName: string) {
    this.statuses.set(apiName, {
      isHealthy: true,
      lastCheck: Date.now(),
      failureCount: 0,
      responseTime: 0,
    });
  }

  recordSuccess(apiName: string, responseTime: number) {
    const status = this.statuses.get(apiName);
    if (status) {
      status.isHealthy = true;
      status.failureCount = 0;
      status.responseTime = responseTime;
      status.lastCheck = Date.now();
    }
  }

  recordFailure(apiName: string) {
    const status = this.statuses.get(apiName);
    if (status) {
      status.failureCount++;
      if (status.failureCount >= this.maxFailures) {
        status.isHealthy = false;
      }
      status.lastCheck = Date.now();
    }
  }

  isHealthy(apiName: string): boolean {
    return this.statuses.get(apiName)?.isHealthy ?? false;
  }

  getAverageResponseTime(apiName: string): number {
    return this.statuses.get(apiName)?.responseTime ?? 0;
  }

  private async runHealthChecks() {
    // Implement health check logic here
    this.statuses.forEach((status, apiName) => {
      if (!status.isHealthy && Date.now() - status.lastCheck > this.healthCheckInterval * 2) {
        status.failureCount = 0;
        status.isHealthy = true;
      }
    });
  }
}