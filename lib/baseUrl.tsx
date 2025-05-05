// Base URL for API requests
export const baseUrl = "http://127.0.0.1:5000/api";

// API endpoints
export const endpoints = {
  // Authentication
  signup: `${baseUrl}/auth/signup`,
  login: `${baseUrl}/auth/login`,
  changeRole: `${baseUrl}/auth/change-role`,

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

// Helper function for API requests
export const apiRequest = {
  get: async (url: string) => {
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },
  
  post: async (url: string, data: any) => {
    const response = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },
  
  put: async (url: string, data: any) => {
    const response = await fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },
  
  delete: async (url: string) => {
    const response = await fetchWithAuth(url, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }
};