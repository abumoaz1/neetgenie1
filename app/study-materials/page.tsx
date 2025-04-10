"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Video, 
  ChevronRight,
  Search,
  Clock
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { AIAssistant } from "@/components/ai-assistant";
import { useStudyMaterialsHook } from "@/hooks/use-study-materials";

export default function StudyMaterialsPage() {
  const { materials, filters, setFilters, isLoading } = useStudyMaterialsHook();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container px-4 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Study Materials</h1>
            <p className="text-muted-foreground">
              Access comprehensive study materials, notes, and video lectures for your NEET preparation.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search study materials..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filters.type === 'all' ? 'default' : 'outline'}
                onClick={() => setFilters({ type: 'all' })}
              >
                All Subjects
              </Button>
              <Button 
                variant={filters.type === 'notes' ? 'default' : 'outline'}
                onClick={() => setFilters({ type: 'notes' })}
              >
                Notes
              </Button>
              <Button 
                variant={filters.type === 'video' ? 'default' : 'outline'}
                onClick={() => setFilters({ type: 'video' })}
              >
                Videos
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Study Materials List */}
            <div className="lg:col-span-2 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : materials.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No study materials found.</p>
                </div>
              ) : (
                materials.map((material: { 
                  id: number;
                  title: string;
                  subject: string;
                  type: string;
                  description: string;
                  pages?: number;
                  duration?: string;
                  rating: number;
                }) => (
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {material.type === "video" ? (
                            <Video className="h-6 w-6 text-primary" />
                          ) : (
                            <FileText className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{material.title}</h3>
                            <Badge variant="secondary">{material.subject}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {material.description}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              {material.type === "video" ? (
                                <>
                                  <Clock className="h-4 w-4" />
                                  <span>{material.duration}</span>
                                </>
                              ) : (
                                <>
                                  <BookOpen className="h-4 w-4" />
                                  <span>{material.pages} pages</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <span>★</span>
                              <span>{material.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* AI Assistant */}
            <div className="lg:col-span-1">
              <AIAssistant />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
} 