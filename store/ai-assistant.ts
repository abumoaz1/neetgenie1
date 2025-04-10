import { create } from 'zustand';
import { Message, AIAssistantState } from '@/types';

interface AIAssistantStore extends AIAssistantState {
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useAIAssistant = create<AIAssistantStore>((set) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm NEETgenie AI. How can I help you with your NEET preparation today?",
      timestamp: new Date()
    }
  ],
  isLoading: false,
  error: null,

  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date()
      }
    ]
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearMessages: () => set({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm NEETgenie AI. How can I help you with your NEET preparation today?",
        timestamp: new Date()
      }
    ]
  })
})); 