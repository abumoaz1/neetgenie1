"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { endpoints, apiRequest } from "@/lib/baseUrl";
import { useTestAnswers } from "@/store/test-answers";

interface Test {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  created_at: string;
  updated_at: string;
}

interface Question {
  id: number;
  test_id: number;
  question_title: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  category?: string;
  difficulty_level?: string;
  explanation?: string;
}

export default function ClientTestTakingPage({ testId }: { testId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attempt');
  
  // Use our Zustand store
  const { 
    answers, 
    markedQuestions, 
    isSubmitting, 
    error: answersError,
    setAnswer, 
    toggleMarkedQuestion, 
    clearAnswers,
    setSubmitting,
    setError: setAnswersError
  } = useTestAnswers();
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch test data and questions
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setIsLoading(true);
        
        if (!attemptId) {
          // Redirect back to the mock tests page instead of showing an error
          router.push(`/mock-tests`);
          return;
        }
        
        // Fetch test details
        const testData = await apiRequest.get(endpoints.getTestById(testId));
        const testDetails = testData.test || testData;
        setTest(testDetails);
        
        // Set timer based on test duration
        setTimeLeft(testDetails.duration_minutes * 60);
        
        // Fetch questions for this test
        const questionsData = await apiRequest.get(`${endpoints.getQuestions}?test_id=${testId}`);
        const questionsList = questionsData.questions || questionsData || [];
        
        // Filter out any sensitive data (right_answer) from the questions
        const safeQuestions = questionsList.map(q => {
          const { right_answer, ...safeQuestion } = q;
          return safeQuestion;
        });
        
        setQuestions(safeQuestions);
        
        // Clear previous answers when loading a new test
        clearAnswers();
        
        setError(null);
      } catch (err) {
        console.error("Error fetching test data:", err);
        setError("Failed to load test questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (testId) {
      fetchTestData();
    }
    
    // Clear answers when unmounting
    return () => {
      clearAnswers();
    };
  }, [testId, attemptId, router, clearAnswers]);

  // Timer effect
  useEffect(() => {
    if (!isLoading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, timeLeft]);

  // Convert question options to array format for consistent rendering
  const getQuestionOptions = (question: Question) => {
    return [
      question.option1,
      question.option2,
      question.option3,
      question.option4
    ];
  };

  // Handle answer selection - now using Zustand store
  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswer(questionId, optionIndex);
  };

  // Mark/unmark question for review - now using Zustand store
  const handleMarkQuestion = (questionId: number) => {
    toggleMarkedQuestion(questionId);
  };

  // Submit all answers at once when the test is completed
  const submitAllAnswers = async () => {
    try {
      // Create an array of answer submission promises
      const answerSubmissions = Object.entries(answers).map(async ([questionId, optionIndex]) => {
        try {
          await apiRequest.post(endpoints.createResponse, {
            attempt_id: Number(attemptId),
            question_id: parseInt(questionId),
            selected_option: optionIndex + 1 // API uses 1-based indexing for options
          });
          return { success: true, questionId };
        } catch (err) {
          console.error(`Error submitting answer for question ${questionId}:`, err);
          return { success: false, questionId, error: err };
        }
      });
      
      // Execute all submissions in parallel
      const results = await Promise.allSettled(answerSubmissions);
      
      // Check for any failed submissions
      const failedSubmissions = results
        .filter(result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success))
        .map(result => {
          if (result.status === 'rejected') {
            return result.reason;
          }
          return (result.status === 'fulfilled') ? result.value.error : null;
        });
      
      if (failedSubmissions.length > 0) {
        console.warn(`${failedSubmissions.length} answers failed to submit, but continuing with test submission`);
      }
      
      return true;
    } catch (err) {
      console.error("Error submitting answers:", err);
      return false;
    }
  };

  // Submit the test
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // First submit all answers
      await submitAllAnswers();
      
      // Then submit the attempt as completed
      await apiRequest.post(endpoints.submitAttempt(attemptId), {});
      
      // Navigate to results page
      router.push(`/mock-tests/results/${testId}?attempt=${attemptId}`);
    } catch (err) {
      console.error("Error submitting test:", err);
      setError("Failed to submit test. Please try again.");
      setSubmitting(false);
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading test questions...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error || !test || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="container py-8">
            <div className="max-w-md mx-auto text-center p-6 border rounded-lg shadow-md">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Error Loading Test</h2>
              <p className="text-muted-foreground mb-6">{error || "Failed to load test data. Please try again."}</p>
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

  const currentQuestionData = questions[currentQuestion];
  const options = getQuestionOptions(currentQuestionData);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-xl font-bold">{test.title}</h1>
                <p className="text-sm text-muted-foreground">{questions.length} Questions • {test.duration_minutes} Minutes</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 p-2 border rounded bg-amber-50">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Test"
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            Question {currentQuestion + 1} of {questions.length}
                          </Badge>
                          {currentQuestionData.category && (
                            <Badge variant="outline">
                              {currentQuestionData.category}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkQuestion(currentQuestionData.id)}
                        >
                          {markedQuestions.includes(currentQuestionData.id)
                            ? "Unmark Question"
                            : "Mark for Review"}
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <p className="text-lg">
                          {currentQuestionData.question_title}
                        </p>
                        <div className="space-y-3">
                          {options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                answers[currentQuestionData.id] === index
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => handleAnswerSelect(currentQuestionData.id, index)}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Question Navigation Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Question Navigator</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {questions.map((question, index) => (
                        <button
                          key={question.id}
                          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            currentQuestion === index
                              ? "bg-primary text-primary-foreground"
                              : markedQuestions.includes(question.id)
                              ? "bg-yellow-100 text-yellow-800"
                              : answers[question.id] !== undefined
                              ? "bg-green-100 text-green-800"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                          onClick={() => setCurrentQuestion(index)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="text-sm font-medium">Status</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-100"></div>
                          <span>Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-muted"></div>
                          <span>Unanswered</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-yellow-100"></div>
                          <span>Marked</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary"></div>
                          <span>Current</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">
                          {Object.keys(answers).length}/{questions.length} answered
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{width: `${(Object.keys(answers).length / questions.length) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}