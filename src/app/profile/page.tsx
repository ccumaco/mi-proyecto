'use client';

import { useState, useEffect } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientBrowser(); // Initialize cookie-based Supabase client

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
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
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Profile
        </h1>
        {user && (
          <div className="space-y-4">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            {role && (
              <p>
                <strong>Role:</strong> {role}
              </p>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
