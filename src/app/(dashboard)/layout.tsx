'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { SidebarDashboard } from '@/components/layout/SidebarDashboard';
import { HeaderDashboard } from '@/components/layout/HeaderDashboard';
import {
  selectAuthStatus,
  selectIsAuthenticated,
  selectUser,
} from '@/lib/redux/slices/authSlice';

const AUTH_TIMEOUT_MS = 8000;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);
  const user = useSelector(selectUser);
  // Track whether auth has resolved at least once so that background operations
  // (refreshAuth, fetchUser, etc.) don't re-trigger the full-page loading screen.
  const initializedRef = useRef(false);
  const [timedOut, setTimedOut] = useState(false);

  if (authStatus === 'succeeded' || authStatus === 'failed') {
    initializedRef.current = true;
  }

  const isInitializing = !initializedRef.current && authStatus === 'idle';

  useEffect(() => {
    if (authStatus === 'succeeded' && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authStatus, isAuthenticated, router]);

  // Timeout only during initial load (idle state). Once initialized, we never
  // block the UI, so no timeout is needed.
  useEffect(() => {
    if (!isInitializing) return;
    const timer = setTimeout(() => setTimedOut(true), AUTH_TIMEOUT_MS);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (timedOut && isInitializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">⚠️</span>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Estamos teniendo problemas técnicos
          </h1>
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
            No pudimos conectar con el servidor. Verifica tu conexión o intenta
            de nuevo en unos momentos.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
      <SidebarDashboard user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <HeaderDashboard user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
