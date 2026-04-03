import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface ZoneAPI {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  propertyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useZones(propertyId: string | null) {
  const [zones, setZones] = useState<ZoneAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getZones(propertyId);
      const normalized = Array.isArray(data) ? data : [];
      setZones(normalized);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las zonas');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const createZone = useCallback(
    async (data: { name: string; description?: string; capacity?: number; propertyId: string }) => {
      const created = await apiClient.createZone(data);
      setZones(prev => [...prev, created]);
      return created;
    },
    []
  );

  const updateZone = useCallback(
    async (id: string, data: Partial<{ name: string; description: string; capacity: number; isActive: boolean }>) => {
      const updated = await apiClient.updateZone(id, data);
      setZones(prev => prev.map(z => (z.id === id ? updated : z)));
      return updated;
    },
    []
  );

  const deleteZone = useCallback(async (id: string) => {
    await apiClient.deleteZone(id);
    setZones(prev => prev.filter(z => z.id !== id));
  }, []);

  return { zones, loading, error, refetch: fetchZones, createZone, updateZone, deleteZone };
}
