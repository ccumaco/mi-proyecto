import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/lib/redux/slices/authSlice';
import { apiClient } from '@/lib/api';

/**
 * Obtiene el propertyId de la propiedad asociada al admin autenticado.
 * Llama a GET /properties y filtra por adminId === user.id.
 */
export function usePropertyId() {
  const user = useSelector(selectUser);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPropertyId = async () => {
      try {
        setLoading(true);
        const properties = await apiClient.getProperties();
        const normalized = Array.isArray(properties) ? properties : [];
        const myProperty = normalized.find((p: any) => p.adminId === user.id);
        if (myProperty) {
          setPropertyId(myProperty.id);
        } else {
          setPropertyId(null);
        }
      } catch (err: any) {
        setError(err.message || 'Error al obtener la propiedad');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyId();
  }, [user]);

  return { propertyId, loading, error };
}
