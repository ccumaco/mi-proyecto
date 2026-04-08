import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import { apiClient } from '@/lib/api';

/**
 * Obtiene el propertyId de la propiedad asociada al admin autenticado.
 * El backend filtra automáticamente por rol: ADMIN solo recibe su propiedad.
 */
export function usePropertyId() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchPropertyId = async () => {
      try {
        setLoading(true);
        const properties = await apiClient.getProperties();
        const normalized = Array.isArray(properties) ? properties : [];
        const myProperty = normalized[0] ?? null;
        setPropertyId(myProperty?.id ?? null);
      } catch (err: any) {
        setError(err.message || 'Error al obtener la propiedad');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyId();
  }, [isAuthenticated]);

  return { propertyId, loading, error };
}
