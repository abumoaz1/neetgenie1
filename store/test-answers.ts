import { create } from 'zustand';

interface TestAnswersState {
  answers: Record<number, number>; // questionId -> selectedOptionIndex (0-based)
  markedQuestions: number[];
  isSubmitting: boolean;
  error: string | null;
}

interface TestAnswersStore extends TestAnswersState {
  setAnswer: (questionId: number, optionIndex: number) => void;
  toggleMarkedQuestion: (questionId: number) => void;
  clearAnswers: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTestAnswers = create<TestAnswersStore>((set) => ({
  answers: {},
  markedQuestions: [],
  isSubmitting: false,
  error: null,

  setAnswer: (questionId, optionIndex) => set((state) => ({
    answers: {
      ...state.answers,
      [questionId]: optionIndex
    }
  })),

  toggleMarkedQuestion: (questionId) => set((state) => {
    if (state.markedQuestions.includes(questionId)) {
      return {
        markedQuestions: state.markedQuestions.filter(id => id !== questionId)
      };
    }
    return {
      markedQuestions: [...state.markedQuestions, questionId]
    };
  }),

  clearAnswers: () => set({ 
    answers: {},
    markedQuestions: [] 
  }),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  
  setError: (error) => set({ error })
}));