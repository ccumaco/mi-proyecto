'use client';

import { HeaderDashboard } from '@/components/sections/Dashboard/HeaderDashboard';
import { SidebarDashboard } from '@/components/sections/Dashboard/SidebarDashboard';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthStatus,
  selectIsAuthenticated,
  selectUser,
  setUser,
} from '@/lib/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus); // Get auth status from Redux
  const [role, setRole] = useState<string | null>(null);
  const supabase = createClientBrowser();
  const dispatch = useDispatch();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch, supabase.auth]);
  // Redirection logic
  useEffect(() => {
    // Only redirect if authentication status is no longer 'loading'
    // This prevents flashing unauthenticated content or premature redirection during hydration
    if (authStatus !== 'loading' && !user && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [user, isAuthenticated, router, authStatus]); // Add authStatus to dependencies

  // Role fetching logic
  useEffect(() => {
    if (user) {
      const fetchRole = async () => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setRole(profile.role);
        }
      };
      fetchRole();
    }
  }, [user, supabase]);

  // Optionally, show a loading state for the layout if authentication is still being determined
  if (authStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <SidebarDashboard user={user} role={role} />
      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Top Navigation Bar */}
        <HeaderDashboard />
        {/* Dashboard Content */}
        {children}
      </main>
    </div>
  );
};
