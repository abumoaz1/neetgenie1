"use client";

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Printer,
  BookOpen,
  Check,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';
import ProtectedRoute from '@/components/protected-route';
import { useStudyPlans, StudyPlanData } from '@/store/study-plans';
import { useStudyPlan } from '@/hooks/use-study-plan';
import { useReactToPrint } from 'react-to-print';

// Dynamic import html2pdf to ensure it only loads on the client side
const Html2Pdf = dynamic(() => import('html2pdf.js'), { ssr: false });

export default function StudyPlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params?.id as string;
  const { plans, setPlans } = useStudyPlans();
  const [plan, setPlan] = useState<StudyPlanData | null>(null);
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const { fetchStudyPlanById, isLoading, error } = useStudyPlan();

  useEffect(() => {
    if (planId) {
      const foundPlan = plans.find(p => p.id === planId);
      if (foundPlan) {
        setPlan(foundPlan);
      } else {
        // If plan is not in state, fetch it from the API using the new hook method
        fetchPlanFromAPI(planId);
      }
    }
  }, [planId, plans]);

  const fetchPlanFromAPI = async (id: string) => {
    try {
      const fetchedPlan = await fetchStudyPlanById(id);
      
      if (fetchedPlan) {
        // Set the plan in the current component state
        setPlan(fetchedPlan);
        
        // Also update the global store with this plan
        if (!plans.some(p => p.id === fetchedPlan.id)) {
          setPlans([...plans, fetchedPlan]);
        }
      } else if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error fetching study plan:", err);
      toast({
        title: "Error",
        description: "Failed to load the study plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Recently';
    }
  };

  const handleCopyToClipboard = () => {
    if (!plan) return;
    
    const planText = `
NEET Study Plan for ${plan.overview.duration_days} days
Daily Study Hours: ${plan.overview.study_hours_per_day} hours
Focus Areas: ${plan.overview.weak_topics.join(', ')}
Strong Areas: ${plan.overview.strong_topics.join(', ')}

Daily Schedule:
- Morning (${plan.daily_schedule.morning.duration}): ${plan.daily_schedule.morning.focus}
- Midday (${plan.daily_schedule.midday.duration}): ${plan.daily_schedule.midday.focus}
- Afternoon (${plan.daily_schedule.afternoon.duration}): ${plan.daily_schedule.afternoon.focus}

Key Principles:
${plan.key_principles.map(principle => `- ${principle}`).join('\n')}

Weekly Plan Overview:
${plan.weekly_plans.map(week => `
Week ${week.week_number}: ${week.title}
Goal: ${week.goal}
`).join('\n')}

Final Advice:
${plan.final_advice}
    `;
    
    navigator.clipboard.writeText(planText);
    toast({
      title: "Copied to clipboard",
      description: "Study plan summary has been copied to clipboard.",
    });
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `NEET Study Plan - ${formatDate(plan?.createdAt || '')}`,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  const handleExportPdf = () => {
    if (!printRef.current || typeof window === 'undefined') return;

    // Use the dynamically imported Html2Pdf
    if (Html2Pdf) {
      const element = printRef.current;
      const opt = {
        margin: 10,
        filename: `NEET-Study-Plan-${formatDate(plan?.createdAt || '')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      Html2Pdf().from(element).set(opt).save();
      
      toast({
        title: "PDF Export Started",
        description: "Your study plan is being exported as PDF.",
      });
    } else {
      toast({
        title: "PDF Export Failed",
        description: "PDF export functionality is not available.",
        variant: "destructive"
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-1 pt-16">
            <div className="container px-4 py-6 sm:px-6 lg:px-8 sm:py-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <h1 className="text-2xl font-bold mb-4">Loading Study Plan</h1>
                <p className="text-muted-foreground mb-6">Please wait while we fetch your study plan...</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  // If plan is not found
  if (!plan) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-1 pt-16">
            <div className="container px-4 py-6 sm:px-6 lg:px-8 sm:py-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <h1 className="text-2xl font-bold mb-4">Study Plan Not Found</h1>
                <p className="text-muted-foreground mb-6">The study plan you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => router.push('/study-plans')}>
                  Go Back to Study Plans
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="container px-4 py-6 sm:px-6 lg:px-8 sm:py-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors group"
              onClick={() => router.push('/study-plans')}
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-white shadow-sm group-hover:bg-blue-50 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="font-medium">Back to Study Plans</span>
            </Button>

            {/* Plan Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-slate-100">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    {plan.overview.exam_name} Study Plan ({plan.overview.duration_days} days)
                  </h1>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {plan.overview.exam_name}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>Created on {formatDate(plan.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPdf}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-50">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Study Hours Per Day</p>
                    <p className="font-medium">{plan.overview.study_hours_per_day} hours</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-green-50">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Study Duration</p>
                    <p className="font-medium">{plan.overview.duration_days} days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-amber-50">
                    <Check className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Focus Areas</p>
                    <p className="font-medium">{plan.overview.weak_topics.length} topics</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Printable Study Plan Content */}
            <div ref={printRef} className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-slate-100 ${isPrinting ? 'print-mode' : ''}`}>
              {/* Print Header (only visible when printing) */}
              <div className="hidden print:block mb-6">
                <h1 className="text-2xl font-bold text-center">{plan.overview.exam_name} Study Plan</h1>
                <p className="text-center text-slate-600">Created on {formatDate(plan.createdAt)}</p>
                <div className="flex justify-center mt-2 space-x-4">
                  <p><strong>Duration:</strong> {plan.overview.duration_days} days</p>
                  <p><strong>Daily Hours:</strong> {plan.overview.study_hours_per_day} hours</p>
                </div>
              </div>

              {/* Daily Schedule */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Daily Schedule</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Morning</h3>
                      <p className="text-sm text-slate-700 mb-1">
                        <span className="font-medium">Duration:</span> {plan.daily_schedule.morning.duration}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Focus:</span> {plan.daily_schedule.morning.focus}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Midday</h3>
                      <p className="text-sm text-slate-700 mb-1">
                        <span className="font-medium">Duration:</span> {plan.daily_schedule.midday.duration}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Focus:</span> {plan.daily_schedule.midday.focus}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-50 border-amber-100">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Afternoon</h3>
                      <p className="text-sm text-slate-700 mb-1">
                        <span className="font-medium">Duration:</span> {plan.daily_schedule.afternoon.duration}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Focus:</span> {plan.daily_schedule.afternoon.focus}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Key Principles */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Key Principles</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {plan.key_principles.map((principle, idx) => (
                    <li key={idx} className="text-slate-700">{principle}</li>
                  ))}
                </ul>
              </div>

              {/* Study Resources */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Recommended Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Essential Resources</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {plan.resources.essential.map((resource, idx) => (
                          <li key={idx} className="text-sm text-slate-700">{resource}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Reference Books</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {plan.resources.reference.map((resource, idx) => (
                          <li key={idx} className="text-sm text-slate-700">{resource}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Practice Resources</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {plan.resources.practice.map((resource, idx) => (
                          <li key={idx} className="text-sm text-slate-700">{resource}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Online Resources</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {plan.resources.online.map((resource, idx) => (
                          <li key={idx} className="text-sm text-slate-700">{resource}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Weekly Plans */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Weekly Plans</h2>
                
                <div className="space-y-6">
                  {plan.weekly_plans.map((week) => (
                    <Card key={week.week_number} className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">Week {week.week_number}: {week.title}</h3>
                            <p className="text-slate-600 text-sm">Goal: {week.goal}</p>
                          </div>
                          <Badge className={`mt-2 sm:mt-0 ${week.week_number <= 3 ? 'bg-blue-100 text-blue-800' : week.week_number <= 6 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {week.week_number <= 3 ? 'Foundation' : week.week_number <= 6 ? 'Development' : 'Mastery'}
                          </Badge>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-2 font-medium text-slate-700">Day</th>
                                <th className="text-left py-2 px-2 font-medium text-slate-700">Subject</th>
                                <th className="text-left py-2 px-2 font-medium text-slate-700">Topic</th>
                                <th className="text-left py-2 px-2 font-medium text-slate-700 hidden md:table-cell">Activities</th>
                                <th className="text-left py-2 px-2 font-medium text-slate-700 hidden md:table-cell">Resources</th>
                              </tr>
                            </thead>
                            <tbody>
                              {week.days.map((day) => (
                                <tr key={day.day_number} className="border-b hover:bg-slate-50">
                                  <td className="py-2 px-2">Day {day.day_number}</td>
                                  <td className="py-2 px-2">{day.subject}</td>
                                  <td className="py-2 px-2">{day.topic}</td>
                                  <td className="py-2 px-2 hidden md:table-cell">{day.activities}</td>
                                  <td className="py-2 px-2 hidden md:table-cell">{day.resources}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Responsive view for mobile - only visible on small screens */}
                        <div className="md:hidden mt-4 space-y-4">
                          {week.days.map((day) => (
                            <div key={day.day_number} className="border-b pb-3">
                              <p className="font-medium">Day {day.day_number} - {day.subject}</p>
                              <p className="text-slate-600 mt-1"><span className="font-medium">Topic:</span> {day.topic}</p>
                              <p className="text-slate-600 mt-1"><span className="font-medium">Activities:</span> {day.activities}</p>
                              <p className="text-slate-600 mt-1"><span className="font-medium">Resources:</span> {day.resources}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4">
                    <ul className="list-disc pl-5 space-y-2">
                      {plan.important_notes.map((note, idx) => (
                        <li key={idx} className="text-slate-700">{note}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Final Advice */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Final Advice</h2>
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-4">
                    <p className="text-slate-700">{plan.final_advice}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Focus & Strong Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.overview.weak_topics.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Focus Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {plan.overview.weak_topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="bg-red-50 text-red-700 border-red-100">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {plan.overview.strong_topics.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Strong Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {plan.overview.strong_topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-mode, .print-mode * {
            visibility: visible;
          }
          .print-mode {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>
    </ProtectedRoute>
  );
}