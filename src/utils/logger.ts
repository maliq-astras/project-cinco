export interface LogContext {
  component?: string;
  operation?: string;
  attempt?: number;
  error?: any;
  [key: string]: any;
}

export const logger = {
  error: (message: string, context?: LogContext) => {
    const prefix = context?.component ? `[${context.component}]` : '[ERROR]';
    console.error(`${prefix} ${message}`, context);
  },
  warn: (message: string, context?: LogContext) => {
    const prefix = context?.component ? `[${context.component}]` : '[WARN]';
    console.warn(`${prefix} ${message}`, context);
  },
  info: (message: string, context?: LogContext) => {
    const prefix = context?.component ? `[${context.component}]` : '[INFO]';
    console.log(`${prefix} ${message}`, context);
  }
};