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
        setAnnouncements(data);
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
