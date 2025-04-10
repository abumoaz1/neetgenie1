"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Flag
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { useRouter, useParams } from "next/navigation";
import { Suspense } from "react";
import ClientTestTakingPage from "./client";

// Mock questions data
const questions = [
  {
    id: 1,
    text: "Which of the following is not a characteristic of living organisms?",
    options: [
      "Growth",
      "Reproduction",
      "Metabolism",
      "Crystallization"
    ],
    correctAnswer: 3,
    subject: "Biology",
    topic: "Living World"
  },
  {
    id: 2,
    text: "The SI unit of electric current is:",
    options: [
      "Volt",
      "Ampere",
      "Ohm",
      "Watt"
    ],
    correctAnswer: 1,
    subject: "Physics",
    topic: "Units and Measurements"
  }
];

function TestTakingPageContent({ testId }: { testId: string }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 hours in seconds

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleMarkQuestion = (questionIndex: number) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    // Calculate score
    const score = Object.entries(answers).reduce((total, [questionIndex, answerIndex]) => {
      const correctAnswer = questions[parseInt(questionIndex)].correctAnswer;
      return total + (answerIndex === correctAnswer ? 1 : 0);
    }, 0);

    // Navigate to results page with score
    router.push(`/mock-tests/results/${testId}?score=${score}&total=${questions.length}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="bg-white border-b py-3 flex items-center justify-between px-6 sticky top-16 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">NEET Full Mock Test 1</h1>
              <Badge variant="secondary">Physics</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(timeLeft / 3600)}:{(timeLeft % 3600 / 60).toString().padStart(2, '0')}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSubmit}
              >
                Submit Test
              </Button>
            </div>
          </div>

          <div className="flex gap-6 mt-6">
            {/* Main Content */}
            <div className="flex-1">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMarkQuestion(currentQuestion)}
                    >
                      <Flag className={cn(
                        "h-4 w-4 mr-2",
                        markedQuestions.has(currentQuestion) ? "text-amber-500" : "text-muted-foreground"
                      )} />
                      {markedQuestions.has(currentQuestion) ? "Unmark" : "Mark"}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <p className="text-lg">{questions[currentQuestion].text}</p>
                    </div>

                    <RadioGroup 
                      value={answers[currentQuestion]?.toString()}
                      onValueChange={(value: string) => handleAnswerSelect(currentQuestion, parseInt(value))}
                      className="space-y-4"
                    >
                      {questions[currentQuestion].options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="text-base">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestion === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                      disabled={currentQuestion === questions.length - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="w-64 border-l bg-gray-50 p-4 pt-8 hidden md:block">
              <div className="space-y-6">
                {/* Question Navigation */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Questions</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                          currentQuestion === index
                            ? "bg-primary text-primary-foreground"
                            : answers[index] !== undefined
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        )}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Status */}
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Status</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></div>
                    <span>Answered ({Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-200"></div>
                    <span>Unanswered ({questions.length - Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary/10 border border-primary/20"></div>
                    <span>Marked ({markedQuestions.size})</span>
                  </div>
                </div>
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

// Server Component
export default function TestTakingPage() {
  const params = useParams();
  const testId = params?.id as string;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientTestTakingPage testId={testId} />
    </Suspense>
  );
} 