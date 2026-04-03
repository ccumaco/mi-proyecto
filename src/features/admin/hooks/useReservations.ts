import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface ReservationWithDetails {
  id: string;
  zoneId: string;
  unitId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  zone: {
    id: string;
    name: string;
    description?: string;
    capacity?: number;
    propertyId: string;
    isActive: boolean;
  };
  unit: {
    id: string;
    unitNumber: string;
    block?: string;
    propertyId: string;
    resident?: {
      id: string;
      email: string;
      fullName?: string;
      displayName?: string;
      phone?: string;
    } | null;
  };
}

export function useReservations(propertyId: string | null) {
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getReservations({ propertyId });
      const normalized = Array.isArray(data) ? data : [];
      setReservations(normalized);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const updateReservation = useCallback(
    async (id: string, data: Partial<{ status: string; notes: string; startTime: string; endTime: string }>) => {
      const updated = await apiClient.updateReservation(id, data);
      setReservations(prev => prev.map(r => (r.id === id ? { ...r, ...updated } : r)));
      return updated;
    },
    []
  );

  const createReservation = useCallback(async (data: {
    zoneId: string;
    unitId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    const created = await apiClient.createReservation(data);
    await fetchReservations();
    return created;
  }, [fetchReservations]);

  return { reservations, loading, error, refetch: fetchReservations, updateReservation, createReservation };
}
