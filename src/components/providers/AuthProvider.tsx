'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createClientBrowser } from '@/lib/supabase';
import { setUser } from '@/lib/redux/slices/authSlice';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const supabase = createClientBrowser();

  useEffect(() => {
    // Escuchar cambios de autenticación (Login, Logout, Token refrescado)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (session) {
        dispatch(setUser(session.user));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, supabase.auth]);

  return <>{children}</>;
}
