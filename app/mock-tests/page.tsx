"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ChevronRight,
  Clock,
  Star,
  Sparkles,
  Timer,
  BookOpen,
  Target,
  Brain,
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

// Mock data for tests
const mockTests = {
  available: [
    {
      id: "neet-full-mock-1",
      name: "NEET Full Mock Test 1",
      subject: "Full Syllabus",
      duration: "3 hours",
      questions: 180,
      difficulty: "Hard",
      attempts: 0,
      rating: 4.8,
      totalAttempts: 1250,
      lastAttempt: null
    },
    {
      id: "physics-mock-1",
      name: "Physics Mock Test 1",
      subject: "Physics",
      duration: "1 hour",
      questions: 45,
      difficulty: "Medium",
      attempts: 0,
      rating: 4.5,
      totalAttempts: 850,
      lastAttempt: null
    },
    {
      id: "chemistry-mock-1",
      name: "Chemistry Mock Test 1",
      subject: "Chemistry",
      duration: "1 hour",
      questions: 45,
      difficulty: "Medium",
      attempts: 0,
      rating: 4.6,
      totalAttempts: 920,
      lastAttempt: null
    },
    {
      id: "biology-mock-1",
      name: "Biology Mock Test 1",
      subject: "Biology",
      duration: "1 hour",
      questions: 90,
      difficulty: "Medium",
      attempts: 0,
      rating: 4.7,
      totalAttempts: 980,
      lastAttempt: null
    }
  ],
  previous: [
    {
      id: "neet-full-mock-2",
      name: "NEET Full Mock Test 2",
      subject: "Full Syllabus",
      duration: "3 hours",
      questions: 180,
      difficulty: "Hard",
      attempts: 1,
      rating: 4.7,
      totalAttempts: 1100,
      lastAttempt: "2024-02-15",
      score: 680,
      totalMarks: 720
    }
  ]
};

export default function MockTestsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-muted/80 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="font-medium">Back to Home</span>
          </Link>

          {/* Header Section */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mock Tests</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Practice with our comprehensive NEET mock tests
            </p>
          </div>

          {/* Statistics Overview */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Timer className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Tests</p>
                    <h3 className="font-semibold text-lg sm:text-xl">12</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Star className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Average Score</p>
                    <h3 className="font-semibold text-lg sm:text-xl">85%</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Tests Completed</p>
                    <h3 className="font-semibold text-lg sm:text-xl">8</h3>
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
                    <p className="text-xs sm:text-sm text-muted-foreground">Time Spent</p>
                    <h3 className="font-semibold text-lg sm:text-xl">24h</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Categories */}
          <Tabs defaultValue="available" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="available" className="flex-1 sm:flex-none">Available Tests</TabsTrigger>
                <TabsTrigger value="previous" className="flex-1 sm:flex-none">Previous Attempts</TabsTrigger>
              </TabsList>
              <div className="flex gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search tests..." className="pl-8 text-sm" />
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="available" className="space-y-3 sm:space-y-4">
              {mockTests.available.map((test) => (
                <Link key={test.id} href={`/mock-tests/${test.id}`}>
                  <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm sm:text-base">{test.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{test.subject}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:ml-auto">
                          <Badge variant="secondary" className="text-xs sm:text-sm">
                            {test.duration}
                          </Badge>
                          <Badge variant="secondary" className="text-xs sm:text-sm">
                            {test.questions} Questions
                          </Badge>
                          <Badge variant="secondary" className="text-xs sm:text-sm">
                            {test.difficulty}
                          </Badge>
                          <Badge variant="secondary" className="text-xs sm:text-sm">
                            {test.rating} ★
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </TabsContent>

            <TabsContent value="previous" className="space-y-3 sm:space-y-4">
              {mockTests.previous.map((test) => (
                <Link key={test.id} href={`/mock-tests/results/${test.id}`}>
                  <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm sm:text-base">{test.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Completed on {new Date(test.lastAttempt!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:ml-auto">
                          <Badge variant="secondary" className="text-xs sm:text-sm">
                            Score: {test.score}/{test.totalMarks}
                          </Badge>
                          <Badge variant="secondary" className="text-xs sm:text-sm">
                            {test.duration}
                          </Badge>
                          <Badge variant="secondary" className="text-xs sm:text-sm">
                            {test.questions} Questions
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
} 