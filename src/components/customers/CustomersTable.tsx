
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Loader2, MapPin, ShoppingBag, Edit3 } from 'lucide-react';
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
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">🟢 Aktiv</Badge>;
      case 'inactive':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">⏸️ Inaktiv</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">🚫 Blokkert</Badge>;
      default:
        return <Badge variant="outline">❓ Ukjent</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50">
            <TableHead className="font-semibold text-gray-800">🏷️ Kundenummer</TableHead>
            <TableHead className="font-semibold text-gray-800">🏪 Kundenavn</TableHead>
            <TableHead className="font-semibold text-gray-800">📊 Status</TableHead>
            <TableHead className="font-semibold text-gray-800">📺 Display Konfigurasjon</TableHead>
            <TableHead className="font-semibold text-gray-800">📍 Adresse</TableHead>
            <TableHead className="text-right font-semibold text-gray-800">⚡ Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow 
              key={customer.id}
              className={`
                border-gray-50 hover:bg-gradient-to-r hover:from-blue-25 hover:to-indigo-25 
                transition-all duration-200 group
                ${index % 2 === 0 ? 'bg-gray-25' : 'bg-white'}
              `}
            >
              <TableCell className="font-mono text-sm bg-gray-50 rounded-lg border border-gray-100 mx-1 my-2 px-3 py-2">
                {customer.customer_number || (
                  <span className="text-gray-400 italic">Ikke tildelt</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{customer.name}</div>
                    {customer.contact_person && (
                      <div className="text-sm text-gray-500">👤 {customer.contact_person}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(customer.status)}</TableCell>
              <TableCell>
                <div className="max-w-sm">
                  <DisplayModeSelector
                    customer={customer}
                    onToggleDisplay={onToggleDisplay}
                    onCopyUrl={onCopyUrl}
                    onOpenUrl={onOpenUrl}
                  />
                </div>
              </TableCell>
              <TableCell>
                {customer.address ? (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate max-w-48 text-gray-600">{customer.address}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic text-sm">Ingen adresse</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewCustomer(customer)}
                    className="h-8 px-3 bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Vis
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditCustomer(customer)}
                    className="h-8 px-3 bg-white hover:bg-amber-50 border-amber-200 text-amber-600 hover:text-amber-700"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Rediger
                  </Button>
                  <Button 
                    size="sm"
                    className="h-8 px-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-sm"
                  >
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    Ny Ordre
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={deletingCustomerId === customer.id}
                        className="h-8 px-3 bg-white hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700"
                      >
                        {deletingCustomerId === customer.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-2 border-red-100">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-800">🗑️ Slett kunde</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                          Er du sikker på at du vil slette kunden <strong>"{customer.name}"</strong>? 
                          <br />
                          <span className="text-red-600 font-medium">⚠️ Denne handlingen kan ikke angres.</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:bg-gray-50">Avbryt</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDeleteCustomer(customer.id)}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Slett kunde
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
