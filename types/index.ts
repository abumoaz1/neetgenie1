export interface StudyMaterial {
  id: number;
  title: string;
  subject: string;
  chapter: string;
  material_type: 'note' | 'video';
  description: string;
  text_content: string | null;
  content_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  uploader: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
  }
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIAssistantState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface StudyMaterialsState {
  materials: StudyMaterial[];
  filters: {
    subject: string | null;
    type: 'all' | 'notes' | 'video';
    search: string;
  };
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  score: number;
  totalMarks: number;
  timeTaken: number;
  answers: Record<number, number>;
  createdAt: Date;
}

export interface Test {
  id: string;
  name: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}