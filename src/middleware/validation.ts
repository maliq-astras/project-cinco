// src/middleware/validation.ts
import { NextResponse } from 'next/server';

export interface ValidationRules {
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  required?: boolean;
  maxArrayLength?: number;
}

export function validateInput(value: unknown, rules: ValidationRules): string | null {
  if (rules.required && (!value || value === '')) {
    return 'Field is required';
  }

  if (typeof value === 'string') {
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Input too long (max ${rules.maxLength} characters)`;
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `Input too short (min ${rules.minLength} characters)`;
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid input format';
    }
  }

  if (Array.isArray(value)) {
    if (rules.maxArrayLength && value.length > rules.maxArrayLength) {
      return `Too many items (max ${rules.maxArrayLength})`;
    }
    
    // Validate each item in array
    for (const item of value) {
      if (typeof item === 'string' && rules.maxLength && item.length > rules.maxLength) {
        return `Array item too long (max ${rules.maxLength} characters)`;
      }
    }
  }

  return null; // Valid
}

export function createValidationResponse(errors: string[]) {
  return NextResponse.json(
    { error: 'Validation failed', details: errors },
    { status: 400 }
  );
}

// Common validation rules
export const VALIDATION_RULES = {
  challengeId: {
    required: true,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\-_]+$/ // Only alphanumeric, hyphens, underscores
  },
  guess: {
    required: true,
    maxLength: 200, // Reasonable max for game answers
    minLength: 1
  },
  language: {
    maxLength: 5,
    pattern: /^[a-z]{2}(-[A-Z]{2})?$/ // e.g., 'en', 'es', 'en-US'
  },
  previousGuesses: {
    maxArrayLength: 10, // Max 10 previous guesses
    maxLength: 200 // Each guess max 200 chars
  }
};
