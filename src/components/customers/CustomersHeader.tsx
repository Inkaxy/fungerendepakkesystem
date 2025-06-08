
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CustomersHeaderProps {
  customersCount: number;
  onCreateCustomer: () => void;
  onDeleteAllCustomers: () => void;
}

const CustomersHeader = ({ customersCount, onCreateCustomer, onDeleteAllCustomers }: CustomersHeaderProps) => {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kunder</h1>
          <p className="text-gray-600 mt-1">
            Administrer dine {customersCount} registrerte kunder
          </p>
        </div>
        
        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                disabled={customersCount === 0}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Slett alle
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dette vil slette alle {customersCount} kunder permanent. 
                  Denne handlingen kan ikke angres.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onDeleteAllCustomers}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Slett alle kunder
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button onClick={onCreateCustomer}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ny Kunde
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomersHeader;
