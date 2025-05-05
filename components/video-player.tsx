"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnail?: string;
  compact?: boolean;
}

// Function to extract YouTube video ID from various YouTube URL formats
const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, thumbnail, compact = false }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const videoId = extractYouTubeId(videoUrl);
  
  // Default thumbnail if none provided
  const displayThumbnail = thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null);
  
  // Handle invalid or non-YouTube URLs
  if (!videoId) {
    return (
      <div className={`relative ${compact ? 'w-32 h-24' : 'aspect-video'} bg-muted rounded-lg flex items-center justify-center`}>
        <p className="text-center p-2 text-xs text-muted-foreground">Invalid video URL</p>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`relative ${compact ? 'w-32 h-24' : 'aspect-video'} rounded-lg cursor-pointer overflow-hidden group`}>
          {displayThumbnail ? (
            <img 
              src={displayThumbnail} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} rounded-full bg-white flex items-center justify-center`}>
              <div className={`${compact ? 'border-y-6 border-l-9 translate-x-0.5' : 'border-y-8 border-y-transparent border-l-12 translate-x-0.5'} w-0 h-0 border-y-transparent border-l-red-600`}></div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] w-[90vw] p-1 sm:p-2 overflow-hidden">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="relative w-full pt-[56.25%]">
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <DialogFooter className="p-3 flex items-center justify-between flex-row">
          <div className="text-base truncate">{title}</div>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
          >
            Open in YouTube <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};