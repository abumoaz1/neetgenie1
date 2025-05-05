"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  BookOpenCheck, 
  Calendar, 
  Clock, 
  Filter, 
  FlaskConical, 
  Search, 
  Sparkles, 
  Star, 
  Timer,
  Atom, 
  Brain, 
  Dna, 
  GraduationCap, 
  Heart, 
  Leaf, 
  Microscope, 
  Pill,
  TestTube,
  Flower2,
  TreeDeciduous,
  Sprout,
  Droplets,
  PawPrint,
  Rabbit,
  Bug,
  Feather,
  Orbit,
  CircleDot,
  Telescope,
  Scale,
  Zap,
  Activity,
  Eye,
  LucideEye,
  Lightbulb,
  FileText,
  BookMarked,
  Syringe,
  Droplet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { endpoints, apiRequest } from "@/lib/baseUrl";
import ProtectedRoute from "@/components/protected-route";

// API test interface based on the response
interface Test {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  created_at: string;
  updated_at: string;
  subject?: string; // Adding subject field
}

// Previous attempt interface (keeping this for the previous attempts tab)
interface PreviousAttempt {
  id: string;
  name: string;
  subject: string;
  duration: string;
  questions: number;
  difficulty: string;
  attempts: number;
  rating: number;
  totalAttempts: number;
  lastAttempt: string;
  score: number;
  totalMarks: number;
}

// Add interface for attempt creation response
interface AttemptResponse {
  id: number;
  user_id: number;
  test_id: number;
  start_time: string;
  end_time: string | null;
  status: string;
}

