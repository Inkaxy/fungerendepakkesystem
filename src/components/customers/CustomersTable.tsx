
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Loader2, MapPin } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import DisplayModeSelector from './DisplayModeSelector';
import { Customer } from '@/types/database';

interface CustomersTableProps {
  customers: Customer[];
  deletingCustomerId: string | null;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onToggleDisplay: (customer: Customer, hasDedicatedDisplay: boolean) => void;
  onCopyUrl: (url: string) => void;
  onOpenUrl: (url: string) => void;
}

const CustomersTable = ({ 
  customers, 
  deletingCustomerId,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onToggleDisplay,
  onCopyUrl,
  onOpenUrl
}: CustomersTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Aktiv</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inaktiv</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Blokkert</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kundenummer</TableHead>
          <TableHead>Navn</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Display Konfigurasjon</TableHead>
          <TableHead>Adresse</TableHead>
          <TableHead className="text-right">Handlinger</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">
              {customer.customer_number || '-'}
            </TableCell>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>{getStatusBadge(customer.status)}</TableCell>
            <TableCell>
              <DisplayModeSelector
                customer={customer}
                onToggleDisplay={onToggleDisplay}
                onCopyUrl={onCopyUrl}
                onOpenUrl={onOpenUrl}
              />
            </TableCell>
            <TableCell>
              {customer.address ? (
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-32">{customer.address}</span>
                </div>
              ) : '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewCustomer(customer)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Vis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditCustomer(customer)}
                >
                  Rediger
                </Button>
                <Button size="sm">
                  Ny Ordre
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={deletingCustomerId === customer.id}
                    >
                      {deletingCustomerId === customer.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Slett kunde</AlertDialogTitle>
                      <AlertDialogDescription>
                        Er du sikker på at du vil slette kunden "{customer.name}"? 
                        Denne handlingen kan ikke angres.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Avbryt</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDeleteCustomer(customer.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Slett
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomersTable;
