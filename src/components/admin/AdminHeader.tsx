import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, UserPlus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { Shield } from 'lucide-react';

interface AdminHeaderProps {
  onCreateBakery: () => void;
  onCreateUser: () => void;
  onDeleteAllData: () => void;
}

const AdminHeader = ({ onCreateBakery, onCreateUser, onDeleteAllData }: AdminHeaderProps) => {
  return (
    <PageHeader
      icon={Shield}
      title="Administrasjon"
      subtitle="Administrer bakerier, brukere og systeminnstillinger"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCreateBakery}>
            <Building className="mr-2 h-4 w-4" />
            Nytt Bakeri
          </Button>
          <Button size="sm" onClick={onCreateUser} className="hover-lift">
            <UserPlus className="mr-2 h-4 w-4" />
            Ny Bruker
          </Button>
          <Button variant="destructive" size="sm" onClick={onDeleteAllData}>
            <Trash2 className="mr-2 h-4 w-4" />
            Slett Alt
          </Button>
        </div>
      }
    />
  );
};

export default AdminHeader;
