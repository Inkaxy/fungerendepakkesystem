
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { Users, Package, Truck, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { profile } = useAuthStore();

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

  const mockStats = [
    {
      title: "Aktive Ordrer",
      value: "12",
      description: "3 klar for pakking",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Leveranser",
      value: "8",
      description: "i dag",
      icon: Truck,
      color: "text-green-600"
    },
    {
      title: "Kunder",
      value: "45",
      description: "totalt",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Omsetning",
      value: "25.400 kr",
      description: "denne uken",
      icon: BarChart3,
      color: "text-orange-600"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hurtighandlinger</CardTitle>
            <CardDescription>
              Vanlige oppgaver for {getRoleName(profile?.role || '')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Pakking</h4>
              <p className="text-sm text-gray-600">Start pakking av nye ordrer</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Leveringer</h4>
              <p className="text-sm text-gray-600">Se dagens leveringsplan</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Rapporter</h4>
              <p className="text-sm text-gray-600">Generer ukens rapport</p>
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
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Ordre #1234 pakket</p>
                  <p className="text-xs text-gray-500">5 minutter siden</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Ny kunde registrert</p>
                  <p className="text-xs text-gray-500">15 minutter siden</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Levering startet</p>
                  <p className="text-xs text-gray-500">30 minutter siden</p>
                </div>
              </div>
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
