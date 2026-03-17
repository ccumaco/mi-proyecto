import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'GENERAL' | 'MAINTENANCE' | 'EVENT' | 'SECURITY' | 'FINANCE';
  authorId: string;
  createdAt: string;
  author?: {
    fullName?: string;
    displayName?: string;
  };
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getAnnouncements();

        // Asegurarnos de que always sea un arreglo (el backend puede devolver { announcements: [] })
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.announcements)
            ? (data as any).announcements
            : [];

        setAnnouncements(normalized);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return { announcements, loading, error };
}
