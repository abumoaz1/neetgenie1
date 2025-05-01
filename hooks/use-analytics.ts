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
}

export function useAnalytics(): AnalyticsState {
  const [basicAnalytics, setBasicAnalytics] = useState<UserAnalytics | null>(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState<DetailedAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
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

  // Initial fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return {
    basicAnalytics,
    detailedAnalytics,
    isLoading,
    error,
    refetch: fetchAnalyticsData
  };
}