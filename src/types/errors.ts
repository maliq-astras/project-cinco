export interface StandardErrorResponse {
  error: string;
  code: string;
  details?: any;
  retryable: boolean;
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR', 
  DATABASE_TIMEOUT: 'DATABASE_TIMEOUT',
  RATE_LIMIT: 'RATE_LIMIT',
  NOT_FOUND: 'NOT_FOUND',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];