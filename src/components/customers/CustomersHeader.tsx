import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, QrCode, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CustomersHeaderProps {
  customersCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateCustomer: () => void;
  onGenerateQrCodes: () => void;
  onBulkActions: () => void;
  onDeleteAllCustomers: () => void;
  selectedCount: number;
}

const CustomersHeader = ({ 
  customersCount, 
  searchTerm, 
  onSearchChange, 
  onCreateCustomer,
  onGenerateQrCodes,
  onBulkActions,
  onDeleteAllCustomers,
  selectedCount
}: CustomersHeaderProps) => {
  return (
    <Card className="card-warm">
      <CardContent className="py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Søk etter kundenavn, adresse eller kontaktinfo..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCount > 0 && (
              <Button variant="outline" size="sm" onClick={onBulkActions}>
                Flere handlinger ({selectedCount})
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={onGenerateQrCodes}>
              <QrCode className="w-4 h-4 mr-2" />
              QR-koder
            </Button>

            {customersCount > 0 && (
              <Button variant="destructive" size="sm" onClick={onDeleteAllCustomers}>
                <Trash2 className="w-4 h-4 mr-2" />
                Slett alle
              </Button>
            )}

            <span className="text-sm text-muted-foreground hidden md:inline">
              Viser {customersCount} kunder
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomersHeader;
