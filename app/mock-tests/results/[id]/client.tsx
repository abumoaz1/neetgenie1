"use client";

import React from "react";
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
  BarChart2
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { useRouter } from "next/navigation";

interface ClientResultsPageProps {
  testId: string;
}

export default function ClientResultsPage({ testId }: ClientResultsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const total = searchParams.get("total");

  // Mock data - replace with actual API call
  const result = {
    score: 85,
    totalMarks: 100,
    timeTaken: "1 hour 30 minutes",
    correctAnswers: 34,
    totalQuestions: 40,
    subjectWise: [
      { subject: "Physics", score: 28, total: 30 },
      { subject: "Chemistry", score: 27, total: 30 },
      { subject: "Biology", score: 30, total: 40 }
    ]
  };

  const handleBack = () => {
    router.push("/mock-tests");
  };

  const calculatePercentage = (score: number, total: number) => {
    return ((score / total) * 100).toFixed(1);
  };

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
                onClick={() => router.push("/mock-tests")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Test Results</h1>
                <p className="text-muted-foreground">Test ID: {testId}</p>
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
                      <h2 className="text-2xl font-bold">{result.score}/{result.totalMarks}</h2>
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
                      <h2 className="text-2xl font-bold">{result.timeTaken}</h2>
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
                      <h2 className="text-2xl font-bold">{result.correctAnswers}/{result.totalQuestions}</h2>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject-wise Performance */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Subject-wise Performance</h2>
              {result.subjectWise.map((subject) => (
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
                        {Math.round((subject.score / subject.total) * 100)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
} 