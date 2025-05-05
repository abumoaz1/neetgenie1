"use client";

import React, { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowLeft,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';
import ProtectedRoute from '@/components/protected-route';
import { StudyPlanGenerator } from '@/components/study-plan-generator';
import { useStudyPlans } from '@/store/study-plans';
import { useStudyPlan } from '@/hooks/use-study-plan';
import { useToast } from '@/components/ui/use-toast';
import StudyPlanCard from '@/components/study-plan-card';

export default function StudyPlansPage() {
  const { plans } = useStudyPlans();
  const { fetchStudyPlans, isLoading, deleteStudyPlan } = useStudyPlan();
  const [showStudyPlanGenerator, setShowStudyPlanGenerator] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  // Use useCallback to memoize the loadPlans function
  const loadPlans = useCallback(async () => {
    try {
      await fetchStudyPlans();
    } catch (error) {
      console.error('Error loading study plans:', error);
    }
  }, [fetchStudyPlans]);

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (planId: number) => {
    setPlanToDelete(planId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (planToDelete) {
      try {
        await deleteStudyPlan(planToDelete);
        toast({
          title: "Success",
          description: "Study plan deleted successfully",
        });
        await loadPlans();
      } catch (error) {
        console.error('Error deleting study plan:', error);
        toast({
          title: "Error",
          description: "Failed to delete study plan",
          variant: "destructive",
        });
      } finally {
        setDeleteConfirmOpen(false);
        setPlanToDelete(null);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="container px-4 py-6 sm:px-6 lg:px-8 sm:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {/* Back Button */}
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors group"
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-white shadow-sm group-hover:bg-blue-50 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="font-medium">Back to Dashboard</span>
            </Link>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">Study Plans</h1>
                <p className="text-base sm:text-lg text-slate-600">
                  Access and manage your personalized NEET preparation study plans
                </p>
              </div>
              <Button 
                className="flex items-center gap-2" 
                onClick={() => setShowStudyPlanGenerator(true)}
              >
                <Plus className="h-4 w-4" />
                Create New Plan
              </Button>
            </div>

            {/* Plans List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {isLoading ? (
                <Card className="bg-white border-slate-100 shadow-sm p-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </Card>
              ) : plans.length === 0 ? (
                <Card className="bg-white border-slate-100 shadow-sm col-span-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Study Plans Yet</h3>
                    <p className="text-slate-600 mb-6">
                      Create your first personalized study plan to organize your NEET preparation
                    </p>
                    <Button 
                      className="flex items-center gap-2 mx-auto"
                      onClick={() => setShowStudyPlanGenerator(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Create New Plan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                plans.map((plan) => (
                  <StudyPlanCard
                    key={plan.id}
                    id={parseInt(plan.id)}
                    title={plan.overview?.exam_name || "NEET Study Plan"}
                    description={
                      plan.overview?.key_principles && plan.overview.key_principles.length > 0 
                        ? plan.overview.key_principles[0].substring(0, 80) + "..."
                        : undefined
                    }
                    examName={plan.overview?.exam_name || "NEET"}
                    duration={plan.overview?.duration_days || plan.days_left || 60}
                    hoursPerDay={plan.overview?.study_hours_per_day || 4}
                    weakTopics={plan.overview?.weak_topics}
                    createdAt={plan.createdAt}
                    weeklyPlansCount={plan.weekly_plans?.length}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
        
        {/* Study Plan Generator Dialog */}
        <Dialog open={showStudyPlanGenerator} onOpenChange={setShowStudyPlanGenerator}>
          <DialogContent className="max-w-4xl p-0 sm:p-0">
            <DialogTitle className="sr-only">Study Plan Generator</DialogTitle>
            <StudyPlanGenerator />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Study Plan</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this study plan? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-3 py-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-sm text-slate-700">
                All your study plan data, including weekly schedules and resources, will be permanently removed.
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}