export default function MockTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Define icon sets for different subjects
  const chemistryIcons = [FlaskConical, TestTube, Atom, Dna, Droplet];
  const biologyIcons = [Leaf, Dna, Heart, Microscope, Brain];
  const botanyIcons = [Leaf, Flower2, TreeDeciduous, Sprout, Droplets];
  const zoologyIcons = [PawPrint, Rabbit, Bug, Microscope, Feather];
  const physicsIcons = [Atom, Orbit, CircleDot, Telescope, Scale];
  const pharmaIcons = [Pill, Dna, Droplet, FlaskConical, Syringe];
  const neuroIcons = [Brain, Zap, Activity, Eye, LucideEye];
  const generalIcons = [GraduationCap, BookOpen, Lightbulb, FileText, BookMarked];
  
  // Function to pick a random icon from an array
  const pickRandomIcon = (icons: any[]) => icons[Math.floor(Math.random() * icons.length)];

  // Get appropriate icon and color for a test based on its title or subject
  const getTestIcon = (title?: string, subject?: string) => {
    const text = (title || subject || "").toLowerCase();
    
    if (text.includes("physics")) {
      const icon = pickRandomIcon(physicsIcons);
      return { icon, bg: "bg-indigo-100", color: "text-indigo-700", gradientFrom: "from-indigo-200", gradientTo: "to-indigo-50" };
    } else if (text.includes("chemistry") || text.includes("chemical")) {
      const icon = pickRandomIcon(chemistryIcons);
      return { icon, bg: "bg-purple-100", color: "text-purple-700", gradientFrom: "from-purple-200", gradientTo: "to-purple-50" };
    } else if (text.includes("biology") || text.includes("botany") || text.includes("plant")) {
      const icon = pickRandomIcon(botanyIcons);
      return { icon, bg: "bg-green-100", color: "text-green-700", gradientFrom: "from-green-200", gradientTo: "to-green-50" };
    } else if (text.includes("zoology") || text.includes("animal") || text.includes("human")) {
      const icon = pickRandomIcon(zoologyIcons);
      return { icon, bg: "bg-pink-100", color: "text-pink-700", gradientFrom: "from-pink-200", gradientTo: "to-pink-50" };
    } else if (text.includes("full") || text.includes("complete") || text.includes("syllabus") || text.includes("neet")) {
      const icon = pickRandomIcon(generalIcons);
      return { icon, bg: "bg-blue-100", color: "text-blue-700", gradientFrom: "from-blue-200", gradientTo: "to-blue-50" };
    } else if (text.includes("anatomy") || text.includes("physiology") || text.includes("digest")) {
      const icon = pickRandomIcon(biologyIcons);
      return { icon, bg: "bg-red-100", color: "text-red-700", gradientFrom: "from-red-200", gradientTo: "to-red-50" };
    } else if (text.includes("biochemistry") || text.includes("molecule")) {
      const icon = pickRandomIcon(chemistryIcons);
      return { icon, bg: "bg-teal-100", color: "text-teal-700", gradientFrom: "from-teal-200", gradientTo: "to-teal-50" };
    } else if (text.includes("neurology") || text.includes("brain")) {
      const icon = pickRandomIcon(neuroIcons);
      return { icon, bg: "bg-amber-100", color: "text-amber-700", gradientFrom: "from-amber-200", gradientTo: "to-amber-50" };
    } else if (text.includes("pharmacology") || text.includes("drug")) {
      const icon = pickRandomIcon(pharmaIcons);
      return { icon, bg: "bg-cyan-100", color: "text-cyan-700", gradientFrom: "from-cyan-200", gradientTo: "to-cyan-50" };
    } else {
      const icon = pickRandomIcon(generalIcons);
      return { icon, bg: "bg-blue-100", color: "text-blue-700", gradientFrom: "from-blue-200", gradientTo: "to-blue-50" };
    }
  };

  // Function to start a test by creating an attempt first
  const startTest = async (testId: number) => {
    try {
      // Create an attempt for this test
      const response = await apiRequest.post(endpoints.createAttempt, {
        test_id: testId
      });
      
      const attemptId = response.id || response.attempt?.id;
      
      if (!attemptId) {
        throw new Error("Failed to create attempt");
      }
      
      // Navigate to test with the attempt ID
      window.location.href = `/mock-tests/take/${testId}?attempt=${attemptId}`;
    } catch (error) {
      console.error("Error starting test:", error);
      alert("Failed to start test. Please try again.");
    }
  };

  // Mock data for previous attempts (keeping this until we have a real API for attempts)
  const previousAttempts: PreviousAttempt[] = [
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
  ];
  
  // Mock test data to match image design
  const mockTests = [
    {
      id: 1,
      title: "NEET Physics Test 1",
      description: "Basic physics concepts for NEET preparation",
      duration_minutes: 45,
      total_questions: 2,
      created_at: "2025-04-27T00:00:00.000Z",
      updated_at: "2025-04-27T00:00:00.000Z",
      subject: "Physics"
    },
    {
      id: 2,
      title: "Biology Test",
      description: "Morphology of flowering plants",
      duration_minutes: 20,
      total_questions: 20,
      created_at: "2025-05-01T00:00:00.000Z",
      updated_at: "2025-05-01T00:00:00.000Z",
      subject: "Botany"
    },
    {
      id: 3,
      title: "Chemistry Test",
      description: "Chemical bonding and molecular structure",
      duration_minutes: 30,
      total_questions: 15,
      created_at: "2025-05-02T00:00:00.000Z",
      updated_at: "2025-05-02T00:00:00.000Z",
      subject: "Chemistry"
    },
    {
      id: 4,
      title: "NEET Complete Mock Test",
      description: "Full-length practice test covering all NEET subjects",
      duration_minutes: 180,
      total_questions: 180,
      created_at: "2025-04-20T00:00:00.000Z",
      updated_at: "2025-04-20T00:00:00.000Z",
      subject: "Full Syllabus"
    },
    {
      id: 5,
      title: "Human Physiology",
      description: "Focuses on digestion and absorption",
      duration_minutes: 25,
      total_questions: 10,
      created_at: "2025-05-02T00:00:00.000Z",
      updated_at: "2025-05-02T00:00:00.000Z",
      subject: "Zoology"
    }
  ];

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        // Attempt to fetch from API first
        try {
          const data = await apiRequest.get(endpoints.getAllTests);
          setTests(data.tests);
        } catch (apiError) {
          // Fall back to mock data if API fails
          console.log("Using mock data due to API error:", apiError);
          setTests(mockTests);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load tests. Please try again later.");
        console.error("Error fetching tests:", err);
        // Fall back to mock data in case of any error
        setTests(mockTests);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Filter tests based on search term
  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="container px-4 py-6 sm:px-6 lg:px-8 sm:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {/* Back Button */}
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors group"
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-white shadow-sm group-hover:bg-blue-50 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="font-medium">Back to Home</span>
            </Link>

            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">Mock Tests</h1>
              <p className="text-base sm:text-lg text-slate-600">
                Practice with our comprehensive NEET mock tests
              </p>
            </div>

            {/* Statistics Overview */}
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-lg overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-blue-50">
                      <Timer className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Total Tests</p>
                      <h3 className="font-semibold text-xl sm:text-2xl text-slate-800">2</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-lg overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-green-50">
                      <Star className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Average Score</p>
                      <h3 className="font-semibold text-xl sm:text-2xl text-slate-800">85%</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-lg overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-purple-50">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Tests Completed</p>
                      <h3 className="font-semibold text-xl sm:text-2xl text-slate-800">1</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-lg overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-amber-50">
                      <Clock className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Time Spent</p>
                      <h3 className="font-semibold text-xl sm:text-2xl text-slate-800">24h</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Test Categories */}
            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6">
              <Tabs defaultValue="available" className="space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <TabsList className="bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="available" 
                      className="rounded-md text-slate-700 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2"
                    >
                      Available Tests
                    </TabsTrigger>
                    <TabsTrigger 
                      value="previous" 
                      className="rounded-md text-slate-700 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2"
                    >
                      Previous Attempts
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search tests..." 
                        className="pl-9 border-slate-200 bg-white text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="shrink-0 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <TabsContent value="available" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="text-center py-10">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading tests...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                  ) : filteredTests.length === 0 ? (
                    <div className="text-center py-10 text-slate-600">No tests found matching your search criteria</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredTests.map((test) => {
                        const { icon: Icon, color, gradientFrom, gradientTo } = getTestIcon(test.title, test.subject);
                        return (
                          <div key={test.id} className="relative">
                            <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 rounded-xl overflow-hidden h-64 flex flex-col">
                              <div className={`absolute bottom-0 right-0 opacity-10 w-40 h-40 ${color}`}>
                                <Icon className="w-full h-full" />
                              </div>
                              <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-20`}></div>
                              <CardContent className="p-5 flex flex-col h-full relative z-10">
                                <div className="flex-1">
                                  <Badge variant="outline" className="mb-3 bg-slate-50 text-xs font-medium text-slate-700">
                                    {test.subject || "General"}
                                  </Badge>
                                  <h3 className="font-semibold text-xl text-slate-800 mb-2">{test.title}</h3>
                                  <p className="text-sm text-slate-600 line-clamp-2">{test.description}</p>
                                </div>
                                
                                <div className="mt-2 pt-2 border-t border-slate-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-slate-500" />
                                      <span className="text-sm text-slate-700">{test.duration_minutes} min</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <BookOpenCheck className="h-4 w-4 text-slate-500" />
                                      <span className="text-sm text-slate-700">{test.total_questions} Questions</span>
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    className="w-full bg-primary hover:bg-primary/90 text-white"
                                    onClick={() => startTest(test.id)}
                                  >
                                    Start Test
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="previous" className="space-y-4 mt-4">
                  {previousAttempts.length === 0 ? (
                    <div className="text-center py-10 text-slate-600">No previous attempts found</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {previousAttempts.map((test) => {
                        const { icon: Icon, color, gradientFrom, gradientTo } = getTestIcon(test.name, test.subject);
                        return (
                          <div key={test.id} className="relative">
                            <Link href={`/mock-tests/results/${test.id}`}>
                              <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 rounded-xl overflow-hidden h-64">
                                <div className={`absolute bottom-0 right-0 opacity-10 w-40 h-40 ${color}`}>
                                  <Icon className="w-full h-full" />
                                </div>
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-20`}></div>
                                <CardContent className="p-5 h-full flex flex-col relative z-10">
                                  <div className="flex-1">
                                    <Badge variant="outline" className="mb-3 bg-slate-50 text-xs font-medium text-slate-700">
                                      {test.subject || "General"}
                                    </Badge>
                                    <h3 className="font-semibold text-xl text-slate-800 mb-2">{test.name}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-sm text-slate-500">Completed on:</span>
                                      <span className="text-sm font-medium">{new Date(test.lastAttempt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="bg-green-50 text-green-800 rounded-lg p-2 text-center mt-2">
                                      <div className="font-semibold">Score: {test.score}/{test.totalMarks}</div>
                                      <div className="text-xs">{Math.round((test.score / test.totalMarks) * 100)}%</div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-500" />
                                        <span className="text-sm text-slate-700">{test.duration}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <BookOpenCheck className="h-4 w-4 text-slate-500" />
                                        <span className="text-sm text-slate-700">{test.questions} Questions</span>
                                      </div>
                                    </div>
                                    
                                    <Button 
                                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800"
                                    >
                                      View Results
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </ProtectedRoute>
  );
}