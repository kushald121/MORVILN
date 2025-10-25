import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  type: 'network' | 'server' | 'client' | 'validation' | 'unknown';
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Network error (no response from server)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Server responded with error
    if (error.response) {
      const data = error.response.data;
      
      // Check for structured error response
      if (data?.message) {
        return data.message;
      }
      
      // Check for validation errors
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0] as string;
        }
      }
      
      // Fallback to status text
      return error.response.statusText || 'An error occurred';
    }
    
    // Request was made but no response
    if (error.request) {
      return 'No response from server. Please try again later.';
    }
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Unknown error type
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Parse error into structured ApiError object
 */
export function parseError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    // Network error
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return {
        message: 'Unable to connect to server. Please check your internet connection.',
        type: 'network',
      };
    }

    // Server error response
    if (error.response) {
      const { status, data } = error.response;

      // Validation error (422)
      if (status === 422 && data?.errors) {
        return {
          message: data.message || 'Validation failed',
          statusCode: status,
          errors: data.errors,
          type: 'validation',
        };
      }

      // Unauthorized (401)
      if (status === 401) {
        return {
          message: data?.message || 'Authentication required. Please log in.',
          statusCode: status,
          type: 'client',
        };
      }

      // Forbidden (403)
      if (status === 403) {
        return {
          message: data?.message || 'You do not have permission to perform this action.',
          statusCode: status,
          type: 'client',
        };
      }

      // Not found (404)
      if (status === 404) {
        return {
          message: data?.message || 'The requested resource was not found.',
          statusCode: status,
          type: 'client',
        };
      }

      // Server error (5xx)
      if (status >= 500) {
        return {
          message: data?.message || 'Server error. Please try again later.',
          statusCode: status,
          type: 'server',
        };
      }

      // Other client errors (4xx)
      return {
        message: data?.message || 'Request failed. Please check your input.',
        statusCode: status,
        type: 'client',
      };
    }

    // Request made but no response
    return {
      message: 'No response from server. The server may be down.',
      type: 'network',
    };
  }

  // Generic error
  if (error instanceof Error) {
    return {
      message: error.message,
      type: 'unknown',
    };
  }

  // Unknown error type
  return {
    message: 'An unexpected error occurred',
    type: 'unknown',
  };
}

/**
 * Log error to console with context
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '[Error]';
  
  if (error instanceof AxiosError) {
    console.error(prefix, {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
  } else if (error instanceof Error) {
    console.error(prefix, error.message, error.stack);
  } else {
    console.error(prefix, error);
  }
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.code === 'ERR_NETWORK' || !error.response;
  }
  return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 422;
  }
  return false;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = isNetworkError,
  } = options;

  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if we've exhausted attempts
      if (attempt === maxRetries) {
        break;
      }
      
      // Don't retry if error doesn't meet retry criteria
      if (!shouldRetry(error)) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      
      console.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors?: Record<string, string[]>): string {
  if (!errors) return '';
  
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
}

/**
 * Handle error with toast notification (requires toast library)
 */
export function handleErrorWithToast(
  error: unknown,
  toast?: (message: string, type: 'error' | 'warning') => void
): void {
  const apiError = parseError(error);
  
  if (toast) {
    const type = apiError.type === 'network' ? 'warning' : 'error';
    toast(apiError.message, type);
  } else {
    console.error(apiError.message);
  }
  
  logError(error);
}
