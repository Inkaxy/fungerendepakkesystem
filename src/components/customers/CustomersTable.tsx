
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Settings,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  MoreHorizontal,
  MapPin,
  QrCode
} from 'lucide-react';
import { Customer } from '@/types/database';

interface CustomersTableProps {
  customers: Customer[];
  selectedCustomers: string[];
  onSelectCustomer: (customerId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  deletingCustomerId: string | null;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onToggleDisplay: (customer: Customer, hasDedicatedDisplay: boolean) => void;
  onCopyUrl: (displayPath: string) => void;
  onOpenUrl: (displayPath: string) => void;
  onShowQrCode: (customer: Customer) => void;
}

const CustomersTable = ({
  customers,
  selectedCustomers,
  onSelectCustomer,
  onSelectAll,
  deletingCustomerId,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onToggleDisplay,
  onCopyUrl,
  onOpenUrl,
  onShowQrCode,
}: CustomersTableProps) => {
  const allSelected = customers.length > 0 && selectedCustomers.length === customers.length;
  const someSelected = selectedCustomers.length > 0;

  const getDisplayPath = (customer: Customer) => {
    return customer.has_dedicated_display
      ? `/display/customer/${customer.id}`
      : '/display/shared';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Velg alle kunder"
              />
            </TableHead>
            <TableHead>Kunde #</TableHead>
            <TableHead>Kundenavn</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>E-post</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Skjerm</TableHead>
            <TableHead>Ordre</TableHead>
            <TableHead className="text-right">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCustomers.includes(customer.id)}
                  onCheckedChange={(checked) => onSelectCustomer(customer.id, !!checked)}
                  aria-label={`Velg ${customer.name}`}
                />
              </TableCell>
              <TableCell className="font-mono text-sm">
                {customer.customer_number || '-'}
              </TableCell>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>
                {customer.address ? (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {customer.address}
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-sm">
                {customer.email || '-'}
              </TableCell>
              <TableCell className="text-sm">
                {customer.phone || '-'}
              </TableCell>
              <TableCell>
                <Badge variant={customer.has_dedicated_display ? 'default' : 'secondary'}>
                  {customer.has_dedicated_display ? 'Egen' : 'Felles'}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">4 ordre</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShowQrCode(customer)}
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewCustomer(customer)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Vis detaljer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditCustomer(customer)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Rediger
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onCopyUrl(getDisplayPath(customer))}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Kopier URL
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onOpenUrl(getDisplayPath(customer))}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Åpne display
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteCustomer(customer.id)}
                        className="text-red-600"
                        disabled={deletingCustomerId === customer.id}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Slett
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteCustomer(customer.id)}
                    disabled={deletingCustomerId === customer.id}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
