// Base URL for API requests
export const baseUrl = "http://127.0.0.1:5000/api";

// API endpoints
export const endpoints = {
  // Authentication
  signup: `${baseUrl}/auth/signup`,
  login: `${baseUrl}/auth/login`,
  changeRole: `${baseUrl}/auth/change-role`,
  verifyEmail: `${baseUrl}/auth/verify-email`,
  verifyEmailToken: (token: string) => `${baseUrl}/auth/verify-email-token/${token}`,
  directVerifyToken: (token: string) => `${baseUrl}/auth/direct-verify-token/${token}`,
  resendVerification: `${baseUrl}/auth/resend-verification`,
  forgotPassword: `${baseUrl}/auth/forgot-password`,
  resetPassword: `${baseUrl}/auth/reset-password`,

  // Tests
  getAllTests: `${baseUrl}/tests`,
  getTestById: (testId: number | string) => `${baseUrl}/tests/${testId}`,
  createTest: `${baseUrl}/tests`,
  updateTest: (testId: number | string) => `${baseUrl}/tests/${testId}`,
  deleteTest: (testId: number | string) => `${baseUrl}/tests/${testId}`,

  // Questions
  getQuestions: `${baseUrl}/questions`,
  getQuestionById: (questionId: number | string) => `${baseUrl}/questions/${questionId}`,
  createQuestion: `${baseUrl}/questions`,
  updateQuestion: (questionId: number | string) => `${baseUrl}/questions/${questionId}`,
  deleteQuestion: (questionId: number | string) => `${baseUrl}/questions/${questionId}`,

  // Attempts
  createAttempt: `${baseUrl}/attempts`,
  submitAttempt: (attemptId: number | string) => `${baseUrl}/attempts/${attemptId}/submit`,
  getAttempts: `${baseUrl}/attempts`,
  getAttemptById: (attemptId: number | string) => `${baseUrl}/attempts/${attemptId}`,
  getUserHistory: `${baseUrl}/user/history`,
  getUserHistoryAdmin: (userId: number | string) => `${baseUrl}/user/history/admin/${userId}`,
  getAttemptQuestions: (attemptId: number | string) => `${baseUrl}/attempts/${attemptId}/questions`,
  answerQuestions: (attemptId: number | string) => `${baseUrl}/attempts/${attemptId}/answer`,

  // Responses
  createResponse: `${baseUrl}/responses`,
  getAttemptResponses: (attemptId: number | string) => `${baseUrl}/attempts/${attemptId}/responses`,

  // Study Materials
  getAllStudyMaterials: `${baseUrl}/study-materials`,
  getStudyMaterialById: `${baseUrl}/study-materials/`,
  getStudyMaterialContent: `${baseUrl}/study-materials/`,
  downloadStudyMaterial: `${baseUrl}/study-materials/`,
  createStudyMaterial: `${baseUrl}/study-materials`,
  updateStudyMaterial: (materialId: number | string) => `${baseUrl}/study-materials/${materialId}`,
  deleteStudyMaterial: (materialId: number | string) => `${baseUrl}/study-materials/${materialId}`,
  getMaterialTypes: `${baseUrl}/study-materials/types`,
  getSubjects: `${baseUrl}/study-materials/subjects`,

  // Analytics
  getUserAnalytics: `${baseUrl}/user/analytics`,
  getDetailedUserAnalytics: `${baseUrl}/user/analytics/detailed`,
  getSubjectAnalytics: (subject: string) => `${baseUrl}/user/analytics/subject/${subject}`,
  getWeakAreasAnalytics: `${baseUrl}/user/analytics/weak-areas`,
  getProgressAnalytics: `${baseUrl}/user/analytics/progress`,
  getAdminAnalytics: `${baseUrl}/admin/analytics`,
  
  // AI Assistant
  askAssistant: `${baseUrl}/study-plan/ask-assistant`,

  // Study Plans
  generateStudyPlan: `${baseUrl}/study-plan/generate`,
  getUserStudyPlans: `${baseUrl}/study-plan/user-plans`,
  getAllStudyPlans: `${baseUrl}/study-plan/plans`,
  getStudyPlanById: (planId: number | string) => `${baseUrl}/study-plan/plans/${planId}`,
  deleteStudyPlan: (planId: number | string) => `${baseUrl}/study-plan/plans/${planId}`,
};

// Helper function to fetch data with authorization header
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  return response;
};

// Import the error handling utility
import { parseApiError } from '@/utils/api-error';

