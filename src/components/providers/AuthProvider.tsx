'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { apiClient } from '@/lib/api';
import { setUser, clearAuth, refreshAuth } from '@/lib/redux/slices/authSlice';
import type { AppDispatch } from '@/lib/redux/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {
          // Try to get current user with existing token
          const user = await apiClient.getCurrentUser();
          dispatch(setUser(user));
        } catch (error) {
          // Token might be expired, try refresh
          try {
            await dispatch(refreshAuth()).unwrap();
          } catch (refreshError) {
            // Refresh failed, clear auth
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch(clearAuth());
          }
        }
      } else {
        // No tokens — resolve immediately so layout doesn't hang
        dispatch(clearAuth());
      }
    };

    initializeAuth();

    // Set up periodic token refresh (every 10 minutes)
    const refreshInterval = setInterval(
      async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            await dispatch(refreshAuth()).unwrap();
          } catch (error) {
            // Refresh failed, clear auth
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch(clearAuth());
          }
        }
      },
      10 * 60 * 1000
    ); // 10 minutes

    return () => {
      clearInterval(refreshInterval);
    };
  }, [dispatch]);

  return <>{children}</>;
}
