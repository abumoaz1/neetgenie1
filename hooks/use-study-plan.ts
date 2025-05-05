"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/baseUrl";
import { useStudyPlans, StudyPlanData } from "@/store/study-plans";

// Define the types for the study plan request and response
interface StudyPlanRequest {
  exam_name: string;
  days_left: number;
  study_hours_per_day: number;
  weak_topics?: string[];
  strong_topics?: string[];
}

interface StudyPlanResponse {
  success: boolean;
  study_plan: {
    overview: {
      exam_name: string;
      duration_days: number;
      study_hours_per_day: number;
      weak_topics: string[];
      strong_topics: string[];
    };
    daily_schedule: {
      morning: {
        duration: string;
        focus: string;
      };
      midday: {
        duration: string;
        focus: string;
      };
      afternoon: {
        duration: string;
        focus: string;
      };
    };
    key_principles: string[];
    important_notes: string[];
    resources: {
      essential: string[];
      reference: string[];
      practice: string[];
      online: string[];
    };
    weekly_plans: Array<{
      week_number: number;
      title: string;
      goal: string;
      days: Array<{
        day_number: number;
        subject: string;
        topic: string;
        activities: string;
        resources: string;
      }>;
    }>;
    final_advice: string;
  };
  plan_id: number; // Backend API provides a plan_id as integer
}

// API response for getting a specific plan by ID
interface StudyPlanByIdResponse {
  success: boolean;
  plan: {
    id: number;
    user_id: number;
    exam_name: string;
    days_left: number;
    plan_data: {
      overview: {
        exam_name: string;
        duration_days: number;
        study_hours_per_day: number;
        weak_topics: string[];
        strong_topics: string[];
      };
      daily_schedule: {
        morning: { duration: string; focus: string };
        midday: { duration: string; focus: string };
        afternoon: { duration: string; focus: string };
      };
      key_principles: string[];
      important_notes: string[];
      resources: {
        essential: string[];
        reference: string[];
        practice: string[];
        online: string[];
      };
      weekly_plans: Array<{
        week_number: number;
        title: string;
        goal: string;
        days: Array<{
          day_number: number;
          subject: string;
          topic: string;
          activities: string;
          resources: string;
        }>;
      }>;
      final_advice: string;
    };
    created_at: string;
  };
}

// API response for getting all plans
interface StudyPlansListResponse {
  success: boolean;
  plans: Array<{
    id: number;
    user_id: number;
    exam_name: string;
    days_left: number;
    study_hours_per_day: number;
    weak_topics: string[];
    strong_topics: string[];
    plan_data: {
      overview: {
        exam_name: string;
        duration_days: number;
        study_hours_per_day: number;
        weak_topics: string[];
        strong_topics: string[];
      };
      daily_schedule: {
        morning: { duration: string; focus: string };
        midday: { duration: string; focus: string };
        afternoon: { duration: string; focus: string };
      };
      key_principles: string[];
      important_notes: string[];
      resources: {
        essential: string[];
        reference: string[];
        practice: string[];
        online: string[];
      };
      weekly_plans: Array<{
        week_number: number;
        title: string;
        goal: string;
        days: Array<{
          day_number: number;
          subject: string;
          topic: string;
          activities: string;
          resources: string;
        }>;
      }>;
      final_advice: string;
    };
    created_at: string;
  }>;
  count: number;
}

