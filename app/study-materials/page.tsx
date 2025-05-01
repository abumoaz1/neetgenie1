"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Video, 
  ChevronRight,
  Search,
  Calendar,
  ExternalLink,
  User
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { AIAssistant } from "@/components/ai-assistant";
import { useStudyMaterialsHook } from "@/hooks/use-study-materials";
import { VideoPlayer } from "@/components/video-player";
import styles from "./styles/markdown.module.css";
import { useRouter } from "next/navigation";

export default function StudyMaterialsPage() {
  const {
    materials,
    filters,
    setFilters,
    isLoading,
    error,
    fetchMaterialById,
    fetchMaterialContent,
    downloadMaterial,
    materialContent,
    selectedMaterial,
  } = useStudyMaterialsHook();

  const router = useRouter();

  const handleViewMaterial = (materialId: number, materialType: string) => {
    if (materialType === 'pdf') {
      downloadMaterial(materialId);
    } else {
      // Navigate to the dedicated study material page
      router.push(`/study-materials/${materialId}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    });
  };

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
                All Types
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
              ) : error ? (
                <Card className="p-6">
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-2">Error loading study materials</p>
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                </Card>
              ) : materials.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No study materials found.</p>
                </div>
              ) : (
                materials.map((material) => (
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-row gap-4">
                        {/* Thumbnail or Icon */}
                        <div className="shrink-0">
                          {material.material_type === "video" && material.content_url ? (
                            <VideoPlayer 
                              videoUrl={material.content_url} 
                              title={material.title}
                              thumbnail={material.thumbnail_url || undefined}
                              compact={true}
                            />
                          ) : (
                            <div className="w-32 h-24 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-8 w-8 text-primary" />
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header with title, subject, and chapter */}
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-base truncate">{material.title}</h3>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="secondary" className="text-xs">{material.subject}</Badge>
                            <Badge variant="outline" className="text-xs">{material.chapter}</Badge>
                            <Badge variant={material.material_type === "video" ? "default" : "secondary"} className="text-xs">
                              {material.material_type === "video" ? "Video" : "Notes"}
                            </Badge>
                          </div>
                          
                          {/* Description */}
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {material.description}
                          </p>
                          
                          {/* Footer with metadata */}
                          <div className="flex items-center justify-between flex-wrap mt-auto">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(material.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{material.uploader.name}</span>
                              </div>
                            </div>
                            
                            {/* Action button */}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleViewMaterial(material.id, material.material_type)}
                            >
                              {material.material_type === 'pdf' ? 'Download PDF' : 'View Content'}
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Selected Material Content */}
            {selectedMaterial && materialContent && (
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-2">{selectedMaterial.title}</h3>
                    <div className="text-sm text-muted-foreground mb-4">
                      {selectedMaterial.description}
                    </div>
                    {/* Notes (MDX), Summary, and Tip content */}
                    {(selectedMaterial.material_type === 'note' || 
                      selectedMaterial.material_type === 'summary' || 
                      selectedMaterial.material_type === 'tip') && (
                      <div>
                        {/* Render MDX content with proper styling using CSS module */}
                        <div 
                          dangerouslySetInnerHTML={{ __html: materialContent }} 
                          className={styles["markdown-content"]}
                        />
                      </div>
                    )}
                    {/* Video content */}
                    {selectedMaterial.material_type === 'video' && (
                      <VideoPlayer videoUrl={materialContent} title={selectedMaterial.title} />
                    )}
                    {/* PDF content - display as a preview or download link */}
                    {selectedMaterial.material_type === 'pdf' && (
                      <div className="text-center p-4 border rounded-md">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <p className="mb-4">PDF document available for download</p>
                        <Button 
                          onClick={() => downloadMaterial(selectedMaterial.id)}
                          variant="outline"
                        >
                          Download PDF
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

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