
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { Settings, Users, Building, Shield, UserPlus } from 'lucide-react';

const Admin = () => {
  const { profile } = useAuthStore();

  // Only super_admin should see this page
  if (profile?.role !== 'super_admin') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ingen tilgang</h1>
          <p className="text-gray-600">Du har ikke tilgang til administrasjonspanelet.</p>
        </div>
      </div>
    );
  }

  const mockBakeries = [
    {
      id: 'BAK-001',
      name: 'Demo Bakeri',
      location: 'Oslo Sentrum',
      users: 3,
      status: 'active',
      admin: 'Henrik Hansen'
    },
    {
      id: 'BAK-002',
      name: 'Nord Bakeri',
      location: 'Bergen',
      users: 5,
      status: 'active',
      admin: 'Maria Olsen'
    }
  ];

  const mockUsers = [
    {
      id: 'USER-001',
      name: 'Henrik Hansen',
      email: 'henrik@nottero-bakeri.no',
      role: 'super_admin',
      bakery: 'Demo Bakeri',
      status: 'active',
      lastLogin: '2025-06-07 08:07'
    },
    {
      id: 'USER-002',
      name: 'Ole Packer',
      email: 'ole@demo-bakeri.no',
      role: 'bakery_user',
      bakery: 'Demo Bakeri',
      status: 'active',
      lastLogin: '2025-06-06 14:30'
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="destructive">Super Admin</Badge>;
      case 'bakery_admin':
        return <Badge variant="default">Bakeri Admin</Badge>;
      case 'bakery_user':
        return <Badge variant="secondary">Bakeri Bruker</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge variant="default">Aktiv</Badge>
      : <Badge variant="secondary">Inaktiv</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administrasjon</h1>
          <p className="text-muted-foreground">
            Administrer bakerier, brukere og systeminnstillinger
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Building className="mr-2 h-4 w-4" />
            Nytt Bakeri
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Ny Bruker
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bakerier
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Alle aktive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totale brukere
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +1 denne måneden
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Super Admins
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Du
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Systemstatus
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">OK</div>
            <p className="text-xs text-muted-foreground">
              Alle systemer kjører
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bakeries Management */}
      <Card>
        <CardHeader>
          <CardTitle>Bakeri Administrasjon</CardTitle>
          <CardDescription>
            Administrer alle bakerier i systemet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBakeries.map((bakery) => (
              <div key={bakery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{bakery.name}</span>
                    {getStatusBadge(bakery.status)}
                  </div>
                  <p className="text-sm text-gray-600">Lokasjon: {bakery.location}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{bakery.users} brukere</span>
                    <span>Admin: {bakery.admin}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Innstillinger
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-1" />
                    Brukere
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle>Bruker Administrasjon</CardTitle>
          <CardDescription>
            Administrer alle brukere på tvers av bakerier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{user.name}</span>
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Bakeri: {user.bakery}</span>
                    <span>Sist pålogget: {user.lastLogin}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Rediger
                  </Button>
                  <Button variant="outline" size="sm">
                    Tilganger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
