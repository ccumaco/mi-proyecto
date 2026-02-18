import { SidebarDashboard } from '@/components/layout/SidebarDashboard';
import { HeaderDashboard } from '@/components/layout/HeaderDashboard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
      <SidebarDashboard user={session.user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <HeaderDashboard user={session.user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
