import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Trash2, Video, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { baseUrl } from '@/lib/baseUrl';

interface StudyMaterialCardProps {
  id: string;
  title: string;
  description: string;
  materialType: 'note' | 'video' | 'pdf' | 'summary' | 'tip';
  subject: string;
  chapter?: string;
  url?: string;
  onDelete: (id: string) => void;
}

export default function StudyMaterialCard({
  id,
  title,
  description,
  materialType,
  subject,
  chapter,
  url,
  onDelete
}: StudyMaterialCardProps) {
  const { toast } = useToast();

  const getIcon = () => {
    switch (materialType) {
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'pdf':
      case 'note':
      case 'summary':
      case 'tip':
      default:
        return <FileText className="h-5 w-5 text-green-500" />;
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking delete
    e.stopPropagation(); // Prevent event bubbling
    
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  return (
    <Card className="bg-white border-slate-100 shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-blue-50 flex-shrink-0">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-medium text-base text-slate-800 mb-1">{title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2 mb-2">{description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {subject}
                </Badge>
                {chapter && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {chapter}
                  </Badge>
                )}
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {materialType.charAt(0).toUpperCase() + materialType.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {url && (
              <Link href={url} target="_blank" passHref>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}