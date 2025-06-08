
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Loader2, Edit3 } from 'lucide-react';
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
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aktiv</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Inaktiv</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Blokkert</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium">Kundenummer</TableHead>
            <TableHead className="font-medium">Kundenavn</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Display</TableHead>
            <TableHead className="font-medium">Adresse</TableHead>
            <TableHead className="font-medium">Kontakt</TableHead>
            <TableHead className="text-right font-medium">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-gray-50">
              <TableCell className="font-mono text-sm">
                {customer.customer_number || (
                  <span className="text-gray-400 italic">-</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{getStatusBadge(customer.status)}</TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <DisplayModeSelector
                    customer={customer}
                    onToggleDisplay={onToggleDisplay}
                    onCopyUrl={onCopyUrl}
                    onOpenUrl={onOpenUrl}
                  />
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {customer.address || <span className="text-gray-400 italic">-</span>}
              </TableCell>
              <TableCell>
                <div className="text-sm space-y-1">
                  {customer.contact_person && (
                    <div className="text-gray-600">{customer.contact_person}</div>
                  )}
                  {customer.email && (
                    <div className="text-gray-500">{customer.email}</div>
                  )}
                  {customer.phone && (
                    <div className="text-gray-500">{customer.phone}</div>
                  )}
                  {!customer.contact_person && !customer.email && !customer.phone && (
                    <span className="text-gray-400 italic">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewCustomer(customer)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEditCustomer(customer)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={deletingCustomerId === customer.id}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
                          className="bg-red-500 hover:bg-red-600"
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
    </div>
  );
};

export default CustomersTable;
