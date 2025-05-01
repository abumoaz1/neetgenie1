"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Award,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { endpoints, apiRequest } from "@/lib/baseUrl";

interface Test {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  created_at: string;
  updated_at: string;
}

interface Attempt {
  id: number;
  user_id: number;
  test_id: number;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  correct_answers: number | null;
  total_questions: number;
}

// Test instructions - static for now, could be moved to API later
const testInstructions = [
  "Read each question carefully and select the most appropriate option.",
  "Each correct answer carries 4 marks.",
  "Each incorrect answer will result in a deduction of 1 mark.",
  "Unattempted questions will not be marked.",
  "Once started, the test timer cannot be paused."
];

export default function ClientTestDetailsPage({ testId }: { testId: string }) {
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingTest, setIsStartingTest] = useState(false);

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''} ` : ''}${mins > 0 ? `${mins} minute${mins !== 1 ? 's' : ''}` : ''}`;
  };

  // Fetch test details
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch test details
        const testData = await apiRequest.get(endpoints.getTestById(testId));
        
        // Check if data has a "test" property
        const testDetails = testData.test || testData;
        setTest(testDetails);
        
        // Fetch user's previous attempts for this test
        try {
          const attemptsData = await apiRequest.get(`${endpoints.getAttempts}?test_id=${testId}`);
          // Check if data has an "attempts" property
          const allAttempts = attemptsData.attempts || attemptsData || [];
          
          // Sort attempts by date (newest first) and limit to 3
          const sortedAttempts = [...allAttempts].sort((a, b) => 
            new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
          ).slice(0, 3);
          
          setPreviousAttempts(sortedAttempts);
        } catch (err) {
          console.log("User may not be logged in or no previous attempts");
          setPreviousAttempts([]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching test details:", err);
        setError("Failed to load test details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (testId) {
      fetchTestDetails();
    }
  }, [testId]);

  // Start the test - create an attempt and redirect to test questions
  const startTest = async () => {
    try {
      setIsStartingTest(true);
      
      // Create a new attempt
      const response = await apiRequest.post(endpoints.createAttempt, {
        test_id: Number(testId)
      });
      
      // Check if we have an attempt ID
      const attemptId = response.attempt?.id || (response.attempt && response.attempt.id);
      
      if (!attemptId) {
        throw new Error("Failed to create test attempt");
      }
      
      // Redirect to take the test
      router.push(`/mock-tests/take/${testId}?attempt=${attemptId}`);
    } catch (err) {
      console.error("Error starting test:", err);
      setError("Failed to start the test. Please try again.");
      setIsStartingTest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading test details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="container py-8 space-y-8">
            <Link 
              href="/mock-tests" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-muted/80 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="font-medium">Back to Mock Tests</span>
            </Link>
            
            <div className="flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
                <h2 className="text-xl font-medium">Error Loading Test</h2>
                <p className="text-muted-foreground">{error || "Test details not found"}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold tracking-tight">{test.title}</h1>
              <p className="text-lg text-muted-foreground">
                Complete the test to analyze your performance
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={startTest} 
              className="sm:w-auto w-full"
              disabled={isStartingTest}
            >
              {isStartingTest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Test...
                </>
              ) : (
                <>
                  Start Test
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
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
                    <p className="text-muted-foreground">{test.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Questions</span>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        <span className="font-medium">{test.total_questions}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">{formatDuration(test.duration_minutes)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Date Added</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{new Date(test.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Test Instructions</h3>
                    <ul className="space-y-2">
                      {testInstructions.map((instruction, idx) => (
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
                  {previousAttempts.length > 0 ? (
                    <div className="space-y-4">
                      {previousAttempts.map((attempt) => (
                        <div key={attempt.id} className="p-3 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{new Date(attempt.started_at).toLocaleDateString()}</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {attempt.score !== null ? `${attempt.score} pts` : 'In Progress'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium">
                              {attempt.submitted_at ? "Completed" : "In Progress"}
                            </span>
                          </div>
                          {attempt.submitted_at && (
                            <div className="text-right">
                              <Link href={`/mock-tests/results/${testId}?attempt=${attempt.id}`}>
                                <Button variant="link" size="sm" className="p-0 h-auto">
                                  View Results
                                </Button>
                              </Link>
                            </div>
                          )}
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
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={startTest}
                    disabled={isStartingTest}
                  >
                    {isStartingTest ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      "Start Test Now"
                    )}
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