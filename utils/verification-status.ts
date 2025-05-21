/**
 * Verification Status Utilities
 * 
 * Simplified helper functions for managing verification state
 */

// Simplified function to check verification status with the server
export const checkServerVerificationStatus = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const response = await fetch('http://127.0.0.1:5000/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
      if (response.ok) {
      const userData = await response.json();
      // Check both verification fields that the API might provide
      if (userData.user && (userData.user.is_verified === true || userData.user.email_verified === true)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking verification status:", error);
    return false;
  }
};

// Update user verification status in localStorage based on server response
export const updateUserVerificationStatus = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  // Check with server
  const isVerified = await checkServerVerificationStatus();
    // Update localStorage if user exists
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      // Update both verification fields for consistency
      user.is_verified = isVerified;
      user.email_verified = isVerified; 
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error("Error updating user verification status:", error);
    }
  }
  
  return isVerified;
};

// For backward compatibility
export const syncVerificationStatus = updateUserVerificationStatus;

// Reset temporary verification data but preserve user information
export const resetVerificationState = (): void => {
  if (typeof window === 'undefined') return;
  
  // Only clear verification session data - NOT user data
  sessionStorage.removeItem('verificationEmail');
  sessionStorage.removeItem('verificationToken');
  sessionStorage.removeItem('verificationAttempts');
  
  // Ensure we have userEmail set if it exists in user object but not separately
  const userJson = localStorage.getItem('user');
  
  if (userJson && !localStorage.getItem('userEmail')) {
    try {
      const user = JSON.parse(userJson);
      if (user.email) {
        localStorage.setItem('userEmail', user.email);
      }
    } catch (error) {
      console.error("Error checking user email:", error);
    }
  }
};
