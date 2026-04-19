'use client';

import { useCallback, useEffect, useState } from 'react';
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
  refetch: () => void;
}

export function useSubscription(): UseSubscriptionResult {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const shouldFetch =
    isAuthenticated && role !== 'SUPER_ADMIN' && role !== null;

  const refetch = useCallback(() => setFetchTrigger(n => n + 1), []);

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
  }, [shouldFetch, fetchTrigger]);

  return { subscription, loading, error, refetch };
}
