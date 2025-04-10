"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, BookOpen, Clock, Target, Brain } from "lucide-react";
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

// Mock data for performance tracking
const performanceData = [
  { date: "Week 1", physics: 65, chemistry: 58, biology: 70 },
  { date: "Week 2", physics: 68, chemistry: 62, biology: 72 },
  { date: "Week 3", physics: 72, chemistry: 70, biology: 75 },
  { date: "Week 4", physics: 75, chemistry: 74, biology: 78 },
  { date: "Week 5", physics: 80, chemistry: 78, biology: 82 },
  { date: "Week 6", physics: 83, chemistry: 80, biology: 85 },
];

const subjectPerformanceData = [
  { subject: "Physics", score: 78, fullMark: 100 },
  { subject: "Chemistry", score: 80, fullMark: 100 },
  { subject: "Botany", score: 85, fullMark: 100 },
  { subject: "Zoology", score: 82, fullMark: 100 },
];

const timeDistributionData = [
  { name: "Physics", value: 35, color: "#2563eb" },
  { name: "Chemistry", value: 30, color: "#10b981" },
  { name: "Biology", value: 35, color: "#f59e0b" },
];

const recentActivityData = [
  {
    id: 1,
    activity: "Completed Mock Test",
    detail: "NEET Full Mock Test 1",
    date: "2 hours ago"
  },
  {
    id: 2,
    activity: "Watched Video Lecture",
    detail: "Human Physiology Chapter 5",
    date: "Yesterday"
  },
  {
    id: 3,
    activity: "Completed Assignment",
    detail: "Chemical Bonding Practice Problems",
    date: "2 days ago"
  },
  {
    id: 4,
    activity: "Downloaded Study Material",
    detail: "Physics Formula Sheet",
    date: "3 days ago"
  }
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
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
                    <h3 className="font-semibold text-lg sm:text-xl">78%</h3>
                    <p className="text-xs text-green-500">+12% from last month</p>
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
                    <h3 className="font-semibold text-lg sm:text-xl">18</h3>
                    <p className="text-xs text-muted-foreground">Out of 24 available tests</p>
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
                    <h3 className="font-semibold text-lg sm:text-xl">42.5h</h3>
                    <p className="text-xs text-muted-foreground">This month</p>
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
                    <h3 className="font-semibold text-lg sm:text-xl">3</h3>
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
              <CardDescription>Your progress over the last 6 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="physics" 
                      stroke="#2563eb" 
                      name="Physics" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="chemistry" 
                      stroke="#10b981" 
                      name="Chemistry" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="biology" 
                      stroke="#f59e0b" 
                      name="Biology"
                      strokeWidth={2} 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={subjectPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#2563eb" name="Your Score" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={timeDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {timeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivityData.map((item) => (
                  <div key={item.id} className="flex items-start pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary mr-3"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">{item.activity}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
} 