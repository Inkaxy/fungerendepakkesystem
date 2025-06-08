
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, QrCode, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CustomersHeaderProps {
  customersCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateCustomer: () => void;
  onGenerateQrCodes: () => void;
  onBulkActions: () => void;
  selectedCount: number;
}

const CustomersHeader = ({ 
  customersCount, 
  searchTerm, 
  onSearchChange, 
  onCreateCustomer,
  onGenerateQrCodes,
  onBulkActions,
  selectedCount
}: CustomersHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
            <span className="text-xs">👥</span>
          </div>
          <h1 className="text-xl font-semibold">
            Kundeoversikt ({customersCount} kunder)
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Søk etter kundenavn, adresse eller kontaktinfo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          {selectedCount > 0 && (
            <Button variant="outline" onClick={onBulkActions}>
              Flere handlinger
            </Button>
          )}
          
          <Button variant="outline" onClick={onGenerateQrCodes}>
            <QrCode className="w-4 h-4 mr-2" />
            Generer alle QR-koder
          </Button>

          <span className="text-sm text-muted-foreground">
            Viser {customersCount} av {customersCount} resultater
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomersHeader;
