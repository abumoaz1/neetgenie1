"use client";

import { toast } from "sonner";

/**
 * Error interface that matches backend response format
 */
export interface ApiErrorResponse {
  error?: string;
  message?: string;
  detail?: string;
  status?: number;
}

/**
 * Parses an error response to extract a meaningful message
 */
export const parseApiError = async (response: Response): Promise<string> => {
  let errorMessage = "An unexpected error occurred";
  
  try {
    // Try to parse as JSON first
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json() as ApiErrorResponse;
      
      // Extract the message from various possible fields
      errorMessage = data.message || 
                     data.error || 
                     data.detail || 
                     `Error ${response.status}: ${response.statusText}`;
    } else {
      // If not JSON, try to get text
      const text = await response.text();
      errorMessage = text || `Error ${response.status}: ${response.statusText}`;
    }
  } catch (e) {
    // If parsing fails, use status code
    errorMessage = `Error ${response.status}: ${response.statusText}`;
  }
  
  return errorMessage;
};

/**
 * Handle API errors consistently across the application
 * @param error Any error object
 * @param fallbackMessage Default message if error can't be parsed
 */
export const handleApiError = (error: any, fallbackMessage: string = "An error occurred"): string => {
  console.error("API Error:", error);
  
  let message = fallbackMessage;
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (error && typeof error === "object" && ('message' in error || 'error' in error)) {
    message = (error.message || error.error) as string;
  }
  
  // Clean up error message
  if (message.startsWith("API Error:")) {
    message = message.replace("API Error:", "").trim();
  }
  
  return message;
};

/**
 * Shows a toast notification for API errors
 */
export const showApiError = (error: any, fallbackMessage: string = "An error occurred") => {
  const message = handleApiError(error, fallbackMessage);
  
  toast.error(message, {
    duration: 5000,
    position: "top-center",
  });
  
  return message;
};

/**
 * Shows a toast notification for successful API operations
 */
export const showApiSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "top-center",
  });
  
  return message;
};
