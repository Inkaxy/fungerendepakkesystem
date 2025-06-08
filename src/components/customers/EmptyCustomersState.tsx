
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';

interface EmptyCustomersStateProps {
  onCreateCustomer: () => void;
}

const EmptyCustomersState = ({ onCreateCustomer }: EmptyCustomersStateProps) => {
  return (
    <div className="text-center py-8">
      <Users className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Ingen kunder</h3>
      <p className="mt-1 text-sm text-gray-500">
        Kom i gang ved å opprette din første kunde.
      </p>
      <div className="mt-6">
        <Button onClick={onCreateCustomer}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ny Kunde
        </Button>
      </div>
    </div>
  );
};

export default EmptyCustomersState;
