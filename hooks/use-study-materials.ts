import { useState, useCallback, useEffect } from 'react';
import { useStudyMaterials } from '@/store/study-materials';
import { StudyMaterial } from '@/types';
import { baseUrl } from '@/lib/baseUrl';

export function useStudyMaterialsHook() {
  const { materials, filters, setMaterials, setFilters, setLoading, setError } = useStudyMaterials();
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [materialContent, setMaterialContent] = useState<string | null>(null);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/study-materials`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch study materials: ${response.status}`);
      }
      const data = await response.json();
      setMaterials(data.study_materials);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while fetching materials');
    } finally {
      setLoading(false);
    }
  }, [setMaterials, setLoading, setError]);

  const fetchMaterialById = useCallback(async (materialId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/study-materials/${materialId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch study material: ${response.status}`);
      }
      const data = await response.json();
      setSelectedMaterial(data.study_material);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while fetching the material');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const fetchMaterialContent = useCallback(async (materialId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/study-materials/${materialId}/content`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch material content: ${response.status}`);
      }
      const data = await response.json();
      console.log('Material content response:', data); // Debug log

      // Handle different content types
      if (data.content) {
        setMaterialContent(data.content);
      } else if (data.video_url) {
        setMaterialContent(data.video_url);
      } else if (data.pdf_url) {
        setMaterialContent(data.pdf_url);
      } else if (data.text_content) {
        // Some APIs might return the content as text_content
        setMaterialContent(data.text_content);
      } else {
        console.error('No recognizable content in the API response', data);
        setError('Content format not supported or empty content');
      }
    } catch (error) {
      console.error('Error fetching material content:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching the material content');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const downloadMaterial = useCallback(async (materialId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/study-materials/${materialId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to download material: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'material.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while downloading the material');
    }
  }, [setError]);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         material.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSubject = !filters.subject || material.subject === filters.subject;
    
    const materialType = material.material_type === 'note' ? 'notes' : 'video';
    const matchesType = filters.type === 'all' || materialType === filters.type;

    return matchesSearch && matchesSubject && matchesType;
  });

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return {
    materials: filteredMaterials,
    filters,
    setFilters,
    isLoading: useStudyMaterials((state) => state.isLoading),
    error: useStudyMaterials((state) => state.error),
    selectedMaterial,
    materialContent,
    fetchMaterials,
    fetchMaterialById,
    fetchMaterialContent,
    downloadMaterial,
  };
}