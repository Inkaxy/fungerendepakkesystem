
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, UserPlus, Trash2 } from 'lucide-react';

interface AdminHeaderProps {
  onCreateBakery: () => void;
  onCreateUser: () => void;
  onDeleteAllData: () => void;
}

const AdminHeader = ({ onCreateBakery, onCreateUser, onDeleteAllData }: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administrasjon</h1>
        <p className="text-muted-foreground">
          Administrer bakerier, brukere og systeminnstillinger
        </p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onCreateBakery}>
          <Building className="mr-2 h-4 w-4" />
          Nytt Bakeri
        </Button>
        <Button onClick={onCreateUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ny Bruker
        </Button>
        <Button variant="destructive" onClick={onDeleteAllData}>
          <Trash2 className="mr-2 h-4 w-4" />
          Slett All Data
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
