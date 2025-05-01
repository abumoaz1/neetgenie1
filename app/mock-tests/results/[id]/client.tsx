"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ArrowLeft,
  BarChart2,
  Loader2,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { useRouter } from "next/navigation";
import { endpoints, apiRequest } from "@/lib/baseUrl";

interface ClientResultsPageProps {
  testId: string;
}

interface Response {
  id: number;
  question_id: number;
  question_title: string;
  selected_option: number;
  is_correct: boolean;
  correct_option: number;
  explanation?: string;
}

interface Attempt {
  id: number;
  user_id: number;
  test_id: number;
  test: {
    id: number;
    title: string;
  };
  started_at: string;
  submitted_at: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  completed: boolean;
  responses: Response[];
}

export default function ClientResultsPage({ testId }: ClientResultsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt");
  
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Group responses by category/subject if available
  const [subjectPerformance, setSubjectPerformance] = useState<{
    subject: string;
    score: number;
    total: number;
  }[]>([]);

  useEffect(() => {
    const fetchAttemptData = async () => {
      try {
        setIsLoading(true);
        
        if (!attemptId) {
          throw new Error("No attempt ID provided");
        }
        
        // Fetch attempt data from the API
        const data = await apiRequest.get(endpoints.getAttemptById(attemptId));
        const attemptData = data.attempt;
        setAttempt(attemptData);
        
        // Fetch previous attempts for this test
        if (attemptData && attemptData.test && attemptData.test.id) {
          try {
            const attemptsData = await apiRequest.get(`${endpoints.getAttempts}?test_id=${attemptData.test.id}`);
            
            // Filter out current attempt and take only the 3 most recent ones
            const otherAttempts = (attemptsData.attempts || [])
              .filter((a: Attempt) => a.id !== parseInt(attemptId as string))
              .filter((a: Attempt) => a.submitted_at) // Only completed attempts
              .sort((a: Attempt, b: Attempt) => 
                new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
              )
              .slice(0, 3); // Get only the 3 most recent attempts
              
            setPreviousAttempts(otherAttempts);
          } catch (err) {
            console.error("Error fetching previous attempts:", err);
            // Don't set an error for this since it's not critical
          }
        }
        
        // Organize subject-wise performance if available
        if (attemptData.responses && attemptData.responses.length > 0) {
          const subjectMap: Record<string, { correct: number; total: number }> = {};
          
          // Group questions by subject/category
          attemptData.responses.forEach((response: Response) => {
            const subject = response.category || "General"; // Use category if available, otherwise "General"
            
            if (!subjectMap[subject]) {
              subjectMap[subject] = { correct: 0, total: 0 };
            }
            
            subjectMap[subject].total += 1;
            if (response.is_correct) {
              subjectMap[subject].correct += 1;
            }
          });
          
          // Convert map to array for rendering
          const subjectPerformanceData = Object.entries(subjectMap).map(([subject, data]) => ({
            subject,
            score: data.correct,
            total: data.total
          }));
          
          setSubjectPerformance(subjectPerformanceData);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching attempt data:", err);
        setError("Failed to load test results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttemptData();
  }, [attemptId]);

  // Calculate time taken for the test
  const calculateTimeTaken = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  };

  const calculatePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading test results...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="container py-8">
            <div className="max-w-md mx-auto text-center p-6 border rounded-lg shadow-md">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Error Loading Results</h2>
              <p className="text-muted-foreground mb-6">{error || "Failed to load test results. Please try again."}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => router.push(`/mock-tests/${testId}`)}>
                  Back to Test Details
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
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
        <div className="container px-4 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/mock-tests/${testId}`)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{attempt.test.title} - Results</h1>
                <p className="text-muted-foreground">Completed on {new Date(attempt.submitted_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <BarChart2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <h2 className="text-2xl font-bold">{attempt.score} points</h2>
                      <p className="text-sm text-muted-foreground">{calculatePercentage(attempt.correct_answers, attempt.total_questions)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time Taken</p>
                      <h2 className="text-2xl font-bold">
                        {calculateTimeTaken(attempt.started_at, attempt.submitted_at)}
                      </h2>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Correct Answers</p>
                      <h2 className="text-2xl font-bold">{attempt.correct_answers}/{attempt.total_questions}</h2>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject-wise Performance */}
            {subjectPerformance.length > 0 && (
              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold">Subject-wise Performance</h2>
                {subjectPerformance.map((subject) => (
                  <Card key={subject.subject}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{subject.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              {subject.score}/{subject.total} questions
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {calculatePercentage(subject.score, subject.total)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Previous Attempts */}
            {previousAttempts.length > 0 && (
              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold">Previous Attempts</h2>
                <p className="text-sm text-muted-foreground mb-4">Your last {previousAttempts.length} {previousAttempts.length === 1 ? 'attempt' : 'attempts'} for this test</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {previousAttempts.map((prevAttempt) => (
                    <Card key={prevAttempt.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Trophy className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Score: {prevAttempt.score} points
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {calculatePercentage(prevAttempt.correct_answers, prevAttempt.total_questions)}%
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(prevAttempt.submitted_at).toLocaleDateString()}
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-0 h-6"
                              onClick={() => router.push(`/mock-tests/results/${testId}?attempt=${prevAttempt.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Question Review */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Question Review</h2>
              {attempt.responses.map((response, index) => (
                <Card key={response.id} className={response.is_correct ? "border-green-200" : "border-red-200"}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium flex items-center gap-2">
                          <span>Question {index + 1}</span>
                          {response.is_correct ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </h3>
                        <Badge variant={response.is_correct ? "success" : "destructive"}>
                          {response.is_correct ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>
                      
                      <p className="text-base">{response.question_title}</p>
                      
                      <div className="grid gap-2">
                        {['option1', 'option2', 'option3', 'option4'].map((_, i) => {
                          const optionIndex = i + 1;
                          const isSelected = response.selected_option === optionIndex;
                          const isCorrect = response.correct_option === optionIndex;
                          
                          let className = "p-3 rounded-md border";
                          
                          if (isSelected && isCorrect) {
                            className += " bg-green-50 border-green-300";
                          } else if (isSelected && !isCorrect) {
                            className += " bg-red-50 border-red-300";
                          } else if (isCorrect) {
                            className += " bg-green-50 border-green-300";
                          }
                          
                          return (
                            <div key={i} className={className}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Option {optionIndex}</span>
                                </div>
                                {isSelected && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    Your Answer
                                  </Badge>
                                )}
                                {isCorrect && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    Correct Answer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {response.explanation && (
                        <div className="p-4 rounded-md bg-muted/50 border mt-2">
                          <p className="text-sm font-medium mb-1">Explanation:</p>
                          <p className="text-sm text-muted-foreground">{response.explanation}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/mock-tests/${testId}`)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Test Details
              </Button>
              <Button 
                onClick={() => router.push('/mock-tests')}
              >
                Explore More Tests
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}