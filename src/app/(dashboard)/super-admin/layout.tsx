'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  selectAuthStatus,
  selectIsAuthenticated,
  selectUserRole,
} from '@/lib/redux/slices/authSlice';
import { Role } from '@/lib/roles';

export default function SuperAdminLayout({
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

    if (role !== Role.SUPER_ADMIN) {
      router.replace('/profile');
    }
  }, [authStatus, isAuthenticated, role, router]);

  return <>{children}</>;
}
