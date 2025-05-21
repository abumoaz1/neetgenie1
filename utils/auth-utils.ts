/**
 * Authentication Utilities
 * Helper functions for authentication, user management, and verification
 */

/**
 * Updates user information in localStorage with explicit verification status handling
 * @param user The user object from the API response
 * @returns The updated user object
 */
export const updateUserInLocalStorage = (user: any) => {
  if (!user) return null;
  
  try {
    // Ensure is_verified property exists and is a boolean
    const updatedUser = {
      ...user,
      is_verified: user.is_verified === true
    };
    
    // Store updated user in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log("Updated user in localStorage with verification status:", updatedUser.is_verified);
    
    return updatedUser;
  } catch (error) {
    console.error("Error updating user in localStorage:", error);
    return user;
  }
};

/**
 * Gets user information from localStorage with verification status check
 */
export const getUserFromLocalStorage = () => {
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    return user;
  } catch (error) {
    console.error("Error getting user from localStorage:", error);
    return null;
  }
};

/**
 * Checks if the user is verified based on localStorage data
 */
export const isUserVerified = () => {
  const user = getUserFromLocalStorage();
  return user?.is_verified === true;
};

/**
 * Logs out the user by clearing localStorage data
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Keep userEmail for convenience in case they need to log back in
};