'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiClient, Subscription } from '@/lib/api';
import {
  selectIsAuthenticated,
  selectUserRole,
} from '@/lib/redux/slices/authSlice';

interface UseSubscriptionResult {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

export function useSubscription(): UseSubscriptionResult {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shouldFetch =
    isAuthenticated && role !== 'SUPER_ADMIN' && role !== null;

  useEffect(() => {
    if (!shouldFetch) return;

    let cancelled = false;

    const fetchSubscription = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.getMySubscription();
        if (!cancelled) {
          setSubscription(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : 'No se pudo obtener el estado de la suscripción.';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSubscription();

    return () => {
      cancelled = true;
    };
  }, [shouldFetch]);

  return { subscription, loading, error };
}
