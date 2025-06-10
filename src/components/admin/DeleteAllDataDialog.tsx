
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { useDeleteAllData } from '@/hooks/useDeleteAllData';

interface DeleteAllDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteAllDataDialog = ({ open, onOpenChange }: DeleteAllDataDialogProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState<'warning' | 'confirm'>('warning');
  const deleteAllData = useDeleteAllData();

  const handleClose = () => {
    setConfirmText('');
    setStep('warning');
    onOpenChange(false);
  };

  const handleProceed = () => {
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (confirmText === 'SLETT ALT') {
      await deleteAllData.mutateAsync();
      handleClose();
    }
  };

  const isConfirmValid = confirmText === 'SLETT ALT';

  if (step === 'warning') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Advarsel: Slett all data
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p className="font-semibold">
                Du er i ferd med å slette ALL data fra databasen!
              </p>
              <p>Dette inkluderer:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Alle ordrer og ordreprodukter</li>
                <li>Alle produkter</li>
                <li>Alle kunder</li>
                <li>Alle pakkesesjoner</li>
              </ul>
              <p className="text-destructive font-semibold">
                Denne handlingen kan IKKE angres!
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleClose}>
              Avbryt
            </Button>
            <Button variant="destructive" onClick={handleProceed}>
              Jeg forstår, fortsett
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Bekreft sletting av all data
          </DialogTitle>
          <DialogDescription>
            For å bekrefte at du virkelig vil slette all data, skriv{' '}
            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
              SLETT ALT
            </code>{' '}
            i feltet nedenfor.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="confirm-text">Bekreftelse</Label>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Skriv 'SLETT ALT' for å bekrefte"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={deleteAllData.isPending}>
              Avbryt
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={!isConfirmValid || deleteAllData.isPending}
            >
              {deleteAllData.isPending ? 'Sletter...' : 'Slett all data permanent'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAllDataDialog;
