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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface DeleteOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'date' | 'old';
  selectedDate?: string;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteOrdersDialog: React.FC<DeleteOrdersDialogProps> = ({
  open,
  onOpenChange,
  mode,
  selectedDate,
  onConfirm,
  isLoading,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (!open) {
      setConfirmText('');
      setStep(1);
    }
  }, [open]);

  const handleConfirm = () => {
    if (confirmText === 'SLETT') {
      onConfirm();
      onOpenChange(false);
    }
  };

  const getTitle = () => {
    if (mode === 'date') {
      return `Slett alle ordre for ${selectedDate}`;
    }
    return 'Slett alle gamle ordre';
  };

  const getDescription = () => {
    if (mode === 'date') {
      return `Dette vil permanent slette alle ordre og tilhørende produkter for ${selectedDate}. Denne handlingen kan ikke angres.`;
    }
    const today = new Date().toLocaleDateString('nb-NO');
    return `Dette vil permanent slette alle ordre og tilhørende produkter med leveringsdato før ${today}. Denne handlingen kan ikke angres.`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${mode === 'date' ? 'text-orange-500' : 'text-red-500'}`} />
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            {step === 1 ? (
              <div className="space-y-3">
                <p className="font-medium">{getDescription()}</p>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">Dette vil slette:</p>
                  <ul className="text-sm list-disc list-inside mt-2 space-y-1">
                    <li>Alle ordre {mode === 'date' ? 'for valgt dato' : 'før dagens dato'}</li>
                    <li>Alle tilhørende produktlinjer</li>
                    <li>All pakkestatushistorikk</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-medium text-destructive">
                  For å bekrefte slettingen, vennligst skriv <span className="font-bold">SLETT</span> i feltet under:
                </p>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Bekreftelse</Label>
                  <Input
                    id="confirm"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Skriv SLETT for å bekrefte"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Avbryt
              </Button>
              <Button
                variant={mode === 'date' ? 'default' : 'destructive'}
                onClick={() => setStep(2)}
              >
                Fortsett
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                Tilbake
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={confirmText !== 'SLETT' || isLoading}
              >
                {isLoading ? 'Sletter...' : 'Slett permanent'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOrdersDialog;
