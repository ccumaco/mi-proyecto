import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface AnnouncementAPI {
  id: string;
  title: string;
  content: string;
  type: 'GENERAL' | 'URGENT' | 'INFO';
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export function useAdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<AnnouncementAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAnnouncements();
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.announcements)
          ? (data as any).announcements
          : [];
      setAnnouncements(normalized);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los comunicados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const createAnnouncement = useCallback(
    async (data: { title: string; content: string; type: 'GENERAL' | 'URGENT' | 'INFO' }) => {
      const created = await apiClient.createAnnouncement(data);
      setAnnouncements(prev => [created, ...prev]);
      return created;
    },
    []
  );

  const updateAnnouncement = useCallback(
    async (id: string, data: Partial<{ title: string; content: string; type: 'GENERAL' | 'URGENT' | 'INFO' }>) => {
      const updated = await apiClient.updateAnnouncement(id, data);
      setAnnouncements(prev => prev.map(a => (a.id === id ? updated : a)));
      return updated;
    },
    []
  );

  const deleteAnnouncement = useCallback(async (id: string) => {
    await apiClient.deleteAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }, []);

  return {
    announcements,
    loading,
    error,
    refetch: fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
}
