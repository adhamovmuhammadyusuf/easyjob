/**
 * Utility functions for handling errors in the application
 */

import axios, { AxiosError } from 'axios';

/**
 * Formats API error messages for consistent display
 * 
 * @param error Any error object (typically from axios)
 * @returns Formatted error message
 */
export const formatApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Handle API error responses
    if (axiosError.response) {
      const { data, status } = axiosError.response;
      
      // If the backend returns validation errors (typically as an object)
      if (typeof data === 'object' && data !== null) {
        if ('detail' in data) {
          return String(data.detail);
        }
        
        // For form validation errors that may be nested
        const messages: string[] = [];
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            messages.push(`${key}: ${value.join(', ')}`);
          } else if (value !== null && typeof value === 'object') {
            Object.entries(value as Record<string, any>).forEach(([nestedKey, nestedValue]) => {
              if (Array.isArray(nestedValue)) {
                messages.push(`${key}.${nestedKey}: ${nestedValue.join(', ')}`);
              } else {
                messages.push(`${key}.${nestedKey}: ${String(nestedValue)}`);
              }
            });
          } else {
            messages.push(`${key}: ${String(value)}`);
          }
        });
        
        return messages.join('\n');
      }
      
      // General HTTP error with status code
      return `Error ${status}: ${String(data)}`;
    }
    
    // Network errors
    if (axiosError.request && !axiosError.response) {
      return 'Network error. Please check your internet connection.';
    }
    
    // Other axios errors
    return axiosError.message;
  }
  
  // For non-axios errors
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback for unknown error types
  return 'An unknown error occurred';
};

/**
 * Generic error handler for API calls
 * 
 * @param error Error object from try/catch
 * @param customMessage Optional custom message to display
 * @returns Formatted error message ready to be shown to the user
 */
export const handleApiError = (error: unknown, customMessage?: string): string => {
  console.error('API Error:', error);
  const errorMessage = formatApiError(error);
  return customMessage ? `${customMessage}: ${errorMessage}` : errorMessage;
};
