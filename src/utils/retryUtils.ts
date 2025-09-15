import { RETRY_CONFIG } from '@/constants/timeouts';

export interface RetryConfig {
  attempts: number;
  timeout: number;
  getBackoffDelay: (attempt: number) => number;
}

export const createRetryConfig = (type: 'fast' | 'standard', timeout: number): RetryConfig => ({
  attempts: RETRY_CONFIG[type.toUpperCase() as keyof typeof RETRY_CONFIG] as number,
  timeout,
  getBackoffDelay: (attempt: number) => Math.min(
    RETRY_CONFIG.BASE_DELAY * Math.pow(2, attempt), 
    RETRY_CONFIG.MAX_DELAY
  )
});

export const withRetry = async <T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt < config.attempts; attempt++) {
    try {
      if (attempt > 0) {
        const delay = config.getBackoffDelay(attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === config.attempts - 1) {
        throw lastError;
      }
    }
  }
  
  throw lastError;
};