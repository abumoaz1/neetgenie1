"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  Award,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

// Mock test data
const testDetails = {
  id: "neet-full-mock-1",
  name: "NEET Full Mock Test 1",
  description: "Complete mock test covering Physics, Chemistry, and Biology with 180 questions following the NEET exam pattern",
  totalQuestions: 180,
  duration: 180, // minutes
  subjects: ["Physics", "Chemistry", "Biology"],
  questionDistribution: {
    Physics: 45,
    Chemistry: 45,
    Biology: 90
  },
  difficultyLevel: "Medium",
  createdAt: "2023-11-10",
  instructions: [
    "Read each question carefully and select the most appropriate option.",
    "Each correct answer carries 4 marks.",
    "Each incorrect answer will result in a deduction of 1 mark.",
    "Unattempted questions will not be marked.",
    "The test duration is 3 hours (180 minutes).",
    "Once started, the test timer cannot be paused."
  ],
  previousAttempts: [
    {
      date: "2023-12-05",
      score: "495/720",
      percentile: 82.5
    },
    {
      date: "2023-10-20",
      score: "468/720",
      percentile: 78.3
    }
  ]
};

export default function ClientTestDetailsPage({ testId }: { testId: string }) {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins > 0 ? `${mins} minute${mins !== 1 ? 's' : ''}` : ''}`;
  };

  // Start the test
  const startTest = () => {
    router.push(`/mock-tests/take/${testId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container py-8 space-y-8">
          {/* Back Button */}
          <Link 
            href="/mock-tests" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-muted/80 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="font-medium">Back to Mock Tests</span>
          </Link>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{testDetails.name}</h1>
              <p className="text-lg text-muted-foreground">
                Complete the test to analyze your performance
              </p>
            </div>
            <Button size="lg" onClick={startTest} className="sm:w-auto w-full">
              Start Test
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Test Details Card */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Test Overview</CardTitle>
                  <CardDescription>Details about this mock test</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Description</h3>
                    <p className="text-muted-foreground">{testDetails.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Questions</span>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        <span className="font-medium">{testDetails.totalQuestions}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">{formatDuration(testDetails.duration)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Date Added</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{testDetails.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-rose-500" />
                        <span className="font-medium">{testDetails.difficultyLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Subject Distribution</h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(testDetails.questionDistribution).map(([subject, count]) => (
                        <div key={subject} className="flex items-center gap-2 border rounded-lg px-3 py-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span>{subject}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Test Instructions</h3>
                    <ul className="space-y-2">
                      {testDetails.instructions.map((instruction, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                          <span className="text-sm text-muted-foreground">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Previous Attempts Card */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Previous Attempts</CardTitle>
                  <CardDescription>Your past performance in this test</CardDescription>
                </CardHeader>
                <CardContent>
                  {testDetails.previousAttempts.length > 0 ? (
                    <div className="space-y-4">
                      {testDetails.previousAttempts.map((attempt, idx) => (
                        <div key={idx} className="p-3 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{attempt.date}</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {attempt.score}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Percentile</span>
                            <span className="font-medium">{attempt.percentile}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3 opacity-80" />
                      <h3 className="font-medium mb-1">No Attempts Yet</h3>
                      <p className="text-sm text-muted-foreground">
                        You haven't taken this test yet. Start now to see your results here.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={startTest}>
                    Start Test Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
} 