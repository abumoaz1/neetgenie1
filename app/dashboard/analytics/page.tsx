"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Target, 
  TrendingUp, 
  Clock, 
  BookText, 
  Medal,
  Loader2,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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

// Types for the API response
interface DetailedAnalyticsData {
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

export default function AnalyticsPage() {
  const { detailedAnalytics: analyticsData, isLoading, error, refetch } = useAnalytics();
  const [activeSubject, setActiveSubject] = useState("physics");
  
  // Helper function to get status color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Helper function to get status badge based on score
  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Strong</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Work</Badge>;
  };

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
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Detailed Analytics</h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Comprehensive insights to optimize your NEET preparation
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  Download PDF Report
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Get Recommendations
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading your analytics data...</p>
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
            ) : analyticsData ? (
              <>
                {/* Overview Cards */}
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  <Card className="shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 bg-blue-50 p-3 rounded-full">
                          <Target className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="text-3xl font-bold">{analyticsData.overview.overall_score}%</h3>
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 bg-green-50 p-3 rounded-full">
                          <BookText className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold">{analyticsData.overview.tests_completed}</h3>
                        <p className="text-sm text-muted-foreground">Tests Completed</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 bg-purple-50 p-3 rounded-full">
                          <Clock className="h-6 w-6 text-purple-500" />
                        </div>
                        <h3 className="text-3xl font-bold">{analyticsData.overview.total_study_time}h</h3>
                        <p className="text-sm text-muted-foreground">Total Study Time</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 bg-emerald-50 p-3 rounded-full">
                          <TrendingUp className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h3 className="text-3xl font-bold">+{analyticsData.overview.recent_improvement}%</h3>
                        <p className="text-sm text-muted-foreground">Recent Improvement</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 bg-amber-50 p-3 rounded-full">
                          <Brain className="h-6 w-6 text-amber-500" />
                        </div>
                        <h3 className="text-3xl font-bold">{analyticsData.weak_areas.length}</h3>
                        <p className="text-sm text-muted-foreground">Weak Areas</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Analytics Tabs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>Track your progress across different metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="trends" className="space-y-4">
                      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        <TabsTrigger value="trends">Trends</TabsTrigger>
                        <TabsTrigger value="subjects">Subjects</TabsTrigger>
                        <TabsTrigger value="topics">Topics</TabsTrigger>
                        <TabsTrigger value="time">Time Analysis</TabsTrigger>
                        <TabsTrigger value="weak-areas">Weak Areas</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                      </TabsList>
                      
                      {/* Performance Trends Tab */}
                      <TabsContent value="trends" className="space-y-4">
                        <div className="h-[400px]">
                          {analyticsData.performance_trends.monthly_data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart 
                                data={analyticsData.performance_trends.monthly_data}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="physics" 
                                  stroke="#3b82f6" 
                                  strokeWidth={2} 
                                  activeDot={{ r: 8 }} 
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="chemistry" 
                                  stroke="#10b981" 
                                  strokeWidth={2} 
                                  activeDot={{ r: 8 }} 
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="biology" 
                                  stroke="#f59e0b" 
                                  strokeWidth={2} 
                                  activeDot={{ r: 8 }} 
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="overall" 
                                  stroke="#8b5cf6" 
                                  strokeWidth={3} 
                                  activeDot={{ r: 8 }} 
                                />
                              </RechartsLineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-muted-foreground">Not enough data to display trends</p>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-medium text-lg mt-6">Performance by Difficulty Level</h3>
                        <div className="h-[300px]">
                          {analyticsData.performance_trends.by_difficulty.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsBarChart 
                                data={analyticsData.performance_trends.by_difficulty}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="difficulty" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="score" fill="#8b5cf6" name="Average Score (%)" />
                              </RechartsBarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-muted-foreground">No difficulty data available</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      {/* Subjects Analysis Tab */}
                      <TabsContent value="subjects" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="h-[400px]">
                            {analyticsData.subject_analysis.radar_data.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsRadarChart outerRadius={120} data={analyticsData.subject_analysis.radar_data}>
                                  <PolarGrid />
                                  <PolarAngleAxis dataKey="subject" />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                  <Radar 
                                    name="Your Score" 
                                    dataKey="score" 
                                    stroke="#8b5cf6" 
                                    fill="#8b5cf6" 
                                    fillOpacity={0.5} 
                                  />
                                  <Radar 
                                    name="Average Score" 
                                    dataKey="average" 
                                    stroke="#3b82f6" 
                                    fill="#3b82f6" 
                                    fillOpacity={0.3} 
                                  />
                                  <Legend />
                                  <Tooltip />
                                </RechartsRadarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">No subject data available</p>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="font-medium text-lg mb-4">Detailed Subject Analysis</h3>
                            <Tabs 
                              value={activeSubject} 
                              onValueChange={setActiveSubject}
                              className="space-y-4"
                            >
                              <TabsList className="grid grid-cols-3 mb-4">
                                <TabsTrigger value="physics">Physics</TabsTrigger>
                                <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
                                <TabsTrigger value="biology">Biology</TabsTrigger>
                              </TabsList>
                              
                              {['physics', 'chemistry', 'biology'].map(subject => (
                                <TabsContent key={subject} value={subject} className="space-y-4">
                                  {analyticsData.subject_analysis.sub_topics[subject]?.length > 0 ? (
                                    <ScrollArea className="h-[320px] pr-4">
                                      <div className="space-y-4">
                                        {analyticsData.subject_analysis.sub_topics[subject].map((topic, idx) => (
                                          <div key={idx} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                              <p className="font-medium">{topic.name}</p>
                                              <div className="flex items-center gap-2">
                                                <span className={getScoreColor(topic.mastery)}>{topic.mastery}%</span>
                                                {getScoreBadge(topic.mastery)}
                                              </div>
                                            </div>
                                            <Progress value={topic.mastery} className="h-2" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                              <span>Questions: {topic.questions_attempted}</span>
                                              <span>Time: {topic.time_spent}h</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                  ) : (
                                    <div className="flex items-center justify-center h-[320px]">
                                      <p className="text-muted-foreground">No topic data available for {subject}</p>
                                    </div>
                                  )}
                                </TabsContent>
                              ))}
                            </Tabs>
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* Topics Analysis Tab */}
                      <TabsContent value="topics" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Strengths</CardTitle>
                              <CardDescription>Topics you excel at</CardDescription>
                            </CardHeader>
                            <CardContent>
                              {analyticsData.overview.strengths.length > 0 ? (
                                <ul className="space-y-2">
                                  {analyticsData.overview.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <Medal className="h-4 w-4 text-yellow-500" />
                                      <span>{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-center text-muted-foreground py-4">No strengths identified yet</p>
                              )}
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Areas to Improve</CardTitle>
                              <CardDescription>Topics that need more attention</CardDescription>
                            </CardHeader>
                            <CardContent>
                              {analyticsData.overview.weaknesses.length > 0 ? (
                                <ul className="space-y-2">
                                  {analyticsData.overview.weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <Brain className="h-4 w-4 text-red-500" />
                                      <span>{weakness}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-center text-muted-foreground py-4">No weaknesses identified yet</p>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      {/* Time Analysis Tab */}
                      <TabsContent value="time" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Time Distribution</CardTitle>
                              <CardDescription>How you allocate your study time</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[300px]">
                                {analyticsData.time_metrics.time_distribution.some(item => item.hours > 0) ? (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                      <Pie
                                        data={analyticsData.time_metrics.time_distribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="hours"
                                        nameKey="activity"
                                        label={({name, percent}) => 
                                          percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                                        }
                                      >
                                        {analyticsData.time_metrics.time_distribution.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                      </Pie>
                                      <Tooltip formatter={(value) => [`${value} hours`, 'Time Spent']} />
                                      <Legend />
                                    </RechartsPieChart>
                                  </ResponsiveContainer>
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">Not enough time data recorded</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Average Time per Question</CardTitle>
                              <CardDescription>Your speed in different subjects (seconds)</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[300px]">
                                {Object.keys(analyticsData.time_metrics.average_time_per_question).length > 0 ? (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <RechartsBarChart
                                      data={Object.entries(analyticsData.time_metrics.average_time_per_question).map(([subject, time]) => ({
                                        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
                                        time
                                      }))}
                                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="subject" />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Bar dataKey="time" fill="#3b82f6" name="Seconds per Question" />
                                    </RechartsBarChart>
                                  </ResponsiveContainer>
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">No time data available</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Efficiency Score</span>
                                  <span className="text-sm font-medium">{analyticsData.time_metrics.efficiency_score}%</span>
                                </div>
                                <Progress value={analyticsData.time_metrics.efficiency_score} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-2">
                                  This score reflects how efficiently you use your time compared to top performers
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      {/* Weak Areas Tab */}
                      <TabsContent value="weak-areas" className="space-y-4">
                        {analyticsData.weak_areas.length > 0 ? (
                          <ScrollArea className="h-[500px]">
                            <div className="space-y-6">
                              {analyticsData.weak_areas.map((area, idx) => (
                                <Card key={idx}>
                                  <CardHeader>
                                    <div className="flex justify-between">
                                      <div>
                                        <CardTitle className="text-lg">{area.topic}</CardTitle>
                                        <CardDescription>{area.subtopic}</CardDescription>
                                      </div>
                                      <Badge 
                                        className={
                                          area.score < 40 ? "bg-red-100 text-red-800" : 
                                          "bg-yellow-100 text-yellow-800"
                                        }
                                      >
                                        Score: {area.score}%
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <h4 className="font-medium mb-2">Recommended Resources</h4>
                                    <div className="space-y-2">
                                      {area.recommended_resources.map((resource, resIdx) => (
                                        <div key={resIdx} className="flex items-start gap-3 p-2 bg-slate-50 rounded-md">
                                          <div className="mt-0.5">
                                            {resource.type === 'video' && (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/></svg>
                                            )}
                                            {resource.type === 'article' && (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
                                            )}
                                            {resource.type === 'quiz' && (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                                            )}
                                          </div>
                                          <div>
                                            <a 
                                              href={resource.link} 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="text-sm font-medium text-blue-600 hover:underline"
                                            >
                                              {resource.title}
                                            </a>
                                            <p className="text-xs text-slate-500 capitalize">{resource.type}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <div className="py-12 text-center">
                            <p className="text-muted-foreground">No weak areas identified yet. Keep taking tests to get personalized recommendations.</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Progress Tab */}
                      <TabsContent value="progress" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Weekly Progress</CardTitle>
                              <CardDescription>Your progress against weekly targets</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[300px]">
                                {analyticsData.progress.weekly_progress.length > 0 ? (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <RechartsLineChart
                                      data={analyticsData.progress.weekly_progress}
                                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="week" />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Line 
                                        type="monotone" 
                                        dataKey="progress" 
                                        stroke="#3b82f6" 
                                        name="Your Progress" 
                                        strokeWidth={2}
                                        activeDot={{ r: 8 }} 
                                      />
                                      <Line 
                                        type="monotone" 
                                        dataKey="target" 
                                        stroke="#10b981" 
                                        name="Target" 
                                        strokeWidth={2}
                                        strokeDasharray="5 5" 
                                      />
                                    </RechartsLineChart>
                                  </ResponsiveContainer>
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">Not enough data to display progress</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Milestones</CardTitle>
                              <CardDescription>Your learning journey achievements</CardDescription>
                            </CardHeader>
                            <CardContent>
                              {analyticsData.progress.milestones.length > 0 ? (
                                <div className="space-y-4">
                                  {analyticsData.progress.milestones.map((milestone, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                      <div className={`p-1 mt-0.5 rounded-full ${milestone.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={milestone.completed ? 'text-green-600' : 'text-gray-400'}>
                                          {milestone.completed ? <path d="M20 6 9 17l-5-5"/> : <path d="M12 12v6M12 6v.01"/>}
                                        </svg>
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex justify-between">
                                          <p className={`font-medium ${milestone.completed ? 'text-green-700' : 'text-gray-600'}`}>
                                            {milestone.title}
                                          </p>
                                          {milestone.date && (
                                            <span className="text-xs text-muted-foreground">
                                              {milestone.date}
                                            </span>
                                          )}
                                        </div>
                                        {!milestone.completed && (
                                          <p className="text-xs text-gray-500 mt-1">In progress</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="py-12 text-center">
                                  <p className="text-muted-foreground">No milestones set yet</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="bg-yellow-50 p-8 rounded-lg text-yellow-800 text-center">
                <h3 className="font-semibold text-lg mb-2">No Analytics Data Available</h3>
                <p className="mb-4">Start taking tests and studying to generate analytics data</p>
                <Button 
                  variant="outline" 
                  className="bg-yellow-100 border-yellow-200 hover:bg-yellow-200"
                  onClick={() => window.location.href = "/mock-tests"}
                >
                  Take a Mock Test
                </Button>
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