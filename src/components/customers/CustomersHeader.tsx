
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
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kundeadministrasjon</h1>
        <p className="text-muted-foreground">
          Moderne display-løsninger for optimal kundeopplevelse
        </p>
      </div>
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={customersCount === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Slett alle
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
              <AlertDialogDescription>
                Dette vil slette alle kunder permanent. Denne handlingen kan ikke angres.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Avbryt</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDeleteAllCustomers}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Slett alle
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
  );
};

export default CustomersHeader;
