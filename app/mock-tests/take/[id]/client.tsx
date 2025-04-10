"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

// Mock questions data
const mockQuestions = [
  {
    id: 1,
    question: "Which of the following is true about the electron transport system in mitochondria?",
    options: [
      "Electrons move from lower to higher energy levels",
      "NADH is oxidized to NAD+ in this process",
      "The final electron acceptor is oxygen in anaerobic respiration",
      "ATP is consumed during this process"
    ],
    correctAnswer: 1,
    subject: "Biology",
    topic: "Cellular Respiration",
    difficulty: "Medium"
  },
  {
    id: 2,
    question: "A bob of mass m is suspended from a string of length L. The minimum velocity required at the lowest point for the bob to complete a vertical circle is:",
    options: [
      "√(gL)",
      "√(2gL)",
      "√(3gL)",
      "√(5gL)"
    ],
    correctAnswer: 3,
    subject: "Physics",
    topic: "Circular Motion",
    difficulty: "Hard"
  }
];

export default function ClientTestTakingPage({ testId }: { testId: string }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleMarkQuestion = (questionId: number) => {
    setMarkedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      }
      return [...prev, questionId];
    });
  };

  const handleSubmit = () => {
    // Calculate score
    let score = 0;
    let totalMarks = 0;
    
    mockQuestions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score += 4; // 4 marks for correct answer
      } else if (answers[question.id] !== undefined) {
        score -= 1; // -1 mark for incorrect answer
      }
      totalMarks += 4; // Each question is worth 4 marks
    });

    // Navigate to results page with score
    router.push(`/mock-tests/results/${testId}?score=${score}&total=${totalMarks}`);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" size="sm" onClick={() => router.push("/mock-tests")}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Tests
              </Button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <Button onClick={handleSubmit}>Submit Test</Button>
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
                            Question {currentQuestion + 1} of {mockQuestions.length}
                          </Badge>
                          <Badge variant="outline">
                            {mockQuestions[currentQuestion].subject}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkQuestion(mockQuestions[currentQuestion].id)}
                        >
                          {markedQuestions.includes(mockQuestions[currentQuestion].id)
                            ? "Unmark Question"
                            : "Mark for Review"}
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <p className="text-lg">
                          {mockQuestions[currentQuestion].question}
                        </p>
                        <div className="space-y-3">
                          {mockQuestions[currentQuestion].options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                answers[mockQuestions[currentQuestion].id] === index
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => handleAnswerSelect(mockQuestions[currentQuestion].id, index)}
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
                    onClick={() => setCurrentQuestion((prev) => Math.min(mockQuestions.length - 1, prev + 1))}
                    disabled={currentQuestion === mockQuestions.length - 1}
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
                    <h3 className="font-medium mb-4">Question Navigation</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {mockQuestions.map((question, index) => (
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