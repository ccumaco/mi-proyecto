'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { SidebarDashboard } from '@/components/layout/SidebarDashboard';
import { HeaderDashboard } from '@/components/layout/HeaderDashboard';
import {
  selectAuthStatus,
  selectIsAuthenticated,
  selectUser,
} from '@/lib/redux/slices/authSlice';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (authStatus === 'succeeded' && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authStatus, isAuthenticated, router]);

  if (authStatus === 'idle' || authStatus === 'loading') {
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
