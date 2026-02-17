import { HeaderDashboard } from '@/components/sections/Dashboard/HeaderDashboard';
import { SidebarDashboard } from '@/components/sections/Dashboard/SidebarDashboard';
import { useSelector } from 'react-redux';
import { selectUser } from '@/lib/redux/slices/authSlice';

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <SidebarDashboard />
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
