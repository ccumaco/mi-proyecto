import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface DocumentAPI {
  id: string;
  name: string;
  description?: string;
  category?: string;
  filename: string;
  url: string;
  propertyId: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

export function useDocuments(propertyId: string | null) {
  const [documents, setDocuments] = useState<DocumentAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getDocuments(propertyId);
      const normalized = Array.isArray(data) ? data : [];
      setDocuments(normalized);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los documentos');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = useCallback(async (formData: FormData) => {
    const created = await apiClient.createDocument(formData);
    setDocuments(prev => [created, ...prev]);
    return created;
  }, []);

  const deleteDocument = useCallback(async (id: string) => {
    await apiClient.deleteDocument(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  return { documents, loading, error, refetch: fetchDocuments, uploadDocument, deleteDocument };
}
