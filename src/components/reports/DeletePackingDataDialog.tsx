import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DeletePackingDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startDate: string;
  endDate: string;
  onConfirm: (deleteType: 'sessions' | 'all') => void;
  isLoading: boolean;
}

const DeletePackingDataDialog = ({
  open,
  onOpenChange,
  startDate,
  endDate,
  onConfirm,
  isLoading
}: DeletePackingDataDialogProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [deleteType, setDeleteType] = useState<'sessions' | 'all'>('sessions');

  const handleClose = () => {
    setConfirmText('');
    setDeleteType('sessions');
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (confirmText.toUpperCase() === 'SLETT') {
      onConfirm(deleteType);
      handleClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ⚠️ Slett pakkedata for periode
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Du er i ferd med å slette data fra <strong>{startDate}</strong> til <strong>{endDate}</strong>.
            </p>

            <RadioGroup value={deleteType} onValueChange={(v) => setDeleteType(v as 'sessions' | 'all')}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="sessions" id="sessions" />
                <Label htmlFor="sessions" className="cursor-pointer flex-1">
                  <div className="font-semibold">Nullstill pakkesesjoner</div>
                  <div className="text-xs text-muted-foreground">
                    Sletter kun packing_sessions og active_packing_products. 
                    Beholder ordre, kunder og produkter.
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer flex-1">
                  <div className="font-semibold text-destructive">Slett alt pakkedata inkl. ordre</div>
                  <div className="text-xs text-muted-foreground">
                    Sletter ordre, ordre-produkter, pakkesesjoner og aktive produkter. 
                    Beholder kunder og produkter.
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="confirm">Skriv "SLETT" for å bekrefte</Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="SLETT"
                className="font-mono"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Avbryt</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={confirmText.toUpperCase() !== 'SLETT' || isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Sletter...' : 'Slett pakkedata'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePackingDataDialog;
