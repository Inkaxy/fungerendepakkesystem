import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { Users, Package, Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { profile } = useAuthStore();
  const { data: stats, isLoading, error } = useDashboardStats();
  const navigate = useNavigate();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'bakery_admin': return 'default';
      case 'bakery_user': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'bakery_admin': return 'Bakeri Admin';
      case 'bakery_user': return 'Bakeri Bruker';
      default: return 'Bruker';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order_packed': return 'bg-green-500';
      case 'order_created': return 'bg-blue-500';
      case 'customer_added': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getNavigationPath = (activityType: string) => {
    switch (activityType) {
      case 'order_packed':
      case 'order_created':
        return '/dashboard/orders';
      case 'customer_added':
        return '/dashboard/customers';
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Velkommen, {profile?.name || 'Bruker'}!
              </h1>
              <p className="text-red-600 mt-1">
                Kunne ikke laste statistikk: {error.message}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={getRoleBadgeVariant(profile?.role || '')} className="mb-2">
                {getRoleName(profile?.role || '')}
              </Badge>
              {profile?.bakery_name && (
                <p className="text-sm text-gray-600">
                  {profile.bakery_name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Aktive Ordrer",
      value: stats?.activeOrders?.toString() || "0",
      description: `${stats?.pendingOrders || 0} venter på behandling`,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Kunder",
      value: stats?.totalCustomers?.toString() || "0",
      description: "aktive kunder",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Pakket I Dag",
      value: stats?.completedOrdersToday?.toString() || "0",
      description: "ordrer fullført",
      icon: CheckCircle,
      color: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Velkommen, {profile?.name || 'Bruker'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Her er oversikten over ditt bakeri-system
            </p>
          </div>
          <div className="text-right">
            <Badge variant={getRoleBadgeVariant(profile?.role || '')} className="mb-2">
              {getRoleName(profile?.role || '')}
            </Badge>
            {profile?.bakery_name && (
              <p className="text-sm text-gray-600">
                {profile.bakery_name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hurtighandlinger</CardTitle>
            <CardDescription>
              Vanlige oppgaver for {getRoleName(profile?.role || '')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => navigate('/dashboard/orders')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/orders')}
              role="button"
              tabIndex={0}
              aria-label="Gå til pakking"
            >
              <h4 className="font-medium flex items-center">
                <Package className="h-4 w-4 mr-2 text-blue-600" />
                Pakking
              </h4>
              <p className="text-sm text-gray-600">Start pakking av nye ordrer</p>
            </div>
            <div 
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => navigate('/dashboard/reports')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/reports')}
              role="button"
              tabIndex={0}
              aria-label="Gå til rapporter"
            >
              <h4 className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-600" />
                Rapporter
              </h4>
              <p className="text-sm text-gray-600">Se avviksrapporter og statistikk</p>
            </div>
            <div 
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => navigate('/dashboard/customers')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/customers')}
              role="button"
              tabIndex={0}
              aria-label="Gå til kunder"
            >
              <h4 className="font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-600" />
                Kunder
              </h4>
              <p className="text-sm text-gray-600">Administrer kundeinformasjon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Siste Aktivitet</CardTitle>
            <CardDescription>
              Nylige hendelser i systemet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => {
                  const navigationPath = getNavigationPath(activity.type);
                  
                  return (
                    <div 
                      key={activity.id} 
                      className={`flex items-center space-x-3 ${
                        navigationPath 
                          ? 'p-2 -mx-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors' 
                          : ''
                      }`}
                      onClick={() => navigationPath && navigate(navigationPath)}
                      onKeyDown={(e) => navigationPath && e.key === 'Enter' && navigate(navigationPath)}
                      role={navigationPath ? "button" : undefined}
                      tabIndex={navigationPath ? 0 : undefined}
                      aria-label={navigationPath ? `Gå til ${activity.type === 'customer_added' ? 'kunder' : 'ordrer'}` : undefined}
                    >
                      <div className={`w-2 h-2 rounded-full ${getActivityIcon(activity.type)}`}></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(activity.timestamp), { 
                            addSuffix: true, 
                            locale: nb 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Ingen nylige aktiviteter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Informasjon</CardTitle>
          <CardDescription>
            Din konto-informasjon og innstillinger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Navn</label>
              <p className="text-base">{profile?.name || 'Ikke angitt'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">E-post</label>
              <p className="text-base">{profile?.email || 'Ikke angitt'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Rolle</label>
              <p className="text-base">{getRoleName(profile?.role || '')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bakeri</label>
              <p className="text-base">{profile?.bakery_name || 'Ikke tilknyttet'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
