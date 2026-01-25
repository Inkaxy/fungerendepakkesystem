import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useDashboardStats } from '@/hooks/useDashboardStats';

// Dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ActivePackingCard from '@/components/dashboard/ActivePackingCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';

const Dashboard = () => {
  const { profile } = useAuthStore();
  const { data: stats, isLoading, error } = useDashboardStats();

  const getRoleName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'bakery_admin': return 'Bakeri Admin';
      case 'bakery_user': return 'Bakeri Bruker';
      default: return 'Bruker';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
          <Loader2 className="h-8 w-8 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
        </div>
        <p className="text-muted-foreground animate-pulse">Laster dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardHeader profile={profile} />
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl">
          <p className="text-destructive font-medium">
            Kunne ikke laste statistikk: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section with Gradient */}
      <DashboardHeader profile={profile} />

      {/* Active Packing Card - only shows when there's active packing */}
      <ActivePackingCard />

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions roleName={getRoleName(profile?.role || '')} />
        <RecentActivity activities={stats?.recentActivity} />
      </div>
    </div>
  );
};

export default Dashboard;
