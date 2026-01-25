import { Card, CardContent } from '@/components/ui/card';
import { Package, Users, CheckCircle, TrendingUp } from 'lucide-react';

interface DashboardStats {
  activeOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrdersToday: number;
}

interface DashboardStatsProps {
  stats: DashboardStats | undefined;
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}

const StatCard = ({ title, value, subtitle, icon, gradient, iconBg }: StatCardProps) => (
  <Card className={`relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${gradient}`}>
    <div className="absolute top-0 right-0 w-20 h-20 bg-background/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
    <CardContent className="relative p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">{value}</span>
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards = [
    {
      title: "Aktive Ordrer",
      value: stats?.activeOrders || 0,
      subtitle: `${stats?.pendingOrders || 0} venter på behandling`,
      icon: <Package className="h-6 w-6 text-primary" />,
      gradient: "bg-primary/5 dark:bg-primary/10",
      iconBg: "bg-primary/10"
    },
    {
      title: "Kunder",
      value: stats?.totalCustomers || 0,
      subtitle: "aktive kunder",
      icon: <Users className="h-6 w-6 text-accent-foreground" />,
      gradient: "bg-accent/50 dark:bg-accent/30",
      iconBg: "bg-accent"
    },
    {
      title: "Pakket I Dag",
      value: stats?.completedOrdersToday || 0,
      subtitle: "ordrer fullført",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      gradient: "bg-secondary dark:bg-secondary/50",
      iconBg: "bg-primary/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
