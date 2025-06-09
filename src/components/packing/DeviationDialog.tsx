
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';

interface DeviationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (actualQuantity: number) => void;
  customerName: string;
  productName: string;
  orderedQuantity: number;
  currentDeviation?: number;
}

const DeviationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  productName,
  orderedQuantity,
  currentDeviation
}: DeviationDialogProps) => {
  const [actualQuantity, setActualQuantity] = useState(
    currentDeviation !== undefined ? orderedQuantity + currentDeviation : orderedQuantity
  );

  const difference = actualQuantity - orderedQuantity;
  const isPositive = difference > 0;
  const isNegative = difference < 0;

  const handleConfirm = () => {
    onConfirm(actualQuantity);
    onClose();
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = Math.max(0, actualQuantity + delta);
    setActualQuantity(newQuantity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrer avvik</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Kunde</Label>
            <p className="text-sm text-muted-foreground">{customerName}</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Produkt</Label>
            <p className="text-sm text-muted-foreground">{productName}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bestilt antall</Label>
              <p className="text-lg font-semibold">{orderedQuantity} stk</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Faktisk pakket</Label>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustQuantity(-1)}
                  disabled={actualQuantity <= 0}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Input
                  type="number"
                  value={actualQuantity}
                  onChange={(e) => setActualQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 text-center"
                  min="0"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustQuantity(1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          {difference !== 0 && (
            <div className="flex items-center justify-center p-3 rounded-lg bg-muted">
              <Badge variant={isPositive ? "default" : "destructive"} className="text-sm">
                Avvik: {isPositive ? '+' : ''}{difference} stk
              </Badge>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleConfirm}>
            Registrer avvik
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeviationDialog;
