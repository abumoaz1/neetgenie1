/**
 * Verification Session Manager
 * 
 * Manages email verification data across sessions using localStorage
 * to prevent issues with missing email parameters in verification links
 */

// Store the current verification email
export const storeVerificationEmail = (email: string): void => {
  if (typeof window !== 'undefined' && email) {
    localStorage.setItem('userEmail', email);
    // Also store in session to handle redirects
    sessionStorage.setItem('verificationEmail', email);
    console.log("Stored verification email:", email);
  }
};

// Retrieve the verification email from storage
export const getVerificationEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try session storage first (current verification flow)
  const sessionEmail = sessionStorage.getItem('verificationEmail');
  if (sessionEmail) return sessionEmail;
  
  // Fall back to localStorage (might be from a previous session)
  return localStorage.getItem('userEmail');
};

// Store verification token
export const storeVerificationToken = (token: string): void => {
  if (typeof window !== 'undefined' && token) {
    sessionStorage.setItem('verificationToken', token);
    console.log("Stored verification token for recovery");
  }
};

// Get verification token
export const getVerificationToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('verificationToken');
};

// Track verification attempts to prevent infinite loops
export const trackVerificationAttempt = (): number => {
  if (typeof window === 'undefined') return 0;
  
  const attempts = sessionStorage.getItem('verificationAttempts');
  const currentAttempts = attempts ? parseInt(attempts, 10) : 0;
  const newAttempts = currentAttempts + 1;
  
  sessionStorage.setItem('verificationAttempts', newAttempts.toString());
  console.log(`Verification attempt #${newAttempts}`);
  
  return newAttempts;
};

// Check if we're in a potential verification loop
export const isVerificationLoop = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const attempts = sessionStorage.getItem('verificationAttempts');
  return attempts ? parseInt(attempts, 10) >= 3 : false;
};

// Reset verification attempts counter
export const resetVerificationAttempts = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('verificationAttempts');
  }
};

// Clean up verification session data
export const clearVerificationSession = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('verificationEmail');
    sessionStorage.removeItem('verificationToken');
    sessionStorage.removeItem('verificationAttempts');
  }
};

// Store the entire verification context
export const storeVerificationContext = (
  email: string | null, 
  token: string | null
): void => {
  if (typeof window !== 'undefined') {
    if (email) storeVerificationEmail(email);
    if (token) storeVerificationToken(token);
    trackVerificationAttempt();
  }
};