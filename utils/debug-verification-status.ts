/**
 * Email Verification Status Debug Utility
 * 
 * This script can be included in any page to help debug verification issues.
 * Include this script on pages where verification issues are occurring.
 */

export function debugVerificationStatus() {
  if (typeof window === 'undefined') return;
  
  // Get all verification-related items from localStorage
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const userEmail = localStorage.getItem('userEmail');
  
  let user = null;
  try {
    if (userJson) {
      user = JSON.parse(userJson);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  
  // Log the verification status information
  console.group('🔍 Verification Status Debug');
  console.log('Token exists:', !!token);
  console.log('User exists:', !!user);
  console.log('Email stored:', userEmail);
  
  if (user) {
    console.log('User verification status:', user.is_verified);
    console.log('User object:', user);
  }
  
  // Check sessionStorage for verification data
  console.group('SessionStorage Verification Data');
  console.log('verificationEmail:', sessionStorage.getItem('verificationEmail'));
  console.log('verificationToken:', sessionStorage.getItem('verificationToken'));
  console.log('verificationAttempts:', sessionStorage.getItem('verificationAttempts'));
  console.groupEnd();
  
  // Check if verification state is inconsistent
  if (user && token) {
    if (user.is_verified === false) {
      console.warn('⚠️ User is logged in but marked as unverified in localStorage');
    }
  }
  console.groupEnd();
  
  // Return debug info for use in UI if needed
  return {
    hasToken: !!token,
    hasUser: !!user,
    isVerified: user?.is_verified || false,
    email: userEmail || user?.email || null,
    sessionData: {
      verificationEmail: sessionStorage.getItem('verificationEmail'),
      verificationToken: sessionStorage.getItem('verificationToken'),
      verificationAttempts: sessionStorage.getItem('verificationAttempts')
    }
  };
}

// To call this function when debugging, add this to your component:
// useEffect(() => { debugVerificationStatus(); }, []);
