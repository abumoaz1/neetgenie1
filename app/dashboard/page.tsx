"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Target, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Sidebar from "@/components/sidebar";
import { useAnalytics } from "@/hooks/use-analytics";
import ProtectedRoute from "@/components/protected-route";
import { StudyPlanGenerator } from "@/components/study-plan-generator";
import dynamic from "next/dynamic";
import { syncVerificationStatus } from "@/utils/verification-status";

// Use dynamic imports for chart components to ensure they only load client-side
const SubjectBarChart = dynamic(
  () => import("@/components/charts").then((mod) => mod.SubjectBarChart),
  { ssr: false }
);

const TrendLineChart = dynamic(
  () => import("@/components/charts").then((mod) => mod.TrendLineChart),
  { ssr: false }
);

// Fallback data for charts when real data isn't available
const fallbackSubjectData = [
  { subject: "Physics", score: 0 },
  { subject: "Chemistry", score: 0 },
  { subject: "Biology", score: 0 }
];

const fallbackTrendData = [
  { date: "Week 1", physics: 0, chemistry: 0, biology: 0 }
];

export default function DashboardPage() {
  const { basicAnalytics: analytics, isLoading, error, refetch, isAuthenticated } = useAnalytics();
  const [showStudyPlanGenerator, setShowStudyPlanGenerator] = useState(false);
  
  // Content to render inside ProtectedRoute
  const DashboardContent = () => {
    // If still checking authentication or loading data, show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      );
    }
    
    // If there was an error fetching data
    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      );
    }
    
    // If authenticated but no analytics data
    if (isAuthenticated && !analytics) {
      return (
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-center">
          <p>No data available. Start taking tests to see your analytics.</p>
        </div>
      );
    }
    
    // If authenticated and we have analytics data
    if (isAuthenticated && analytics) {
      // Safely extract data for charts with fallbacks
      const subjectScores = analytics.performance?.subject_scores || fallbackSubjectData;
      const weeklyTrends = analytics.performance?.weekly_trends || fallbackTrendData;
      const weakAreas = analytics.performance?.weak_areas || [];
      
      return (
        <>
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Track your NEET preparation progress
              </p>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowStudyPlanGenerator(true)}
            >
              Generate Study Plan
            </Button>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Overall Progress</p>
                    <h3 className="font-semibold text-lg sm:text-xl">{analytics.overall_stats?.progress_percentage || 0}%</h3>
                    <p className="text-xs text-green-500">+{analytics.overall_stats?.progress_change || 0}% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <BookOpen className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Tests Taken</p>
                    <h3 className="font-semibold text-lg sm:text-xl">{analytics.overall_stats?.tests_completed || 0}</h3>
                    <p className="text-xs text-muted-foreground">Out of {analytics.overall_stats?.total_tests || 0} available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Brain className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Weak Areas</p>
                    <h3 className="font-semibold text-lg sm:text-xl">{analytics.overall_stats?.weak_areas_count || 0}</h3>
                    <p className="text-xs text-muted-foreground">Topics needing attention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Study Time</p>
                    <h3 className="font-semibold text-lg sm:text-xl">
                      {analytics.overall_stats?.study_time_hours 
                        ? analytics.overall_stats.study_time_hours.toFixed(1) 
                        : "0"}h
                    </h3>
                    <p className="text-xs text-muted-foreground">Total time spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            {/* Performance by Subject */}
            <Card className="shadow-md">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl">Performance by Subject</CardTitle>
                <CardDescription>Your average scores across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectBarChart data={subjectScores} />
              </CardContent>
            </Card>

            {/* Progress Over Time */}
            <Card className="shadow-md">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl">Progress Over Time</CardTitle>
                <CardDescription>Your performance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendLineChart data={weeklyTrends} />
              </CardContent>
            </Card>
          </div>

          {/* Study Plan Section */}
          <div className="mt-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Study Plan</CardTitle>
                <CardDescription>
                  Generate a personalized study plan tailored to your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-6">
                <div className="max-w-md mx-auto space-y-4">
                  <p className="text-muted-foreground">
                    Get a customized study schedule based on your available time, exam date, 
                    and topic strengths/weaknesses
                  </p>
                  <Button
                    onClick={() => setShowStudyPlanGenerator(true)}
                    className="w-full sm:w-auto"
                  >
                    Create Study Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weak Areas */}
          <Card className="shadow-md mt-6">
            <CardHeader>
              <CardTitle>Areas to Improve</CardTitle>
              <CardDescription>Topics where your performance is below average</CardDescription>
            </CardHeader>
            <CardContent>
              {weakAreas && weakAreas.length > 0 ? (
                <div className="space-y-4">
                  {weakAreas.map((area, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-sm sm:text-base">{area.topic}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{area.subject}</p>
                      </div>
                      <div className="text-xs text-red-500">{area.score}%</div>
                    </div>
                  ))}
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = "/dashboard/analytics"}
                    >
                      View Detailed Analytics
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No weak areas identified</p>
              )}
            </CardContent>
          </Card>
        </>
      );
    }
    
    // Fallback for any other case
    return null;
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 pt-16">
          <Sidebar className="h-[calc(100vh-64px)] sticky top-16" />
          <main className="flex-1">
            <div className="container px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
              <DashboardContent />
            </div>
          </main>
        </div>
        <Footer />
        <ScrollToTop />
      </div>

      {/* Study Plan Generator Dialog */}
      <Dialog open={showStudyPlanGenerator} onOpenChange={setShowStudyPlanGenerator}>
        <DialogContent className="max-w-4xl p-0 sm:p-0">
          <DialogTitle className="sr-only">Study Plan Generator</DialogTitle>
          <StudyPlanGenerator />
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}