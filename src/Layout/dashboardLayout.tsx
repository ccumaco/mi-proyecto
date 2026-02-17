import { HeaderDashboard } from '@/components/sections/Dashboard/HeaderDashboard';
import { SidebarDashboard } from '@/components/sections/Dashboard/SidebarDashboard';
import { User } from '@supabase/supabase-js';

export const DashboardLayout = ({
  children,
  user,
  role,
}: {
  children: React.ReactNode;
  user: User | null;
  role: string | null;
}) => {
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
