
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, Edit, UserX, MoreVertical, Settings, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface User {
  id: string;
  name?: string;
  email?: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  bakery?: { name: string };
}

interface UsersSectionProps {
  profiles: User[] | undefined;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UsersSection = ({ profiles, onEditUser, onDeleteUser }: UsersSectionProps) => {
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
      ? <Badge variant="default" className="bg-green-600">Aktiv</Badge>
      : <Badge variant="secondary" className="bg-gray-400">Inaktiv</Badge>;
  };

  return (
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
                  {user.bakery && (
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-3 h-3" />
                      <span>Bakeri: {user.bakery.name}</span>
                    </div>
                  )}
                  {user.last_login ? (
                    <span>Sist pålogget: {format(new Date(user.last_login), 'dd.MM.yyyy HH:mm', { locale: nb })}</span>
                  ) : (
                    <span>Aldri pålogget</span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditUser(user)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Rediger
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Tilganger
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onDeleteUser(user)}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      {user.is_active ? 'Deaktiver' : 'Reaktiver'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
  );
};

export default UsersSection;
