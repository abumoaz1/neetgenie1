import { useState, useEffect } from 'react';
import { endpoints, apiRequest } from '@/lib/baseUrl';

// Types for the analytics data responses
export interface UserAnalytics {
  overall_stats: {
    progress_percentage: number;
    progress_change: number;
    tests_completed: number;
    total_tests: number;
    study_time_hours: number;
    weak_areas_count: number;
  };
  performance: {
    weekly_trends: Array<{
      date: string;
      physics: number;
      biology: number;
      chemistry?: number;
    }>;
    subject_scores: Array<{
      subject: string;
      score: number;
      fullMark: number;
    }>;
    time_distribution: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    weak_areas: Array<{
      topic: string;
      score: number;
      subject: string;
    }>;
  };
}

export interface DetailedAnalyticsData {
  overview: {
    overall_score: number;
    tests_completed: number;
    total_study_time: number;
    recent_improvement: number;
    strengths: string[];
    weaknesses: string[];
  };
  performance_trends: {
    monthly_data: Array<{
      month: string;
      physics: number;
      chemistry: number;
      biology: number;
      overall: number;
    }>;
    by_difficulty: Array<{
      difficulty: string;
      score: number;
      count: number;
    }>;
  };
  subject_analysis: {
    radar_data: Array<{
      subject: string;
      score: number;
      average: number;
    }>;
    sub_topics: Record<string, Array<{
      name: string;
      mastery: number;
      questions_attempted: number;
      time_spent: number;
    }>>;
  };
  time_metrics: {
    average_time_per_question: Record<string, number>;
    time_distribution: Array<{
      activity: string;
      hours: number;
      percentage: number;
      color: string;
    }>;
    efficiency_score: number;
  };
  weak_areas: Array<{
    topic: string;
    subtopic: string;
    score: number;
    recommended_resources: Array<{
      title: string;
      type: string;
      link: string;
    }>;
  }>;
  progress: {
    weekly_progress: Array<{
      week: string;
      progress: number;
      target: number;
    }>;
    milestones: Array<{
      title: string;
      completed: boolean;
      date?: string;
    }>;
  };
}

export interface AnalyticsState {
  basicAnalytics: UserAnalytics | null;
  detailedAnalytics: DetailedAnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isAuthenticated: boolean | null;
}

export function useAnalytics(): AnalyticsState {
  const [basicAnalytics, setBasicAnalytics] = useState<UserAnalytics | null>(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState<DetailedAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
      }
    };
    
    checkAuthStatus();
    
    // Listen for storage events (for multi-tab support)
    window.addEventListener('storage', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const fetchAnalyticsData = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch basic analytics for dashboard
      const basicData = await apiRequest.get(endpoints.getUserAnalytics);
      setBasicAnalytics(basicData);
      
      try {
        // Fetch detailed analytics
        const detailedData = await apiRequest.get(endpoints.getDetailedUserAnalytics);
        setDetailedAnalytics(detailedData);
      } catch (detailedErr) {
        console.error("Error fetching detailed analytics:", detailedErr);
        // We only set the error if both requests fail
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data. Please try again later.");
      setIsLoading(false);
    }
  };

  // Only fetch data when authentication status is confirmed
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalyticsData();
    } else if (isAuthenticated === false) {
      // If definitely not authenticated, stop loading
      setIsLoading(false);
    }
    // We only run this effect when authentication state changes
  }, [isAuthenticated]);

  return {
    basicAnalytics,
    detailedAnalytics,
    isLoading,
    error,
    refetch: fetchAnalyticsData,
    isAuthenticated
  };
}