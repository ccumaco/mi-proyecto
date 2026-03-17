'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  selectAuthStatus,
  selectIsAuthenticated,
  selectUserRole,
} from '@/lib/redux/slices/authSlice';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);
  const role = useSelector(selectUserRole);

  useEffect(() => {
    if (authStatus !== 'succeeded') return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!['admin', 'super-admin'].includes(role)) {
      router.replace('/');
    }
  }, [authStatus, isAuthenticated, role, router]);

  return <>{children}</>;
}
