import { create } from 'zustand';

// Study Plan Types based on API response structure
export interface StudyPlanDay {
  day_number: number;
  subject: string;
  topic: string;
  activities: string;
  resources: string;
}

export interface StudyPlanWeek {
  week_number: number;
  title: string;
  goal: string;
  days: StudyPlanDay[];
}

export interface StudyPlanOverview {
  exam_name: string;
  duration_days: number;
  study_hours_per_day: number;
  weak_topics: string[];
  strong_topics: string[];
}

export interface StudyPlanResources {
  essential: string[];
  reference: string[];
  practice: string[];
  online: string[];
}

export interface DailySchedule {
  morning: {
    duration: string;
    focus: string;
  };
  midday: {
    duration: string;
    focus: string;
  };
  afternoon: {
    duration: string;
    focus: string;
  };
}

export interface StudyPlanData {
  id: string;
  createdAt: string;
  days_left?: number; // Adding days_left which is present in the API response
  exam_name?: string; // Adding exam_name which is present in the API response
  overview: StudyPlanOverview;
  daily_schedule: DailySchedule;
  key_principles: string[];
  important_notes: string[];
  resources: StudyPlanResources;
  weekly_plans: StudyPlanWeek[];
  final_advice: string;
}

interface StudyPlansState {
  plans: StudyPlanData[];
  isLoading: boolean;
  error: string | null;
  selectedPlanId: string | null;
  
  // Actions
  addPlan: (plan: StudyPlanData) => void;
  removePlan: (id: string) => void;
  setPlans: (plans: StudyPlanData[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedPlanId: (id: string | null) => void;
  getPlanById: (id: string) => StudyPlanData | undefined;
}

export const useStudyPlans = create<StudyPlansState>((set, get) => ({
  plans: [],
  isLoading: false,
  error: null,
  selectedPlanId: null,
  
  addPlan: (plan) => set((state) => ({ 
    plans: [plan, ...state.plans] 
  })),
  
  removePlan: (id) => set((state) => ({ 
    plans: state.plans.filter(plan => plan.id !== id) 
  })),
  
  setPlans: (plans) => set({ plans }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
  
  getPlanById: (id) => {
    return get().plans.find(plan => plan.id === id);
  }
}));