export function useStudyPlan() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addPlan, setSelectedPlanId, setPlans } = useStudyPlans();
  const router = useRouter();

  const generateStudyPlan = async (data: StudyPlanRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await fetch(`${baseUrl}/study-plan/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        // Handle specific status codes with appropriate messages
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again.");
        } else if (response.status === 403) {
          throw new Error("Forbidden: You don't have permission to perform this action.");
        } else if (response.status === 404) {
          throw new Error("Resource not found. Please try again later.");
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error ${response.status}: Failed to generate study plan`);
        }
      }

      const responseData: StudyPlanResponse = await response.json();
      
      if (!responseData.success || !responseData.study_plan) {
        throw new Error("Invalid response from server");
      }
      
      // Convert the plan_id to string for frontend use
      const planId = responseData.plan_id.toString();
      
      // Save the plan to the store
      const newPlan: StudyPlanData = {
        id: planId,
        createdAt: new Date().toISOString(),
        overview: responseData.study_plan.overview,
        daily_schedule: responseData.study_plan.daily_schedule,
        key_principles: responseData.study_plan.key_principles,
        important_notes: responseData.study_plan.important_notes,
        resources: responseData.study_plan.resources,
        weekly_plans: responseData.study_plan.weekly_plans,
        final_advice: responseData.study_plan.final_advice
      };
      
      addPlan(newPlan);
      setSelectedPlanId(planId);
      
      // Navigate to the study plan detail page
      router.push(`/study-plans/${planId}`);
      
      return responseData.study_plan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudyPlanById = async (planId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }
      
      // Use the API endpoint to get a specific study plan by ID
      const response = await fetch(`${baseUrl}/study-plan/plans/${planId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Handle specific status codes with appropriate messages
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again.");
        } else if (response.status === 403) {
          throw new Error("Forbidden: You don't have permission to access this study plan.");
        } else if (response.status === 404) {
          throw new Error("Study plan not found. It may have been deleted.");
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error ${response.status}: Failed to fetch study plan`);
        }
      }
      
      const data: StudyPlanByIdResponse = await response.json();
      
      if (!data.success || !data.plan || !data.plan.plan_data) {
        throw new Error("Invalid study plan data from server");
      }
      
      // Convert the plan to our frontend format
      const plan: StudyPlanData = {
        id: data.plan.id.toString(),
        createdAt: data.plan.created_at,
        overview: data.plan.plan_data.overview,
        daily_schedule: data.plan.plan_data.daily_schedule,
        key_principles: data.plan.plan_data.key_principles,
        important_notes: data.plan.plan_data.important_notes,
        resources: data.plan.plan_data.resources,
        weekly_plans: data.plan.plan_data.weekly_plans,
        final_advice: data.plan.plan_data.final_advice
      };
      
      return plan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudyPlans = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No authentication token found");
        throw new Error("Authentication required. Please log in again.");
      }
      
      // Use the endpoint from baseUrl - no need to extract user ID, backend will handle that
      const response = await fetch(`${baseUrl}/study-plan/plans`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        cache: 'no-store'
      });
      
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        // Try to parse the error response
        try {
          const errorData = await response.json();
          console.error("API error response:", errorData);
          throw new Error(errorData.message || `Error ${response.status}: Failed to fetch study plans`);
        } catch (parseError) {
          // If we can't parse the error as JSON, use the status text
          throw new Error(`Error ${response.status}: ${response.statusText || 'Failed to fetch study plans'}`);
        }
      }
      
      const data = await response.json();
      console.log("Study plans data:", data);
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch study plans");
      }
      
      // Convert plans to frontend format
      const plans: StudyPlanData[] = data.plans.map((plan: any) => ({
        id: plan.id.toString(),
        createdAt: plan.created_at,
        days_left: plan.days_left,
        exam_name: plan.exam_name,
        overview: plan.plan_data.overview,
        daily_schedule: plan.plan_data.daily_schedule,
        key_principles: plan.plan_data.key_principles,
        important_notes: plan.plan_data.important_notes,
        resources: plan.plan_data.resources,
        weekly_plans: plan.plan_data.weekly_plans,
        final_advice: plan.plan_data.final_advice
      }));
      
      // Update the store with the fetched plans
      setPlans(plans);
      
      return plans;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error fetching study plans:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudyPlan = async (planId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }
      
      const response = await fetch(`${baseUrl}/study-plan/plans/${planId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Handle specific status codes with appropriate messages
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again.");
        } else if (response.status === 403) {
          throw new Error("Forbidden: You don't have permission to delete this study plan.");
        } else if (response.status === 404) {
          throw new Error("Study plan not found. It may have been deleted already.");
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error ${response.status}: Failed to delete study plan`);
        }
      }
      
      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generateStudyPlan,
    fetchStudyPlans,
    fetchStudyPlanById,
    deleteStudyPlan
  };
}