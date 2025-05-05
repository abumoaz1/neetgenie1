"use client";

import React, { useEffect, useState } from "react";
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
  User,
  BookOpenCheck,
  Clock,
  ArrowLeft,
  Filter,
  Eye,
  Heart,
  Bookmark,
  BookMarked,
  FileQuestion,
  Download,
  Book,
  Microscope,
  Brain,
  Atom,
  TestTube,
  Dna,
  Bot
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { useStudyMaterialsHook } from "@/hooks/use-study-materials";
import { VideoPlayer } from "@/components/video-player";
import styles from "./styles/markdown.module.css";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ProtectedRoute from "@/components/protected-route";

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
  const [searchTerm, setSearchTerm] = useState<string>("");

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
  
  // Function to get icon based on material type and subject
  const getMaterialIcon = (materialType: string, subject?: string) => {
    // Define possible icons for each category
    const noteIcons = [BookOpen, FileText, BookMarked, Book];
    const videoIcons = [Video, Eye];
    const physicsIcons = [Atom, TestTube];
    const biologyIcons = [Brain, Microscope, Dna];
    const chemistryIcons = [TestTube, Atom, FileQuestion];
    
    // Pick random icon from array
    const pickRandomIcon = (icons: any[]) => icons[Math.floor(Math.random() * icons.length)];
    
    // Base style for all materials
    let style = {
      icon: pickRandomIcon(noteIcons),
      color: "text-blue-700",
      bg: "bg-blue-100",
      gradientFrom: "from-blue-200",
      gradientTo: "to-blue-50"
    };
    
    // Set icon and colors based on material type
    if (materialType === 'video') {
      style.icon = pickRandomIcon(videoIcons);
      style.color = "text-purple-700";
      style.bg = "bg-purple-100";
      style.gradientFrom = "from-purple-200";
      style.gradientTo = "to-purple-50";
    } else if (materialType === 'pdf') {
      style.icon = FileText;
      style.color = "text-red-700";
      style.bg = "bg-red-100";
      style.gradientFrom = "from-red-200";
      style.gradientTo = "to-red-50";
    }
    
    // Override based on subject if present
    if (subject) {
      const subjectLower = subject.toLowerCase();
      if (subjectLower.includes('physics')) {
        style.icon = pickRandomIcon(physicsIcons);
        style.color = "text-indigo-700";
        style.bg = "bg-indigo-100";
        style.gradientFrom = "from-indigo-200";
        style.gradientTo = "to-indigo-50";
      } else if (subjectLower.includes('biology') || subjectLower.includes('botany') || subjectLower.includes('zoology')) {
        style.icon = pickRandomIcon(biologyIcons);
        style.color = "text-green-700";
        style.bg = "bg-green-100";
        style.gradientFrom = "from-green-200";
        style.gradientTo = "to-green-50";
      } else if (subjectLower.includes('chemistry')) {
        style.icon = pickRandomIcon(chemistryIcons);
        style.color = "text-amber-700";
        style.bg = "bg-amber-100";
        style.gradientFrom = "from-amber-200";
        style.gradientTo = "to-amber-50";
      }
    }
    
    return style;
  };

  // Filter materials based on search term and type filter
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = searchTerm === "" || 
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = filters.type === 'all' || 
      (filters.type === 'notes' && material.material_type === 'note') ||
      (filters.type === 'video' && material.material_type === 'video');
      
    return matchesSearch && matchesType;
  });

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
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">Study Materials</h1>
              <p className="text-base sm:text-lg text-slate-600">
                Access comprehensive study materials, notes, and video lectures for your NEET preparation
              </p>
            </div>

            {/* Statistics Overview */}
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-lg overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-blue-50">
                      <BookOpen className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Total Notes</p>
                      <h3 className="font-semibold text-xl sm:text-2xl text-slate-800">
                        {materials.filter(m => m.material_type !== 'video').length}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-lg overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-purple-50">
                      <Video className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Video Lectures</p>
                      <h3 className="font-semibold text-xl sm:text-2xl text-slate-800">
                        {materials.filter(m => m.material_type === 'video').length}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-lg overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-green-50">
                      <Eye className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Recently Viewed</p>
                      <h3 className="font-semibold text-xl sm:text-2xl text-slate-800">3</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-lg overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-red-50">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">Bookmarked</p>
                      <h3 className="font-semibold text-xl sm:text-2xl text-slate-800">5</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Materials Section */}
            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6">
              <Tabs defaultValue="all" className="space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <TabsList className="bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="all" 
                      className="rounded-md text-slate-700 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2"
                      onClick={() => setFilters({ type: 'all' })}
                    >
                      All Materials
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notes" 
                      className="rounded-md text-slate-700 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2"
                      onClick={() => setFilters({ type: 'notes' })}
                    >
                      Notes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="videos" 
                      className="rounded-md text-slate-700 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2"
                      onClick={() => setFilters({ type: 'video' })}
                    >
                      Videos
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search materials..." 
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

                <TabsContent value="all" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="text-center py-10">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading study materials...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                  ) : filteredMaterials.length === 0 ? (
                    <div className="text-center py-10 text-slate-600">No study materials found matching your search criteria</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredMaterials.map((material) => {
                        const { icon: Icon, color, bg, gradientFrom, gradientTo } = getMaterialIcon(material.material_type, material.subject);
                        return (
                          <div key={material.id} className="relative">
                            <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 rounded-xl overflow-hidden h-64 flex flex-col">
                              <div className={`absolute bottom-0 right-0 opacity-10 w-40 h-40 ${color}`}>
                                <Icon className="w-full h-full" />
                              </div>
                              <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-20`}></div>
                              <CardContent className="p-5 flex flex-col h-full relative z-10">
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-3">
                                    <Badge variant="outline" className="bg-slate-50 text-xs font-medium text-slate-700">
                                      {material.subject}
                                    </Badge>
                                    <Badge variant="outline" className={`${bg} ${color} border-0 text-xs`}>
                                      {material.material_type === 'video' ? 'Video' : 
                                      material.material_type === 'pdf' ? 'PDF' : 'Notes'}
                                    </Badge>
                                  </div>
                                  <h3 className="font-semibold text-xl text-slate-800 mb-2">{material.title}</h3>
                                  <p className="text-sm text-slate-600 line-clamp-2">{material.description}</p>
                                </div>
                                
                                <div className="mt-2 pt-2 border-t border-slate-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-slate-500" />
                                      <span className="text-xs text-slate-700">{formatDate(material.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-slate-500" />
                                      <span className="text-xs text-slate-700">{material.uploader?.name || "Admin"}</span>
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    className="w-full bg-primary hover:bg-primary/90 text-white"
                                    onClick={() => handleViewMaterial(material.id, material.material_type)}
                                  >
                                    {material.material_type === 'pdf' ? (
                                      <span className="flex items-center gap-1">
                                        <Download className="h-4 w-4" /> Download PDF
                                      </span>
                                    ) : material.material_type === 'video' ? 'Watch Video' : 'Read Notes'}
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

                <TabsContent value="notes" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="text-center py-10">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading notes...</p>
                    </div>
                  ) : filteredMaterials.length === 0 ? (
                    <div className="text-center py-10 text-slate-600">No notes found matching your search criteria</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Content for notes tab - dynamically populated based on filter */}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="videos" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="text-center py-10">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading videos...</p>
                    </div>
                  ) : filteredMaterials.length === 0 ? (
                    <div className="text-center py-10 text-slate-600">No videos found matching your search criteria</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Content for videos tab - dynamically populated based on filter */}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Note about AI Assistant moved to sidebar */}
            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Need help with your studies?</h2>
              <p className="text-slate-600 mb-4">The NEETgenie AI Assistant is now available in the sidebar to help with your questions anytime.</p>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Bot className="h-5 w-5" />
                <span className="font-medium">Click the AI Assistant button in the sidebar</span>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </ProtectedRoute>
  );
}