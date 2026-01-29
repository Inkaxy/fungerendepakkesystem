import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTabletActions } from '@/hooks/useTabletActions';
import { useCustomers } from '@/hooks/useCustomers';
import { Tablet } from '@/types/tablet';
import { Loader2, Store } from 'lucide-react';

interface LinkTabletDialogProps {
  tablet: Tablet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LinkTabletDialog: React.FC<LinkTabletDialogProps> = ({
  tablet,
  open,
  onOpenChange,
}) => {
  const { linkToCustomer } = useTabletActions();
  const { data: customers = [] } = useCustomers();
  // Radix Select: SelectItem.value kan ikke være tom streng. Bruk "none" som sentinel.
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('none');

  useEffect(() => {
    if (tablet) {
      setSelectedCustomerId(tablet.customer_id || 'none');
    }
  }, [tablet]);

  const handleSave = async () => {
    if (!tablet) return;

    await linkToCustomer.mutateAsync({
      tabletId: tablet.id,
      customerId: selectedCustomerId === 'none' ? null : selectedCustomerId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Koble til butikk</DialogTitle>
          <DialogDescription>
            Velg hvilken butikk nettbrettet "{tablet?.name}" skal vise data for
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Velg butikk</Label>
            <Select
              value={selectedCustomerId}
              onValueChange={setSelectedCustomerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ingen tilknytning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-muted-foreground">Ingen tilknytning</span>
                </SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.name}</span>
                      {customer.customer_number && (
                        <span className="text-muted-foreground">
                          ({customer.customer_number})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCustomerId !== 'none' && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="text-muted-foreground">
                Nettbrettet vil automatisk vise pakkestatus for denne butikken
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={handleSave} disabled={linkToCustomer.isPending}>
            {linkToCustomer.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Lagre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkTabletDialog;
