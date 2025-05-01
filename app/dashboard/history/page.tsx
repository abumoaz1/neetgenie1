"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { baseUrl } from "@/lib/baseUrl";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface TestAttempt {
  attempt_id: number;
  test_id: number;
  test_title: string;
  started_at: string;
  submitted_at: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_spent_minutes: number;
}

interface TestStats {
  total_tests_completed: number;
  total_time_spent_minutes: number;
  average_score: number;
  best_score: number;
}

interface QuestionAttempt {
  id: number;
  attempt_id: number;
  question_id: number;
  question_title: string;
  selected_option: number;
  correct_option: number;
  is_correct: boolean;
  submitted_at: string;
}

interface HistoryData {
  user: User;
  test_history: {
    completed: TestAttempt[];
    in_progress: TestAttempt[];
    stats: TestStats;
  };
  recent_activity: QuestionAttempt[];
  study_materials: any[]; // Add proper type if needed
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        // Use token in Authorization header but don't use credentials: 'include'
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${baseUrl}/user/history`, {
          method: 'GET',
          // Remove credentials: 'include' since we're using token in header
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch history data: ${response.status}`);
        }

        const data = await response.json();
        setHistoryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar className="h-[calc(100vh-64px)] sticky top-16" />
        <main className="flex-1">
          <div className="container px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">History</h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Track your learning progress and activities
                </p>
              </div>
            </div>

            {loading ? (
              <Card className="shadow-md">
                <CardContent className="p-8 flex justify-center items-center">
                  <p>Loading history data...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="shadow-md bg-red-50">
                <CardContent className="p-8">
                  <p className="text-red-600">{error}</p>
                  <p className="mt-2">Please try again later or contact support.</p>
                </CardContent>
              </Card>
            ) : historyData ? (
              <Tabs defaultValue="test-history" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                  <TabsTrigger value="test-history">Test History</TabsTrigger>
                  <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
                  <TabsTrigger value="statistics">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="test-history">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Completed Tests</CardTitle>
                      <CardDescription>Record of your completed test attempts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {historyData.test_history.completed.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No completed tests yet</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Test</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Correct</TableHead>
                                <TableHead>Time Spent</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {historyData.test_history.completed.map((attempt) => (
                                <TableRow key={attempt.attempt_id}>
                                  <TableCell className="font-medium">{attempt.test_title}</TableCell>
                                  <TableCell>{formatDate(attempt.submitted_at)}</TableCell>
                                  <TableCell>{attempt.score.toFixed(1)}%</TableCell>
                                  <TableCell>{attempt.correct_answers} / {attempt.total_questions}</TableCell>
                                  <TableCell>{attempt.time_spent_minutes} mins</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recent-activity">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Recent Question Attempts</CardTitle>
                      <CardDescription>Your most recent question responses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {historyData.recent_activity.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No recent activity</p>
                      ) : (
                        <div className="space-y-4">
                          {historyData.recent_activity.map((activity) => (
                            <div key={activity.id} className="border rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="mt-1">
                                  {activity.is_correct ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{activity.question_title}</p>
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    <p>Your answer: Option {activity.selected_option}</p>
                                    {!activity.is_correct && <p>Correct answer: Option {activity.correct_option}</p>}
                                    <p className="mt-1">{formatDate(activity.submitted_at)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="statistics">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Performance Statistics</CardTitle>
                      <CardDescription>Summary of your test performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Tests Completed</p>
                          <p className="text-2xl font-bold mt-1">{historyData.test_history.stats.total_tests_completed}</p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Total Time Spent</p>
                          <p className="text-2xl font-bold mt-1">{historyData.test_history.stats.total_time_spent_minutes} minutes</p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Average Score</p>
                          <p className="text-2xl font-bold mt-1">{historyData.test_history.stats.average_score.toFixed(1)}%</p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Best Score</p>
                          <p className="text-2xl font-bold mt-1">{historyData.test_history.stats.best_score.toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : null}
          </div>
        </main>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}