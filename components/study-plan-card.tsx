import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  BookOpenCheck,
  Trash2,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface StudyPlanCardProps {
  id: number;
  title: string;
  description?: string;
  examName: string;
  duration: number;
  hoursPerDay: number;
  weakTopics?: string[];
  createdAt: string;
  weeklyPlansCount?: number;
  onDelete: (id: number) => void;
}

export default function StudyPlanCard({
  id,
  title,
  description,
  examName,
  duration,
  hoursPerDay,
  weakTopics,
  createdAt,
  weeklyPlansCount = 8,
  onDelete
}: StudyPlanCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Recently';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking delete
    e.stopPropagation(); // Prevent event bubbling
    onDelete(id);
  };

  return (
    <div className="relative group">
      <Link href={`/study-plans/${id}`}>
        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 rounded-xl overflow-hidden h-64 flex flex-col">
          <div className="absolute bottom-0 right-0 opacity-10 w-40 h-40 text-blue-700">
            <BookOpenCheck className="w-full h-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-50 opacity-20"></div>
          <CardContent className="p-5 flex flex-col h-full relative z-10">
            <div className="flex-1">
              <Badge variant="outline" className="mb-3 bg-slate-50 text-xs font-medium text-slate-700">
                {examName}
              </Badge>
              <h3 className="font-semibold text-xl text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">
                {description || "Personalized study plan based on your goals and available time."}
              </p>
            </div>
            
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">{hoursPerDay} hrs/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">{formatDate(createdAt)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                View Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}