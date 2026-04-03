import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface ResidentInfo {
  id: string;
  email: string;
  fullName?: string;
  displayName?: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnitWithResident {
  id: string;
  unitNumber: string;
  block?: string;
  propertyId: string;
  residentId?: string;
  resident?: ResidentInfo | null;
  createdAt: string;
  updatedAt: string;
}

export function useUnitsWithResidents(propertyId: string | null) {
  const [units, setUnits] = useState<UnitWithResident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getUnitsForProperty(propertyId);
      const normalized = Array.isArray(data) ? data : [];
      setUnits(normalized);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los residentes');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return { units, loading, error, refetch: fetchUnits };
}
