
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { Settings, Users, Building, Shield, UserPlus, Loader2 } from 'lucide-react';
import { useBakeries } from '@/hooks/useBakeries';
import { useProfiles } from '@/hooks/useProfiles';
import CreateBakeryDialog from '@/components/admin/CreateBakeryDialog';
import CreateUserDialog from '@/components/admin/CreateUserDialog';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const Admin = () => {
  const { profile } = useAuthStore();
  const [showCreateBakery, setShowCreateBakery] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  
  const { data: bakeries, isLoading: bakeriesLoading } = useBakeries();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();

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

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge variant="default">Aktiv</Badge>
      : <Badge variant="secondary">Inaktiv</Badge>;
  };

  if (bakeriesLoading || profilesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalBakeries = bakeries?.length || 0;
  const totalUsers = profiles?.length || 0;
  const superAdmins = profiles?.filter(p => p.role === 'super_admin').length || 0;

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
          <Button variant="outline" onClick={() => setShowCreateBakery(true)}>
            <Building className="mr-2 h-4 w-4" />
            Nytt Bakeri
          </Button>
          <Button onClick={() => setShowCreateUser(true)}>
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
            <div className="text-2xl font-bold">{totalBakeries}</div>
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
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Alle registrerte
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
            <div className="text-2xl font-bold">{superAdmins}</div>
            <p className="text-xs text-muted-foreground">
              Systemadministratorer
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
            {bakeries?.map((bakery) => (
              <div key={bakery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{bakery.name}</span>
                    <Badge variant="default">Aktiv</Badge>
                  </div>
                  {bakery.address && (
                    <p className="text-sm text-gray-600">Adresse: {bakery.address}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {bakery.email && <span>E-post: {bakery.email}</span>}
                    {bakery.phone && <span>Telefon: {bakery.phone}</span>}
                    <span>Opprettet: {format(new Date(bakery.created_at), 'dd.MM.yyyy', { locale: nb })}</span>
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
            {bakeries?.length === 0 && (
              <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Ingen bakerier</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Opprett ditt første bakeri for å komme i gang.
                </p>
              </div>
            )}
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
            {profiles?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{user.name || 'Navn ikke satt'}</span>
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.is_active)}
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {user.bakery && <span>Bakeri: {user.bakery.name}</span>}
                    {user.last_login ? (
                      <span>Sist pålogget: {format(new Date(user.last_login), 'dd.MM.yyyy HH:mm', { locale: nb })}</span>
                    ) : (
                      <span>Aldri pålogget</span>
                    )}
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
            {profiles?.length === 0 && (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Ingen brukere</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Opprett din første bruker for å komme i gang.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateBakeryDialog 
        open={showCreateBakery} 
        onOpenChange={setShowCreateBakery} 
      />
      <CreateUserDialog 
        open={showCreateUser} 
        onOpenChange={setShowCreateUser} 
      />
    </div>
  );
};

export default Admin;