// Helper function for API requests
export const apiRequest = {
  get: async (url: string) => {
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      const errorMessage = await parseApiError(response);
      throw new Error(errorMessage);
    }
    return response.json();
  },
  
  post: async (url: string, data: any) => {
    const response = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorMessage = await parseApiError(response);
      throw new Error(errorMessage);
    }
    return response.json();
  },
  
  put: async (url: string, data: any) => {
    const response = await fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorMessage = await parseApiError(response);
      throw new Error(errorMessage);
    }
    return response.json();
  },
  
  delete: async (url: string) => {
    const response = await fetchWithAuth(url, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorMessage = await parseApiError(response);
      throw new Error(errorMessage);
    }
    return response.json();  },// Email verification method
  verifyEmail: async (token: string, email?: string) => {
    console.log("Verifying email with token:", token, "email:", email);
    
    try {
      // Try to get email from localStorage if not provided in parameters
      if (!email && typeof window !== 'undefined') {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
          console.log("Using email from localStorage:", storedEmail);
          email = storedEmail;
        }
      }
      
      // First try to use the token-only endpoint if email is not available
      if (!email) {
        console.log("Attempting token-only verification");
        const tokenOnlyUrl = `http://127.0.0.1:5000/api/auth/verify-email-token/${token}`;
        const tokenOnlyResponse = await fetch(tokenOnlyUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log("Token-only verification response status:", tokenOnlyResponse.status);
        
        // If token-only verification worked, return the result
        if (tokenOnlyResponse.ok) {
          const result = await tokenOnlyResponse.json();
          console.log("Token-only verification successful:", result);
          
          // Ensure user object has is_verified set to true for consistency
          if (result.user) {
            result.user.is_verified = true;
          }
          
          return result;
        }
        
        // If token-only verification didn't work, continue with email+token verification
        console.log("Token-only verification failed, trying with email+token");
      }
      
      // Prepare request body based on available data
      const requestBody: { token: string; email?: string } = { token };
      if (email) {
        requestBody.email = email;
      }
      
      // Use the full URL to ensure we're hitting the backend directly, not Next.js API routes
      const backendUrl = "http://127.0.0.1:5000/api/auth/verify-email";      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      // Log response details for debugging
      console.log("Verification response status:", response.status);
        if (!response.ok) {
        const errorMessage = await parseApiError(response);
        console.error("Verification API error:", errorMessage);
        
        // Check if the error is specifically about missing email
        let errorObj: any = new Error(errorMessage);
        
        // Check if the error is related to missing email
        if (errorMessage.toLowerCase().includes('email') && 
            errorMessage.toLowerCase().includes('required') ||
            !email) {
          errorObj = new Error(`Missing email: Email is required for verification but was not provided`);
          errorObj.missingEmail = true;
        }
        
        throw errorObj;
      }
        const result = await response.json();
      
      // Ensure user object has is_verified set to true for consistency
      if (result.user) {
        result.user.is_verified = true;
      }
      
      return result;
    } catch (error: any) {
      console.error("Email verification error:", error);
      
      // Enhance error object with additional information if needed
      if (error.message?.includes('email') || 
          error.message?.toLowerCase().includes('required') || 
          !email) {
        error.missingEmail = true;
      }
      
      throw error;
    }
  },
  
  // Resend verification email
  resendVerification: async (email: string) => {
    try {
      // Use the full URL to ensure we're hitting the backend directly, not Next.js API routes
      const backendUrl = "http://127.0.0.1:5000/api/auth/resend-verification";
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
        if (!response.ok) {
        const errorMessage = await parseApiError(response);
        console.error("Resend verification error:", errorMessage);
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Resend verification error:", error);
      throw error;
    }
  },
  
  // Request password reset
  forgotPassword: async (email: string) => {
    try {
      // Use the full URL to ensure we're hitting the backend directly, not Next.js API routes
      const backendUrl = "http://127.0.0.1:5000/api/auth/forgot-password";
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
        if (!response.ok) {
        const errorMessage = await parseApiError(response);
        console.error("Forgot password error:", errorMessage);
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },
  
  // Reset password with token
  resetPassword: async (email: string, token: string, newPassword: string) => {
    try {
      // Use the full URL to ensure we're hitting the backend directly, not Next.js API routes
      const backendUrl = "http://127.0.0.1:5000/api/auth/reset-password";
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          new_password: newPassword
        })
      });
        if (!response.ok) {
        const errorMessage = await parseApiError(response);
        console.error("Reset password error:", errorMessage);
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }
};