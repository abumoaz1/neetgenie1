import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the user ID from a JWT token
 * @param token JWT token string
 * @returns The user ID or null if the token is invalid
 */
export function getUserIdFromToken(token: string): string | null {
  try {
    // JWT tokens are in format: header.payload.signature
    const payload = token.split('.')[1];
    if (!payload) return null;
    
    // Decode the base64 payload
    const decodedPayload = JSON.parse(atob(payload));
    
    // The user ID might be in different fields depending on your JWT implementation
    // Common fields include: id, sub, userId, user_id
    return decodedPayload.id || decodedPayload.sub || decodedPayload.userId || decodedPayload.user_id || null;
  } catch (error) {
    console.error("Error parsing JWT token:", error);
    return null;
  }
}
