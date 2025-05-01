"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileText, 
  Calendar,
  User,
  Loader2
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import { VideoPlayer } from "@/components/video-player";
import { endpoints, apiRequest } from "@/lib/baseUrl";
import styles from "../styles/markdown.module.css";

interface StudyMaterial {
  id: number;
  title: string;
  subject: string;
  chapter: string;
  material_type: string;
  description: string;
  content_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  uploader: {
    id: number;
    name: string;
    role: string;
  };
}

export default function StudyMaterialDetailPage() {
  const router = useRouter();
  const params = useParams();
  const materialId = params.id;
  
  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMaterial() {
      try {
        setIsLoading(true);
        
        // Fetch material details
        const materialResponse = await apiRequest.get(`${endpoints.getStudyMaterialById}${materialId}`);
        setMaterial(materialResponse.study_material);
        
        // Fetch material content based on its type
        if (materialResponse.study_material.material_type !== 'pdf') {
          const contentResponse = await apiRequest.get(`${endpoints.getStudyMaterialContent}${materialId}/content`);
          console.log('Content response:', contentResponse);
          
          if (contentResponse.content) {
            setContent(contentResponse.content);
          } else if (contentResponse.text_content) {
            setContent(contentResponse.text_content);
          } else if (contentResponse.video_url) {
            setContent(contentResponse.video_url);
          } else {
            console.warn('No content found in response', contentResponse);
            setContent('No content available for this material.');
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching study material:', err);
        setError('Failed to load study material. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    if (materialId) {
      fetchMaterial();
    }
  }, [materialId]);

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(`${endpoints.downloadStudyMaterial}${materialId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${material?.title || 'material'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF. Please try again.');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading study material...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="container py-8">
            <div className="max-w-md mx-auto text-center p-6 border rounded-lg shadow-md">
              <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Error Loading Material</h2>
              <p className="text-muted-foreground mb-6">{error || "Study material not found"}</p>
              <Button onClick={() => router.push('/study-materials')}>
                Back to Study Materials
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container py-8">
          {/* Back button */}
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6 pl-0 flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => router.push('/study-materials')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Study Materials
            </Button>
          </div>

          {/* Material Header */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{material.title}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{material.subject}</Badge>
                  <Badge variant="outline">{material.chapter}</Badge>
                  <Badge variant="default" className="capitalize">{material.material_type}</Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(material.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{material.uploader.name}</span>
                  </div>
                </div>
              </div>

              {material.material_type === 'pdf' && (
                <Button onClick={handleDownloadPdf}>
                  Download PDF
                </Button>
              )}
            </div>
            
            <p className="text-lg text-muted-foreground">{material.description}</p>
          </div>

          {/* Material Content */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              {material.material_type === 'video' && content ? (
                <div className="aspect-video mb-4">
                  <VideoPlayer 
                    videoUrl={content} 
                    title={material.title}
                    thumbnail={material.thumbnail_url || undefined}
                  />
                </div>
              ) : material.material_type === 'pdf' ? (
                <div className="text-center p-8 border rounded-md">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h2 className="text-xl font-medium mb-2">PDF Document</h2>
                  <p className="mb-6 text-muted-foreground">
                    This material is available as a PDF document
                  </p>
                  <Button onClick={handleDownloadPdf}>
                    Download PDF
                  </Button>
                </div>
              ) : (
                <div className={styles["markdown-content"]}>
                  {content ? (
                    <div className="mx-auto max-w-3xl">
                      <ReactMarkdown 
                        children={content} 
                        rehypePlugins={[rehypeRaw, rehypeSanitize]} 
                        remarkPlugins={[remarkGfm]} 
                      />
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No content available for this study material.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}