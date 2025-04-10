import { useCallback, useEffect } from 'react';
import { useStudyMaterials } from '@/store/study-materials';
import { StudyMaterial } from '@/types';

export function useStudyMaterialsHook() {
  const { materials, filters, setMaterials, setFilters, setLoading, setError } = useStudyMaterials();

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockMaterials: StudyMaterial[] = [
        {
          id: 1,
          title: "Biology Complete Notes",
          subject: "Biology",
          type: "notes",
          description: "Comprehensive notes covering all NEET Biology topics with diagrams and explanations.",
          pages: 250,
          rating: 4.8,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          title: "Physics Formula Sheet",
          subject: "Physics",
          type: "notes",
          description: "All important formulas and derivations for NEET Physics.",
          pages: 50,
          rating: 4.9,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          title: "Organic Chemistry Video Series",
          subject: "Chemistry",
          type: "video",
          description: "Complete video series on Organic Chemistry with practice problems.",
          duration: "12 hours",
          rating: 4.7,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      setMaterials(mockMaterials);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while fetching materials');
    } finally {
      setLoading(false);
    }
  }, [setMaterials, setLoading, setError]);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         material.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSubject = !filters.subject || material.subject === filters.subject;
    const matchesType = filters.type === 'all' || material.type === filters.type;

    return matchesSearch && matchesSubject && matchesType;
  });

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return {
    materials: filteredMaterials,
    filters,
    setFilters,
    isLoading: useStudyMaterials(state => state.isLoading),
    error: useStudyMaterials(state => state.error)
  };
} 