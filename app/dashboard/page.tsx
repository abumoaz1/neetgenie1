"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, BookOpen, Clock, Target, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from "recharts";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Sidebar from "@/components/sidebar";
import { useAnalytics } from "@/hooks/use-analytics";

export default function DashboardPage() {
  const { basicAnalytics: analytics, isLoading, error, refetch } = useAnalytics();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar className="h-[calc(100vh-64px)] sticky top-16" />
        <main className="flex-1">
          <div className="container px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Track your NEET preparation progress
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                Generate Study Plan
              </Button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading your dashboard data...</p>
              </div>
            ) : error ? (
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
            ) : analytics ? (
              <>
                {/* Overview Cards */}
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <Target className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Overall Progress</p>
                          <h3 className="font-semibold text-lg sm:text-xl">{analytics.overall_stats.progress_percentage}%</h3>
                          <p className="text-xs text-green-500">+{analytics.overall_stats.progress_change}% from last month</p>
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
                          <p className="text-xs sm:text-sm text-muted-foreground">Tests Completed</p>
                          <h3 className="font-semibold text-lg sm:text-xl">{analytics.overall_stats.tests_completed}</h3>
                          <p className="text-xs text-muted-foreground">Out of {analytics.overall_stats.total_tests} available tests</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50">
                          <Clock className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Study Time</p>
                          <h3 className="font-semibold text-lg sm:text-xl">{analytics.overall_stats.study_time_hours.toFixed(1)}h</h3>
                          <p className="text-xs text-muted-foreground">Total time spent</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-50">
                          <Brain className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Weak Areas</p>
                          <h3 className="font-semibold text-lg sm:text-xl">{analytics.overall_stats.weak_areas_count}</h3>
                          <p className="text-xs text-muted-foreground">Topics needing attention</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Trends */}
                <Card className="shadow-md hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      <span>Performance Trends</span>
                    </CardTitle>
                    <CardDescription>Your progress over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {analytics.performance.weekly_trends.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={analytics.performance.weekly_trends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {Object.keys(analytics.performance.weekly_trends[0])
                              .filter(key => key !== 'date')
                              .map(subject => {
                                const colors = {
                                  physics: "#2563eb",
                                  chemistry: "#10b981",
                                  biology: "#f59e0b"
                                };
                                return (
                                  <Line 
                                    key={subject}
                                    type="monotone" 
                                    dataKey={subject} 
                                    stroke={colors[subject as keyof typeof colors]} 
                                    name={subject.charAt(0).toUpperCase() + subject.slice(1)} 
                                    strokeWidth={2} 
                                  />
                                );
                              })}
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">Not enough data to display trends</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Subject Performance and Time Distribution */}
                <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                  <Card className="shadow-md hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        <span>Subject Performance</span>
                      </CardTitle>
                      <CardDescription>Your current standing in each subject</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        {analytics.performance.subject_scores.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={analytics.performance.subject_scores}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="subject" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="score" fill="#2563eb" name="Your Score" />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No subject data available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        <span>Study Time Distribution</span>
                      </CardTitle>
                      <CardDescription>How you've allocated your study time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        {analytics.performance.time_distribution.some(item => item.value > 0) ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={analytics.performance.time_distribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({name, percent}) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                              >
                                {analytics.performance.time_distribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">Not enough study time data</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Weak Areas */}
                <Card className="shadow-md hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle>Weak Areas</CardTitle>
                    <CardDescription>Topics that need improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.performance.weak_areas.length > 0 ? (
                      <div className="space-y-4">
                        {analytics.performance.weak_areas.map((area, index) => (
                          <div key={index} className="flex items-start pb-4 border-b last:border-b-0 last:pb-0">
                            <div className="w-2 h-2 mt-2 rounded-full bg-primary mr-3"></div>
                            <div className="flex-1">
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
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-center">
                <p>No data available. Start taking tests to see your analytics.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}