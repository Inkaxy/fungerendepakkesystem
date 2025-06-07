
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { useProfiles } from '@/hooks/useProfiles';

interface Bakery {
  id: string;
  name: string;
}

interface ViewUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bakery: Bakery | null;
}

const ViewUsersDialog = ({ open, onOpenChange, bakery }: ViewUsersDialogProps) => {
  const { data: profiles } = useProfiles();

  const bakeryUsers = profiles?.filter(profile => profile.bakery_id === bakery?.id) || [];

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Brukere for {bakery?.name}</DialogTitle>
          <DialogDescription>
            Oversikt over alle brukere tilknyttet dette bakeriet.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {bakeryUsers.length > 0 ? (
            <div className="space-y-3">
              {bakeryUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{user.name || 'Navn ikke satt'}</span>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.is_active)}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Ingen brukere</h3>
              <p className="mt-1 text-sm text-gray-500">
                Dette bakeriet har ingen tilknyttede brukere ennå.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUsersDialog;
