'use client';

import { useSelector } from 'react-redux';
import { selectUserRole } from '@/lib/redux/slices/authSlice';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ('user' | 'admin' | 'super-admin')[];
  fallback?: ReactNode;
}

/**
 * RoleGuard - Protege componentes visuales basándose en el rol del usuario de Redux.
 * Úsalo para ocultar botones, paneles o secciones enteras.
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const currentRole = useSelector(selectUserRole) as
    | 'user'
    | 'admin'
    | 'super-admin';

  if (!allowedRoles.includes(currentRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
