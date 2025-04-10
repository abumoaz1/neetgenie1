import { create } from 'zustand';
import { StudyMaterial, StudyMaterialsState } from '@/types';

interface StudyMaterialsStore extends StudyMaterialsState {
  setMaterials: (materials: StudyMaterial[]) => void;
  setFilters: (filters: Partial<StudyMaterialsState['filters']>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStudyMaterials = create<StudyMaterialsStore>((set) => ({
  materials: [],
  filters: {
    subject: null,
    type: 'all',
    search: ''
  },
  isLoading: false,
  error: null,

  setMaterials: (materials) => set({ materials }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error })
})); 