
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';

interface EmptyCustomersStateProps {
  onCreateCustomer: () => void;
}

const EmptyCustomersState = ({ onCreateCustomer }: EmptyCustomersStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Ingen kunder ennå
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Kom i gang med å legge til din første kunde for å begynne å administrere kundeforhold.
      </p>
      
      <Button onClick={onCreateCustomer}>
        <UserPlus className="mr-2 h-4 w-4" />
        Opprett første kunde
      </Button>
    </div>
  );
};

export default EmptyCustomersState;
