import { NextResponse } from 'next/server';
import { ERROR_CODES, type ErrorCode, type StandardErrorResponse } from '@/types/errors';

export const createErrorResponse = (
  message: string,
  code: ErrorCode,
  status: number,
  details?: any,
  retryable: boolean = false
): NextResponse => {
  const errorResponse: StandardErrorResponse = {
    error: message,
    code,
    details,
    retryable
  };
  
  return NextResponse.json(errorResponse, { status });
};

// Standard error responses
export const createValidationErrorResponse = (details: string[]) =>
  createErrorResponse(
    'Validation failed',
    ERROR_CODES.VALIDATION_ERROR,
    400,
    details,
    false
  );

export const createNotFoundResponse = (resource: string) =>
  createErrorResponse(
    `${resource} not found`,
    ERROR_CODES.NOT_FOUND,
    404,
    null,
    false
  );

export const createServiceUnavailableResponse = (message: string = 'Service unavailable - please try again') =>
  createErrorResponse(
    message,
    ERROR_CODES.SERVICE_UNAVAILABLE,
    503,
    null,
    true
  );

export const createInternalErrorResponse = (message: string = 'Internal server error') =>
  createErrorResponse(
    message,
    ERROR_CODES.INTERNAL_ERROR,
    500,
    null,
    false
  );